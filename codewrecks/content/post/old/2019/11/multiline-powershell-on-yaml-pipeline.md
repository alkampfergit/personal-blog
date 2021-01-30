---
title: "Multiline PowerShell on YAML pipeline"
description: ""
date: 2019-11-19T18:00:37+02:00
draft: false
tags: [Azure Pipelines,build]
categories: [Azure DevOps]
---
Sometimes having a  **few lines of PowerShell in your pipeline is the only thing you need to quickly customize a build without using a custom task or having a PowerShell file in source code**. One of the typical situation is: write a file with some content that needs to be determined by a PowerShell script, in my situation I need to create a configuration file based on some build variable.

Since using standard graphical editor to put a PowerShell task and then grab the YAML with the “View YAML” button is the quickest way to do this, you need to be warned because you can incur in the following error.

> can not read a block mapping entry; a multiline key may not be an implicit key

This error happens when you put multiline text inside a YAML file with bad indentation of a multiline string.  **Inline PowerShell task comes really in hand but you need to do special attention because “View YAML” button in the UI sometimes generates bad YAML.** In  **Figure 1** You can verify what happens when I copy and paste a YAML task using the “View YAML” button of standard graphical editor and paste into a YAML build.  **In this situation the editor immediately shows me that the syntax is wrong.** The real problem here is that, using Visual Studio Code with Azure Pipelines extension did not catch the error, and you have a failing build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-8.png)

 ***Figure 1***: *Wrong YAML syntax due to multiline PowerShell command line*

It turns out that the View YAML button of classic graphical editor misses an extra tab needed to the content of PowerShell, the above task should be fixed in this way:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-9.png)

 ***Figure 2***: *Correct syntax to include a multiline script*

If you want to include an inline PowerShell script,  most of the time you do not want to limit yourself to a single line and you need to use the multiline string syntax. Just use a pipe character (|) followed by a multiline string where each newline will be replaced by regular \n. The important rule is: **the string has an extra tab respect the line that initiate the multiline string.** This fact was highlighted in  **Figure 2**. The tab is important because YAML parser will consider the string finished when it encounter a new line with a one tab less than the multiline string.

> The pipe symbol at the end of a line indicates that any indented text that follows is a single multiline string. See [the YAML spec – Literal styles.](https://yaml.org/spec/1.2/spec.html#style/block/literal)

This is another reason to use online editor for YAML build, because, as you can see in  **Figure 1** , it is able to immediately spot errors in syntax.

Gian Maria
