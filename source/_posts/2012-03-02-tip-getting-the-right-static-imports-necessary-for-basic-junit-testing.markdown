---
author: admin
comments: true
date: 2012-03-02 13:02:47+00:00
layout: post
slug: tip-getting-the-right-static-imports-necessary-for-basic-junit-testing
title: 'Tip: Getting the right static imports necessary for basic JUnit testing'
wordpress_id: 699
categories:
- Tips
tags:
- Java
---

I've written plenty of JUnit tests in the past but usually I'm building onto an existing codebase of tests.  In the past few days I've been playing around with Unicode and wanted to copy a code snippet from a Hadoop book to see how everything looks in the debugger.  When I entered the code I realized that I was missing some methods that I needed to complete the tests.

Specifically I was trying to use assertThat() and is() but didn't know where to find them.  After a bit of Googling I found the two static imports that I needed to copy the code without qualifying assertThat() as Assert.assertThat() and the same goes for is().  They are:


    
    
    import static org.hamcrest.CoreMatchers.is;
    import static org.junit.Assert.assertThat;
    



I have to admit that org.hamcrest is a bit less obvious than I would have liked.  :)
