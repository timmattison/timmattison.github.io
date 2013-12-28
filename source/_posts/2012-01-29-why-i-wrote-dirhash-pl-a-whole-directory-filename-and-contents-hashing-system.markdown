---
author: admin
comments: true
date: 2012-01-29 22:17:15+00:00
layout: post
slug: why-i-wrote-dirhash-pl-a-whole-directory-filename-and-contents-hashing-system
title: Why I wrote dirhash.pl (a whole directory filename and contents hashing system)
wordpress_id: 631
---

Over the years I have accumulated many, many disks full of data.  Ordinarily I migrate them to my latest disk and just keep a backup or two and get rid of the old disks.  However, every once in a while I come across an old disk that has a directory structure that I really want to keep but don't have the time to go through.  Recently this happened with a large directory of old projects and to make matters worse there were multiple copies of this directory in different places.

I looked around and found some interesting stuff so I certainly didn't want to lose this time capsule of code but I now had an interesting problem.  How do I take multiple copies of what appear like identical directories and compare them so I can nuke them if they are duplicates?

I could rsync one to the other but that would involve modifying one or both copies and I wasn't excited about that since there's the chance that one is newer than the other and I could mix them up.  There are flags to check that but I didn't want to go the potentially destructive route.

I could hash each file and determine which are dupes but with over 20,000 files it becomes tedious work.  Dupe removers are OK but it still felt clunky.  I just wanted a quick yea or nay as to whether I could give these files the good old "rm -rf".

Hashing the files, dumping it to a list, and then hashing the list sounds good but there are a few problems:




	
  * If the files are in different order the results will be different but I can resolve this with "sort"

	
  * If the hashing program reports the relative path names then the file list will definitely be different and therefore the final hash will be different.  I could resolve this with some vi-fu or sed-fu but that leaves me with some work that is just lost when I need to do it again.



My solution was to write a Perl script that rolled all of that logic into one package.  It does the following:


	
  * Gets a list of files in the specified directory

	
  * Sorts that list

	
  * Hashes each entry in the list.  If it is a file it is hashed and its filename is appended to the hash, if it is a directory it is opened up and those files are run through this process recursively.

	
  * The final list of hashes and filenames itself is hashed to make sure we get one hash for the entire directory



This solves the order problem and the script removes the relative path elements from each filename automatically so that's no longer an issue as well.

If you're looking to see if two directory structures are equal (filenames all equal, no files added or removed between the two of them, and file contents equal) give it a shot and let me know how it works for you.
