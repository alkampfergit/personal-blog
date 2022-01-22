---
title: "Choose environment from branch in GitHub action"
description: "In a GitHub action you can have the need to choose the environment to use based on current branch, here is how you can do it."
date: 2021-08-18T08:00:00+02:00
draft: false
tags: ["GitHub"]
categories: ["security"]
---

I have a friend that asked me how to **choose an [enviroment](https://docs.github.com/en/actions/reference/environments) in a GitHub action based on the branch that triggered the action**. Usually Environments are used in a sort of Promotion mechanism, where you start deploying on Test, then you have a manual or automatic approval to deploy on staging and finally to production. Even if this is a textbook scenario **sometimes you need to create a simple sequence of steps to deploy your software in an environment and you want to choose environment based on branch**. If you deploy master you deploy on production, if you deploy develop you deploy test. 

> Choosing environment based on branch is a quite common strategy in continuos deployment of small project.

The goal is **having a single Workflow file and, most important, having a single sequence of steps to deploy the application**, so you need to be able to choose the environment at run time based on branch name. The critical part of this action is that you need to create at least two jobs, **the first will use bash (or PowerShell or whathever) to determine the name of the environment, while the second job will use that information to choose the environment**.

> Each job can have an environment assigned to it, if that information is parametric you need at least another job to determine environment name.

Here is how I defined the job that uses the environment to perform a deploy, as you can see **the name of the environment is a parameter**, based on a variable that belongs to another job.

{{< highlight yaml "linenos=table,linenostart=1" >}}
  release:
    needs: [build]
    name: Release some stuff 
    runs-on: ubuntu-latest
    environment: 
      name: ${{ needs.build.outputs.env_name }}
{{< /highlight >}}

If you look closely, in **line 6** we are specifying the name of the environment with a special syntax. It starts with needs to indicate that the variable does not belongs to this job but belongs to some needs, then you need to specify the name of the other job (in this example is called build) followed by the outputs keyword and the name of the output variable to reference. The whole syntax works because the **build jobs will export a variable called env_name to be consumed by dependant jobs**. It is of uttermost importance that you specify the other job as need (**line 2**)

> Since each jobs runs in a different container, to be able to pass data between jobs, each jobs should export variables explictly

With multiple jobos you cannot work with environment variables, remember that each job runs **in a different container, so every environment variable that you define in a job is not present when another job runs**. The correct solution is to define a variable using GitHub Action own syntax, then export the variable outside the job to be used in all jobs that depends on the current one. Here is the code.

{{< highlight yaml "linenos=table,linenostart=1" >}}
      - name: Some check on branch
        id: branch_check
        run: |
          echo "Running on branch ${{ github.ref }}"
          if [ "${{ github.ref }}" = "refs/heads/master" ]; then
            echo "::set-output name=env_name::Production"
          elif [ "${{ github.ref }}" = "refs/heads/develop" ]; then
            echo "::set-output name=env_name::Test"
          else
             echo "::set-output name=env_name::Features"
          fi         
          
      - name: Use variable setup in previous step
        run: echo "I'm using variable ${{ steps.branch_check.outputs.env_name }}"
        
    outputs:
      env_name: ${{ steps.branch_check.outputs.env_name }}
{{< /highlight >}}

Build job is really simple, first of all it will use some bash to set the value of the **env_name variable using the ::set-output command**. You can find [all avaliable command directly in the documentation](https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions). The ::set-output command is used to  set a value in a variable that can be used in subsequent steps with the syntax 

*${{ steps.**id_of_the_step**.outputs.**variable_name** }}*"

You need to remember that the **value of the variable is available only in the jobs where the command runs**. If you look at the snippet you can see that the line 14 is using the value of the output variable with the above syntax, but this is valid only for steps in the same job.

> All variables values are not automatically transferred between jobs.

If you want a variable to be available to other jobs **you need to specify an output section (line 16) where you can export variables/values outside the job**. In the above example I'm using the same env_name value, but you can change the name if you like. Line 17 is simply declaring **that this job will export a env_name variable whose value is the same of the env_name variable of the step branch_check**.

The whole example is in the project [ActionsPlayground](https://github.com/alkampfergit/ActionsPlayground). If you look at **Figure 1** you can see the result of a run in master branch.

![Run result on master branch](../images/action-run-on-master.png)

***Figure 1:*** *Run result on master branch*.

Since the run is done on master branch, I can check the log to verify that everything is correct and I'm deploying on the Production environment. In **Figure 2** you can verify that the **bash step correctly identified master branch and the value of env_name variable is Production.**

![Since the run was triggered by master branch, environment name is Production](../images/output-of-branch-check-step.png)

***Figure 2:*** *Since the run was triggered by master branch, environment name is Production*.

To verify that I'm indeed using the correct environment I've dumped a value of a secret defined in environment in base64 (if you try to output raw value it will be removed from the infrastructure). In **Figure 3** you can see the result.

![Dump of a secret in base64 format](../images/output-of-environment-production-job.png)

***Figure 3:*** *Dump of a secret in base64 format*.

A quick verify with CyberChef will confirm that  the value of the secret is taken from the correct environment.

![Cyber chef verification of secret value](../images/cyber-chef-output.png)

***Figure 4:*** *Cyber chef verification of secret value*.

To recap we

1. Created a bash script that will set a variable with the environment we want to use
2. Exported that variable from the job
3. Create the real deploy job that depend via needs to the previous job
4. Parametrize the environment name using the variable exported from previous job.

And the game is done.

Gian Maria.