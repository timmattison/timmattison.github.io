---
author: admin
comments: true
date: 2009-08-08 23:59:59+00:00
layout: post
slug: how-to-get-openvpn-and-the-iburst-to-cooperate
title: 'How-To: Get OpenVPN and the iBurst to cooperate'
wordpress_id: 198
categories:
- How-To
tags:
- OpenVPN
- sysadmin
---

If you're an avid OpenVPN user like I am you're probably used to telling people

"OpenVPN works everywhere, unlike IPsec, unlike PPTP, etc..."

Well, that _was_ true for me until I went to South Africa and started using [iBurst](http://www.iburst.co.za/default.aspx?link=packages_wireless_fromhome).  It started to drive me crazy that I couldn't use VNC over it, I'd lose connection with my mail server, and SSH sessions would mysteriously (but repeatably) die.  Thankfully I found [a forum post about the issue](http://mybroadband.co.za/vb/archive/index.php/t-53268.html) that helped me tune my settings to get things to work without a hitch.  The advice they gave didn't work for me at first but a little persistence got me up and running in just a few minutes.

If you're using a Mac here is the secret sauce:



	
  * Connect to the Internet with your iBurst

	
  * Connect to your OpenVPN VPN (I use [Tunnelblick](http://www.tunnelblick.net))

	
  * Open up a Terminal session

	
  * Type "sudo ifconfig tun0 mtu 1000" (without the quotes) and enter your root/sudo password if necessary

	
  * That's it, your OpenVPN session should be rock solid now or at least as rock solid as your iBurst connection is


If you're looking to increase the performance of your OpenVPN session you can raise the MTU of 1000 a little bit.  You'll have to experiment to get the correct value.  Anything beyond and including the suggested 1352 didn't work for me, 1200 was flaky as well.  I erred on the side of caution and just stuck with 1000.  There's some performance hit but not noticeable enough for me to really spend tons of time tuning it.
