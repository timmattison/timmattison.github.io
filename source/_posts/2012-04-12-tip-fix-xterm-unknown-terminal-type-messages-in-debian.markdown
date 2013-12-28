---
author: admin
comments: true
date: 2012-04-12 14:32:57+00:00
layout: post
slug: tip-fix-xterm-unknown-terminal-type-messages-in-debian
title: 'Tip: Fix "''xterm'': unknown terminal type" messages in Debian'
wordpress_id: 728
categories:
- Tips
tags:
- Debian
---

This one has been a bit of a nuisance on newly spooled up Debian instances for me lately.  When I try to run "top" or "clear" or really anything that does something with the terminal I get the following message:


    
    'xterm': unknown terminal type.



This is because either you haven't installed ncurses-term (unlikely) or a symlink from /lib/terminfo/x/xterm to /usr/share/terminfo/x/xterm is missing.  To cover all possibilities do this:


    
    sudo apt-get install ncurses-term
    sudo ln -s /lib/terminfo/x/xterm /usr/share/terminfo/x/xterm



Poof, your terminal works again!
