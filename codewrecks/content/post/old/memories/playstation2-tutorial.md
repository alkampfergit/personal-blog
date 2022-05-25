---
title: "Tutorial: Programming Playstation 2"
description: "As you get old sometimes you found old memories in your hard disk and backup. This is a tutorial on Playstation 2 programming I did more than 20 years ago"
date: 2022-05-25T05:00:00+00:00
draft: false
tags: ["Programming"]
categories: ["Programming"]
---

Looking in old backup and old disk can be a dive in the past, you found old stuff like articles tutorial and yesterday I stumbled on my old tutorial on Playstation 2. There were a time when I was really interested in Computer Graphics, and I had a Playstation 2 Linux kit that a dear friend of mine gave me. The kit was really interesting **because it allows you to play with a nice and pretty architecture for the time**. The kit was somewhat limited but thanks to the community you have some kernel libraries that allows you to have a direct access to DMA and to all units in the PS2.

You can download the file from our old nablasoft site [here](https://nablasoftsite.z6.web.core.windows.net/Files/Tutorial04.zip). I've spent some minutes re-reading what I wrote and looking at the code. It is the sign of the time that passed, because it seems to read code written from another person :). Too much time I do not program in C++ but so much time that I do not exercise MIPS assembly. I'm still able to read x86 assembly, but I've really forgot MIPS :D.

The architecture was pretty exciting at the time, the CPU was called "emotion engine" and it contains some nice feature, and VLIW cores, that give birth to some weird assembly, where each line contains two instruction, one for each unit.

{{< highlight assembly "linenos=table,linenostart=1" >}}
.vu
	;first of all store value 0 into VI10 internal register, this
	;makes VI01 point to the first memory location
	NOP[D]			IADDIU VI01, VI00, 0
	;Load Transformation matrix
	NOP			LQI    	VF01, (VI01++)
	NOP			LQI    	VF02, (VI01++)
	NOP			LQI    	VF03, (VI01++)
	NOP			LQI    	VF04, (VI01++)
	
	;Then load last 32 bits of the GIFTag and calculate num of vertex.
	NOP			ILWR.x 	VI02, (VI01)x
	NOP			IADDIU 	VI03, VI00, 0x7fff	;set mask
	NOP			IAND   	VI02, VI03, VI02	;VI02 contains NLOOP
{{< /highlight >}}

In retrospective, all the time I've spent on PS2 programming did not give me any practical return except the satisfaction and fun of **exploring new horizons**. I've also written a three part article on PS2 on an italian Magazine (I should have printed copy somewhere). 

I've found during the time the same attitude in many of my programming buddies, so I'm convinced that many people that works in the IT industry, have a real **passion for technology**. I've friend that moved during the year to managerial position, where they now have a distance from tech, I understand that decision, because I'm also a real fan of Project Management and agile, but at the core **I'm still the person that like to get his hands dirty playing with code and technology**.

Gian Maria.

