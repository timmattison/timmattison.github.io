---
author: admin
comments: true
date: 2009-03-12 13:06:40+00:00
layout: post
slug: how-to-add-google-analytics-to-nanoblogger
title: 'How-To: Add Google Analytics to nanoblogger'
wordpress_id: 195
categories:
- How-To
tags:
- Google Analytics
- nanoblogger
---

Here's a quick step-by-step guide to get Google Analytics into your nanoblogger installation.

Step 1: Get your Google Analytics JavaScript code.  If you missed or skipped this step when you signed up you can replicate it if you log into your Analytics account, go to the overview page, and search for "UA".  Take the unique ID that looks like UA-0123456-7 and put it into this code (it's the bold, italicized part):

    
    <script type="text/javascript">
    var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
    </script>



    
    <script type="text/javascript">
    try {
    var pageTracker = _gat._getTracker("<strong><em>UA-0123456-7</em></strong>");
    pageTracker._trackPageview();
    } catch(err) {}</script>


If you don't put your unique ID then you will not get any stats!  Don't use UA-0123456-7!

Step 2: Back up your site and templates.  If you make a mistake in the next few steps you'll thank yourself.

Step 3: Add the code in the following templates just before the </body> tag:



	
  * templates/category_archive.htm

	
  * templates/day_archive.htm

	
  * templates/main_index.htm

	
  * templates/makepage.htm

	
  * templates/month_archive.htm

	
  * templates/permalink.htm

	
  * templates/year_archive.htm


Step 4: Regenerate your site with the update all command.  Replace "blog" with the relative directory of your blog:

    
    nb --blog-dir blog --force update all


Step 5: Check the results and push your update to your server.  You should see analytics start updating as soon as people start hitting your site.  Ifyou don't be sure to give it a few hours before reporting it to Google.
