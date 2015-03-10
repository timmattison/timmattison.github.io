---
layout: post
title: "Validating Guava event bus interactions with Mockito"
date: 2015-03-10 18:43:15 -0400
comments: true
categories: 
---
Are you using [Guava's event bus](https://code.google.com/p/guava-libraries/wiki/EventBusExplained) in your Java project?  Do you need to test and validate interactions with the event bus but are having trouble?  Mockito can help you out here with just a few lines of code.

Assume you have two event types.  We'll call them `WantedEvent` and `UnwantedEvent`.  In your test you can use Mockito to create a mock event bus like this:

``` java
mockEventBus = mock(EventBus.class);
```

Then you can use Mockito's `doAnswer` functionality to intercept all interactions with the event bus and do something like this:

``` java
doAnswer(new Answer<Void>() {
    @Override
    public Void answer(InvocationOnMock invocationOnMock) throws Throwable {
        Object argument = invocationOnMock.getArguments()[0];

        if (argument instanceof WantedEvent) {
            wantedEventCount++;
        } else if (argument instanceof UnwantedEvent) {
            unwantedEventCount++;
        } else {
            throw new UnsupportedOperationException("This kind of event was not expected");
        }

        return null;
    }
}).when(mockEventBus).post(anyObject());
```

When you use your event bus in your tests now you'll be counting the number of times `WantedEvent` and `UnwantedEvent` are published (you do need to make those variables accessible outside the scope of this anonymous `Answer<Void>` block).

You'll also be throwing exceptions if you see any other kinds of events that you didn't expect so you can fail immediately if there is additional unwanted behavior going on.  Naturally you can leave the else part out and ignore other events completely too.

Using this simple pattern I've been able to debug, test, and be confident in the implementation of several projects that use the Guava event bus.

Do you have any tricks or tips related to this article?  Is there a better or easier way to do what I'm doing here?  Did this get you out of a bind?  Post in the comments!