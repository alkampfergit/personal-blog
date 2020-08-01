---
title: "Set ip of WSL2 machine in host file"
description: "Windows Subsystem for Linux is great, but the dynamic ip can be sometimes be annoying. Let's see how to fix this problem"
date: 2020-08-01T08:00:00+02:00
draft: false
tags: ["PowerShell"]
categories: ["general"]
---

I have a WSL2 ubuntu installation where I have SAMBA installed and I really need it to answer to a specific name, something like \\ubuntuwsl.

> In WSL2 the machine got its IP assigned from Hyper-V so it is dynamic and change at each reboot

To solve this problem it is interesting to look on **how you can interact to your WSL2 distribution from PowerShell**, this exercise will show you how powerful WSL2 is. First of all you can execute shell command directly from PowerShell. As an example this is how I can start SAMBA daemon directly from PowersShell

{{< highlight powershell "linenos=table,linenostart=1" >}}
wsl -d ubuntu -- /etc/init.d/smbd start
{{< / highlight >}}

This is really simple, just use the wsl command, then specify the distribution and **you can simply specify command you want to run after two dashes.** This become really powerful if you need to launch a command in the machine and you want to parse the content in PowerShell from host machine.

This is how I can find the actual IP of my WSL distribution

{{< highlight powershell "linenos=table,linenostart=1" >}}
$wslIpAddr = wsl -d ubuntu -- ip addr
$match = [System.Text.RegularExpressions.Regex]::Match($wslIpAddr, "(?<ip>172\.[\d\.]*)\/")
$ip = $match.Groups["ip"]
Write-Host "Ip of wsl ubuntu machine is $ip"
{{< / highlight >}}

Now armed with the real ip of WSL machine I need to change the c:\windows\system32\drivers\etc\host file to update the ip of the ubuntuwsl entry. This is where the script becomes tricky, because **wsl runs as your actual user, and if you, like me, use a non admin user, you need to launch the above code without elevated permission, then you need to launch another script with the administrator user to be able to change hostfile**.

If you run the entire script with the administrator user, you are not able to interact with the WSL instances, because they are bound to your actual user. This happens only if you are using a user that is not administrator of the machine, but this should be the default right? :)

Luckily enough there is little work to do, just create another script that modify the host file and **from the previous script run this other script changing the user.**. I've previously grab the current directory of execution in $runningDirectory so I can simply Start-Process another powershell session with -Verb RunAs, as in the following example.

{{< highlight powershell "linenos=table,linenostart=1" >}}
Start-Process -FilePath Powershell -Verb RunAs  -ArgumentList '-File', "$runningDirectory\ChangeHostFile.ps1", '-ip', $ip
{{< / highlight >}}

This will simply prompt the user for credentials, just type the credentials of the administrator user and everything is ok.

Thanks to wsl command it is really easy **to interact with your WSL instance from host Windows instance** and this is another reason why a WSL2 instance is much more easy and powerful to use than a real Linux machine running in a virtualization system.

You can [Find the scripts here](https://github.com/AlkampferOpenSource/powershell-random/tree/master/Wsl2/Ip)

Gian Maria.