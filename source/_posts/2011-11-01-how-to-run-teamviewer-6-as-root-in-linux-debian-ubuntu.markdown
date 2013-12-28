---
author: admin
comments: true
date: 2011-11-01 19:40:16+00:00
layout: post
slug: how-to-run-teamviewer-6-as-root-in-linux-debian-ubuntu
title: 'How-To: Run TeamViewer 6 as root in Linux (Debian, Ubuntu)'
wordpress_id: 531
categories:
- How-To
tags:
- Debian
- TeamViewer
- Ubuntu
---

If you are reading this article I, unlike the rest of the Internet, will assume you have a good reason to run Teamviewer as root.  I won't spend my time trying to talk you out of it.  :)

You can accomplish this in just a few quick steps:

1) Install Teamviewer 6
2) Try to run it as root, if you get the message "TeamViewer must not be executed as root!" go on to step 3.  Otherwise, you are already set up.
3) Open /opt/teamviewer/teamviewer/6/bin/wrapper in your favorite text editor
4) Look for a line similar to this: "validate_user                  # die if root"
5) Put a single hash/octothorpe in front of the line and save it so it looks like "#validate_user              # die if root".
6) Restart Teamviewer as root and you're good to go

Post in the comments if you used this tip and let me know if you run into any trouble.  This should work on other versions of Linux but the files may be in different places.  If you want to find your operating system's copy of "wrapper" try running "locate wrapper | grep -i teamviewer" and it should come up in the list.  If you don't have locate installed you can try the much slower: "find / -name "wrapper" | grep -i teamviewer" to do the same thing.  Good luck!
