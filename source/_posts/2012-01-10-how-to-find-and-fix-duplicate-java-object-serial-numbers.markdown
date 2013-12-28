---
author: admin
comments: true
date: 2012-01-10 14:43:03+00:00
layout: post
slug: how-to-find-and-fix-duplicate-java-object-serial-numbers
title: 'How-To: Find and fix duplicate Java object serial numbers'
wordpress_id: 512
categories:
- How-To
tags:
- Java
---

In Java making your objects serializable is often required to work with certain libraries ([ORM](http://en.wikipedia.org/wiki/Object-relational_mapping), [GWT-RPC](http://code.google.com/webtoolkit/doc/latest/tutorial/RPC.html), etc).  It's tempting when Eclipse tells us that our object is missing a unique identifier to have it generate one on the fly.  However, in practice what happens sometimes in the field is that you'll create a serializable class and then copy it to make a new class.  When you do this you're inadvertently copying the objects "serialVersionUID" field.

Why is this an issue?  Well, the serialVersionUID is supposed to be a universal identifier.  If it's not universal then you're asking for trouble.  When you deserialize a new version of this object or try to deserialize an object to the wrong object type you can end up with strange results or have your application crash altogether.

How do we fix it?  I've written a command-line one liner (even though it looks like three lines on the site) that will print out a list of the files that have duplicated serialVersionUID values.  Here it is:


    
    
    grep -r serialVersionUID * | grep -o "private.*" | sort | uniq -d | sed 's/^.*=//' | sed 's/;//' | sed 's/^ //' | sed 's/^-/\\\\-/' | xargs -I PATTERNS grep -r PATTERNS . | cut -f1 -d ':'
    



Go into each of these files, remove their serialVersionUID field, and regenerate them.  Don't concern yourself with which ones overlap unless you already have serialized versions of these objects lying around.  If you do have serialized versions you should remove the field and reserialize your objects into your data store without it.  Then you can try to generate new values and again reserialize them into the data store.  DO NOT do this in production, always do it in a test environment to make sure that nothing breaks.  You do have unit tests that'll test these things, right?  :)

Post in the comments if you find this useful and keep hacking!
