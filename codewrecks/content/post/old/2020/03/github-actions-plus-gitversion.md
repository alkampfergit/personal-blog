---
title: "Release software with GitHub actions and GitVersion"
description: ""
date: 2020-03-22T10:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
One of the nice aspect of GitHub actions is that you can automate stuff simply with command line tools.  **If you want to do continuous release of your software and you want to use GitVersion tool to determine a unique SemVer version** from the history, here is the sequence of steps.

1) Iinstall/update gitversion tool with commandline tools  
2) Run GitVersio to determine SemVer numbers  
3) Issue a standard build/test using SemVerNumbers of step 2  
4) If tests are ok, use dotnet publish command (with SemVer numbers) to publish software  
5) Zip and upload publish result  
6) It the branch is Master publish a GitHub release of your software.

> Automating your CI pipeline using only CommandLine tools makes your build not dependent on the Engine you are using.

I’ve done such small exercise on a public project you can found here ([https://github.com/AlkampferOpenSource/StupidFirewallManager](https://github.com/AlkampferOpenSource/StupidFirewallManager "https://github.com/AlkampferOpenSource/StupidFirewallManager")) and it is composed by two command line tools, one is server version the other is the client.

Complete workflow definition can be found here ([https://github.com/AlkampferOpenSource/StupidFirewallManager/blob/master/.github/workflows/dotnetcore.yml](https://github.com/AlkampferOpenSource/StupidFirewallManager/blob/master/.github/workflows/dotnetcore.yml "https://github.com/AlkampferOpenSource/StupidFirewallManager/blob/master/.github/workflows/dotnetcore.yml")).

In this example I’m simply using some open source tasks to automate the whole process with GitHub Actions.  **The first step is being sure that right version of DotNetCore Sdk is used, and that GitVersion tool is installed.** {{< highlight yaml "linenos=table,linenostart=1" >}}


    steps:
    - uses: actions/checkout@v1
    - name: Fetch all history for all tags and branches
      run: git fetch --prune
    - name: Setup.NET Core
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: '5.0.100-preview.1.20155.7'  

    - name: Install GitVersion
      uses: gittools/actions/gitversion/setup@v0.9
      with:
          versionSpec: '5.1.x'

{{< / highlight >}}

The cool part is that I do not need to have anything preinstalled on the machine that runs the action, everything will be downloaded and installed by action definition. In this specific example my software is build with a pre-release of.NET Sdk (5.0.100-preview), a tooling that probably is not preinstalled in the action machine, but thanks to the capability of GitHub actions I can simply require installation on the fly before compiling everything.

> Being able to install required toolchain directly from Action definition allows you to run your action on public available GitHub agents.

Point 2 is achieved simply running GitVersion tool (installed from point 1) with a dedicated action.  **Another cool part of GitHub action is that you can simply refer custom action directly from your definition, no need to install anything.** {{< highlight yaml "linenos=table,linenostart=1" >}}


- name: Use GitVersion
      id: gitversion # step id used as reference for output values
      uses: gittools/actions/gitversion/execute@v0.9
    - run: |
        echo "Major: ${{ steps.gitversion.outputs.major }}"
        echo "Minor: ${{ steps.gitversion.outputs.minor }}"
        echo "Patch: ${{ steps.gitversion.outputs.patch }}"
        echo "PreReleaseTag: ${{ steps.gitversion.outputs.preReleaseTag }}"
        echo "PreReleaseTagWithDash: ${{ steps.gitversion.outputs.preReleaseTagWithDash }}"
        echo "PreReleaseLabel: ${{ steps.gitversion.outputs.preReleaseLabel }}"
        echo "PreReleaseNumber: ${{ steps.gitversion.outputs.preReleaseNumber }}"
        echo "WeightedPreReleaseNumber: ${{ steps.gitversion.outputs.weightedPreReleaseNumber }}"
        echo "BuildMetaData: ${{ steps.gitversion.outputs.buildMetaData }}"
        echo "BuildMetaDataPadded: ${{ steps.gitversion.outputs.buildMetaDataPadded }}"
        echo "FullBuildMetaData: ${{ steps.gitversion.outputs.fullBuildMetaData }}"
        echo "MajorMinorPatch: ${{ steps.gitversion.outputs.majorMinorPatch }}"
        echo "SemVer: ${{ steps.gitversion.outputs.semVer }}"
        echo "LegacySemVer: ${{ steps.gitversion.outputs.legacySemVer }}"
        echo "LegacySemVerPadded: ${{ steps.gitversion.outputs.legacySemVerPadded }}"
        echo "AssemblySemVer: ${{ steps.gitversion.outputs.assemblySemVer }}"
        echo "AssemblySemFileVer: ${{ steps.gitversion.outputs.assemblySemFileVer }}"
        echo "FullSemVer: ${{ steps.gitversion.outputs.fullSemVer }}"
        echo "InformationalVersion: ${{ steps.gitversion.outputs.informationalVersion }}"
        echo "BranchName: ${{ steps.gitversion.outputs.branchName }}"
        echo "Sha: ${{ steps.gitversion.outputs.sha }}"
        echo "ShortSha: ${{ steps.gitversion.outputs.shortSha }}"
        echo "NuGetVersionV2: ${{ steps.gitversion.outputs.nuGetVersionV2 }}"
        echo "NuGetVersion: ${{ steps.gitversion.outputs.nuGetVersion }}"
        echo "NuGetPreReleaseTagV2: ${{ steps.gitversion.outputs.nuGetPreReleaseTagV2 }}"
        echo "NuGetPreReleaseTag: ${{ steps.gitversion.outputs.nuGetPreReleaseTag }}"
        echo "VersionSourceSha: ${{ steps.gitversion.outputs.versionSourceSha }}"
        echo "CommitsSinceVersionSource: ${{ steps.gitversion.outputs.commitsSinceVersionSource }}"
        echo "CommitsSinceVersionSourcePadded: ${{ steps.gitversion.outputs.commitsSinceVersionSourcePadded }}"
        echo "CommitDate: ${{ steps.gitversion.outputs.commitDate }}"

{{< / highlight >}}

Point 3 requires only a run of dotnet restore followed by a dotnet test, to verify that code compiles and all tests are green.

{{< highlight yaml "linenos=table,linenostart=1" >}}


    - name: Restore nuget with dotnet
      run: dotnet restore src/StupidFirewallManager.sln
    - name: dotnet tests
      run: dotnet test src/StupidFirewallManager.sln /p:AssemblyVersion=${{ steps.gitversion.outputs.assemblySemFileVer }} /p:FileVersion=${{ steps.gitversion.outputs.assemblySemFileVer }} /p:InformationalVersion=${{ steps.gitversion.outputs.Sha }}

{{< / highlight >}}

A special mention is made to dotnet test parameters, where I **specified AssemblyVersion, FileVersion and InformationalVersion directly from command line, using the SemVer number of GitVersion as assembly and file version, but full SHA for informational version.** You have various method to choose version number of the software during build phase,  **with full Framework you are forced to modify attributes in AssemblyInfo.cs (or AssemblyInfo.vb) before issuing the build.** That options is available in GitVersion with UpdateAssemblyInfo options, but it is really clumsy because it does not gave you the ability to [choose exactly what number goes in InformationalVersion](https://gitversion.readthedocs.io/en/latest/input/docs/usage/command-line/), that, in my opinion, is most important of all the three. This is why in the past I’ve always use a PowerShell version to update AssemblyInfo.cs.

To be fair, GitVersion does an excellent work in updating AssemblyInfo.cs, but I’ve found a couple of problems, the first is that it actually only Updates the attributes, so you should not forget to insert an AssemblyInformationalVersion in your source code. The second problem is that  **it uses a too long name for that value, something like 0.5.0-alpha.11+Branch.develop.Sha.21fa38932256d7b64661e6363982dda39eb48b23. While it contains the Sha of the repository, that in my opinion is the most important value, it should be at first position of the string** , due to limiting space you have when you look at file property in windows ( **Figure 5** ).

> Using full Git Sha as informational version gives you the exact version of the code used to produce that artifacts. No way to alter the code and have the same Git Sha makes that number really important and usually it is the only information you need as Informational Version.

Points 4 and 5 are a simple set of Publish/compress/upload artifacts steps, made easy by the presence of 7zip in all machines (thanks [Giulio](http://blog.casavian.eu/) for pointing me in the right direction).

{{< highlight yaml "linenos=table,linenostart=1" >}}


    - name: dotnet publish server
      run: dotnet publish src/StupidFirewallManager/StupidFirewallManager.csproj --configuration release /p:AssemblyVersion=${{ steps.gitversion.outputs.assemblySemFileVer }} /p:FileVersion=${{ steps.gitversion.outputs.assemblySemFileVer }} /p:InformationalVersion=${{ steps.gitversion.outputs.Sha }}

    - name: dotnet publish client
      run: dotnet publish src/StupidFirewallManager.Client/StupidFirewallManager.Client.csproj --configuration release /p:AssemblyVersion=${{ steps.gitversion.outputs.assemblySemFileVer }} /p:FileVersion=${{ steps.gitversion.outputs.assemblySemFileVer }} /p:InformationalVersion=${{ steps.gitversion.outputs.Sha }}
    - name: 7Zip client
      run: 7z a -t7z -mx=9 client.7z./src/StupidFirewallManager.Client/bin/release/netcoreapp5.0/publish/
    - name: 7Zip server
      run: 7z a -t7z -mx=9 server.7z./src/StupidFirewallManager/bin/release/netcoreapp5.0/publish/

    - uses: actions/upload-artifact@v1
      with:
        name: "StupidFirewallManagerServer-${{ steps.gitversion.outputs.fullSemVer }}"
        path: server.7z

    - uses: actions/upload-artifact@v1
      with:
        name: "StupidFirewallManagerClient-${{ steps.gitversion.outputs.fullSemVer }}"
        path: client.7z

{{< / highlight >}}

I’ve chosen to always create 7zip file with the same name (client.7z and server.7z) but  **when it is time to upload to pipeline as artifacts, it is nice to change name and give a full SemVer number.** As you can verify, since we are in.NET Core, I was able to specify Assembly, File and Informational version directly in command line, without any need to have attributes in AssemblyInfo.cs files. An approach that I really like and prefer (no file to search and modify before the build).

In  **Figure 1** you can finally find how the artifacts are named in Action run summary page.

[![Artifacts uploaded by action run, you can notice the full semver.](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-24.png "Artifacts")](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-24.png)

 ***Figure 1***: *Artifacts uploaded by action run, you can notice the full semver.*

 **For final step (release) I’ve chosen to use a custom action to publish file on GitHub release and to automatically create release if no one with that name was created**. I know that there are now official actions (from GitHub team) but this custom action worked perfectly in the past and it is still perfectly working today, so why change.

{{< highlight yaml "linenos=table,linenostart=1" >}}


    - name: Upload server binaries to release
      if: contains(github.ref, 'master')
      uses: svenstaro/upload-release-action@v1-release
      with:
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        file: server.7z
        asset_name: Server.7z
        tag: "${{ steps.gitversion.outputs.fullSemVer }}"
        overwrite: true
    - name: Upload client binaries to release
      if: contains(github.ref, 'master')
      uses: svenstaro/upload-release-action@v1-release
      with:
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        file: client.7z
        asset_name: Client.7z
        tag: "${{ steps.gitversion.outputs.fullSemVer }}"
        overwrite: true

{{< / highlight >}}

The only peculiarity of these two steps  **is the if clause, that allows me to ask Action engine to run this step only if the the ref is master**. If you look at execution steps of a branch different from master, those two steps are not executed.

[![Action ran on branch different from master, upload release steps are skipped](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image3_thumb.png "ACtion ran on non master branch")](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image3.png)

 ***Figure 2***: *Action ran on branch different from master, upload release steps are skipped*

If you instead look at logs from an execution of master branch, the two steps are executed. As usual the name of the release is taken from SemVer numbers returned by GitVersion.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image6_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image6.png)

 ***Figure 3***: *Publish artifacts to a standard GitHub release output*

After the action ran on master, you should see a brand new release of your Repository, containing not only source code, but also published artifacts. As you can see,  **I’ve decided to upload artifacts with current name (server.7z and client.7z) because number was already present in Release Number** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image9_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image9.png)

 ***Figure 4***: *Release created by action run for branch master.*

> You can choose to release whatever branch you like, usually you release hotfix, release and master branch, but you can always grab the artifacts directly from action run output, so I’ve opted to create a real release only from master and stable version.

As final check you should download the release and  **verify that AssemblyVersion, FileVersion and InformationalVersion were correctly set in the assembly**. As you can see in  **Figure 5** my released software was correctly marked with the correct version.

[![Versioning of the assembly is present and correct](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image12_thumb.png "Versioning check")](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image12.png)

 ***Figure 5***: *Versioning of the assembly is present and correct*

This last check is especially important, not only for software that will be release with Nuget Packages, but also for executable, because **it can immediately tells you the exact version and the exact source code that was used to compile that specific version of the software.** Gian Maria.
