---
title: "Is it possible to run Coded Ui Test in a Virtual Machine instead that in my primary machine"
description: ""
date: 2013-06-10T06:00:37+02:00
draft: false
tags: [CUIT,Testing]
categories: [Visual Studio]
---
Code UI Test are an effective way to test your UI through automation, they absolutely are not a substitution for Unit Testing, but they can be used effectively to verify the whole application behave as expected. The most annoying part of Coded UI Test is that  **while they are running you cannot do anything else on the computer, because mouse and UI are used to run the test**. This lead to a very common question

> <font><em>Is it possible to run Coded Ui Test in a Virtual Machine instead that in my primary machine?</em></font>

The answer is yes, and it is a really simple task to accomplish. First of all  **install a Test controller on a machine in your network** (or a virtual machine if you want to run test inside a local VM) and configure it.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image.png)

 ***Figure 1***: *Configure user used to run the service and nothing more* ** ** You need only to specify the account used, and  **you should not register it to a Team Project Collection** , just leave any other option blank. Then you need to  **install Test Agent on the same machine or to another one** , and configure that test agent to connect to the previous installed test controller.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image1.png)

 ***Figure 2***: *Configure the agent to log on automatically and connect to the test controller*

Now you should see that the Agent component connects to the controller and the Test Agent Status is online

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image2.png)

 ***Figure 3***: *The test agent is online and connected to the controller.*

It is time to go back to Visual Studio, right-click on the solution name and add new item, from the list of templates choose Test Settings

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image3.png)

 ***Figure 4***: *Add a test settings to the solution*

Even if in VS 2012 test settings are not used by default as in VS2010 they are still there. In VS 2012 you do not usually need a Test Settings file, unless you want to run tests with some non standard configuration, as in this example. Once you have added a Test Settings file you can edit it and  **choose to execute test remotely specifying the name of the machine that has the Test Controller installed**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image4.png)

 ***Figure 5***: *Choose to run test with Remote Execution*

Now you should simply save the file, and choose as the active test settings browsing for the file

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image5.png)

 ***Figure 6***: *Activate test settings*

Now if you run again the Coded UI Test **it will be run in the machine with the test agent**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/06/image6.png)

 ***Figure 7***: *The VM with test agent runs tests for me*

Thanks to this configuration you can execute any Unit Test in a remote machine, not only CUIT.

Gian Maria.
