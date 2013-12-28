---
author: admin
comments: true
date: 2012-02-07 16:16:19+00:00
layout: post
slug: tip-fix-noclassdeffounderror-on-orgapachehadoopthirdpartyguavacommoncollectlinkedlistmultimap
title: 'Tip: Fix NoClassDefFoundError on org/apache/hadoop/thirdparty/guava/common/collect/LinkedListMultimap'
wordpress_id: 678
categories:
- Tips
---

If you're writing code that accesses HDFS and you get an exception that looks like this:


    
    
    Exception in thread "main" java.lang.NoClassDefFoundError: org/apache/hadoop/thirdparty/guava/common/collect/LinkedListMultimap
    	at org.apache.hadoop.hdfs.SocketCache.<init>(SocketCache.java:48)
    	at org.apache.hadoop.hdfs.DFSClient.<init>(DFSClient.java:240)
    	at org.apache.hadoop.hdfs.DFSClient.<init>(DFSClient.java:208)
    	at org.apache.hadoop.hdfs.DistributedFileSystem.initialize(DistributedFileSystem.java:89)
    	at org.apache.hadoop.fs.FileSystem.createFileSystem(FileSystem.java:1563)
    	at org.apache.hadoop.fs.FileSystem.access$200(FileSystem.java:67)
    	at org.apache.hadoop.fs.FileSystem$Cache.getInternal(FileSystem.java:1597)
    	at org.apache.hadoop.fs.FileSystem$Cache.get(FileSystem.java:1579)
    	at org.apache.hadoop.fs.FileSystem.get(FileSystem.java:228)
    	at org.apache.hadoop.fs.FileSystem.get(FileSystem.java:111)
    



Make sure you include the guava-r09-jarjar.jar JAR in your build path.  This is usually located in /usr/lib/hadoop-0.20/lib.
