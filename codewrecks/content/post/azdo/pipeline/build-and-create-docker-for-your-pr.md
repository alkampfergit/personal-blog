---
title: "Azure DevOps: Create Docker images for a Pull Request"
description: "Being able to easily test code of a Pull Request is the key to have a better code management. Most of the time checking only the code increment is not enough to validate a PR"
date: 2024-07-07T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

The whole Pull Request process mechanism has a single purpose, **have a better quality of the code that reach develop or generally speaking main branch**. The ability to share the code and being able to get feedback from other members of the team is invaluable, but it is enough?

The basic concept is: develop is a branch that should be **considered production** and it is not uncommon for teams to deploy develop branch automatically in internal production servers, a procedure called **dogfooding**. Here in Nebula Team we deploy automatically develop branch in our internal production servers, and sometimes you intercept bug before they hit master and production of all customer.

Now in this post I'll examine how you can have a better PR experiences, based on our experience of the subject.

Many thanks to [Daniele Scarinci](https://www.linkedin.com/in/danielescarinci) and [Giuliano Latini](https://www.linkedin.com/in/giulianolatini) that helped me in creating and putting this process in production for our team.

> The real question is: can bugs reach develop if we have Pull Requests?

The answer is: **yes**.

While Pull Requests usually helps improving the overall quality, there are lots of problems that does not get caught in a pull request. This lead to a **false sense of security**.

## Root problems of Pull Requests. 

***Lack of context or missing big picture**: in most situation peoples uses the web interface to look at changed file, they can spot problems, but quite often they need to examine the code in a real IDE and maybe run in your local environment.

***Code is not really executed***: in a ideal world, if you want to give green light to a Pull Requests you should execute the code, trying some edge cases, verifying that everything works as expected, then approve it. While we have almost 20k integration and Unit Tests, UI Components are hard to tests, so we can tell that **some part of the code is tested automatically but we need to test manually something.**

***Pull request is for programmers***: this is the major problem, quite often PR are reviewed by developer only, and this seems normal, why someone that is not a programmer want to look at code increment and approve or not? 

> Pull Request is for the team and for stakeholder, people should be able to run the software of the PR in an environment to approve or reject

## Why the software is not executed?

To test code developers should change branch, go to the branch under PR, then run software locally, **the whole process can be tedious, especially because it disrupt local environment**. What about having data that is not compatible because someone is working on another branch? **But the real problem is: a non developer has no way to run PR code in a computer, we need to find a different solution**.

> Running PR code often require IDE, installed libraries, database etc, so it is unfeasible to ask to a non-programmer to run PR code locally.

To mitigate those problems it would be nice if we have a simple way to **press a button and have the code resulting from merge of the target branch and source branch being deployed somewhere, maybe on the local computer**. To achieve this the best way is using Docker or other container technique to create, on demand, an image containing PR code. This allows team member to simply pull the image associated to the PR and create a local deployment or automatically deploy on cloud environment.

Thanks to Azure DevOps this process can be streamlined without any problem. First of all our team started with a build that produces all artifacts needed to run the core of the solution, this runs automatically for develop branch and for master branch, **creating a bunch of .7z files containing deployable code**. We have two of these, producing a couple of services needed.

![Result of standard build](../images/build-complete-unique-host.png)

***Figure 1:*** *Result of standard build*

Ok, from now we proceeded creating some DOCKERFILE to create docker images from the result of these build. Since we are working with .NET 8 it is quite simple because it runs natively on linux and on ARM. Then we created a nice PowerShell script that **download from a private Azure storage account some 7z files with backup of our demo, test or local instances**. These archives are generated automatically and capture the image of an environment (basically is a complete backup for disaster recovery of database and file storage).

In these test dockerfile we add instructions to verify if we mounted a backup in a predefined location, if yes, it will **unpack the archive and run a restore script that restore the environment**.

> Now we have script to backup a live installation, and some dockerfile that starts from build artifacts and have the ability to completely restore a running environment with real data.

## Automate creation of docker images

Thanks to Azure DevOps pipeline, automating the creation of these images is straightforward. First of all the author of docker file can simply

1. Download artifacts from the release build
2. Unpack artifacts on local folder
3. Perform everything locally so he/she can test and fine tune the dockerfile

Once the file is created, it is time to generate a special pipeline **that is automatically triggered from the release build and can generate those docker images**.

The pipeline starts with this code.

{{< highlight yaml "linenos=table,linenostart=1" >}}
trigger: none
pr: none

resources: 

  pipelines:
    - pipeline: UniqueHost
      source: Publish-UniqueHost
      branch: master
      trigger:
        branches:
          include:
            - refs/pull/*/merge
            - master
            - develop

    - pipeline: Proxy
      source: Jarvis.Proxy
      branch: main

{{< / highlight >}}

The important part is that this pipeline starts defining other pipeline as resources. The release pipeline is also used as trigger, so this pipeline starts **whenever the publish-UniqueHost pipeline completes a run in develop, master, and any PR branches**.

Then we can run some bash code to **grab the name of the original pipeline, determined by GitVersion and other informations**. 

{{< highlight yaml "linenos=table,linenostart=1" >}}
          - download: UniqueHost
            artifact: DeployPackage
            displayName: "Download Unique Host Artifacts"
          
          - download: Proxy
            artifact: Jarvis.Proxy
            displayName: "Download Jarvis Proxy Host Artifacts"
          
          - script: |
              echo "PipelineName: $(resources.pipeline.UniqueHost.pipelineName)"
              echo "RunName: $(resources.pipeline.UniqueHost.runName)"
              echo "RunUri: $(resources.pipeline.UniqueHost.runURI)"
              echo "SourceBranch: $(resources.pipeline.UniqueHost.sourceBranch)"
              echo "SourceCommit: $(resources.pipeline.UniqueHost.sourceCommit)"
              runName="$(resources.pipeline.UniqueHost.runName)"
              version="${runName##*- }"
              echo "version is = $version"
              echo "##vso[build.updatebuildnumber]Docker Jarvis Plus Proxy - $version"

              if [[ $version =~ PullRequest([0-9]+) ]]; then
                  pullRequestNumber="${BASH_REMATCH[1]}"
                  version="PR$pullRequestNumber"
                  echo "$version"
              elif [[ $version =~ ([0-9]+\.[0-9]+\.[0-9]+)-alpha ]]; then
                  developNumber="${BASH_REMATCH[1]}"
                  version="$developNumber-develop"
                  echo "$version"
               elif [[ $version =~ ([0-9]+\.[0-9]+\.[0-9]+)-beta ]]; then
                  hotfixNumber="${BASH_REMATCH[1]}"
                  version="$hotfixNumber-hotfix"
                  echo "$version"
              else
                  echo "No Pull Request found in the string."
              fi
              echo "##vso[task.setvariable variable=version;]$version"
{{< / highlight >}}

It seems complicated but it is really simple:

1. A couple of download task will simply download the artifacts of other pipeline defined as resources
2. A bunch of echo are only to demonstrate how we can grab data from the run of other pipelines, the important part is grabbing run version.
3. From run version (created by gitversion) we used some regex to understand the origin branch (PullRequest, alpha and beta) so we can create a meaningful tag for Docker Images
4. Used a special echo with ##vso to set a variable for the pipeline with the version we will use for tag


{{< highlight yaml "linenos=table,linenostart=1" >}}
         - script: |
              7z x "$(Pipeline.Workspace)/UniqueHost/DeployPackage/jarvis.host.7z" -o"$(Build.SourcesDirectory)/Assets/Docker/Jarvis/Jarvis.Host"
              7z x "$(Pipeline.Workspace)/Proxy/Jarvis.Proxy/Jarvis.Proxy.7z" -o"$(Build.SourcesDirectory)/Assets/Docker/Jarvis/Jarvis.Proxy"
            displayName: "Prepare files"
          
          - task: Docker@2
            inputs:
              containerRegistry: 'Nebula'
              command: 'login'
            displayName: 'Login to nebula repository'
          
          - task: Docker@2
            inputs:
              containerRegistry: 'Nebula'
              repository: 'Jarvis'
              command: 'build'
              Dockerfile: '$(Build.SourcesDirectory)/Assets/Docker/Jarvis/Dockerfile'
              tags: '$(Version)'
            displayName: 'Build the image'

          - task: Docker@2
            inputs:
              containerRegistry: 'Nebula'
              repository: 'Jarvis'
              command: 'push'
              tags: '$(Version)'
            displayName: 'Push the image'
{{< / highlight >}}

Finally we unpack the 7z packages, login into the Azure Docker Registry for our company then finally run a Docker@2 task to build the image. Thanks to Azure DevOps in Hosted agents we already have Docker configured to create images. **Finally images are published.**

> In the end we have established a pipeline that create a release and automatically trigger another pipeline that download artifacts from that pipeline and create docker images with a correct tag depending on branch built.

At the end of the process we have Docker Images automatically created for special branches (develop) and for PR branches.

## Wire everything together

Ok now we need a last piece of the puzzle: **how a person can request the creation of a Docker image for a Pull Request?** This requirement is needed because we do not want to create an image for all Pull Requests, some of the PR are small and there is no need to execute them. The result is: Azure DevOps repository branch policies.

Now simply add the **Original publish branch as Optional Check and Manual Run**. This will make this pipeline not required to close the Pull Request, but if someone wants, he/she can simply request this pipeline to run directly from the PR page.

![Policy configuration to add an optional release build](../images/branch-policy-publish.png)

***Figure 2:*** *Policy configuration to add an optional release build*

Here is how a branch can allow the trigger the creation of Docker Images on that PR. **Remember that the build will build the PR code once merged with the target branch, so you are really creating an image of the code that will result from closing of the Pull Request**. This is important because develop can contains code that can interact with PR code, so it is needed to test the merge of both branches.

![Optional Check in a Pull request](../images/docker-optional-check.png)

***Figure 3:*** *Optional Check in a Pull request*

As you can see in Figure 3 we have a standard Pull Request pipeline that runs and it is green, but we have **one check not run so we can request a manual run**. Clicking on View 2 Checks opens the list of the checks where you can request a run of the pipeline that create the build.

![You can simply queue the pipeline that create release package and then trigger Docker image creation pipeline](../images/manual-queue-build.png)

***Figure 4:*** *You can simply queue the pipeline that create release package, at the end it will trigger automatically Docker image creation pipeline*

Just wait a little bit and the you will find corresponding images into your Azure Docker Registry.

![Docker images automatically created](../images/docker-images.png)

***Figure 5:*** *Docker images automatically created*

As you can see we have two images for two Pull Request then an image for the develop branch and one for the master branch.

> Thanks to Azure DevOps pipeline you can automate the whole process of build and create Docker Images from a Pull Request, creating Docker Images that contains the result of merge of PR branch with target branch.

Now we can simply run a PowerShell script to have a version of the software running in our computer with some test data just installing Docker Desktop. This gives the ability to everyone in the team to Run Pull Request code and being able to test for edge cases, security or simply **evaluating if the new feature is really good to be closed in the target branch**.

And again this demonstrate the flexibility of Azure DevOps and the great feature it offers to keep your code quality to the max. 

Gian Maria.
