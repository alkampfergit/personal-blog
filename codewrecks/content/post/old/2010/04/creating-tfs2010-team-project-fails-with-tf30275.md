---
title: "Creating TFS2010 Team Project fails with TF30275"
description: ""
date: 2010-04-24T13:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
I have a strange issue that happens not only to me, but also to another guy that like me runs NOD32 antivirus. You can find [more detail here](http://social.msdn.microsoft.com/Forums/en-US/tfsadmin/thread/97c28590-d9cd-467c-a6f8-664d3ea051fd?prof=required).

The problem is that at the very end of the MSF Agile team project creation, from a remote machine running NOD32 and if you ask to create sharepoint portal the process hang for a while, then failed and you can find this error in the log. (the error code is TF30275).

{{< highlight csharp "linenos=table,linenostart=1" >}}
2010-04-24T14:06:54 | Module: WSS | Thread: 26 | TF30275: Error while uploading file source = d:\usertemp\TPW_tmp5ECE.tmp\Windows SharePoint Services\Samples and Templates\Vision and Planning\Document Template - Stakeholder Matrix.xltx target = Samples and Templates/Vision and Planning/Document Template - Stakeholder Matrix.xltx
---begin Exception entry---
Time: 2010-04-24T14:06:54
Module: WSS
Exception Message: The underlying connection was closed: A connection that was expected to be kept alive was closed by the server. (type WebException)
Exception Stack Trace:    at System.Net.WebClient.UploadDataInternal(Uri address, String method, Byte[] data, WebRequest&; request)
at System.Net.WebClient.UploadData(Uri address, String method, Byte[] data)
at System.Net.WebClient.UploadData(String address, String method, Byte[] data)
at Microsoft.TeamFoundation.Client.SharePoint.WssUtilities.SendFpRpcData(TfsConnection tfs, String siteUrl, Byte[] fpRpcCall)
at Microsoft.TeamFoundation.Client.SharePoint.WssUtilities.UploadData(Byte[] fileData, String remoteFullName, String siteUrl, TfsConnection tfs)
at Microsoft.TeamFoundation.Client.SharePoint.WssUtilities.UploadFile(String localFile, String remoteFullName, String siteUrl, TfsConnection tfs)
at Microsoft.VisualStudio.TeamFoundation.WssSiteCreator.UploadFile(WssCreationContextWrapper contextWrapper, String sourceFile, String siteUrl, String target, DocumentLibraryInfo docLibInfo, String currituckQuery)
 
Inner Exception Details:
 
Exception Message: Unable to read data from the transport connection: An existing connection was forcibly closed by the remote host. (type IOException)
 
Exception Stack Trace:    at System.Net.Sockets.NetworkStream.Read(Byte[] buffer, Int32 offset, Int32 size)
at System.Net.PooledStream.Read(Byte[] buffer, Int32 offset, Int32 size)
at System.Net.Connection.SyncRead(HttpWebRequest request, Boolean userRetrievedStream, Boolean probeRead)
 
Inner Exception Details:
 
Exception Message: An existing connection was forcibly closed by the remote host (type SocketException)
 
Exception Stack Trace:    at System.Net.Sockets.Socket.Receive(Byte[] buffer, Int32 offset, Int32 size, SocketFlags socketFlags)
at System.Net.Sockets.NetworkStream.Read(Byte[] buffer, Int32 offset, Int32 size)
 
--- end Exception entry ---
{{< / highlight >}}

The error happens when the script for process creation try to upload the file  **Document Template – Stakeholder Matrix.xltx**. Iâ€™ve verified and if you remove that process from the template the creation succeed, and clearly even the creation of CMMI team project will proceed with no problem, so it is a problem of that specific file.

The problem is somewhat originating from NOD32 and here is how can you solve it. You need to open the Full configuration Tree from NOD32

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image24.png)

Then you need to exclude the ip of the TFS from controlled ones, from Zone and Rules editor

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image25.png)

Now you need to exclude the IP of TFS

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image26.png)

As you can see Iâ€™ve inserted the ip of my test TFS (10.0.0.101) into the list of Addresses excluded from active protection (IDS). But this is not enough, the problem still arise because nod32 is monitoring HTTP traffic, and the communication from Visual Studio to the asmx services that constitute the tfs integration to sharepoint. Now go the WebAccessProtection/HTTP,HTTPS configuration section of nod, and insert the name of the tfs server (in my example is tfs2010test) into the list of addresses excluded from filtering.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb27.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image27.png)

Just insert the string \*yourtfsservername\* with asterisks, so every address containing the name of the tfs server is excluded from filtering. Do the same with the â€œList of allowed addressesâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb28.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image28.png)

Now save the configuration, close and restart Visual STudio, connect to tfs again and this time the creation of the team project should proceed with no problem.

alk.
