---
title: "Detect Client-side reconnection with SignalR"
description: ""
date: 2014-06-11T05:00:37+02:00
draft: false
tags: [signalr]
categories: [NET framework]
---
 **Signalr is really good on keeping alive the connection between server and the client** and make sure that the client automatically reconnect if there are connection issue. To verify this you can write a simple test with a simple hub that each second broadcasts to all clients current server timestamp with a simple timer.

{{< highlight csharp "linenos=table,linenostart=1" >}}


 private static Timer testTimer = null;
 static MyHub()
 {
     testTimer = new Timer();
     testTimer.Interval = 1000;
     testTimer.Elapsed += (sender, e) =&gt;
     {
          var context = GlobalHost.ConnectionManager.GetHubContext();
          context.Clients.All.setTime(DateTime.Now.ToString());

{{< / highlight >}}

Now you can simply reference the hub on a page, register for the setTime method and watch the page dynamically update each second.

{{< highlight jscript "linenos=table,linenostart=1" >}}


function SignalrTestViewModel(option) {

    var self = this;
    //signalr configuration
    self.myHub = $.connection.myHub;

    self.serverTime = ko.observable('no date from server');

    self.myHub.client.setTime = function (time) {
        self.serverTime(time);
    };

{{< / highlight >}}

This is a simple KnockoutJs view model, you can now bind a simple span to the property serverTime and watch everything works.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image2.png)

 ***Figure 1***: *Web page automatically updated from the server*

The interesting part is that  **you can now kill the w3wp.exe process from the task manager (if you are using IIS) or whatever hosting server you are using, and you can verify that almost immediately w3wp.exe process is bring to life again and the timer continues to count**. This happens because when the client detect that the server is dead, it tries automatically to reconnect, then IIS creates another worker process and everything starts working again.

The only drawback is that the server had lost every volatile information it has collected during its life. In my situation each clients initialize some javascript code calling certain method on the hub Es. RegisterViewRoom, and I keep such information in static variables inside the hub. This works, except that if the server process goes down for whatever reason (scheduled IIS worker process recycle) these information are lost. I do not want to bother with storing data on the server, my typical situation is no more than 5 clients at a time and I want the simplest thing that could possibly work.

The simplest solution to this problem is  **letting the client javascript code detect when a re-connection occurs** , whenever there is a reconnect, the client can call registration function again. Registration call is idempotent so there is no problem if the reconnection happens because of connectivity problem and not for a restart of the server. To detect in signalr a re-connection you can use this piece of code.

{{< highlight jscript "linenos=table,linenostart=1" >}}


 $.connection.hub.stateChanged(function (change)
    {
        self.signalrState(change.newState);

        if (change.newState === $.signalR.connectionState.reconnecting)
        {
                self.messageHub.server.registerViewRoom(self.conversationId());
        }
  });

{{< / highlight >}}

This simple code is used to detect when the state of the connection changed, I store this information inside a KnockoutJS View Model variable, to be informed of the actual status, then I simply detect if the new state is reconnecting and I simply call initialization function on the server to re-register information for this client connection.

Signalr is really one of the most powerful and interesting Javascript library I worked with in the past years :).

Gian Maria
