---
author: admin
comments: true
date: 2009-10-24 05:15:08+00:00
layout: post
slug: how-to-fix-the-dreaded-setup-was-unable-to-create-a-new-system-partition-error-in-windows-7-advanced
title: 'How-To: Fix the dreaded "Setup was unable to create a new system partition"
  error in Windows 7 (advanced)'
wordpress_id: 206
categories:
- How-To
tags:
- sysadmin
- Windows 7
---

_This article is very brief since it requires some Linux expertise, if you haven't done this before you should ask your neighborhood __Linux geek for help_

When I first tried to install Windows 7 I ran into the problem that my LSI MegaRAID 150-4 was not supported out of the box.  I fixed that by downloading the driver from [the LSI Logic driver download page for MegaRAID SATA controllers](http://www.lsi.com/storage_home/products_home/internal_raid/megaraid_sata/megaraid_sata_300_4xlp/index.html?locale=EN&remote=1).  I chose the "Windows Server 2003 (64-bit)" version since I'm installing 64-bit Windows 7. I put those files onto a flash drive, told Windows to load the driver, and it immediately it saw my disks.  The problem I was now left with was that after I partitioned and formatted them Windows would tell me that it was "unable to create a new system partition" and refused to install.

I didn't find much on the Internet that was too helpful since most people's problems surround the fact that their drives aren't recognized. After poking around on the drive with Linux I found out what the problem was...

**The Windows 7 installer doesn't always set the bootable flag on partitions after they're formatted**

The fix?  Here's what I did (some Linux knowledge required)...

Step 1: Boot off of a bootable Linux CD

Step 2: Start a root shell

Step 3: Find out which drive you should be modifying by running

    
    dmesg | grep sd


One of the lines in there will say something like

    
    [sdb] ... 1.00 TB


Where "sdb" is your disk name and "1.00 TB" reflects about how big your RAID array is.  I just used my actual values as an example.

Step 4: Run fdisk on the drive

    
    fdisk /dev/sdb


Step 5: Press "a" and then enter to toggle the bootable flag

Step 6: Enter the number of the corresponding partition (usually partition 1) and then enter

Step 7: Press "w" and then enter to write the partition table to disk

Step 8: Reboot and rerun the Windows installation.  You'll see that on the right side of the partition list your parition should now be marked as "System".  This means that it worked.  Select the partition, click next, and let the installer churn away...
