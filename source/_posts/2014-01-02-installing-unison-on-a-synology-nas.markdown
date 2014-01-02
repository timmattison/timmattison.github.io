---
layout: post
title: "Installing unison on a Synology NAS"
date: 2014-01-02 18:53:31 -0500
comments: true
categories: 
---
This is all business.  I wrote this up a long time ago and never got a chance to put it online.  Enjoy!

First, install SSH:

1. Go to Synology web GUI
2. Open Control Panel
3. Click "Terminal"
4. Check "Enable SSH service"
5. Click "Apply"

Set up your users so they have a home directory:

1. Go to Synology web GUI
2. Open Control Panel
3. Click "User"
4. Click "User Home" button at the top
5. Check "Enable user home service"
6. Select the volume on which the home directories should be stored
7. Click "OK"

Connect via SSH and make sure it works:

1. ssh as admin to the Synology box.  Use the same password you use as admin on the web GUI.  **If you leave it blank, even if your password is blank, it will always fail.  You must have a non-blank password!** This is to protect against your device getting compromised from having no password.
2. If you get the "Diskstation>" prompt then it is working

Connect via SSH and make sure non-admin/non-root logins work:

1. Connect as a regular user.  If you get permission denied SSH back in as root and change the desired user's shell from /sbin/nologin to /bin/ash in /etc/passwd.
2. Try logging in again as that user

Bootstrap for ipkg:

1. http://forum.synology.com/wiki/index.php/Overview_on_modifying_the_Synology_Server,_bootstrap,_ipkg_etc
2. Log in as root
3. If you have DSM 4 or greater:
  1. Edit /root/.profile and comment out the lines that set and export the PATH variable
  2. Log out
  3. Log back in as root
4. Run "ipkg".  You should see the options come up and not an error message that ipkg can't be found.

Compile and install Unison - http://www.multigesture.net/articles/how-to-compile-unison-for-a-synology-ds212/
This error is expected:

```
if [ -f `which etags` ]; then \
    etags *.mli */*.mli *.ml */*.ml */*.m *.c */*.c *.txt \
          ; fi
/bin/sh: etags: not found
make[1]: [tags] Error 127 (ignored)
```

Good luck and post success stories and issues in the comments and I'll help if I can.
