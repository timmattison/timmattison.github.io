---
author: admin
comments: true
date: 2012-03-14 16:31:48+00:00
layout: post
slug: how-to-install-perl-debugging-in-eclipse-on-debian-ubuntu
title: 'How-To: Install Perl debugging in Eclipse on Debian/Ubuntu'
wordpress_id: 705
categories:
- How-To
tags:
- Eclipse
- Perl
---

If you're looking to use Eclipse as a debugger for your Perl scripts things can get a bit hairy quickly.  You need to do a lot of things to get it to be happy so let's step through them all rather than have you hunt for the secret sauce like I did today.

First, you'll want to [add the EPIC (Eclipse Perl Integration Component) as described on the EPIC site](http://www.epic-ide.org/download.php).  That will add support for creating Perl projects, syntax highlighting, and all that.

Next, set a breakpoint in one of your Perl scripts and try to debug it.  If you're unlucky you may get one of two error messages.  One error message wants you to install [PadWalker](http://search.cpan.org/~robin/PadWalker-1.93/PadWalker.pm) which is a Perl module that handles all of the debugging niceties for Eclipse.  To install that you can either use CPAN or apt.  Using apt is as simple as:


    
    sudo apt-get install libpadwalker-perl



Once you install PadWalker restart Perl and try to debug one of your scripts again.  If it works, you're set.  The second possible error message is below...

Now, you've come all this way and it still doesn't work.  You've probably received an error message like this:


    
    Could not create the view: Plug-in "org.eclipse.debug.ui" was unable to instantiate class "org.eclipse.debug.internal.ui.views.variables.VariablesView".



If you dig deeper you'll see errors like this:


    
    java.lang.ClassCircularityError: org/eclipse/debug/internal/ui/DebugUIPlugin



And if you dig _even_ deeper you'll see errors like this:


    
    Conflict for 'org.epic.perleditor.commands.clearMarker'



The fix for this was tricky to figure out so just follow these steps:




	
  1. Close Eclipse

	
  2. Uninstall libpadwalker-perl by running 
    
    sudo apt-get remove --purge libpadwalker-perl


	
  3. Restart Eclipse and try to set a breakpoint in a Perl script, it should fail (no breakpoint should appear)

	
  4. Close Eclipse

	
  5. Reinstall libpadwalker-perl by running 
    
    sudo apt-get install libpadwalker-perl


	
  6. Restart Eclipse, set a breakpoint, and start debugging again



At this point the variables and breakpoints should always work.  Unfortunately the expressions panel will not.  It looks like this is not supported in EPIC just yet.  But, in any case, you now have a full fledged Perl debugger so you can (mostly) stop using print statements to debug your code post mortem.

There are some quirks to note:


	
  1. "Step Over" (typically F6) does not work as expected and will step into modules.  If "Step Return" worked this wouldn't be a problem but it doesn't (see the next bullet point).  In this case if you are trying to step over a module you may have to back out and set a breakpoint where the execution will return to the script you want to debug.

	
  2. "Step Return" (typically F7) does not work as expected.  It will usually run until your script ends or hits a breakpoint.

	
  3. The console window will not let you run arbitrary Perl code so it's not a simple replacement for the expressions panel

	
  4. Perl modules (files with a .pm extension) may not appear with syntax highlighting enabled.  If you are debugging Perl modules you may want to retool your setup and run the module as a Perl script OR have Perl load your module from a file with a .pl extension.



Good luck.  Now clean up/fix that Perl code and post in the comments.
