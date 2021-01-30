---
title: "Coded Ui Test in VS 2010"
description: ""
date: 2009-10-30T11:00:37+02:00
draft: false
tags: [Testing,Visual Studio]
categories: [Visual Studio]
---
I must admit that Iâ€™m absolutely not a fan of testing through UI. A good program keeps the business logic separated from the UI, so it is testable without passing for the UI. In the real world we have application written by others, or you can simply have to test UI control interaction. In these scenario interacting with the UI can be a viable option. Letâ€™s see how VS2010 can helps us.

You have a new type of unit test, called Coded UI test, when you create test the test will ask you how you will write the test

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image31.png)

Simply choose to record action, a recording toolbar will shows up

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image32.png)

Now simply press record, then press â€œStart without Debuggingâ€ on my project. My program opens (a simple form to divide two integers), and I begin interact with the form. Here is the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image33.png)

As you can see the recorded intercept the launch of my application, and the interaction with the form. When you finished recording, you can simply press the â€œGenerate Code buttonâ€ and have a new test generated.

Now I suggest you to rename the test (VS calls it CodedUITestMethod1), and when you run it, you can look at the program open again and all of your actions replayed :).

Alk.

Tags: [Visual Studio](http://technorati.com/tag/Visual%20Studio)
