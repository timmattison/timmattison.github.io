---
layout: post
title: "Full example code showing how to use Guice and Jetty"
date: 2014-09-02 14:34:11 -0400
comments: true
categories: 
---
Today I spent a significant amount of time wrestling Jetty and Guice in order to get a very simple configuration up and running.  Many articles I found on this topic are incomplete or out of date so here is a start to finish example of how to get Guice and Jetty working together without *any* web.xml.

Step 0 - Add these dependencies to your pom.xml if they aren't there already

``` xml
        <dependency>
            <groupId>com.google.inject</groupId>
            <artifactId>guice</artifactId>
            <version>3.0</version>
        </dependency>
        <dependency>
            <groupId>com.google.inject.extensions</groupId>
            <artifactId>guice-servlet</artifactId>
            <version>3.0</version>
        </dependency>
```

Step 1 - Create a module that describes your servlet configuration.  Assume we have three servlets.  One is called FooServlet and is served on the "/foo" path.  One is called BarServlet and is served on the "/bar" path.  One is called IndexServlet and is served for all other paths.

``` java
import com.google.inject.servlet.ServletModule;

public class ApplicationServletModule extends ServletModule {
    @Override
    protected void configureServlets() {
        bind(FooServlet.class);
        bind(BarServlet.class);
        bind(IndexServlet.class);

        serve("/foo").with(FooServlet.class);
        serve("/bar").with(BarServlet.class);
        serve("/*").with(IndexServlet.class);
    }
}
```

Step 2 - Create a module that contains your Guice bindings.  We'll assume you have something called NonServletImplementation you want bound to NonServletInterface that you'll need to have injected into your servlets.

``` java
import com.google.inject.AbstractModule;

public class NonServletModule extends AbstractModule {
    protected void configure() {
        bind(NonServletInterface.class).to(NonServletImplementation.class);
    }
}
```

Step 3 - Instantiate your injector with all of your modules in the code where you want to create the server.  If you have other modules you want to include you should include those as well.

``` java
NonServletModule nonServletModule = new NonServletModule();
ApplicationServletModule applicationServletModule = new ApplicationServletModule();
Injector injector = Guice.createInjector(nonServletModule, applicationServletModule);
```

Step 4 - Instantiate the server.  You do not need to pass it the injector explicitly.  Guice will handle that for you but you MUST instantiate the injector before this code runs.

``` java
	int port = 8080;
	Server server = new Server(port);
	
	ServletContextHandler servletContextHandler = new ServletContextHandler(server, "/", ServletContextHandler.SESSIONS);
	servletContextHandler.addFilter(GuiceFilter.class, "/*", EnumSet.allOf(DispatcherType.class));
	
	// You MUST add DefaultServlet or your server will always return 404s
	servletContextHandler.addServlet(DefaultServlet.class, "/");
	
	// Start the server
	server.start();
	
	// Wait until the server exits
	server.join();
```

Step 5 - Make sure your servlets are setup to use Guice and use the `@Singleton` annotation.  Only the FooServlet skeleton is shown here but you should create the BarServlet and the IndexServlet as well.

``` java
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by timmattison on 8/4/14.
 */
@Singleton
public class FooServlet extends HttpServlet {
    private final NonServletInterface nonServletInterface;

    @Inject
    public FooServlet(NonServletInterface nonServletInterface) {
        this.nonServletInterface = nonServletInterface;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Do whatever you need to do with POSTs
        ...
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Do whatever you need to do with GETs
        ...
    }
}
```

If all goes well then everything will be wired up with Guice and your Jetty server is ready to rock.  It turns out to be a lot simpler than working with the web.xml in my opinion since everything is mapped out explicitly in one place.