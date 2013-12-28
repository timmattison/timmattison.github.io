---
author: admin
comments: true
date: 2009-12-07 23:59:59+00:00
layout: post
slug: tip-monitor-networked-devices-aurally-with-ping-on-mac-os-and-linux
title: 'Tip: Monitor networked devices aurally with ping on Mac OS and Linux'
wordpress_id: 230
categories:
- Tips
tags:
- Linux
- Mac OS
- sysadmin
---

I work with embedded Ethernet devices a lot and I need to monitor them to know exactly when they restart or if they go down during testing.  I used to do it with ping sitting on an external monitor and just glance up at it every few minutes to see what's happening.  This is a less than optimal solution since it requires me to constantly be distracted by a stream of information, it eats up screen real estate, and it forces me to keep an electron inhaling LCD panel running.

I just discovered that the standard ping utility in Linux and Mac OS has a neat feature to alleviate this pain.  It will output an audible bell on every packet either received (showing a device is online) or missed (showing a device is offline). It's your choice which one you use, of course.  Personally, I have only needed the offline alert since I just need to be able to get into devices to see what they're doing immediately after a planned restart.

To get audible notification for every packet missed do this:

    
    ping -A hostname


To get audible notification for every packet received do this:

    
    ping -a hostname


Now you can work without distraction until you hear those [BEL](http://en.wikipedia.org/wiki/Bell_character)s.
