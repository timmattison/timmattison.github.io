---
title: "Building Tauri apps on MacOS"
date: 2024-12-05 10:11:00
---

# {{ $frontmatter.title }}

If you're having trouble building Tauri apps on MacOS (build fails, blank window) you're not alone.

Here are the things I ran into and how I fixed them.

## Issue #1: `tauri` command not found

Error:

```bash
error: no such command: `tauri`

	Did you mean `miri`?

	View all installed commands with `cargo --list`
	Find a package to install `tauri` with `cargo search cargo-tauri`
```

Fix:

```bash
cargo install tauri-cli --version "^2.0.0" --locked
```

## Issue #2: Cargo.lock format version issue

Error:

```bash
invalid Cargo.lock format version: `4`
```

Fix:

```bash
cargo install dioxus-cli@0.6.0-rc.0
```

NOTE: This will change when dioxus-cli 0.6.0 is released.

## Issue #3: `trunk` command not found

Error:

```bash
    Running BeforeDevCommand (`trunk serve`)
sh: trunk: command not found
    Error The "beforeDevCommand" terminated with a non-zero status code.
```

Fix:

```bash
cargo install trunk
```

## Issue #4: `wasm32-unknown-unknown` target not found and/or blank screen

The error for this is easy to miss since it's at the top of the build log but doesn't cause it to exit.

Error:
```bash
error[E0463]: can't find crate for `std`
  |
  = note: the `wasm32-unknown-unknown` target may not be installed
  = help: consider downloading the target with `rustup target add wasm32-unknown-unknown`

For more information about this error, try `rustc --explain E0463`.
```

Anyway, the fix is this:

```bash
rustup target add wasm32-unknown-unknown
```