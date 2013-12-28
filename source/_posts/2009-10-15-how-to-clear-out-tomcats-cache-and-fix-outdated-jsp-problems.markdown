---
author: admin
comments: true
date: 2009-10-15 18:38:40+00:00
layout: post
slug: how-to-clear-out-tomcats-cache-and-fix-outdated-jsp-problems
title: 'How-To: Clear out Tomcat''s cache and fix outdated JSP problems'
wordpress_id: 204
categories:
- How-To
tags:
- Java
- sysadmin
- Tomcat
---

I was updating a web application last night and after uploading the WAR file to my server, moving it into the servlet container's (Tomcat's) webapps directory, and restarting it I still got an old copy of a JSP showing up.  This was a particularly bad problem because I had refactored some classes and now even the old, previously valid JSP would fail to run since the imports were now invalid.  I went so far as removing the webapps directory entirely and still couldn't get it to work.  I came back the next day and all was fixed.  I was safe, I thought...

The problem is this: My desktop's clock was correct and my server's clock was behind by a few minutes.  Tomcat keeps a cached copy of your JSPs in its "work" folder and only clears them out when it sees that the code in "webapps" is newer than the code in "work".  The exception to that rule is when the code in "webapps" has a date in the future.  When that happens it doesn't update the code until that date passes.  This could be useful in some instances but for me it was a real problem.

My workaround is pedantic but that's my style.  This assumes your Tomcat works in the /var/lib/tomcat-6 directory.  If not, change that path accordingly.  We'll also assume that your web application is called "app-with-jsps.war".  Change that, too, if you need to.  Here's what I do:

Step 1: Remove the WAR file from the webapps directory

    
    rm -rf /var/lib/tomcat-6/webapps/app-with-jsps*


Step 2: Remove the application's work directory.  The two stars in that command-line traverses the Catalina/localhost path on my machine but on your machine the names could be different.  This makes sure it gets the files and, since it has no trailing wildcards, it pretty safe since it can only delete a directory called "app-with-jsps".

    
    rm -rf /var/lib/tomcat-6/work/*/*/app-with-jsps


Step 3: Copy your WAR file to the webapps directory

    
    cp app-with-jsps.war /var/lib/tomcat-6/webapps


Step 4: Restart the servlet container

    
    /etc/init.d/tomcat-6 restart


That should fix your cache problems.  A better long term solution is to sync your clocks but these steps come in handy when that's either difficult to do or completely out of your control.  Enjoy!
