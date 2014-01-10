---
layout: post
title: "Fixing In-Page Analytics with Google Analytics"
date: 2014-01-10 08:40:24 -0500
comments: true
categories: 
---

After migrating to Octopress I started getting interested in my site's analytics again.  A co-worker told me about in-page analytics with Google Analytics and how it would show you what people were doing on your site so you could tune your layout.  We tried loading it and ran into some problems.

First, we got the "Loading..." spinner for a long time:

{% img images/in-page-analytics/loading.png %}

Then we got the "Still loading..." message that didn't inspire much confidence:

{% img images/in-page-analytics/still-loading.png %}

Finally, we got a popup that said "Problem loading In-Page Analytics":

{% img images/in-page-analytics/problem-loading-in-page-analytics.png %}

What the problem was in my case was that I told Google Analytics that I wanted to track timmattison.com but my site redirects to blog.timmattison.com.  My two options were to make my site actually be served from timmattison.com or to change my tracking code.  I opted to change my tracking code.  I'll walk you through how I did it.

NOTE: *You will lose your existing tracking data if you do this!*  If you want to keep your tracking data you'll need to find another way.  For me it wasn't a big deal because I just moved my site anyway and my analytics were reset a week or two ago already.

Here are the steps:

* Log into your analytics account

{% img images/in-page-analytics/log-into-your-analytics-account.png %}

* Click the admin button

{% img images/in-page-analytics/click-the-admin-button.png %}

* Click "View Settings"

{% img images/in-page-analytics/click-view-settings.png %}

* Scroll all the way to the bottom of the page

* Click "Delete View"

{% img images/in-page-analytics/click-delete-view.png %}

* Click "Delete View" again.  *At this point you'll lose all of your analytics history!*

{% img images/in-page-analytics/click-delete-view-again.png %}

* Click the admin button

{% img images/in-page-analytics/click-the-admin-button.png %}

* Click the property drop down and then click "Create new property"

{% img images/in-page-analytics/click-property-drop-down-and-click-create-new-property.png %}

* Re-create your property and make sure you use the site you redirect to.  In my case "blog.timmattison.com", not "timmattison.com".

* Put your new tracking code into your site.  *Don't forget to do this or tracking won't work at all!*

And that should do it.  Let me know if it works for you or if you need some help.
