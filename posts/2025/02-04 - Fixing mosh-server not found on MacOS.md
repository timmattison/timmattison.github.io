---
title: "Fixing mosh-server not found on MacOS"
date: 2025-02-04 09:46:00
---

# {{ $frontmatter.title }}

This is a constant nuisance on MacOS for me. If you install mosh via Homebrew, you'll likely run into this issue.

If you see something like this (assuming your remote system's IP address is 192.168.1.10):

```
zsh:1: command not found: mosh-server
Connection to 192.168.1.10 closed.
/opt/homebrew/bin/mosh: Did not find mosh server startup message. (Have you installed mosh on your server?)
```

The fix is to add the Homebrew path to your shell's path. But you don't do this in the `.zshrc` file. Instead, you need to add it to the `.zshenv` file.

So just add this line to your `.zshenv` file:

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

If you want to test to see if the path is missing or present you can do this:

```bash
ssh user@192.168.1.10 'echo $PATH'
```

If `/opt/homebrew/bin` is missing from the output, you need to add it to your `.zshenv` file.