---
author: admin
comments: true
date: 2009-11-03 23:59:59+00:00
layout: post
slug: how-to-migrate-vmware-fusion-based-windows-vms-to-vmware-workstation-on-linux
title: 'How-To: Migrate VMware Fusion-based Windows VMs to VMware Workstation on Linux'
wordpress_id: 216
categories:
- How-To
tags:
- Linux
- sysadmin
- VMware
- Windows
---

VMware Fusion and VMware Workstation are both incredible products that will literally change the way you work if you are a developer or an IT admin.  One thing that is a bit of a pain point, though, is moving virtual machines from VMware Fusion on the Mac to VMware Workstation on Linux.  If you move your VMs without doing this you may notice incredibly bad performance.  When I say bad performance I mean that the system is so slow it may take you 5 minutes to go from the desktop to the control panel.  Here is how to do it properly and avoid all of that...

Note: You can do these steps either when going from VMware Fusion to VMware Workstation or the other way around.

For the purposes of this article we'll skip calling them VMware Fusion and VMware Workstation and we'll refer to them as your source host and your destination host.

Step 1: Take a snapshot of your VM so you can revert if anything goes wrong.

Step 2: Start up your Windows VM on the source host.

Step 3: Go to Control Panel -> Add/Remove programs

Step 4: Uninstall VMware tools and shutdown

If you don't need audio support, do steps 5 through 8 otherwise you're ready to move your VM over to the

destination host.

Step 5: Reboot and go to Control Panel -> Administrative Tools -> Services

Step 6: Stop "Windows Audio", and set it's startup mode to "Disabled"

Step 7: Shutdown the VM

Step 8: Open the VM settings and remove the audio device

Now, move your VMs to the destination host.  If your destination host is Linux you can safely remove the "Applications" directory inside the vmwarevm directory.

Finally, restart your host, install VMware Tools as you normally would, power off, and create another snapshot. This snapshot will serve as a clean starting off point if you need to tweak things experimentally to get the system running the way you'd like.  Never underestimate the power of a few snapshots to save you hours upon hours even when you think that everything will go just fine.  Once things are stable you can remove them and reclaim the disk space. Also, don't forget about the VMware Tools "Shrink" function.  Once you're stable and you've removed your snapshots you should always run "Shrink" to get back some storage.  Usually it trims a few hundred MB for me but sometimes it can free up a few GB if the VM has seen a lot of use.  You can't run "Shrink" if you have any snapshots on your virtual machine so it's really only good when you've tweaked your setup and you're happy.  As soon as you "Shrink" you should always snapshot the machine again.
