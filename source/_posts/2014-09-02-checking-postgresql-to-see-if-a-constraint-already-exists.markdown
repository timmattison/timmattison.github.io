---
layout: post
title: "Checking PostgreSQL to see if a constraint already exists"
date: 2014-09-02 08:01:00 -0400
comments: true
categories: 
---
Checking to see if a constraint already exists should be easy.  H2 and many other database have syntax for it.

For some reason PostgreSQL, my favorite database, doesn't have this.  I looked around and found [a decent solution on Stack Overflow](https://stackoverflow.com/questions/6801919/postgres-add-constraint-if-it-doesnt-already-exist?answertab=votes#tab-top) that I can add to my default template but something about it bothered me.

I didn't like the fact that the code asked for the table name and constraint name but then didn't use it in the SQL statement.  Leaving it like this means that someone could write this (note that foo becomes foo2 and bar becomes bar2 in the first two parameters):

```
SELECT create_constraint_if_not_exists(
        'foo',
        'bar',
        'ALTER TABLE foo ADD CONSTRAINT bar CHECK (foobies < 100);');

SELECT create_constraint_if_not_exists(
        'foo2',
        'bar2',
        'ALTER TABLE foo ADD CONSTRAINT bar CHECK (foobies < 100);');
```

And they would get an exception rather than having the constraint creation be skipped which could break a lot of things that expect this function to be safe.

They also could do this (note that foo becomes foo2 and bar becomes bar2 in the constraint SQL):

```
SELECT create_constraint_if_not_exists(
        'foo',
        'bar',
        'ALTER TABLE foo ADD CONSTRAINT bar CHECK (foobies < 100);');

SELECT create_constraint_if_not_exists(
        'foo',
        'bar',
        'ALTER TABLE foo2 ADD CONSTRAINT bar2 CHECK (foobies < 100);');
```

This could be even worse because a constraint wouldn't be created. 

My solution was to modify this script slightly:

```
CREATE OR REPLACE FUNCTION create_constraint_if_not_exists (t_name text, c_name text, constraint_sql text)
  RETURNS void
AS
$BODY$
  begin
    -- Look for our constraint
    if not exists (select constraint_name 
                   from information_schema.constraint_column_usage 
                   where table_name = t_name  and constraint_name = c_name) then
        execute 'ALTER TABLE ' || t_name || ' ADD CONSTRAINT ' || c_name || ' ' || constraint_sql;
    end if;
end;
$BODY$
LANGUAGE plpgsql VOLATILE;
```

Now you call it like this:

```
SELECT create_constraint_if_not_exists('foo', 'bar', 'CHECK (foobies < 100);');
```

And it will check the constraint properly by name.  This doesn't stop you from creating multiple constraints with the same criteria and different names though.  That's something you'll need to check for manually (for now).