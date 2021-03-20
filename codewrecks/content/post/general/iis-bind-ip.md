---
title: "Avoid IIS to use all of your IP and other amenities"
description: "In developers machine, sometimes you need to use the same port from many programs and this can be a problem if you are using IIS"
date: 2021-03-15T22:00:00+02:00
draft: false
tags: ["IIS"]
categories: ["Programming"]
---

Let's suppose you have a Microservices based solution, you have many different processes and each process communicates with standard WebAPI. The usual developer solution is **using a different port for each different program**, this lead to http://localhost:12345, http://localhost:12346 and so on. This is far from being optimal, because in production, probably, each service could potentially be exposed with a different hostname, something like https://auth.mysoftware.com, https://orders.mysoftware.com and so on. Another problem is that, in production, everything **must be exposed with https** and too many times developer are not testing with TLS enabled.

> I strongly prefer using a developing environment similar to production one, this is the reason why I always use TLS for services and always with certificates that are valid for the machine.

Using https everywhere in a developer machine is not a problem using some interesting utilities like [mkcert](https://github.com/FiloSottile/mkcert), the usual problem is that **IIS or the first microservice that starts, bind to port 443 so you are forced to use different port for TLS for each service**... Or no?

First of all sometimes I'm amazed on how people forget that you have an entire /8 subnet for loopback: 127.0.0.0/8, this **allows me to put different host alias inside my hosts file**. This allows me to configure different hosts name on different loopback IP addresses, like depicted in the following picture.

![Configuration of my hosts file](../images/loopback-alias-hosts-file.png)
*** Figure 1:*** *Configuration of my hosts file*

Thanks to this configuration I can now start a simple .NET core program and **bind it to 127.0.0.2 in port 443 to have a regular HTTPS connection then start another program, bind to 127.0.0.3 or other address**. The net effect is that I have multiple different executables that listens on port 443, in different loopback adapters, mimicking the real production configuration.

This is not strictly necessary but it is much more better than having https://localhost:xxxx https://localhost:yyyy (using https on different port without a good alias). This is also **FAR better than not using TLS in local machine having everything running in HTTP**. I'm a support of having developer machine working with a configuration that is similar to production machines.

To test opening port 443 on two different loopback adapter you can use this PowerShell code.

{{< highlight powershell "linenos=table,linenostart=1" >}}
#Create a couple of endpoint and corresponding listener
$EndPoint1=[System.Net.IPEndPoint]::new([System.Net.IPAddress]::Parse("127.0.0.10"), 443)
$Listener1=[System.Net.Sockets.TcpListener]::new($EndPoint1)

$EndPoint2=[System.Net.IPEndPoint]::new([System.Net.IPAddress]::Parse("127.0.0.20"), 443)
$Listener2=[System.Net.Sockets.TcpListener]::new($EndPoint2)

# Listen on both of them then close
$Listener1.Start()
$Listener2.Start()

netstat -ano | sls 443
Write-Host "Socket listening: Press RETURN to continue..."
Read-Host

$Listener1.Stop()
$Listener2.Stop()
{{< / highlight >}}

The above script verifies that we are indeed able to open port 443 in different IP addresses at the same time.

Everything goes well until you need to also host a site in IIS with HTTPS, because **as soon as you create an HTTPS binding in IIS it starts listening on port 443 for EVERY IP of the machine, even if you limit the IP address in configuration of the site**. This will prevent any other program to use port 443 in any IP of the machine, actually the entire 127.0.0.0/8 is prevented to use port 443. Thanks IIS. If you bind to ANY loopback ip in port 443 with IIS turned off, when it starts it fails to do the biding even if configured on different address, because **it listens on all IP addresses by default**.

If you launch the aforementioned PowerShell script after IIS has an HTTPS binding in any address, ex: 127.0.0.2, the script throws error because the combination IP/PORT **was already used by some other process**. If you want to have a final configuration you can verify with netstat command.

{{< highlight cmd "linenos=table,linenostart=1" >}}
❯ netstat -ano | sls 443

  TCP    0.0.0.0:443            0.0.0.0:0              LISTENING       4
  ...
  TCP    [::]:443               [::]:0                 LISTENING       4
{{< / highlight >}}

The above output confirms me that ports 443 was already bound for all IPv4 and IPv6 addresses by process ID 4 (system/IIS), leading to the obvious conclusion: **IIS is binding port 443 to every IP address in the system even if I specify the binding to happen only for specific IP**.

The solution to this problem is limiting the binding of IIS only to some IP addresses with netsh command.

{{< highlight cmd "linenos=table,linenostart=1" >}}
netsh http add iplisten 127.0.0.2:443
{{< / highlight >}}

As usual **netsh is a really useful command** and the [add iplisten command](https://docs.microsoft.com/en-us/windows-server/networking/technologies/netsh/netsh-http#add-iplisten) allows you to add one ip to the list of ip that could be used by the HTTP service. 

After an IIS restart, if I run first PowerShell script I can verify that I'm indeed **able to open port 443 on two different loopback IPs and that IIS is actually using only 127.0.0.2 (and localhost 127.0.0.1 that I've also added with netsh command)

![IPs used by IIS are now limited only to those one permitted](../images/port-limiting-iis.png)
*** Figure 1:*** *IPs used by IIS are now limited only to those one permitted*

As you can see from **Figure 2** two IP addresses (127.0.0.1 and 127.0.0.2) only are used by IIS (PID 4) leaving **other IP addresses (127.0.0.10 and 127.0.0.20) free to be used by other processes**.

This kind of configuration helps developers to be more familiar with networking, managing a rudimentary CA certificate (mkcert) and also being able to have a configuration more similar to production servers. Also **all developers use by default HTTPS binding even during development**, minimizing the risk that something does not work if not in HTTP (like hardcoding http and not https in some url :( ).

Gian Maria.