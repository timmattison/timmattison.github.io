---
author: admin
comments: true
date: 2011-09-13 22:04:39+00:00
layout: post
slug: mini-hack-find-java-code-abusing-stdout
title: 'Mini Hack: Find Java code abusing stdout'
wordpress_id: 529
categories:
- Mini Hacks
tags:
- Java
---

I found myself recently trying to determine where a particular piece of code was that was polluting my stdout stream with hundreds of unwanted messages.  This seemed like an impossible task since I could only guess that there was a line of code somewhere that was calling System.out.println(clazz.toString()) or something similar.  I searched the codebase high and low and found nothing.

After some Googling I came up with an alternate approach.  I disabled all of the code I could find that printed to stdout (actually this was easy since I do it all with one function so I just disabled that) and verified that I my application was still spewing out noise.  Sure enough it was and then I added a tiny chunk of code to my application's initialization.  That code takes over stdout and forcibly causes a NullPointerException.  It's unconventional and I probably could've just put in a breakpoint but I wanted to make sure it crashed and spat out something I could work with immediately.

Here is what I did:


    
    System.setOut(new PrintStream(new OutputStream() {
      @Override
      public void write(int arg0) throws IOException {
        String forcedCrash = null;
        forcedCrash = forcedCrash + " ";
      }
    }));



Let me know in the comments if you get a chance to use this to debug a project.  Since I came up with this technique I find myself putting it in action a lot more often than I thought I would so hopefully it'll be useful for you too.
