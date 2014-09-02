---
author: admin
comments: true
date: 2012-04-19 14:31:14+00:00
layout: post
slug: tips-for-debugging-springs-transactional-annotation
title: Tips for debugging Spring's @Transactional annotation
wordpress_id: 737
categories:
- Tips
---

For over a week now I've been cleaning up some legacy code that uses Spring and Hibernate to persist and process data in a SQL database.  The code works but it doesn't follow the strict philosophy of service oriented architecture in the sense that there are several places that Spring and Hibernate weren't doing what they were expected to do and a few workarounds had to be implemented.  Since we were bringing more programmers on board I wanted to make sure that everything played by the rules and was easy to update so I had to learn a lot that I had glossed over in the past.

With some creative Googling I found two invaluable resources that I need to give credit to:
	
  * [Monitoring Declarative Transactions in Spring](http://java.dzone.com/articles/monitoring-declarative-transac?page=0,1)
	
  * [Starting new transactions in Spring bean](http://stackoverflow.com/questions/3037006/starting-new-transaction-in-spring-bean)

Here's what I distilled out of everything I went through:

  1. @Transactional annotations only work on public methods.  If you have a private or protected method with this annotation there's no (easy) way for Spring AOP to see the annotation.  It doesn't go crazy trying to find them so make sure all of your annotated methods are public.

  2. Transaction boundaries are only created when properly annotated (see above) methods are called through a Spring proxy.  This means that you need to call your annotated method directly through an @Autowired bean or the transaction will never start.  If you call a method on an @Autowired bean that isn't annotated which itself calls a public method that is annotated **_YOUR ANNOTATION IS IGNORED_**.  This is because Spring AOP is only checking annotations when it first enters the @Autowired code.

  3. Never blindly trust that your @Transactional annotations are actually creating transaction boundaries.  When in doubt test whether a transaction really is active (see below)

My first problem was that the code was annotated improperly like this:

``` java
    /**
     * This code example is BAD code, do not use it!
     */
    class NonWorkingMyClass {
    
      @Autowired
      protected MyService myService;
    
      public void calledFirst() {
        // Do some setup work...
    
        // Call our internal method
        calledSecond();
      }
    
      @Transactional
      private void calledSecond() {
        MyObject myObject = myService.retrieveLatest();
    
        // Update some object fields
        myObject.setName("New Name");
      }
    }
```

In this case someone would call NonWorkingMyClass.calledFirst(), it would then call calledSecond() and try to update the name field.  This works if your XML configuration is set up properly but it will not be in a transaction.  This can cause concurrency issues that won't show up until it's really inconvenient.

Here's the working version of that code:

``` java 
    /**
     * This code example works
     */
    class WorkingMyClass {
    
      @Autowired
      protected MyService myService;
    
      @Transactional
      public void calledFirst() {
        // Do some setup work...
    
        // Call our internal method
        calledSecond();
      }
    
      private void calledSecond() {
        MyObject myObject = myService.retrieveLatest();
    
        // Update some object fields
        myObject.setName("New Name");
      }
    }
```

Now when someone called WorkingMyClass.calledFirst() it would do what you expect in a transaction and the transaction boundaries are properly respected.

This looks like a simple fix that should only take a few minutes but finding out that was the problem involved turning on lots of Spring DEBUG level logging, Googling, and actually testing to make sure the transactions were active.  Before I knew what I know now I used some code from the first site I listed to show if I was inside a transaction or not.  I was shocked and relieved when it showed that I wasn't because it meant the concurrency issues weren't due to bad programming, just bad configuration.  Here are the methods that I came up with that you can use to see if you are in a transaction and even force your code to throw an exception if it isn't.  This can be invaluable if someone messes up an annotation in the future or breaks your XML configuration.

This code belongs in a utility class that is accessible from anywhere.  There are two flags you will need to put somewhere:

transactionDebugging - Indicates we should do the transaction tests
verboseTransactionDebugging - Indicates we should print debug messages with the transaction tests

verboseTransactionDebugging has no effect if transactionDebugging is false.

``` java
    class DebugUtils {
    	private static final transactionDebugging = true;
    	private static final verboseTransactionDebugging = true;
    
    	public static void showTransactionStatus(String message) {
    		System.out.println(((transactionActive()) ? "[+] " : "[-] ") + message);
    	}
    
    	// Some guidance from: http://java.dzone.com/articles/monitoring-declarative-transac?page=0,1
    	public static boolean transactionActive() {
    		try {
    			ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
    			Class tsmClass = contextClassLoader.loadClass("org.springframework.transaction.support.TransactionSynchronizationManager");
    			Boolean isActive = (Boolean) tsmClass.getMethod("isActualTransactionActive", null).invoke(null, null);
    
    			return isActive;
    		} catch (ClassNotFoundException e) {
    			e.printStackTrace();
    		} catch (IllegalArgumentException e) {
    			e.printStackTrace();
    		} catch (SecurityException e) {
    			e.printStackTrace();
    		} catch (IllegalAccessException e) {
    			e.printStackTrace();
    		} catch (InvocationTargetException e) {
    			e.printStackTrace();
    		} catch (NoSuchMethodException e) {
    			e.printStackTrace();
    		}
    
    		// If we got here it means there was an exception
    		throw new IllegalStateException("ServerUtils.transactionActive was unable to complete properly");
    	}
    
    	public static void transactionRequired(String message) {
    		// Are we debugging transactions?
    		if (!transactionDebugging) {
    			// No, just return
    			return;
    		}
    
    		// Are we doing verbose transaction debugging?
    		if (verboseTransactionDebugging) {
    			// Yes, show the status before we get to the possibility of throwing an exception
    			showTransactionStatus(message);
    		}
    
    		// Is there a transaction active?
    		if (!transactionActive()) {
    			// No, throw an exception
    			throw new IllegalStateException("Transaction required but not active [" + message + "]");
    		}
    	}
    }
```    

In our previous code example we could use these new methods like this:

``` java
    /**
     * This code example works
     */
    class WorkingMyClass {
    
      @Autowired
      protected MyService myService;
    
      @Transactional
      public void calledFirst() {
        // Make sure we're using transactions.  Include the name of the class and method
        //   so it is easier to track down later if there are problems.
        DebugUtils.transactionRequired("WorkingMyClass.calledFirst");
    
        // Do some setup work...
    
        // Call our internal method
        calledSecond();
      }
    
      private void calledSecond() {
        MyObject myObject = myService.retrieveLatest();
    
        // Update some object fields
        myObject.setName("New Name");
      }
    }
```

That's it.  Post in the comments if this helps you out or if you want to add to the code.