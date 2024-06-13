---
title: "GitHub Copilot Workspace: first impression"
description: "Using the new Copilot Workspace feature is a really amazing experience, the tool is surely not perfect, but given the real speed of the whole LLM ecosystem in the latest two years, I wonder what it could do five years from now."
date: 2024-06-13T06:00:00+00:00
draft: false
tags: ["GitHub", "AI"]
categories: ["AI"]
---

I have the luck to have enabled the technical preview of [Github Copilot Workspace](https://github.blog/2024-04-29-github-copilot-workspace/). As every good developer, I immediately jump at it, without reading anything (spoiler you have a good [user manual](https://github.com/githubnext/copilot-workspace-user-manual)) that can be used to **move your first steps into this marvelous world**. Not reading the documentation is for me a good way to start using it and verify **how intuitive is the tool and what it can do into a real project**.

After few stupid tentatives I started the very first **real task for a real project that I need to do in my daily work**. I have a project called [NStore](https://github.com/nstoredev/nstore) that has a very **old build in cake that needs to be replaced**, because it is old and it is a pain to maintain. I have a clear scenario, that project is a dotnet based project and I have lots of other projects **where I build with simple PowerShell script using standard restore/build/run test with coverage/create nuget packages/publish nuget packages**. 

In such a scenario I usually start a branch, copy the PowerShell build file from another project, adjust for the new project and change the GH Actions to use the new script.**This is the typical situation that I like to try to give to a LLM, because it does not require "complex reasoning" and I think that it can do it**

Sadly enough I've not taken screenshot for all steps, and after closing the branch the history does not show everything but it allows me to highlight the process.

I've started with a free prompt, **I've chosen the Github project to work with and then I started with a blank canvas".  

![Zero shot prompt to remove cake and use a sample powershell file to generate the build.](../images/copilot-workspace-start-build.png)

***Figure 1:*** *Zero shot prompt to remove cake and use a sample powershell file to generate the build*

This was done in a browser, 10 seconds, then I come back to Visual Studio to do other task. After few seconds (I'm keeping it in the left monitor) I see that **it generates some specifications**

![Specifications generated from my request.](../images/copilot-workspace-plan-specifications.png)

***Figure 2:*** *Specifications generated from my request*

Actually, specification are a simple As-Is -> To-Be assessment, where copilot Examine all the files in the repository and verify which is the current situation and which is the Proposed Situation. Based on this information, it can start devising a detailed plan, understanding **which modification should be done to each file involved in the process.**

![Detailed plan, now file are mentioned](../images/copilot-workspace-plan.png)

***Figure 3:*** *Detailed plan, now file are mentioned*

As you can see, compiler list all the files that will be involved in the process for each file determine the list of task it should be accomplished and the important thing is you can edit the plan adding **in natural language other files or modify the set of tasks for each of the existing files**. This greatly helps in using the tool, because copilot is not magic, but you can fix/add/modify the plan to better fit your needs.

Once you are satisfied with the plan, you can have Copilot actually **generate the plan. In this phase copilot will actually generate all the actions and the modification of all the files involved in the plan**. At the end, you can simply create a pull request with all the changes, or you can directly open the project with codespaces to fine tune and fix what is not working as expected.

Actually in this example I needed only to add a couple of dotnet pack because Copilot did not find all of my nuget packages to publish (I've multiple packages in the repository), but the rest of the file was good.

If I needed to do this manually, I would have spent surely more time, and being able to refine the plan is a really killer feature for all this maintenance task that are usually boring and error prone.

Another successful experiment was asking to update one task in GitHub Actions due to a warning I've received from the build. I've simply pasted the error in copilot **it understood which is the workflow to modify, it correctly modified, opened a pull request, the error was fixed, done**.

Even if it is not perfect, I wonder what will it become five years from now.

Gian Maria.