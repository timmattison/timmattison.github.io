---
author: admin
comments: true
date: 2012-04-17 19:45:12+00:00
layout: post
slug: how-to-get-verizons-media-manager-to-read-content-from-a-network-location
title: 'How-To: Get Verizon''s Media Manager to read content from a network location'
wordpress_id: 732
categories:
- How-To
tags:
- Verizon FiOS
---

I ran into this problem today too when I first got FiOS installed.  Mapping a network drive won't work but using "subst" will.  I now have Media Manager reading my pictures over a network connection.  Here's how to do it:




	
  1. Open the start menu

	
  2. Type "cmd"

	
  3. Right click on "cmd" and select "Run as administrator"

	
  4. Run subst like this: 
    
    subst DRIVE: LOCATION


  DRIVE: will need to be a free drive letter like "F:", "G:", etc
  LOCATION will need to be the [UNC path](http://en.wikipedia.org/wiki/Path_(computing)#Uniform_Naming_Convention) to your network share like this "\\myothercomputer\pictures\"
  Don't forget to include the quotes if your LOCATION has spaces in it!

	
  5. Restart Media Manager and try to add the new virtual drive to it, it should start working right away



You may need to do this on each reboot.  I never reboot this computer so I haven't tested it yet.  You can put these commands in a batch file to make your life easier but you'll need to make sure the batch file runs as an administrator.

Let me know in the comments if it works for you or not.  If not I can probably help work out any kinks with you.
