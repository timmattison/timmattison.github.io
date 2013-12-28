---
author: admin
comments: true
date: 2009-11-30 03:52:59+00:00
layout: post
slug: how-to-setup-streaming-mp4-video-on-your-own-gentoo-server-and-other-distros
title: 'How-To: Setup streaming MP4 video on your own Gentoo server (and other distros)'
wordpress_id: 227
categories:
- How-To
tags:
- Apache
- Gentoo
- Linux
- streaming video
- sysadmin
---

With so many free streaming services available today ([Vimeo](http://www.vimeo.com) being the best and [YouTube](http://www.youtube.com) being the most widely recognized) you might wonder why someone would want to host their own videos.  My main reason is so that I can more easily see who watches my content.  Other reasons include better access control if your videos are personal in nature, or a more integrated, branded user experience if you're producing content that is subscription, pay-per-view or ad supported.  You might also want to get around the restrictions that come with the free accounts these sites offer without paying for their premium services.  If you're already invested in the hardware to host your site and you can support the bandwidth requirements for your expected traffic volume then it might make sense to host things yourself.

So, what's the big deal?  If you're looking to get started right away you can render an MP4 file, install a free player like [FlowPlayer](http://flowplayer.org/), and start hosting video in 5 minutes.  The problem that you'll notice straight away is that your videos have to buffer completely (ie. the user's browser downloads the whole video) before they start playing.  For short videos or video files that are small this isn't a big deal.  But for HD videos and videos that are long in duration the delay can cause even the most patient viewers navigate away from your site.  Since all of the other services have gotten users accustomed to video playing immediately it's hard to justify this kind of behavior on any site today.

I've figured out the secret sauce to get this working.  Now you can do it too with just these few simple steps:



	
  * Step 1: Render your MP4 files and place them on your server

	
  * Step 2: Create a webpage with [FlowPlayer](http://flowplayer.org/) embedded.  A template to get you started looks like this:

    
    <head>
    <script type="text/javascript" src="http://your-site.com/flowplayer-3.2.4.min.js"></script>
    </head>
    
    <a href="http://your-site.com/your-video.mp4" style="display:block;width:800px;height:475px" id="player"> </a> 
    
    <script>flowplayer("player", "flowplayer-3.2.5.swf",
    
    { clip:
      { url: "http://your-site.com/your-video.mp4",
        duration: 120,
        metadata: false,
        autoPlay: true,
        autoBuffer: true,
        bufferLength: 3,
        linkUrl: "http://your-site.com/your-video-description.html"
      }
    });</script>


Just replace your-site.com/your-video.mp4 with the real URL of your MP4 video and your-site.com/your-video-description.html with the site you want to link the user to if they click on the video while it's playing.  Also, replace "120" after the duration variable with the actual duration of your video in seconds.  If you don't know this value, or you're feeling lazy, you can set it to zero and FlowPlayer will figure it out for you.  Don't set it too short or your video will end prematurely and make sure that flowplayer-3.1.4.min.js is on your server in the appropriate location.  This example assumes it is in the root directory.

	
  * Step 3: Download and install mod_h264 for Apache.  There are instructions for [distros other than Gentoo](http://h264.code-shop.com/trac/wiki/Mod-H264-Streaming-Apache-Version2) or youcan run these commands on Gentoo to do it all:

    
    cd /tmp
    wget http://h264.code-shop.com/download/apache_mod_h264_streaming-2.2.5.tar.gz
    tar xzvf apache_mod_h264_streaming-2.2.5.tar.gz
    rm apache_mod_h264_streaming-2.2.5.tar.gz
    cd mod_h264_streaming-2.2.5
    ./configure
    sudo make install




	
  * Step 4: Add mod_h264 for your Apache configuration.  Append these lines to the bottom of your /etc/apache/httpd.conf:

    
    LoadModule h264_streaming_module /usr/lib/apache2/modules/mod_h264_streaming.so
    AddHandler h264-streaming.extensions .mp4




	
  * Step 5: Restart apache with

    
    /etc/init.d/apache restart




	
  * Step 6: Test out your streaming video.  If all went well then you'll see the bar behind the playhead fill in as the video buffers.


That's all there is to it.  Thanks to the mod_h264 developers (and these instructions) you're now able to stream MP4 video like the big guys.  Here's an example of what it should look like (the source material in this video is from [FreeStockPhotos.com](http://freestockphotos.com/) but the controls in the player cut off their watermark):

[ ](http://blog.timmattison.com/static/howto-test.mp4)
