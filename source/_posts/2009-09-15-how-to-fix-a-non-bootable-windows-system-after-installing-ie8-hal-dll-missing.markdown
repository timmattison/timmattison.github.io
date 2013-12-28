---
author: admin
comments: true
date: 2009-09-15 15:17:54+00:00
layout: post
slug: how-to-fix-a-non-bootable-windows-system-after-installing-ie8-hal-dll-missing
title: 'How-To: Fix a non-bootable Windows system after installing IE8 (hal.dll missing)'
wordpress_id: 199
categories:
- How-To
tags:
- sysadmin
- Windows
---

This is a weird post.  My father has an Acer Aspire One netbook and I updated his system recently to IE8.  After the update I ran IE8 made sure it worked and then packed up and went home.  A few days later he tells me that his computer doesn't even boot anymore.  To make a long story short I spent about 4 hours looking around trying to figure out what could've gone wrong and I finally nailed it...

If you have the Ask.com toolbar installed and upgrade to Internet Explorer 8 your computer will delete your boot.ini file every time it starts up. The solution is a bit tricky.  Normally you don't need a boot.ini if your Windows installation is in the default location (first partition on the first drive and in the \WINDOWS directory).  Acer has some kind of weird configuration that makes Windows fail with the troubling black screen that says something to the effect of "hal.dll is missing".  The netbook also doesn't have a CD-ROM drive and doesn't want to boot off of the USB devices I had so here's what I did.

Step 1: Install Ubuntu on an external hard drive.  This sounds like a big step but it's actually not as bad as you'd think.

Step 2: Hook the external drive up to your broken computer.

Step 3: Boot off of the external hard drive (usually hit F12 a few times when the computer is starting up and select external or USB hard drive).

Step 4: Get into the terminal (https://help.ubuntu.com/community/UsingTheTerminal).

Step 5: Execute the following commands...

    
    sudo mkdir -p /mnt/sda1 /mnt/sda2 /mnt/sdb1 /mnt/sdb2
    sudo mount /dev/sda1 /mnt/sda1
    sudo mount /dev/sda2 /mnt/sda2
    sudo mount /dev/sdb1 /mnt/sdb1
    sudo mount /dev/sdb2 /mnt/sdb2
    find /mnt/sd* -name "WINDOWS"


Step 6: You should see something like /mnt/sda2/WINDOWS in the list of files spit out by find.  It may be /mnt/sda1, /mnt/sdb2, etc.  Whatever mount point shows up is your Windows drive.  Assuming it's "/mnt/sda2" do the following:

    
    nano /mnt/sda2/boot.ini


And now paste this into the editor and save it:

    
    [boot loader]
    timeout=30
    default=multi(0)disk(0)rdisk(0)partition(2)\WINDOWS



    
    [operating systems]
    multi(0)disk(0)rdisk(0)partition(2)\WINDOWS="Microsoft Windows XP" /fastdetect


Notice that there are two parts in there that say "partition(2)".  If Windows is on /mnt/sda2 or /mnt/sdb2 then use "partition(2)".  If it's on /mnt/sda1 or /mnt/sdb1 then use "partition(1)".

Now you're almost finished.  Reboot the computer, remove the external drive, and you should be boot back into Windows right away.  Make sure you uninstall the Ask.com toolbar and then, unfortunately, you may have to reboot and do this procedure again.  Try rebooting without the external drive again and see if you can get into Windows.  If you can, you're golden.  If you can't, you'll need to repeat the procedure one last time to completely fix the issue.
