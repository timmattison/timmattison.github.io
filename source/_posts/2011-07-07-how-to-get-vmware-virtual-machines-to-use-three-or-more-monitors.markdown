---
author: admin
comments: true
date: 2011-07-07 12:52:27+00:00
layout: post
slug: how-to-get-vmware-virtual-machines-to-use-three-or-more-monitors
title: 'How-To: Get VMware virtual machines to use three or more monitors'
wordpress_id: 517
categories:
- How-To
tags:
- VMware
---

I just upgraded from a dual monitor to a triple monitor setup.  The strange thing was that when I went into my virtual machines, after rebooting them to recognize the new graphics cards, I couldn't get them to span all three displays.  When I pressed the button to switch monitor configurations it would alternate between the combinations of two different displays and then it would go to a configuration where the display was double width but centered across all three displays.  This left windows split across monitors and large vertical black bars on either side of things.  It wasn't pretty but I figured out what was wrong.

VMware has a notion of a virtual machine's video RAM.  By default this value is too low to support three 1920 x 1080 displays.  In order to fix this do the following:



	
  1. Determine the resolution of each of your screens.  In my case they all were 1920 x 1080.

	
  2. Calculate the pixel count by multiplying the vertical resolution by the horizontal resolution.  This gave me 2,073,600.

	
  3. Multiply each screen's pixel count by 4 (1 byte per pixel and 1 byte for alignment).  This gave me 8,294,400.

	
  4. Add all of the values from step 3 together.  This now gives me 8,294,400 * 3 for my three displays so my total is 24,883,200 (approximately 24 MB).  This is approximately how many bytes of video memory you need.

	
  5. Add a margin of error of about another 8,000,000.  This bumped my value up to 33,000,000.

	
  6. Back up your VMX file and your VM.

	
  7. Edit the VMX file and add this line at the bottom but replace 33000000 with your value from step 5. Note: Search the file to make sure this line doesn't exist already. If it does you'll need to modify it instead of adding a second one.

    
    svga.vramSize=33000000




	
  8. Save the configuration file and restart your VM


That's it.  You'll now be able to run as many displays as you can afford.
