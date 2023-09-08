---
title: "Azure DevOps: delete all unstable version of packages in feeds"
description: "If you automatically publish packages with pipeline at each check-in you will end in a package feed full of not-used versions. In this post I'll explain how to use REST API to delete all unstable versions of packages older than a cercaion threshold from a feed."
date: 2023-09-08T08:00:00+02:00
draft: false
tags: ["AzureDevOps", "REST Api"]
categories: ["AzureDevOps"]
---

Azure DevOps has a dedicated section for artifacts that allows you to store NuGet, NPM feeds, and more. Thanks to its integration with pipelines, very often, automatic pipelines are generated that **publish packages with every commit in the repository**. This way, we have the opportunity to have all versions for all dev branches. 

This approach is needed because the usual flow when you develop a new feature in a package is the following:

- Perform unit tests.
- Publish the package.
- Reference the unstable version of the package for the software that will use the new features.
- Finally, if everything is okay, close the package and create a stable version.

You usually starts with a downnstream software that **needs a new feature in a package it uses**. Thus you starts creating a new feature branch in that package, write unit test and the new feature and **you then need to test that specific feature with the software that will use it**. In this scenario it is convenient to have each commit to generate an unique version of the package (thanks to GitVersion) so the user project can reference some unstable version like x.y.z-featureA..00000

The problem with this approach is that our package repository contains an incredible number of versions, **most of which are unused.**

In the case of small NuGet packages, the occupied space is negligible. However, if we start producing packages with rather large artifacts, **it's also possible to use more space than the free space offered by Azure DevOps, leading to paying for space that is honestly wasted.**

In these scenarios, using APIs allows you to write simple PowerShell scripts that can clean up and save space

In the first part of this script, we will simply create the headers with authentication to communicate with the server. For security reasons, it is advisable that the personal access token you will generate has only the necessary permissions to manage the artifacts portion.

![Reduce scope of the token to minimize the risk of token exposure](../images/token-scope.png)
***Figure 1***: *Reduce scope of the token to minimize the risk of token exposure*

Whenever you generate an access token to be used in some script, you will need to think where that token will be saved. **It is really a good approach limiting the token to only the scope you need**, becuase usually you will store that token in some server that will schedule the execution of the script, so you need to minimize the exposure in the situation where the token is compromised.

Once you have a valid token you starts the script **creating the headers to perform calls to the API with that auth token**.

{{< highlight powershell "linenos=table,linenostart=1" >}}

$personalAccessToken = "put-your-token-here"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f "", $personalAccessToken)))
$headers = @{Authorization = ("Basic {0}" -f $base64AuthInfo) }

{{< /highlight >}}

At this point, it is necessary to gather some basic information: **the list of all the packages included in this build and general information regarding the feed**. In the following example, the URLs are based on a global package, meaning a package that is not part of a specific team project. You can then update them accordingly if you need to access a package from a specific team project. In this case, simply add the name of the team project to the URL.

Documentation can be found [Here](https://learn.microsoft.com/en-us/rest/api/azure/devops/artifactspackagetypes/nuget?view=azure-devops-rest-7.0)

{{< highlight powershell "linenos=table,linenostart=1" >}}

$feed = Invoke-RestMethod -Uri "https://feeds.dev.azure.com/{ORGANIZATION}/_apis/packaging/Feeds/{FEEDNAME}" -Method Get -Headers $headers
$feedUrl = "https://feeds.dev.azure.com/prxm/_apis/packaging/Feeds/Proximo/packages?api-version=7.0"
$packages = Invoke-RestMethod -Uri $feedUrl -Method Get -Headers $headers

{{< /highlight >}}

Now you have both feeds detail in $feedUrl variable as well as packages details in $packages variable. All you need to do is **retrieve all versions for each package, check upload date, verify if it is already deleted, and if it is not deleted but expired delete it**. 

{{< highlight powershell "linenos=table,linenostart=1" >}}


foreach ($package in $packages.value) {
    $packageName = $package.name
    Write-Host "Package: $($package.name) found with id $($package.id)"
    $feedUrl = $package._links.versions.href
    $versions = Invoke-RestMethod -Uri $feedUrl -Method Get -Headers $headers
    foreach ($version in $versions.value) {
        if ($version.version -match '-') {
            # $versionUrl = "$feedUrl/$packageName/$version"
            # $versionInfo = Invoke-RestMethod -Uri $versionUrl -Method Get -Headers $headers
            Write-Host "Package: $($packageName) ID : $($package.id), Version: $($version.version), Upload Date: $($version.publishDate) deleted $($version.isDeleted)"

            # If the package is deleted just skip
            if ($version.isDeleted) {
                Write-Host "Skip already deleted package $($packageName) Version: $($version.version), Upload Date: $($version.publishDate)"
                continue
            }
            # If the upload date is older than 30 days we can delete it
            if ($version.publishDate -lt (Get-Date).AddDays(-30)) {
                Write-Host "Deleting package $($packageName) ID : $($package.id), Version: $($version.version), Upload Date: $($version.publishDate)"
                $deleteUrl = "https://pkgs.dev.azure.com/{ORGID}/_apis/packaging/feeds/$($feed.id)/nuget/packages/$packageName/versions/$($version.version)?api-version=7.0"
                Invoke-RestMethod -Uri $deleteUrl -Method Delete -Headers $headers
            }
        }
    }
}
    
{{< /highlight >}}

To identify non stable packages you can simply check for '-' char in version. All packages that are not stable will have a version with a dash in it. **Actually I never want to remove a stable packages, because they always need to be kept in the feed**.

As you can see, automating these maintenance tasks in Azure DevOps is quite trivial thanks to REST api. A simple PowerShell script can easily clean up your feed from all the packages that are not used anymore.

> All deleted versions will be still listed in the feed and marked as deleted.

When you delete packages they will go into the Recycle Bin, when the **recycle bin is empty that version was deleted from the server**. If you look at all versions of a package you will see that deleted versions are still listed and marked as deleted. This happens because once a version was published **you should never be able to publish a different binary package with that specific version**. To ennforce this rule, Azure DevOps feed will mark the version as delete so you are unable to publish a different binary version of the package with the very same veresion.

Gian Maria.