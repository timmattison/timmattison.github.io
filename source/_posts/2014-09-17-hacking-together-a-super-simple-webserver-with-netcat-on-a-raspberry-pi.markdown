---
layout: post
title: "Hacking together a super simple webserver with netcat on a Raspberry Pi"
date: 2014-09-17 08:08:38 -0400
comments: true
categories: 
---
A few months ago I wanted to get some data out of [WeatherGoose II Climate Monitor](http://www.itwatchdogs.com/climate-monitor-weathergoose-ii-p1.html) so I could convert it into JSON and consume it in another application.  I hacked something together and converted their format to JSON in a few hours as a proof-of-concept and the code sat for a few months.

A co-worker recently asked me if they could hook up to my script with a browser to try to do some visualization.  I didn't want to install Apache or nginx as a front end and I didn't want to modify the script to run its own webserver so I came up with a one-liner that uses netcat to get the output of my script into their browser.

But wait!  netcat has an option for this.  However, on the Raspberry Pi it is not available and I didn't want to start downloading new versions.

Here it is:

```
SCRIPT="./weathergoose.py 192.168.1.99" && PORT="8080" && while true; do $SCRIPT | nc -l -p $PORT; done
```

You'll need to set `SCRIPT` to the script you want to run (including any parameters it needs) and `PORT` to the port you want to listen on.

Be careful!  This is not a real webserver.  This just spits your scripts output back to the browser.  Anything the browser sends to the script is ignored.

Also, the script runs first and pipes its output to netcat.  This happens before netcat accepts a connection and can cause some confusion.  Here's a concrete example.

Assume I wrote a script that just returns the time.  If I use the above snippet and start it at 5:00 PM but I hit it with my web browser at 5:15 PM the time that I get back will be 5:00 PM.  The next time I hit it it will be 5:15 PM.  The easiest way to think about it is that you get the data from when the script started or at the time of the *previous* request, whichever is later.

I hope to come up with a fix for this issue but I haven't had the time yet.  Do you have a fix?  Does this work for you?  Post in the comments below.