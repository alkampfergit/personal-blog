---
title: "Import a Git Project with REST API between VSTS Team Projects"
description: ""
date: 2016-10-08T09:00:37+02:00
draft: false
tags: [Git,Rest APIs,VSTS]
categories: [Team Foundation Server]
---
I’ve got an interesting question about the possibility to import via REST API a Git Repository between Team Projects of VSTS. Actually the problem is: **you want to import a private git repository from a *Source repository*(in this situation is another VSTS git repository but it could be hosted everywhere) to a VSTS *Target  repository* using only REST API. **The operation is quite simple thanks to the new api described here ([https://www.visualstudio.com/en-us/docs/integrate/api/git/import-requests#create-a-request-to-import-a-repository](https://www.visualstudio.com/en-us/docs/integrate/api/git/import-requests#create-a-request-to-import-a-repository "https://www.visualstudio.com/en-us/docs/integrate/api/git/import-requests#create-a-request-to-import-a-repository")) and in this post I’ll give you all the details.

## Step 1 – create a PAT** To access VSTS through REST API you have many option to authenticate the call, but the easiest one is using PAT (Personal Access Token). **If you do no already have a valid PAT you can create one using security page of your account.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image.png)** Figure 1: ***Open security page of your account*

Creating a PAT is really simple, you should only select Personal Access Token (1), then give a description, an expiration time, and the account where PAT is valid into. Since I have more than one VSTS Account I have a combo where all of my account are listed (2).

Finally  **you should select only the permission you want to give to the token.** The default option is All Scopes, and this will imply that the token can do pretty much anything you can do. If you need this token to manage import of repositories you can simply select only code related permission.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-1.png)

 ***Figure 2***: *Create a PAT to access your account.*

> Personal Access Token are the most secure way to authenticate an application in VSTS because they can be revoked, you can choose the permission you want to give to the token and they have an automatic expiration.

If your *Source Account*is on a different account from the *Target Account* you need to create PAT both in *Source Account VSTS Instance and in Target Account VSTS Instance.* In this example VSTS instance is the very same, so I need only one PAT.

## Step 2 – Create endpoint to access Source Repository

**My target repository is called ImportTest, and it is important that this repository is created empty. This is my *Target Repository,*the repository where I want to import the *Source Repository.* **[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-2.png)** Figure 3: ***Create Target Repository with standard Web Interface*

The import routine should be able to access *Source Repository*and this imply that it needs to be authenticated. To maximize security **you need to create an Endpoint that point to the *Source Repository in the Team Project of Target Repository.***This can be easily done from the administration page of the Team Project that contains the *Target Repository.*The team project that contains my ImportTest repository is contained in GitMiscellaneous Team Project, and I can proceed to manually create the endpoint.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-3.png)

 ***Figure 4***: *Create an endpoint of type External Git*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-4.png)

 ***Figure 5***: *Specify endpoint details*

In Figure 5 you can see all the options needed, you should specify a connection name, then the URL parameter is the url of the Source Repository, the same url you use to clone the repository. Finally you need to use the PAT as username, then you can press OK.

This service endpoint  **should be created in the Team Project that contains the Target Repository** , because it will be used by the import routine to authenticate to the Source Repository to take data to import.

> An endpoint is basically an URL and an authentication that is used by the server to access an external service

 **If you need to automate the whole process, the endpoint can be created easily with REST API** ([https://www.visualstudio.com/en-us/docs/integrate/api/endpoints/endpoints](https://www.visualstudio.com/en-us/docs/integrate/api/endpoints/endpoints "https://www.visualstudio.com/en-us/docs/integrate/api/endpoints/endpoints")) here is a simple call in Postman.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-5.png)

 ***Figure 6***: *Creation of the endpoint with REST API*

This does not need any explanation because it is a simple call with the very same option that you specify on the UI.

## 

## Step 3 – Create the call to import repository

To create the call to start repository import routine you need some parameters: first of all  **you need the id of the Endpoint you created in step 2**. If you created the endpoint through REST API this is not a problem, because the Id is present in the response

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-6.png)

 ***Figure 7***: *Response of the request shown in Figure 6 contains endpoint Id*

If you created the endpoint through Web UI the id can be grabbed by the url in the administration page of the endpoints, but  **a simpler and better method is to list all endpoint of the Team Project through REST API**. In my situation is a simple GET call to this url [https://gianmariaricci.VisualStudio.com/GitMiscellaneous/\_apis/distributedtask/serviceendpoints?api-version=3.0-preview.1](https://gianmariaricci.VisualStudio.com/GitMiscellaneous/_apis/distributedtask/serviceendpoints?api-version=3.0-preview.1 "https://gianmariaricci.VisualStudio.com/GitMiscellaneous/_apis/distributedtask/serviceendpoints?api-version=3.0-preview.1")

The answer is the very same of Figure 7, and this gives me the id of the endpoint that points to the *Source Repository: df12f2e3-7c40-4885-8dbd-310f1781369a*

Now I need to create the import request, as described here ([https://www.visualstudio.com/en-us/docs/integrate/api/git/import-requests#create-a-request-to-import-a-repository](https://www.visualstudio.com/en-us/docs/integrate/api/git/import-requests#create-a-request-to-import-a-repository "https://www.visualstudio.com/en-us/docs/integrate/api/git/import-requests#create-a-request-to-import-a-repository")). And the only information I’m missing is the Id of the Target Repository

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-7.png)

 ***Figure 8***: *Repository part of the url in the call should be replaced by repository ID*

As shown in Figure8 the only annoying part of the request is the Id of the *Target Repository*because  **it is the GUID of the repository not the name**. Obtaining this value is not difficult, because with REST API this is a simple GET call to this url: [https://gianmariaricci.VisualStudio.com/DefaultCollection/GitMiscellaneous/\_apis/git/repositories?api-version=1.0](https://gianmariaricci.VisualStudio.com/DefaultCollection/GitMiscellaneous/_apis/git/repositories?api-version=1.0 "https://gianmariaricci.VisualStudio.com/DefaultCollection/GitMiscellaneous/_apis/git/repositories?api-version=1.0"). From the answer of this call the ID of the ImportTest repository is: 3037268a-0c91-4fe1-8435-a76e9b731f5e

Now I have everything to create the import request, just forge the request in Postman or similar tool and fire the request.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-8.png)

 ***Figure 9***: *The import request where 1 is the ID of Target Repository and 2 is the ID of the endpoint.*

If you are quick enough and refresh the page of *Target Repository*while the import routine is running, you should be able to see this image

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-9.png)

 ***Figure 10***: *Importing is running*

After a little bit (depending on the source of *Source Repository*) the *Target Repository*will be a perfect clone of the *Source Repository.*

If there are errors during the import process in the source code page of *Target Repository*you are warned with the error*,* as shown in  **Figure 11**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-10.png)

 ***Figure 11***: *Error in the importing routing were shown to source  code page of Target Repository*

As an example the error in the above image is due to a misconfiguration of the Endpoint (done in part 2), as an example if you created the endpoint with wrong credentials.

Gian Maria
