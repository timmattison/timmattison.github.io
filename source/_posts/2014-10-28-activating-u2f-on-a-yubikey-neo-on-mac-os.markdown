---
layout: post
title: "Activating U2F on a Yubikey Neo on Mac OS"
date: 2014-10-28 16:25:12 -0400
comments: true
categories: 
---

I just got my Yubikey Neo with U2F support and I felt like the documentation on how to get it up and running was a bit hard to find.  If you are having trouble getting started with U2F these few quick steps will help you get through it.

Step 0: Download and install the [Yubikey Neo Manager application](https://developers.yubico.com/yubikey-neo-manager/Releases/).  This is NOT the Yubikey Personalization Tool!  The Yubikey Personalization Tool does not support enabling U2F yet.

Step 1: Open the Yubikey Neo Manager with your Yubikey installed and click `Change connection mode [OTP]` ![Yubikey Neo Manager main screen](/images/yubikey-neo-manager/step-1.png)

Step 2: On the `Change connection mode` check the `U2F` box to change the setting from `OTP` to `U2F` and click `OK`. ![Yubikey Neo Manager main screen](/images/yubikey-neo-manager/step-2.png) ![Yubikey Neo Manager main screen](/images/yubikey-neo-manager/step-3.png)

The application will now prompt you to remove your device.  You can remove it and plug it back in again.  Close the Yubikey Neo Manager application.

Step 3: Open Chrome and install the [FIDO U2F (Universal 2nd Factor) extension](https://chrome.google.com/webstore/detail/fido-u2f-universal-2nd-fa/pfboblefjcgdjicmnffhdgionmgcdmne) from the Chrome web store.

Step 4: Register on [Yubico's U2F demo page](http://demo.yubico.com/u2f) and you're done.

Now you can log in on the demo page and other sites that support U2F.