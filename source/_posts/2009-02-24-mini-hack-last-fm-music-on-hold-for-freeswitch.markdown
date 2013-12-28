---
author: admin
comments: true
date: 2009-02-24 14:45:36+00:00
layout: post
slug: mini-hack-last-fm-music-on-hold-for-freeswitch
title: 'Mini-hack: last.fm music on hold for FreeSWITCH'
wordpress_id: 189
categories:
- Mini Hacks
tags:
- FreeSWITCH
- last.fm
- VoIP
---

I started using FreeSWITCH quite a while back but only recently got into rebuilding my home PBX with it.  One of the things that always bothered me about Asterisk, which may or may not have changed since the last time I looked, was that it wasn't straight-forward to get streaming MOH (music on hold) working.

Sure, I eventually got it to work but it wasn't fun and not really all that reliable.

Just this morning I decided to try to get some real variety in my MOH and came up with a quick hack that surprisingly only involves a few basic elements:

Step 1: Download Vidar Madsen's [LastFMProxy python application](http://vidar.gimp.org/?page_id=50) onto your [FreeSWITCH](http://freeswitch.org) server

Step 2: Update config.py with your username and password for last.fm

Step 3: Run [screen](http://www.gnu.org/software/screen/), start last.fm proxy's main.py, and then detach and leave it running in the background

Step 4: Find the hold_music variable and update it to look like this:

<X-PRE-PROCESS cmd="set" data="hold_music=shout://localhost:1881/lastfm.mp3"/>

Step 5: Point your browser (on the server directly or using X-forwarding over SSH) to one of the example links from the LastFMProxy README:

[http://localhost:1881/lastfm://globaltags/rock](http://localhost:1881/lastfm://globaltags/rock)

[http://localhost:1881/lastfm://artist/Madonna/similarartists](http://localhost:1881/lastfm://artist/Madonna/similarartists)

[http://localhost:1881/lastfm://user/vidarino/neighbours](http://localhost:1881/lastfm://user/vidarino/neighbours)

Or you can build your own.  The format is somewhat obvious so I'll leave that as an exercise for the reader.

6: Restart FreeSWITCH when convenient and enjoy your new music on hold.  Disclaimer: I only use this internally for testing, not production.  I don't claim to know or understand the licensing issues here so proceed at your own risk.

One really nice thing about this hack is that you can change your music selection on-the-fly, programmatically.  If you hit one of the URLs from step 5 with wget or LWP then FreeSWITCH will seamlessly switch to the new music after the current track has finished.  You won't be jarred into the new music selection with an instant track change.  This is what I usually go for:

wget -O /dev/null http://localhost:1881/lastfm://artist/KMFDM/similarartists
