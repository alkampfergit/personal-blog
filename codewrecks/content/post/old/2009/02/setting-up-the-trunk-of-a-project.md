---
title: "Setting up the trunk of a project"
description: ""
date: 2009-02-16T03:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
In [this very interesting link](http://brendan.enrick.com/blog/organizing-software-projects/) brendan spoke about how to organize the trunk of a project. I think that this is a very important subject, especially for medium sized or big project. If you fail to organize your source code including everything you will end with trouble. In the past it happened to me to work on project where you need to spend a lot of time just to have the first run ok. I need to download and install tools, libraries, then I need to open a solution, compile and move dll into another folder etc etc etc. This situation is a clear indication of a bad organization of the trunk.

A project is not only composed by source code, so you need to include in your repository everything you need to build the project. I include all the installer of third part library, and clear indication on how to get trial license if needed, I also included all binary version of open source libraries (like nhibernate and nunit), I included every document that you need to read to make the software run (EX. manuals of hardware if your software need to communicate with various RFID libraries) but the tougher part is creating a good structure for the project and creating a good build script.

In big project building everything is not so simple, we cannot simply have a solution with 100+ projects, but we usually divide the software into smaller areas, then you need a series of script that build everything from the ground up, moving all the binaries in a well known directory (the artifact or the build one) so you can divide the project into smaller solution that are more manageable.

The goal is having a project where any new developer can start to work with little three steps

1. checkout the solution in a local folder
2. Reads documentation and install any needed third party packages
3. Launch a build script

After step 3 the developer should be able to open any solution in the project and being able to work, this means that the script should create local databases for test sandbox, MSMQ if needed, and any other stuff that is needed in order to have a running solution. This means having a "alive project".

alk.

Tags: [project management](http://technorati.com/tag/project%20management)
