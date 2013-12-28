---
author: admin
comments: true
date: 2009-11-12 19:20:47+00:00
layout: post
slug: how-to-fix-this-selection-is-not-within-a-valid-module-errors-in-eclipse-when-refactoring-web-projects
title: 'How-To: Fix "This selection is not within a valid module" errors in Eclipse
  when refactoring web projects'
wordpress_id: 221
categories:
- How-To
tags:
- Eclipse
- Java
---

After rebuilding my Eclipse environment I had the need to refactor one of my web projects.  Once I refactored it using the usual Eclipse method (right-click on the project -> Refactor -> Rename) I wasn't able to start the project on my web server.  The error message I got was

    
    This selection is not within a valid module


Here are the steps to resolve this issue:

Step 1: Select the "Servers" tab in Eclipse

Step 2: Right-click on your server and select "Delete"

Step 3: If prompted, make sure all options are checked ("Delete unused server configuration(s)", "Delete running server(s)", and "Stop server(s) before deleting") and click OK

Step 4: Close Eclipse

Step 5: Go into your project's .settings directory and edit the org.eclipse.wst.common.component file

Step 6: Change the following values to the name of your refactored project:

    
    wb-module deploy-name
    property name="context-root" value


Step 7: Restart Eclipse and re-run your project

Now your project should deploy to your servlet container properly.  Any time you refactor a web project in Eclipse you may need to do this so keep these instructions around if you think you'll need to do it often.
