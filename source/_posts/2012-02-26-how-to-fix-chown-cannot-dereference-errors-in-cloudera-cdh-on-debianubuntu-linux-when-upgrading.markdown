---
author: admin
comments: true
date: 2012-02-26 17:10:47+00:00
layout: post
slug: how-to-fix-chown-cannot-dereference-errors-in-cloudera-cdh-on-debianubuntu-linux-when-upgrading
title: 'How-To: Fix "chown: cannot dereference" errors in Cloudera CDH on Debian/Ubuntu
  Linux when upgrading'
wordpress_id: 695
---

**_WARNING!_** Do not do this on production clusters unless you are willing to take responsibility for any issues that may occur.  This wipes out all of your logs and potentially other files.  Always have a backup before trying anything like this.  I take no responsibility for issues that may arise from running any or all of these instructions.

When I tried to upgrade my CDH installation today I received many errors from dpkg that caused the upgrade to fail.  The errors looked like this:


    
    
    chown: cannot dereference `/var/log/hadoop-0.20/userlogs/job_201202031049_0008/attempt_201202031049_0008_m_000015_0': No such file or directory
    chown: cannot dereference `/var/log/hadoop-0.20/userlogs/job_201202031049_0008/attempt_201202031049_0008_m_000003_0': No such file or directory
    chown: cannot dereference `/var/log/hadoop-0.20/userlogs/job_201202031049_0008/attempt_201202031049_0008_m_000009_0': No such file or directory
    chown: cannot dereference `/var/log/hadoop-0.20/userlogs/job_201202031049_0008/attempt_201202031049_0008_m_000018_0': No such file or directory
    
    ...
    
    dpkg: error processing hadoop-0.20 (--configure):
     subprocess installed post-installation script returned error exit status 123
    dpkg: dependency problems prevent configuration of hadoop-0.20-tasktracker:
     hadoop-0.20-tasktracker depends on hadoop-0.20 (= 0.20.2+923.195-1~squeeze-cdh3); however:
      Package hadoop-0.20 is not configured yet.
    



My simple fix, not for production clusters, is to do the following:




	
  * Step 1: Become the HDFS user and stop Hadoop by running 
    
    ~/bin/stop-all.sh


	
  * Step 2: Become root and remove all of your Hadoop related logs by running 
    
    rm -rf /var/log/hadoop-0.20/*


	
  * Step 3: Become root and run your upgrade by running 
    
    apt-get upgrade


	
  * Step 4: Become the HDFS user and restart Hadoop by running 
    
    ~/bin/start-all.sh




After that your installation should be working and up to date again.  Post in the comments if it works for your or if you need any assistance.
