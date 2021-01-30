---
title: "Changing application configuration file from a deployed click once application"
description: ""
date: 2010-06-28T14:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I have a simple scenario, I have an application deployed internally with click once, and some of the internal versions are made avaliable externally. The problem is that I need to change the application configuration file before deploying them to production server. To accomplish this you can simply locate the file applicationname.exe.config.deploy in the deploy directory of clickonce, but if you change it you will got an error during installation similar to this one

*Application manifest has either a different computed hash than the one specified or no hash specified at all*

Probably the exact error is different, but the general problem is that the manifest of your application contains hashes of all the file, and when you change a file you need to update all the mamifests. To accomplish this you need to enter to the directory with the version you want to change (Es. \Application files\applicationname\_1\_2\_0\_0) and issue from a visual studio command prompt the following command

*mage â€“u applicationname.application*

then go to the root of the deployed application and issue the command

*mage -u applicationname.application -Version x.x.x.x -AppManifest "Application Files\applicationname\_x\_x\_x\_X\applicationname.exe.manifest" -Processor msil*

this will recompute your hashes and now you should be able to install application again.

alk.
