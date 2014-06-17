---
layout: post
title: "True remote debugging with Chrome's remote debugging feature"
date: 2014-06-17 09:19:34 -0400
comments: true
categories: 
---

Have you used [Chrome's remote debugging feature](http://blog.chromium.org/2011/05/remote-debugging-with-chrome-developer.html)?  It is a handy tool for debugging JavaScript in another tab/window.

That's nice, but have you ever wanted to debug JavaScript that was running on another machine running Chrome?  If so, and you're running on Mac OS, you've come to the right place.

The first step in this process is to disable [Chrome's same origin policy](http://joshuamcginnis.com/2011/02/28/how-to-disable-same-origin-policy-in-chrome/).  This may not be necessary in your application but I've always found I needed to do it in mine.

Now you'll need to make sure you have [socat](http://www.dest-unreach.org/socat/) installed.  The easiest way to do this is with [Homebrew](http://brew.sh/).  Install Homebrew, and then run this command:

```
brew install socat
```

That will install socat if it isn't installed already.

Now start Chrome remote debugging on the system that you want to connect to.

Next, get socat to relay traffic from port 9223 to port 9222 using this command:

```
socat tcp-listen:9223,fork tcp:localhost:9222
```

Finally, try to connect to the remote computer using _its IP address, not localhost_ with a URL like this:

```
http://IP_ADDRESS:9223
```

You should be connected to the remote system's debugger using port 9223.

When you are done be sure to do this to stop socat:

```
killall socat
```