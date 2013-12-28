---
author: admin
comments: true
date: 2011-06-22 16:36:03+00:00
layout: post
slug: how-to-fix-hibernate-sql-errors-when-using-restrictions-in
title: 'How-To: Fix Hibernate SQL errors when using Restrictions.in'
wordpress_id: 493
categories:
- How-To
---

Hibernate currently has some issues with Restrictions.in.  Basically if you try to pass it NULL it generates invalid SQL on at least MySQL and PostgreSQL.  I found a [blog post outlining how to fix this issue](http://www.celerity.nl/blog/2009/01/hibernate-creating-invalid-quries-from-empty-lists/) and [the accompanying JIRA issue](http://opensource.atlassian.com/projects/hibernate/browse/HHH-2776) which confirms that I'm not the only one having this problem.  Unfortunately this person's fix didn't work for me but I think that's because they're using MySQL and I'm using PostgreSQL.  Differences in the driver still make this fail on PostgreSQL.

In order to remedy this I set out to find a better solution that would hopefully work on Hibernate with any backend.  What I came up with, [with some help from StackOverflow](http://stackoverflow.com/questions/2667131/is-there-something-like-restrictions-eqtrue-false-in-criteria-api), is this:

    
    ﻿﻿public static <M> void addInRestriction(DetachedCriteria dc, String idDbField, List ids) {
    	// Is our list empty?
    	if ((ids != null) && (ids.size() > 0)) {
    		// No, add this restriction to the detached object
    		dc.add(Restrictions.in(idDbField, ids));
    	} else {
    		// Yes, our list is empty.  Make this always fail.
    		// From: http://stackoverflow.com/questions/2667131/is-there-something-like-restrictions-eqtrue-false-in-criteria-api
    		dc.add(Restrictions.sqlRestriction("(1=0)"));
    	}
    }


I put this in a class with some other Hibernate helper functions and now instead of doing this:


    
    dc.add(Restrictions.in("fieldName", fieldValues));



I do this:


    
    HibernateQueryUtils.addInRestriction(dc, "fieldName", fieldValues);



This fixed all of my Hibernate issues when passing it a NULL or even an empty list.  Hope it works for you too!
