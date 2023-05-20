---
title: "Development and Related Work missing on new UI form after upgrade to TFS 2017"
description: ""
date: 2017-04-01T06:00:37+02:00
draft: false
tags: [Process Template,Tfs]
categories: [Tfs]
---
I’ve dealt on [How to enable the new work Item in TFS 2017](http://www.codewrecks.com/blog/index.php/2016/11/05/enable-new-work-item-form-in-tfs-15/), and you could have noticed some  **differences from Visual Studio Team Service Work Item layout, or even with new Team Projects created after the upgrade**. In  **Figure 1** you can see in the left the detail of a PBI on a Team Project that exists before the upgrade to TFS 2017, in the right the PBI on a Team Project created after the upgrade.

[![SNAGHTML113eac](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/SNAGHTML113eac_thumb.png "SNAGHTML113eac")](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/SNAGHTML113eac.png)

 ***Figure 1***: *Differencies of Work Item Form between Team Projects*

This difference happens because the script that upgrade the Process Template to use the new form, does not add some part that are indeed present in newer Process Template. In the end you can be annoyed because new Team Project have different layout than existing ones. The solution is quite simple.

 **First of all install the** [**Team Process Template Editor Extension**](https://marketplace.visualstudio.com/items?itemName=KarthikBalasubramanianMSFT.TFSProcessTemplateEditor) **for Visual Studio 2017** , this will easy the process because will avoid resorting to command line. Now, as you can see in  **Figure 2** , you should be able to use the menu Tools –&gt; Process Editor –&gt; Work Item Types that contains two commands: *Import WIT and Export WIT*.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image.png)

 ***Figure 2***: *Commands to import and export Work Item Definition of a Team Project directly inside VS*

> Process Template Editor will save you some command line details

 **With these two command you can export the definition of Work Items from a Team Project to your local disk (Export), then you can modify the definition and upload modified version to Team Project again (Import).** If you choose Export, it will made you connect to a Project Collection, then choose the Team Project you want to use, and finally choose the Work Item Type, in my situation I’ve choose User Story Work Item Type and saved it to disk. When the export asks you to include the Global Definition List, please answer no.

> It will be a good idea to save everything to a source controlled folder, so you can verify how you modified the Work Item Definition during the time.

After you downloaded the Work Item Definition of the Team Project you want to fix, Export the very same Work Item Definition, from a Team Project that was created after the upgrade to TFS 2017.  **It could be simpler instead to download the entire process template definition from the server and look for the Work Item Definition you need.** Since I need to modify several Work Item Type definition, not only User Story, I decided to download the entire Process Template for the Agile definition

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image-1.png)

 ***Figure 3***: *How to download an entire process template directly from Visual Studio.*

The menu Team –&gt; Team Project Collection Settings – &gt; Process Template Manager will do the trick; this command will open a dialog with all the Process Template Definition and I simply grab the Agile (default) and download to a source controlled folder.

Now you should have two file User Story.xml, the first one of the TP that was upgraded (the one that missing the *Development and Related Work*UI Section) and the other is the one of the Process Template Definition, that contains the sections you miss.

You can just compare them with whatever tool you prefer. The result is that the two files usually are really different, but we do not care for now about all the differences, we can just scroll to the bottom to find the definition of the layout of the new UI as you can see in  **Figure 4**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image-2.png)

 ***Figure 4***: *Different UI definition section between existing and new Team Project*

In the left we have Status and Planning section, while on the right we have planning and development, the two missing parts we want to see in our new Work Item Form Layout are instead on the new definition. Now you only need to adjust the layout on the left to make it include the missing two section. In  **Figure 5** is shown how I modified the file.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/04/image-3.png)

 ***Figure 5***: *Modified Process template*

You can rearrange the form as you like, as you can see I’ve made it equal to the one of the latest version of the Process Template, except that I left the Story Point in the Planning section.

 **Once you are done, you can use the Import WIT function from Visual Studio 2017 to upload the new definition to the Team Project you want to modify.** If you made errors the Work Item Definition will not be imported, so you do not risk to damage anything.

If the import went OK, just refresh the page in the browser and you should immediately see the new layout in action, Development and Related Work section are now visible. You can also rearrange the UI if you like to move information in a way that are more suitable to your needs.

Now repeat the very same procedure for Features, Epics, Task and whatever Work Item Type that miss some section respect a newly created process template.

If you need to do this procedure for more than one Team Project, you need to repeat all the steps if the other Team Project is based on a different template (Agile, SCRUM, CMMI) or it contains different customization.

>  **It is always a good procedure to always export the actual definition of a Work Item before starting to modify it, to avoid messing up the template.** If you did a good work and stored all customization into source control, you still need to export the definition from the template, to verify if the definition was changed from the latest time you modified it. Even if you are sure that the latest customizations are in source control, remember that when you upgrade TFS it could be possible that Process Template Definition was upgraded to enable new features (as for the new Work Item Layout Form).

Gian Maria Ricci
