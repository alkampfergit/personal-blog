---
title: "Modifying Azure DevOps Pipeline Decorators with Bing Chatbot Assistance"
description: "Learn how to efficiently modify Azure DevOps pipeline decorators using Bing Chatbot and overcome common challenges."
date: 2023-08-29T16:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

In the past, I've discussed using pipeline decorators to clean up build folders. Recently, I faced a challenge where **I needed to modify my decorator to run only if there was a `.git` folder**. To save time, I used Bing Chatbot, which leverages GPT powerful LLM and can search the internet to find latest contents, making this kind of problem-solving a breeze.

![sample prompt asking to modify a piece of an Azure Devops pipeline](../images/bing-question.png)

***Figure 1***: *sample prompt asking to modify a piece of an Azure Devops pipeline*

This kind of problem are perfect for the AI **because I have an example and I can give a clear description of what I want to be changed**.
Bing quickly provided a solution; however, it assumed the script section was written in BASH. This required a more detailed request to make the solution work on both Linux and Windows.

![Answer from bing, it is correct but it assumes that script section is written in BASH](../images/bing-answer-1.png)

***Figure 2***: *Answer from bing, it is correct but it assumes that script section is written in BASH*

Since we have a chat, bing does not lose its context, and I can refine my request to make it work on both Linux and Windows.

![I'm asking bing to change the answer](../images/bing-refine-1.png)

***Figure 3***: *I'm asking bing to change the answer*

After refining my request, Bing provided a cross-platform solution. The chatbot checked for PowerShell availability on both Linux and Windows agents and adjusted the script accordingly.

![Bing fixed the solution to work cross OS](../images/bing-answer-2.png)

***Figure 4***: *Bing fixed the solution to work cross OS*

However, I had a unique situation where some **custom-deployed Linux agents might not have PowerShell core installed**. I then asked Bing for a conditional pipeline decorator that would run different tasks based on the operating system.

![I further ask to change the solution; I want to change the code based on the OS](../images/bing-refine-2.png)

***Figure 5***: *I further ask to change the solution; I want to change the code based on the OS*

The whole conversation is like **giving task to a junior programmer, wait for the solution and refine the request until the solution is correct**. The whole process is very natural. Again Bing provided a solution, but it proved to be incorrect. 

![The solution is wrong, but it seems good at a first glance.](../images/bing-cross-os-answer.png)

***Figure 6***: *The solution is wrong, but it seems good at a first glance.*

If you have great experience in Azure Devops pipeline you can immediately spot that **the use of template expansion is wrong**. Template expansion syntaxt happens when the pipeline is instantiated, long before any agent was chosen. **At that stage, the `Agent.OS` variable is still empty because we are not running in any agent.**

Lets suppose that you did not immediately found the error, you can simply ask bing **to generate a simple pipeline definition that runs a simple task on Linux and Windows agent so you can test your new decorator.** Few seconds and you have a perfectly working solution.

![Et voilà, a sample pipeline was created.](../images/bing-test-pipeline.png)

***Figure 7***: *Et voilà, a sample pipeline was created.*

Now you can run the pipeline and indeed verify that the solution is wrong, **actually despite the OS of the agent only the Linux task is executed**. This is because the template expansion happens before the agent is chosen, so the `Agent.OS` variable is empty and the condition of Linux task is always true.

This is somewhat a limit of LLMs, when the task is really complex it can fail. This can be due to various situations:

- Bing did not found an example online that mached perfectly my request, so the solution is based on the existing example
- My original example already has a condition for template expansion, the fact that the `Agent.OS` variable is not available is a really too complex concept
- The overall subject (azure Pipelines) is complex and we have really tons of options

To solve the issue, I search for documentation and I referred to the [Microsoft documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/cross-platform-scripting?view=azure-devops&tabs=yaml) that has a section dedicated to **run tasks based on OS version**. I needed to use the `condition` property of the task because that condition **is evaluated at agent run time, when the OS is known.**

{{< highlight yaml "linenos=table,hl_lines=21-28 45-53,linenostart=1" >}}
steps:
- ${{ if not(eq(variables['skip-clean-decorator'], 'true'))}}:
  - task: PowerShell@2
    displayName: "do a git clean (WINDOWS) (injected from decorator)"
    condition: eq( variables['Agent.OS'], 'Windows_NT' )
    inputs:
      workingDirectory: $(Build.SourcesDirectory)
      failOnStderr: false
      targetType: 'inline'
      script: |
        write-host $(Agent.OS)
        if (Test-Path .git) {
          git checkout -- .
          git clean -xdf
        }
    continueOnError: true

  - task: CmdLine@2
    displayName: "do a git clean (LINUX) (injected from decorator)"
    condition: eq( variables['Agent.OS'], 'Linux' )
    inputs:
      workingDirectory: $(Build.SourcesDirectory)
      failOnStderr: false
      script: |
        echo $(Agent.OS)
        if [ -d .git ]; then
          git checkout -- .
          git clean -xdf
        fi
    continueOnError: true

{{< / highlight >}}

Now I re-run test pipeline and indeed **the decorator works as expected**.

![Pipeline decorator now works as expected.](../images/decorator-fixed.png)

***Figure 8***: *Pipeline decorator now works as expected.*

## Conclusion

Bing Chatbot efficiently **analyzed my script and provided a solution for a cross-platform pipeline decorator.** It worked perfectly and gave me a perfectly fine solution (**the one that uses PowerShell because it indeed found that linux agent usually have PowerShell core installed**), but then started to allucinate when I asked for a more specific and uncommon situation. The overall experience demonstrated that Bing Chatbot is an excellent tool for quickly solving well-documented tasks. However, it may struggle with more complex or uncommon situations.

Gian Maria.
