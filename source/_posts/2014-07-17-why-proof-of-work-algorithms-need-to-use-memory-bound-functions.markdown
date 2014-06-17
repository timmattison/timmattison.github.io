---
layout: post
title: "Why proof of work algorithms need to use memory bound functions"
date: 2014-06-17 19:09:15 -0500
comments: true
categories: 
---

Recently I read an article called ["The Problem with Altcoins"](http://en.wikipedia.org/wiki/Memory_bound_function) and the author states this about Litecoin:

> Scrypt was designed to be a memory hog and is consequently unsuited to mining with a machine consisting almost entirely of ASIC chips, like those used for Bitcoin, and it was assumed that Scrypt-coin mining would therefore always remain in the hands of the GPU owners. This, by the way, is false. If it ever became profitable enough, an ASIC machine could be produced with a shared memory, and it would make GPUs obsolete for Scrypt-mining too.

This is something that I hear a lot and it needs to be cleared up.  There are some things [ASICs](http://en.wikipedia.org/wiki/Application-specific_integrated_circuit) are not good at.  Where ASICs really shine are problems where you can design a pipeline that the data goes through in a mostly fixed order.  [SHA256](http://en.wikipedia.org/wiki/SHA-2) is perfect for ASICs.  Each step of the algorithm requires very little storage.  If I'm counting correctly you need 64 32-bit words, 16 16-bit words, and somewhere around 22 32-bit registers.

We're talking about a really small amount of storage here.  ((64 * 4) + (16 * 2) + (22 * 4)) == 376 bytes

Even if we bump it up to 512 bytes it is still a miniscule amount of storage in the grand scheme of all of the kinds of storage that we use today (registers, L1 cache, L2 cache, L3 cache, RAM, and hard drive space).  Because of this it is cheap to make it very, very fast to read and write this data.  Physically it occupies little space so you can put the components for this storage exactly where it needs to go on the chip.

Litecoin, and several other cryptocurrencies, use [scrypt](http://en.wikipedia.org/wiki/scrypt) instead of SHA256.  This algorithm was supposed to make mining only feasibly on CPUs.  Modern GPUs though were found to have a bit of an edge over CPUs and the memory requirements weren't high enough to really take GPUs out of the running.

Now there is [X11](http://cpucoinlist.com/cryptocurrency-algorithms/x11/), and [CryptoNight](http://cpucoinlist.com/cryptocurrency-algorithms/cryptonight/) which are even harder to implement on ASICs...

But anyway what I really want to address is this particular section of the statement:

> an ASIC machine could be produced with a shared memory

This is a fundamental misunderstanding of computer architecture.  An ASIC is super fast because it doesn't have a pool of shared memory.  The memory is exactly where it needs to be for each stage.

Do you know what the technical term for "ASICs with shared memory" is?  A general purpose CPU.  :)  Yes, an ASIC with a pool of memory like this would still have some advantage but not the orders of magnitude we see now.  This is because it would be bound to the same limits a CPU is bound to which is the relatively slow access time of RAM versus the CPU's clock speed.

What can we do to make sure mining stays CPU bound?  We should be using [memory bound functions](https://en.wikipedia.org/wiki/Memory_bound_function) which are sometimes also called memory hard problems.  These memory bound functions should require enormous amounts of memory.  More than a Raspberry Pi has, more than a BeagleBone Black, more than a GPU.  I mean ridiculous gobs of memory.  Why not?  If the proof of work function can be adjusted, and it has to be to keep up with Moore's law, we can adjust the work to be easy in the sense that it requires few iterations but tons of memory.  As CPUs and memory get faster and people join the network we just adjust it as we always have.

X11 and CryptoNight seem like a good start but there are still problems with them.  It turns out there is one big benefit from algorithms that are not profitable on CPUs and that is that bot net operators are much less likely to waste their bot net time on mining those currencies.  I have a feeling that X11 and CryptoNight are very profitable to mine on bot nets right now.

Is there a solution to level the playing field?  Considering the bot net angle what does that even mean?  I believe that there is a solution that would allow people to participate with CPUs, not require GPU and ASIC investments, and would prevent bot net operators from profiting on mining.  I've been thinking about this for over a year and I'm getting very close to having what I think is a workable solution.  There still is one hole in it but I think that it may be better than what is out there.  Stay tuned and when I'm ready I'll post it on my blog.

BTW, I started this blog post on 2014-01-10 and just finished it on 2014-06-17 so it may be a while before I release something.  Be patient!
