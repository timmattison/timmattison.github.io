---
author: admin
comments: true
date: 2009-03-07 22:59:59+00:00
layout: post
slug: how-to-get-a-twitter-timeline-on-a-cisco-7960-updated-2009-03-10
title: 'How-To: Get a Twitter timeline on a Cisco 7960 [updated 2009-03-10]'
wordpress_id: 193
categories:
- How-To
tags:
- Cisco 7960
- Twitter
- VoIP
---

UPDATE #1: I just noticed that if someone uses an ampersand in their tweet then the CISCO XML parser freaks out.  Unfortunately the &amp; code doesn't work either so I have updated the code to replace all of the ampersands with plus characters.

Now that my Cisco phone is set up I've started on a quest to find fun, yet marginally useful, things that I can do with it.  Without going too crazy I wanted to start with some basics and then move into the really fancy stuff.  A Twitter timeline is just about as basic as can be while still being novel enough to keep my interest.

You'll need a few things to make this work...

1: A Cisco 7960 that you can edit the configuration for and is provisioned properly.  Articles on this coming soon...

2: A Linux box with cron, Perl, Apache, and PHP installed and running.  There are tutorials on that everywhere so I'll leave that up to you.

3: A Twitter account.

If you have all of those things you can just follow these steps:

Step 1: Log into your Linux box and install the Perl Twitter package (you may need to do this as root): perl -MCPAN -e "install Net::Twitter"

Step 2: Modify this code by changing the username and password to your Twitter credentials.  Save this script on your Linux server as get-twitter-timeline.pl.

#!/usr/bin/perl -w

    
    use Net::Twitter;
    $username = "twitterusername";
    $password = "twitterpassword";
    my $twit = Net::Twitter->new({username=>$username, password=>$password});
    $timeline = $twit->friends_timeline();



    
    foreach my $tweet (@{$timeline}) {
       my $speaker = $tweet->{user}->{screen_name};
       my $text = $tweet->{text};
       print fix_cisco_issues("$speaker: $text\n");
    }
    
    sub fix_cisco_issues {
      $input = $_[0];
      $input =~ s/&/+/g;
      return $input;
    }


Step 3: Make the script executable (chmod +x get-twitter-timeline.pl) and add it to your crontab.  Your crontab may be different depending on your cron version, desired location on the webserver, frequency of updates, etc.  I'm checking for updates once every 2 minutes (henec "*/2").  BTW, my webserver is private so security is not my focus.

*/2 * * * * get-twitter-timeline.pl > /var/www/localhost/htdocs/twitter-timeline.txt

Step 4: Now you need to create a PHP script that will serve this up to your phone.  It's not quite as easy as pointing the phone to raw text since it needs a sprinkling of Cisco magic to get it to work.  My script is here:

<?php

header ("Refresh: 30");

    
    ?>
    
    <CiscoIPPhoneText>
      <Title>timmattison's timeline</Title>
      <Text><?php print file_get_contents("/var/www/localhost/htdocs/twitter-timeline.txt"); ?></Text>
    </CiscoIPPhoneText>


The tags just put my name on the top line and the content in a scrolling text area below it.  Refresh 30 means that the phone will fetch this every 30 seconds while it's on the services screen.  Now all some clever person needs to do is put some Cisco exploit in my Twitter timeline... as with all good security we'll worry about that later.  :)

Step 5: Now you'll need to edit your Cisco configuration to point to this PHP script.  You can modify your SIPDefault.cnf or SIPMACADDR.cnf depending on whether you want all of your Cisco phones to have this code on them or not.  The line you'll need to update or add is:

services_url: "http://10.0.1.251/cisco/services.php"   ; URL for external Phone Services

Again, that'll need to be updated to meet your specs.

Step 6: If you did all of that correctly you can restart your phone (*, 6, settings simultaneously) and then press the services button. It should come right up.

Here's a glimpse of the final product, enjoy!

![](/pictures/cisco-twitter-small.jpg)
