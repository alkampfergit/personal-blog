---
title: "How to deploy a Web Site with Powershell Part 2"
description: ""
date: 2014-06-12T06:00:37+02:00
draft: false
tags: [devops]
categories: [Team Foundation Server]
---
In the first part on “[how to deploy a web site with Powershell DSC](http://www.codewrecks.com/blog/index.php/2014/06/11/how-to-deploy-web-site-with-powershell-dsc/)” I’ve explained the basic of a PowerShell DSC based script to install IIS and the required version of.NET Framework on target environment; **now it is time to deploy a Web Site**. In my scenario I want to use a port different from 80, because in test servers is a common practice installing multiple version of sites in different ports to distinguish between various deploy (Dev, Test, QA, etc). Here are the sequence of resources I use to deploy my site.

*First of all I want the default Web Site to be stopped.*

{{< highlight powershell "linenos=table,linenostart=1" >}}


    xWebsite DefaultSite
    {
        Ensure = "Present"
        Name = "Default Web Site"
        PhysicalPath = "C:\inetpub\wwwroot"
        State = "Stopped"
        DependsOn = "[WindowsFeature]IIS"
    }

{{< / highlight >}}

DSC is really powerful, because  **it can Install features, but also enforce that a specific resource is in a desired state**. Since IIS installs a default Web Site, I want it to be in state “Stopped”. This step is not necessary since I’m going to use a different port for my application, but I do not like unnecessary site running in my test servers. Then it is time to *copy files from drop location to a local folder on target node*, a task easily accomplished by *File Resource*.

{{< highlight powershell "linenos=table,linenostart=1" >}}


File TailspinSourceFiles
{
    Ensure = "Present"  # You can also set Ensure to "Absent"
    Type = "Directory“ # Default is “File”
    Recurse = $true
    SourcePath = $AllNodes.SourceDir + "_PublishedWebsites\Tailspin.Web" # This is a path that has web files
    DestinationPath = "C:\inetpub\dev\tailspintoys" # The path where we want to ensure the web files are present
}

{{< / highlight >}}

The resource usage is straightforward,  **I simply want that DestinationPath contains the same sets of file of SourcePath recursively**. Thanks to TFS Build I’m sure that TailspinToys compiled files are contained in a subfolder of the drop folder called \_PublishedWebsites\Tailspin.Web. Remember that this script is executed in the target machine, so it needs to have access to the SourcePath directory.

*Now it is time to fix the web.config file as needed*. In resource pack there is *xWebConfigKeyValue* that can be used to change settings in AppSettings part of web config, but it does not allow changing connection strings. I want a solution that is capable of modifying any file in the target directory, because some team could use external XML files to store configuration and not web.config.

 **When there is no resource available for a DSC task and you can accomplish the task with few powershell script, the best solution is using the Script Resource, to specify the script you want to run in target node**. Here is the solution.

{{< highlight powershell "linenos=table,linenostart=1" >}}


#now change web config connection string
Script ChangeConnectionString 
{
    SetScript =
    {    
        $path = "C:\inetpub\dev\tailspintoys\Web.Config"
        $xml = Get-Content $path 

        $node = $xml.SelectSingleNode("//connectionStrings/add[@name='TailspinConnectionString']")
        $node.Attributes["connectionString"].Value = "Data Source=localhost;Initial Catalog=TailspinToys;User=sa;pwd=xxxx;Max Pool Size=1000"
        $xml.Save($path)
    }
    TestScript = 
    {
        return $false
    }
    GetScript = 
    {
        return @{
            GetScript = $GetScript
            SetScript = $SetScript
            TestScript = $TestScript
            Result = false
        }
    } 
}

{{< / highlight >}}

Please do not shoot me for using sa in connection string :), it is a Super Bad practice, but actually my first goal is having a working script for a test server, that contains everything, so I do not mind if this site is connecting to local test Sql Server using sa. Remember to absolutely avoid doing this in production. The script resource contains three distinct part, SetScript, TestScript and GetScript and it is really similar to the structure used to create a DSC Resource.

The SetScript is the script that brings the node to desired state for this node resource. In this example  **I use some standard XPATH manipulation to load web.config, change a node and save it again**. The TestScript is a piece of code that should return true if the condition is already met to avoid unnecessary run of SetScript. In my situation I could have tested if the value of the connection string is the desired one,  **but for the sake of brevity I simply return false, because the SetScript is idempotent and I do not mind running it every time so I always return false in TestScript part**. The GetScript is some piece of standard code I’ve found in an example and I leaved it as it is.

*Thanks to the Script DSC Resource I’m able to execute a custom script to the Node if there is no available resource to accomplish a simple task.*

Then it is time of some file system security:

{{< highlight powershell "linenos=table,linenostart=1" >}}


NTFSPermission AppDataSecurity
{
    Ensure = "Present"
    Account = "IIS AppPool\DefaultAppPool"
    Access = "Allow"
    Path = "C:\inetpub\dev\tailspintoys\app_data"
    Rights = "FullControl"
} 

{{< / highlight >}}

This part is really important, because it permits you to specify worker process access level to various folders of the site. As a member of Operational Team, have you ever found yourself in the situation where  **you should deploy a web application and you have a zip with a bunch of files and no instructions. Then you unzip the file, create a IIS site ,point to the directory where you zipped the file, browse the file and get a Security Exception. Then you ask to some member of the dev team how to solve the problem and the solutions are**.

- *Give to the worker role user Administrators permission*
- *Give everyone full access on the whole site folder*
- *Give write permission to C:\ to the worker role user.*

Thanks to DSC dev team can specify exactly what permission the application needs. In this example I use Elmah with a local db, and it is clear that the application should be able to write under the app\_data folder where I’ve located the database.

*Thanks to DSC scripts, you can make explicit the various level of authentication that the application needs for various folders, and simplify the life of Ops team.*

Finally you can use DSC to create the Web Site.

{{< highlight powershell "linenos=table,linenostart=1" >}}


xWebsite TailspinToysSiteDev
{
    Ensure = "Present"
    Name = "Dev-Tailspintoys"
    PhysicalPath = "C:\inetpub\dev\tailspintoys"
    State = "Started"
    BindingInfo     = MSFT_xWebBindingInformation  
    {  
        Protocol              = "HTTP"  
        Port                  = 11000
    }  

    DependsOn = "[WindowsFeature]IIS"
}

{{< / highlight >}}

This is a standard xWebsite resource you probably already know for various TechEd demo you can find in the internet. The only difference is the BindingInfo used to specify a different Binding, (in this example I want the site to bind to port 11000). Finally I need to be sure that a corresponding Firewall Rule open the 11000 port in the “domain” network, to make the site available to people in the domain.

{{< highlight powershell "linenos=table,linenostart=1" >}}


xFirewall Firewall
{
    Name                  = "TailpinToys Dev"
    DisplayName           = "Firewall Rule for TailpinToys Dev"
    DisplayGroup          = "Tailspin"
    Ensure                = "Present"
    Access                = "Allow"
    State                 = "Enabled"
    Profile               = ("Domain")
    Direction             = "InBound"
    LocalPort             = ("11000")         
    Protocol              = "TCP"
    Description           = "Firewall Rule for TailpinToys Dev"  
}

{{< / highlight >}}

 **This is another super interesting rule, because it is a Must Practice to write down all the port that an application is using to communicate with various networks.** In this situation the example is quite trivial, if you install a Web Site and bind to port 11000 it is straightforward that a corresponding firewall rule should be created to make this site available to other machines. Now think to a desktop application that hosts some Self Hosted WCF Services. With xFirewall resource you are able to create all firewall rule you need and at the same time you are documenting with a clear syntax network requirements of your application. I strongly suggest you to give to test environment the same attention about security you would do to a production server, so always leave the firewall on on Test Server. (I ask you forgiveness for the sa in connection string :) that actually violates this principle, but I have no resource to create a corresponding user in Sql to use Integrated Authentication).

This concludes the second part of this tutorial. In the last part I’ll cover deploying structure and data to local Sql Server.

Stay tuned.

Gian Maria.
