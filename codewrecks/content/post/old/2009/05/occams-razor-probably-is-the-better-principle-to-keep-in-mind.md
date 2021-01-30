﻿---
title: "Occamrsquos Razor probably is the better principle to keep in mind"
description: ""
date: 2009-05-23T02:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
This morning I completely wasted 2 hours of my life, here is the history.

Iâ€™m rewriting some nant script for a series of articles in italian language, this morning I did some modification to the base script, and I applied this new base script to a solution with 6 projects.

Everything went fine, except for the Test project, that does not compile because it does not see internals members of a project. I immediately did a verification, if I convert from internal to public, methods from base project, everything compiled.

I immediately think â€œO my God, I made some mistake in the script, and it does not see my InternalsVisibleTo attribute in the library during compilationâ€. I begin investigating, I search with google if someone previously had problem with &lt;csc&gt; task and internalsVisibleTo, I verify if csc compiler has some option to use internalsVisibleTo, but I did not find anything. I fired reflector to inspect assembly generated by the script, to verify that it has the internalsVisibleTo attribute, and again it was everything is ok.

So I decided to go deep, enable Verbose=â€falseâ€ of &lt;csc&gt; nant task, and I look at the option file generated.

If you does not know the csc.exe compiler, I tell you that it can accepts parameters stored in file. You can simply fire csc.exe @filename and it is the same of including all lines of filename in the command line. This approach is really useful to make command line clearer. Nant uses this approach, so I verified in documentation that if you enable verbose=â€trueâ€ nant tells you the name of the temporary filename used to store all csc.exe options, i renamed it into  **nant.opt**. So i looked at the option file and I begin comparing it with the csc.exe commandline issued by visual studio. I raise verbosity level of building in Visual studio, takes the csc.exe generated commandline, put it in a option file  **vs.opt** and started to make tests.

I immediately verified that csc.exe @nant.opt failed but csc.exe @vs.opt compiled well. I started to copy one option from the VS option file to nant option file, and fire csc.exe at each change, but nothing worked, Iâ€™ve completely changed all the options except one, the /out that specifies output assembly file name, vs.opt had

> /out:obj/debug/DotNetMarche.TestHelpers.dll

the nant.opt had

> "/out:C:\Develop\dotnetmarcheproject\trunk\Artifacts\Builds\net-3.5\DotNetMarche.TestHelper.dll"

This is the last option line that was different, I left for last because I could not think that location of generated file could be important. But when I copy this line from the vs file to the nant oneâ€¦ oh my Godâ€¦ it compiled.

I began to thing "mmm maybe in the obj/debug there are other files that are needed to correctly use the internalsvisibleto, and bla bla bla, looked in internet, read a lot of documentation on csc.exe compiler.Etc Etc ETc.

After a couple of hours I really felt lost, except the first 30 minutes I used to change script, the next 90 minutes were completely wasted, the script still does not work and I really cannot find the reason why it compiled if I generate the file in another directory.

This happened because I completely forgetted the [Occamâ€™s Razor](http://en.wikipedia.org/wiki/Occam%27s_razor) principle. If I followed this principle, immediately after the first failing build I should started to think â€œWhy the assembly A does not see internals classes of assembly B even if I inserted InternalsVisibleTo?â€. The most obvious situation is â€œthe script forget to include the source file with the attribute, so I could check with reflector (30 seconds of time)â€. Then another obvious reason could be a mistyping of the name of the assembly in the InternalsVisibleTo attribute, but since it compiled in visual studio it is not the real reason. Then the third obvious reason is that assembly A was not signed, again 30 seconds check with reflector. Now instead of being investigating csc.exe options as I did, I should think again at the Occamâ€™s razor, and the fourth obvious reason is that I mistyped the assembly name in the build file. If you look at the previous two lines you can find that in visual studio the assembly name is DotNetMarche.TestHelper **<font color="#ff0000" size="5">s</font>**.dll and the one generated by the nant missed the S. I simply mistyped the project name in the default.build for that projectâ€¦..an hour an half lost to find this simple error.

I strongly suggest to everyone, to always follow the Occamâ€™s Razor principle, if something does not work, probably the cause is really simple, start to make simple hypothesis, moving gradually to most complicated ones.

alk.

Tags: [Experiences](http://technorati.com/tag/Experiences)