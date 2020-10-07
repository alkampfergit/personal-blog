---
title: "Pip and Python in Visual Studio Code"
description: "Avoid the 'No module named xxxx' when you try running Python files from VS code"
date: 2020-10-10T08:00:00+02:00
draft: false
tags: ["Python"]
categories: []
---

I'm not a Python expert, but I used it more often these days and I use Visual Studio Code with Python extension to author my scripts. One of the most annoying problem is **receiving a no module named xxx error when you already installed that module with pip**.

![No module error when running Python code in Visual Studio Code](../images/python-no-module-error.png)
***Figure 1:*** *No module error when running Python code in Visual Studio Code*

The problem arise because Visual Studio Code is not using the very same installation of python you are using from your command line / terminal. **When you edit Python files in Visual Studio Code you should select interpreter path command to specify which version of Python you want to use**, as showed in Figure 2:

![Choose Python interpreter](../images/python-choose-interpreter.png)
***Figure 2:*** *Choose Python interpreter*

This allows you to choose which Python version you want to use, but clearly, when you press F5 that specific version is used and probably **you did not install required module in that specific version**.

> Since Visual Studio Code can use whichever version of Python in your system, you need to install modules for that specific version used.

Once you realize this, solution is straightforward, just install module with pip using the same version of Python chosen as interpreter (Figure 2) **using directly python.exe correct version as shown in Figure 3**.

![Install modules with right version of pip](../images/python-pip-specific-version.png)
***Figure 3:*** *Install modules with right version of pip*

Once you installed modules **using the very same version chosen as interpreter in VSCode, you are ready to go**. Pressing F5 you can now debug your code without problem.

![Debugging in VSCode after installing required modules](../images/flask-run.png)
***Figure 4:*** *Debugging in VSCode after installing required modules*

This simple trick should solve the problem.

Gian Maria.
