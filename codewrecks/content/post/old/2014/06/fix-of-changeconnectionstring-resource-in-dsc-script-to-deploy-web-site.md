---
title: "Fix of ChangeConnectionString resource in DSC Script to deploy Web Site"
description: ""
date: 2014-06-17T04:00:37+02:00
draft: false
tags: [devops]
categories: [DevOps]
---
<!--StartFragment-->- [How  
<br>to deploy a web site with Powershell DSC](http://www.codewrecks.com/blog/index.php/2014/06/11/how-to-deploy-web-site-with-powershell-dsc/)
- [How  
<br>to Deploy a Web Site with PowerShell DSC Part 2](http://www.codewrecks.com/blog/index.php/2014/06/12/how-to-deploy-a-web-site-with-powershell-part-2/)
- [How to Deploy a Web Site with PowerShell DSC Part 3](http://www.codewrecks.com/blog/index.php/2014/06/15/deploying-web-site-with-powershell-dsc-part-3/)

In the second part of this series I’ve received a really good comment by Rob Cannon, that warn me about an error in my ChangeConnectionString resource. In that article I told you that is ok for the Test part to return always False, so the Set Script is always run, because it is idempotent. This is true if you are using the Push Model,  **but if you are using the Pull Model instead, every 30 minutes the DSC will be applied and web config will be changed, so your application pool will be restarted**. This is not a good situation, so I decided to change the script fixing the Test Part.

{{< highlight powershell "linenos=table,linenostart=1" >}}


    Script ChangeConnectionString 
    {
        SetScript =
        {    
            $path = "C:\inetpub\dev\tailspintoys\Web.Config"
            $xml = Get-Content $path 
            $node = $xml.SelectSingleNode("//connectionStrings/add[@name='TailspinConnectionString']")
            $node.Attributes["connectionString"].Value = "Data Source=localhost;Initial Catalog=TailspinToys;User=sa;pwd=123abcABC;Max Pool Size=1000"
            $xml.Save($path)
        }
        TestScript = 
        {
            $path = "C:\inetpub\dev\tailspintoys\Web.Config"
            $xml = Get-Content $path 
            $node = $xml.SelectSingleNode("//connectionStrings/add[@name='TailspinConnectionString']")
            $cn = $node.Attributes["connectionString"].Value
            $stateMatched = $cn -eq "Data Source=localhost;Initial Catalog=TailspinToys;User=sa;pwd=123abcABC;Max Pool Size=1000"
            return $stateMatched
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

<!--EndFragment-->The test part is really simple, it loads the xml file, verify if the connection string has the correct value and return true if the state was matched, false if the state was not matched. Running this new version of the script always runs the Set Part of ChangeConnectionString as before, nothing was changed. At a first time I though of a bug in the Test part, but after a moment I realized that the  **File resource actually overwrites the web config with the original one whenever the script runs because it was changed**. This is how DSC is supposed to work, the file resource forces a Destination Directory to be equals to a source directory.This confirms me that the technique to download a base web.config with Node resource, and change it with a Script resource is suitable only for test server and if you use Push configuration.  **Actually to use Pull configuration the right web.config should be uploaded in the original location, so you do not need to change it after it was copied with the File Resource**.If you are interested in a quick fix, the solution could be using two distinct file resources, the first one copies all needed files from the original location to a temp directory, then the ChangeConnectionString operates on web.config file present in this temp directory, finally another File Resource copies files from the temp directory to the real IIS directory.

{{< highlight powershell "linenos=table,linenostart=1" >}}


 File TailspinSourceFilesShareToLocal
    {
        Ensure = "Present"  # You can also set Ensure to "Absent"
        Type = "Directory“ # Default is “File”
        Recurse = $true
        SourcePath = $AllNodes.SourceDir + "_PublishedWebsites\Tailspin.Web" # This is a path that has web files
        DestinationPath = "C:\temp\dev\tailspintoys" # The path where we want to ensure the web files are present
    }
    #now change web config connection string
    Script ChangeConnectionString 
    {
        SetScript =
        {    
            $path = "C:\temp\dev\tailspintoys\Web.Config"
            $xml = Get-Content $path 
            $node = $xml.SelectSingleNode("//connectionStrings/add[@name='TailspinConnectionString']")
            $node.Attributes["connectionString"].Value = "Data Source=localhost;Initial Catalog=TailspinToys;User=sa;pwd=123abcABC;Max Pool Size=1000"
            $xml.Save($path)
        }
        TestScript = 
        {
            $path = "C:\temp\dev\tailspintoys\Web.Config"
            $xml = Get-Content $path 
            $node = $xml.SelectSingleNode("//connectionStrings/add[@name='TailspinConnectionString']")
            $cn = $node.Attributes["connectionString"].Value
            $stateMatched = $cn -eq "Data Source=localhost;Initial Catalog=TailspinToys;User=sa;pwd=xxx;Max Pool Size=1000"
            return $stateMatched
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
    File TailspinSourceFilesLocalToInetpub
    {
        Ensure = "Present"  # You can also set Ensure to "Absent"
        Type = "Directory“ # Default is “File”
        Recurse = $true
        SourcePath = "C:\temp\dev\tailspintoys" # This is a path that has web files
        DestinationPath = "C:\inetpub\dev\tailspintoys" # The path where we want to ensure the web files are present
    }

{{< / highlight >}}

Now the ChangeConnectionString resource runs always, as we saw before, because each time that the File Resource runs it updates all the file with content of the original files. Changing this web.config file at each run is not a problem, because it is a temporary directory so not Worker Process Recycle happens. The final File Resource now works correctly and copies the files only if they are modified.This is what happens during the first run.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image17.png)

 ***Figure 1***: *During the first run all three resources were run, the first one copies files from the share to local temp, the second one changes web.config located in temp folder and finally the third one copies all files from temp folder to the folder monitored by IIS.*If you run the configuration again without changing anything in the target node you got this result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image18.png)

 ***Figure 2***: *During second run, the first two resources are run, but the third one that actually copies file to the folder where the site resides was skipped, avoiding recycling the worker process.*

The important aspect in previous picture is the third arrow, that highlight how the set part of the resource that copies files from temp directory to the local folder where IIS points is skipped, so no worker process recycle will happen. Thanks to this  simple change, now the script can be used even in a Pull process without too many changes.

Gian Maria.
