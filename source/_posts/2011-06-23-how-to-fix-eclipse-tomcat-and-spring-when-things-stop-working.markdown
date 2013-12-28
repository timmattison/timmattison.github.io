---
author: admin
comments: true
date: 2011-06-23 23:15:16+00:00
layout: post
slug: how-to-fix-eclipse-tomcat-and-spring-when-things-stop-working
title: 'How-To: Fix Eclipse, Tomcat, and Spring when things stop working'
wordpress_id: 503
categories:
- How-To
---

Update 2011-12-23: I'm experiencing this error less and less lately but I've significantly streamlined the process.

We've all experienced this scenario before... you're working on a Java project with Spring, you restart your server and everything stops working. Normally you'd see something like this:

    
    INFO: Initializing ProtocolHandler ["ajp-bio-8009"]
    Jun 23, 2011 7:06:02 PM org.apache.catalina.startup.Catalina load
    INFO: Initialization processed in 654 ms
    Jun 23, 2011 7:06:02 PM org.apache.catalina.core.StandardService startInternal
    INFO: Starting service Catalina
    Jun 23, 2011 7:06:02 PM org.apache.catalina.core.StandardEngine startInternal
    INFO: Starting Servlet Engine: Apache Tomcat/7.0.14


Followed by this to let you know Spring is doing its thing:

    
    Jun 23, 2011 7:06:12 PM org.apache.catalina.core.ApplicationContext log
    INFO: Initializing Spring root WebApplicationContext


And then finally this to let you know it's ready:

    
    Jun 23, 2011 7:06:21 PM org.apache.catalina.startup.Catalina start
    INFO: Server startup in 18871 ms


In this case you get no messages about Spring. Your server starts up really quickly but nothing runs. Everything returns a 404. This is bad.

If you're feeling like you want to spend a few hours figuring it out then hats off to you.  I, on the other hand, have never seen a reliable fix for this other than the sledgehammer method I'm about to show you below.

Caution!  You are about to do something drastic that works for me but may not work for you.  It is possible that by doing this you will break lots of things and lose data.  This is a complete clean start for your server.  Make a backup, make sure you can restore that backup, and proceed with caution.  When in doubt, bail out.



	
  1. Stop your servlet container

	
  2. Close Eclipse.

	
  3. Go to your workspace in a console and navigate to the .metadata/.plugins directory

	
  4. Forcibly remove the org.eclipse.wst.server.core directory.  This will delete all of your entries in "Servers", be careful!  I use

    
    rm -rf org.eclipse.wst.server.core/




	
  5. Restart Eclipse

	
  6. Recreate your servers and launch your application.  You should be good to go.


I did say it wasn't elegant, didn't I?  Either way this has saved me dozens of hours of debugging.  I've had some Java gurus suggest a lot of things to try but none of them worked 100% of the time.  This one has never failed me.
