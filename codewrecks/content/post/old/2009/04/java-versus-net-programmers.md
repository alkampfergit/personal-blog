---
title: "Java versus Net programmers"
description: ""
date: 2009-04-28T14:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I've come across [this post](http://davybrion.com/blog/2009/04/at-this-point-id-prefer-java-developers-over-net-developers/), that deals about java and.net programmers. I must admit that the situation is the one depicted by the author, probably in the average, java programmers are better accustomed with stuff like DI, IoC, ORM, AOP, and design principle, respect of.net developer; but is it really ok to reduce programming skills only to the knowledge of those concepts?. In the end the main question is â€œWho states what is really important to know for a developer??â€

I remember in the old days when I programmed in C++ or assembly code, (and java was still at the beginning), people saying â€œjava programmers does not know anything about memory management, processors, registers, etc etcâ€, thus stating that C++ programmers are the â€œreal programmersâ€ respect java ones. There will always be a great debate on â€œ*what is important to know for a programmerâ€*and I suspect that we will never reach a point of agreement. I use regularly Castle, AOP, NHibernate I recognize the fact that knowing those concepts is important, I found that I can write better software using these techniques, I love patterns, but I know also that they are not the only way to develop software.

I know good developers that knows nothing about DI, or AOP, but wrote C++ programs  that manage hardware in factories that runs 24/7 without any problem, and they have to manage very complex logic with PLC that have more than a thousand of I/O, where logic changes during time, where hardware change during time, where it is difficult to update software because you need to stop factory for a while, where the customer calls you even at 02:00 in the night, because if the software chrash the factory stops. In a scale from 0 to 10 I score them a 9, because they wrote software that works, and works for year without problem and works in difficult environment.

This is to point out that, IMHO, a programmer can be good even if he does not know nothing about pattern or DI etc and probably the amount of knowledge that makes a programmer â€œgreatâ€ depends on the specific situation.

- If you are developing a driver for a video card probably you should know very well concept as: Interrupts, Kernel of the operating system, Kernel API, assembly of the processor of choice, etc.
- If you are developing a rendering engine for a video game you should have: good C++ and assembly skill, knowledge of physics, fluent with mathematics concept (matrix, quaternions), very good knowledge of computer graphics concepts (Rendering algorithms, Vertex/pixel Shader, geometric transformation) and  surely Directx or OpenGL. If you are developing on a console like playstation2 you should also have a Deep and intimate knowledge of the inner structure of the vertex shader, EE and SE processor.
- If you are developing an operating system you should know: assembly, structure of the hardware, you should known low level communication protocol (DMA), memory management algorithm, security and a lot of other stuff.
- If you are developing software that handles low level hardware such as RFID reader or PIC, you should be familiar with communication via RS232 as well as knowing the hardware that you use, you should know how to structure your application to make it up and running 24/7, you must deal with hardware failure etc.
- If you are developing complex math library you must be familiar with data structure, with profiler and optimizer (speed is really important), you should know how to use specific compiler (like intel one) to make use of every optimization of the architecture to reduce execution time, as well as deep knowledge of mathematic
- If you are developing a simulator for VLSI design probably you need to know a lot of different things.
- If you develop an application on a ORACLE database and you need to manage trillions of records probably you need an intimate knowledge of ORACLE, how to tune up the index, and you must be a SQL-guru.

I can continue for long, but all of these kind of programmers *does not need to know anything about ORM, DI, IOC or AOP*, but are you sure that you can call them bad programmer only because they does not know those concepts?

I think that there is the right tool for each problem and I always worry about the syndrome of â€œ*if all you have is a hammer, everything looks like a nail*â€. There are such a great amount of different techniques in programming science, that we cannot reduce everything to the classic â€œDI IOC AOP ORMâ€.

alk.
