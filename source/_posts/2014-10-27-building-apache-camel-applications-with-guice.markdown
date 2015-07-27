---
layout: post
title: "Building Apache Camel applications with Guice"
date: 2014-10-27 18:40:13 -0400
comments: true
categories: 
---

**UPDATE 2015-07-27**: Included instructions to run the project from the command-line

[Apache Camel](https://camel.apache.org/) is a great framework for implementing [Enterprise Integration Patterns](https://camel.apache.org/enterprise-integration-patterns.html).  However, most of the examples you'll find out there show you how to use it with [the Spring framework](http://projects.spring.io/spring-framework/).  I'm much more comfortable with [Google Guice](https://github.com/google/guice) since I've used it in more production projects.

I did find an example of how to use Guice with Apache Camel but it wasn't commented well and involved doing a lot of extra work that didn't provide me any benefits.  So below I've listed the things that you'll need to do to get Guice and Camel working together.  What we are doing here is setting up Guice as a JNDI provider and automatically loading a Guice CamelModule via JNDI.

Step 1: Create a `jndi.properties` file in your project's `resources` directory.  The `java.naming.factory.initial` line tells JNDI to use Guice, the `org.guiceyfruit.modules` tells the [javax.naming.InitialContext class](http://docs.oracle.com/javase/7/docs/api/javax/naming/InitialContext.html) which module it should run at startup.

``` properties jndi.properties
# Guice JNDI provider
java.naming.factory.initial = org.apache.camel.guice.jndi.GuiceInitialContextFactory

# list of guice modules to boot up (space separated)
org.guiceyfruit.modules = com.timmattison.CamelGuiceApplicationModule
```

Step 2: Create a class with a static main method that will run your Camel routes.  Because JNDI and Guice do most of the work there isn't much to do here.

``` java com.timmattison.CamelApplication
package com.timmattison;

import javax.naming.InitialContext;

/**
 * Created by timmattison on 10/27/14.
 */
public class CamelApplication {
    public static void main(String[] args) throws Exception {
        // Create the Camel context with Guice
        InitialContext context = new InitialContext();

        // Loop forever
        while (true) {
            // Sleep so we don't kill the CPU
            Thread.sleep(10000);
        }
    }
}
```

Step 3: Create a class that extends `RouteBuilder` that implements a route (or multiple routes).

In my case I created a RestRoutes class that used the [RESTlet framework](http://restlet.com/) and created a single route using the [Direct component](https://camel.apache.org/direct.html).

I moved the constants out to separate classes so they'd be easier to refer to in other places if necessary.

``` java com.timmattison.CamelConstants

package com.timmattison;

/**
 * Created by timmattison on 10/27/14.
 */
public class CamelConstants {
    public static final String DIRECT_TEST_ROUTE_1 = "direct:testRoute1";
}
```

``` java com.timmattison.HttpConstants

package com.timmattison;

/**
 * Created by timmattison on 10/27/14.
 */
public class HttpConstants {
    public static final String TEST_URL_1 = "/test1";
    public static final String TEST_URL_2 = "/test2";
    public static final String TEST_URL_3 = "/test3";
}
```

``` java com.timmattison.RestRoutes
package com.timmattison;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.rest.RestBindingMode;

/**
 * Created by timmattison on 10/27/14.
 */
public class RestRoutes extends RouteBuilder {
    public static final String RESTLET = "restlet";
    public static final int PORT = 8000;

    @Override
    public void configure() throws Exception {
        restConfiguration().bindingMode(RestBindingMode.auto).component(RESTLET).port(PORT);

        rest(HttpConstants.TEST_URL_1)
                .get().to(CamelConstants.DIRECT_TEST_ROUTE_1);
    }
}
```

Step 4: Create the interfaces and the implementations that we're going to use in our route.

Here we're creating four things:

1. The interface that we're implementing that handles the route (`SayHello1`) that gets injected with Guice via JNDI.  This interface doesn't do anything other than give Guice a way to reference implementations of it.
2. An implementation of that interface (`BasicSayHello1`).  Also, `BasicSayHello1` is going to have a dependency that we want injected with Guice to make the example more complete.
3. The interface for the class that we want Guice to inject (`MessageHandler`)
4. The implementation that gets injected (`BasicMessageHandler`)

``` java com.timmattison.jndibeans.interfaces.SayHello1

package com.timmattison.jndibeans.interfaces;

import org.apache.camel.Processor;

/**
 * Created by timmattison on 10/27/14.
 */
public interface SayHello1 extends Processor {
}
```

``` java com.timmattison.jndibeans.BasicSayHello1

package com.timmattison.jndibeans;

import com.timmattison.jndibeans.interfaces.SayHello1;
import com.timmattison.nonjndibeans.interfaces.MessageHandler;
import org.apache.camel.Exchange;

import javax.inject.Inject;

/**
 * Created by timmattison on 10/27/14.
 */
public class BasicSayHello1 implements SayHello1 {
    private final MessageHandler messageHandler;

    @Inject
    public BasicSayHello1(MessageHandler messageHandler) {
        this.messageHandler = messageHandler;
    }

    @Override
    public void process(Exchange exchange) throws Exception {
        exchange.getOut().setBody(messageHandler.getMessage(getClass().getName()));
    }
}
```

``` java com.timmattison.nonjndibeans.interfaces.MessageHandler

package com.timmattison.nonjndibeans.interfaces;

/**
 * Created by timmattison on 10/28/14.
 */
public interface MessageHandler {
    public String getMessage(String input);
}
```

``` java com.timmattison.nonjndibeans.BasicMessageHandler

package com.timmattison.nonjndibeans;

import com.timmattison.nonjndibeans.interfaces.MessageHandler;

/**
 * Created by timmattison on 10/28/14.
 */
public class BasicMessageHandler implements MessageHandler {
    @Override
    public String getMessage(String input) {
        return "Hello " + input + "!";
    }
}
```

Step 5: Create the direct route that handles the route from `RestRoutes`

``` java com.timmattison.DirectTestRoutes

package com.timmattison;

import com.timmattison.jndibeans.interfaces.SayHello1;
import com.timmattison.jndibeans.interfaces.SayHello2;
import com.timmattison.jndibeans.interfaces.SayHello3;
import org.apache.camel.builder.RouteBuilder;

/**
 * Created by timmattison on 10/27/14.
 */
public class DirectTestRoutes extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from(CamelConstants.DIRECT_TEST_ROUTE_1)
                .beanRef(SayHello1.class.getName());
    }
}
```

Step 6: Create a Guice module that extends `CamelModuleWithMatchingRoutes`.  I bound my SayHello1 interface to BasicSayHello1, MessageHandler to BasicMessageHandler, and included my RestRoutes and DirectTestRoutes.

``` java com.timmattison.CamelGuiceApplicationModule

package com.timmattison;

import com.timmattison.jndibeans.BasicSayHello1;
import com.timmattison.jndibeans.interfaces.SayHello1;
import com.timmattison.nonjndibeans.BasicMessageHandler;
import com.timmattison.nonjndibeans.interfaces.MessageHandler;
import org.apache.camel.guice.CamelModuleWithMatchingRoutes;

/**
 * Created by timmattison on 10/27/14.
 */
public class CamelGuiceApplicationModule extends CamelModuleWithMatchingRoutes {
    @Override
    protected void configure() {
        super.configure();

        bind(SayHello1.class).to(BasicSayHello1.class);

        bind(MessageHandler.class).to(BasicMessageHandler.class);

        bind(RestRoutes.class);
        bind(DirectTestRoutes.class);
    }
}
```

Now if you don't want Guice to handle any external JNDI bindings then you're done.  You can run this application as-is and it will serve up the RESTlet route.

To run the application from Maven do this:

``` shell
mvn camel:run
```

You can test it by using cURL like this:

``` console
$ curl http://localhost:8000/test1
Hello com.timmattison.jndibeans.BasicSayHello1!
```

If you want to have Guice handle JNDI bindings you can easily add those into your module.  For example, if I wanted to be able to get an instance of `SayHello1` by using the JNDI name `sayHello1FromGuice` I could add this to my module:

``` java

    @Provides
    @JndiBind("sayHello1FromGuice")
    SayHello1 sayHello1FromGuice(Injector injector) {
        return injector.getInstance(SayHello1.class);
    }
```

This tells JNDI that our Guice provider will handle any JNDI requests for this name.  Luckily, we didn't have to create any of these manually because Guice automatically creates JNDI bindings for anything that you've called `bind` on using its class name.  

For example there is an automatic JNDI binding for `com.timmattison.jndibeans.interfaces.SayHello1` because we called `bind(SayHello1.class).to(BasicSayHello1.class)`.  If we ever want an instance of whatever Guice has bound to this we can ask JNDI for it using `SayHello1.class.getName()`.

You'll notice that in our `DirectTestRoutes` class we routed the direct test route to `beanRef` with the parameter `SayHello1.class.getName()`.  That's all you need to do as you add more classes to your Camel routes.

Want to try this out without building everything from scratch?  Head over to [my apache-camel-guice repo on Github](http://github.com/timmattison/apache-camel-guice
).

Good luck!  Don't forget to post in the comments!