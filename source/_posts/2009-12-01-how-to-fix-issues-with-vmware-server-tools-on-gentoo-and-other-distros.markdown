---
author: admin
comments: true
date: 2009-12-01 23:59:59+00:00
layout: post
slug: how-to-fix-issues-with-vmware-server-tools-on-gentoo-and-other-distros
title: 'How-To: Fix issues with VMware Server tools on Gentoo (and other distros)'
wordpress_id: 228
categories:
- How-To
tags:
- Gentoo
- sysadmin
- VMware
---

VMware Server is a complicated beast.  When it breaks, you're usually without support (although [paid support options do exist](mailto:sales@vmware.com)), and out of commission.  One problem that tripped me up for a few weeks was that I had a running VM that refused to suspend.  Because of this I couldn't get clean backups of the VM in a suspended state and had to resort to just a plain backup of the filesystem via rsync.  It worked, but it was less than optimal.  Any time I ran the suspend command:

    
    /opt/vmware/bin/vmrun suspend Gentoo.vmx


The error message I was presented with was:

    
    Error: Command failed: Cannot connect to the virtual machine


I could hobble along like this for a while but today I needed to add another virtual disk which required a restart of the VM.  When I tried to start it via the command-line tools like this:

    
    /opt/vmware/bin/vmrun start Gentoo.vmx


The system just hung indefinitely.  Eventually I had to CTRL-C out of it and get back to the command-line to figure out the issue.

What was the underlying problem?  Almost every time I've had a VMware Server issue it has been permissions.  When you're working with VMs you should always make sure that the following criteria is applied to the files in the VM's working directory:



	
  * All files must be owned by the vmware user and/or the vmware group

	
  * All of the files must be readable and writeable by the vmware user and/or group

	
  * Disk files must be marked as executable by the vmware user and/or group

	
  * Optional: All permissions should be removed from anyone other than the owning user and/or group


What I do to get this done quickly on all of my VMs is run the following few commands in each VM's working directory:

    
    chgrp vmware *
    chmod 660 *vmem
    chmod 660 *.vmsn
    chmod 750 *.vmdk
    chmod 750 *.vmsd
    chmod 750 nvram


After running those few commands VMware Server works like a charm again.
