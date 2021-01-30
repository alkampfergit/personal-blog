---
title: "Avoid logging sensitive information with ELMAH"
description: ""
date: 2013-10-07T15:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
[ELMAH](http://www.nuget.org/packages/elmah/) is probably de-facto the most commonly used solution to create an automatic logging infrastructure in your ASP.NET application. One of the problem you can encounter using it, is that this component logs a lot of information, and particularly all POST variables of the request.  **If some error occours in login or registration page, you will end with user password written in clear text inside the elmah Database**.

To avoid this problem you need to use a feature of ELMAH called Filtering, that permits you to intercept error logging, here is an example.

{{< highlight csharp "linenos=table,linenostart=1" >}}


void ErrorLog_Filtering(object sender, ExceptionFilterEventArgs args)
{
    Filter(args);
}

void ErrorMail_Filtering(object sender, ExceptionFilterEventArgs args)
{
    Filter(args);
}

void Filter(ExceptionFilterEventArgs args)
{
    if (args.Context != null)
    {
        HttpContext context = (HttpContext)args.Context;
        if (context.Request != null && context.Request.Form.AllKeys.Count() > 0)
        {
            foreach (var key in context.Request.Form.AllKeys)
            {
                if (context.Request.Form.AllKeys.Any
                    (
                        k => sensitiveKeys.Any(sk => k.IndexOf(sk, StringComparison.OrdinalIgnoreCase) >= 0)
                    ))
                {
                    //I've got sentitive information
                    ElmahSensitiveHandle(args, context);
                }
            }
        }
    }
}

{{< / highlight >}}

Actually the first two events intercepts both error log and error mail and delegates handling to the single Filter function. As you can see Filter function only checks if some key in Form parameters are sensitive. This is determined by a series of string value, saved in sensitiveKeys list, that represents all the string that I want to avoid being logged in clear text. Es:

{{< highlight csharp "linenos=table,linenostart=1" >}}


private List<String> sensitiveKeys = new List<string>() { "password", "pwd" };

{{< / highlight >}}

The routine does absolutely nothing if there are no sensitve keys, but  **when a sensitive key is found, it calls the ElmahSensitiveHandle function**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


private void ElmahSensitiveHandle(ExceptionFilterEventArgs args, HttpContext context)
{
    var newError = new Elmah.Error(args.Exception, (HttpContext)args.Context);
    foreach
            (var key in context.Request.Form.OfType<String>().Where
                (
                    k => sensitiveKeys.Any(sk => k.IndexOf(sk, StringComparison.OrdinalIgnoreCase) >= 0)
                )
            )
    {
        newError.Form.Set(key, "***************** **");
    }

    Elmah.ErrorLog.GetDefault(HttpContext.Current).Log(newError);
    args.Dismiss();
}

{{< / highlight >}}

Last line tells ELMAH not to log the error, and this actually prevents the logging. But if you still want to log the error and only remove the sensitive part,** you can simply create another elmah error object with Error static method of Elmah object**. After the error object is created, a simple foreach permits me to identify all sensitive keys and replace in the error object with a series of asterisks.

Finally using the Elmah.ErrorLog.GetDefault(HttpContext.Current).Log(newError) you can make elmah log this new error object, that has no more any sensitive information in clear text.

Gian Maria.
