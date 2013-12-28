---
author: admin
comments: true
date: 2009-10-20 13:12:51+00:00
layout: post
slug: how-to-set-up-iscsi-between-linux-and-mac-os-tested-on-10-6-1
title: 'How-To: Set up iSCSI between Linux and Mac OS (tested on 10.6.1)'
wordpress_id: 205
categories:
- How-To
tags:
- iSCSI
- Linux
- Mac OS
- sysadmin
---

Last week I read LinuxJournal magazine and it talked about all of the cool things you could do with two Linux machines and the open source iSCSI code that's floating around out there.  I do have two Linux machines but I really wanted to see if I could get iSCSI working on my MacBook Pro and iMac so I could easily offload some files from their main drives to my larger file server.  I did it and here's how you can do it too.

The terminology that you'll need to know here is target (the server that has the disk where you're putting the data) and initiator (the machine that wants access to the target).  In my scenario my Dell Linux machine is the target and my Mac is the initiator.  You should also know that the iSCSI volumes I created were not raw drives.  I created a file filled with zeroes that the iSCSI software treats as a raw disk.

There are other ways to do this but this way is really cool because the underlying system can be any mix of systems you want (ext2/3/4, ZFS, LVM RAID, etc.).  Using LVM gives you redundancy without your client having to worry about it.

**Disclaimer:** I use Gentoo so your steps may be different.

Step 1: Install iSCSI target software on Linux.  I used the [iSCSI Enterprise target](http://iscsitarget.sourceforge.net/) package.

    
    emerge -av iscsitarget


Step 2: Create a directory on your Linux machine where you want to store your iSCSI disk images.  I used "/srv"

    
    sudo mkdir /srv


Step 3: Create a file that will contain your first iSCSI volume with dd.  Don't go crazy here yet.  Let's create two 1GB disks for testing and you can recreate larger ones later.

    
    sudo dd if=/dev/zero of=/srv/iscsi.disk.0 bs=1 seek=1024M count=1
    sudo dd if=/dev/zero of=/srv/iscsi.disk.1 bs=1 seek=1024M count=1


Step 4: Edit the iSCSI configuration files.  My system was a bit different than the one in LinuxJournal.  I had to edit only the /etc/ietd.conf file.  Here is my entire configuration file:

    
    Target iqn.2009-09.org.mattison:iscsi-target
            IncomingUser test secretpasswd
            OutgoingUser test secretpasswd
            Lun 0 Path=/srv/iscsi.disk.0,Type=fileio
            Lun 1 Path=/srv/iscsi.disk.1,Type=fileio
            Alias Test


Keep in mind that to comply with the standards your password must be twelve characters.  Also, don't forget to change the target name from iqn.2009-09.org.mattison:iscsi-target to something that makes more sense to you.  Typically the 2009-09 is the year and month in which the filesystem went live, org.mattison is just your domain name in reverse, and iscsi-target is what you want to call this target.

Step 5: Start the iSCSI target.

    
    /etc/init.d/ietd restart


Step 6: Install an iSCSI initiator on your Mac and reboot (it is required by the installer).  I used [GlobalSAN's iSCSI Initiator for Mac OS X](http://www.studionetworksolutions.com/products/product_detail.php?t=more&pi=11)

Step 7: After the reboot open the GlobalSAN system preferences panel.  Then click on "Portals", click the plus sign, and then enter in the DNS name or IP address of your Linux server.  The default port should be fine unless you changed it on the Linux machine.

Click "OK".

Step 8: Click the "Targets" tab and you should see your "iscsi-target" item listed there.  Click the "Connected" checkbox.  Then, check the "Use CHAP Login Information" box, fill in the user name, target secret, and initiator secret fields. In my example the username was "test" and the passwords were both "secretpasswd".  If you changed them then use your values here. The "IncomingUser" password is what GlobalSAN refers to as the "Target Secret", the "OutgoingUser" password is what GlobalSAN refers to as the "Initiator Secret".

Step 9: Now partition and use the disks just like any other disk.  They'll show up as iSCSI "IET VIRTUAL-DISK Media" in Apple's Disk Utility.

From here you can do all kinds of crazy things.  You can even set up a RAID, run iDefrag on them, use them for Time Machine, etc.  Of course a RAID over iSCSI in this setup will yield very low performance so it's not recommended for production, just for fun.  Defragging an iSCSI volume is also not worth it especially since the file that contains the whole filesystem on the Linux machine is most likely where the fragmentation is occurring.  Again, these two examples are just to show you that Mac OS really does treat these devices as a low-level block device.  Time Machine may not be such a bad idea actually...
