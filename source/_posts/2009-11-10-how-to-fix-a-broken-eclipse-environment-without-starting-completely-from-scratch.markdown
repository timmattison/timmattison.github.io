---
author: admin
comments: true
date: 2009-11-10 13:46:58+00:00
layout: post
slug: how-to-fix-a-broken-eclipse-environment-without-starting-completely-from-scratch
title: 'How-To: Fix a broken Eclipse environment without starting completely from
  scratch'
wordpress_id: 220
categories:
- How-To
tags:
- Eclipse
---

Over time my Eclipse environment has become quiet a bit crufty.  I have a bunch of errors from plugins that I installed that didn't work properly and yesterday my environment completely stopped building my Java projects.  When I tried to export a JAR I got these two messages:

JAR creation failed. See details for additional information.

class file(s) on classpath not found or not accessible

There are also some other errors you may see that indicate you should probahly rebuild your environment:

No property tester contributes a property projectPersistentProperty org.eclipse.team.core.repository to type class org.eclipse.core.internal.resources.Project

org.eclipse.core.runtime.CoreException: No property tester contributes a property projectPersistentProperty org.eclipse.team.core.repository to type class org.eclipse.core.internal.resources.Project

java.util.zip.ZipException: error in opening zip file

An internal error occurred during: "Initializing Java Tooling"

An error occurred while loading the manifest

In my case the class files that it couldn't find were classes that Eclipse was supposed to build.  After checking everything I couldn't figure it out so I decided that it was time to start fresh.  What I wanted to do was nuke the whole environment but not have to hunt around for all the JARs that I had in my user-defined libraries.  In the future I'll put all of those files in a directory for each library but right now I needed a fix so I could get back to work.

Here are the steps to get a fresh start without reinstalling and without losing your user libraries:



	
  * Step 1: Quit Eclipse

	
  * Step 2: Make a backup of your workspace

	
  * Step 3: Go into your workspace on the command-line and run

    
    mv .metadata .metadata-old




	
  * Step 4: Restart Eclipse.  Don't panic!  Everything is only gone temporarily.  This step forces Eclipse to build a fresh .metadata directory.

	
  * Step 5: Quit Eclipse

	
  * Step 6: Restore your user-defined libraries on the command-line by running

    
    cp .metadata-old/.plugins/org.eclipse.core.runtime/.settings/org.eclipse.jdt.core.prefs .metadata/.plugins/org.eclipse.core.runtime/.settings/org.eclipse.jdt.core.prefs




	
  * Step 7: Restart Eclipse and import your projects back into the workspace


If you are still having trouble and cannot build your code or export JARs make sure you right-click on a project that is having that problem, select "Java Build Path", then select "Libraries".  Any libraries marked with a red X are almost certainly your issue.  Resolve this issue (or remove them if they're not needed) and you'll be almost right where you left off but with a fresh, clean environment.

You will lose settings like the location of your Android SDK if you use that, or the location where the save dialogs open up, but if you can deal with that this is a great way to start over.  Once you're comfortable with your setup you can remove the old metadata by running this on the command-line

    
    rm -rf .metadata-old


Don't delete your backup copy though!  You never know when you'll need it.
