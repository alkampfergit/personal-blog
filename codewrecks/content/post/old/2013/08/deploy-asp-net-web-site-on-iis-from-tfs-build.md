---
title: "Deploy AspNET web site on IIS from TFS Build"
description: ""
date: 2013-08-01T05:00:37+02:00
draft: false
tags: [Continuous Deployment,Symbols,TfsBuild]
categories: [Team Foundation Server]
---
In the last article of the series, I dealt with [Deploying on Azure Web Sites from on-premise TFS](http://www.codewrecks.com/blog/index.php/2013/07/05/deploying-on-azure-web-sites-from-on-premise-tfs/), but the very same technique can be used to **automatically deploy from a standard TFS Build to a standard Web Site hosted in IIS and not in Azure**. For this demo I’ve prepared a VM on azure, but the configuration is the very same if the VM is on-premise or if you use a physical machine to run IIS. The only difference between deploy on Azure Web Site is that we are deploying on a Web site hosted on IIS.

 **Step 1: Configure IIS for Web Deploy** You can find a [detailed article here](http://www.iis.net/learn/install/installing-publishing-technologies/installing-and-configuring-web-deploy) with all the steps needed to configure Web Deploy Publishing, once Microsoft Web Deploy is installed, just create a site, and enable Web Publishing right-clicking on it. If the Deploy menu does not appears, some part of the Web Deploy Publishing service was not installed properly.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image.png)

 ***Figure 1***: *Configure Web Deploy Publishing*

Configuring a Web Deploy publishing for a web site is just a matter of specifying some information and most of the time everything can be left as default value.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image1.png)

 ***Figure 2***: *Deploy configuration*

This dialog will setup the site to enable MSBuild publishing, it saves a.publishSettings file on the location specified (in this example the desktop). The most important settings is the url for the publishing server connection. *Be sure that used port (8172 in this example) is opened in the firewall and that all router are configured to make it available to the machine where the build will be run*.

 **Step 2: Configure the Publish settings file** Even if the configuration dialog shown in  **Figure 2** creates a publishSettings file, it is possible to create such file directly from Visual Studio. This is usually a  **preferable option because it is possible to customize to support Database Publishing and changing the connection string**. Actually creating a publish settings from scratch from Visual Studio is really easy, you just Right Click the web project and choose publish, then choose to create a new publishing profile.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image2.png)

 ***Figure 3***: *Configure the connection for publishing*

The Validate connection button is really useful to verify if everything works correctly, once it is green it is possible to further customize the settings. A most common configuration, when you work with Database Projects, is the ability to  **configure automatic database schema publishing**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image3.png)

 ***Figure 4***: *Configure for automatic Database Update and change the connection string used in destination server*

Once everything is correctly configured you can close the configuration dialog, save the publish settings and check-in everything in source control. To verify if everything work you can do a Test Publish from Visual Studio, just be aware that the location of the.dacpac file should be changed to be found by the Build Controller (described later in this article)

 **Step 3: Configure the build** This is the most easy step, since it is the [very same of Deploying on Azure Web Site from on-premise TFS](http://www.codewrecks.com/blog/index.php/2013/07/05/deploying-on-azure-web-sites-from-on-premise-tfs/), I’ve actually cloned a build used for that post, and simply changed the name and credentials of the publish settings file used.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image4.png)

 ***Figure 5***: *Configure MSBuild Arguments to deploy the site*

The whole string is the following one, you are simply asking to MsBuild to publish the site using the AzureVM profile.

> /p:DeployOnBuild=true /p:PublishProfile=AzureVM /p:AllowUntrustedCertificate=true /p:UserName=gianmaria.ricci /p:Password=xxxxxxxxx

Clearly, to  **being able to publish database schema, you should manually change the location of the.dacpac file as** [**described in previous article**](http://www.codewrecks.com/blog/index.php/2013/07/05/deploying-on-azure-web-sites-from-on-premise-tfs/).

As a final note,  **always configure the build to index sources** [**using a Symbol Server**](http://www.codewrecks.com/blog/index.php/2013/07/04/manage-symbol-server-on-azure-or-on-premise-vm-and-tf-service/) **.** If a Symbol Server is configured and there is a bug in production site that is not reproducible dev machines, it is possible to use the [Intellitrace standalone collector](http://msdn.microsoft.com/en-us/library/vstudio/hh398365.aspx) to collect an intellitrace file, and once the itrace file is loaded in Visual Studio  **it will automatically download original source files used to compile the version of the site used to generate the trace**.

[![SNAGHTML3e3488](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/SNAGHTML3e3488_thumb.png "SNAGHTML3e3488")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/SNAGHTML3e3488.png)

 ***Figure 6***: *Once symbol server is configured, I can browse the source from intellitrace file*

This permits to simply open the intellitrace file offline, navigate through events, and have VS automatically download Source code for you, without even knowing where the solution is located.

Gian Maria.
