---
title: "Configure Codespaces for Python projects"
description: "Real usage of Codespaces to work in a Python project"
date: 2021-08-26T08:00:00+02:00
draft: false
tags: ["GitHub", "Codespaces"]
categories: ["GitHub"]
---

One of the great advantage of Codespaces is the ability [to preconfigure the environment](https://www.codewrecks.com/post/github/configuring-codespaces/) so you do not need to **waste time installing and configuring your toolchain**. Python is a perfect example of this scenario, I've a small project [to generate Git Graph Representation](https://github.com/alkampfergit/GitGraphAutomation) and since I'm not a full time Python developer, I've not  it installed and perfectly configured in all of my environment. Also I primarily work on Windows, so **Codespaces allows me to test everything on Linux with a single click**.

Configuring a codespaces for Python is really simple because you can already start for a **prebuild Python enabled container** that you only need to configure. In devcontainer.json **lots of stuff are already preconfigured for Python, I only needed to add my personal preferences, like editor.fontsize and adding some other extension for Visual Studio Code**.

{{< highlight json "linenos=table,linenostart=1" >}}
{	
    // ...
	// Set *default* container specific settings.json values on container create.
	"settings": { 
		"python.pythonPath": "/usr/local/bin/python",
		"python.languageServer": "Pylance",
		"python.linting.enabled": true,
		"python.linting.pylintEnabled": true,
		"python.formatting.autopep8Path": "/usr/local/py-utils/bin/autopep8",
		"python.formatting.blackPath": "/usr/local/py-utils/bin/black",
		"python.formatting.yapfPath": "/usr/local/py-utils/bin/yapf",
		"python.linting.banditPath": "/usr/local/py-utils/bin/bandit",
		"python.linting.flake8Path": "/usr/local/py-utils/bin/flake8",
		"python.linting.mypyPath": "/usr/local/py-utils/bin/mypy",
		"python.linting.pycodestylePath": "/usr/local/py-utils/bin/pycodestyle",
		"python.linting.pydocstylePath": "/usr/local/py-utils/bin/pydocstyle",
		"python.linting.pylintPath": "/usr/local/py-utils/bin/pylint",
		"editor.fontSize": 18
	},

	// Add the IDs of extensions you want installed when the container is created.
	"extensions": [
		"streetsidesoftware.code-spell-checker",
		"ms-python.python",
		"ms-python.vscode-pylance"
	],
    // ...
}
{{< /highlight >}}

If you scroll down a little bit, you find the section that uses requirements.txt standard Python file to **automatically install pip packages**. Just uncomment it and you will have all needed pip packages preinstalled in your codespaces. In my example I have pytest and other stuff.

{{< highlight json "linenos=table,linenostart=1" >}}
	// Use 'postCreateCommand' to run commands after the container is created.
	"postCreateCommand": "pip3 install --user -r requirements.txt",
{{< /highlight >}}

As usual you can go **into dockerfile to add more customization**. One thing I miss in the basic codespaces environment is git-flow, so I use apt-get section to install it and have it ready. In this project I tried to use pantomjs so I also use the npm section to install npm packages.

{{< highlight docker "linenos=table,linenostart=1" >}}
# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git-flow

# [Optional] Uncomment this line to install global node packages.
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g phantomjs" 2>&1
{{< /highlight >}}

Thanks to this configuration, if I need to work on this project I'm ready to go with a simple click. The only drawback of this approach is that, in this project, **I used selenium and playwrigth to automate a browser**, my first tentative was selenium, but phantom.js refuses to work (it is deprecated) and I was not able to install chrome into the container (probably my fault). I've then tried playwright but also it refuses to work inside a container.

> This is the very first real limitation of Codespaces I've found, if you need to work with selenium/playwright to do browser automation, it does not work out of the box inside the container.

Actually if you want Playwright to work in docker you need to have a different approach described [in this GitHub issue](https://github.com/microsoft/playwright-dotnet/issues/982). For this project I've not tried to fix this problem, I can still live with this limitation (I'm testing the full program in Windows or Linux full environment).

Another simple problem I've found is **test runner was not able to identify tests**, this is caused by a stupid error of mine, I've mistakenly added the Windows path of Python environment inside the settings.json.

{{< highlight docker "linenos=table,linenostart=1" >}}
{
    "python.testing.unittestEnabled": false,
    "python.testing.nosetestsEnabled": false,
    "python.testing.pytestEnabled": true,
    "python.analysis.extraPaths": [
        "./src/git-graph-automation"
    ],
    "python.pythonPath": "C:\\programfiles\\python3\\python.exe"
}
{{< /highlight >}}

When you work in different environments **you should avoid putting environment dependant settings inside your .vscode file**. Once I've removed the python.pythonPath settings everything works perfectly.

And, as usual, this post was written with Codespaces,

Gian Maria.





