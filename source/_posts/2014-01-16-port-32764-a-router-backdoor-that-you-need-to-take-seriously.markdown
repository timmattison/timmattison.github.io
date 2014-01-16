---
layout: post
title: "Port 32764 - A router backdoor that you need to take seriously"
date: 2014-01-16 08:50:19 -0500
comments: true
categories: 
---

TL;DR Several routers have been found to have a backdoor installed on them that is accessible via the LAN and WAN connections by default.  If you have Internet access at home or at a client location you care about then you should be testing to see if they are vulnerable with [ShieldsUP](https://www.grc.com/x/portprobe=32764).

I would recommend running this test ASAP.  The [list of affected routers](https://github.com/elvanderb/TCP-32764) includes Netgear, Linksys, and even “real” Cisco hardware.  That list is not exhaustive.

If you need to run this test via SSH I’ve whipped up a script that will spit out whether you’re vulnerable or not based on the ShieldsUP results.  It was designed to run on Mac OS (because their version of sed is busted) and tested on Mavericks and Debian Linux.  Here’s what you can run:

``` bash
curl -L http://bit.ly/port32764 2>&1 | \
  tr "\n" " " | \
  tr "\r" " " | \
  sed 's/<[^>][^>]*>/ /g' | \
  sed 's/^.*32764/32764/' | \
  sed 's/Unknown.*$//'
```

The response should look like this:

```
32764 Stealth
```

Or this:

```
32764 Closed
```

If you get anything else then you are vulnerable.  Even if you run this test I recommend running it in a browser on the connection you’re testing just in case the script has an issue.

If you are vulnerable then the following pieces of information about your connection may have already been compromised:

* Your wireless key (in the clear, not hashed)
* Your router admin username and password (in the clear, not hashed)
* Your router’s SSID and MAC address (this can be used to add your router to a database of access points with passwords)
* Any custom settings you have on your router (port mapping to interesting devices, tunnels you thought would be hidden on a high port number, etc)

People have written plenty of applications that do scans of the entire Internet in days [or even hours](http://zmap.io/).  This is being scanned for constantly right now and you cannot hide in the four billion addresses out there.

If you are not vulnerable but you have used the same wireless password on an older router it is probably a good idea to change your password.  Nobody knows how long this has been in the wild.  It has been in the firmware for a long time.

If you need help post in the comments.  Good luck!
