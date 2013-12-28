---
author: admin
comments: true
date: 2009-11-02 23:59:59+00:00
layout: post
slug: how-to-fix-importerror-no-module-named-webappconfig-config-on-gentoo
title: 'How-To: Fix "ImportError: No module named WebappConfig.config" on Gentoo'
wordpress_id: 211
categories:
- How-To
tags:
- Gentoo
- Linux
- sysadmin
---

I just tried to upgrade [trac](http://trac.edgewall.org/) on my Gentoo box to get back into the swing of tracking and squashing bugs.  Gentoo was having none of it and reported "ImportError: No module named WebappConfig.config". That error by itself isn't terribly helpful so in order to fix it I determined you usually need to do a few things. If you aren't installing trac, replace trac in these steps to the application you are trying to install.

Step 1) Run

    
    python-updater


This can take a LONG time so be ready to wait.

Step 2) Try to run trac.  If that doesn't work, go on to step 3.  If it does, you're done.

Step 3) Try to emerge trac again.  If that doesn't work, go on to step 4.

Step 4) Run

    
    emerge webapp-config


trac should be updated by python-updater but the three other steps are just a backup to be extra sure that everything is installed properly.  After jumping through those hoops you should be back online again.
