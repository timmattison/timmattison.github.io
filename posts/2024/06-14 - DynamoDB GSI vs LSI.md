---
title: "DynamoDB GSI vs. LSI"
date: 2024-06-14 05:15:00
---

# {{ $frontmatter.title }}

## Updated 2024-09-19

[AWS has a good video on how to choose between GSI and LSI](https://www.youtube.com/watch?v=BkEu7zBWge8) that also covers their internal differences.

Highlights:

- GSI
  - Eventually consistent because it is implemented as a shadow table that receives updates from the original table
  - Can use any primary key and sort key
- LSI
  - Strongly consistent because the data comes from the original table
  - Can use any sort key but always uses the table's original primary key

## Original content

Are you struggling to understand the difference between a DynamoDB Global Secondary Index (GSI) and a Local Secondary Index (LSI)?

[A true legend wrote it up on Stack Overflow concisely](https://stackoverflow.com/a/29775399):

```
Global secondary index — an index with a hash and range key
that can be different from those on the table. A global
secondary index is considered "global" because queries on
the index can span all of the data in a table, across all
partitions.

Local secondary index — an index that has the same hash key
as the table, but a different range key. A local secondary
index is "local" in the sense that every partition of a
local secondary index is scoped to a table partition that
has the same hash key.
```

Remember:
- Local == Same hash key, so it refers to data in the same partition
- Global == Any hash key, so it can refer to data in any partition 
