---
layout: post
title: "Reading resources in Java"
date: 2013-12-30 11:02:52 -0500
comments: true
categories: 
---
Reading resources in Java has always been a mystery to me.  It's not because I don't understand how to do it but more that I do it so infrequently that
I always forget what I need to do.  In Java's defense once you understand what you need to do it's actually very simple.  I've run into this issue
many times in a professional context.  Usually it is just trying to load a simple resource so I can keep it inside the JAR file I'm delivering to a
client.

The sixty second explanation of how to do this is as follows.  If you're using an IDE and have a standard project layout you can simply follow these steps:

1. Under your src/main directory create a new directory called "resources"
2. Put your static file in the "resources" directory.  For example, "jquery-1.10.2.min.js" if you want to serve this file from an embedded web server.
3. When you want to load the file do this:

The long way:

``` java
URL jqueryUrl = getClass().getResource("/jquery-1.10.2.min.js");
InputStream jqueryInputStream = jqueryUrl.openStream();
String jquery = IOUtils.toString(jqueryInputStream);
```

The short way:

``` java
String jquery = IOUtils.toString(getClass().getResource("/jquery-1.10.2.min.js").openStream());
```

And that's it!  I recommend the long way because you can step through it if the file isn't found and get some insight into what happened rather than
just getting an opaque NullPointerException.  If you don't have the file in the directory, or you have the wrong file name, after attempting to get
the jqueryUrl it'll just be NULL.  If that happens just check to make sure that you have the file name correct, resources is spelled correctly, and
it is in the right location.

Good luck!  Post in the comments if you find this useful or if you have trouble.
