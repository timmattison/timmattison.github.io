---
author: admin
comments: true
date: 2012-03-21 23:09:48+00:00
layout: post
slug: tip-handle-failed-tasks-throwing-enoent-errors-in-hadoop
title: 'Tip: Handle failed tasks throwing "ENOENT" errors in Hadoop'
wordpress_id: 713
categories:
- How-To
- Tips
---

Today when I tried to run a new Hadoop job I got the following error:


    
         [exec] 12/03/21 22:51:47 INFO mapred.JobClient: Task Id : attempt_201203212250_0001_m_000002_1, Status : FAILED
         [exec] Error initializing attempt_201203212250_0001_m_000002_1:
         [exec] ENOENT: No such file or directory
         [exec] 	at org.apache.hadoop.io.nativeio.NativeIO.chmod(Native Method)
         [exec] 	at org.apache.hadoop.fs.RawLocalFileSystem.setPermission(RawLocalFileSystem.java:521)
         [exec] 	at org.apache.hadoop.fs.RawLocalFileSystem.mkdirs(RawLocalFileSystem.java:344)
         [exec] 	at org.apache.hadoop.mapred.JobLocalizer.initializeJobLogDir(JobLocalizer.java:240)
         [exec] 	at org.apache.hadoop.mapred.DefaultTaskController.initializeJob(DefaultTaskController.java:216)
         [exec] 	at org.apache.hadoop.mapred.TaskTracker$4.run(TaskTracker.java:1352)
         [exec] 	at java.security.AccessController.doPrivileged(Native Method)
         [exec] 	at javax.security.auth.Subject.doAs(Subject.java:416)
         [exec] 	at org.apache.hadoop.security.UserGroupInformation.doAs(UserGroupInformation.java:1157)
         [exec] 	at org.apache.hadoop.mapred.TaskTracker.initializeJob(TaskTracker.java:1327)
         [exec] 	at org.apache.hadoop.mapred.TaskTracker.localizeJob(TaskTracker.java:1242)
         [exec] 	at org.apache.hadoop.mapred.TaskTracker.startNewTask(TaskTracker.java:2541)
         [exec] 	at org.apac
    



It wasn't immediately apparent to me what file wasn't found from the error messages so I checked the logs, the JobTracker, my code, ran some known good jobs that also failed, basically everything I could think of.  It turns out that due to me accidentally running a script as "root" (don't worry, it was only on my desktop) that the permissions of several files in the hdfs user's home directory had changed ownership to "root".  Because of that Hadoop was unable to create files in the /usr/lib/hadoop-0.20 directory.

NOTE: These steps assume you are using Hadoop 0.20.  Adjust the paths in the commands accordingly if you aren't.

If you want a quick fix try these steps (only if you take full responsibility for anything that may go wrong):



	
  1. Stop Hadoop using the stop-all.sh script as the hdfs user

	
  2. su to the hdfs user

	
  3. Run this: 
    
    chown -R hdfs:hdfs /usr/lib/hadoop-0.20 /var/*/hadoop-0.20


	
  4. Restart Hadoop using the start-all.sh script as the hdfs user



Now your jobs should start running again.  Post in the comments if this procedure works for you or if you need any help.
