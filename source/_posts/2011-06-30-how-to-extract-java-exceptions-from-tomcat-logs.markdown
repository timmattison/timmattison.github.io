---
author: admin
comments: true
date: 2011-06-30 22:39:02+00:00
layout: post
slug: how-to-extract-java-exceptions-from-tomcat-logs
title: 'How-To: Extract Java exceptions from Tomcat logs'
wordpress_id: 507
categories:
- How-To
---

I've been digging through exceptions lately and it's sometimes a pain to dig through the Tomcat logs depending on your logging level.  Although it might sound like you should just turn your logging levels down sometimes that's not feasible.  If you want to get right to the exceptions I whipped up a little script that does exactly that so you can skip all of the log cruft and get right to the problem(s) you are looking to fix.  Just pipe or redirect your log into this script and the output will be a list of exceptions and their stack traces.  The output could potentially be huge to piping it through less or redirecting it to another file may make sense.

Here's the script (exceptions-only.pl) and there'll be more soon...

    
    #!/usr/bin/perl -w
    
    # The two states we can be in in our state machine.  Either looking for an exception or we found an exception.
    my $state_looking_for_exception = 0;
    my $state_found_exception = 1;
    
    # Start out looking for an exception, clear the output and the last time value
    my $state = $state_looking_for_exception;
    my $output = "";
    my $last_time = "";
    
    # Eat everything STDIN can give us
    while() {
      my $line = $_;
      chomp $line;
    
      # Are we looking for an exception
      if($state == $state_looking_for_exception) {
        # Yes, did we find one?
        if($line =~ m/^[0-9a-zA-Z\.]*Exception:/) {
          # Yes, change state
          $state = $state_found_exception;
    
          # Do we have a timestamp for it?
          if($last_time ne "") {
            # Yes, add the timestamp data
            $output .= "\n\n--- Start of exception at $last_time ---\n\n";
          }
    
          # Append the exception data to our output
          $output .= $line . "\n";
        }
        # Didn't find an exception, does this look like a timestamp?
        elsif($line =~ m/^[A-Za-z]{3} [0-9]{1,2}, [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}/) {
          # Yes, save it as the last time we've seen
          $last_time = $line;
        }
      }
      # Not looking for an exception, did we already find one?
      elsif($state == $state_found_exception) {
        # Yes, does this line start with whitespace?
        if(!($line =~ m/^\s/)) {
          # No, no more stack trace data.  Change state.
          $state = $state_looking_for_exception;
    
          # Do we have a timestamp for it?
          if($last_time ne "") {
            # Yes, add the timestamp data
            $output .= "\n\n--- End of exception at $last_time ---\n\n";
    
            # Clear out the last time since we're done with this exception
            $last_time = "";
          }
        }
        else {
          # Yes, this line starts with whitespace so it is stack trace data.  Append it to our output.
          $output .= $line . "\n";
        }
      }
    }
    
    # Print the output and we're done
    print $output;
