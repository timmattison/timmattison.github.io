---
author: admin
comments: true
date: 2011-07-12 12:59:23+00:00
layout: post
slug: how-to-fix-vmware-connectivity-problems-after-installing-avast-internet-security
title: 'How-To: Fix VMware connectivity problems after installing Avast! Internet
  Security'
wordpress_id: 519
categories:
- How-To
tags:
- VMware
- Windows
---

I am a big fan of the Avast! line of security products.  I just upgraded from Pro to Internet Security since I got a new laptop and getting the Pro version for that was the same price as the Internet Security version and I figured that an added firewall couldn't hurt.  Naturally, it's never that simple and I realized that after I rebooted the firewall was causing the web browsers in my virtual machines to lose access to the Internet.  I was still able to ping things via the command line but I couldn't do much else.

In order to fix this I found out that you just need to do the following steps and you're back online:



	
  1. Open Avast!

	
  2. Click the Firewall tab

	
  3. Make sure the Firewall Settings sub-tab is selected

	
  4. Click "Expert Settings" next to the "Stop" button

	
  5. Check "Internet Connection Sharing mode"

	
  6. Click OK

	
  7. Close Avast!




Now your VMs are back online.  Post in the comments if you found it useful.
