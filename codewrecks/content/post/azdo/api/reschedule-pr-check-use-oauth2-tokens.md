---
title: "More secure Azure DevOps Pipelines API connection thanks to OAuth Tokens"
description: "Learn how to enhance the security of your Azure DevOps Pipelines by using OAuth tokens instead of Personal Access Tokens to access service REST API from scripts. This approach avoids the need to store sensitive information, reduces manual intervention for token renewals, and minimizes the risk of token exposure."
date: 2023-03-19T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["AzureDevOps", "pipelines", "security"]
---

In a previous blog post, I discussed how to reschedule the check of a pull request using a simple PowerShell script within an Azure DevOps pipeline. This time, **I'll explain how to avoid using Personal Access Tokens for authentication** and switch to a more secure alternative.

The issue with Personal Access Tokens is that they are bearer token, which means **if they're lost or accidentally leaked in logs, anyone with access to the token can use it to access your services**. To address this problem, it's better to use a specific Personal Access Token with the minimum required scopes. For instance, if you only need to reschedule Pull Requests checks, grant the token only pull request and build access. This limits the potential damage if the token falls into the wrong hands.

> You should always give the minimum required permissions to a token as a security general best practice.

However, a more significant concern arises when setting a long duration for the token. When used in automated pipelines, **you don't want to update the token definition every month or couple of months**. Often, a one-year validity is chosen, which increases the risk if the token is lost.

A better way to authenticate to your Azure DevOps services during a pipeline is to use OAuth tokens. Since the agent is already authenticated, it has access to special OAuth tokens to communicate with the service. Azure DevOps automatically handles these tokens, eliminating the need for manual intervention or renewal.

![Giving script access to OAuth2 token of the pipeline](../images/pipeline-oauth2token.png)

***Figure 1***: *Giving script access to OAuth2 token of the pipeline*

In the agent options, you can enable scripts to access the OAuth token by selecting a specific checkbox. This allows **every script running within the job to use a special pipeline variable containing the current OAuth2 access token** valid for the pipeline run.

To implement this, modify your script to use the OAuth token in the request header, which differs slightly from using a Personal Access Token. The OAuth2 token is a standard bearer token and can be inserted into a special header called "Authorization."

{{< highlight powershell "linenos=table,linenostart=1" >}}
$headers = @{
    "Authorization" = "Bearer $(System.AccessToken)"
    "Content-Type" = "application/json"
}

{{< / highlight >}}

> Thanks to option in Figure 1 the script can access the OAuth token with the variable $(System.AccessToken)

The rest of the script remains unchanged, as it assumes authentication headers are created once at the beginning. Every request made to the Azure DevOps REST API is authenticated with this header, so simply changing the header to use an OAuth 2 token will suffice.

This approach has two key advantages:

There's no need to store personal information, **as the OAuth token is generated for each pipeline run and has a short lifespan**.
Since the OAuth token is managed by the infrastructure, you won't need to update your Personal Access Token manually. The pipeline will always access the REST API with a new OAuth token generated for the specific run, eliminating the risk of build failures due to expired Personal Access Tokens.

Further Reading:
[Use Predefined Variables in Azure DevOps Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml)
[Which are the permissions of OAuth2 token used by Azure DevOps Pipelines?](https://developercommunity.visualstudio.com/t/what-is-the-scope-of-the-token-in-systemaccesstoke/618929)

Happy Azure DevOps.