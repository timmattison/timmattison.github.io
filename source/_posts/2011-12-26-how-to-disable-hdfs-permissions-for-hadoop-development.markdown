---
author: admin
comments: true
date: 2011-12-26 16:47:35+00:00
layout: post
slug: how-to-disable-hdfs-permissions-for-hadoop-development
title: 'How-To: Disable HDFS permissions for Hadoop development'
wordpress_id: 570
categories:
- Hadoop
- How-To
tags:
- Hadoop
- HDFS
---

If you've [set up Hadoop for development](http://blog.timmattison.com/archives/2011/12/23/how-to-install-hadoop-on-debian-ubuntu/) you may be wondering why you can't read or write files or create MapReduce jobs then you're probably missing a tiny bit of configuration.  For most development systems in pseudo-distributed mode it's easiest to disable permissions altogether.  This means that any user, not just the "hdfs" user, can do anything they want to HDFS so do not do this in production unless you have a very good reason.

The error message you're most likely seeing if permissions are the problem is similar to this:

`
put: org.apache.hadoop.security.AccessControlException: Permission denied: user=tim, access=WRITE, inode="/user":hdfs:supergroup:drwxr-xr-x
`

If that's the case and you really want to disable permissions just add this snippet into your hdfs-site.xml file (located in /etc/hadoop-0.20/conf.empty/hdfs-site.xml on Debian Squeeze) in the configuration section:


    
    
      <property>
        <name>dfs.permissions</name>
        <value>false</value>
      </property>
    



Then restart Hadoop (su to the "hdfs" user and run bin/stop-all.sh then bin/start-all.sh) and try putting a file again.  You should now be able to read/write with no restrictions.

Good luck!  Post in the comments if it doesn't work for you.
