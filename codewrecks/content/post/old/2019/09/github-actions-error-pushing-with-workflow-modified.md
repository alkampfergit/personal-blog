---
title: "GitHub Actions Error pushing with workflow modified"
description: ""
date: 2019-09-26T16:00:37+02:00
draft: false
tags: [GitHub Actions]
categories: [GitHub]
---
After creating a workflow for GitHub Action, if you try to modify the workflow locally then push to GitHub you can incur in strange error.

> refusing to allow an integration to create or update.github/workflows/ci.yml

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-32.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-32.png)

 ***Figure 1***: *Error in pushing to Git Repository*

The reason seems to be a different permission in auth token used for authentication, then to solve the problem you need to clear credentials then try again the operation. In Windows you need to [use Credential Manager](http://www.codewrecks.com/blog/index.php/2015/06/23/git-for-windows-getting-invalid-username-or-password-with-wincred/) as I described in that old post. Just delete every entry for GitHub, then try to push again, you will be asked again for credentials and then you should be able to push.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-33.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-33.png)

 ***Figure 2***: *I got the error, then clear credentials in Credential Manager, finally I was able to push again.*

Let me know if you still have the error.

Gian Maria.
