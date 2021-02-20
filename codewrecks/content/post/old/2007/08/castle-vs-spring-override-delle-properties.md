---
title: "Castle Vs Spring Override delle properties"
description: ""
date: 2007-08-02T23:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
One of the capabilities of Windsor that I miss much from Spring is the ability to inject dependencies at runtime, let’s do an example.

publicclassAlertManager  {  
  
privateIMessageSender  mSender;  
  
public  AlertManager(IMessageSender  sender)  {  
        mSender  =  sender;  
  }  
  
publicILogger  Logger  {  
get  {  return  mLogger;  }  
set  {  mLogger  =  value;  }  
  }  
privateILogger  mLogger  =  DevNullLogger.Instance;  
  
publicvoid  Alert(String  message)  {  
        mSender.Send(“Alert  received”,  message);  
if  (mLogger.IsDebugEnabled)    
              mLogger.LogDebug(String.Format(“Alert  send  {0}  message”,  message));  
  }  
}

&lt;component

id=“MessageSenderMail”

service=“IoC.IMessageSender, IoC”

type=“IoC.MailSender, IoC”

lifestyle=“Transient“&gt;

&lt;parameters&gt;

&lt;mailAddress&gt;prova@nablasoft.com&lt;/mailAddress&gt;

&lt;/parameters&gt;

&lt;/component&gt;

&lt;component  
id=“AlertManager“  
service=“IoC.AlertManager,  IoC“  
type=“IoC.AlertManager,  IoC“  
lifestyle=“Transient“  
inspectionBehavior=“all“&gt;  
  &lt;parameters&gt;  
        &lt;sender&gt;${MailSender}&lt;/sender&gt;  
        &lt;Logger&gt;${Log4NetLogger}&lt;/Logger&gt;  
  &lt;/parameters&gt;  
&lt;/component&gt;

I declared that the AlertManager component needs a sender (and optionally a logger) to work properly, and I declared that the sender dependency must be satisfied by a component with id MailSender (not reported here for brevity). During test I often need to override the dependencies written in config file, quite often with live object, for example a mock. It would be nice if I can create a mock of IMessageSender object and then instruct Windsor to inject that object into AlertManager, not the instance of the MailSender component, hey...it’s possible :D. First of all I create this simple wrapper function that calls a particular version of the Resolve(IDictionary) method of the container.

public  static  T  Resolve&lt;T&gt;(paramsobject[]  values)  {  
  System.Collections.Hashtable  arguments  =  new  System.Collections.Hashtable();  
for  (Int32  I  =  0;  I  &lt;  values.Length;  I  +=  2)  {  
        arguments.Add(values[I],  values[I  +  1]);  
  }  
return  ActualContainer.Resolve&lt;T&gt;(arguments);  
}

Now I can override the dependencies specified in the config file, let’s show how you can inject a mock.

IMessageSender  ms  =  mock.CreateMock&lt;IMessageSender&gt;();  
AlertManager  alm  =  IoC.Resolve&lt;AlertManager&gt;(“sender”,  ms);

What I did is simply ask to the container to resolve the dependencies, but everytime a dependency called “sender” is found, Windsor must inject my mock object :D. This function is not only useful for mocking, for example it is possible that 99% of the time I use the AlertManager with the MailSender configured in the web.config, but in a single piece of code I need to dynamically specify the address of the mail sender

AlertManager  alm  =  IoC.Resolve&lt;AlertManager&gt;(“mailAddress”,  “a@a.it”);

As you can see, Windsor can override not only the properties of the object at the first level, but also of the whole chain of object. In this snippet when the container begin to configure the MailSender object does not use the address in config file, because it is overridden by the code.

Alk.
