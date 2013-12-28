---
author: admin
comments: true
date: 2009-11-03 23:59:59+00:00
layout: post
slug: tip-get-vmware-workstation-6-5-3-working-on-gentoo
title: 'Tip: Get VMware Workstation 6.5.3 working on Gentoo'
wordpress_id: 215
categories:
- Tips
tags:
- Gentoo
- sysadmin
- VMware
---

The final piece to my reinstall was to get VMware Workstation 6.5.3 running so I could use my nice Linux box (8GB RAM, fast RAID configuration) to run virtual machines instead of running them on my much less powerful MacBook Pro.

To do this installation you need to download the files from VMware directly, move them into portage, then do the installation from a real console (SSH or screen sessions won't cut it).  That was no problem but I ended up staring at a message like this

    
    process XXXXX: Attempt to remove filter function 0xXXXXXXXX user data 0x88162a8, but no such filter has been added
      D-Bus not built with -rdynamic so unable to print a backtrace


I tried to re-emerge dbus with that option but there are no USE flags that correspond to it that I could see.  I checked if D-Bus was even running and it was.  At this point I randomly and luckily found the fix.  All you need to do is to stop D-Bus via

    
    /etc/init.d/dbus stop


As soon as I did that VMware started up, asked me to accept the EULA, and I was straight back on the virtualization track.

Note: While stopping DBus will get VMware to start you'll still need to do two last things to make everything happy

Step 1: Run

    
    /etc/init.d/vmware start


Step 2: Run

    
    rc-update add vmware default


This makes sure that VMware creates all the device nodes that it needs, loads all of the modules for virtual networking, monitoring, etc., and that this will always come up after a reboot.  Without this you can end up chasing down some seriously weird error messages.
