---
layout: post
title: "Compiling bitcoind on the BeagleBone Black"
date: 2014-01-02 18:29:05 -0500
comments: true
categories: 
---
I am running Debian on a BeagleBone Black at home as a toy server/sandbox.  One application that I thought would be interesting to run on it was the standard Bitcoin client.  I think it is a bit strange that the latest version of the Bitcoin client (0.8.6 at the time I wrote this) doesn't use "configure" like most other Linux/Unix applications because it leads to having to track down dependencies during a build rather than before them.  On a normal system this might not be a big deal because Bitcoin compiles in just a minute or so.  On a smaller device like the BeagleBone Black though it means you'll end up checking in on it periodically over a long period of time only to find that it needs another dependency.

In their defense the github version DOES use a "configure" script.  I found that out after going through a manual build on 0.8.6 so for completeness I'll show how to compile both and you can use whichever one suits your needs.  The configure script on a lean device like the BeagleBone Black still takes quite a while to run though so this should get you through doing the process just once.

You can use either the current stable version today which is 0.8.6 or you can use the bleeding edge github source.  I would recommend 0.8.6 if you want something that is as stable as possible.  When compiling from source you should keep in mind that your build may not be compatible with old wallet formats.

I cannot stress this enough - IF YOU HAVE AN OLD WALLET YOU ARE BEST OFF USING THE OFFICIAL BINARIES INSTEAD OF BUILDING FROM SOURCE!

# Using version 0.8.6

If you want to use version 0.8.6 here's what you need to do:

- Install the necessary dependencies

```bash
sudo apt-get install g++ libboost-dev libdb-dev
```

- Download the [Bitcoin 0.8.6 source](http://sourceforge.net/projects/bitcoin/files/Bitcoin/bitcoin-0.8.6/bitcoin-0.8.6-linux.tar.gz/download)

- Extract the source

```bash
tar xzvf bitcoin-0.8.6-linux.tar.gz
```

- Remove the binaries, these are Intel binaries and won't work on the BeagleBone Black anyway

```bash
rm bitcoin-0.8.6-linux/bin/*/*
```

- Go to the src directory

```bash
cd bitcoin-0.8.6-linux/src/src
```

- Build the source
```bash
make -f makefile.unix
```

If you follow these instructions you should get Bitcoin up and running in just one build cycle.  Here are the commands that you should run:

# Using the latest Bitcoin development version (NOT RECOMMENDED!)

NOTE: I do not recommend that you use this version.  Currently Debian does not have libdb4.8 in its default repository and the Bitcoin client requires it to maintain compatibility with existing wallet files.

If you want to use the latest development version here's what you need to do:

- Install the necessary dependencies
```bash
sudo apt-get install g++ libboost-dev libdb-dev git automake pkg-config
```

- Clone the Bitcoin repository
```bash
git clone https://github.com/bitcoin/bitcoin.git
```

- Configure the source
```bash
cd bitcoin
./autogen.sh
./configure --with-incompatible-bdb
make
```

Now you'll have the bitcoind executable sitting on your BeagleBone Black.  When you try to run it the first time it will complain that some variables aren't set and that your config is incomplete.  The output will look something like this:

```
debian@arm:~/bitcoin/src/src$ ./bitcoind 
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
