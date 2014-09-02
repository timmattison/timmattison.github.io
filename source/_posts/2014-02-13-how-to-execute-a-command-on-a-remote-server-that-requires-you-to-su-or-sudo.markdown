---
layout: post
title: "How To: Execute a command on a remote server that requires you to su or sudo"
date: 2014-02-13 14:28:49 -0500
comments: true
categories: 
---
Recently I ran into a situation where I had to reboot a ton of machines remotely.  I couldn't ssh as root, and you really shouldn't do that anyway, so I thought I might be stuck trying to SSH in, "sudo reboot", enter the password, and go on to the next machine.  One snag was that some machines supported sudo and some required me to su.

I didn't want to have to do this for all of the machines I was working on so I searched around and found [Paramiko](https://github.com/paramiko/paramiko).  Paramiko is an SSH library for Python that lets you tell Python the login password and also gives you direct access to the terminal stream from your SSH session.  This means that I can send su or sudo and then send the password without the user doing anything.

Security wise this is an obvious hole in many ways.  First of all if you do this for a machine and specify the password on the command-line it is going to end up in your history file.  So without going through the exhaustive list of reasons why this is generally a bad idea lets just say that you should use this sparingly.

Set the variable `root_command` to the command that you want to execute as root, set `root_command_result` to the expected result of the command.  The command needs to have `\n` on the end of it because it simulates the user pressing enter.  Without it the system will never execute the command.  Pass these command-line parameters in this order:

* The IP of the system you want to connect to
* The username of the user that can su to root
* The password of the user that can su to root
* The password required to su to root

This particular version of the script just performs the "su" command.  It can be modified to do a "sudo" with just a few tweaks.  If there's demand I'll post a version that lets you swap between both and does some additional error handling.

And here's the script... don't forget to install Paramiko!

``` python
#!/usr/bin/env python

__author__ = 'timmattison'

import paramiko
import sys
import time

root_command = "whoami\n"
root_command_result = "root"

def send_string_and_wait(command, wait_time, should_print):
    # Send the su command
    shell.send(command)

    # Wait a bit, if necessary
    time.sleep(wait_time)

    # Flush the receive buffer
    receive_buffer = shell.recv(1024)

    # Print the receive buffer, if necessary
    if should_print:
        print receive_buffer

def send_string_and_wait_for_string(command, wait_string, should_print):
    # Send the su command
    shell.send(command)

    # Create a new receive buffer
    receive_buffer = ""

    while not wait_string in receive_buffer:
        # Flush the receive buffer
        receive_buffer += shell.recv(1024)

    # Print the receive buffer, if necessary
    if should_print:
        print receive_buffer

# Get the command-line arguments
system_ip = sys.argv[1]
system_username = sys.argv[2]
system_ssh_password = sys.argv[3]
system_su_password = sys.argv[4]

# Create an SSH client
client = paramiko.SSHClient()

# Make sure that we add the remote server's SSH key automatically
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# Connect to the client
client.connect(system_ip, username=system_username, password=system_ssh_password)

# Create a raw shell
shell = client.invoke_shell()

# Send the su command
send_string_and_wait("su\n", 1, True)

# Send the client's su password followed by a newline
send_string_and_wait(system_su_password + "\n", 1, True)

# Send the install command followed by a newline and wait for the done string
send_string_and_wait_for_string(root_command, root_command_result, True)

# Close the SSH connection
client.close()
```
