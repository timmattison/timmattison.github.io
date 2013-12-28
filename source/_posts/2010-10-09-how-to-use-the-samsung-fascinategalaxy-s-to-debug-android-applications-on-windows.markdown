---
author: admin
comments: true
date: 2010-10-09 14:23:40+00:00
layout: post
slug: how-to-use-the-samsung-fascinategalaxy-s-to-debug-android-applications-on-windows
title: 'How-To: Use the Samsung Fascinate/Galaxy S to debug Android applications on
  Windows'
wordpress_id: 329
categories:
- How-To
tags:
- Android
---

I just got a Samsung Fascinate a few weeks back and it’s a great phone.  When I tried to hook it up today to do some development on it though I ran into trouble.  In the Windows device manager it just came up as a “Samsung Android” but Eclipse would not recognize it as a valid target.  In order to use this device, or any other Galaxy S product, as a debug target you need to do one more thing…

The secret is that you need to download Samsung’s USB drivers.  The standard ones that come with the Android development kit will not work even if you modify the INF file to include the USB IDs of the phone.  Samsung has [drivers specifically for the Fascinate](http://j.mp/SamsungFascinateUSB).  I didn’t find the Samsung drivers right away so I settled for Softpedia.  Normally I avoid Softpedia downloads but I scanned them and looked at them closely before installing and they seem legitimate.  There are two versions listed but I think they may both be the same since the x64 version I installed claimed to be x86.  So here they are:

[Generic Galaxy S USB drivers for x64](http://drivers.softpedia.com/get/MOBILES/Samsung/Samsung-Galaxy-S-USB-Driver-for-Windows-x64.shtml)

[Generic Galaxy X USB drivers for x86](http://drivers.softpedia.com/get/MOBILES/Samsung/Samsung-Galaxy-S-USB-Driver-for-Windows-x86.shtml)

Softpedia tries to trick you into clicking ads so first click “Download” to the left of the download counter for the file, then click the “Softpedia Secure Download (US) [ZIP]” link.  All of the other links are ads.

After you have installed the drivers reconnect your phone and it should install four different drivers relating to ADB.  Then you should see your device come up in the Android device manager when you try to launch your project in Eclipse.  If the manager doesn’t come up you should go to the “Run Configurations” for your project, select the “Target” tab, and then select “Manual” under “Deployment Target Selection Mode”.  This makes sure that when you launch this project it’ll try to open device manager.
