---
author: admin
comments: true
date: 2009-02-28 17:43:19+00:00
layout: post
slug: how-to-build-net-wirelessbluez-libs-2-25-and-net-wirelessbluez-utils-2-25-r1-on-gentoo-updated-2009-03-05
title: 'How-To: Build net-wireless/bluez-libs-2.25 and net-wireless/bluez-utils-2.25-r1
  on Gentoo [updated 2009-03-05]'
wordpress_id: 191
categories:
- How-To
tags:
- Gentoo
- Linux
- sysadmin
---

UPDATE #1: The latest portage now has a 3.x version of these tools.  If you update to the latest portage as of 2009-03-05 then you likely won't have to jump through these hoops.

I was trying to do some <spoiler>fun stuff with my Wii remote on Linux</spoiler> today and found that when I went to build the BlueZ utils on my Gentoo box it failed almost straight away.

To save you the headache and I did some digging.  I have a quick and dirty way to fix your Gentoo setup if you're experiencing this problem.

If you care it's related to GCC 4.x handling includes in C in a different way than previous versions.  If you don't care just ignore the previous sentence.  Here's the fix:

Step 1: emerge bluez-libs.  When the emerge gets into the configure stage, press Control-Z to suspend the build.  The configure stage is when it spits out lots of "Checking for ..." messages.

Step 2: Edit the /var/tmp/portage/net-wireless/bluez-libs-2.25/work/bluez-libs-2.25/src/hci.c file with your favorite editor.  Within the chunk of includes you see at the top of the file add the line "#include ".

Step 3: Run "fg" to continue the build.  bluez-libs should emerge normally now.

Step 4: emerge bluez-utils.  When the emerge gets into the configure stage, press Control-Z to suspend the build.

Step 5: Edit all of the following files and again add the line "#include " to them.  The files are: net-wireless/bluez-utils-2.25-r1/work/bluez-utils-2.25/tools/hciconfig.c, net-wireless/bluez-utils-2.25-r1/work/bluez-utils-2.25/tools/hciattach.c, net-wireless/bluez-utils-2.25-r1/work/bluez-utils-2.25/sdpd/request.c, net-wireless/bluez-utils-2.25-r1/work/bluez-utils-2.25/hidd/sdp.c

Step 6: Run "fg" to continue the build.  bluez-utils should emerge normally now.
