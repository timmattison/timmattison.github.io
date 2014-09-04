---
layout: post
title: "Rid yourself of smart quotes, smart dashes, and automatic spelling correction on Mac OS"
date: 2014-09-04 08:45:12 -0400
comments: true
categories: 
---
Have you ever pasted working a bash script or piece of code into a text editor and had it fail to work when you copied it back out later?  You've probably fallen victim to smart quotes, smart dashes, or automatic spelling correction.

For example, during development I write scripts in Evernote and two very common things happen:

- `aws` is persistently and annoyingly replaced by the word "was"
- Commands that include double or single quotes have those quotes replaced with scripting hostile quotes that shells don't understand

In Mac OS we can fix this in a few steps:

1. Open System Preferences and click on Keyboard ![Keyboard](images/smart-quotes-mac-os/step-1.png)
2. Click "Text" ![Keyboard](images/smart-quotes-mac-os/step-2.png)
3. Uncheck "Use smart quotes and dashes" ![Keyboard](images/smart-quotes-mac-os/step-3.png)
4. Uncheck "Correct spelling automatically" ![Keyboard](images/smart-quotes-mac-os/step-4.png)

You're done!  Now your settings should look like this and these "smart" features will never bother you again:

![Keyboard](images/smart-quotes-mac-os/step-5.png)