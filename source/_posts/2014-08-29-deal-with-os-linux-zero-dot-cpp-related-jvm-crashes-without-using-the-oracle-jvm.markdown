---
layout: post
title: "Deal with os_linux_zero.cpp related JVM crashes without using the Oracle JVM"
date: 2014-08-29 12:39:51 -0400
comments: true
categories: 
---
While running some relatively simple Java code on my Raspberry Pi I kept running into complete JVM crashes.  These weren't simple application crashes that I can quickly debug.  It really was the JVM that my code was running on that was crashing.

The error message I received was similar to this:

``` console
#
# A fatal error has been detected by the Java Runtime Environment:
#
#  Internal Error (os_linux_zero.cpp:285), pid=10344, tid=3061261424
#  fatal error: caught unhandled signal 11
#
# JRE version: OpenJDK Runtime Environment (7.0_65-b32) (build 1.7.0_65-b32)
# Java VM: OpenJDK Zero VM (24.65-b04 mixed mode linux-arm )
# Failed to write core dump. Core dumps have been disabled. To enable core dumping, try "ulimit -c unlimited" before starting Java again
#
# An error report file with more information is saved as:
# /home/pi/hs_err_pid10344.log
#
# If you would like to submit a bug report, please include
# instructions on how to reproduce the bug and visit:
#   http://icedtea.classpath.org/bugzilla
#
Aborted
```

I dug and dug and dug and couldn't figure out what was going on.  The most common fix that I saw was to switch to the Oracle JVM.  For this project I didn't want to do that so I scoured the net and came up with the following two options.

For reference, my original command line was very simple.  It was just `java -jar test.jar`.

NOTE: There may be performance issues with both of these options.  I have not profiled them to see the difference.  Then again, having your JVM crash can arguably be the lowest performance option possible.

Option 1: Add the `-XX:+PrintCommandLineFlags` option to your command line.  This changed my command line to `java -XX:+PrintCommandLineFlags -jar test.jar`.  Immediately the problem went away.

Option 2: Add the `-jamvm` option to your command line.  This changed my command line to `java -jamvm -jar test.jar`.  Again, immediately the problem went away

What is really happening behind the scenes?  That gets complex quickly and I still don't know the full answer.  It turns out that this is a known but ignored bug in OpenJDK's Zero VM.  When you run `java -version` you can see if you're running Zero VM or not like this:

``` console
pi@raspberrypi ~ $ java -version
java version "1.7.0_65"
OpenJDK Runtime Environment (IcedTea 2.5.1) (7u65-2.5.1-2~deb7u1+rpi1)
OpenJDK Zero VM (build 24.65-b04, mixed mode)
```

I don't know why option 1 works.  My guess is that that option disables some kind of optimization.  Looking at [what I think is the corresponding code in Hotspot](http://cr.openjdk.java.net/~gbenson/zero-10/hotspot/src/os_cpu/linux_zero/vm/os_linux_zero.cpp.html) on line 283 I can see that `pthread_attr_getstack` is used.  The [pthread_attr_getstack documentation](http://pubs.opengroup.org/onlinepubs/009695399/functions/pthread_attr_getstack.html) says that it can only fail with `EINVAL` for one reason.  It must be that `addr` "does not refer to an initialized thread attribute object".  I don't have any clue how to fix this though.

Option 2 works because it switches over to [JamVM](http://jamvm.sourceforge.net/).  You can check your JamVM version like this:

``` console
pi@raspberrypi ~ $ java -jamvm -version
java version "1.7.0_65"
OpenJDK Runtime Environment (IcedTea 2.5.1) (7u65-2.5.1-2~deb7u1+rpi1)
JamVM (build 1.6.0-devel, inline-threaded interpreter with stack-caching)
```

So, if you're in a similar bind and don't want to install and switch to Oracle's JVM give these options a try.  Post your results in the comments below.