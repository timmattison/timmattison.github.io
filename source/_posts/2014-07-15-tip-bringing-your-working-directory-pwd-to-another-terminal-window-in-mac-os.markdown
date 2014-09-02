---
layout: post
title: "Tip: Bringing your working directory (pwd) to another Terminal window in Mac OS"
date: 2014-07-15 18:37:23 -0400
comments: true
categories: 
---

Mac OS, as far as I can remember, used to start tabbed Terminal sessions and put you into the working directory of your last tab.  New Terminal windows didn't do this but recently new Terminal tabs stopped doing it too.

I got tired of renavigating to the paths in the projects I was working on and I didn't want to launch a Terminal from within a Terminal so I came up with something else.  I added a few lines to my `.bash_profile` and now I have two new commands.  `ccd` copies your current directory to the clipboard, and `pcd` pastes your clipboard into the `cd` command.

Now when I'm in a deep directory tree like this:

```
super-dooper-long-path/with/other-path/stuff/in/it $
```

I can do this in the existing Terminal:

```
super-dooper-long-path/with/other-path/stuff/in/it $ ccd
```

And this in the new Terminal:

```
$ pcd
super-dooper-long-path/with/other-path/stuff/in/it $
```

And there you have it.  Back into my beloved directory in no time.  Here's what I added to `.bash_profile`.

``` bash
alias ccd="pwd | pbcopy"
alias pcd="paste_cd"

function paste_cd() {
        cd "`pbpaste`"
}
```

The `ccd` alias just pipes `pwd` into `pbcopy`, which is one of the best tools ever, so that it ends up in the clipboard.

The `pcd` alias is a little more complex.  If you try to do this without a bash function your alias will get evaluated as soon as your shell starts.  This means that when you open your shell whatever is in your clipboard will be what `pcd` tries to `cd` to.  Using a function we let it run `pbpaste` when it is called so it always uses the up-to-date info.

Enjoy!  Let me know if you find it useful!