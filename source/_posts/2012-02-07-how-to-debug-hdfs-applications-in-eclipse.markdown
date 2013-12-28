---
author: admin
comments: true
date: 2012-02-07 15:56:58+00:00
layout: post
slug: how-to-debug-hdfs-applications-in-eclipse
title: 'How-To: Debug HDFS applications in Eclipse'
wordpress_id: 675
categories:
- Hadoop
- How-To
tags:
- debug
- Eclipse
- Hadoop
- HDFS
---

I started using the HDFS API in Java recently in order to port some legacy applications over to HDFS.  One thing that I noticed is that when running the application via "hadoop jar" it properly accessed HDFS and stored its files there but if I ran it in the debugger the API calls succeeded but the files never showed up.

After a bit more investigation I saw that the HDFS API was unable to read my configuration files and find the NameNode so it defaulted to writing the files on the local file system instead.  This is nice behavior for debugging sometimes but can be dangerous if you're running an application that must put its files in HDFS like a mission critical application that doesn't fulfill its operational contract if data is lost.  In the case of an application like that accidentally writing to the local file system could be disastrous and expensive so it's good to know how to detect when this happens, and/or overcome it in a situation where you're trying to debug against your HDFS cluster.

Let's look at a simple code snippet that connects to HDFS that is just a cleaned up version of [Yahoo's Hadoop tutorial](http://developer.yahoo.com/hadoop/tutorial/module2.html#programmatically):


    
    
    import java.io.IOException;
    
    import org.apache.hadoop.conf.Configuration;
    import org.apache.hadoop.fs.FSDataInputStream;
    import org.apache.hadoop.fs.FSDataOutputStream;
    import org.apache.hadoop.fs.FileSystem;
    import org.apache.hadoop.fs.Path;
    
    public class TestClass {
    	private static final String theFilename = "timmattison.txt";
    	private static final String message = "This is the message that gets put into the file";
    
    	public static void main(String[] args) {
    		try {
    			// Get the configuration and connect to the file system
    			Configuration conf = new Configuration();
    			FileSystem fs = FileSystem.get(conf);
    
    			// Create the path object for our output file
    			Path filenamePath = new Path(theFilename);
    
    			// Does it exist already?
    			if (fs.exists(filenamePath)) {
    				// Yes, remove it first
    				fs.delete(filenamePath);
    			}
    
    			// Create the output file and write the data into it
    			FSDataOutputStream out = fs.create(filenamePath);
    			out.writeUTF(message);
    			out.close();
    
    			// Open the output file as an input file and read it
    			FSDataInputStream in = fs.open(filenamePath);
    			String messageIn = in.readUTF();
    
    			// Print its contents and close the file
    			System.out.print(messageIn);
    			in.close();
    		} catch (IOException ioe) {
    			System.err.println("IOException during operation: "
    					+ ioe.toString());
    			System.exit(1);
    		}
    	}
    }
    



If you run this code with "hadoop jar" you'll see that it creates the expected file (timmattison.txt) in the current user's default path in HDFS.  If you run this code with Eclipse either in Run or Debug mode you'll see that the file is not created in HDFS, it is created relative to where Eclipse starts the JVM for the new process.

We can tell where the HDFS library will attempt to write our files by very simply checking the type of the FileSystem object that is created by the call to `FileSystem.get(conf)`.  If that object's type is [LocalFileSystem](http://hadoop.apache.org/common/docs/current/api/org/apache/hadoop/fs/LocalFileSystem.html) we are not connecting to HDFS.  However if that object's type is [DistributedFileSystem](http://hadoop.apache.org/hdfs/docs/current/api/org/apache/hadoop/hdfs/DistributedFileSystem.html) then you know that you're connected to a Hadoop cluster and writing to a real instance of HDFS.

In your code you can leverage this in a few ways.  First, if you always need to be sure you're writing to the cluster you can check the fs variable and see if it is an instance of LocalFileSystem.  If it is you can signal an error, e-mail an admin, etc.  Configuration changes in the field could cause this to happen so it is important to be aware of.  In general running programs through "hadoop jar" will make sure this doesn't happen but a little [defensive programming](http://en.wikipedia.org/wiki/Defensive_programming) usually can't hurt.  Just consider what the cost of running your code against the wrong file system would be and trap this condition accordingly.

If you're interested in handling this automatically in your development environment I've come up with a simple pattern that works for me.  In some instances such as running your code outside of Eclipse without "hadoop jar" this pattern could fail so only use it specifically for debugging in Eclipse.  Here's what I do:


    
    
    import java.io.IOException;
    
    import org.apache.hadoop.conf.Configuration;
    import org.apache.hadoop.fs.FileSystem;
    import org.apache.hadoop.fs.LocalFileSystem;
    
    public class TestClass {
    	private static final String CORE_SITE_NAME = "core-site.xml";
    	private static final String CORE_SITE_LOCATION = "/etc/hadoop-0.20/conf.empty/"
    			+ CORE_SITE_NAME;
    	private static final String LOCAL_SEARCH_PATH = "bin/";
    	private static final String LOCAL_CORE_SITE_LOCATION = LOCAL_SEARCH_PATH
    			+ CORE_SITE_NAME;
    
    	private static boolean updatedConfiguration = false;
    
    	public static void main(String[] args) throws IOException {
    		try {
    			// Get the configuration and connect to the file system
    			Configuration conf = new Configuration();
    			FileSystem fs = FileSystem.get(conf);
    
    			// Is this the local file system?
    			if (fs instanceof LocalFileSystem) {
    				// Yes, we need to do use the cluster. Update the configuration.
    				updatedConfiguration = true;
    
    				/**
    				 * Remove the file if it already exists. Just in case this is a
    				 * symlink or something.
    				 */
    				removeTemporaryConfigurationFile();
    
    				// Copy the core-site.xml file to where our JVM can see it
    				copyConfigurationToTemporaryLocation();
    
    				// Recreate the configuration object
    				conf = new Configuration();
    
    				// Get a new file system object
    				fs = FileSystem.get(conf);
    
    				// Is this the local file system?
    				if (fs instanceof LocalFileSystem) {
    					// Yes, give up. We cannot connect to the cluster.
    					System.err.println("Failed to connect to the cluster.");
    					System.exit(2);
    				}
    			}
    
    			// Do your HDFS related work here...
    		} catch (IOException ioe) {
    			// An IOException occurred, give up
    			System.err.println("IOException during operation: "
    					+ ioe.toString());
    			System.exit(1);
    		} finally {
    			// Did we update the configuration?
    			if (updatedConfiguration) {
    				// Yes, clean up the temporary configuration file
    				removeTemporaryConfigurationFile();
    			}
    		}
    	}
    
    	private static void copyConfigurationToTemporaryLocation()
    			throws IOException {
    		Runtime.getRuntime().exec(
    				new String[] { "cp", CORE_SITE_LOCATION,
    						LOCAL_CORE_SITE_LOCATION });
    	}
    
    	private static void removeTemporaryConfigurationFile() throws IOException {
    		Runtime.getRuntime().exec(
    				new String[] { "rm", LOCAL_CORE_SITE_LOCATION });
    	}
    }
    



Now where it says "Do your HDFS related work here..." you can put your code and be sure that it's accessing the cluster, not your local file system.

In a future article and on github I'll wrap this up in a reusable chunk so that you won't have to copy and paste this every time you start a new project.
