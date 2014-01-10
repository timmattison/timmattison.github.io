---
layout: post
title: "Why hashing algorithms need to use memory bound functions"
date: 2014-01-10 07:14:15 -0500
comments: true
categories: 
---

Recently I read an article called ["The Problem with Altcoins"](http://en.wikipedia.org/wiki/Memory_bound_function) and the author states this about Litecoin:

> Scrypt was designed to be a memory hog and is consequently unsuited to mining with a machine consisting almost entirely of ASIC chips, like those used for Bitcoin, and it was assumed that Scrypt-coin mining would therefore always remain in the hands of the GPU owners. This, by the way, is false. If it ever became profitable enough, an ASIC machine could be produced with a shared memory, and it would make GPUs obsolete for Scrypt-mining too.

This is something that I hear a lot and it needs to be cleared up.  There are some things [ASICs](http://en.wikipedia.org/wiki/Application-specific_integrated_circuit) are not good at.  Where ASICs really shine are problems where you can design a pipeline that the data goes through in a mostly fixed order.  [SHA256](http://en.wikipedia.org/wiki/SHA-2) is perfect for ASICs.  Each step of the algorithm requires very little storage.  If I'm counting correctly you need 64 32-bit words, 16 16-bit words, and somewhere around 22 32-bit registers.

We're talking about a really small amount of storage here.  ((64 * 4) + (16 * 2) + (22 * 4)) == 376 bytes

Even if we bump it up to 512 bytes it is still a miniscule amount of storage in the grand scheme of all of the kinds of storage that we use today (registers, L1 cache, L2 cache, L3 cache, RAM, and hard drive space).  Because of this it is cheap to make it very, very fast to read and write this data.  Physically it occupies little space so you can put the components for this storage exactly where it needs to go on the chip.

Litecoin, and several other cryptocurrencies, use [scrypt](http://en.wikipedia.org/wiki/scrypt) instead of SHA256.  This algorithm was supposed to make mining only feasibly on CPUs.  Modern GPUs though were found to have a bit of an edge over CPUs and the memory requirements weren't high enough to really take GPUs out of the running.


