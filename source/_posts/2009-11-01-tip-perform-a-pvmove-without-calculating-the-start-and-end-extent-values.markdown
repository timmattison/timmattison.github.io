---
author: admin
comments: true
date: 2009-11-01 23:59:59+00:00
layout: post
slug: tip-perform-a-pvmove-without-calculating-the-start-and-end-extent-values
title: 'Tip: Perform a pvmove without calculating the start and end extent values'
wordpress_id: 210
categories:
- Tips
tags:
- Linux
- LVM2
- sysadmin
---

If you're used pvmove before you might be in the habit of doing the following:



	
  * Determining where you want to move an extent (new_start)

	
  * Getting the start and end of the existing extent to move (original_start, original_end)

	
  * Calculating the length of the extent from original_end - original_start (length)

	
  * Adding the length to new_start (new_end)

	
  * Running pvmove


Well, there is an easier way.  Let's assume you originally would've done this

    
    pvmove -v /dev/sdc:17067-29866 /dev/sdc:0-17066 --alloc anywhere


If you want to be lazy (and let LVM2 figure out whether you're doing the right thing or not) you can just do this instead

    
    pvmove -v /dev/sdc:17067-29866 /dev/sdc:0-`echo "0+29866-17067" | bc` --alloc anywhere


Basically, after you've determined where you want the new extent to start you put that extent number ("0" in this case) and just follow it up with that bc recipe.  This tells bc to calculate the length and feed it to LVM2.

The bc formula should be new_start plus original_end minus original_start.  That will calculate the length and then add it to the new_start.

Isn't that what you'd expect it to do anyway?  :)
