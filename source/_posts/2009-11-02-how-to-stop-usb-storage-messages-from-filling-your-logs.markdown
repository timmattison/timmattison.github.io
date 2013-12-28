---
author: admin
comments: true
date: 2009-11-02 23:59:59+00:00
layout: post
slug: how-to-stop-usb-storage-messages-from-filling-your-logs
title: 'How-To: Stop USB storage messages from filling your logs'
wordpress_id: 212
categories:
- How-To
tags:
- Linux
- sysadmin
---

After a reinstall of Gentoo the other day I noticed that when I checked my logs with dmesg that all I saw was a ton of information relating to usb-storage.  It turns out that the default kernel in some operating systems (and apparently the latest Gentoo is one of them) has the verbose USB storage debug logs enabled.

In order to disable it you'll need to rebuild your kernel.  The option you're looking for is deep in the menu system but you can find it by drilling down like this



	
  * Device Drivers

	
    * USB support

	
      * USB Mass Storage verbose debug








This option is also known as CONFIG_USB_STORAGE_DEBUG if you are editing your configuration manually.  Make sure this is unchecked in the menu (ie. no asterisk next to it) or set to "=n" in your configuration file.  Rebuild your kernel, reboot, and you'll never be bothered with these messages again.
