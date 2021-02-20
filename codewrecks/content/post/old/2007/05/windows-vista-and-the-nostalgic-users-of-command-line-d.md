---
title: "Windows vista and the nostalgic users of command line D"
description: ""
date: 2007-05-15T00:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I needed to copy the windows sdk file (1.2 Gigabytes) from the desktop pc to my laptop, via Ethernet 100 mbps. I begin navigating to the network folder and try to right click the file to select copy. The result is that my laptop get hung...after some while I realized that my antivirus is trying to scan the network file to see if the file is virus free...I immediately terminate the antivirus, and change the option not to scan network files. Then I try to copy the file again, this time I was able to right click and copy the file, I went to destination folder and then do right click, then paste...a message box appears and the file starts to transfer......but my pc is still hung, after 2 minutes the progress bar is about at 15%, so I manually disconnected network cable, the operation was aborted and I decided to open a dos prompt box an type

copy “\\athlon\Download old H\developer\WinFx\OfficialRelease\6\*.\*”

after 2 minutes the file was on my laptop, but then I decided to move into another folder of the same partition, again I tried to do this through the windows shell, again a progress bar appears telling me something like “calculating time needed to perform the operation”......WHAT???? I was trying to move a file between folder in the same partition...again I stopped the operation, goes again in dos prompt and typed

move 6.0.6000.0.0.WindowsSDK\_Vista\_rtm.DVD.Rel.img f:\download\WindowsSDK\

The file was moved instantaneously. This poses a question...why these simple operations are really overkill when managed by windows vista shell and are extremely efficient when performed from a dos shell? Whell...I must admit that I’m a nostalgic command shell user J

Alk.
