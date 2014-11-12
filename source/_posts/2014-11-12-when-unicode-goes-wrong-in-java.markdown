---
layout: post
title: "When Unicode goes wrong in Java"
date: 2014-11-12 06:50:31 -0500
comments: true
categories: 
---

Is Unicode breaking in your application and you can't figure out where?  Maybe data from HttpClient is coming back mangled, maybe database queries via JDBC are having Unicode data replaced with question marks, maybe your [protobufs](https://code.google.com/p/protobuf/) are getting shredded, but somewhere something is eating your Unicode data and nothing you've tried fixes it.  Well...

Did you know the JVM itself has a global Unicode setting specified by the `-Dfile.encoding` option?  Most people I talked to didn't know about it, myself included, when I ran into a Unicode issue on a project.  After some great teamwork and research we found this option, set it, and everything started working again.

All we had to do was put `-Dfile.encoding=UTF8` in the script that ran our JVM and everything was fixed.  If you want to play with it [I created a test project on Github](https://github.com/timmattison/jvm-unicode-settings) that is incredibly simple and shows the right and wrong settings and what they do to a simple trademark symbol.  Otherwise, try this on your project and see if it fixes the issue.

Good luck!