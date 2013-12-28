---
author: admin
comments: true
date: 2011-06-16 02:42:36+00:00
layout: post
slug: how-to-improve-your-duplicity-backup-and-restore-times-on-rackspace-cloud-files
title: 'How-To: Improve your duplicity backup and restore times on Rackspace Cloud
  Files'
wordpress_id: 417
categories:
- How-To
tags:
- backup
- Rackspace
- sysadmin
---

Using duplicity and backing up a Rackspace Cloud Server to Cloud Files is great.  The bandwidth is free (if you don't forget to enable service net), storage is relatively cheap, and duplicity offers lots of great options to tune the tradeoffs between disk space/bandwidth and storage.

One thing you will notice though is that if Rackspace Cloud Files ever times out you will end up waiting, and waiting, and waiting for it to retry.  The command line "--timeout" option doesn't fix it either since the timeout is actually hard coded in the python-cloudfiles module.  By default this timeout is 30 seconds.  Want to get better backup and restore performance?  Follow these steps to reduce the delay to one second and you'll be a lot happier.  Note: These instructions assume you already have everything installed and configured to do duplicity backups to Cloud Files already.



	
  * Step 1: Locate the cloudfilesbackend.py file that your system uses.  Mine was in /usr/lib64/python2.4/site-packages/duplicity/backends/cloudfilesbackend.py so you will need to replace this path with the proper one in all of the following commands.

	
  * Step 2: Run sed to replace the calls to "time.sleep(30)" with "time.sleep(1)" like this:

    
    sed -i s/time.sleep\(30\)/time.sleep\(1\)/g /usr/lib64/python2.4/site-packages/duplicity/backends/cloudfilesbackend.py




	
  * Step 3: Remove the pre-compiled version of the existing Python code like this:

    
    rm /usr/lib64/python2.4/site-packages/duplicity/backends/cloudfilesbackend.pyc




	
  * Step 4: Adjust your duplicity backup and restore code to include two updated options.  First, add "--timeout=1" just to be double-extra sure that all timeouts are 1 second long.  Second, add "--num-retries=30" so that the script retries for 30 seconds if necessary.  If you don't add the second option you will run the risk of possibly failing to do a restore when there is a legitimate connectivity issue.  The default options with the changes from step 2 would only allow for a 5 second hiccup in network traffic so definitely don't forget to do this.


That's it.  I've personally seen my restore times decrease dramatically by doing this simple change.  Initially I wasn't even able to sync the duplicity information in 30 minutes and now I am doing full restores in under 25 minutes.  Had I left the settings the way they were I estimate that I would've spent between 6 and 12 hours on a restore.

UPDATE: The issue and fix here is entirely with the duplicity code, not python-cloudfiles.  Sorry for any confusion that may have caused.
