---
author: admin
comments: true
date: 2012-02-07 18:33:46+00:00
layout: post
slug: tip-fix-basic-build-issues-when-using-maven
title: 'Tip: Fix basic build issues when using Maven'
wordpress_id: 681
categories:
- Hadoop
- Tips
tags:
- build
- compile
- Hadoop
- Maven
---

When trying to build Hadoop with Maven today I got this ugly error message:


    
    
    
    [INFO] Scanning for projects...
    [INFO] ------------------------------------------------------------------------
    [ERROR] FATAL ERROR
    [INFO] ------------------------------------------------------------------------
    [INFO] Error building POM (may not be this project's POM).
    
    
    Project ID: org.apache.hadoop:hadoop-project
    POM Location: /home/tim/subversion/hadoop-trunk/hadoop-project/pom.xml
    Validation Messages:
    
        [0]  For dependency Dependency {groupId=jdk.tools, artifactId=jdk.tools, version=1.6, type=jar}: system-scoped dependency must specify an absolute path systemPath.
    
    
    Reason: Failed to validate POM for project org.apache.hadoop:hadoop-project at /home/tim/subversion/hadoop-trunk/hadoop-project/pom.xml
    
    
    [INFO] ------------------------------------------------------------------------
    [INFO] Trace
    org.apache.maven.reactor.MavenExecutionException: Failed to validate POM for project org.apache.hadoop:hadoop-project at /home/tim/subversion/hadoop-trunk/hadoop-project/pom.xml
    	at org.apache.maven.DefaultMaven.getProjects(DefaultMaven.java:404)
    	at org.apache.maven.DefaultMaven.doExecute(DefaultMaven.java:272)
    	at org.apache.maven.DefaultMaven.execute(DefaultMaven.java:138)
    	at org.apache.maven.cli.MavenCli.main(MavenCli.java:362)
    	at org.apache.maven.cli.compat.CompatibleMain.main(CompatibleMain.java:60)
    	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
    	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    	at java.lang.reflect.Method.invoke(Method.java:616)
    	at org.codehaus.classworlds.Launcher.launchEnhanced(Launcher.java:315)
    	at org.codehaus.classworlds.Launcher.launch(Launcher.java:255)
    	at org.codehaus.classworlds.Launcher.mainWithExitCode(Launcher.java:430)
    	at org.codehaus.classworlds.Launcher.main(Launcher.java:375)
    Caused by: org.apache.maven.project.InvalidProjectModelException: Failed to validate POM for project org.apache.hadoop:hadoop-project at /home/tim/subversion/hadoop-trunk/hadoop-project/pom.xml
    	at org.apache.maven.project.DefaultMavenProjectBuilder.processProjectLogic(DefaultMavenProjectBuilder.java:1077)
    	at org.apache.maven.project.DefaultMavenProjectBuilder.buildInternal(DefaultMavenProjectBuilder.java:880)
    	at org.apache.maven.project.DefaultMavenProjectBuilder.buildFromSourceFileInternal(DefaultMavenProjectBuilder.java:508)
    	at org.apache.maven.project.DefaultMavenProjectBuilder.build(DefaultMavenProjectBuilder.java:200)
    	at org.apache.maven.DefaultMaven.getProject(DefaultMaven.java:604)
    	at org.apache.maven.DefaultMaven.collectProjects(DefaultMaven.java:487)
    	at org.apache.maven.DefaultMaven.collectProjects(DefaultMaven.java:560)
    	at org.apache.maven.DefaultMaven.getProjects(DefaultMaven.java:391)
    	... 12 more
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: < 1 second
    [INFO] Finished at: Tue Feb 07 13:30:39 EST 2012
    [INFO] Final Memory: 3M/361M
    [INFO] ------------------------------------------------------------------------
    



Tsk, tsk on me.  All I had to do was set my JAVA_HOME variable.  Not sure how to set yours?  Just do this:


    
    
    export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")
    



I'm actually running 64-bit Debian Wheezy so I had to do some other things to get my system prepped.  I needed to get off of Maven 2 and onto Maven 3, add the JDK, install the protocol buffers compiler, install zlib and its development files, and use a slightly different path.  Here's what I did:


    
    
    sudo apt-get install maven openjdk-6-jdk libprotoc-dev protobuf-compiler zlib1g-dev
    export JAVA_HOME="/usr/lib/jvm/java-6-openjdk-amd64/
    



After that Maven started humming away when I ran:


    
    
    mvn compile -Pnative
    



Good luck!  Post in the comments if you run into trouble.
