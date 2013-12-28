---
author: admin
comments: true
date: 2009-11-24 12:12:28+00:00
layout: post
slug: how-to-disable-screen-blanking-in-x-on-gentoo-and-other-distros
title: 'How-To: Disable screen blanking in X on Gentoo (and other distros)'
wordpress_id: 226
categories:
- How-To
tags:
- Gentoo
- Linux
- sysadmin
- X
---

Even though I have a nice dual monitor setup in my office I tend to use my laptop for almost everything.  The dual monitor system ends up holding a bunch of diagnostic and performance information (top, PProcM, tail of application/database logs, etc)  about the various machines I'm working on.  Because of this I'm almost never using the keyboard and mouse on that machine and in fact it often doesn't have a keyboard and mouse hooked up.  Typically I just access it just using [x11vnc](http://www.karlrunge.com/x11vnc/) so I don't have to switch my wireless mouse over or go find a free keyboard.

The problem is that the screen blanker kicks in every 15 minutes or so.  I got tired of reconnecting via VNC to turn the displays back on so I just did a quick mod to my /etc/X11/xorg.conf and now I just turn the displays off manually whenever I don't need them.  If you want to do the same thing just add the following section right before the input device section (found on [these forums](http://www.linuxquestions.org/questions/slackware-14/cannot-unset-powersave-mode-582229/)):

    
    Section "ServerFlags"
        Option         "blank time" "0"
        Option         "standby time" "0"
        Option         "suspend time" "0"
        Option         "off time" "0"
    EndSection
