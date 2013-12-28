---
author: admin
comments: true
date: 2009-03-07 23:59:59+00:00
layout: post
slug: how-to-get-vim-syntax-highlighting-working-on-a-mac
title: 'How-To: Get vim syntax highlighting working on a Mac'
wordpress_id: 194
categories:
- How-To
tags:
- Mac OS
- vim
---

This has been a nuisance for me since I started using a Mac but only today did I finally spend the time to figure it out.  I found [a post that has almost everything you need](http://www.alangalloway.com/vim.html) but leaves out some key details and the direct download link is dead.  I've [recreated the file](/static/vimrc-2009-03-07) and you can install it automagically like this in a

Terminal window:

wget http://blog.timmattison.com/static/vimrc-2009-03-07 -O ~/.vimrc

This will nuke your existing .vimrc if you have one so save it first!
