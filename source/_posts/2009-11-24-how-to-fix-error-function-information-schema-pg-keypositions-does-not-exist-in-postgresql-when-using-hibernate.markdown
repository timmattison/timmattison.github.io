---
author: admin
comments: true
date: 2009-11-24 12:01:25+00:00
layout: post
slug: how-to-fix-error-function-information-schema-pg-keypositions-does-not-exist-in-postgresql-when-using-hibernate
title: 'How-To: Fix "ERROR: function information_schema._pg_keypositions() does not
  exist" in PostgreSQL when using Hibernate'
wordpress_id: 225
categories:
- How-To
tags:
- Hibernate
- PostgreSQL
---

I'll keep this one short.  If you're writing and debugging a Hibernate application and you're using PostgreSQL you may notice that you get the following error message when your application first connects to the database:

    
    ERROR:  function information_schema._pg_keypositions() does not exist


According to [a forum I came across](http://qaix.com/postgresql-database-development/445-710-information-schema-pg-keypositions-in-8-1-read.shtml) this is because the Hibernate team ended up depending on a function in PostgreSQL 8.0 that was dropped in 8.1+.  I needed to make some modifications to the code posted there to get it to work so here's what I came up with:

    
    CREATE FUNCTION information_schema._pg_keypositions() RETURNS SETOF integer
    LANGUAGE sql
    IMMUTABLE
    AS $pg_keypositions$
    select g.s
    from generate_series(1,current_setting('max_index_keys')::int, 1)
    as g(s)
    $pg_keypositions$;


Once you run this code in your database you'll never be bothered with that error message again.  Basically this just gets the max_index_keys value and generates a list of integers from 1 to that value, inclusive.  Hibernate can live without it but removing a repetitive error message will keep your DBA and sysadmins sane a bit longer.
