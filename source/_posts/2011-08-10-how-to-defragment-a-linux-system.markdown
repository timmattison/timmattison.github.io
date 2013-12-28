---
author: admin
comments: true
date: 2011-08-10 14:27:46+00:00
layout: post
slug: how-to-defragment-a-linux-system
title: 'How-To: Defragment a Linux system'
wordpress_id: 523
categories:
- How-To
tags:
- Linux
---

Many people claim that Linux, Unix, and Mac OS do not need to be defragmented.  This is simply not true.  [OSXBook explains that Apple's file systems fragment](http://osxbook.com/software/hfsdebug/fragmentation.html) and ext3 does as well.  To put it simply there are no file systems that I know of that do not fragment.  Even Apple's automatic defragmentation (why would it be there if it didn't fragment in the first place?) has limitations that cause file fragments to accumulate over time.  The value of defragmentation may be questionable to some but in my own informal tests I've seen the read speeds on large sequential files like virtual machine snapshots double after defragmentation.

Anyway, my Linux machines were seeming sluggish lately and I decided to figure out how to install [Shake](http://vleu.net/shake/) to remedy the problem.  The installation isn't bad but I've already figured it out for you so just follow these steps to get yourself set up:



	
  1. Add these lines to your /etc/apt/sources.list:

    
    deb http://ppa.launchpad.net/un-brice/ppa/ubuntu maverick main
    deb-src http://ppa.launchpad.net/un-brice/ppa/ubuntu maverick main




	
  2. Run this command to add the author's key to your apt configuration:

    
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E2235DBB




	
  3. Update your apt database:

    
    sudo apt-get update




	
  4. Install shake-fs:

    
    sudo apt-get install shake-fs




	
  5. Get a baseline of your existing fragmentation on the entire filesystem:

    
    sudo shake -pvv / | awk '{ printf("%06d,%s\n", $4, $8) }' | sort > shake.full-output.before




Now you can look at the output in shake.full-output.before and see where you have fragmentation problems.  If you just want to run the defrag on the whole disk and include every file regardless of age and size do this:


    
    sudo shake --old=0 --bigsize=0 -X /



This will take a decent amount of time and will really sap the machine's performance.  Don't do this until you have a window of time where you can afford to not use the machine.

Finally, compare your before and after:


    
    sudo shake -pvv / | awk '{ printf("%06d,%s\n", $4, $8) }' | sort > shake.full-output.after
    tail shake.full-output.*



Hopefully now the worst offenders at the bottom of the after file will be a bit more tidy.
