---
title: "Signalr Error the connection id is the incorrect format"
description: ""
date: 2013-08-27T19:00:37+02:00
draft: false
tags: [signalr]
categories: [ASPNET]
---
I’m working with Signalr in a real project and I found a problem with authentication. This is the Repro Steps for the bug:

*1) the user open a browser tab to a public page that uses SignalR  
2) he opens another tab in the browser and navigate to a private page that requires authentication  
3) he logins into the system and Signalr in the first tab stops working.*

The page stops to receive server calls and if I call some Hub function from javascript I got no javascript error in Developer Console, but done function is never called. To troubleshoot connection error you should handle  **$.connection.hub.error** function that gets called whenever a communication error happens. Now I was able to find that the error is a status 500 with a page that tells * **“the connection id is the incorrect format”** *

The reason is described in [this StackOverflow post](http://stackoverflow.com/questions/15501493/signalr-the-connection-id-is-in-the-incorrect-format-when-using-windows-and-an), basically the solution consist on a simple *stop/restart* of the connection, but in my scenario, when the code calls a function from javascript, nor the done() or fail() method gets called, so I have no way to react. Luckily enough, I’ve structured my code to *centralize all function calls in an api.js file*. Es.

{{< highlight jscript "linenos=table,linenostart=1" >}}


self.api.Myfunction(self.parama(), self.paramb())
   .done(function (data) {
        //success...

{{< / highlight >}}

 **The caller simply calls functions on an api object that returns a promise** , caller can use done() and fail() to take appropriate decision based on the result of the call and caller code completely ignore how the call is done to the server. As an example this is how Myfunction is defined in the api.js file:

{{< highlight jscript "linenos=table,linenostart=1" >}}


self.Myfunction = function (parama, paramb)
 {
    return self.callMessageHub(function () {
        var retvalue = self.messageHub.server.myfunction(parama, paramb);
        return retvalue;
    });

{{< / highlight >}}

Actually it simply delegates to a callMessageHub internal function that is used to wrap all calls to the Signalr Hub, here is the full definition of the function.

{{< highlight jscript "linenos=table,linenostart=1" >}}


self.callMessageHub = function (functionToCall) {
    lastFunctionToCall = functionToCall;
    var def = $.Deferred();
    lastDeferred = def;
    functionToCall()
       .done(function (data) {
            def.resolve(data);
        })
       .fail(function (error) {
            self.globalError('', '', error);
            def.reject();
        })
       .always(function () {
            lastFunctionToCall = undefined;
            lastDeferred = undefined;
        });

{{< / highlight >}}

* **This code assumes that Hub functions are not called concurrently** *, and this is not a problem in my scenario. First of all this method stores the actual function call in a global object called lastFunctionToCall, then it declare a deferred with *$.Deferred()*call and store it inside a global variable called lastDeferred; finally the code calls the original function. The key factor is: if the user opened another tabs and login to the system, the call to the Hub will fails and nor the.done() nor the.fail() function will be called,  **but we can handle with $.connection.hub.error** {{< highlight jscript "linenos=table,linenostart=1" >}}


$.connection.hub.error(function (error) {
    self.globalError('', '', error);
    if (error.status === 500) {
        $.connection.hub.stop();
        $.connection.hub.start()
           .done(function ()
            {
                if (lastFunctionToCall !== undefined) {
                    lastFunctionToCall()
                   .done(function (data) {
                        lastDeferred.resolve(data);
                    })
                   .fail(function (error) {
                        self.globalError('', '', error);
                        lastDeferred.reject();
                    });
                }
            });
    }
});

{{< / highlight >}}

This code simply check for an hub error of type 500 and try to stop and restart again the hub. Once the hub connection is started again, if we have a lastFunctionToCall different from undefined, it means that we have done a call to the server after the authentication is changed and the call failed, but  **since I’ve stored a reference both to the original function to call and to the deferred returned to the caller, O can do another call to the function and signal to the original deferred object.** The net effect is that the caller should not worry about disconnection from the hub due to change to the login status, because the Api.js file takes care of error handling and automatic retry of the function call. Everything is transparent to the caller.

Actually this code uses a couple of global javascript variables, to make everything more robust, we should use a variable on the Api object and add support for concurrent calls.

Gian Maria.
