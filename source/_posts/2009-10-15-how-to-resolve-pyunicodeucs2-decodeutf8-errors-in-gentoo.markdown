---
author: admin
comments: true
date: 2009-10-15 13:37:59+00:00
layout: post
slug: how-to-resolve-pyunicodeucs2-decodeutf8-errors-in-gentoo
title: 'How-To: Resolve PyUnicodeUCS2_DecodeUTF8 errors in Gentoo'
wordpress_id: 202
categories:
- How-To
tags:
- Gentoo
- Linux
- sysadmin
---

Just yesterday I was doing an upgrade of my Tomcat installation (and nearly everything on my virtual machine for that matter) and re-emerging the Tomcat servlet API kept giving me the error "unresolved symbol PyUnicodeUCS2_DecodeUTF8" and told me to re-emerge pyxml.  It turns out that pyxml is fine and thanks to [a lone comment](http://bugs.gentoo.org/show_bug.cgi?id=282312#c2) on the Gentoo bug tracker I found a solution. Gentoo may break from time to time but their bug tracker is truly gold when you hit upon the right bug and the right comments.

Step 1: Run "emerge --sync"

Step 2: Update your packages as usual (I run "emerge --update --deep --newuse -av world" but people tell me I'm crazy, it can break LOTS of things if you don't know what you're doing)

Step 3: Wait for the unresolved symbol error to halt the emerge process and then run "emerge -1 javatoolkit"

Step 4: Repeat step 2 and you should be in the clear
