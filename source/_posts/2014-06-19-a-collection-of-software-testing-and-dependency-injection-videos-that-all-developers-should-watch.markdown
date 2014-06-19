---
layout: post
title: "A collection of software testing and dependency injection videos that all developers should watch"
date: 2014-06-19 07:06:23 -0400
comments: true
categories: 
---

I often get asked about what recommendations I would make to people to make them better developers.  After working on a very large project last year I have consistently told people that no matter what platform they use they should work on and think about two things: software testing and dependency injection.

Software testing includes unit tests, integration tests, regression tests, human testing, and a lot more.  It is a broad set of topics that is hard to distill into just a few bits that will always be applicable.

But how about getting people to write code that is testable?  Testability is an easy concept to gloss over.  While there is a stigma associated with writing code that has no test coverage there is nowhere near as much of a stigma for having to jump through endless hoops to get your software to be tested.  In fact, these hoops combined with time pressure are probably why a lot of developers don't do proper testing.

There are three things that you can do immediately to start writing more testable code.  First, [learn the SOLID principle](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design) and if you need tighter focus then just start with S (single responsibility principle) and D (dependency inversion principle).  Second, use a [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) framework (AKA "DI framework").  Third, try to follow the [Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter) as much as possible.

Here are some dependency injection framework recommendations:

* For Java developers I recommend [Guice](https://code.google.com/p/google-guice/).
* For Android developers I recommend [Dagger](https://square.github.io/dagger/).
* For .NET developers I recommend [Ninject](http://www.ninject.org/).

Those Wikipedia links are only meant for basic information on the topics.  Once you're ready to learn about these principles you can get a serious head start by watching a few videos.  The videos by Misko Hevery are some of my favorites and they're 30 minutes versus 60 minutes which is a little easier to carve out of your day.  I suggest watching those first.

These videos are all part of the [Google Tech Talk](https://www.youtube.com/channel/UCtXKDgv1AVoG88PLl8nGXmw) series.

30 minute sessions with Misko:

* [Don’t look for things](http://www.youtube.com/watch?v=RlfLCWKxHJ0) - Discusses how the object model of a system may be broken if you’re not directly handed what your object needs to get its job done.  In the best case this is handled automatically by dependency injection which makes it so you’re never shuffling in and out constructor argument lists as you swap implementations.
*  [Global State and Singletons](http://www.youtube.com/watch?v=-FRm3VPhseI) - Discusses how global state can silently break tests and how to try to avoid it
*  [Unit Testing](http://www.youtube.com/watch?v=wEhu57pih5w) - Discusses how unit tests should be structured and that the goal should be to have unit tests that run so fast that you’re running them all the time.  Integration tests and user simulations will still take longer but you should always try to write unit tests that run in milliseconds when possible.  An interesting fact that he drops in this talk, I think, is that Google’s set of tests for a project are often as large as or even larger than the actual project itself.
* [Inheritance, Polymorphism, & Testing](http://www.youtube.com/watch?v=4F72VULWFvc) - Discusses how dense code can be unraveled with polymorphism and how that can make it easier to test and get complete testing coverage

60 minute sessions:

* [Big Modular Java with Guice](http://www.youtube.com/watch?v=hBVJbzAagfs) - Discusses how to use Guice to write maintainable, large Java projects
* [Java on Guice: Dependency Injection, the Java Way](http://www.youtube.com/watch?v=0iSB0L9avmg) - One of the earlier Guice talks that compares and contrasts using Guice with the non-DI way