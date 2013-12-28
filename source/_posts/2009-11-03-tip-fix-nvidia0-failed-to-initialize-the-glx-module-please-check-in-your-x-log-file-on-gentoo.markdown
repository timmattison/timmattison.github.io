---
author: admin
comments: true
date: 2009-11-03 23:59:59+00:00
layout: post
slug: tip-fix-nvidia0-failed-to-initialize-the-glx-module-please-check-in-your-x-log-file-on-gentoo
title: 'Tip: Fix "NVIDIA(0): Failed to initialize the GLX module; please check in
  your X log file" on Gentoo'
wordpress_id: 213
categories:
- Tips
tags:
- Linux
- nvidia
- sysadmin
- X
---

I have been rebuilding my Gentoo machine for a few days now.  Not that it really takes that long, but I only have limited time I can dedicate to it each day while still managing the time constraints of work.  After emerging xorg-x11 I restored my old configuration file that included my Nvidia Twinview display settings and I saw these errors popup

    
    (EE) NVIDIA(0): Failed to initialize the GLX module; please check in your X
    (EE) NVIDIA(0):     log file that the GLX module has been loaded in your X
    (EE) NVIDIA(0):     server, and that the module is the NVIDIA GLX module.  If
    (EE) NVIDIA(0):     you continue to encounter problems, Please try
    (EE) NVIDIA(0):     reinstalling the NVIDIA driver.


What this means in a nutshell is that you haven't told Gentoo to use Nvidia's OpenGL support yet.  To fix that you can just run the following command

    
    eselect opengl set nvidia


Gentoo should respond with this

    
    Switching to nvidia OpenGL interface... done


You'll not only be rid of that error message but you'll have much better OpenGL performance than before.  Now I've got to just get rid of those last few errors and fix my mouse and I'll be all set.
