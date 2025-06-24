---
title: "Cross-compiling Rust on MacOS"
date: 2025-06-24 14:14:00
---

# {{ $frontmatter.title }}

If you're trying to cross-compile Rust for another platform on MacOS here are the things you'll need to do. If you're hitting this error I have you covered:

```
error: toolchain 'stable-x86_64-unknown-linux-gnu' may not be able to run on this system
note: to build software for that platform, try `rustup target add x86_64-unknown-linux-gnu` instead
note: add the `--force-non-host` flag to install the toolchain anyway
Error:
   0: couldn't install toolchain `stable-x86_64-unknown-linux-gnu`
   1: `rustup toolchain add stable-x86_64-unknown-linux-gnu --profile minimal` failed with exit status: 1
```

## Issue #1: You need to install Docker

This is low hanging fruit. Install Docker.

## Issue #2: You have an old version of cross

Easy, run this:

```bash
cargo install cross --git https://github.com/cross-rs/cross
```

## Issue #3: You don't have the necessary config

Create a Cross.toml file like this:

```
[target.x86_64-unknown-linux-musl]
image = "ghcr.io/cross-rs/x86_64-unknown-linux-musl:edge"
```

This is specific to compiling for x86_64 with musl so you might need to modify these values for other environments and definitely for other architectures.

For my old Raspberry Pi 2 (32-bit) I use this because compiling Rust programs on it is just not really feasible:

```
[target.armv7-unknown-linux-gnueabihf]
image = "ghcr.io/cross-rs/armv7-unknown-linux-gnueabihf:edge"
```

## Issue #4: You're not compiling with cross

Compile like this:

```bash
cross build --target x86_64-unknown-linux-musl --release
```

Or for the Pi example like this:

```bash
cross build --target armv7-unknown-linux-gnueabihf --release
```

Again, your architecture and musl/gnu setup may vary but this is the way to do it. I just make a script called cross-build.sh with this in it so I never have to think about it.

## Conclusion

And biggity bam, just like that... down comes the stage!
