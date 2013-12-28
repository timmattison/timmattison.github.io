---
author: admin
comments: true
date: 2009-11-08 23:59:59+00:00
layout: post
slug: how-to-fix-error-unexpected-java-lang-nosuchmethoderror-messages-when-compiling-gwt-code-in-eclipse
title: 'How-To: Fix "[ERROR] Unexpected java.lang.NoSuchMethodError" messages when
  compiling GWT code in Eclipse'
wordpress_id: 218
categories:
- How-To
tags:
- Eclipse
- GWT
- Java
---

This morning when I opened up an old GWT project to rebuild it and bring it from GWT 1.5 to GWT 1.7 Eclipse spit out this error message:

    
    [ERROR] Unexpected
    
    java.lang.NoSuchMethodError: org.eclipse.jdt.internal.compiler.lookup.ProblemReferenceBinding.closestReferenceMatch()Lorg/eclipse/jdt/internal/compiler/lookup/ReferenceBinding;
    	at com.google.gwt.dev.javac.JsniChecker$CheckingVisitor.findClass(JsniChecker.java:231)
    	at com.google.gwt.dev.javac.JsniChecker$CheckingVisitor.checkRefs(JsniChecker.java:142)
    	at com.google.gwt.dev.javac.JsniChecker$CheckingVisitor.endVisit(JsniChecker.java:65)
    	at org.eclipse.jdt.internal.compiler.ast.MethodDeclaration.traverse(MethodDeclaration.java:247)
    	at org.eclipse.jdt.internal.compiler.ast.TypeDeclaration.traverse(TypeDeclaration.java:1337)
    	at org.eclipse.jdt.internal.compiler.ast.TypeDeclaration.traverse(TypeDeclaration.java:1206)
    	at org.eclipse.jdt.internal.compiler.ast.CompilationUnitDeclaration.traverse(CompilationUnitDeclaration.java:518)
    	at com.google.gwt.dev.javac.JsniChecker.check(JsniChecker.java:350)
    	at com.google.gwt.dev.javac.JsniChecker.check(JsniChecker.java:340)
    	at com.google.gwt.dev.javac.CompilationUnitInvalidator.validateCompilationUnits(CompilationUnitInvalidator.java:159)
    	at com.google.gwt.dev.javac.CompilationState.compile(CompilationState.java:198)
    	at com.google.gwt.dev.javac.CompilationState.refresh(CompilationState.java:178)
    	at com.google.gwt.dev.javac.CompilationState.(CompilationState.java:93)
    	at com.google.gwt.dev.cfg.ModuleDef.getCompilationState(ModuleDef.java:264)
    	at com.google.gwt.dev.Precompile.precompile(Precompile.java:283)
    	at com.google.gwt.dev.Compiler.run(Compiler.java:170)
    	at com.google.gwt.dev.Compiler$1.run(Compiler.java:124)
    	at com.google.gwt.dev.CompileTaskRunner.doRun(CompileTaskRunner.java:88)
    	at com.google.gwt.dev.CompileTaskRunner.runWithAppropriateLogger(CompileTaskRunner.java:82)
    	at com.google.gwt.dev.Compiler.main(Compiler.java:131)


As usual I Googled around a bit and [found a solution](http://forums.smartclient.com/showthread.php?t=7718) but I really wanted to know exactly how to fix this issue in the future.  The solution is even simpler than the original poster thought but without their input I would've never figured it out so thank you sujaydutta!

The issue stems from the GWT compiler needing your classpath in a certain order.  In particular you need to have your application source as the first entry, then GWT as the second entry.  In Eclipse you can do it like this:



	
  * Step 1: Right-click on your project and select "Properties"

	
  * Step 2: Click on "Java Build Path"

	
  * Step 3: Click on the "Order and Export" tab

	
  * Step 4: Click on your "GWT SDK" entry (if you're using the [Google Plugin for Eclipse](http://code.google.com/eclipse/) it's called "GWT SDK", otherwise it's whatever you decided to name it when you created your custom user library)

	
  * Step 5: Click the "Top" button on the right

	
  * Step 6: Click on your "src" entry (it should be your project name, followed by a forward slash, and then the word "src")

	
  * Step 7: Click the "Top" button on the right

	
  * Step 8: Click "OK"


Now when you go to rebuild your project you'll finally be rid of this error message and you can start hacking out GWT 1.7 code.  Good luck!  Post below if the above instructions don't work for you and maybe I can help.
