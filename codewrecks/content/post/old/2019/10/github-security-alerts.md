---
title: "GitHub security Alerts"
description: ""
date: 2019-10-22T16:00:37+02:00
draft: false
tags: [Github,Security]
categories: [GitHub]
---
I really love everything about security and I’m really intrigued by GitHub security tab that is now present on you repository. In your project usually it is disabled by default.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-44.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-44.png)

 ***Figure 1***: *GitHub Security tab on your repository*

 **If you enable it you start receiving suggestion based on code that you check in on the repository** , as an example, GitHub will scan your npm packages source to find dependencies with libraries that are insecure.

When GitHub found something that require your attention, it will put a nice warning header on your project, so the alert cannot really pass unnoticed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-45.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-45.png)

 ***Figure 2***: *Security alert warning banner*

If you go to the security tab you got a detailed list of the analysis, so you can put a remediation plan in motion, or you can simply dismiss if you believe that you can live with them.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-46.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-46.png)

 ***Figure 3***: *Summary of security issues for the repository*

 **Clearly you can click on any issue to have a detailed description of the vulnerability,** so you can decide if you are going to fix it or simple dismiss because that issue is not relevant to you or you cannot in anyway bypass the problem.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-47.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-47.png)

 ***Figure 4***: *Detailed report of security issue*

If you noticed in  **Figure 4** , you have also a nice button “Create Automated Security Fix” in the upper right part of the page, this means that  **not only GitHub is telling me where the vulnerability is, it sometimes can fix the code for me.** Pressing the button will simply create a new Pull Request to fix that error, how nice.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-48.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-48.png)

 ***Figure 5***: *Pull request with the fix for the security issue*

In this specific situation it is simply a vulnerable package that is donwloaded by npm install, the change is simply bumping a library to a version that removed this vulnerability.

> Actually GitHub perform a security scan on project dependencies and can present a remediation simply with nice pull requests

 **Using Pull request is really nice, really in the spirit of GitHub.** The overall experience is really nice, the only annoying stuff is that actually the analysis seems to be done on master branch and  **proposed solution creates pull requests for master branch.** While this is perfectly fine, the only problem I have is that, closing that pull request from the UI, it will merge this commit on the master branch, effectively bypassing GitFlow flow.

 **Since I’m a big fan of command line, I prefer to close that Pull request manually, so I simply issue a fetch, identify the new branch (it has annoying long name ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/wlEmoticon-smile-1.png)) and simply checkout it as an hotfix branch** {{< highlight bash "linenos=table,linenostart=1" >}}


$ git checkout -b hotfix/0.3.1 remotes/origin/dependabot/npm_and_yarn/CoreBasicSample/src/MyWonderfulApp.Service/UI/tar-2.2.2
Switched to a new branch 'hotfix/0.3.1'
Branch 'hotfix/0.3.1' set up to track remote branch 'dependabot/npm_and_yarn/CoreBasicSample/src/MyWonderfulApp.Service/UI/tar-2.2.2' from 'origin'.

{{< / highlight >}}

With this commands I **simply checkout the remote branch as hotfix/0.3.1, so I can simply issue a git flow hotfix finish and pushing everything back to the repository.** > If you have a specific flow for hotfixes, like GitFlow, it is quite easy closing Pull Requests locally, following your process, GitHub will automatically detect that the PR is closed after the push.

Now branch is correctly merged

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-49.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-49.png)

 ***Figure 6***: *Pull request manually merged.*

If you really like this process, you can simply ask GitHub to automatically create pull requests without your intervention. As soon as a security fix is present, a PR will be created.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-50.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-50.png)

 ***Figure 7***: *You can ask to receive automated pull request for all vulnerabilities*

Et voilà, it is raining pull requests

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-51.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-51.png)

 ***Figure 8***: *A series of Pull requests made to resolve security risks*

This raise another little issue, we have a single PR for each vulnerability, so,  **if I want to apply all of them in a unique big hotfix, I only need to manually start the hotfix, then fetch all those branches from the repo and finally cherry-pick all the commits.** This operation is easy because each Pull Request contains a single commit that fixes a single vulnerability issue. Sequence of command is:

{{< highlight bash "linenos=table,linenostart=1" >}}


git flow hotifx start 0.3.2
git cherry-pick commit1
git cherry-pick commit2
git cherry-pick commit3
git flow hotfix finish

{{< / highlight >}}

Final result is an hotfix resulted from cherry-picking of three distinct PR.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-52.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-52.png)

 ***Figure 9***: *Three of pull requests were closed using simple cherry-pick*

 **GitHub is really good in understanding that I’ve cherry-picked all commits in yellow from pull requests, because all pull requests were automatically closed after the push.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-53.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-53.png)

 ***Figure 10***: *My pull requests are correctly closed even if I cherry-picked all commits manually.*

Actually this functionality is really nice, in this simple repository I have really few lines of code but it helped me revealing some npm dependencies with vulnerabilities and, most important, it gave me the solution so I can immediately put a remediation in place.

Gian Maria.
