---
author: admin
comments: true
date: 2009-11-01 23:59:59+00:00
layout: post
slug: how-to-fix-lvm2s-no-extents-available-for-allocation-errors-when-using-pvmove
title: 'How-To: Fix LVM2''s "No extents available for allocation" errors when using
  pvmove'
wordpress_id: 209
categories:
- How-To
tags:
- Linux
- LVM2
- sysadmin
---

I just started using LVM2 about two weeks ago.  I recently wanted to shuffle around some physical extents on my disks to keep them from becoming a mess as I added new logical volumes.  So in order to see how LVM2 laid out my logical volumes

I ran:

    
    pvdisplay -m


This roughly translates to "show me the physical volume information including the mapping data".  On my machine this printed out something like this

    
      --- Physical Segments ---
      Physical extent 0 to 17066:
        FREE
    
      Physical extent 17067 to 29866:
        Logical volume	/dev/vg-raid-array/work-area-1
        Logical extents	0 to 51199
    
      Physical extent 29867 to 31146:
        Logical volume	/dev/vg-raid-array/postgresql
        Logical extents	0 to 5119
    
      Physical extent 31147 to 59617:
        FREE
    
      --- Physical volume ---
      PV Name               /dev/sdc
      VG Name               vg-raid-array
      PV Size               232.89 GB / not usable 3.18 MB
      Allocatable           yes
      PE Size (KByte)       4096
      Total PE              59618
      Free PE               45538
      Allocated PE          14080
      PV UUID               xxxxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxxxx


What you'll notice here is that my disk has my "work-area-1" volume starting at physical extent 17067 but the physical extents before that (0 - 17066) are empty.  What I wanted to do was move those extents to the beginning of the disk, then move the postgresql extents to the extents directly after that, so that I would have a large block of contiguous extents to add new partitions.  Here's what happened on my first try

    
    # pvmove /dev/sdc:17067-29866 /dev/sdc:0-17066
    
      No extents available for allocation


After lots of digging I found that [I needed a magical, seemingly undocumented flag](http://lists.alioth.debian.org/pipermail/pkg-lvm-maintainers/2007-August/001322.html) to get it to work.  So now my command-line looked like this

    
    # pvmove -v /dev/sdc:17067-29866 /dev/sdc:0-17066 --alloc anywhere


After that I was off and running.  **If you're doing this on a remote terminal make sure you use _screen_** so you can disconnect!  The command I used runs pvmove in the foreground so if you disconnect while it's doing it bad things may happen.  This process usually takes a long time since you're reading and writing from the same disk.  Moving my 50GB of data took about 35 minutes.  Alternatively you can specify the background option ("-b" or "--background") and let it run silently.

Good luck!  Make sure you always back up your data before you start moving partitions around with LVM2.  It's fairly safe with all of it's fancy checkpointing code but it's never fun to be in the situation where you have to depend on it. rsyncing to a backup first is much easier than trying to wade through documentation later.
