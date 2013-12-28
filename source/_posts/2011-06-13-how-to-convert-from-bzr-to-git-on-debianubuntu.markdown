---
author: admin
comments: true
date: 2011-06-13 21:41:14+00:00
layout: post
slug: how-to-convert-from-bzr-to-git-on-debianubuntu
title: 'How-To: Convert from bzr to git on Debian/Ubuntu'
wordpress_id: 407
categories:
- How-To
tags:
- bzr
- Debian
- git
- sysadmin
- Ubuntu
---

For a brief period of time I was totally sold on [Bazaar](http://bazaar.canonical.com/en/) (AKA bzr) for my distributed version control needs.  Then I found out about [github](http://github.com) and the rest is history.  bzr is neat and has it's advantages but github is just too hot a community to pass up.  Building skills on both would be great but realistically I'm only going to get good at the one that I use consistently.  So, git wins for me.

When I was using bzr I accumulated a bunch of code in bzr repositories that I now want to convert to git.  There are a bunch of tutorials out there on how to do this but they all didn't work for some reason or another.  Here I have step by step instructions on how to move from bzr to git, with any branches you have created, that should work without fuss on both Debian and Ubuntu.

These instructions assume the following:



	
  1. You have a bzr repository that you'd like to become your master git branch that currently resides in a directory called bzr-master.

	
  2. You have one branch you'd like to bring into git as "branch-1" that currently resides in a directory called bzr-branch-1.

	
  3. You want to call your new repository git-repo.


Obviously, you will have different master and branch names so fill those in appropriately.  They are bold faced and italicized where you will need to replace the names.

	
  * Step 1: Install bzr.

    
    sudo apt-get install bzr




	
  * Step 2: Install bzr-fastimport.

    
    sudo apt-get install bzr-fastimport




	
  * Step 3: Go to the parent directory that contains your two bzr branches in your shell.

	
  * Step 4: Create the new git repository and stay in that directory

    
    mkdir <strong><em>git-repo</em></strong> ; cd <strong><em>git-repo</em></strong> ; git init .




	
  * Step 5: Pull the master branch into git

    
    bzr fast-export --export-marks=../marks.bzr ../<strong><em>bzr-master</em></strong> | git fast-import --export-marks=../marks.git




	
  * Step 6: Pull branch-1 into git

    
    bzr fast-export --marks=../marks.bzr --git-branch=branch-1 ../<strong><em>bzr-branch-1</em></strong> | git fast-import --import-marks=../marks.git --export-marks=../marks.git





Now if you do a git branch you should see the master branch as well as branch-1.  Check the logs to make sure they're complete, nuke the marks.bzr and marks.git files, and then push them to github!  :)
