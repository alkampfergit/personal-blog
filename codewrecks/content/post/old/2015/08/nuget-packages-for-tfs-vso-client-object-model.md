---
title: "Nuget packages for TFS  VSO Client Object Model"
description: ""
date: 2015-08-22T07:00:37+02:00
draft: false
tags: [API]
categories: [Visual Studio]
---
Finally the Client Object Model for TFS / VSO  **is finally distributed with Nuget Packages, as you can** [**read here**](https://www.visualstudio.com/integrate/get-started/client-libraries/dotnet). This is a great news especially because the Dll are finally redistributable, and your tool does not need to require a previous installation of Visual Studio or Team Explorer, or Client Object Model Package.

Another interesting fact, is that  **REST API are now supported for TFS 2015 / VSO** (previous version of TFS does not support REST API). If you have traditional application that uses Client Object Model, you can remove all the references to the old dll and directly reference the [ExtendedClient Package](https://www.nuget.org/packages/Microsoft.TeamFoundationServer.ExtendedClient/) and you are ready to go.

Gian Maria.
