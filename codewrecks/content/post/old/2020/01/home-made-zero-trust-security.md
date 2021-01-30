---
title: "Home Made zero trust security"
description: ""
date: 2020-01-03T16:00:37+02:00
draft: false
tags: [Zero Trust Security]
categories: [security]
---
I have a small office with some computers and servers and since I’m a fan of Zero Trust Security, I have firewall enabled even in local network.  **I’m especially concerned about my primary workstation, a Windows Machine where I have explicitly created firewall rules to block EVERY packet from another machine of the network.** I have backups, I have antivirus, but that machine is important and I do not want it to be compromised, working with a rule that block every contact from external code is nice and make it secure, but sometimes it is inconvenient.

Actually Zero Trust security can be complex, but for small offices it could be implemented with home made tools.  **In my scenario I’m pretty annoyed because there are some situation where I want to access my home network in VPN and then use my workstation in RDP, but since every port is closed, no RDP for me**.

The alternative is to left RDP port opened always for all local machines, or for VPN ip subnet, but it is not a thing that I like. What about someone cracking my VPN? Once he is in VPN he can try to attack my RDP port, something that I want to prevent.

To solve this problem I’ve authored a really stupid program to manage hardening of my machine: [https://github.com/alkampfergit/StupidFirewallManager](https://github.com/alkampfergit/StupidFirewallManager "https://github.com/alkampfergit/StupidFirewallManager") This is a proof of concept, but basically it works with a simple concept:  **if I want to conditionally open TCP port based on a secret, I created a program that is listening on some UDP ports and if it receives a message with a specific secret it will open related TCP port, only for caller IP and only for a certain amount of time.** Here is a configuration:

{{< highlight jscript "linenos=table,linenostart=1" >}}


{
  "Rules" : [
    {
      "Name": "Rdp",
      "UdpPort": 23457,
      "TcpPort": 3389,
      "Secret": "this_is_a_secret"
    }
 ]
}

{{< / highlight >}}

This means that I want a rule called RDP that will listen on UDP port 23457 and when some other computer sends single UDP packet on that port with the expected secret, it will open 3389 TCP port for that IP for a couple of hours.

You can find the code on the above project, but you need to pay attention, because as soon as the program starts, it will add some rules to close all ports.  **Please be sure to use this POC only on computer where you have physical access.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image.png)

 ***Figure 1***: *All ports blocked upon program execution*

In  **Figure 1** you can see that the tool added two rules to deny access to every ports that is not in the controlled range. This basically left only UDP port 23457 opened, and every TCP port except 3389 explicitly closed.

If I try to connect to my machine from another machine in my local network with RDP, I got no response.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-1.png)

 ***Figure 2***: *Cannot access to my workstation with RDP*

 **This happens because the tool explicitly deleted all rules about port 3389 and deny access to every other port.** If I want to connect to that machine I need to fire up client and ask for port to open

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-2.png)

 ***Figure 3***: *Client program used to ask for port opening*

Now if you got correctly both port and secret, a new rule was created.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-3.png)

 ***Figure 4***: *New rule created upon correctly matching port and secret*

The name of the rule is unique (it ends with a GUID) and contains in the name the expiration date in form of yyyyMMddHHmm, a timer in server part of the program check firewall rules each minutes to remove all of the rules that matches this pattern and remove them when they are expired.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-4.png)

 ***Figure 5***: *New rule is created scoped for only the computer that sent correct UDP packet with correct secret.*

If you look at the new rule it has a scope limited to caller computer

> This simple POC allows me to remotely manage my firewall, opening only pre-determined port, for a predetermined amount of time, only for specific ip that knows a specific secret.

This is really only nothing more than a proof of concept, but if you want to apply Zero Trust Security in your environment and you have no commercial or enterprise ready solution, **learning on how to manage local firewalls with your code is a good starting point to strongly limit the surface of attack on your local network.** These kind of techniques strongly limit lateral movement on your network.

Gian Maria.
