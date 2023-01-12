---
title: "Develop locally with GitHub Codespaces and Hugo"
description: "Visual Studio Code + GitHub Codespaces + Hugo = a great combination to write blog post"
date: 2023-01-12T08:00:00+02:00
draft: false
tags: ["GitHub", "Codespaces"]
categories: ["github"]
---

I really love [Using Hugo and Codespaces to write blog posts](https://www.codewrecks.com/post/github/codespaces-hugo/), I've a really better blogging experience **than wordpress, because I have a simple blog, quick to load, no frills no fuzzes, just a simple blog**. Using Codespaces is really nice experience and I really never wrote a blog post in my Windows machine until yesterday.

Yesterday I simply opened my blog repository inside a local instance of Visual Studio Code, but I had a **nasty surprise when I tried to start hugo server**.

{{< highlight text "linenos=table,linenostart=1" >}}
hugo v0.109.0-47b12b83e636224e5e601813ff3e6790c191e371+extended windows/amd64 BuildDate=2022-12-23T10:38:11Z VendorInfo=gohugoio
Error: Error building site: "C:\...\....\personal-blog\codewrecks\content\post\old\2007\05\the-advantage-of-word2007-blogging.md:1:1": "C:\develop\github\personal-blog\codewrecks\layouts\_default\_markup\render-image.html:4:20": execute of template failed: template: _default/_markup/render-image.html:4:20: executing "_default/_markup/render-image.html" at <resources.Get>: error calling Get: CreateFile C:\develop\github\personal-blog\codewrecks\themes\minimo\assets\post\old\2007\05\https:\www.codewrecks.com\blog\wp-content\uploads\2007\05\050307-0951-theadvantag12.png: The filename, directory name, or volume label syntax is incorrect.
Built in 462 ms
{{< /highlight >}}

Looking for that image I found a simple post with the following content:

![Simple external image markdown](../images/markdown-external-image.png)

***Figure 1:*** *Simple external image markdown*

As you can see it is just a reference to an external image, but **For some reason the code inside render-image.html thinks that this is a local file and generates an error because clearly it is not present in disk**. Actually the code is in a file that I've taken from the internet time ago, I've always used inside GitHub codespaces in a linux machine and never realized that it does not work under Windows. Now the question is: **how can I quickly can write a post in my blog from my local machine with the minimum effort possible?**. 

The answer that I've already configured everything under my GitHub Codespaces, so my repository **already has a .devcontainer directory with the specifications of container I'm using into codespaces**. Thanks to this, I can simply install (I've already installed) an extension called "Dev Container", that [Allows developing inside a container](https://code.visualstudio.com/docs/devcontainers/containers) that runs on local machine.

Thanks to GitHub codespaces I've already configured my devcontainer, so I can simply **open Visual Studio Code and ask to open a local folder in a dev container**.

![Open local folder in dev container](../images/open-in-dev-container.png)

***Figure 2:*** *Open local folder in dev container*

Then I open my local blog and immediately Visual Studio Code **identify the .devcontainer/devcontainer.json file and immediately starts to create container in my local Docker instance**, after it finished you should have another Docker Container configured with devcontainer.json instructions. This is really cool because I already have extensions and everything I need to write a blog post in Visual Studio Code instance. 

![Visual Studio Code shows log of new container](../images/dev-container-starting.png)

***Figure 3:*** *Visual Studio Code shows log of new container*

The only drawback is that **it seems that Hugo does not always detect file changed** so when I start Hugo --server it render my blog post then does not update it when I modify the file. This is a no-problem because usually I write the post, then verify how it looks and perform modifications.

This probably happens because **the folder you are working with is the folder in your LOCAL machine, it is only mapped inside the container** and this probably makes impossible for the hugo tool inside the container, to place an hook for file system change. 

![Mount point of the new created container](../images/mount-in-container.png)

***Figure 4:*** *Mount point of the new created container*

As you can see in **Figure 4** we have mounted /workspaces/personal-blog to my Windows folder, and the visual Studio Code into a internal directory. 

{{< highlight json "linenos=table,linenostart=1" >}}
// For format details, see https://aka.ms/devcontainer.json. For config options, see the README at:
// https://github.com/microsoft/vscode-dev-containers/tree/v0.191.1/containers/javascript-node
{
	"name": "Node.js",
	"build": {
		"dockerfile": "Dockerfile",
		// Update 'VARIANT' to pick a Node version: 12, 14, 16
		"args": { "VARIANT": "16" }
	},

	// Set *default* container specific settings.json values on container create.
	"settings": {
		"editor.fontSize": 18,
	},

	// Add the IDs of extensions you want installed when the container is created.
	"extensions": [
		"rusnasonov.vscode-hugo",
		"github.copilot",
		"streetsidesoftware.code-spell-checker",
		"fivethree.vscode-hugo-snippets",
		"eamodio.gitlens",
		"yzhang.markdown-all-in-one"
	],
	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],

	// Use 'postCreateCommand' to run commands after the container is created.
	// "postCreateCommand": "yarn install",

	// Comment out connect as root instead. More info: https://aka.ms/vscode-remote/containers/non-root.
	"remoteUser": "node"
}
{{< /highlight >}}

The result is, I **have a folder with some code in my Windows Machine, I'm using Visual Studio Code UI running in Windows, but terminal and Visual Studio Code engine is running in docker**. Thanks to this I avoided to verify why my custom code does not work in Windows, because I can use Dev Containers and have the **very same experience of codespaces**.

> Codespaces is really fantastic, because you can replicate the very same experience locally with Dev Containers addin.

For Visual Studio Extensions you need to pay attention to what is installed in LOCAL Visual Studio Code and what is installed in CONTAINER visual studio code, like you can see in **Figure 5**. As you can see you **have (1) some LOCAL extensions that you can install in container version and vice versa (2).**

![Extensions in local and container version of Visual Studio Code](../images/dev-containers-extensions.png)

***Figure 5:*** *Extensions in local and container version of Visual Studio Code*

It is really easy to install an extension in container version, **this gives you an incredible versatility in development experience**. One question is, why you want to write a blog post in your computer **and not using codespaces?**. One reason is that I can handle images more easily because I'm working in a local folder and Paste Image addin does not work in container, also I avoid loading my PGP key in codespaces container to sign my commits.

If you need to share secrets with GitHub Codespaces [please check encrypted secrets](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces).

I'm really amazed by CodeSpace GitHub experience and Dev Containers because I can have a common development environment that I can use in a browser or locally in my machine with **zero friction**.

Gian Maria.




