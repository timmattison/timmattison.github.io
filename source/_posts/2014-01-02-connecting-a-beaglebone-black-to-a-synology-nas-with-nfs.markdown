---
layout: post
title: "Connecting a BeagleBone Black to a Synology NAS with NFS"
date: 2014-01-02 06:52:06 -0500
comments: true
categories: 
---

I originally purchased my Synology NAS because of all of the packages that it offers and the fact that it was supposed to give me one less thing to manage.  After a few failed attempts at getting OpenVPN to work and some Plex issues I decided that I needed to have something a little less opaque that I could install different packages on.  I wanted something small, low power, and solid state so I decided to use the BeagleBone Black.

I tried using both CIFS/Samba and sshfs to mount the Synology's filesystem but both of them had extremely strange issues with the applications I planned on using.  I wouldn't recommend either of them for production work involving Linux and NAS.  Often it would tell me that files didn't exist even though I could clearly see they were there.  After moving to NFS none of this happened anymore.

NOTE: Security here is all done by IP address so this is not suitable for a sensitive environment!

Here are the steps I went through to connect my first enable and configure NFS on my Synoloy NAS:

0. Make sure your BeagleBone Black has a static IP and that you know what it is
1. Log into the Synology web GUI as an admin
2. Click "Control Panel"
3. Click "Win/Mac/NFS"
4. Click "NFS Service"
5. Make sure that "Enable NFS" and "Enable NFSv4 support" are checked
6. Click the link that says "Shared Folder"
7. Find and select the directory you want to share.  In my case it was my user account's home directory so I selected "homes".
8. Click the "Privileges" drop down
9. Select "NFS Privileges"
10. Click "Create"
11. Enter your BeagleBone Black's IP address into the "Hostname or IP" field
12. Make sure that the "Privilege" field is set to "Read/Write"
13. Make sure that the "Root squash" field is set to "No mapping"
14. Make sure that "Enable asynchronous" is checked
15. Make sure that "Allow connections from non-privileged ports (ports higher than 1024" is NOT checked
16. Click "OK" in the "Create an NFS rule" popup
17. Take note of the "Mount path" field in the "Edit NFS privileges of homes" window, you'll need this later
18. Click "OK" in the "Edit NFS privileges of homes" window
19. Log out of the Synology web GUI

Now you have your Synology all set up to accept NFS connections from your BeagleBone Black.  Here are the steps to do that:

1. Connect to your BeagleBone Black via SSH as a user that can run sudo
2. Install the NFS utilities and client by running "sudo apt-get install nfs-common"
3. Go to your home directory
4. Create a directory for your Synology mount point.  I chose "synology".
5. Mount your directory using the "Mount path" from above along with any additional paths to get you to the desired directory you want.  My mount path was "/volume1/homes" but I wanted "/volume1/homes/tim" for my actual home directory.  The command I used was "sudo mount -t nfs synology:/volume1/homes/tim /home/tim/synology/"
6. Test out your newly mounted Synology NAS

You can now add this to your /etc/fstab file if you'd like but I prefer to keep it in a script.  I have a script called mount-nfs.sh in my home directory that I run when necessary since I'm still testing out NFSv4.  Once I get it stable I'll make sure that I get it to mount automatically the proper way and update this post.

# Potential issues

If you receive an error message that says "mount.nfs: access denied by server while mounting synology" you probably have the wrong IP for your BeagleBone Black in the Synology configuration.

If it appears to mount the volume but no files show up try unmounting it and re-mounting it.  If you unmount it successfully and when re-mounting it again it complains that the device is busy it is possible that your BeagleBone Black's IP address changed.  This happened on my test machine when its IP went from 192.168.1.109 to 192.168.1.110.  It didn't give me the access denied error message but instead exhibited this weird behavior.  If this is the case make sure you have your IP assigned statically, reboot the BeagleBone Black, verify the static IP in the Synology configuration again, and then try re-mounting the path.  After that mine started working again.

Good luck!  Post any success stories or issues in the comments.  I'll do my best to help out if possible.
