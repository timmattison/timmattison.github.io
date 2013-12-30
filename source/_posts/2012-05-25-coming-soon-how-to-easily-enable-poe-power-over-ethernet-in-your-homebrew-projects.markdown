---
author: admin
comments: true
date: 2012-05-25 13:14:20+00:00
layout: post
slug: coming-soon-how-to-easily-enable-poe-power-over-ethernet-in-your-homebrew-projects
title: 'Coming soon: How to easily enable PoE (power over Ethernet) in your homebrew
  projects'
wordpress_id: 757
categories:
- Coming Soon
- How-To
tags:
- Arduino
- Netduino
- Netduino Plus
- PoE
---

UPDATE 2013-12-30: This is on hold permanently.  I never ended up having the time (this post is from way over a year ago) and PoE just isn't on my radar lately as I've shifted more towards security and software testing.

PoE ([Power over Ethernet](http://en.wikipedia.org/wiki/Power_over_Ethernet)) is an exciting and promising technology.  I think that a lot of people take it for granted now that you can plug your IP phone into an Ethernet jack and it gets data and power over that single connection.  It's easy to forget that your IP phone isn't a real landline with convenience like this.

One thing that has been frustrating about PoE over the years is not supply side availability but consumption side hardware for hobbyists.  You can find very cheap PoE switches online and that's great for all of your pre-fab gadgets (IP phones, WiFi access points, even video cameras) but implementing PoE in your own projects has been tough to say the least.

There is now [an Arduino board that supports PoE](http://canakit.webstorepowered.com/Arduino-Ethernet-Power-over-Ethernet-PoE-Module/dp/B005D22FR6) but if you're using an existing Arduino board (Mega, etc), a Netduino Plus, or a single board computer you are still out of luck if you want to use PoE so far.  Don't get me wrong you can do it but it takes significant electronics experience, a multitude of components, and even some luck since not all PoE mid-span devices follow the standard perfectly.  When using PoE with a non-compliant mid-span device you will certainly run into grounding issues that can range from a minor hassle to project killing either from noise or [magic smoke](http://en.wikipedia.org/wiki/Magic_smoke).  I haven't experienced magic smoke yet but I've definitely seen issues with noise and FTDI boards connecting and disconnecting from USB when hooked into a PoE circuit powered by a non-compliant device.

As far as the mid-span devices go you'll have to do your homework to find one that is compliant and that might even mean buying a few devices to test them out.  So far I've had some luck with a [Phihong PSA16U-480](http://www.phihong.com/html/psa16u-480_15_4w_1-port_poe.html) although there have been a few times where I've gotten the network TX/RX to stop working while the PoE portion still works.  I never did conclude whether it was a circuit problem, a Phihong problem, or a cabling problem though so I would say that so far the Phihong has been the best.  On the other hand my [Intellinet 524179](http://www.intellinet-network.com/en-US/products/6897-power-over-ethernet-poe-injector) has consistently caused my [Sparkfun FTDI basic module](http://www.sparkfun.com/products/9873) to disconnect from USB each time power is disconnected.  The Phihong does not do that and I have concluded that it must be a grounding problem.  To be clear my FTDI module in this case is being used to connect to a circuit that is powered by PoE but the FTDI module derives its power from a USB port, not the PoE adapter, on a computer that is connected to the same ground as the Intellinet 524179.  Because of this I would steer clear of this mid-span device if possible.

Now a company called [Silvertel](http://silvertel.com) has released [a line of PoE modules](http://www.silvertel.com/poe_products.htm) that finally make adding PoE to your circuits a much easier proposition.  With these new modules you only need 1 or 2 extra components to get yourself up and running which is a far cry from the 10 or more components I've seen in previous designs.  Naturally you'll need to have direct, board level access to the magnetics for the Ethernet connection so it won't work in all circuits.  There are some embedded modules that don't expose the two taps needed on the TX and RX coil to make this all work so those modules will still be unable to use PoE right in their circuitry.

However, if you find that you're working with a module that doesn't have the proper taps you can always get a [PoE splitter](http://www.cisco.com/en/US/prod/collateral/voicesw/ps6788/phones/ps10042/ps10044/data_sheet_c78-502433.html).  These devices extract PoE power and either provide 48V or some lower regulated voltage and put that into a standard barrel connector.  It's not elegant but it works.  You must avoid any hacks where you put raw voltage on spare Ethernet lines as tempting as they might be.  Some people can get away with it during testing but there's always the risk that you'll fry something when you unexpectedly hook up the wrong port.  Do yourself a favor and stick with the standards for consistency and safety.

I'm hoping to get some time next week to try Silvertel's modules out.  Once I do I'll be posting my results and, if I'm successful, some information on how to convert your Netduino Plus into a Netduino Plus with PoE.  Either way I'll post updates next week and keep everyone up to date on my progress.  I expect that if it works PoE will be a major player in most or all of my future projects.

What projects do you have that you would like to add PoE to?  What has stopped you from doing it so far other than a lack of time?  Post in the comments and let me know.
