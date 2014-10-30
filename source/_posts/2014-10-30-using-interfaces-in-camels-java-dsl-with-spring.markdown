---
layout: post
title: "Using interfaces in Camel's Java DSL with Spring"
date: 2014-10-30 16:29:26 -0400
comments: true
categories: 
---

When writing some routes with Camel's Java DSL I came across this exception:

```
Caused by: java.lang.IllegalStateException: No method invocation could be created, no matching method could be found on: null
```

After a lot of tracing I figured out that it was related to me calling the `.bean(...)` method with a class that was actually just an interface.  What was happening was that Camel wants to instantiate this class, usually using Spring, but cannot do that if it isn't a concrete implementation.

This proved to be a real problem because I had an interface that had two implementations.  One of these implementations is used for debugging and the other is used for production.  I didn't want to have to manually select which one I was using in my code because that's Spring's job so I came up with a way to do it.

For the complete background here's what my interface looks like:

``` java The interface
import org.apache.camel.Processor;

public interface ProtobufToWire extends Processor {
}
```

This converts a Protobuf to our "wire" format.  That format could be the native protobuf binary format or JSON.  I implement this empty interface in two classes called `ProtobufToBinary` and `ProtobufToJson` and I want to use the JSON one only for debugging.

To be clear doing this always fails with the exception I listed above:

``` java A route that always fails
from(SOME_URI).bean(ProtobufToWire.class);
```

To fix this I added this to my Java-based Spring config:

``` java Getting an instance of ProtobufToWire
    @Bean
    public ProtobufToWire protobufToWire() {
        return new ProtobufToBinary();
    }
```

Now because, I believe, that Camel's `bean(...)` method doesn't look up the beans with Spring this still fails.  What I needed to where I am defining my routes is this:

``` java Finally, how to get Camel to instantiate the right type

    @Autowired
    private ProtobufToWire protobufToWire;

    @Override
    public void configure() {
		from(SOME_URI).bean(protobufToWire.getClass());
    }
```

What I'm doing here is getting Spring to autowire an instance of that interface into a private variable and then asking it for its real concrete type.  Part of me says that I shouldn't have to do this but this is what works for me.

Did this help you out?  Do you have a better way to do it?  Post in the comments!