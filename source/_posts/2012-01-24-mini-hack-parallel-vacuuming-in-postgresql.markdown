---
author: admin
comments: true
date: 2012-01-24 16:42:41+00:00
layout: post
slug: mini-hack-parallel-vacuuming-in-postgresql
title: 'Mini Hack: Parallel vacuuming in PostgreSQL'
wordpress_id: 609
categories:
- Mini Hacks
tags:
- GNU Parallel
- PostgreSQL
---

I run several development environments that I need to sync with production databases to do bug fixes and new feature development.  It's always good to vacuum these databases before using them especially if you're doing it via rsync on a live system.  If you don't you could end up with rows that are inaccessible from your indicies and get strange results from your database.

Full vacuums are slow but we can't get around it here.  What I noticed is that normally in production vacuuming the database is an I/O bound operation but in development where we're working with dedicated development machines with tons of RAM we typically end up with a lot of the database for our smaller projects (< 5 GB) in the cache.  This makes vacuuming a CPU bound process again and where there's a CPU bound process there's usually room for parallelism.

Today I decided to test out how well [GNU Parallel](http://www.gnu.org/software/parallel/) could speed up my development machine's vacuuming process and I'm happy to report that it cuts it nearly in half.  If you're running into the same issue and waiting for vacuuming is eating into your development time try this one liner (make sure you have [GNU Parallel](http://www.gnu.org/software/parallel/) installed first):


    
    
    echo "\dt" | psql DB_NAME | head -n -2 | tail -n +4 | awk ' { print $3 } ' | parallel -I {} vacuumdb -f -v -d DB_NAME -t {}
    



What this does is:




  
  * Sends the string "\dt" to PostgreSQL to list the table names
  
  * Pipes that through head and removes the last two lines (they don't contain table names)
  
  * Pipes that through tail and removes the first four lines (they also don't contain table names)
  
  * Pipes that to awk and extracts the third field (the table name)
  
  * Pipes that to parallel, runs vacuumdb with a full vacuum (-f) in verbose mode (-v), placing the table names where we included the curly bracket pair


UPDATE: Ole Tange, the author of the fantastic GNU Parallel package, wrote in with his own one-liner to do the same thing as mine.  His is a bit shorter and requires fewer pipes.  Take a look:


    
    sql -n --list-tables pg:///DB_NAME | parallel -j0 -r --colsep '\|' sql pg:///DB_NAME vacuum full verbose {2}



What his does is:




  
  * Gets a table list from GNU sql (which I had never used before, it's great to know that it exists!)
  
  * Pipes that to GNU Parallel specifying it should run as many jobs as the machine has cores (-j0), should not run if there is no input (-r), and uses the pipe character as a column separator
  
  * GNU Parallel then calls GNU sql, connects to the proper database executes a full, verbose vacuum on the second field it extracted from the table list (the table name)


I added in the "full verbose" to Ole's example so the two scripts are doing the same work instead of just a plain vacuum.

Compare that against the run time for a normal vacuum and report your results in the comments.  For databases that won't fit in your RAM it may not help that much but I'd like to hear either way.
