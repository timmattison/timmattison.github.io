---
layout: post
title: "Using SSH agent to simplify connecting to EC2"
date: 2014-09-04 08:00:41 -0400
comments: true
categories: 
---
TL;DR - Jump to the bottom and look for the `eval $(ssh-agent)` snippet!

Once you start using EC2 you'll probably need to do a lot of things that involve SSH.  A common frustration is having to specify your identity file when connecting to your EC2 instance.  Instead of doing this:

``` console
ssh ubuntu@my-ec2-instance
```

You end up doing this:

``` console
ssh -i ~/.ssh/identity-file.pem ubuntu@my-ec2-instance
```

This gets even more complex when tools based on SSH are brought into the mix.  Some of these tools don't have a mechanism to even specify the identity file.  If they do sometimes it makes the command-line really ugly and it almost always makes the script custom to a specific user.  For example:

``` console
rsync -avz -e "ssh -p1234  -i /home/username/.ssh/identity-file.pem" ...
```

Is only going to work for the user `username`.

How do we make this a lot easier?  It turns out there is a very simple way to make all of that pain go away.  Whether you use [rsync](http://rsync.samba.org/), [unison](http://www.cis.upenn.edu/~bcpierce/unison/), [mosh](https://mosh.mit.edu/), scp, or any of a number of other tools that make use of SSH under the hood there is a standard mechanism for SSH to manage your identity.  That mechanism is called [ssh-agent](http://www.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man1/ssh-agent.1?query=ssh-agent&sec=1).

If I try to rsync directly to my EC2 instance I get this:

``` console
$ rsync -avzP ubuntu@my-ec2-instance:file-on-ec2.txt local-file.txt
Permission denied (publickey).
rsync: connection unexpectedly closed (0 bytes received so far) [Receiver]
rsync error: unexplained error (code 255) at io.c(226) [Receiver=3.1.1]
```

Instead what I want to do is start the ssh-agent, tell it about my identity file, and have the agent worry about providing my identity file when necessary.  To do that I do this:

```
eval $(ssh-agent) && ssh-add ~/.ssh/identity-file.pem
```

Once you do that SSH will use that identity file to connect to EC2 automatically.  You just need to run that in each shell you are using to connect to EC2 and you are set.

Do you have more than one identity file?  You can keep running ssh-add with additional identity files and it will manage them all.

Do you want to be really lazy and load all of your identities at once?  Try this:

```
eval $(ssh-agent) && ssh-add ~/.ssh/*.pem
```

Enjoy!

NOTE: Your pem files need to have the permission set to 400 so they can only be read by your user and not written to.  Otherwise ssh-agent and ssh may refuse to use them.