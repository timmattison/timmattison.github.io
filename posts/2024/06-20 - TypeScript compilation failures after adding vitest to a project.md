---
title: "TypeScript compilation failures after adding vitest to a project"
date: 2024-06-20 03:58:00
---

# {{ $frontmatter.title }}

If you've just added vitest to your TypeScript project and you're running into this error:

```
node_modules/.pnpm/vite@5.3.1_@types+node@20.12.8/node_modules/vite/dist/node/index.d.ts:5:41 - error TS2307: Cannot find module 'rollup/parseAst' or its corresponding type declarations.
```

Please, save yourself some time and stop Googling. Just update your `package.json`'s `exclude` section to
include `test/**` or whatever your test path is, and `vitest.config.mts` like this:

```json
"exclude": [
  "node_modules",
  "cdk.out",
  "dist",
  "test/**",
  "vitest.config.mts"
]
```
