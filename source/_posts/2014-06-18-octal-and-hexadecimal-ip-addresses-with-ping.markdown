---
layout: post
title: "Octal and hexadecimal IP addresses with ping"
date: 2014-06-18 07:12:14 -0400
comments: true
categories: 
---
Have you ever seen a system print out an IP address like this?

```
Disconnected from 010.000.001.133
```

If you try to ping this IP address you'll get quite interesting results.  What the IP address should be is 10.0.1.133 but what ping reports that it is if you run the command with those leading zeroes included looks very odd.

```
timmattison$ ping 010.000.001.133
PING 010.000.001.133 (8.0.1.133): 56 data bytes
Request timeout for icmp_seq 0
```

See that `8.0.1.133` IP address that it is trying to reach?  It turns out that if you put leading zeroes into an IP address that you pass to `ping`, and possibly other network tools, it treats those numbers as [octal](https://en.wikipedia.org/wiki/Octal).  Octal isn't something most end-users deal with unless they're reminiscing about their old [Compuserve](https://en.wikipedia.org/wiki/CompuServe) addresses.

In any case, if you find yourself trying to ping a machine with an IP address that has leading zeroes make sure you remove them!

This got me wondering what other weird things ping might do with IP addresses so I played around a bit and saw that it actually allows you to enter them in hex as well.  This is useful for IPv6 but really strange for IPv4.  Try it out and try to ping the above address with the first octet in hex:

```
timmattison$ ping 0xa.0.1.133
PING 0xa.0.1.133 (10.0.1.133): 56 data bytes
```

Sure enough it converts `0xa` into `10`.  I'm not sure I'll ever use that feature but its good to know what ping does to its input in the even that some other weird situation pops up.