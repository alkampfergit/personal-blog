---
title: "Vulnhub Tr0ll3 walktrough"
description: ""
date: 2019-10-17T15:00:37+02:00
draft: false
tags: [Hacking]
categories: [Hacking]
---
I’ve some time to spend to have fun trying to hack [the third machine of Tr0ll](https://www.vulnhub.com/entry/tr0ll-3,340/) series, this time when I issue an nmap I’m disappointed, because I have only ssh port opened.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-8.png)

After some tentative with hydra and some set of passwords I felt really stupid, because the instruction on machine told exactly to start:here, so the user is start and the password is here. (next time better reading instructions)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-31.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-31.png)

After login I have a copule of directories, redpill contains a file with a link to a troll site :), in the very style of Tr0ll series.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-9.png)

The other directory is called redpill and contains a file with password for user Step2, but after some faulty attempts, I decided that this is another troll, it is not the right password for user step2, so I need to find another way.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-10.png)

Ok, so I got to the root folder and list all the files that are on the machine, I found something interesting.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-11.png)

A directory called.hints, with tons of other directories inside ![Smile](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/wlEmoticon-smile.png):) typical of troll machine. The author really wants my Tab button to stop working ![Open-mouthed smile](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/wlEmoticon-openmouthedsmile.png):D.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-12.png)

File gold\_star.txt seems to contains lots of strings, they are no hash, they are no typical encoded strings, it could be that they are password??? Trying hydra to verify if the file contains the password for the start2 user I got immediately a dead end, the gold\_star.txt file is 37 Mb, it contains TONS of strings and I cannot use to brute force the SSH.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-13.png)

The only option left here is, since I’m logged with a low privilege user, trying to escalate privilege. If you start looking in the internet, searching for script that allows you to elevate privilege you find tons of material. One of the first is I stumbled into is [this one](https://www.hackingarticles.in/linux-privilege-escalation-via-automated-script/) that, as many other sites, suggests me a script called  **lineum.sh** that should helps me to inspect the system to find useful information. I downloaded it, used scp to transfer to tr0ll machine, give execution right and launched it. Since it does lots of output in the console and I need to search and examine the output, I can simply redirect the output

./lineum.sh –t &gt; lineum.txt

Resulting text file has colors (if you launch without redirect you got colored output) since coloring helps visualizing things, I used aha program to convert aansi text colored file to html.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-14.png)

And voilà, I have some nice and formatted output that I can read and search in browser easily on my kali machine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-15.png)

This script find lots of information and it is quite long to read. After some time spent examining the file I want to understand if running this script could have me helped to find the gold file (instead of manual enumeration), and whoa, I found another interesting file, a wireshark capture file.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-16.png)

Ok, definitely this is Tr0ll VM style, I was pretty sure that the capture contains some interesting data, but when I opened it, there is nothing useful, everything is wireless encrypted traffic plus some standard handshaking (everything was listed as 802.11 protocol).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-17.png)

After monkeying with the file,  I did not find anything useful, so I decided to return to the lineum output to investigate it with more care. A thing that ringed a bell in my mind is looking at the list of last users that logged in into the system.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-18.png)

Wireshark file is named after one of the user, this could not be a coincidence, that file was probably connected to the user, but how? The only two files that I have in my mind is the cap file and the other file that seems to contains random strings, the only thing that comes in my mind is that one of the string can indeed be the key of wireless encryption. Aircrack-ng confirmed my opinions.[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-19.png)

Thanks to wireshark for having an option to include all key for wifi IEEE 802.11 traffic, simply inserting the key allows you to decrypt the file.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-20.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-20.png)

But nothing interesting is there, some UDP traffic, nothing that seems really useful, following the UDP stream gives me some strings like KANNOU%N Archer C50 etc.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-21.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-21.png)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-22.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-22.png)

It seems that the udp traffic does not reveal anything interesting (just blabberish from TcpLink router). After some time of puzzling my head I re-considered the fact that pcap file has the very same name of one of the user of the system (enumerated by linenum.sh). I tried to connect with SSH and this confirmed that WPA network key is the same password used by wytshadow.

Sadly enough in user folder there is no useful information, except an executable that print continuously the very same string: iM [Cr@zY](mailto:Cr@zY) L1k3 AAA LYNX.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-23.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-23.png)

It does not accepts inputs, so I have little use for it, but the string remembered me a reaaaaalllyyy old time in university, when we browsed the internet with LYNX. Lync is a [text based web browser](https://en.wikipedia.org/wiki/Lynx_%28web_browser%29), used to browse from console, it was very useful when we connected in SSH to university machine and we were able to browse with LYNC using much faster university band.

At that point a bells ringed in my head: all previous tr0ll machines hide something in web servers, maybe with some of the users I have I can start apache2 or nginx, two of the most common web server in linux. It was true, this last user can start service nginx. Nmap from kali machine now reveals a new opened port: 8080, but when I browse I got a Forbidden error.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-24.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-24.png)

Ok, it is using some form of authentication that I need to bypass. In windows system, as an example, with IIS you can use windows authentication, where the user running the browser is the same authenticated by by web server. I must admit that I’m not so skilled in nginx, so I started poking around on all configuration files in /etc/nginx just to find the authorization method used. After some time I found a file called default (it is indeed configuration file for default site) that contains configuration for the site.[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-25.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-25.png)

You should not be a nginx expert to understand the above configuration, this is the site listening in port 8080, and if the user agent is different from Lynx, it will return 403. OOOHHHH now I understand the output of the oohfun file. Probably if I’ve used LYNX from the local machine I would have been authenticated.

To proceed in the spirit of hacking a web site just to fire burp suite, place an interceptor to change your user agent, and you are ready to go.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-26.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-26.png)

Burp suite comes with some preconfigured intercept and modify options for user agent, just grab one and change it to some string that starts with “Lynx”, like I did in the previous picture. This allowed me to enter the site, now I have a password for another user

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-27.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-27.png)

This seems a never ending story, I login in ssh with this new user, but this time the situation was better, in home dir of genphlux user there is a file called maleus, with a nice RSA private key, 99% it is the key that allows me to connect as user maleus. After all this machine seems structured around getting one login after another, until I’ll have root login.

I download with scp the key on my kali machine and opened another terminal to connect with this other user. In this way I have multiple terminals, each one connected with a different user, just to have everything under control.

Home folder for maleus contains a dont\_even\_bother file, it is a 64 bit executable that asks for a password. Using strings on it, to dump all strings contained in the file, indeed seems to dump the password, it seems to easy

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-28.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-28.png)

OK, I was trolled again

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-29.png)

Now that I’m logged with user maleus, the first thing I did was examining all the files contained in home directory, nothing interesting except for a file called.viminfo. I really admit that I do not know what a.viminfo file does, but it contains a section named Input Line History that seems to contain the last command line of the user, and it seems to contain a password. Since this is in the home page of maleus user, probably this is the password of maleus.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-30.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-30.png)

I tried ssh again with user maleus with this password and indeed it is the right one. Now I wonder why the author gives me the password for current user, I already have a valid SSH key to log in as maleus user, having the password seems to be not so useful… but no! Having user password allows me to use sudo command.

After lots of not-so-useful tentatives I was puzzled, it seems that the user maleus is in the sudoers list, but it is heavily restricted in what he can do. I’ve tried lots of stuff, but it seems that nothing worked. Searching in the internet I discovered that I can [issue a sudo –l command](https://bencane.com/2011/08/17/sudo-list-available-commands/) to know which command I can use with sudo and current user.

BINGO.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-32.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-32.png)

as maleus user I can run the dont\_even\_bother program as root. That file indeed does nothing, it is only trolling me but I can change with something more useful. Creating an executable that opens a shell is basic hacking 101, the very first thing you learn for exploiting buffer overflow: a single line of command in C and you can launch a bash.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-33.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-33.png)

You do not need to be a C expert, you can find the above code everywhere in the internet, it is just a simple C file with a single instruction system(“/bin/bash”) that allows you to open a shell. Since user maleus is allowed to run that specific executable as root with sudo, you need only to use gcc compiler to compile with the right name, and the game is done. Just sudo dont\_even\_bother and you are root

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-34.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-34.png)

This was a fun journey too, but I found this machine slightly simpler than previous one, because in previous one you need to exploit a buffer overflow. It is indeed a very, easy, simple, 101 level buffer overflow, but it is in my opinion more advanced knowledge than simply traversing the file system to find for information.

Thanks again to the author for spending time to create these machines.

Gian Maria.
