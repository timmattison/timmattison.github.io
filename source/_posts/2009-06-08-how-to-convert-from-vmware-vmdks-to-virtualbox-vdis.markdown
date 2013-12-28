---
author: admin
comments: true
date: 2009-06-08 23:59:59+00:00
layout: post
slug: how-to-convert-from-vmware-vmdks-to-virtualbox-vdis
title: 'How-To: Convert from VMware VMDKs to VirtualBox VDIs'
wordpress_id: 197
categories:
- How-To
tags:
- sysadmin
- VirtualBox
- VMware
---

A lot of the how-to files out there that explain this process are either too verbose, outdated, or both.  Here is a no nonsense step-by-step guide to converting your VMDKs to VDIs for use with VirtualBox.

Step 1: qemu-img convert original.vmdk raw.bin

On the Mac I had to install "[Q](http://www.kju-app.org/)".  Then I used the absolute path "/Applications/Q.app/Contents/MacOS/qemu-img" so my command-line looked like: /Applications/Q.app/Contents/MacOS/qemu-img convert original.vmdk raw.bin

Step 2: VBoxManage convertdd raw.bin out.vdi

On the Mac I had to run VBoxManage from /Applications/VirtualBox.app/Contents/MacOS/VBoxManage so my command-line looked like:

/Applications/VirtualBox.app/Contents/MacOS/VBoxManage convertdd raw.bin out.vdi

That's it!  Keep in mind that this requires a lot of disk space.  On my system original.vmdk and the associated files was about 10 gigs, converted to raw.bin brought it up to 20 gigs (the full size of the disk), and then converting it to out.vdi took another 20 gigs.  After all that you can delete the VMDK and bin files if you don't need them anymore but the original VMDK is nice for a backup especially if it's not preallocated to the full size.
