---
author: admin
comments: true
date: 2009-11-17 15:18:26+00:00
layout: post
slug: how-to-fix-vmware-workstations-modules-after-updating-your-kernel-on-gentoo
title: 'How-To: Fix VMware Workstation''s modules after updating your kernel on Gentoo'
wordpress_id: 223
categories:
- How-To
tags:
- Gentoo
- VMware
---

Here's another thing I ran into today when adding support for KVM to my kernel... VMware Workstation's modules failed to load at boot time.  Normally, the fix is to run:

    
    vmware-modconfig --console --install-all


Or:

    
    emerge --config vmware-workstation


**Neither of these will work on the latest versions of Gentoo**.  The real fix is to re-emerge your vmware-modules package.  You can do this by just running:

    
    emerge vmware-modules


That will build the modules against your current running kernel.  After that, your modules will work again but will not be loaded.  You need to forcibly reload them by running:

    
    /etc/init.d/vmware restart


Each time you change your kernel, which means even booting into one that previously worked, you'll need to do this again.  For convenience if you change your kernel a lot you can just put those two commands into a script.  The script, which I call "fix-vmware-modules.sh", should just look like this:

    
    emerge vmware-modules
    /etc/init.d/vmware restart
    rc-update add vmware default


I added the extra rc-update command just in case you run this on a machine that you just installed VMware Workstation on.  It makes sure the modules are loaded at boot time and it won't hurt an existing installation.  Instead it will just let you know that it's already added to the default runlevel.
