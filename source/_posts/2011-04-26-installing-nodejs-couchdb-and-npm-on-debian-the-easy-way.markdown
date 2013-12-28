---
author: admin
comments: true
date: 2011-04-26 13:21:32+00:00
layout: post
slug: installing-nodejs-couchdb-and-npm-on-debian-the-easy-way
title: 'How-To: Install NodeJS, CouchDB, and npm on Debian (the easy way)'
wordpress_id: 390
categories:
- How-To
tags:
- CouchDB
- Debian
- NodeJS
- npm
- sysadmin
---

Are you looking for a no-nonsense way to install all of these applications and don't want to dig through any documentation?  Just run this list of commands (replacing the word CORES for the number of cores you have):

    
    git clone https://github.com/joyent/node.git
    cd node
    export JOBS=CORES # optional, sets number of parallel commands.
    mkdir ~/local
    ./configure --prefix=$HOME/local/node
    make -jCORES
    make install
    cd ..
    git clone git://github.com/apache/couchdb.git
    cd couchdb
    sudo apt-get install automake
    sudo apt-get install libmozjs-dev
    sudo apt-get install libicu-dev
    sudo apt-get install erlang
    ./bootstrap
    ./configure --prefix=$HOME/local/couchdb
    make -jCORES
    make install


After that, update your path in .bashrc by adding this line to the bottom:

    
    export PATH=$HOME/local/node/bin:$HOME/local/couchdb/bin:$PATH


Now, you can run both NodeJS and CouchDB from anywhere once you log out and log back in again.  Finally, installing npm is just one more step:

    
    curl http://npmjs.org/install.sh | sh


That's it, you've now got all of the latest code installed.  To start couchdb run

    
    couchdb -b


from anywhere and connect to Futon [locally via http://localhost:5984/_utils/](http://localhost:5984/_utils/).  BTW, to use CouchDB from NodeJS I recommend [Cradle](https://github.com/cloudhead/cradle).
