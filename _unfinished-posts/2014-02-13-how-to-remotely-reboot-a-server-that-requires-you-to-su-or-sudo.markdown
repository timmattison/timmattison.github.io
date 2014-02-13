---
layout: post
title: "How To: Remotely reboot a server that requires you to su or sudo"
date: 2014-02-13 14:28:49 -0500
comments: true
categories: 
---
Recently I ran into a situation where I had to reboot a ton of machines remotely.  I couldn't ssh as root, and you really shouldn't do that anyway, so I thought I might be stuck trying to SSH in, "sudo reboot", enter the password, and go on to the next machine.  One snag was that some machines supported sudo and some required me to su.

I didn't want to have to do this for all of the machines I was working on so I searched around and found (Paramiko)[https://github.com/paramiko/paramiko].  Paramiko is an SSH library for Python that lets you tell Python the login password and also gives you direct access to the terminal stream from your SSH session.  This means that I can send su or sudo and then send the password without the user doing anything.

Security wise this is an obvious hole in many ways.  First of all if you do this for a machine and specify the password on the command-line it is going to end up in your history file.  So without going through the exhaustive list of reasons why this is generally a bad idea lets just say that you should use this sparingly.
