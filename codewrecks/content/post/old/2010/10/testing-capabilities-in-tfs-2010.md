---
title: "Testing capabilities in TFS 2010"
description: ""
date: 2010-10-26T07:00:37+02:00
draft: false
tags: [Microsoft Test Manager,Testing]
categories: [Testing]
---
In TFS 2010 testing capabilities are really exceptional, and I'm not referring to testing tools that actually permits to record and replay web pages, CUIT etc, but I'm referring to the possibility to do a serious management of test plans for your projects.

I've seen in the past team doing test plan management with Excel, and if you are managing your test plan with Excelâ€¦you have a problem. The reason is that Excel is not a tool designed to manage Test Cases, you can clearly use it to write down your test, but it is difficult to integrate it into your ALM process and really difficult to read. The main problem is that Test plans in excel are completely dethatched from all other artifacts of your process, even if you manage to put all of them into team project SharePoint site. Moreover Excel does not helps you to run test or does not help testers to write down the results, usually resulting in Excel Test Spreasheet that are not aligned with the real testing run results.

Thanks to MTM you can leverage the power of TFS for managing testing suites; as an example suppose you have a user story about User Management of your application.

[![SNAGHTML632434](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML632434_thumb.png "SNAGHTML632434")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML632434.png)

* ***Figure 1***: * *A simple user story.*

Now the testing team begin to create test suite for this User Story, and thanks to MTM they can simply press the *add requirements* button, choose that User Story and create a test suite linked to that user story.

[![SNAGHTML64bbc1](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML64bbc1_thumb.png "SNAGHTML64bbc1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML64bbc1.png)

* **Figure 2** *: *a Test case called *Gestione Utenti* linked to the User Story *Gestione Utenti**

The main advantage is that the association is managed by TFS, that automatically list each test case of this test suite as belonging to the corresponding User Story. The tester team add two Test Case to the Suite, and then all developers can look at them in Visual Studio.

[![SNAGHTML660ff9](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML660ff9_thumb.png "SNAGHTML660ff9")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML660ff9.png)

* ***Figure 3***: In visual studio you can see all test case that are *testing* this user story*

This is the key in ALM:  **traceability**. Now you can easily understand what are the test cases related to the user story, and technical project manager can verify that all the tasks of the User Story are enough to satisfy test cases. Sometimes this helps a lot in discovering *hidden requirements*, suppose that the technical lead see a test case that states

1) open the web page

2) login

3) close the browser

4) open the web page

5) verify you are still logged.

This test case could highlight a requirement that was not clearly stated elsewhere, and the technical project manager can create a new task to support this scenario. This makes possible for developers to look at all the tests that will be run on a certain portion of the software, so they can easily verify if everything is really ready to be sent do tester. In the previous case, developers can implement a new feature to support the test case, avoiding the usual ping pong problem

1) dev send a build to testers

2) testers reject because the test case xxx does not pass

3) developers should look somewhere the test case, modify software and send another build.

Thanks to Teast case traceability, developers can easily verify if the code is ready to be tested, and if all the feature are implemented.

Thanks to TFS web access, I can easily look at the test cases even from a browser and not only from Visual Studio or MTM, so everyone can easily check all test cases to spot error or just to understand if testing is progressing well.

[![SNAGHTML68aac1](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML68aac1_thumb.png "SNAGHTML68aac1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML68aac1.png)

* ***Figure 4***: You can check a test case even online with a simple web browser.*

If you are the Test Plan Manager, you should also allocate resources to the test, and especially you should assign test cases to test team members, also you should plan when each test should be run and you could have the need to tell that a specific test case should be executed after another test case. This kind of management is perfect to do in Microsoft Project.

[![SNAGHTML6c144c](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML6c144c_thumb.png "SNAGHTML6c144c")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML6c144c.png)

* ***Figure 5***: How to assign a resource to a test case, in this example I'm assigning the Administrator to the *Esempio test case chiuso* test case*

Clearly you can use your GANTT chart to plan the execution.

[![SNAGHTML6d282a](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML6d282a_thumb.png "SNAGHTML6d282a")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML6d282a.png)

* ***Figure 6***: planning execution of test in Microsoft Project.*

Publishing the modifications to TFS results in reallocation of the testing resource

[![SNAGHTML6e699d](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML6e699d_thumb.png "SNAGHTML6e699d")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML6e699d.png)

* ***Figure 7***: The test case 63 was assigned to Administrator with the *assign resources* of Microsoft Project and the changes are published back to TFS, so they are visible everywhere.*

In Microsoft Project you can use Task Inspector to verify if some resource is overallocated because they have to work on other tasks. In Figure 8 we can see that project complains about the assignment of Administrator to a test case, because he is also assigned to other tasks. Clearly gantt planning for single test cases could be a little bit too granular, but this is only an example on how flexible is test case management thanks to TFS and MTM.

[![SNAGHTML705fdd](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML705fdd_thumb.png "SNAGHTML705fdd")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML705fdd.png)

* ***Figure 8***: the Task Inspector in Project has a warning because the resource Administrator was assigned to too many task.*

Alk.
