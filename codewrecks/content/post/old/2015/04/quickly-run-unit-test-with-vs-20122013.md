---
title: "Quickly run Unit Test With VS 20122013"
description: ""
date: 2015-04-24T07:00:37+02:00
draft: false
tags: [Testing,Visual Studio]
categories: [Testing]
---
With VS 2012 and newer versions  **we can run Unit Tests from various frameworks directly from Visual Studio IDE** , thanks to the concept of Test Adapters. When you are doing Test Driven Development you usually go with Red/Green/Refactor workflow; what you need is a way to quickly run all or part of your unit tests after you modified the code. The quickest solution is using the option to Run Tests After Build but it is available only for Premium and Ultimate edition, but  **you can also run test with little manual intervention resorting to Keyboard Shortcut**.

Simply go to TOOLS-&gt;Customize menu, then choose to customize keyboard.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image4.png)

 ***Figure 1***: *Keyboard customization in Visual Studio*

Once configuration window is opened, search for TestExplorer.RunAllTests command, place cursor in the “Press shortcut keys:” textbox and press a shortcut, then press “assign” button to assign to this command. In  **my standard configuration I like to have CTRL+SHIFT+ALT+A shortcut, because it is not assigned to any other command and it is easy to press with left hand**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image5.png)

 ***Figure 2***: *Assign CTRL+SHIFT+ALT+A to TestExplorer.RunAllTests command*

Now I can write code, use shortcut and VS will build solution and run test for me automatically, without leaving my hands from the keyboard. Thanks to the various test adapter and the various grouping and filtering possibility offered by Test Explorer, you can do TDD in Visual Studio without the need of third party tools.

Gian Maria.
