---
layout: post
title: "Compiling bitcoind on the BeagleBone Black"
date: 2014-01-02 07:31:19 -0500
comments: true
categories: 
---
I am running Debian on a BeagleBone Black at home as a toy server to have a sandbox that I can play around on.  One application that I thought would be interesting to run on it was the standard Bitcoin client.  I think it is a bit strange that the Bitcoin client doesn't use "configure" like most other Linux/Unix applications because it leads to having to track down dependencies during a build rather than before them.  On a normal system this might not be a big deal because Bitcoin compiles in just a minute or so.  On a smaller device like the BeagleBone Black though it means you'll end up checking in on it periodically over a long period of time only to find that it needs another dependency.

If you follow these instructions you should get Bitcoin up and running in just one build cycle.  Here are the commands that you should run:

```bash
sudo apt-get install g++ libboost-dev libdb-dev git
git clone ...
cd bitcoin ...
make -f makefile.unix
```

Now you'll have the bitcoind executable sitting on your BeagleBone Black.  When you try to run it the first time it will complain that some variables aren't set and that your config is incomplete.  The output will look something like this:

``` bash
debian@arm:~/bitcoin-0.8.6-linux/src/src$ ./bitcoind 
Error: To use bitcoind, you must set a rpcpassword in the configuration file:
/home/debian/.bitcoin/bitcoin.conf
It is recommended you use the following random password:
rpcuser=bitcoinrpc
rpcpassword=XxXXxXXxxxXxXXxXXXXXXxxxxXxxxxxXxXXXXXxXxxXx
(you do not need to remember this password)
The username and password MUST NOT be the same.
If the file does not exist, create it with owner-readable-only file permissions.
It is also recommended to set alertnotify so you are notified of problems;
for example: alertnotify=echo %s | mail -s "Bitcoin Alert" admin@foo.com
```

What you'll need to do is put these values into the ~/.bitcoin/bitcoin.conf.  Then you can restart bitcoind and it'll run and start grabbing the blockchain.  IT IS INCREDIBLY IMPORTANT THAT YOU DO NOT COPY THE VALUES THAT I PUT HERE.  Your file will look like this (except the rpcpassword will be whatever bitcoind told you):

```
rpcuser=bitcoinrpc
rpcpassword=XxXXxXXxxxXxXXxXXXXXXxxxxXxxxxxXxXXXXXxXxxXx
```

This password gives someone complete access to your bitcoind instance.  If you store money there and use the rpcpassword value that I put above you can and probably will lose it.

Unless you have a giant SD card on your BeagleBone Black you'll probably want to put your blockchain on a different disk.  I have my Synology home directory mounted on my BeagleBone Black via NFS (as explained in another post).  It is mounted at ~/synology.  In order to make sure my blockchain is on my Synology I did the following:

```bash
mkdir ~/synology/bitcoind
mv ~/.bitcoin/blocks ~/.bitcoin/chainstate ~/.bitcoin/database ~/.bitcoin/db.log ~/.bitcoin/debug.log ~/synology/bitcoind/
ln -s ~/synology/bitcoind/blocks ~/.bitcoin/blocks
ln -s ~/synology/bitcoind/chainstate ~/.bitcoin/chainstate
mkdir -p ~/synology/bitcoind/database
ln -s ~/synology/bitcoind/database ~/.bitcoin/database
ln -s ~/synology/bitcoind/db.log ~/.bitcoin/db.log
ln -s ~/synology/bitcoind/debug.log ~/.bitcoin/debug.log
```

You may get a few errors about files not existing when you run this.  This is normal and you should try to proceed and see if it works for you.  I was very careful here to not put bitcoin.conf or the wallet.dat file on the Synology.  You should also avoid putting those files on there.  Since the remote file system is potentially a shared resource an attacker can get into that and modify or steal data.  It's best to keep the wallet.dat, peers.dat, and bitcoin.conf local to your BeagleBone Black.

At this point you can restart bitcoind.  I did this in a screen session rather than make it a true service since I'm still playing around with it.  Once I set it up as a service I'll post an update and include that information as well.  I am a bit skeptical that it will stay stable since after just a few hours it is already taking up 50% of the BeagleBone Black's RAM.  I guess I'll just have to wait and see.

Periodically check your free file system space and make sure that the blockchain isn't on your SD card.  In my case I can do this:

```bash
# Show the amount of free space on my SD card
du -sh /

# Show the amount of free space on my Synology NAS
du -sh ~/synology/
```

Good luck and post in the comments if this helps you out or if you need any assistance.
