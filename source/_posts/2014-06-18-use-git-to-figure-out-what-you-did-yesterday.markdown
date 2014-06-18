---
layout: post
title: "Use git to figure out what you did yesterday"
date: 2014-06-18 09:10:21 -0400
comments: true
categories: 
---

Are you a developer?  Do you have trouble remembering what you did yesterday when it is time for your daily standup?  Do you use git?  Do you commit regularly?  If you answered yes to those questions you can now quickly figure out what you did yesterday with the help of [gitrdun](https://github.com/timmattison/gitrdun).

gitrdun simply looks for git repos in your home directory, lists all of the commits in those repos from yesterday, and then prints that on the screen.  The current iteration is the "5 minute version".  It literally took 5 minutes to write.  The "5 hour version" may make the formatting a bit nicer and add some features but don't hold your breath for that to come out.

Don't want to fork the repo?  No problem, it's just a one liner anyway.  Use this alias...

```
alias gitrdun="clear ; PAGER=\"cat\" find ~ -name \".git\" -type d -exec sh -c \"cd '{}' ; echo '{}'; git log --all --since='yesterday'\" \; | less"
```

This clears the screen, uses "cat" as the pager so that the pager doesn't clear the screen between repo checks, finds all git repos, goes into their directory that is under version control, and then lists all commits on all branches from yesterday.

Enjoy!