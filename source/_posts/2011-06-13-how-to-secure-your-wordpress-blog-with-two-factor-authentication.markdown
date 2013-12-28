---
author: admin
comments: true
date: 2011-06-13 14:06:25+00:00
layout: post
slug: how-to-secure-your-wordpress-blog-with-two-factor-authentication
title: 'How-To: Secure your WordPress blog with two-factor authentication'
wordpress_id: 398
categories:
- How-To
tags:
- security
- sysadmin
- two-factor authentication
- Wordpress
- Yubikey
---

Don't care about the narrative?  Jump to the [instructions](http://blog.timmattison.com/archives/2011/06/13/how-to-secure-your-wordpress-blog-with-two-factor-authentication/#instructions).

These days password security is paramount.  In recent news we have seen several high-profile breaches against [Sony](http://www.telegraph.co.uk/technology/news/8553979/Sony-hack-private-details-of-million-people-posted-online.html), [RSA](http://www.rsa.com/node.aspx?id=3891), and [Epic](http://www.theregister.co.uk/2011/06/13/games_firm_epic_breach/) where passwords were lost, mission-critical keys were pilfered, and user details were leaked, respectively.

Security professionals understand that multi-factor authentication is important.  Multi-factor authentication means that you access resources using something you know (ie. a password) and something you have (ie. a token that generates a unique code each time it is used).  This way someone would need to know your username, password, and have your token to gain access to whatever you are protecting.  Without any one of those things they will be denied access.  With a secure token even if they capture the data as it goes across the wire the token can only be used once.  If they attempt to reuse it they will be denied access yet again.

Previously RSA was the place to go for this kind of security and it was too expensive for individuals to use.  But now a company called [Yubico](http://yubico.com/) offers affordable tokens that can be used for a multitude of applications ([online services](http://wiki.yubico.com/wiki/index.php/Main_Page/New_Videos/YubiCloud), [enterprise security solutions](http://wiki.yubico.com/wiki/index.php/Main_Page/New_Videos/Enterprisesecuritysolutions), [enterprise services](http://wiki.yubico.com/wiki/index.php/Main_Page/New_Videos/Otherenterprisesolutions), and [open-source applications](http://wiki.yubico.com/wiki/index.php/Main_Page/New_Videos/Opensource)).  If you have custom needs they also have a [world-wide list of system integrators](http://wiki.yubico.com/wiki/index.php/Main_Page/New_Videos/Systemintegrators) that can help you through it.

With the Yubikey Wordpress plugin you can now add this security to your Wordpress blog and make sure that your password and account information can't be nabbed by someone looking over your shoulder at a coffee shop.  Installing the plugin isn't hard but there are some things that are easy to miss.  To help you out I've laid out all the steps from start to finish including testing and verification.  Here goes...


**NOTE:** You will not be able to complete beyond step 2 until you receive your Yubikey(s) in the mail.

There are a lot of steps here but it is broken down into very small chunks.  Installation should take less than 5 minutes from start to finish.



	
  * Step 1: Obtain a Yubikey ([YubiKey in Black](https://store.yubico.com/store/catalog/product_info.php?ref=232&products_id=2&affiliate_banner_id=1), [YubiKey in White](https://store.yubico.com/store/catalog/product_info.php?ref=232&products_id=3&affiliate_banner_id=1))

	
  * Step 2: [Get an API key](https://upgrade.yubico.com/getapikey/).  Your API key is a client ID (a number) and a secret key (a long string).  Copy these to a safe place and make sure you copy the entire secret key.  It ends with an equals sign "=" and won't work without it!

	
  * Step 3: Download the [Wordpress plugin for Yubikey authentication](http://downloads.wordpress.org/plugin/yubikey-plugin.0.94.zip) to your computer

	
  * Step 4: Sign into your Wordpress blog as an administrator.  If you are the only user on your blog then you are the administrator.

	
  * Step 5: Click on the "Plugins" link on the left side of the screen

	
  * Step 6: Click "Add New" either on the top or the left side of the screen.  They both go to the same place.

	
  * Step 7: Click the "Upload" link on the top of the screen directly below "Install Plugins"

	
  * Step 8: Click "Browse" and find the ZIP file you downloaded in step 3.  Then click "Install Now".

	
  * Step 9: Click "Activate".

	
  * Step 10: Click "Settings" on the left side of the screen.

	
  * Step 11: Click "Yubikey" on the left side of the screen below "Settings".  If there is no "Yubikey" link then click "Plugins" and make sure the Yubikey plugin is in the list and activated.  If it has a link that says "Activate" click it and go back to step 10.

	
  * Step 12: Enter your client ID in the "Yubico API ID" field and your secret key in the "Yubico API key" field.  Make sure the equals sign "=" isn't missing from the end of the secret key.

	
  * Step 13: Click "Users" on the left side of the screen.

	
  * Step 14: Find and click on the username of the account that you want to enable the Yubikey on.  If you are the only user then this may be "admin".

	
  * Step 15: Locate the "Yubikey Settings" section and change the option from "Disabled" to "Use Yubico server".

	
  * Step 16: Click on the text box next to "Key ID 1".

	
  * Step 17: Insert your Yubikey.

	
  * Step 18: Press the button on your Yubikey for two seconds and the form will fill in.

	
  * Step 19: Scroll down to the bottom of the page and click "Update profile".

	
  * Step 20: Log out and try to log in with your Yubikey!


When you get to your login screen you will now see a new field labeled "Yubikey OTP".  When you log in now you'll enter your username and password as you used to but then you'll click in the Yubikey OTP box, plug your Yubikey in, and press the button.  That will complete your login process.

One thing you MUST do before you consider this task done is test to make sure the Yubikey authentication isn't disabled.  A lot of people miss this and don't realize that their token isn't actually enabled.  To test this try logging in to your site but instead of using the Yubikey in the Yubikey OTP field just type some random characters.  If it still lets you log in you need to go back and do step 15 and then step 19 again.  Test it again and make sure it works.  If it is set up properly it will tell you your password is incorrect when you type random characters in the OTP field.

Good luck and post any questions in the comments.
