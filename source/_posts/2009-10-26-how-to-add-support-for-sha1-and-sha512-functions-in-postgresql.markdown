---
author: admin
comments: true
date: 2009-10-26 22:51:03+00:00
layout: post
slug: how-to-add-support-for-sha1-and-sha512-functions-in-postgresql
title: 'How-To: Add support for SHA1 and SHA512 functions in PostgreSQL'
wordpress_id: 207
categories:
- How-To
tags:
- PostgreSQL
---

I was working on comparing some data in PostgreSQL today and I realized just how long it can take to compare millions of rows of bytea data in raw form. The bytea fields ranged from 30 bytes to several kilobytes so I figured that maybe pre-computing the hash and then comparing the hashes would be faster. PostgreSQL only has support for MD5 hashing and [we all know how reliable that can be](http://www.mathstat.dal.ca/~selinger/md5collision/). So, I fired up Google and set out to figure out the best way to do it.  It turns out that if you install pgcrypto.so via the contrib directory you can get SHA1 support and use it directly with the DIGEST function like this:

    
    CREATE OR REPLACE FUNCTION secure_hash(bytea) RETURNS character varying (128) AS $$
    BEGIN
      RETURN ENCODE(DIGEST($1, 'sha1'), 'hex');
    END;


There are some good reasons to do it this way but sometimes you want options.  If you're in an environment where installing pgcrypto.so it out of the question you may have some luck trying to do it using PL/Perl.  The caveat here is that [PL/Perl must run in trusted mode](http://www.postgresql.org/docs/8.4/interactive/plperl-trusted.html) for this to work and you must have the Digest::SHA package for Perl installed.  If you can meet those criteria here's how you get it running.

Step 1: Add _trusted_ PL/Perl support to your database

    
    createlang plperlu database_name


Step 2: Create the PL/Perl function that returns the SHA1/SHA512 hash (replace "sha512_base64" with "sha1_base64" if you want SHA1 instead)

    
    CREATE FUNCTION secure_digest(bytea) RETURNS character varying(128) AS $$
      use Digest::SHA qw(sha512_base64);
      my $digest = sha512_base64($_[0]);
      return $digest;
    $$ LANGUAGE plperlu;


Step 3: Test the function

    
    database_name=# select secure_digest('timmattison.com');
                                         secure_digest
    ----------------------------------------------------------------------------------------
     D5/O3RbUhj+1xWfIoikashEo92zCHwna69ffz+koxoQdUTxe2FP5rPmMKeUBU7FbmhQ0+WMKJbCeayhCwANGhA
    (1 row)


That's it, you're ready to start hashing/digesting away.  Is this the most efficient way to do a hash?  No.  The first method is best.  Will it work in a pinch?  Yes.  Some DBAs will not let you install random shared objects on their machine but will install functions like this for you.  Hopefully you either don't have to deal with a DBA or your DBA is nice enough to do one of these solutions.
