---
title: "Warping ASPNET"
description: ""
date: 2007-06-22T01:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
In a recent project I have a big user control with a Asp.Wizard control, 6 tabs and each tab present a complex user control. The whole thing is used to insert a complex set of data presenting the operation to the user a standard windows tab. After a while the control has degraded, because a lot of logic has creep into it, and moreover the performance of the control are not so good, expecially because in a wizard control, all control in all tabs gets initialized and run at each page request, they simple become invisible, but if you do a lot of logic in page load of the single page performance are not so optimal.

After a while a new requirement come to surface, each customer of the software should add some custom field to the set of data managed by the wizard and this mean that I need to insert for each customer a variable number of tabs to the wizard control. I decided that it is come the time for refactoring.

Since I need to instantiate dynamically the other tabs I decided to instantiate every control dynamically, but I did not think that actually I was beginning a war with the ASP.NET engine :D. So I decided to explain to you the problems you can face if you decide to create a Dynamically generated  interface in asp.net that change controls shown for each postback. First of all to preserve page view state each control must have a unique ID, and each dynamically generated control should be placed on the page at the same place for each postback. This first problem is simple to solve, I simply create one placeholder, then at runtime I check the number of tabs I need to show, then I create an array of placeholder, one for each tab and I insert all these placeholders into the controls collection of the first placeholder, so at each page generation each control gets created in his own dedicate placeholder. Then I generate a list of buttons, one for each tabs, and finally the previous and next button. To make everything flexible I create an interface called INavigator that abstracts me from the details of managing the tabs. This interface has method like movenext, moveprevious, createcontrol(Int32 index) and so on. I create the control, create a simple navigator that will contain the orginal 6 tabs structures, In 20 minutes I had the first prototype running......but the worst had yet to come.........

Alk.
