---
title: "There are some thing a developer is not required to knowreally"
description: ""
date: 2008-08-05T03:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
This morning I was reading [this post](http://blogs.microsoft.co.il/blogs/dotmad/archive/2008/07/29/there-are-some-things-a-good-developer-is-not-required-to-know.aspx), the author links Jeff Atwood blog and the post speaks about that some thing that are important to know to be a good developer, one of the controversial part is

> *Know how long it takes your computer to execute an instruction, fetch a word from memory (with and without a cache miss), read consecutive words from disk, and seek to a new location on disk*

I learned these stuff long time ago, since I studied Electronics, so I work with FPGA, build digital processor in VHDL, and I really like those low level stuff. The problem is that in 2008, the industries, requires other skills, that are more important respect the low level stuff. If I look in the past, this kind of knowledge did not help me in real programs committed me by some stakeholder, they helped me a lot when I had fun programming PS2, but this is another story.

Surely low level knowledge is not * **required** *to be a good developer, but it can help. With C#, Visual Basic, and generally in.NEt world, developers usually works at higher level, and they does not worry about “reading consecutive words from disk” or how long does it takes to “fetch a word from memory”, but a general understanding of these concepts really * **helps to be a better developer** *. Knowing that working on the same set of variable could improve performance because good locality avoids to gets words from main memory because they are in cache *could help*. If you completely ignore these concepts you can be seriously hurt by poor performance only because “Hey, there is the garbage collector that does everything”.

Surely that are other stuffs that really helps a lot more:knowing OO principles, pattern, algorithm, SQL etc. It worth nothing to know the cost of a cache miss if you really does not know the concepts of Indexes in a Database…. But in the end, my opinion is that every notion can be useful, even low level stuff, because as [Peter Norvig Says](http://www.norvig.com/21-days.html)

> *Remember that there is a “computer” in “computer science”*

We can speak about pattern, ORM, or some strange and esoteric stuff, but in the end, all goes to be a bunch of electrons that pass through the gate of a MOSFET, and some magnetized piece of metal where we store informations ;)

Alk.

Tags: [Programming](http://technorati.com/tag/Programming)

<!--dotnetkickit-->
