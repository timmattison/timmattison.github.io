---
layout: post
title: "Automating Cisco switch interactions"
date: 2014-06-25 19:03:09 -0400
comments: true
categories: 
---

Recently I needed to find a way to reboot an embedded device remotely.  The trick was that we didn't have a handy [Web Power Switch](http://www.digital-loggers.com/lpc.html) and the device was PoE.  I figured that I'd just quickly slap together a script to telnet to the switch's management interface and simulate a few simple commands.  To make a long story short SSH was the only option which complicated things a bit.

Fortunately for me [I had already written an article about this](http://blog.timmattison.com/archives/2014/02/13/how-to-execute-a-command-on-a-remote-server-that-requires-you-to-su-or-sudo/) but that turned out only to be a starting point as the script just wouldn't work out of the box with Cisco's SSH server.

In the end I found a few very interesting things out about Paramiko and Cisco's SSH server.  Using Paramiko with a Cisco switch through out a bunch of errors like this:

```
Traceback (most recent call last):
  File "/Applications/PyCharm.app/helpers/pydev/pydevd.py", line 1733, in <module>
    debugger.run(setup['file'], None, None)
  File "/Applications/PyCharm.app/helpers/pydev/pydevd.py", line 1226, in run
    pydev_imports.execfile(file, globals, locals)  # execute the script
  File "poe-state.py", line 69, in <module>
    client.connect(switch_ip_address, username=username, password=password, look_for_keys=True)
  File "/usr/local/lib/python2.7/site-packages/paramiko/client.py", line 273, in connect
    self._auth(username, password, pkey, key_filenames, allow_agent, look_for_keys)
  File "/usr/local/lib/python2.7/site-packages/paramiko/client.py", line 456, in _auth
    raise saved_exception
paramiko.ssh_exception.AuthenticationException: Authentication failed.
```

If you are seeing `Authentication failed` messages while using Paramiko and you are certain your credentials are correct you may be running into the same problem I was.  The issue is that Paramiko tries to use your SSH keys to do public key authentication before it tries to use your password.  Normally, this doesn't cause an issue because if it fails one authentication method it just moves onto trying the next authentication method.  Due to a quirk in both Paramiko and Cisco's SSH server implementation Paramiko gets confused after the public key authentication failure and gives up.  I figured this out by turning on full debugging in Paramiko like this:

```
paramiko.common.logging.basicConfig(level=paramiko.common.DEBUG)
```

This is an incredibly handy flag if you ever need to debug Paramiko yourself so keep it around!

Anyway, the solution is normally to add the `look_for_keys=False` option to your Paramiko connect call.  However, as I found out that works on some systems and not others.  To be certain that it only tried password authentication I needed to also add the `allow_agent=False` flag.

The other quirk I hit was that my script initially waited forever for a response when I sent it commands that had a lot of output.  This was because the Cisco shell's pager was on.  Turning it off meant sending one additional command `terminal length 0\n`.

In the end I ended up with a script that lets me check the PoE state of a port and enable/disable PoE on a per port basis.  If you need a script that does that it is included below.  Two important points to remember are that I only needed to use this on interfaces that start with `Gi1/0/` so that value is hardcoded and you'll need to change it if your switch is different.  You will also need to install my little Python library called [pyuda](https://pypi.python.org/pypi/pyuda/0.1dev) because I use it to process the command-line arguments.  Rip that out if you want to simplify things.

```
#!/usr/bin/env python

__author__ = 'timmattison'

import pyuda
import re
import paramiko
import sys
import time

# For debugging only
# paramiko.common.logging.basicConfig(level=paramiko.common.DEBUG)

# This is part of the regex we use to look for the interfaces we care about
interface_regex = "Gi1\/0\/"

# These are the operation we support
status_operation = "status"
on_operation = "on"
off_operation = "off"
valid_operations = [status_operation, on_operation, off_operation]

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

    return receive_buffer

def validate_operation(operation):
    # Is this an operation we support?
    if(not operation in valid_operations):
        # No, tell them and bail out
        print operation + " is not a valid operation"
        sys.exit(-1)

# Get the command-line arguments
switch_ip_address, username, password, operation, port_number = pyuda.get_command_line_arguments(["Switch IP address", "Admin username", "Admin password", status_operation + ", " + on_operation + ", or " + off_operation, "Port number"])

# Make sure the operation makes sense
validate_operation(operation)

# Create an SSH client
client = paramiko.SSHClient()

# Make sure that we add the remote server's SSH key automatically
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# Connect to the client
client.connect(switch_ip_address, username=username, password=password, allow_agent=False, look_for_keys=False)

# Create a raw shell
shell = client.invoke_shell()

# Wait for the prompt
send_string_and_wait_for_string("", "#", False)

# Disable more
send_string_and_wait_for_string("terminal length 0\n", "#", False)

# Which command are we trying to run?
if((operation == on_operation) or (operation == off_operation)):
    # Trying to do on or off

    # Send the "conf t" command
    send_string_and_wait_for_string("conf t\n", "(config)#", False)

    # Send the interface command
    send_string_and_wait_for_string("interface Gi1/0/" + str(port_number) + "\n", "(config-if)#", False)

    # Build the power command
    power_command = "power inline "

    # What kind of operation is this?
    if(operation == off_operation):
        # Power off, "never" means off
        power_command += "never"
    else:
        # Power on, "auto" means on (there are other options but this is the simplest)
        power_command += "auto"

    # Add the carriage return
    power_command += "\n"

    # Send the power command
    send_string_and_wait_for_string(power_command, "(config-if)#", False)
elif(operation == status_operation):
    # Get the status of all of the PoE ports
    power_data = send_string_and_wait_for_string("show power inline\n", "#", False)

    # Split the data into lines
    power_data_lines = power_data.splitlines()

    # We haven't found what we're looking for yet
    found = False

    # Loop through all of the lines
    for power_data_line in power_data_lines:
        # Does this look like the interface we want?
        if(not re.match("^" + interface_regex + port_number + "\s", power_data_line)):
            # No, keep going
            continue

        # Found the interface we want, split up the fields
        power_data_fields = power_data_line.split()

        # Get the second field which is the power state field and print it
        print power_data_fields[1]

        # We found what we needed
        found = True

        # Get out of the for loop
        break

    # Did we find what we needed?
    if not found:
        # No, let the user know
        print "Did not find port " + port_number

else:
    # This is an operation we didn't handle
    print operation + " not handled"

# Close the SSH connection
client.close()
```