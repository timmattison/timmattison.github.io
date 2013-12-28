---
author: admin
comments: true
date: 2010-10-12 02:15:11+00:00
layout: post
slug: how-to-migrate-away-from-nanoblogger
title: 'How-To: Migrate away from Nanoblogger'
wordpress_id: 331
categories:
- How-To
tags:
- nanoblogger
- Wordpress
---

I’ve been using Nanoblogger for years now and I really didn’t want to ditch it.  After seeing how infrequently I post though I realized that Nanoblogger was getting in the way ever since I switched back from my Mac to a PC.  Without decent command-line support Nanoblogger required me to fire up a VM, edit in vim, update the blog, and sync it with rsync.

All of this is computationally and bandwidth efficient but not exactly convenient.  Convenience is key for me when keeping a blog up to date.  Anything that I have to do that doesn’t involve writing articles just gets in the way.

So, I wanted to switch from Nanoblogger to WordPress.  There’s no simple migration path here for several reasons but I came up with something that does the job and doesn’t require you to mess with your Nanoblogger settings.  This way you can leave everything in place and come back to it if something breaks.

First, you’ll need to navigate to your blog/data directory.  This is where all of your blog posts are stored as text files.  Then, using the Perl script at the bottom of this page, convert them into a full RSS feed by running this command:

cat *.txt | perl convert.pl > myblog.rss

With the myblog.rss file you can import your posts using the WordPress RSS importer and it’ll contain every post you’ve ever written.  If you use the RSS feed that Nanoblogger generates on your site you’ll only get the last few posts.

The script, convert.pl, is simply this:

#!/usr/bin/perl -w

my $title;
my $date;
my $body;

my $inbody = 0;

while(<STDIN>) {
my $line = $_;

if($line =~ m/^TITLE: (.*)$/) {
$title = $1;
}
elsif ($line =~ m/^DATE: (.*)$/) {
$date = $1;

$date =~ s/^(...) (...) ([0-9][0-9]) ([0-9][0-9]):([0-9][0-9]):([0-9][0-9]) (...) (20[0-9][0-9])/$1, $3 $2 $8 $4:$5:$6 -0500/;
}
elsif($line =~ m/BODY:/) {
$inbody = 1;
$body = "";
}
elsif($line =~ /END-----/) {
# Done, write it all out
print("<item>\n");
print("  <pubDate>$date</pubDate>\n");
print("  <title>$title</title>\n");
print("  <content:encoded>$body</content:encoded>\n");
print("</item>\n");

$date = "";
$title = "";
$body = "";
}
elsif($inbody == 1) {
$body = $body . $line;
}
}

Note that the date conversion code isn’t perfect so some posts will come out with dates of Dec. 31st, 1969.  You’ll have to fix those by hand.  Also, sometimes formatting isn’t perfect depending on how you wrote your posts initially.  Either way this turned hours of agonizing transcription into just a few seconds of work.
