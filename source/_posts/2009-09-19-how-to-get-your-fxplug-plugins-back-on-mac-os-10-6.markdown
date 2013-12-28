---
author: admin
comments: true
date: 2009-09-19 17:11:10+00:00
layout: post
slug: how-to-get-your-fxplug-plugins-back-on-mac-os-10-6
title: 'How-To: Get your FxPlug plugins back on Mac OS 10.6'
wordpress_id: 201
categories:
- How-To
tags:
- Final Cut
- Mac OS
---

Please pass this link around as much as you'd like but don't copy the content directly.  I have no popups, AdSense, etc.  I just want to keep track of whether or not this information is useful to others.

Are your FxPlug plugins mysteriously missing in Final Cut or Final Cut Express?  I had the same problem and after a complete reinstall and some other voodoo I have finally found out the cause and, amazingly, a fix for this issue.

This fix involves using the Terminal, downloading some files, and mucking around with the system a bit.  I've done all of the research so it should be a copy and paste job but if you don't know what you're doing you could inadvertently break other things.  Don't do this without doing a system backup.  If you depend on your Mac to make your living you should try this out on a test machine first.  You do have a test machine, don't you?

So, here we are, my FxPlugins didn't work.  I did a complete reinstall of the operating system and reinstalled Final Cut Express 4.  After that, things worked beautifully.  I couldn't leave well enough alone though and just a few days later they stopped working again.

The reason?  I'm a developer and I want to make FxPlug plugins myself.  To do that you need to install the FxPlug SDK.  The FxPlug SDK is what breaks the FxPlug framework.  It installs a new version of the FxPlug executable that simply doesn't work.

The solution?  I'm assuming that your FxPlug plugins don't work already.  If they work now but you want to install the SDK then skip down to the bottom and there are some more simple instructions.

Restoring broken FxPlug functionality:

Step 1: Close all Pro applications (Final Cut, Final Cut Express, Motion, Aperture, etc)

Step 2: Download the [Apple Plugin Manager v1.7.3](http://www.apple.com/downloads/macosx/apple/application_updates/pluginmanager173.html)

Step 3: Do the following in the Terminal...

    
    sudo cp -R /Library/Frameworks/FxPlug.framework /tmp/FxPlug.framework-backup
    sudo rm -rf /Library/Frameworks/FxPlug.framework


Step 4: Now, run the Apple Plugin Manager v1.7.3 from step 2

Step 5: Restart Final Cut or Final Cut Express and your FxPlug plugins should all be back.  You have a backup copy of your original FxPlug.framework in /tmp if anything goes wrong or you want to restore that version for some reason.

Now, if you want to install the SDK you must start with a working system.  If your system doesn't work yet just do the instructions above.  Then, move onto these instructions.

Installing the FxPlug v1.2.4 SDK and maintaining FxPlug functionality in Pro applications:

Step 1: Download the [FxPlug SDK v1.2.4](https://connect.apple.com/cgi-bin/WebObjects/MemberSite.woa/wa/getSoftware?bundleID=20458) (requires an ADC account)

Step 2: Do the following in the Terminal...

    
    sudo cp /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug.working


Step 3: Install the SDK

Step 4: Do the following in the Terminal...

    
    sudo cp /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug.not-working
    sudo cp /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug.working /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug


That's it, you're up and running and the SDK is installed.  Backup copies are made of all of the files so you can switch back whenever you want.  Just make sure that all Pro applications are closed when you switch the FxPlug executable.

Just for the extra nerd factor run this in Terminal:

shasum /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug*

And you should get this output:

ae8767bc7d86071b202415aa69cc6c9db451300c  /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug

    
    0da60e74be49c73f4fec3a146378e05b3dc4c974  /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug.not-working
    
    ae8767bc7d86071b202415aa69cc6c9db451300c  /Library/Frameworks/FxPlug.framework/Versions/Current/FxPlug.working


If you see that, everything should work just fine until the next Apple update.  :)
