---
author: admin
comments: true
date: 2012-01-09 21:31:08+00:00
layout: post
slug: mini-hack-approximating-the-size-of-a-java-object
title: 'Mini hack: Approximating the size of a Java object'
wordpress_id: 590
categories:
- Mini Hacks
tags:
- Java
---

Finding the size of an object or data structure used to be simple in "the good old days".  You could just use the sizeof function and it'd spit out something that usually made sense.  In Java there's nothing that seems to do it quite that simply.  I've seen some solutions that involve using Java instrumentation but they have interesting quirks that can confuse things considerably.  For example, using it to obtain the size of a String object will always show 32 bytes as I found out by reading a thread on StackOverflow.

In any case I wanted something simple that would do the job.  My requirements were that there was minimal or zero setup, results were fairly close to the actual memory footprint, and that it work consistently unless I was using some kind of very strange data structure.  Here's what I came up with:


    
    
    try {
      // Get a ByteArrayOutputStream to catch the output of the
      //   ObjectOutputStream without going to disk
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
    
      // Get an ObjectOutputStream so we can dump the entire
      //   object at one shot
      ObjectOutputStream oos = new ObjectOutputStream(baos);
    
      // Write the object
      oos.writeObject(o);
    
      // Close the stream
      oos.close();
    
      // Query the ByteArrayOutputStream for its size
      return baos.size();
    } catch (IOException e) {
      // Something went wrong.  Print the stack trace.
      e.printStackTrace();
    
      // Return -1 so the caller knows we failed
      return -1;
    }
    



Put this into your standard utility class as a static method and call it whenever you're curious about memory usage.  The output of this should be a little higher than the actual in-memory usage so you can consider this a high water mark for your object's size.

Post in the comments if you end up using it!
