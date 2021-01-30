---
title: "Unable to open word or excel document from sky Drive"
description: ""
date: 2011-04-06T06:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I want to share a problem that happened ro me after I changed my passport password. When I login to skyDrive with IE and try to open a document in Word or excel, the program (Word or Excel) opens, but it is completely hung, trying to open the document.

I left splash screen of word opened for more than 20 minutes, but nothing happens so I press ESC and close Word. When I try to login to skydrive again in Internet Explorer, it asks me a captcha code because a lot of failing login attempt were done to my passport account. This is a clear symptom that word still used old password to login in to the site. I googled around but the only solution was to remove all login from credential manager, a solution that did not work for me. Iâ€™ve tried to reboot, clear ANY PASSWORD from credential manager, clean the cache of IE, run CCleaner, but still the problem is there.

I created a new user on my system, login with that user, and everything was perfect, and this is a clear indication that the old password is still cached in my user profile, but I did not find any way to tell word to clear all cached credentials or something like this.

*I tried a lot of stuff, but the only thing that worked for me is*

- Clearing all password from credential manager.
- Unlink and relink again my passport from credential manager.

Then open word, create a new document, then go to File-&gt; Save and send â€“&gt; save to web menu

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image.png)

You should not see your sky drive folders, but only a button to login to sky drive, I pressed it, waited for a couple of minutes and now word asked me again for credential because it was not able to login. I insert the right login information with the new password and now I could again open word documents from skydrive.

I know that this procedure seems empirical and strange, but after some days of tentative, this is the only way I found to be able to use skydrive again from Word.

alk.
