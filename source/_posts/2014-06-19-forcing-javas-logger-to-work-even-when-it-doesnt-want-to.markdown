---
layout: post
title: "Forcing Java's logger to work, even when it doesn't want to"
date: 2014-06-19 18:31:42 -0400
comments: true
categories: 
---

If you do any Java development I'm sure you've run into a situation where the logger just does not do what you want it to do.  Sometimes you can't get it to print messages other than `INFO` level messages, sometimes you can't get it to print anything to the console at all.

In order to get around this I have a few convenience methods that I've migrated from project to project that I wanted to share.  Soon I'll put them in [Jayuda](https://github.com/timmattison/jayuda) when I revamp it.  For now, you can just copy them from the blocks below.

***NOTE:*** All of this info is for plain `java.util.logging`.  If you are using another logging system this probably won't work for you.

The first function makes sure that there is at least one console logger in your logging system.

``` java
    public static void forceConsoleLogging() {
        // Get the root logger instance
        LogManager logManager = LogManager.getLogManager();
        Logger rootLogger = logManager.getLogger("");
        
        // Set the default logging level to all
        rootLogger.setLevel(Level.ALL);

        // Loop and see if a console handler is already installed
        boolean consoleHandlerInstalled = false;

        for (Handler handler : rootLogger.getHandlers()) {
            if (handler instanceof ConsoleHandler) {
                consoleHandlerInstalled = true;
                break;
            }
        }

        // Is a console handler already installed?
        if (consoleHandlerInstalled) {
            // Yes, do nothing
            return;
        }

        // No console handler installed, install one
        rootLogger.addHandler(new ConsoleHandler());
    }
```

The second function is a bit more aggressive.  It iterates over your console loggers and makes sure all of them log everything.  You can use this in a pinch when you're having serious issues and you need to see everything.

``` java
   public static void logEverything() {
        // Get the logger instance
        LogManager logManager = LogManager.getLogManager();
        Logger rootLogger = logManager.getLogger("");

        // Set the default logging level to all
        rootLogger.setLevel(Level.ALL);

        // Loop and see if any console handlers are already installed
        List<ConsoleHandler> consoleHandlers = new ArrayList<ConsoleHandler>();

        for (Handler handler : rootLogger.getHandlers()) {
            if (handler instanceof ConsoleHandler) {
                consoleHandlers.add((ConsoleHandler) handler);
            }
        }

        // Is a console handler already installed?
        if (consoleHandlers.size() == 0) {
            // No, create one.  Add it to the list and to the root logger.
            Handler consoleHandler = new ConsoleHandler();
            consoleHandlers.add((ConsoleHandler) consoleHandler);
            rootLogger.addHandler(consoleHandler);
        }

        // Loop through all console handlers and make them log everything
        for (ConsoleHandler consoleHandler : consoleHandlers) {
            consoleHandler.setLevel(Level.ALL);
        }
    }
```

If you do this be prepared to see TONS of output including output from all of the libraries you use.  Most of the time this is overkill.  But sometimes when the logger just won't do what you want no matter how hard you try this will save your sanity.

Have better ways to do this?  Did this get you out of a jam?  Please post in the comments below.

UPDATE: [Added to Jayuda](https://github.com/timmattison/jayuda/commit/1484b47d72c6f5943340eebc8d78fafaa9604485)!