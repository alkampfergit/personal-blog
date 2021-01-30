---
title: "Logging in Custom Build action for Tfs Build 2010"
description: ""
date: 2010-01-14T17:00:37+02:00
draft: false
tags: [TfsBuild]
categories: [Team Foundation Server]
---
In a [previous post](http://www.codewrecks.com/blog/index.php/2009/12/07/custom-activities-in-tfs2010/) I dealt with the creation of a Custom Activity to use in TFS2010 builds, in that example I did not dealt about logging. Logging is a vital task to do in custom action, because it is quite difficult to attach a debugger to the Build Agent, and if a build fails, it is really important to be able to understand what is gone wrong.

If you want to log from a custom action you can use this simple function

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 private void LogMessage(String message, CodeActivityContext context)
        {
           BuildInformationRecord<BuildMessage> record =
             new BuildInformationRecord<BuildMessage>()
             {
                 Value = new BuildMessage()
                    {
                        Importance = BuildMessageImportance.High,
                        Message = message,
                    },
             };

            context.Track(record);
        }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to this function I can use with my custom activity, here is how I use it in my XmlPoke activity, used to change content of an xml file.

{{< highlight csharp "linenos=table,linenostart=1" >}}
LogMessage("XPoke on the file " + filePath, context);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to this message I can find information on the build log.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/01/image10.png)

This is really useful because I can, in this example, verify witch file was changed by my action simply looking at the build log.

alk.

Tags: [TfsBuild ContinuosIntegration](http://technorati.com/tag/TfsBuild%20ContinuosIntegration)
