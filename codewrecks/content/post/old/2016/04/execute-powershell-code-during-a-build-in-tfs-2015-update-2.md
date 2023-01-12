---
title: "Execute powershell code during a build in TFS 2015 Update 2"
description: ""
date: 2016-04-16T08:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
In TFS 2015 build system, running a PowerShell script stored in source code is simple because there is a dedicated action to accomplish this task, but  **if you want to run a PowerShell script that is not in source control, you have no option out of the Box**.

 **Thanks to Update 2, you have now the ability to use the extensions you can find on Visual Studio Marketplace directly in your on-premise TFS installation**. In the Upper Right corner of Web Ui you can find an icon that link to

[![This image shows the link in TFS UI to open the control panel to manage extension.](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-7.png "Link to manage extensions")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-7.png)

 ***Figure 1***: *Link to manage extensions*

This opens an administration page that allows you to manage extensions of your TFS installation. The first time you open this page, you will see no extension installed, so it is time to browse [Visual Studio MarketPlace](https://marketplace.visualstudio.com/VSTS) to find an extension. Actually I want to run inline PowerShell and I can immediately find that there is [an extension that can solve my need](https://marketplace.visualstudio.com/items?itemName=petergroenewegen.PeterGroenewegen-Xpirit-Vsts-Build-InlinePowershell).

As you can see from  **Figure 2** , this extension have a couple of button, the first one, Install, is used to install this extension on one of your VSTS account, but  **if the extension is compatible with on-premise TFS you have also the option to Download the extension**.

[![This image shows that extensions can be downloaded to local pc to be installed to TFS](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-8.png "Download extension")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-8.png)

 ***Figure 2***: *Once you find an extension compatible with on-premise TFS you can download it.*

The extension is a simple.vsix file, and from extension administration page you can upload to your TFS.

[![This image shows how you can upload downloaded extension to your TFS instance.](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image10_thumb.png "Upload extension to TFS")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image10.png)

 ***Figure 3***: *Once downloaded you can upload the extension to your TFS.*

The process of uploading is really simple:

[![This image shows how you can choose the file to upload](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image13_thumb.png "Browse for downloaded extension")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image13.png)

 ***Figure 4***: *Browse for downloaded extension*

[![Tfs shows info for file to upload](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image16_thumb.png "Upload file")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image16.png)

 ***Figure 5***: *Upload UI shows all the detail of the file*

Now you can press Upload button, and the extension is uploaded to TFS and ready to be activated.

[![TFS shows the list of uploaded and installed extensions](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image19_thumb.png "Uploaded extension list")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image19.png)

 ***Figure 6***: *Uploaded extension is now listed in the list of available extension*

[![For each extension TFS ask you to install in specific project collection](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image22_thumb.png "Install extension")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image22.png)

1.  ***Figure 7***: *Install the extension on one or more collection*

> ![External Image](https://ssl.gstatic.com/ui/v1/icons/mail/images/cleardot.gif)The concept behind “install then activate” is that, once uploaded the extension is available for the TFS Server instance, but then you should install in each Project Collection where you want to use that extension.

[![TFS asks you to choose the collection where you want to use the extension.](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image25_thumb.png "Choose collection")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image25.png)

 ***Figure 8***: *Choose the collection you want to install the extension into*

[![Once you choose the Project Collection you need to confirm the operation](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image28_thumb.png "confirm installing")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image28.png)

 ***Figure 9***: *Confirm the selection*

Once the Extension is installed in one Project Collection it can be used. In this example the extension contains a new build Task that allows you to execute an arbitrary PowerShell script during the build. To verify that everything is ok you can create a build and verify that the new Task is available and ready to use.

[![the extension is used in a build, where I was able to add the new task that executes arbitrary powershell code](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image31_thumb.png "extension in action")](https://www.codewrecks.com/blog/wp-content/uploads/2016/04/image31.png)

 ***Figure 10***: *The extension is ready and can be used*

> Thanks to TFS 2015 Update 2 you can Download and install extension for VSTS Marketplace to your on-premise TFS installation with few clicks.

Gian Maria.
