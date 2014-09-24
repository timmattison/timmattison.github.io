---
layout: post
title: "Advanced port forwarding with SSH"
date: 2014-06-20 06:38:14 -0400
comments: true
categories: 
---

***NOTE***: This has all been done on a Mac running OS 10.9.  YMMV on other operating systems or versions.

If you've ever had to use an SSH server as a jump off point, possibly to get to machines that don't have a public IP address, then you know that it can be complicated to set up, manage, and annoying if you need to access a lot of machines and/or a lot of different services.  Typically, using local port forwarding you can do something like this:

``` console
ssh -L8080:REMOTE_PRIVATE_SERVER:80 USER@REMOTE_PUBLIC_SERVER
```

That will let you connect to localhost on port 8080 to get to `REMOTE_PRIVATE_SERVER`'s port 80 service.  What if you needed to get to two services?  You start stacking them up:

``` console
ssh -L8080:REMOTE_PRIVATE_SERVER:80 -L8181:ANOTHER_REMOTE_PRIVATE_SERVER:80 USER@REMOTE_PUBLIC_SERVER
```

Now you can get to `REMOTE_PRIVATE_SERVER`'s port 80 service and `ANOTHER_REMOTE_PRIVATE_SERVER`'s port 80 service.  You just have to configure your applications to use ports 8080 and 8181 on localhost instead of port 80 on the two remote hosts.

Wouldn't it be nice if you could not worry about re-mapping ports and could just connect to `REMOTE_PRIVATE_SERVER` and `ANOTHER_REMOTE_PRIVATE_SERVER` as if they were hosts on your network?  SSH does offer you a way to do this but I have never seen it documented anywhere.  There is [a way to create a VPN using pppd](http://www.securitybulletins.com/mediawiki/index.php/SSH_Tunnelling#Using_SSH_to_build_a_Virtual_Private_Network_.28VPN.29) and [a way to use SOCKS](http://www.securitybulletins.com/mediawiki/index.php/SSH_Tunnelling#Using_SSH_to_emulate_a_SOCKS_proxy) but those are no fun.  I don't want to use pppd and I have applications that don't support SOCKS.

rsync and other applications that depend on SSH can be particularly tricky.  On top of the command-line options you need to pass to your main application you need to pass options to SSH directly (not so bad), use each applications special syntax to pass those options to SSH (really bad), or convince the application to shell out to the OS with a specific command-line you've concocted for SSH (also really bad).

Instead, what I do is I make use of the 127.0.0.0/8 address space that is available to everyone but rarely used.  You can always use 127.0.0.1 to access your local machine but you may not realize that you can bind to all of the rest of the addresses in that space.

I need to set up some terminology so this will be easier to discuss.  The machine that you're SSHing will be the "source machine".  The machine that is publicly accessible on the remote network that you SSH into will be called the "gateway machine".  The machine that provides the remote service that only has a private IP address will be called the "destination machine".

My first use case is that the source machine wants to connect to a web server on the destination machine but I want to do it on port 80.  We can do this:

``` console
sudo ifconfig lo0 alias 127.0.0.2
sudo ssh -L127.0.0.2:80:DESTINATION_MACHINE:80 user@GATEWAY_MACHINE
```

That first line creates an alias IP address of `127.0.0.2` on your `lo0` interface.  Then we ssh to the gateway machine and port forward the destination machine's port 80 to `127.0.0.1`.  Since 80 is a privileged port you need to sudo your ssh session.

Now instead of having to point our browser to something like `localhost:9000` we can point our browser directly to `127.0.0.2`.  What can we do this to make it even better?  Create a host entry for `127.0.0.2` that gives it a descriptive name like `remote_application_server`.

Is that not enough?  How about this:

``` console
sudo ifconfig lo0 alias 127.0.0.2
sudo ssh -L127.0.0.2:22:DESTINATION_MACHINE:22 user@GATEWAY_MACHINE
```

All that changed here is the port number.  It was 80 and now it is 22 which is the ssh port.  Now you can ssh to this machine in one step like this:

``` console
ssh user@127.0.0.2
```

This also means that you can sftp, scp, and rsync directly to that IP address.  Without this trick to rsync you'd need to do something like this:

``` console
rsync -rvz -e 'ssh -p 2222' ./dir user@host:/dir
```

It may not seem like much but if you have to do it a lot it can get ugly.  Especially since it is one of those options you always forget since you don't use it that often.

I'm thinking about scripting the IP aliasing and port forwarding so that it can be specified in a simple configuration file.  If you're interested in that post in the comments below and let me know!
