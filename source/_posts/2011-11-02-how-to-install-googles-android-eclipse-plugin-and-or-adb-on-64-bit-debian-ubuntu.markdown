---
author: admin
comments: true
date: 2011-11-02 13:00:48+00:00
layout: post
slug: how-to-install-googles-android-eclipse-plugin-and-or-adb-on-64-bit-debian-ubuntu
title: 'How-To: Install Google''s Android Eclipse plugin (and/or adb) on 64-bit Debian/Ubuntu'
wordpress_id: 534
categories:
- How-To
tags:
- Android
- Debian
- Eclipse
- Ubuntu
---

Today I had to reinstall the Android plugin on my system and I recently upgraded to a 64-bit development VM.  To my surprise the installation didn't go smoothly at all.  After restarting Eclipse twice I was constantly presented with two error messages "Failed to parse the output of 'adb version'" and "adb: error while loading shared libraries: libncurses.so.5: cannot open shared object file: No such file or directory".  Your system may also present another error message that reads "adb: error while loading shared libraries: libstdc++.so.6: cannot open shared object file: No such file or directory".

I could see that it was looking for libncurses.so.5 however I know that ncurses is already installed on my machine in /lib as /lib/libncurses.so.5.  So where exactly was Eclipse/adb looking for it?  It turns out that it wants to find its libraries in the /lib32 directory but you can't just symlink it or you'll get an error that reads "wrong ELF class: ELFCLASS64".  adb needs to have the 32-bit versions installed or it won't function at all.

So to get up and running just run the following command to fix the issue:


    
    sudo apt-get install lib32ncurses5 lib32stdc++6



After that just restart Eclipse and the issue should be fully put to bed.  Let me know how it works out for you or if you run into trouble.

If you still run into trouble like an error message that reads "aapt: error while loading shared libraries: libz.so.1: cannot open shared object file: No such file or directory" you need to install the ia32-libs like this:


    
    sudo apt-get install ia32-libs



Then rebuild your project and the errors should be gone.

UPDATE 2012-02-14: Rortian reports that the following command words on Fedora 16: 
    
    yum install ncurses-libs.i686 libstdc++.i686 libgcc.i686
