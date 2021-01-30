---
title: "Getting Work Item data in powershell through REST API"
description: ""
date: 2016-01-11T17:00:37+02:00
draft: false
tags: [Rest APIs,VSTS]
categories: [Azure DevOps,Team Foundation Server]
---
 **VSTS and the latests versions of on-premise TFS has the ability to access data through** [**REST API**](https://www.visualstudio.com/en-us/integrate/api/overview) **.** This way to access TFS data is really convenient expecially if used from PowerShell scripts, because you do not need any external dependency, except being able to issue REST requests with the [Invoke-RestRequest](https://technet.microsoft.com/en-us/library/hh849971.aspx) cmdlet.

To simplify accessing your VSTS account, you can  **enable alternate credentials, needed to issue request with simple Basic Authentication**. Here is a PowerShell snippet that retrieve a Work Item with a given ID.

{{< highlight powershell "linenos=table,linenostart=1" >}}


$username = "alternateusername"
$password = "alternatepassword"

$basicAuth = ("{0}:{1}" -f $username,$password)
$basicAuth = [System.Text.Encoding]::UTF8.GetBytes($basicAuth)
$basicAuth = [System.Convert]::ToBase64String($basicAuth)
$headers = @{Authorization=("Basic {0}" -f $basicAuth)}

$result = Invoke-RestMethod -Uri https://gianmariaricci.visualstudio.com/defaultcollection/_apis/wit/workitems/100?api-version=1.0  -headers $headers -Method Get

{{< / highlight >}}

This is a simple code you can find everywhere on the internet, it is just a matter of converting username and password in Base64 string and pass the result to Invoke-RestMethod with the –headers argument.  **The result is a object parsed from the json returned by the call**. The nice aspect of Powershell is that you can simply use the Get-Member cmdlet to list properties of returned object. Here is the result of instruction

{{< highlight powershell "linenos=table,linenostart=1" >}}


$result | Get-Member

{{< / highlight >}}

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image.png)

 **Figure 1** :*result of the Get-Member shows all properties of returned object*

In this situation we can see the id of the Work Item and the Rev property, but probably all the data we need is inside the fields property. If we simply Write-Output the $result.fields we got the full list of all the fields of the returned Work Item

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image1.png)

 ***Figure 2***: *content of fields property of returned Work Item*

Any property can be accessed with standard Dot Notation (but pay attention to the dot in the name of the property, fields property is actually an HashSet):

{{< highlight powershell "linenos=table,linenostart=1" >}}


$closedBy = $result.fields.'Microsoft.VSTS.Common.ClosedBy'
Write-Output "Work Item was closed by: $closedBy"

{{< / highlight >}}

Thanks to PowerShell ISE you can also use intellisense to have all the properties convienently listed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image2.png)

 ***Figure 3***: *Intellisense on returned object*

Gian Maria
