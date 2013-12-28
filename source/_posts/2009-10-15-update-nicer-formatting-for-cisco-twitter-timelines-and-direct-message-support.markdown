---
author: admin
comments: true
date: 2009-10-15 14:38:07+00:00
layout: post
slug: update-nicer-formatting-for-cisco-twitter-timelines-and-direct-message-support
title: 'Update: Nicer formatting for Cisco Twitter timelines and direct message support'
wordpress_id: 203
tags:
- Cisco 7960
- Twitter
- VoIP
---

A [savvy guy in Germany](https://twitter.com/nikonshooter62) gave me some pointers on what could be improved in my previous post [How-To: Get a Twitter timeline on a Cisco 7960](http://blog.timmattison.com/blog/archives/2009/03/07/how-to-get-a-twitter-timeline-on-a-cisco-7960-updated-2009-03-10/).  Rather than updating that one again and having it get lost I'll put the newest stuff in new posts as they come up.

First, rather than getting your friends timeline he suggested, and modified the script, to only pull the direct messages.  The change is straightforward and you can simply replace

    
    $timeline = $twit->friends_timeline();


with

    
    $timeline = $twit->direct_messages();


Second, the message formatting that comes from the API [leaves a little bit to be desired](http://twitpic.com/llrfq).  Therefore the two suggestions were to remove the "+0000" and move the year so it's between the date and time.  This change is a bit more tricky but can be done with regular expressions.  For the first I did this

    
    $input =~ s/ \+0000//g;


and for the second I did this

    
    $input =~ s/^([^ ]*) *([^ ]*) *([^ ]*) *([^ ]*) *([^ ]*) *([^ ]*) *([^ ]*):/$1 $2 $3 $4 $5 $7 $6:/;


Put whichever of these you'd like (or both) right before

    
    return $input


in the fix_cisco_issues subroutine.  Make sure you copy them

exactly or they can break the script.

If you run into any trouble (ie. blank Cisco screen after doing the updates), run the script on the command-line and see if there are any errors showing up on STDERR. Usually, it's just a typo so pay attention to the error output and patch it up!
