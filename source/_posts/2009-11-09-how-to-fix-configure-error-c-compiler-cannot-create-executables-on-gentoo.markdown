---
author: admin
comments: true
date: 2009-11-09 23:59:59+00:00
layout: post
slug: how-to-fix-configure-error-c-compiler-cannot-create-executables-on-gentoo
title: 'How-To: Fix "configure: error: C compiler cannot create executables" on Gentoo'
wordpress_id: 219
categories:
- How-To
tags:
- Gentoo
---

I encountered this message today when trying to update glib-2.20.5-r1 on my 64-bit Gentoo box.  I've seen this error message before but today, as luck would have it, I had just made some changes to my make.conf so I knew exactly where to look.  What I was doing was preparing my system for Xen and I was duped into adding the "--mno-tls-direct-seg-refs" option to my CFLAGS.  It turns out that 64-bit Gentoo doesn't need this option and actually it will cause your C compiler to fail.

If you have this option and you're trying to get Xen running, remove it and try again.  That will most likely fix your problem.  If the problem persists you can dig a bit deeper and figure it out like this.



	
  * Step 1: Scroll back through your emerge error.  If it's too far gone then retry the emerge and get it to report the error again.  If you're using screen don't forget that you can use CTRL-A and then left bracket to enter copy mode and maneuver through the scrollback buffer.  Press escape to exit it when you're done.  You're looking for something that looks like this:

    
    configure: error: in `/var/tmp/portage/dev-libs/glib-2.20.5-r1/work/glib-2.20.5':
    configure: error: C compiler cannot create executables
    See `config.log' for more details.
    !!! Please attach the following file when seeking support:
    !!! /var/tmp/portage/dev-libs/glib-2.20.5-r1/work/glib-2.20.5/config.log




	
  * Step 2: Open the file residing at the full path of the config.log file (in my case /var/tmp/portage/dev-libs/glib-2.20.5-r1/work/glib-2.20.5/config.log)

	
  * Step 3: Search the file for the string "failed program".  A few lines up from this message you'll see the true error.  In my case it was:

    
    configure:3385: x86_64-pc-linux-gnu-gcc -O2 -pipe -fomit-frame-pointer --mno-tls-direct-seg-refs   -Wl,-O1 conftest.c  >&5
    cc1: error: unrecognized command line option "-fmno-tls-direct-seg-refs"




	
  * Step 4: Remove the unrecognized command line option.  It is reported here as "-fmno-tls-direct-seg-refs" but in the make.conf file it is "--mno-tls-direct-seg-refs".  You'll see that in the line above the error message.  I've left it in there so you can see what that line should look like too.  Your error may be different entirely or just a different flag.  Either way, fixing the issue reported there should bring your compiler back to life and keep you emerging in the future.


