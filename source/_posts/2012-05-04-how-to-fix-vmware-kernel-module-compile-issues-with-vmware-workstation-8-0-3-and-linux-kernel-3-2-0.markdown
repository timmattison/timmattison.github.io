---
author: admin
comments: true
date: 2012-05-04 13:06:30+00:00
layout: post
slug: how-to-fix-vmware-kernel-module-compile-issues-with-vmware-workstation-8-0-3-and-linux-kernel-3-2-0
title: 'How-To: Fix VMware kernel module compile issues with VMware Workstation 8.0.3
  and Linux kernel 3.2.0'
wordpress_id: 741
categories:
- How-To
tags:
- VMware
---

**Update 2012-06-16**: This still happens on the 8.0.4 update so change the values that read "8.0.3" to "8.0.4" if you are using 8.0.4.  Also, if you have patched previously and try to run the script again after an upgrade you need to remove a file called "/usr/lib/vmware/modules/source/.patched" first.  The script will let you know that it won't patch because it has already been done if you forget.  Just delete it and re-run the script.

Today I upgraded to VMware Workstation 8.0.3 and immediately I ran into the following error message:


    
    make[1]: Entering directory `/usr/src/linux-headers-3.2.0-2-amd64'
      CC [M]  /tmp/vmware-root/modules/vmnet-only/userif.o
      CC [M]  /tmp/vmware-root/modules/vmnet-only/netif.o
      CC [M]  /tmp/vmware-root/modules/vmnet-only/filter.o
    /tmp/vmware-root/modules/vmnet-only/userif.c: In function ‘VNetCsumCopyDatagram’:
    /tmp/vmware-root/modules/vmnet-only/userif.c:520:3: error: incompatible type for argument 1 of ‘kmap’
    /usr/src/linux-headers-3.2.0-2-common/include/linux/highmem.h:48:21: note: expected ‘struct page *’ but argument is of type ‘const struct <anonymous>’
    /tmp/vmware-root/modules/vmnet-only/userif.c:523:3: error: incompatible type for argument 1 of ‘kunmap’
    /usr/src/linux-headers-3.2.0-2-common/include/linux/highmem.h:54:20: note: expected ‘struct page *’ but argument is of type ‘const struct <anonymous>’
    /tmp/vmware-root/modules/vmnet-only/netif.c: In function ‘VNetNetIfSetup’:
    /tmp/vmware-root/modules/vmnet-only/netif.c:134:7: error: unknown field ‘ndo_set_multicast_list’ specified in initializer
    /tmp/vmware-root/modules/vmnet-only/netif.c:134:7: warning: initialization from incompatible pointer type [enabled by default]
    /tmp/vmware-root/modules/vmnet-only/netif.c:134:7: warning: (near initialization for ‘vnetNetifOps.ndo_validate_addr’) [enabled by default]
    make[4]: *** [/tmp/vmware-root/modules/vmnet-only/userif.o] Error 1
    make[4]: *** Waiting for unfinished jobs....
    make[4]: *** [/tmp/vmware-root/modules/vmnet-only/netif.o] Error 1
    



After lots of Googling I found [a blog post with a patch for kernels 3.2.0 and 3.3.0](http://weltall.heliohost.org/wordpress/2012/01/26/vmware-workstation-8-0-2-player-4-0-2-fix-for-linux-kernel-3-2-and-3-3/).  Unfortunately when I tried to run the patch it failed and said:


    
    Sorry, this script is only for VMWare WorkStation 8.0.2 or VMWare Player 4.0.2. Exiting



In order to fix this open up the script after you download it and change the line this line:


    
    
    vmreqver=8.0.2
    



To this:


    
    
    vmreqver=8.0.3
    



Re-run the script and you should be good to go.
