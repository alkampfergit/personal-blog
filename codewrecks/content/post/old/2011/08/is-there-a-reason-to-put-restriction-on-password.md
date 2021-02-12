---
title: "Is there a reason to put restriction on password"
description: ""
date: 2011-08-12T06:00:37+02:00
draft: false
tags: [Security]
categories: [Software Architecture]
---
I've stumbled upon [this funny comic](http://xkcd.com/936/)

![](http://imgs.xkcd.com/comics/password_strength.png)

I usually use long Random generated password, that I store in [KeePass](http://keepass.info/) for all services that I really care about, (home banking, amazon account that has my credit card, etc), and tend to use easy to remember password for services I do not care very much (stupid online games, or stuff like that).

This funny comics suggests that choosing some four random common words can be a viable solution (complex to guess, but easy to remember), but sadly enough some online services does not permits you to use long password, or password that use special chars etc. My online banks forced me to choose a 10 digit number as the password o\_O, another online service told me to use a password between 6 and 18 chars, but only letters, numbers are allowed, Another one forced me to use at leas one uppersize, and one digit, but limits the length to 20 chars, etc etc. My question is **why in the hell a service should limit my possibilities to choose a password I like?*.*

![](http://4.bp.blogspot.com/-pO3af7sNOeg/TisuwlulJuI/AAAAAAAAA7c/H5OfgqOCe-k/s1600/anger.gif)

Having such restrictions is quite annoying, because if you have a mental scheme to choose passwords, *password complexity rules* quite often render this scheme not valid, forcing you to use a password that will be hard to remember (thanks to keepass this is much more easier) and not more secure. And what about a Chinese or Japanese user that want to choose a password composed of [Kanji](http://en.wikipedia.org/wiki/Kanji) characters? Maybe he want to use Kanji of Spring, mountain, sky, because it is easy for her to remember a blue mountain sky on spring.

![](http://islamic-creed.com/New%20wallpaper/Blue%20Sky%20With%20Mountain.jpg)

I'm not a cryptography expert, but usually password are stored in [HASHED](http://en.wikipedia.org/wiki/Cryptographic_hash_function) format with a [SALT](http://en.wikipedia.org/wiki/Salt_%28cryptography%29) (beware of Italian Railway system, last year I clicked *lost my password* and they sent me the password in CLEAR format on my e-mail O\_o), this means that the user could choose an arbitrary sequence of [Unicode](http://en.wikipedia.org/wiki/Unicode) chars, because it is simply a stream of bytes that will be hashed producing another stream of bytes of Fixed Length that can be stored in a database without problems, even if the user choose a 100 character password, the hash length is always the same.

Given this, is there really a reason to impose restrictions on password complexity? In my opinion the only restriction should be in the length, prohibiting really short password to avoid really easy-to-guess password, but every Unicode charachter should be acceptable and there should be no maximum password length, no specific char requirements (es. at least one digit, at least one Uppercase char), if I trust my KeePass program to generate a cryptography random sequence of 32 chars, or if I want to use an [Haiku](http://it.wikipedia.org/wiki/Haiku) I like, why you should limit my freedom in choosing my password?

Alk.
