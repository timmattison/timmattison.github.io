---
author: admin
comments: true
date: 2009-11-06 23:59:59+00:00
layout: post
slug: how-to-restart-openssh-sshd-when-it-doesnt-want-to
title: 'How-To: Restart OpenSSH (sshd) when it doesn''t want to'
wordpress_id: 217
categories:
- How-To
tags:
- Linux
- SSH
- sysadmin
---

If you're doing a remote system upgrade from time to time you'll have to deal with changes in OpenSSH (sshd).  I just did an update on a Gentoo machine and afterwards I couldn't get OpenSSH to stop, much less restart.  When you're in these kinds of situations you risk losing remote access to the machine if it's not a VPS (like [Linode](http://linode.com), my favorite VPS hosting company so far) or doesn't have a KVM.  You can't just killall sshd since that'll disconnect you, and in my case running /etc/init.d/sshd restart failed to stop sshd.  If you don't restart sshd then all of those security patches are going to waste since your system is relying on the original copy of sshd in RAM.

So what do you do?  **NOT THIS UNLESS YOU ARE CONNECTED VIA A SERIAL PORT!** I have remote console access do I can just fire up Linode' AJAX console and do the following:

    
    killall sshd
    
    /etc/init.d/sshd restart


That got me running and I was all set. But you can do something similar remotely.  The trick is that you'll need to run it in [GNU's screen](http://www.gnu.org/software/screen/) utility to make sure that all of the commands are run.  Here's what you should do:

    
    screen
    
    killall sshd ; sleep 5 ; /etc/init.d/sshd restart


It's a bit risky because there's no guarantee that sshd will come up after that but this is a last ditch effort only.  Make sure all of your ducks are in a row, double check the upgrade process, run revdep-rebuild on Gentoo if you have to to make sure all of your libraries are correct.  I take no responsibility if you lose your connection and need to drive to the colo or sheepishly call for a reboot or remote hands.

I can tell you that in my case, a Gentoo upgrade, it did work fine.  You lose your connection but you can reconnect in 10 or so seconds, and then run

    
    screen -r


to see that all of the commands executed successfully.

Make sure you separate the commands by semi-colons though.  It's required, not just stylistic here.  You can't killall sshd and then keep issuing the commands interactively.  You have to let the shell do it for you inside screen, or else.  :)
