---
author: admin
comments: true
date: 2009-10-29 02:11:26+00:00
layout: post
slug: how-to-fix-the-cannot-find-luuid-error-on-gentoo
title: 'How-To: Fix the "cannot find -luuid" error on Gentoo'
wordpress_id: 208
categories:
- How-To
tags:
- Gentoo
- Linux
- sysadmin
---

Recently the Gentoo project deprecated lots of system profiles.  What this meant for me what that I needed to do nearly an entire system rebuild with my usual "emerge --update --deep --newuuse -av world" magic.  After churning through about 200 of the 400+ ports that needed to be rebuilt my system started getting weird.  Notably mount/umount stopped working, and the emerge failed.  The error message I got after a bit of digging was that Gentoo "cannot find -luuid".  Running mount or umount (and probably other e2fsprogs utilities) gave me the error "error while loading shared libraries: libblkid.so.1: cannot open shared object file: No such file or directory".

When you get an error like this it's time to act fast since a power outage or a reboot can really hose the system.  I've had it happen before and it's not pretty.  In this case you need to re-emerge e2fsprogs and util-linux.  I simply did this:

    
    emerge --update --deep --newuse -av e2fsprogs


That re-emerged both packages for me.  If it doesn't show that it will re-emerge both then you're best off doing this:

    
    emerge --update --deep --newuse -av util-linux e2fsprogs


After doing that you should have neither "cannot find -luuid" nor "error while loading shared libraries: libblkid.so.1: cannot open shared object file: No such file or directory" problems.  If you're extra paranoid like me you should also re-emerge dbus and then do a revdep-rebuild

    
    emerge --update --deep --newuse -av dbus
    revdep-rebuild


If you don't have revdep-rebuild installed you can install it by running

    
    emerge gentoolkit


dbus tells you that you must run revdep-rebuild after emerging it and restart dbus.  Listen to it, it's not kidding.
