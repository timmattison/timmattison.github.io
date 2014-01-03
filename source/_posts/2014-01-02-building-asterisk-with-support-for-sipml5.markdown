---
layout: post
title: "Building Asterisk with support for SIPML5"
date: 2014-01-02 19:06:58 -0500
comments: true
categories: 
---

If you are trying to use SIPML5 with Asterisk there are some gotchas that often come up.  If you're running it on Debian these tips below may help.

If you haven't gotten that far with Asterisk and don't care about your current configuration you can try this procedure that I use to build Asterisk myself:

* Download latest Asterisk, extract it, and cd into the directory it was extracted into
* Install some necessary dependencies
```bash
sudo apt-get install build-essential libncurses5-dev libxml2-dev libsqlite3-dev libssl-dev libsrtp0-dev
```
* Run the configuration script
```bash
./configure
```
* Build Asterisk.  NOTE: I have only had problems running a multi-job make so I would suggest you do not include a -jX option to take advantage of all of your cores.
```bash
make
```
* Install Asterisk
```bash
sudo make install
```
* Build the samples and **overwrite your current configuration**.  **You lose everything here so skip this step if you want to keep your config**.
```bash
sudo make samples
```
* Start Asterisk with crazy verbosity so you can see what is going on
```bash
sudo /usr/sbin/asterisk -vvvvvvvvvvvvvvg
```

There are two issues I ran into when trying to use SIPML5.

# Error #1: no protocols out of 'sip' supported - in Asterisk console

In this case chan_sip.so probably isn't built.  Check in make menuconfig, add libssl-dev via apt-get, re-run ./configure, make menuselect, verify that resource module res_crypto is enabled.

# Error #2: SRTP issues

If you are having SRTP issues you probably get one or more of these messages:

* In the browser - Not acceptable here
* In the Asterisk console - Received SAVPF profile in audio offer but AVPF is not enabled
* In the Asterisk console - Insufficient information in SDP
* In the Asterisk console - No SRTP module loaded, can't setup SRTP session
* In the Asterisk console - Rejecting secure audio stream without encryption details

In this case res_srtp.so probably isn't built.  Check in make menuconfig, add libsrtp0-dev via apt-get, re-run ./configure, make menuselect, verify that resource module res_srtp is enabled.

Good luck and post in the comments if it worked for you or if you need some help.
