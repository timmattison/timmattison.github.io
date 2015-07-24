---
layout: post
title: "How would you implement \"cron\" on AWS as inexpensively as possible?"
date: 2015-07-24 09:20:15 -0400
comments: true
categories: 
---

There seems to be a common problem I've seen in app developer threads.  CloudKit provides tons of functionality to run your app without your own infrastructure but it only runs the APIs they provide.  There is an Android syncing API that provides similar things but with the same limitations.  Lots of app developers are really cheap because they're testing the water to see if their app is worth spending money on or not.

The problem: You need to do some simple processing on a data set and give the processed data set to your users.

The solution: Run a scheduled job that processes the data and puts it in S3.

The constraints:  You must use AWS.  The cost must be under $9 / month (less than a t2.micro) and cheaper is better.  You can't run it on your laptop/Raspberry Pi.  It must run at least once per day.

I think it's a fun exercise to see how this problem can be solved.  As I'm learning more and more about AWS there seem to be multiple ways to do it so I'm interested in seeing what other people come up with.

Some possible solutions I've seen so far:

  - [AWS Lambda plans to offer support for "timed events"](https://www.youtube.com/watch?v=UFj27laTWQA&feature=youtu.be&t=42m50s) but it isn't there yet

  - The [Unreliable Town Clock setup](https://alestic.com/2015/05/aws-lambda-recurring-schedule/), another AWS Lambda technique

  - [SQS, plus CloudWatch, plus SNS, plus Lambda](http://stackoverflow.com/a/31415241/796579), sounds elaborate but actually this is my favorite so far since it is available now and doesn't depend on the Unreliable Town Clock.  However, there are gotchas with it.

How would you do it?