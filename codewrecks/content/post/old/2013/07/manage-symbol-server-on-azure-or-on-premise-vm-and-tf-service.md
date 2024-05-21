---
title: "Manage Symbol server on Azure or on-premise VM and TF Service"
description: ""
date: 2013-07-04T05:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
One of the coolest capabilities of  **Team Foundation Server Build is the ability to automatically manage a** [**symbol server**.](http://www.edsquared.com/2011/02/12/Source+Server+And+Symbol+Server+Support+In+TFS+2010.aspx) Suppose this scenario: you have a library and you want to distribute to all people in your organization, with the ability to being able to debug code in the dll and to identify the code that build each version of this dll. If you have TF Service you can use a VM in azure, but the overall process is really similar if you want to have a build on-premise.

- Enable the File and storage service Server Role (to enable sharing)
- Enable the Web server role
- Install Team Foundation Server express Update 3

Once everything is in place you can simply  **create a local folder and share in read / write** , my machine is called TfsSymbolServer so the folder will be \\tfssymbolserver\symbols

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image3.png)

 ***Figure 1***: *Share a folder in Read / write mode*

Now you should simply [configure Team Foundation Server express build server](http://www.codewrecks.com/blog/index.php/2012/04/02/installing-on-premise-component-against-tfs-service-tfs-on-azure/) to connect to your TF Service account. The express version is free and you can install on your VM with few clicks. The necessary steps are identical if you are installing the Build Server on-premise.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image4.png)

 ***Figure 2***: *Build controller and agent correctly configured for my TF Service account*

Now you should  **create a TFS Build to release your library and automatically publish symbols on previous network share**. In the Build Defaults choose your new Build Controller you’ve installed in the VM and ask to copy the Build Output to the server

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image5.png)

 ***Figure 3***: *Configure the build defaults*

In the Build Process you can now simply choose the item you want to publish (with all desired configurations), and  **choose to index sources, specifying the network share you created in the Virtual Machine**. That network share is not visible outside that VM, but since the build controller and the share are on the same machine, you will have no problem during the build. Even if the machine is on azure and it is not connected to any VPN, the build will succeed because the publish symbol share is local.

*If everything is on-premise, you can clearly use any network share that is visible from the machine with the Build Agents*.

Another interesting aspect of the build, is the use of a  **different build process template used to version assembly and taken from the** [**TFS Versioning library on codeplex**](http://tfsversioning.codeplex.com/). That build process is used to give to the assemblies a unique FileAssemblyVersion, where you usually specify Major and Minor, and the template will add the date as julian and the incremental number of the build. You have plenty of documentation if you download from the project site [[http://tfsversioning.codeplex.com/](http://tfsversioning.codeplex.com/)]

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image6.png)

 ***Figure 4***: *Build process, index the source and use TfsVersioning to version assemblies*

Now that everything is in place you can fire a build an verify in the Virtual Machine that the Symbols directory have symbols file in it.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image7.png)

 ***Figure 5***: *Symbols files are correctly published in the local share*

 **If the VM with the Build Agent is on-premise, you have nothing to do** , because people will have access to the same network share used by the build Agent, but if the VM is on Azure, people are not able to see network share.

To share symbols with the team, the simplest solution is creating a site in IIS that points to symbols directory ** ** and enable the directory browsing. An alternative approach is creating a Vpn from the Azure VM and your local directory, but  **IIS is simpler to setup and to manage and it is my preferred solution**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image8.png)

 ***Figure 6***: *Symbol server is now publishing the symbol directory to the web with IIS*

I’ve chosen port 27000 to bind the site,  **so I needed to both open the local firewall in Windows Server and adding an endpoint in the Virtual Machine Endpoints from the Azure Web Portal**. You should now verify that you are able to connect to that site from your local machines of your organization

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image9.png)

 ***Figure 7***: *Symbol server is now exposed in Http*

Now you can simply configure Visual Studio to access that symbol server and to enable symbol server support during debugging.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image10.png)

 ***Figure 8***: *Your symbol server is now configured in Visual Studio*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image11.png)

 ***Figure 9***: *General configuration for the Debugging in Visual Studio to enable source server support*

Now you can simply tell to all members of your teams, interested in using this library, that it is published through standard TFS Builds. You can give to people the address of the Drop Location (it is a zip stored in Azure Blob) for stable builds and this is everything you need to do to distribute your Dll.  **You can put in place more complex scenario, Es distributing with Nuget or in Source Control,** but the important aspect is that the dll has a specific number that identifies it, and it has symbol server support.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image12.png)

 ***Figure 10***: *People can download the library as a zip directly from the build.*

The technique used to distribute the Dll is not important, what is important is that, * **once you create a project and reference that dll, you are able to drill down with F11 in the methods of the dll, and Visual Studio will connect to the Symbol Server, check the version of the file, and will download the correct version directly from TFS** *.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image13.png)

 ***Figure 11***: *When you press F11 Visual Studio correctly download the correct version from TFS*

If you look at the complete file location of  **Figure 11** , you can notice the number 1046 preceding file name. If you wonder what it means, it is the changeset id of the version of the file that was included in the dll you are using.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image14.png)

 ***Figure 12***: *MyLogLibrary.cs latest modification was done in Changeset 1046*

This means that Visual Studio not only downloads automatically the file from TFS to enable debugging the library, but  **it always grab the exact version used to compile the dll**.

Thanks to TFS Versioning tool you are also able to tell the exact version of the dll you are using, and you can find the build used to create that dll.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image15.png)

 ***Figure 13***: *File Version Number helps you identify date and build number used to produce the dll*

Symbol server is not useful only to distribute library; you should always use, especially to create binaries that will get distributed and installed, because thanks of the source server support you will be able to debug them or to effectively use Intellitrace in production.

Remember also  **not to delete builds associated to published dll, or to choose not to delete information from Symbol Server**.

If you are not using Symbol Server to distribute your software you are losing a big piece of TFS.

Gian Maria.
