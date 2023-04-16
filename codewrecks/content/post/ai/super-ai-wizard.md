---
title: "Using GPT-4 to Create a Small Software Project from Specification"
description: "Utilizing GPT-4 for software development accelerates project initialization and code generation, enabling developers to focus on complex tasks and improve overall efficiency."
date: 2023-04-16T06:00:00+00:00
draft: false
tags: ["GPT4", "AI"]
categories: ["AI"]
---

As a programmer, I often find myself **seeking ways to expedite the initial stages of a software development project**. GPT-4 has become a valuable tool in this regard, as it can help generate the foundational code for a new project. By leveraging the power of this advanced AI language model, I can significantly reduce the time and effort required for setting up a project, thus allowing me to focus on more complex aspects of the development process.

The first step in utilizing GPT-4 for this purpose is to create a prompt that instructs the AI to guide me through the development process step by step. The more precise and detailed the prompt, the better the AI can understand and generate the appropriate guidance for each step of the project. **My goal is being able to automatically parse AI output to avoid manual copy and paste operations**.

![A sample prompt to instruct AI to guide us in generating a new project](../images/code-generation-prompt.png)

***Figure 1:*** *A sample prompt to instruct AI to guide us in generating a new project*

Upon receiving the prompt, **GPT-4 provides a brief description of the project, which serves as an overview of the software's primary goals and features.** This summary helps me to confirm that the AI has accurately understood the project requirements and sets the stage for the subsequent steps. It also aids in maintaining a clear focus on the intended outcome throughout the development process.

![Summary of code that will be generated](../images/code-generator-summary.png)

***Figure 2:*** *Summary of code that will be generated*

Using the **"list" command, GPT-4 generates a file list for the project, which comprises all the necessary files and their respective directories.** This list is essential for ensuring that the project is well-organized and that all required components are accounted for. I really care about **guiding the AI with commands, to help generation one step at a time**.

![List of files of the project](../images/code-generator-filelist.png)

***Figure 3:*** *List of files of the project*

As you can see I mistyped the word list as lised, but it is able to understand and continue. 

Next, I utilize the "initialize" command, which prompts **GPT-4 to provide me with the complete list of commands necessary to create the software solution.** These commands are tailored to the specific project requirements and typically include instructions for setting up the development environment, installing dependencies, and initializing the project's structure. 

![Initialize command](../images/code-generator-initialize.png)

***Figure 4:*** *Initialize command*

Finally, I can use the **"file" command to have GPT-4 generate the individual files for the project one by one. By specifying the desired file and its corresponding directory, the AI model can create the appropriate code based on the project requirements and specifications.** 

Now it is just a matter of few lines of C# code to parse this conversation, **run commands in intialization phase and then write the file one by one**.

![Files Generation](../images/code-generator-file.png)

***Figure 5:*** *Files Generation*

First skeleton of the project [Is on github https://github.com/alkampfergit/ai-playground/tree/feature/code](https://github.com/alkampfergit/ai-playground/tree/feature/code).

This is the prompt I've used, I'm still experimenting with small variation of it.

{{< highlight text >}}

You will receive specification for a software that must be written in C# and .NET core in a Windows operating system.
Proceeds in steps. 
You will answer with a general brief explanation of the solution.
wait for command "list" then answer with the numbered list of files I will need to write.
wait for command "initialize" then answer with shell commands to initialize solution and project structure as well as all the nuget install commands. Specify the version of the framework you want to use in the dotnet new command.
Wait for a seres of "file" commands followed by the number of the file. You will answer with a line containing full path of the file relative to base directory, followed by entire file content and nothing else. If a file already exists you will give the entire new content.

Specifications
"""
asp.net application with blazor that accepts powershell instruction that will be executed on the system. 
The ui will have the aspect of an old CRT green monochrome crt
"""
{{< / highlight >}}

What about the result? Well, here some considerations

1. The AI is not deterministic, you will end with different results
2. The output is not always the same, parsing the output could be more trickier than you think
3. I've tried same prompt four time, one of the solution was wrong, no green screen

But the overall satisfaction is good, I have a project automatically created, opened in visual studio and operates **just minor correction and I have a working prototype I can start refining**.

![Final result](../images/code-generator-output.png)

***Figure 6:*** *Final result*

Gian Maria