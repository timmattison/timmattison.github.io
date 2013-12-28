---
author: admin
comments: true
date: 2012-02-28 21:32:21+00:00
layout: post
slug: tip-a-quick-primer-on-waiting-on-multiple-threads-in-java
title: 'Tip: A quick primer on waiting on multiple threads in Java'
wordpress_id: 697
categories:
- Tips
tags:
- Java
---

Last night I was writing some code to do some performance testing on HDFS.  I noticed that single threaded performance wasn't anywhere near as good as I expected and my CPUs were spending most of their time idle.  I decided to add some threads into the process to see if a multi-threaded speed test would consume some of that idle CPU.  It worked as expected so I figured I would share some basic knowledge on how to I started up multiple threads, had them do their work, waited for them to finish without polling, and then recorded the total duration to calculate my statistics.

What you'll need to do first is decide what you want to do in the processing thread.  This code will go into a Java Runnable like this:


    
    
    Runnable runnable = new Runnable() {
    	@Override
    	public void run() {
    		// Do something exciting here
    	}
    };
    



Next you'll need to decide how many threads you want to run.  If you wanted to run four threads you could do this:


    
    
    int threadCount = 4;
    
    for (int threadLoop = 0; threadLoop < threadCount; threadLoop++) {
    	// XXX - Put the runnable block from above right here
    
    	// Create a new thread
    	Thread thread = new Thread(runnable);
    
    	// Add the thread to our thread list
    	threads.add(thread);
    
    	// Start the thread
    	thread.start();
    }
    



That will start four threads.  It's best to use a variable so you can update it and use it in other places like calculating your statistics.  Now let's wait for all the threads to finish:


    
    
    // Loop through the threads
    for (Thread thread : threads) {
    	try {
    		// Wait for this thread to die
    		thread.join();
    	} catch (InterruptedException e) {
    		// Ignore this but print a stack trace
    		e.printStackTrace();
    	}
    }
    



Finally, you'll want to time all of this.  I do something very simple here.  Before all of the code I do this:


    
    
    long startTime = new Date().getTime();
    



After all of the code I do this:


    
    
    long endTime = new Date().getTime();
    long durationInMilliseconds = endTime - startTime;
    



With all of that in place you can now measure how long your code ran and then calculate important metrics about it.  For example, if this code did 10,000 operations per thread and ran with 4 threads you would then take the duration and divide that by 40,000 and you'd get an idea of how many milliseconds it took per operation.  Just make sure you use doubles or you'll lose all of your precision due to coercion.  Do this (assuming that your number of operations is stored in a variable called "operations"):


    
    
    double millisecondsPerOperation = (double) durationInMilliseconds / (double) operations;
    double operationsPerMillisecond = (double) operations / (double) durationInMilliseconds;
    



These are just reciprocals of each other but sometimes one value is a lot easier to understand than the other so I usually calculate them both.

Now that you have those statistics you can try different thread counts, optimize code/loops, etc.  Good luck!  Post in the comments with any ideas and/or issues.
