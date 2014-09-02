---
layout: post
title: "Checking PostgreSQL to see if an index already exists"
date: 2014-09-02 08:16:01 -0400
comments: true
categories: 
---
In [my last post](http://blog.timmattison.com/archives/2014/09/02/checking-postgresql-to-see-if-a-constraint-already-exists/) I showed you a simple way to check to see if a constraint already existed in PostgreSQL.  Now I want to show you how to do the same thing for an index.

Here's the code but keep in mind that it makes the assumption that everything is in the `public` schema.

```
CREATE OR REPLACE FUNCTION create_index_if_not_exists (t_name text, i_name text, index_sql text) RETURNS void AS $$
DECLARE
  full_index_name varchar;
  schema_name varchar;
BEGIN

full_index_name = t_name || '_' || i_name;
schema_name = 'public';

IF NOT EXISTS (
    SELECT 1
    FROM   pg_class c
    JOIN   pg_namespace n ON n.oid = c.relnamespace
    WHERE  c.relname = full_index_name
    AND    n.nspname = schema_name
    ) THEN

    execute 'CREATE INDEX ' || full_index_name || ' ON ' || schema_name || '.' || t_name || ' ' || index_sql;
END IF;
END
$$
LANGUAGE plpgsql VOLATILE;
```

You can now use the function like this:

```
SELECT create_index_if_not_exists('table', 'index_name', '(column)');
```

No duplicated data, no exceptions.  Enjoy!