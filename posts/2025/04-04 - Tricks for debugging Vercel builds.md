---
title: "Tricks for debugging Vercel builds"
date: 2025-04-04 09:37:00
---

# {{ $frontmatter.title }}

Rapid fire, here are some of the things that I've run into while doing builds on Vercel or just with Next.JS that might help you out.

## Issue #1: `ERR_PNPM_EXDEV`

If you see something like this:

```
ERR_PNPM_EXDEV EXDEV: cross-device link not permitted, copyfile '/vercel/path0/node_modules/.pnpm-store/v10/files/0a/ae75830ac8025d8069cc23f4732111e5f9cd2472b8afa49658fe912583400d01c204ee01b4bad2ec3ee7c578e2106cf44d01fd263ea22b4a33a080bf0b9e05-exec' -> '/vercel/path0/node_modules/.pnpm/@esbuild+linux-x64@0.20.2/node_modules/@esbuild/linux-x64_tmp_70/bin/esbuild'
Error: Command "pnpm install" exited with 1
```

You should try creating a file called `.npmrc` in your project root with this content:

```
node-linker=isolated
```

If you're a pnpm master you're probably thinking... isn't isolated the default? I think it's supposed to be, but I think the Vercel build process may change it to something else.

## Issue #2: `TypeError: tT is not a constructor` or similar

If you see something like this:

```
TypeError: tT is not a constructor
```

It will probably recommend you look into [these pre-render error suggestions](https://nextjs.org/docs/messages/prerender-error).

If that doesn't help then you should try looking for circular dependencies. Running `pnpx madge --circular --extensions ts ./` in the root of your project will help you find them.

The compiler doesn't always like circular dependencies so this can blow things up in a strange way.