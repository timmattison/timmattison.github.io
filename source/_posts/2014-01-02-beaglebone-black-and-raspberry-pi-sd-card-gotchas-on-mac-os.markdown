---
layout: post
title: "BeagleBone Black and Raspberry Pi SD card gotchas on Mac OS"
date: 2014-01-02 19:18:24 -0500
comments: true
categories: 
---

If you're using dd on the command-line to write SD card images in Mac OS then you may have run into a weird issue where the image is starting to write and then dd comes back and says:

```bash
dd: /dev/diskX: Resource busy
```

I ran into this multiple times when building Raspberry Pi and BeagleBone Black images.  What it turned out to be was that Mac OS needed me to set the block size for some reason.  I arbitrarily chose 1 MiB so my command looks like this:

```bash
sudo dd if=image-file.img of=/dev/disk3 bs=1048576
```

After specifying the bs parameter it never happened to me again.  Let me know if you ran into the same thing and whether or not this fixed it on your system.
