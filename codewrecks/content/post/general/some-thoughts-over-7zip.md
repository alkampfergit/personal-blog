---
title: "Fine control of compression level in 7zip"
description: "7zip is a fantastic tool and it has plenty of knobs to turn to obtain maximum compression and maximum efficiency"
date: 2021-08-10T20:00:00+02:00
draft: false
tags: ["DevOps"]
categories: ["Pipeline", "Build"]
---

Even if 7zip is not a real DevOps argument, it is really interesting in the context of a build pipeline and **artifacts publishing**. AzureDevops Pipeilne and GitHub actions have **dedicated actions to upload artifacts to the result of the pipeline/action** but I often do not like this approach. Even if you can download everything as a zip, I like to create different archives before uploading, for at least two reasons

1. I'm able to create different archives based on specific semantics (one archive for web app, one for services, one for angular UI etc)
2. I can use 7zip tool to reduce archive size much more than a single zip.

In a pipeline we have in AzureDevops we have a grand total of roughly 860 MB of dll, **most of them duplicated because are shared reference used by many services**. In that scenario I use a full PowerShell build script that organize all the services in a folder, then compress all 860 MB of data in a 7zip archive that will be uploaded by subsequent actions as artifact in the pipeline result.

> I usually use a really old version of 7za.ext (version 9.20) in my PowerShell script for convenience

I have lots of PowerShell helpers written that automatically download 7za.exe version 9.20 and use it to compress folder, never felt the need to resort to full 7zip.exe even if I know that **probably it will give me better result because it is a more recent version**. In this project I started to have strange behavior, **Azure DevOps pipeline produces a 7zip file of 36 MB (I told you that 7zip is exceptional) but some developer started asking me **what option I've used because they tried locally with latest version of 7zip but they got at least a 76MB archive, not 36MB **.

> When you create lots of pipelines / GitHub actions speed of execution and size of artifacts can make a big difference.

The goal is having not high execution time (not using maximum compression if does not give real advantage) but having small artifacts to minimize upload time or server space if you have TFS on premise. In such scenario **standard zip format does not stand a chance against 7zip, but even 7zip has a lot of options you need to consider to find the sweet spot**.

I started creating a small PowerShell test script that you can find in [this Gist](https://gist.github.com/alkampfergit/0a6b683f3e9bb1b63a43c75c94abe5a8). The script is really stupid, it just try to compress the aforementioned folder using various compression level (1, 3, 5, 7, 9) with different options ti **dumps reduction in size and time needed to archive the folder**.

Here is the result of standard 7zip command line where I changed only the compression level (-mx option)

{{< highlight powershell "linenos=table,linenostart=1" >}}
mx=1-> 3474 ms file size 239133911 global reduction of 27.8% relative increase in compression time 100.0% vs relative reduction 100.0%
mx=3-> 4383 ms file size 228246178 global reduction of 26.6% relative increase in compression time 126.2% vs relative reduction 95.4%
mx=5-> 18973 ms file size 189873288 global reduction of 22.1% relative increase in compression time 546.1% vs relative reduction 79.4%
mx=7-> 37825 ms file size 184362620 global reduction of 21.5% relative increase in compression time 1088.8% vs relative reduction 77.1%
mx=9-> 74693 ms file size 78668370 global reduction of 09.2% relative increase in compression time 2150.1% vs relative reduction 32.9%
{{< / highlight >}}

As you can see level 1 need 3.4 seconds to run and produces an archive that is **27.8% of the original space**, increasing the compression level to 7 needs 38 seconds to run but we have not a great reduction in size (21.5% vs 27.8%). With an increment in running time of 1088% with a small reduction of size of generated archive, it is **clear that in my situation using compression level 1 is far better than level 7**.

The real gain in size happens at compression level 9, where I have an archive that is 9.2% of the original size, but I need 74.5 seconds to run. So I have a 2150% increase in time with a relative reduction of size of 32.9 comparing to level 1.

> If you have reduced upload bandwidth usually having reduced size of artifacts is the top one priority.

But I have a real strange report from developer tesam, if they manually create the archive, they are not able to get an archive that is **less than 78 MB in size**. The only difference is that pipeline script uses the really old 9.20 version (7za), so I executed the very same test with that version.

{{< highlight powershell "linenos=table,linenostart=1" >}}
7za920.exe mx=1-> 28957 ms file size 227614220 global reduction of 26.5% relative increase in compression time 833.5% vs relative reduction 95.2%
7za920.exe mx=3-> 23893 ms file size 138319244 global reduction of 16.1% relative increase in compression time 687.8% vs relative reduction 57.8%
7za920.exe mx=5-> 67414 ms file size 37366034 global reduction of 04.3% relative increase in compression time 1940.5% vs relative reduction 15.6%
7za920.exe mx=7-> 83525 ms file size 36869588 global reduction of 04.3% relative increase in compression time 2404.3% vs relative reduction 15.4%
7za920.exe mx=9-> 83055 ms file size 36468973 global reduction of 04.2% relative increase in compression time 2390.8% vs relative reduction 15.3%
{{< / highlight >}}

> It seems that 7za 9.20, a 10 years old product is far more better than last version of 7zip.

The result is astonishing, **with the older version I have a resulting archive of 37 MB at compression level 5**. This imply that with the 10 years old utility I'm able to get an archive that is less than half the size (37 MB vs 78MB) with less time (67 seconds vs 74 seconds). 

> Since newer tools should be better, we need to investigate the root cause of this behavior.

This explain the different in build upload result, my Azure DevOps pipeline uses the 10 year old 7za at level 5 (default) and it generates an archive **half the size in less time that the new 7za at level 9**.

I've start to investigate, and since the original folder contains lots of identical files (dll and pdb) the problem **could be related to solid archive type**. A friend of mine suggests me to check for change in default option for solid archive block size, but all blocks are greater than my data, so it is not the problem.

Then I started reading t!he help thoroughly and here is what I found:

![Solid option for 7zip change in latest version](../images/solid-options-7zip.png)

***Figure 1:*** *Solid option for 7zip change in latest version*

Now I try to re-run another run of the test script using latest version of 7zip adding the -mqs=on option that allows **to use file extension ordering to solid compression**.

{{< highlight powershell "linenos=table,linenostart=1" >}}
mx=1 -mqs=on-> 3452 ms file size 228971062 global reduction of 26.6% relative increase in compression time 99.4% vs relative reduction 95.8%
mx=3 -mqs=on-> 3094 ms file size 147075071 global reduction of 17.1% relative increase in compression time 89.1% vs relative reduction 61.5%
mx=5 -mqs=on-> 15176 ms file size 42474526 global reduction of 04.9% relative increase in compression time 436.8% vs relative reduction 17.8%
mx=7 -mqs=on-> 27578 ms file size 39095401 global reduction of 04.6% relative increase in compression time 793.8% vs relative reduction 16.3%
mx=9 -mqs=on-> 42668 ms file size 37472502 global reduction of 04.4% relative increase in compression time 1228.2% vs relative reduction 15.7%
{{< / highlight >}}

Results were astonishing, **as for 7za.exe version 9.20, I've start looking to an extreme reduction of size at compression level 5 where I got an archive of 42.5 MB size but in 15 seconds**. Even if the old version still generate a smaller archive (37 MB vs 42.5 MB), time of execution is 15 seconds versus 67 seconds. Raising the compression level to 9 I got almost the same size 37472502 vs 36468973 bytes, but in 42 seconds instead 67.

> After all these test I can confirm that newest version of 7zip gives me the best results, 15 seconds of execution and a zip file that is 4.9% of the original size.

These simple tests confirms me that 7zip is an exceptional product, but that sometimes needs some **fine grained tuning to get the maximum out of it**.

Gian Maria.