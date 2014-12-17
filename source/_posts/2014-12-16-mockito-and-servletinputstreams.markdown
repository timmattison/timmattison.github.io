---
layout: post
title: "Mockito and ServletInputStreams"
date: 2014-12-16 07:00:22 -0500
comments: true
categories: 
---
I was working on a few applications that involve servlets recently and I came across a situation that initially seemed challenging to test with [Mockito](https://github.com/mockito/mockito).  I wanted to do something relatively simple which was read a [Protobuf](https://github.com/google/protobuf/) sent from a client, turn it into an object, and do some processing on it.

The question is how do you test a servlet that needs to get the input stream from a servlet request?

I found [a Stack Overflow post that addresses how to do this with an older version of the ServletInputStream](https://stackoverflow.com/questions/13353545/mocking-multipart-mime-request-with-mockito) but doing it now requires that you override three additional methods (`isFinished`, `isReady`, and `setReadListener`).

My issue with this is that I don't want to override those methods because I don't really know what I want them to do.  If I'm mocking something I want to make sure I know when and where it will be used or I want the mocking framework to return default values or throw exceptions so I know where to look when something breaks.

What I landed on was using the `thenAnswer` method like this:

``` java Mocking a ServletInputStream
byte[] myBinaryData = "TEST".getBytes();
ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(myBinaryData);
		
mockServletInputStream = mock(ServletInputStream.class);
        
when(mockServletInputStream.read(Matchers.<byte[]>any(), anyInt(), anyInt())).thenAnswer(new Answer<Integer>() {
    @Override
    public Integer answer(InvocationOnMock invocationOnMock) throws Throwable {
        Object[] args = invocationOnMock.getArguments();
        byte[] output = (byte[]) args[0];
        int offset = (int) args[1];
        int length = (int) args[2];
        return byteArrayInputStream.read(output, offset, length);
    }
});
```
 
If you need to ever mock a ServletInputStream feel free to use this code to do it.  So far it has worked perfectly for me.