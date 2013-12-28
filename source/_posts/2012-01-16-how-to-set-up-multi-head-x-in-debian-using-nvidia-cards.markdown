---
author: admin
comments: true
date: 2012-01-16 17:53:52+00:00
layout: post
slug: how-to-set-up-multi-head-x-in-debian-using-nvidia-cards
title: 'How-To: Set up multi-head X in Debian using Nvidia cards'
wordpress_id: 605
categories:
- How-To
tags:
- Debian
- nvidia
---

I just had to set up a multi-head system in Debian and it consumed way too much of my time.  I did see a lot of articles about it online but they all had a few common threads.

First, they all mentioned Xinerama was deprecated which initially scared me off of it.  Xinerama is deprecated but there's no replacement so for now I'm using it until it's replacement is mature.  Wayland is a system that keeps getting mentioned but seems too far off to be considered for me.

Second, they didn't clearly outline how they determined all of their display information.  Some were better than others but I need to build a real list of commands to get things done properly and repeatably since I know I will have to do this again at some point.

So, let's go over what you need to do and how I got to a working system with three side-by-side displays.

My system consists of two Nvidia GTX 470 cards.  Each card has two DVI outputs but I only have three displays.  Therefore one card has two displays connected to it (the left and right displays) and another card has one display connected to it (the center display).

What you'll want to do is first figure out which display is connected to which card and how Linux enumerates them in your system.  To do this you should be in text mode (not X!) and go to the "/sys/class/drm" directory.  Let's take a look at mine:


    
    
    
    tim@desktop:/sys/class/drm$ ls -la
    total 0
    drwxr-xr-x  2 root root    0 Jan 15 19:21 .
    drwxr-xr-x 40 root root    0 Jan 15 19:21 ..
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card0 -> ../../devices/pci0000:00/0000:00:01.0/0000:01:00.0/drm/card0
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card0-DVI-I-1 -> ../../devices/pci0000:00/0000:00:01.0/0000:01:00.0/drm/card0/card0-DVI-I-1
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card0-DVI-I-2 -> ../../devices/pci0000:00/0000:00:01.0/0000:01:00.0/drm/card0/card0-DVI-I-2
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card0-HDMI-A-1 -> ../../devices/pci0000:00/0000:00:01.0/0000:01:00.0/drm/card0/card0-HDMI-A-1
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card1 -> ../../devices/pci0000:00/0000:00:03.0/0000:02:00.0/drm/card1
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card1-DVI-I-3 -> ../../devices/pci0000:00/0000:00:03.0/0000:02:00.0/drm/card1/card1-DVI-I-3
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card1-DVI-I-4 -> ../../devices/pci0000:00/0000:00:03.0/0000:02:00.0/drm/card1/card1-DVI-I-4
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 card1-HDMI-A-2 -> ../../devices/pci0000:00/0000:00:03.0/0000:02:00.0/drm/card1/card1-HDMI-A-2
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 controlD64 -> ../../devices/pci0000:00/0000:00:01.0/0000:01:00.0/drm/controlD64
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 controlD65 -> ../../devices/pci0000:00/0000:00:03.0/0000:02:00.0/drm/controlD65
    lrwxrwxrwx  1 root root    0 Jan 15 19:21 ttm -> ../../devices/virtual/drm/ttm
    -r--r--r--  1 root root 4096 Jan 15 19:21 version
    



Here you can see that I have two cards named card0 and card1.  Card 0 has three connectors on it named card0-DVI-I-1, card0-DVI-2, and card0-HDMI-A-1.  Card 1 has three connectors on it named card1-DVI-3, card1-DVI-4, card1-HDMI-A-2.  We will need this information later to build our xorg.conf so keep it handy.

Now you'll want to determine which monitor is hooked up to which card and port.  If you are using this setup in Windows already you are not guaranteed that the cards are recognized in the same order so just forget what Windows has told you.  To figure out which is which first make sure all of your displays are connected to your cards.  Then ask Linux which displays are connected by executing this command:


    
    
    ls /sys/class/drm/*/status | xargs -I {} -i bash -c "echo -n {}: ; cat {}"
    



This will show you which connectors think that they have something connected to them.  My output looks like this:


    
    
    tim@desktop:/sys/class/drm$ ls /sys/class/drm/*/status | xargs -I {} -i bash -c "echo -n {}: ; cat {}"
    /sys/class/drm/card0-DVI-I-1/status:connected
    /sys/class/drm/card0-DVI-I-2/status:connected
    /sys/class/drm/card0-HDMI-A-1/status:disconnected
    /sys/class/drm/card1-DVI-I-3/status:connected
    /sys/class/drm/card1-DVI-I-4/status:disconnected
    /sys/class/drm/card1-HDMI-A-2/status:disconnected
    



So now I know that card0 is the card that has my two displays attached to it and card1 is the card that has my two displays attached to it.  That tells me that "DVI-I-3" is my center display and "DVI-I-1" and "DVI-I-2" are my left and right displays.  We'll figure out which is left and which is right in a minute.

For now, let's figure out which PCI device Linux considers these devices.  You can do this by running this command:


    
    
    ls -la /sys/class/drm/card?
    



My output looks like this:


    
    
    tim@desktop:~$ ls -la /sys/class/drm/card?
    lrwxrwxrwx 1 root root 0 Jan 15 19:21 /sys/class/drm/card0 -> ../../devices/pci0000:00/0000:00:01.0/0000:01:00.0/drm/card0
    lrwxrwxrwx 1 root root 0 Jan 15 19:21 /sys/class/drm/card1 -> ../../devices/pci0000:00/0000:00:03.0/0000:02:00.0/drm/card1
    



Look at the numbers directly before "drm".  They are "0000:01:00.0" for card 0 and "0000:02:00.0" for card 1.  This tells us that card 0 is PCI device 1 and card 1 is PCI device 2.  Keep these numbers handy too.

The next step is to figure out which connectors is the left and which is the right.  You can do this by guessing but let's just get a definitive answer.  Type the same command we used before to get the list of all of our displays (or press the up arrow if your shell supports that to get to the last command) but don't run it yet.  Now disconnect one display, press enter, and reconnect it.  I suggest you do this so that just in case you disconnect the display that your terminal is running on you can still run the command and see the results when you reconnect it.

In my case I got this output when my right display was disconnected:


    
    
    tim@desktop:/sys/class/drm$ ls /sys/class/drm/*/status | xargs -I {} -i bash -c "echo -n {}: ; cat {}"
    /sys/class/drm/card0-DVI-I-1/status:disconnected
    /sys/class/drm/card0-DVI-I-2/status:connected
    /sys/class/drm/card0-HDMI-A-1/status:disconnected
    /sys/class/drm/card1-DVI-I-3/status:connected
    /sys/class/drm/card1-DVI-I-4/status:disconnected
    /sys/class/drm/card1-HDMI-A-2/status:disconnected
    



Now I know that "DVI-I-1" is my right display since before it was connected and when I ran the command it was disconnected.  By elimination I know "DVI-I-2" is my right display.  If you have more displays you'll need to do this a few more times.

Let's recap.  I know that card 0 has two displays on it, its DVI-I-1 connector is my right display, its DVI-I-2 connector is my left display.  Card 1 has one display on it and its DVI-I-3 connector is my center display.  With that information I can start building my xorg.conf file.  I'll show you what I ended up with and then break it out and explain it:


    
    
    Section "ServerLayout"
    	Identifier  "X.org Configured"
    	Option      "Xinerama"            "on"
    	Screen      0  "Screen0" 0 0
    	Screen      1  "Screen1" RightOf  "Screen0"
    	Screen      2  "Screen2" LeftOf   "Screen0"
    	InputDevice    "Mouse0"           "CorePointer"
    	InputDevice    "Keyboard0"        "CoreKeyboard"
    EndSection
    
    Section "Files"
    	ModulePath   "/usr/lib/xorg/modules"
    	FontPath     "/usr/share/fonts/X11/misc"
    	FontPath     "/usr/share/fonts/X11/cyrillic"
    	FontPath     "/usr/share/fonts/X11/100dpi/:unscaled"
    	FontPath     "/usr/share/fonts/X11/75dpi/:unscaled"
    	FontPath     "/usr/share/fonts/X11/Type1"
    	FontPath     "/usr/share/fonts/X11/100dpi"
    	FontPath     "/usr/share/fonts/X11/75dpi"
    	FontPath     "/var/lib/defoma/x-ttcidfont-conf.d/dirs/TrueType"
    	FontPath     "built-ins"
    EndSection
    
    Section "Module"
    	Load  "glx"
    	Load  "dbe"
    	Load  "dri"
    	Load  "record"
    	Load  "dri2"
    	Load  "extmod"
    EndSection
    
    Section "InputDevice"
    	Identifier  "Keyboard0"
    	Driver      "kbd"
    EndSection
    
    Section "InputDevice"
    	Identifier  "Mouse0"
    	Driver      "mouse"
    	Option	    "Protocol" "auto"
    	Option	    "Device" "/dev/input/mice"
    	Option	    "ZAxisMapping" "4 5 6 7"
    EndSection
    
    Section "Device"
    	Identifier  "Device1"
    	Driver      "nouveau"
    	BusID       "PCI:1:0:0"
    	Option      "ZaphodHeads" "DVI-I-1"
    	Screen      0
    EndSection
    
    Section "Device"
    	Identifier  "Device2"
    	Driver      "nouveau"
    	BusID       "PCI:1:0:0"
    	Option      "ZaphodHeads" "DVI-I-2"
    	Screen      1
    EndSection
    
    Section "Device"
    	Identifier  "Device0"
    	Driver      "nouveau"
    	BusID       "PCI:2:0:0"
    	Option      "ZaphodHeads" "DVI-I-3"
    	Screen      0
    EndSection
    
    Section "Screen"
    	Identifier	"Screen0"
    	Device		"Device0"
    EndSection
    
    Section "Screen"
    	Identifier	"Screen1"
    	Device		"Device1"
    EndSection
    
    Section "Screen"
    	Identifier	"Screen2"
    	Device		"Device2"
    EndSection
    



Here's the explanation of each section:


    
    
    Section "ServerLayout"
    	Identifier  "X.org Configured"
    	Option      "Xinerama"            "on"
    	Screen      0  "Screen0" 0 0
    	Screen      1  "Screen1" RightOf  "Screen0"
    	Screen      2  "Screen2" LeftOf   "Screen0"
    	InputDevice    "Mouse0"           "CorePointer"
    	InputDevice    "Keyboard0"        "CoreKeyboard"
    EndSection
    



This is the server layout section that declares how the screens are laid out and what input devices we're using.  It specifies a name of "X.org Configured" since I used another configuration as a baseline for this.  You can change that name to whatever you'd like.  Then it specifies that Xinerama is on.  This means that you can drag windows back and forth between screens.  It has some downsides but they are outweighed by the convenience of placing windows anywhere across all of your displays.

Then it specifies three "screen" entries.  Later on "Screen0" will by my center screen.  "0 0" just means that that screen starts at pixel 0,0.  "Screen1" will be might right screen so it will be to the right of my center screen.  In xorg.conf language that is done with "RightOf".  "Screen2" will be my left screen so it is "LeftOf" my center screen.


    
    
    Section "Files"
    	ModulePath   "/usr/lib/xorg/modules"
    	FontPath     "/usr/share/fonts/X11/misc"
    	FontPath     "/usr/share/fonts/X11/cyrillic"
    	FontPath     "/usr/share/fonts/X11/100dpi/:unscaled"
    	FontPath     "/usr/share/fonts/X11/75dpi/:unscaled"
    	FontPath     "/usr/share/fonts/X11/Type1"
    	FontPath     "/usr/share/fonts/X11/100dpi"
    	FontPath     "/usr/share/fonts/X11/75dpi"
    	FontPath     "/var/lib/defoma/x-ttcidfont-conf.d/dirs/TrueType"
    	FontPath     "built-ins"
    EndSection
    
    Section "Module"
    	Load  "glx"
    	Load  "dbe"
    	Load  "dri"
    	Load  "record"
    	Load  "dri2"
    	Load  "extmod"
    EndSection
    



I left these two sections completely stock.  They're magic for now so don't make any changes to them.


    
    
    Section "InputDevice"
    	Identifier  "Keyboard0"
    	Driver      "kbd"
    EndSection
    
    Section "InputDevice"
    	Identifier  "Mouse0"
    	Driver      "mouse"
    	Option	    "Protocol" "auto"
    	Option	    "Device" "/dev/input/mice"
    	Option	    "ZAxisMapping" "4 5 6 7"
    EndSection
    



These two sections specify our input devices.  These are stock also so you can leave them alone too.


    
    
    Section "Device"
    	Identifier  "Device1"
    	Driver      "nouveau"
    	BusID       "PCI:1:0:0"
    	Option      "ZaphodHeads" "DVI-I-1"
    	Screen      0
    EndSection
    



Here's some more configuration we have to do.  Remember that DVI-I-1 is our right display and we are calling it "Screen1".  In this section we need to create a device for it that tells X which drive, card, and connector it uses as well as which screen it is relative to its specific graphics card.  We'll call it "Device1", use the open-source Nvidia driver called "Nouveau", tell it to use PCI device 1 (since card 0 was device 1) with the "PCI:1:0:0" string, then tell it the connector is "DVI-I-1" with the "ZaphodHeads" option, and finally that this is the first display (display 0) on this graphics card.


    
    
    Section "Device"
    	Identifier  "Device2"
    	Driver      "nouveau"
    	BusID       "PCI:1:0:0"
    	Option      "ZaphodHeads" "DVI-I-2"
    	Screen      1
    EndSection
    



For our left display we have similar settings but the connector is "DVI-I-2" and this is the second display (display 1) on this graphics card.  We also call this "Device2".


    
    
    Section "Device"
    	Identifier  "Device0"
    	Driver      "nouveau"
    	BusID       "PCI:2:0:0"
    	Option      "ZaphodHeads" "DVI-I-3"
    	Screen      0
    EndSection
    



Our center screen is "Device0" and it is on a different graphics card.  Remember card 1 was PCI device 2 so we use "PCI:2:0:0" here and specify the connector as "DVI-I-3".  This is the first display (display 0) on this graphics card.


    
    
    Section "Screen"
    	Identifier	"Screen0"
    	Device		"Device0"
    EndSection
    
    Section "Screen"
    	Identifier	"Screen1"
    	Device		"Device1"
    EndSection
    
    Section "Screen"
    	Identifier	"Screen2"
    	Device		"Device2"
    EndSection
    



Finally, these sections map our devices to name screens.  In this case DeviceX is ScreenX.  Nothing fancy goes on here.

Replace or create your xorg.conf using the steps you see here and you should be up and running in no time.  I had to change from Gnome to Xfce since Gnome had a really tall black bar that took over my center display that I couldn't get rid of.  If you run into the same problem try Xfce or another window manager instead.

Good luck and post in the comments if you found this useful or need some assistance.
