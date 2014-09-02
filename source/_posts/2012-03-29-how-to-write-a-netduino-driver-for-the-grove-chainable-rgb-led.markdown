---
author: admin
comments: true
date: 2012-03-29 14:58:01+00:00
layout: post
slug: how-to-write-a-netduino-driver-for-the-grove-chainable-rgb-led
title: 'How-To: Write a Netduino driver for the Grove chainable RGB LED'
wordpress_id: 724
categories:
- How-To
tags:
- Netduino
---

A lot of people probably look at hardware that doesn't come with drivers for the Netduino or Arduino and don't even consider picking it up if they're new to this scene.  In this article I'll show you how I wrote a driver for [Grove's chainable RGB LED](http://www.epictinker.com/Grove-Chainable-RGB-LED-p/com53140p.htm) by just carefully reading the specs and experimenting.  I am no Netduino expert, I have only written a tiny bit of code for it since I got it, but this just reinforces how easy some drivers can be to write.

Keep in mind that my illustration of how easy it was to write this driver is not a reflection on how easy it is to write **_all_** drivers.  Some drivers take a ton of work.  Make sure you read the documentation before you buy something so you don't get stuck with some hardware you can't use.

My first step was to find [the documentation for the protocol for this device](http://www.seeedstudio.com/wiki/index.php?title=Twig_-_Chainable_RGB_LED).  I then scanned around to find the "Communication Protocol" and started digging.  What this showed me is that there are two connections to support the protocol for this device.  The first connection is called "CIN" for clock input and the second connection is called "DIN" for data input.  Simple enough, especially if we're using the standard Grove base shield and connectors.  Just hook it up and make sure you keep track of which port you're using and you're ready to start programming.  I used header 6 on my base shield so the relevant pins for me were D6 and D7.  D6 was CIN and D7 was DIN.

Now you'll see that there are six well defined bullet points explaining the basics of the protocol:
	
  * Data needs to be ready before CIN, and DIN gets into the buffer on the rising edge of CIN.
	
  * First 32 bits '0' are Start Frame
	
  * Flag bit is two '1'
	
  * Calibration bits B7',B6';G7',G6' and R7',R6' are inverse codes of B7,B6;G7,G6 and R7,R6
	
  * Gray data MSB first, and the order is BLUE, GREEN, and RED
	
  * After all nodes data sent, need to seed another 32 bits '0' to update the data

Let's step through these one by one to figure out how to send data to this device.

They first tell us that "data needs to be ready before CIN, and DIN gets into the buffer on the rising edge of CIN".  What this really translates to for you when programming is that when you want to send a bit to the device you should set that bit on the DIN pin (either 1 or 0), then set the CIN pin to high, and then set the CIN pin back to low.  Now you've sent one bit of data to the device.  Abstraction will make it so we can do this thinking once and then fall back on it later so let's write a function that sends one bit:

``` csharp
    private void sendBit(bool bit)
    {
        // Get DIN into the proper state
        din.Write(bit);
    
        // Set the clock high
        cin.Write(true);
    
        // Set the clock low
        cin.Write(false);
    }
```

This function makes the assumption that you've defined cin and din elsewhere.  The setup for them in my case (using pins D6 and D7 as I described above) would look like this:

``` csharp
    // Use D6 for CIN and D7 for DIN (Grove Base Shield v1.2 header #6)
    OutputPort cin = new OutputPort(Pins.GPIO_PIN_D6, false);
    OutputPort din = new OutputPort(Pins.GPIO_PIN_D7, false);
```

Now they tell us that the first 32 bits are all zeroes and that this is called a start frame.  This makes me think it would be a good idea to expand our abstraction to let us send bytes and then write another function that would send this start frame.  That would look like this:

``` csharp
    private void sendByte(byte data)
    {
        // Send the bits MSB first
        sendBit((data & 0x80) == 0x80);
        sendBit((data & 0x40) == 0x40);
        sendBit((data & 0x20) == 0x20);
        sendBit((data & 0x10) == 0x10);
        sendBit((data & 0x08) == 0x08);
        sendBit((data & 0x04) == 0x04);
        sendBit((data & 0x02) == 0x02);
        sendBit((data & 0x01) == 0x01);
    }
    
    private void sendStartFrame()
    {
        // The start frame is 32 bits of zeroes
        sendByte(0);
        sendByte(0);
        sendByte(0);
        sendByte(0);
    }
```

In the sendByte function I'm taking a byte and using logical AND and equals to extract the bits one by one.  One of the next bullet points says the data is MSB first so we want to get the most significant (ie. largest value holding) bits first so that's how I went about sending the bits.  Now that we can send bytes sending the start frame is as easy as calling that function four times with the value 0.

Next they talk about flag bits.  In the protocol it shows that after the start frame there are some flag bits.  This tells us the two flag bits are both ones.  Here's a simple function that can do that:

``` csharp
    private void sendFlagBits()
    {
        // The flag bits are two 1s
        sendBit(true);
        sendBit(true);
    }
```

Now this part gets a bit trickier but not too bad.  They tell us that we need to send the inverse of B7, B6, G7, G6, R7, R6, followed by the actual color data itself as bytes.  B7 and B6 are the two highest bits in the blue color component, G7 and G6 are the two highest bits in the green color component, and R7 and R6 are the two highest bits in the red color component.  Sending that data with the functions we built up now is really easy.

``` csharp
    private void sendColorData(byte red, byte green, byte blue)
    {
        // Send the inverse bits of the B7, B6, G7, G6, R7, R6
        sendBit((blue & 0x80) != 0x80);
        sendBit((blue & 0x40) != 0x40);
        sendBit((green & 0x80) != 0x80);
        sendBit((green & 0x40) != 0x40);
        sendBit((red & 0x80) != 0x80);
        sendBit((red & 0x40) != 0x40);
    
        // Send the actual colors
        sendByte((byte)blue);
        sendByte((byte)green);
        sendByte((byte)red);
    }
```

We're almost there, there's only one step left!  Now we need to send the end frame.  It turns out that the end frame is the same as the start frame but to keep the code readable I did this:

``` csharp
    private void sendEndFrame()
    {
        // The end frame is the same as the start frame
        sendStartFrame();
    }
```

Now you have enough information to send a color to your device.  We should probably wrap it up so that we can make it even easier to use though.  Let's just think about how this is going to be used in practice.  A typical user will have a few of these LEDs chained together but for testing you might want to use just one.  We know that the protocol requires a start frame, then flag bits, then color data, and the end frame if we use a single LED but for two LEDs it looks like this:
	
  * Send start frame
	
  * Send flag bits
	
  * Send color data
	
  * Send flag bits
	
  * Send color data
	
  * Send end frame

So for our first LED we want to send the start frame, the flag bits and the color data.  For our last LED we want to send flag bits, the color data, and the end frame.  Here's a function that does that:

``` csharp
    private void setColor(byte red, byte green, byte blue, bool first, bool last)
    {
        // Is this the first color?
        if (first)
        {
            // Yes, send the start frame
            sendStartFrame();
        }
        else
        {
            // No, do nothing
        }
    
        // Send the flag bits
        sendFlagBits();
    
        // Send the colors
        sendColorData(red, green, blue);
    
        // Is this the last color?
        if (last)
        {
            // Yes, send the end frame
            sendEndFrame();
        }
        else
        {
            // No, do nothing
        }
    }
```

The extra else blocks have no impact on the executable generated so they're just there for clarity.  You can remove them if you want.  Now if you want to send a bunch of colors to a string of three LEDs you can do this:

``` csharp
    setColor(255, 0, 0, true, false);
    setColor(0, 255, 0, false, false);
    setColor(0, 0, 255, false, true);
```

That would set a string of three LEDs to solid red, solid green, and solid blue.  That's it, your driver is written!

Check out [my driver on Github](https://github.com/timmattison/timmattison-netduino-drivers/tree/master/drivers/chainable-rgbled-grove/chainable-rgbled-grove) to see a few more enhancements I added.  My code has an abstraction of a color from three integers into an RGB object so it's easier to pass around and also has a function that can set a string of LEDs from an array of RGB objects.  There's some sample code as well and if you want to see the system in action check out these simple videos:
	
  * [Cycling random colors](http://www.youtube.com/watch?v=cOlJoXWr_qQ)
	
  * [Cycling red, green, and blue](http://www.youtube.com/watch?v=b5X3mvLbBf8)

Post in the comments and share your thoughts and project ideas.  If you use this library please let me know!