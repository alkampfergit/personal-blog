---
title: "Run code coverage for Python project with Azure DevOps"
description: ""
date: 2018-11-20T17:00:37+02:00
draft: false
tags: [Azure Devops,build,Python]
categories: [Azure DevOps]
---
Creating a [simple build that runs Python tests written with PyTest](http://www.codewrecks.com/blog/index.php/2018/11/12/run-python-test-with-azure-devops-pipeline/) framework is really simple, but now  **the next step is trying to have code coverage**. Even if I’m pretty new to Python, having code coverage in a build is really simple, thanks to a specific task that comes out-of-the-box with Azure DevOps: Publish Code Coverage.

> In Azure DevOps you can create build with Web Editor or with simple YAML file, I prefer YAML but since I’ve demonstrated in the old post YAML build for Python, now I’m creating a simple build with standard Web Editor

Instead of creating a Yaml Build, this time I’m going to demonstrate a classic build: here is the core part of the build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-1.png)

 ***Figure 1***: *Core build to run tests and have code coverage uploaded to Azure DevOps*

As you can see, I decided to run test with a Bash script running on Linux, here is the task configuration where  **I’ve added Pytest options to have code coverage during test run.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-2.png)

 **Figure2:** *Configuration of Bash script to run Pytests*

The task is configured to run an inline script (1), command line (2) contains –cov options to specify Python modules I want to monitor for code coverage, then a couple of –cov-report options to have output in xml and HTML format. Finally I’ve specified the subfolder that contains the module I want to test (3) and finally I’ve configured the task con Continue on Error (4), so if some of the tests fails the build will be marked as Partially failed.

> Thanks to Pytest running code coverage is just a matter of adding some options to command line

After a build finished  **you can find in the output how Pytest generates Code Coverage reporting, it create a file called coverage.xml then an entire directory called htmlcov that contains a report for code coverage**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-3.png)

 ***Figure 3***: *Result of running tests with code coverage.*

If you look at F **igure 1** you can see that the build final task is a Publish Code Coverage Task, whose duty is to grab output of the Pytest run and upload to the server. Configuration is really simple, you need to choose Cobertura as Code coverage tool (the format used by Pytest) and the output of test run. Looking at output of  **Figure 3**  **you can double check that the summary file is called coverage.xml and all the report directory is in htmlcov subdirectory**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-4.png)

 ***Figure 4***: *Configuration for Publish Code Coverage task.*

Once you run the build, you can find Code Coverage result on the summary page, as well as Code Coverage Report published as Build artifacts, **the whole configuration will take you no more than 10 minutes.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-5.png)

 ***Figure 5***: *Artifacts containing code coverage reports as well as code coverage percentage are accessible from Build Summary page.*

Finally you have also a dedicated tab for Code Coverage, showing the HTML summary of the report

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-6.png)

 ***Figure 6***: *Code coverage HTML report uploaded in a dedicated Code Coverage tab in build result*

Even if the code coverage output is not perfectly formatted you can indeed immediately verify percentage of code coverage of your test.

Gian Maria.
