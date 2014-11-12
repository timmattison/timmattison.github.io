---
layout: post
title: "Fixing javac on Mac OS when multiple JVMs are installed"
date: 2014-11-12 06:59:45 -0500
comments: true
categories: 
---
For some reason I decided to install the Java 8 JDK a few days ago when I upgraded to Yosemite.  In IntelliJ it isn't a problem but on the command-line it isn't so nice.  Here's what I get when I try to use javac:

``` console
$ javac src/com/timmattison/Main.java 
warning: /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/Object.class): major version 52 is newer than 51, the highest major version supported by this compiler.
It is recommended that the compiler be upgraded.
warning: /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/String.class): major version 52 is newer than 51, the highest major version supported by this compiler.
It is recommended that the compiler be upgraded.
/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/Object.class): warning: Cannot find annotation method 'value()' in type 'Profile+Annotation': class file for jdk.Profile+Annotation not found
/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/String.class): warning: Cannot find annotation method 'value()' in type 'Profile+Annotation'
warning: /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/AutoCloseable.class): major version 52 is newer than 51, the highest major version supported by this compiler.
It is recommended that the compiler be upgraded.
/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/AutoCloseable.class): warning: Cannot find annotation method 'value()' in type 'Profile+Annotation'
warning: /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/System.class): major version 52 is newer than 51, the highest major version supported by this compiler.
It is recommended that the compiler be upgraded.
/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/lang/System.class): warning: Cannot find annotation method 'value()' in type 'Profile+Annotation'
warning: /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/io/PrintStream.class): major version 52 is newer than 51, the highest major version supported by this compiler.
It is recommended that the compiler be upgraded.
/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/io/PrintStream.class): warning: Cannot find annotation method 'value()' in type 'Profile+Annotation'
warning: /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/io/FilterOutputStream.class): major version 52 is newer than 51, the highest major version supported by this compiler.
It is recommended that the compiler be upgraded.
/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/io/FilterOutputStream.class): warning: Cannot find annotation method 'value()' in type 'Profile+Annotation'
warning: /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/lib/ct.sym(META-INF/sym/rt.jar/java/io/OutputStream.class): major version 52 is newer than 51, the highest major version supported by this compiler.
It is recommended that the compiler be upgraded.
```

When I run `javac -version` I get mostly what I'd expect:

``` console
$ javac -version
javac 1.7.0_45
```

So why is it trying to use libraries from the Java 8 JDK?  Simply because I forgot to set JAVA_HOME.  On Mac OS you can quickly fix this by adding the following line to your .bash_profile and starting a new Terminal session:

```
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.7.0_45.jdk/Contents/Home/"
```

Of course you should change `_45` to reflect the specific version you're running and validate that the path in the `JAVA_HOME` variable exists.

Good luck!