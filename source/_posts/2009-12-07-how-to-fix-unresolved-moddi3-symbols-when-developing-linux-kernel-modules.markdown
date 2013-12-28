---
author: admin
comments: true
date: 2009-12-07 23:59:59+00:00
layout: post
slug: how-to-fix-unresolved-moddi3-symbols-when-developing-linux-kernel-modules
title: 'How-To: Fix unresolved _moddi3 symbols when developing Linux kernel modules'
wordpress_id: 229
categories:
- How-To
tags:
- Linux kernel
- über
---

When developing Linux kernel modules, specifically ones that tie into procfs via the seq_file interfaces and have circular buffers, it's handy to be able to take an offset into your buffer and use the modulo operator (%) to make it wrap around easily.  In the kernel you're restricted to a smaller set of available operators however and modulo only works on certain types.

One type that it doesn't work on that happens to be used in the seq_file interface is loff_t.  If you try something like this:

    
    static void *my_procfs_seq_start(struct seq_file *s, loff_t *pos)
    {
      return global_pointer + ((*pos) % CIRCULAR_BUFFER_SIZE);
    }


You will probably get an error about the unresolved symbol "_moddi3".  The quick fix for this is to do the following instead:

    
    static void *my_procfs_seq_start(struct seq_file *s, loff_t *pos)
    {
      return global_pointer + (((int) (*pos)) % CIRCULAR_BUFFER_SIZE);
    }


This simply converts your dereferenced loff_t pointer to an int.  **Make sure your value will fit into your architecture's int size!**.  If it doesn't, you'll get strange results.
