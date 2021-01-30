---
title: "A custom publishsubscriber appender for log4net"
description: ""
date: 2008-11-05T02:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Logging is one of the most important part of an application, the ability to detect cause of failures or malfunctions from the log is invaluable, but generating good logs is not easy.

The fundamental step to obtain a good logging infrastructure, is to use one of the libraries available in the open source world, and probably you will end using [log4net](http://logging.apache.org/log4net/index.html)  because it is really good. One of the most important characteristic of a good infrastructure for logging is the ability to change the destination of logs without recompiling, and the possibility to extend the basic logging facility with custom destination storage.

One of the most useful appender is the AdoNet one, that permits you to store logs into database, then you can query them with the full power of SQL, even from a remote machine. This is really good but sometime testers call me telling â€œhey, when I do this and that the page raise an errorâ€ so I need to connect to log database, then look into the log trying to see whatâ€™s happenedâ€¦  this is good but not enough, I need a live logger, a way to attach to a remote process and look at the logs in realtime, in this way I can tell to the tester, please do again all the action that lead to the bug, while Iâ€™m watching at all the logging that are generated. log4Net has some network appender, the UDPAppender but I need to connect to a internet machine, and I want the log to travel in the network only when there is attached client.

With this need in mind I proceed to create a Wcf [appender](http://logging.apache.org/log4net/release/sdk/log4net.Appender.html) for log4net using a publish subscribe technique, here is the two contract interfaces.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
[ServiceContract(SessionMode = SessionMode.Required, CallbackContract = typeof(IL4NClient))]
public interface IL4NServer
{
    [OperationContract]
    Boolean Register();
}

[ServiceContract]
public interface IL4NClient
{
    [OperationContract(IsOneWay = true)]
    void ReceiveLog(LogMessage log);

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

For those not familiar with wcf the CallbackContract is a technique for the server to obtain a callback to sent  **one way messages** to clients. Here it is a simple server that uses these two interfaces

{{< highlight xml "linenos=table,linenostart=1" >}}
public class AppenderService : IL4NServer
{
    #region IL4NServer Members

    private static List<IL4NClient> clients = new List<IL4NClient>();
    bool IL4NServer.Register()
    {
        lock (clients)
            clients.Add(OperationContext.Current.GetCallbackChannel<IL4NClient>());
        return true;
    }

    #endregion

    /// <summary>
    /// Called by the appender, it append a log.
    /// </summary>
    /// <param name="loggingEvent"></param>
    public static void Append(LoggingEvent loggingEvent)
    {
        LogMessage message = new LogMessage() {Message = loggingEvent.MessageObject.ToString()};
        lock (clients)
        {
            for (Int32 I = clients.Count - 1; I >= 0; --I)
            {
                try
                {
                    clients[I].ReceiveLog(message);
                }
                catch (Exception)
                {
                    clients.RemoveAt(I);
                }
            }
        }
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

thanks to the  **OperationContext.Current.GetCallbackChannel** , the server is able to obtain an instance to a proxy that can be used to communicate back to the client through the IL2NClient interface. For each client that calls Register(), the server add the client callback to a inner static list. The Append() static method can be called from everywhere to send a log to all registered clients. As you can see, the code cycle trough all registered clients, and for each clients that generates exception that client is removed from the list.

Now I can create a very simple appender for Log4Net

{{< highlight chsarp "linenos=table,linenostart=1" >}}
    public class WCFAppender : AppenderSkeleton
    {
        private ServiceHost host;

        public WCFAppender()
        {
            try
            {
                host = new ServiceHost(typeof(AppenderService));
                host.Open();
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        protected override void Append(LoggingEvent loggingEvent) 
        {
            AppenderService.Append(loggingEvent);
        }

        override protected bool RequiresLayout
        {
            get { return true; }
        }

        protected override void OnClose()
        {
            host.Close();
            base.OnClose();
        }

        #endregion Override implementation of AppenderSkeleton

    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This appender is really simple, it host a communication foundation server for the AppenderService in his constructor and in Append() method it simply called static Append() method of the AppenderService.

With this simple class I can now configure an application to use this custom appender, and then you can connect to it and intercept all the log from another application, creating a live logging listener. Here is a screenshot of a running demo

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image.png)

As you can see I create a simple windows form with a button to generate warn, then I can open a simple console application that connects and listen to all generated logs. You can attach how many listener program as you want.

A complete example can be found here [http://nablasoft.googlecode.com/svn/trunk/Log4NetLive](http://nablasoft.googlecode.com/svn/trunk/Log4NetLive "http://nablasoft.googlecode.com/svn/trunk/Log4NetLive").

alk.

Tags: [log4Net](http://technorati.com/tag/log4Net) [Appenders:Logging](http://technorati.com/tag/Appenders:Logging)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/05/a-custom-publishsubscriber-appender-for-log4net/';</script><script type="text/javascript">var dzone_title = 'A custom publish/subscriber appender for log4net';</script><script type="text/javascript">var dzone_blurb = 'A custom publish/subscriber appender for log4net';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/05/a-custom-publishsubscriber-appender-for-log4net/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/05/a-custom-publishsubscriber-appender-for-log4net/)
