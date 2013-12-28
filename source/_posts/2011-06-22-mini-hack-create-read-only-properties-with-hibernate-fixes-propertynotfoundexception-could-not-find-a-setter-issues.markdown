---
author: admin
comments: true
date: 2011-06-22 18:51:58+00:00
layout: post
slug: mini-hack-create-read-only-properties-with-hibernate-fixes-propertynotfoundexception-could-not-find-a-setter-issues
title: 'Mini Hack: Create read-only properties with Hibernate (fixes "PropertyNotFoundException:
  Could not find a setter" issues)'
wordpress_id: 501
categories:
- Mini Hacks
---

Ok, this mini-hack isn't pretty but it solves an issue that I have seen come up many times in Java.  You're trying to add a method to an object that you want Hibernate to persist.  Let's assume that your object is an elevator and it has the following real properties:

- Current floor (int)
- Hours in use (int)
- Pounds in elevator (int)

You want to add a method that tells you how many days it has been in use.  Normally you'd do this:


    
    public double getDaysInUse() {
      return this.hoursInUse / 24.0;
    }



However, if you do that you get the dreaded "PropertyNotFoundException: Could not find a setter" error.  How do we fix this?  Simply with a throw away parameter like this:


    
    public double getDaysInUse(int unused) {
      return this.hoursInUse / 24.0;
    }



And there you have it.  No more error!  I'm sure there's a better way and when I find it I'll post again but for now this does the trick.
