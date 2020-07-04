---
title: "How to handle certificate error in dotnet WebClient object"
description: "Too often you find some terrible solution that solve a problem but generate a security hole, pay attention to every decision taken in realm of security."
date: 2022-03-18T08:14:37+02:00
draft: false
tags: ["security"]
categories: ["security"]
---

## The situation

This is a simple scenario: I use a WebClient object in .NET to perform some web request to a target web site, everything went good except when the code runs in Xamarin Android, **where it throws an exception in https connection**. This is usually a puzzling moment, because I'm simply doing an HTTP GET request of a page, everything works outside Xamarin where all I got in response is an error telling me that the certificate is not ok. 

If I browse the page with standard browser like Firefox or Chrome everything is ok, both of them returns me all green with the certificate. **The very same code runs perfectly in dotnet core on Windows and Linux, but not on an Android device in Xamarin**. When such a situation happens, you start googling around to find a possible cause, but clearly, I was very puzzled because everything seems to be correct.

I didn't find many specific information, but with horror I saw that in various sites the most common solution is **overriding the ServerCertificateValidationCallback of WebClient always returning true**. To be honest, such a solution can be given only by a fool, because it disable every check of TLS, thus leaving the communication unsecure and prone to any kind of attack.

## The root cause

Since the error happens only with the specific site I'm working with and not with other sites, there should be something different about TLS in that specific sites, something that is **not request to validate a certificate but that make something bad happen in Xamarin.** Since my WebClient (Android Xamarin) complained about something not good with the certificate **the first thing to do is checking everything about the certificate that can point me to some situation that is not fully OK**. To do a thorough test you can use this library [https://github.com/drwetter/testssl.sh](https://github.com/drwetter/testssl.sh) that can scan a site and give you detailed info about **how good the TLS implementation on target domain**. The site has rate T, really really low.

![Rate of the site is really low](../images/cert-sh-rate-T.png)
***Figure 1:*** *Rate of the site is really low*

In reality a rate of T is really too low, the problem here is that the site **does not returns all certificate chain up to the Certificate Root**. This is not really a problem, a browser and the full implementation of WebClient is able to retrieve the chain and verify the certificate, implementation in Xamarin forms is not able to retrieve the intermediate certificates, thus generating error.

Running the test again with Qualys gives a probably more accurate result of B, and **confirm what my ssl scan told me, the certificate chain is incomplete**.

![Qualys show the Extra download section](../images/qualys.png)
***Figure 2:*** *Qualys show the Extra download section*

That validates my supposition, even Qualys is telling me (**Figure 2**) that the server did not return intermediate certificate and the scanner had to do an extra download. This is not a huge problem per-se, browser and other tools are able to download intermediate certificates **but nevertheless it is not a well configured TLS**.

Knowing the problem we can have a better solution, until the owner of the domain will not fix the incomplete chain, I can put some code that ignore incomplete chain https errors **for that site only**, hoping that the problem will be fixed as soon as possible.

{{< highlight csharp "linenos=table" >}}
private bool ValidateCertificate(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
{
    if (sslPolicyErrors == SslPolicyErrors.None) 
    {
        return true;
    }

    //check if the site belongs to the list of the site that we allow to have incomplete chain, if current site is not 
    //on the list return false.
    ... 

    //Now tolerate only incomplete chain for allowed site.
    if (sslPolicyErrors == SslPolicyErrors.RemoteCertificateChainErrors)
    {
        if (chain.ChainStatus.All(chainError => chainError.Status == X509ChainStatusFlags.PartialChain))
        {
            //tolerate partial chain
            return true;
        }
    }
    return false;
}
{{< / highlight >}}

This is not a code that I really like, but for now **is the only way I can call that site from Xamarin Android**, but the general rule here is **never ever write code to ignore any TLS errors for any site, if you need to do an exception, always restrict the exception to a specific whitelist of sites and allows only the minimum set of error**.

> Removing validation of all certificates is like removing risk of the forest catching fire cutting all the trees. NEVER EVER remove validation of certificates, if you are forced to ignore some error, ignore **only the specific error and for that specifing site only or you will find yourself in trouble**

In this situation the certificate is valid, but Xamarin implementation of WebClient is not able to retrieve intermediate certificate, so I can reluctantly wrote the above code, but I will never completely bypass TLS validation for every site, because it will lead to troubles.

Gian Maria.
