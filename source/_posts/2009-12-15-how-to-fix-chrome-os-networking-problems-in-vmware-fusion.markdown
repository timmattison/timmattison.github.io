---
author: admin
comments: true
date: 2009-12-15 12:54:00+00:00
layout: post
slug: how-to-fix-chrome-os-networking-problems-in-vmware-fusion
title: 'How-To: Fix Chrome OS networking problems in VMware Fusion'
wordpress_id: 231
categories:
- How-To
tags:
- VMware
---

gdgt has [released a VMware image for Chrome OS](http://gdgt.com/google/chrome-os/download/) this week.  It works on all versions of VMware (not sure about ESX though), Virtual Box, and Parallels.  When I started it up in VMware Fusion I kept getting the message "Network not connected and offline login fail".

The instructions explicitly say to switch from NAT to bridged but some users have found that it actually does work just fine with NAT.  In my case it still didn't work with either.  [Luckily someone on the forums let us in on the secret](http://discuss.gdgt.com/google/chrome-os/general/Download-Chrome-OS-VMWare-image/page/2/) that you actually don't need a Google account at all to use this build.

If you want to try Chrome OS and you're having networking problems or you don't have a Google account just sign in as "chronos@gmail.com" (you can just type "chronos" and the OS will add "@gmail.com") with no password.  You'll be brought straight into the OS without having to sign into Google first.

Surprisingly, after doing that the networking system came to life and I could log into GMail and check other sites.  If you're hung up on getting past the initial login screen definitely try the "chronos" account and let me know if it works for you.
