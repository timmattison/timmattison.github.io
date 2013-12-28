---
author: admin
comments: true
date: 2012-02-16 14:05:21+00:00
layout: post
slug: tip-trimming-the-tops-and-bottoms-of-text-files-with-head-and-tail
title: 'Tip: Trimming the tops and bottoms of text files with head and tail'
wordpress_id: 691
categories:
- Tips
---

Normally the head and tail applications on Linux are good for what their names imply.  head gives you the first few lines of a file, tail gives you last few lines of a file and even lets you watch the end of a file for changes.  This is great but what if you want to get an entire file _except_ for the first few or last few lines?  It turns out that head and tail have options to do this and it's incredibly useful for trimming files without knowing exactly how many lines they contain.

I'm writing this because I keep forgetting which one does what.  Here's how you can remember it and use it every day...

Tip #1: If you only want the end of a file use tail like this: 
    
    tail -n +3 input.file > output.file



An example file, like a PostgreSQL database dump, might look like this:


    
    
    column_a | column_b | column_c
    ---------+----------+---------
        1    |   bob    |  65000
        2    |   joe    |  80000
        3    |   jim    |  54000
    (3 rows)
    
    



After running 
    
    tail -n +3 input.file > output.file

on this we'll end up with output that looks like this:


    
    
        1    |   bob    |  65000
        2    |   joe    |  80000
        3    |   jim    |  54000
    (3 rows)
    
    



The best way to remember this is that you want everything until the end of the file starting at the third line.

Tip #2: If you only want the beginning of a file use head like this: 
    
    head -n -2 input.file > output.file



Using the same example file we end up with:


    
    
    column_a | column_b | column_c
    ---------+----------+---------
        1    |   bob    |  65000
        2    |   joe    |  80000
        3    |   jim    |  54000
    



The best way to remember this is that you want everything from the beginning file excluding the last two lines.  Note, there is a blank line after "(3 rows)" and we want to remove that too.

Tip #3: If you need to trim from both side you can pipe like this: 
    
    tail -n +3 input.file | head -n -2 > output.file



Using the same example we end up:


    
    
        1    |   bob    |  65000
        2    |   joe    |  80000
        3    |   jim    |  54000
    



This now translates to start at the third line and stop two lines from the end.  If you ever forget just come back here and re-read the examples.
