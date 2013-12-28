---
author: admin
comments: true
date: 2009-02-28 18:04:44+00:00
layout: post
slug: how-to-build-libwiimote-0-4-on-gentoo
title: 'How-To: Build libwiimote-0.4 on Gentoo'
wordpress_id: 192
categories:
- How-To
tags:
- Gentoo
- Linux
- sysadmin
- Wii
---

This may only be related to 64-bit Gentoo but if you're having build troubles try starting from scratch like this.  Note: These are all commands that you'll have to run directly.  There is narrative except in step 6.

Step 1: wget http://downloads.sourceforge.net/libwiimote/libwiimote-0.4.tgz?use_mirror=internap

Step 2: tar xzvf libwiimote-0.4.tgz

Step 3: cd libwiimote-0.4

Step 4: autoconf

Step 5: ./configure

Step 6: Edit src/Makefile and add "CFLAGS=-fPIC" to it.  If CFLAGS already exists just append " -fPIC" to it.

Step 7: make

Step 8: make install

Now you'll have libwiimote-0.4 built and installed.  All you need are a few applications to take advantage of it.  Stay tuned.
