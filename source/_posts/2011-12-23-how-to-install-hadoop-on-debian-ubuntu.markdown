---
author: admin
comments: true
date: 2011-12-23 16:19:43+00:00
layout: post
slug: how-to-install-hadoop-on-debian-ubuntu
title: 'How-To: Install Hadoop on Debian/Ubuntu'
wordpress_id: 540
categories:
- Hadoop
- How-To
tags:
- Hadoop
- HDFS
---

_UPDATE 2012-02-06_: **The native library issue has been resolved**.  You can now keep the native library installed with just a minor configuration tweak.  If you have already followed these instructions just scroll down to the core-site.xml contents and the commands to make the "/hadoop" directory on your machine.  Those two things will get you up to date.

Yesterday I passed my [Cloudera Certified Hadoop Developer (CCHD)](http://www.cloudera.com/hadoop-training/developer-training/) certification.  The four day class was great and I learned a lot about everything from the architecture of HDFS all the way to specific MapReduce algorithms and how to implement them using Hadoop.

I'm excited about implementing this in my companies as we're already using a home grown form of MapReduce for certain processes.  We chose MapReduce for ease of development as the algorithms tend to be surprisingly simple for what you get back.  This makes our system easier to debug and now with Hadoop it makes it as scalable as we can afford.

I wanted to get started with using Hadoop on our standard development environment which happens to be Debian Squeeze and not CentOS as the Cloudera course uses.  Luckily they provide a Debian package repository that makes setting up your development environment pretty simple.  This setup will _only_ be suitable for production since you'll be running a single node.  In later posts I'll start discussing how to set up a testing cluster and eventually give some tips on working with Hadoop in production but for now lets just focus on development.

The first thing you'll want to do is to edit your apt sources in /etc/apt/sources.list.  At the end of your existing configuration add the following lines:


    
    
    deb http://archive.cloudera.com/debian squeeze-cdh3 contrib
    deb-src http://archive.cloudera.com/debian squeeze-cdh3 contrib
    



Note: This configuration is specifically for a Debian Squeeze installation.  If you are using a different release like Debian Lenny or Ubuntu Karmic you'll need to change "squeeze-cdh3" to match your setup.  You can [look into the repository to get a list of valid values](http://archive.cloudera.com/debian/dists/) but usually it's just the release name followed by cdh3 (ie. "lenny-cdh3" or "karmic-cdh3").

Next add Cloudera's public key into your system by running this command (don't forget the dash on the end of the command, it is required!):


    
    
    curl -s http://archive.cloudera.com/debian/archive.key | sudo apt-key add -
    



Now you'll want to update your package lists so that your OS knows the new packages exist.  You can do this by simply running:


    
    
    sudo apt-get update
    



Now that you have an updated package list you can go about installing Hadoop.  For a standalone, single node development installation you'll need the following pieces:




	
  * Hadoop 0.20 - The core components of Hadoop (the JARs, Python scripts, documentation, etc) but no daemons

	
  * The namenode daemon - To provide access to your HDFS volume

	
  * The datanode daemon - To store your HDFS data

	
  * The jobtracker daemon - To schedule and hand out jobs

	
  * The tasktracker daemon - To poll the job tracker, and accept and run Hadoop jobs



To get all of that you'll need to run the following command:


    
    sudo apt-get install hadoop-0.20 hadoop-0.20-namenode hadoop-0.20-datanode hadoop-0.20-jobtracker hadoop-0.20-tasktracker



Now you have successfully installed Hadoop and the necessary libraries to run a single HDFS node that can run Hadoop jobs.  In single node mode you don't get any of the benefits of HDFS (block replication) and your Hadoop jobs won't run terribly fast but you'll be able to develop and test your code.

For development purposes your system is now running in standalone mode.  This means that if you run HDFS commands (ie, hadoop fs -ls) you will not be connecting to HDFS but instead you will be looking at your local file system relative to where you ran the "hadoop" command.  With this setup you can run local jobs and kick the tires so if that's all you need you're done.

I would personally recommend that you run in pseudo-distributed mode if you intend to eventually move onto a production cluster and will be involved at least in some way in its administration.  This is not to say that you'll be the administrator of the cluster but that you'll at least be one of the people called upon to figure out production problems that range from HDFS issues to failed or buggy jobs.

In pseudo-distributed mode you will really be running jobs through the entire Hadoop workflow and will be able to tell whether your jobs will run on a cluster or not.  There are still some gotchas that differ from running fully distributed vs. pseudo-distributed but if you follow best practices and defensive coding you can usually avoid them.  For example you should never depend on local state or the availability of files on the local file system.  Always read through HDFS if it's necessary and never use globals in your code that could be modified, or even accessed, between map and reduce tasks.  Now onto pseudo-distributed mode...

Cloudera has done a lot for you up to this point including applying hundreds of patches that you'll be glad you don't need to worry about but now you'll need to do some configuration.  This is intentional since you can use CDH to run anything from a development node to a production cluster.  Therefore they don't make any assumptions as to how you want the nodes configured.  Being consistent in development and production and you'll make your life a lot easier when you need to debug something as everyone will be familiar with the same layout, major/minor release number, etc.

Let's take care of the configuration steps one-by-one now.  The steps are:




	
  * Set JAVA_HOME in the hadoop-env.sh script

	
  * Configure core-site.xml

	
  * Configure hdfs-site.xml

	
  * Configure mapred-site.xml

	
  * Setup passphraseless ssh

	
  * Format the namenode



Once that is complete you can start all of the required processes and begin testing but keep reading for a walkthrough of each of these steps.

Let's make sure JAVA_HOME is set in your hadoop-env.sh script.  On Debian Squeeze this is located in /etc/hadoop-0.20/conf.empty/hadoop-env.sh.  By default JAVA_HOME is NOT set in hadoop-env.sh.  If you have it set in your profile already I would suggest copying that export line to hadoop-env.sh just in case you run the daemons later as a different user that might not have the same profile.  If you don't know what your JAVA_HOME value should be you can run this one-liner ([credits to a thread on ServerFault for this one](http://serverfault.com/questions/143786/how-to-determine-java-home-on-debian-ubuntu)):


    
    
    export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")
    



To verify that it is set run:


    
    
    export | grep JAVA_HOME
    



And then list the contents of the directory that it references.  It should contain a bin, lib, and man directory.  If so, copy the entire export line into the beginning of the hadoop-env.sh script where it has been commented out.  If they have the same JAVA_HOME specified you can just uncomment that line.  Now whomever is starting the Hadoop processes (you, the hdfs user, or root) will always have JAVA_HOME set properly.

Guidance for the next few steps was taken from the [Hadoop Quick Start's "Pseudo-Distributed Operation: Configuration" section](http://hadoop.apache.org/common/docs/r0.20.2/quickstart.html#Configuration).  Refer there for additional information.  I have just added some narrative to let you know what each of these steps does so you understand a bit more about how the system works.

Note: The XML files are owned by root and are accessible by the hadoop group.  Edit the files as root but run any commands below as the "hdfs" user.

core-site.xml (located in /etc/hadoop-0.20/conf.empty/core-site.xml on Debian Squeeze) needs to be modified to let the everyone know where the name node is running.  In our case it will be running on localhost on the default port so add this snippet of XML between the configuration tags in core-site.xml:


    
    
      <property>
        <name>fs.default.name</name>
        <value>hdfs://localhost:9000</value>
      </property>
    
      <property>
        <name>hadoop.tmp.dir</name>
        <value>/hadoop/hadoop-${user.name}</value>
      </property>
    



After adding these settings you'll need to make sure that the /hadoop base directory has been created with the proper permissions to let all users get access to it.  In production your security criteria may be different so only use this for development machines since it leaves everything pretty open!  To create the directory you'll want to do the following:


    
    
    sudo mkdir /hadoop && sudo chown hdfs:hdfs /hadoop && sudo chmod 777 /hadoop
    



Now you will have the /hadoop path created on permanent storage instead of it getting placed on tmpfs where the default values would normally place it.

hdfs-site.xml (located in /etc/hadoop-0.20/conf.empty/hdfs-site.xml on Debian Squeeze) needs to be modified to tell the HDFS daemons that we only want a replication factor of 1.  This doesn't matter so much since HDFS won't try to replicate the same block multiple times on one data node but if you start running multiple data nodes on a single development machine it will save you some disk space.  So put this snippet of XML between the configuration tags in hdfs-site.xml:


    
    
      <property>
        <name>dfs.replication</name>
        <value>1</value>
      </property>
    



mapred-site.xml (located in /etc/hadoop-0.20/conf.empty/mapred-site.xml on Debian Squeeze) needs to be modified to let everyone know where the job tracker is running.  In our case it will be running on localhost on the default port so add this snippet of XML between the configuration tags in mapred-site.xml:


    
    
      <property>
        <name>mapred.job.tracker</name>
        <value>localhost:9001</value>
      </property>
    



As root you'll need to run two commands to make sure that the rest of the config will work as the "hdfs" user.  You need to create a directory for the "hdfs" user to store its SSH credentials.  To do this run the following commands (again, as root):


    
    
    mkdir /usr/lib/hadoop-0.20/.ssh
    chown hdfs:hdfs /usr/lib/hadoop-0.20/.ssh
    



This is assuming that your hadoop directory is /usr/lib/hadoop-0.20.  To verify where it is if you aren't sure su to the "hdfs" user and run "pwd".  That will be the directory where this should be done.

Remember to run all of the steps from here as the "hdfs" user or it will not work.

Passphraseless SSH is required so that the scripts can connect to servers and start/stop services in a cluster.  To make sure you can ssh without a password localhost first try this:


    
    
    ssh localhost
    



If you are prompted for a password it has not been set up yet.  To set it up you'll need to generate a public/private key pair and then tell SSH to accept the public key as a valid login credential.  Do this by running the following commands:


    
    
    ssh-keygen -t dsa -P '' -f ~/.ssh/id_dsa
    cat ~/.ssh/id_dsa.pub >> ~/.ssh/authorized_keys
    



Try to ssh to localhost now and make sure that it works.  **_If you skip this step the host's key will not be added to the list of known hosts and the non-interactive processes will fail_**.

If the ssh-keygen command prompts you to overwrite your key **_DO NOT DO IT_**!  This will break any existing key-based SSH connections have already.  Just say no if asked to overwrite your key.  Adding an existing key to the list of authorized keys will still work.

The last configuration step is to format the name node.  This will make sure the name node has all of its data structures on disk set up properly so that it can track your HDFS data.  To do this just run the following hadoop (located in /usr/bin/hadoop on Debian Squeeze) command:


    
    
    hadoop namenode -format
    



If you are asked to reformat the filesystem you must make sure that nobody else is already running Hadoop on this machine.  If they are and you reformat the name node you will end up wiping out their data.  It is recoverable but you don't want to have to go through that as it is time consuming and not guaranteed to work.

Now that everything is set up you can start everything by running the start-all.sh (located in /usr/lib/hadoop-0.20/bin/start-all.sh on Debian Squeeze) script:


    
    
    start-all.sh
    



If you didn't see any errors you should be up and running.  Here are some things that we should verify to make sure that everything works as expected:




	
  * Run "jps" and verify all of the processes are there

	
  * Test the name node's web GUI

	
  * Test the job tracker's web GUI

	
  * Test HDFS

	
  * Run a Hadoop MapReduce example



When you run "jps" you should get a list of processes including "TaskTracker", "JobTracker", "SecondaryNameNode", "DataNode", and "NameNode".  If any of these are missing check the log directory.  On my first run the name node failed to come up and it was because I had manually created the /tmp/hadoop-hdfs/dfs/name directory when doing some earlier testing.  After that the name node format failed silently.  If you get an exception that reads "java.io.IOException: NameNode is not formatted." you should run stop-all.sh, then remove the /tmp/hadoop-hdfs directory (again, make sure nobody else is running Hadoop on your machine!), and then reformat the name node and restart the processes with start-all.sh.

Now that all of the processes are running check that the [job tracker web GUI](http://localhost:50030) and the [name node web GUI](http://localhost:50070) are running.  If both of those links bring up web pages without errors then they are both running properly.

Let's test HDFS with some simple commands.  You should still be the "hdfs" user for this.  Don't change back to your regular user account yet.  First, list the files on the HDFS volume with this command:


    
    
    hadoop fs -ls
    



When you first run this you should get an error that reads "ls: Cannot access .: No such file or directory.".  That's OK.  Let's put a file there any make sure that it works.  Generate a file full of random data with this command:


    
    
    head -c 1048576 /dev/urandom > /tmp/random.txt
    hadoop fs -put /tmp/random.txt random.txt
    



If those commands give you errors try [disabling HDFS permissions](http://blog.timmattison.com/archives/2011/12/26/how-to-disable-hdfs-permissions-for-hadoop-development/), then stop and restart everything with the stop-all.sh, and start-all.sh scripts.  Then come back here and try again.

Now list the files again as you did above and you should see a 1 MB file called random.txt.  Verify that the input file and the output file match by comparing their sha1sums:


    
    
    sha1sum /tmp/random.txt
    hadoop fs -cat random.txt | sha1sum
    



You should get two hex strings on separate lines that match.  You can ignore the filename portion of the result since one run is taking the data from the local filesystem and the other is reading the data from HDFS and piping it to sha1sum.

Finally, let's run a MapReduce job.  There are a few example jobs included with the default installation and the simplest one is grep.  We'll need to build a file that we want to grep, put it on HDFS, run the job, and compare the results to running a non-MapReduce grep on it.

I wanted to build a file that was bigger than a single tiny text file I ran the following command (still as the "hdfs" user):


    
    
    find /etc -exec cat {} \; | strings > /tmp/etc-dir.txt
    



This reads all of the files in the /etc directory, extracts everything that looks like a string so we don't end up with a binary mess, and puts it in the /tmp/etc-dir.txt.  I then put that file onto HDFS:


    
    
    hadoop fs -put /tmp/etc-dir.txt etc-dir.txt
    



Then I ran a MapReduce job that returns the number of occurrences of the string "localhost" in the file:


    
    
    cd /usr/lib/hadoop-0.20
    hadoop jar hadoop-*-examples.jar grep etc-dir.txt etc-dir-results localhost
    



And I compared that to counting the occurrences with grep:


    
    
    hadoop fs -cat etc-dir-results/part-00000
    grep localhost /tmp/etc-dir.txt | wc -l
    



To verify that it worked I should see two lines of text that both start with the same number.  The first line will contain the string "localhost" on the end of it, the second one will not.

If you got this far you've now got a working Hadoop developer setup.  If not, post in the comments and I'll try to help out and update the tutorial with more information.  Good luck!  Hadoop is an exciting tool with lots of applications that I'll explore in future posts.

If you're going to get serious with it look into getting a CCHD certification.  With it you'll skip a few very hard months of work on your own in just four days and you'll come out of it with a sound understanding of HDFS, the MapReduce process, and get a lot of good tips on what you should and shouldn't do.  The instructors are very knowledgeable, have a large support network to answer your domain specific questions, and it can be a great networking opportunity.  If you have questions about the course post them in the comments too.

Update: Having trouble with permissions?  Check this other short article on [how to disable permissions for a development machine](http://blog.timmattison.com/archives/2011/12/26/how-to-disable-hdfs-permissions-for-hadoop-development/).
