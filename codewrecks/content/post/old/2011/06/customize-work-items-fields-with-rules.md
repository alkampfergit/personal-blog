---
title: "Customize Work Itemrsquos fields with Rules"
description: ""
date: 2011-06-25T06:00:37+02:00
draft: false
tags: [ALM,Tfs]
categories: [Tfs]
---
1 – [Customize Tfs Process Template](http://www.codewrecks.com/blog/index.php/2011/06/22/customize-tfs-process-template/)  
2 – [Basic of TFS Process Template Customization](http://www.codewrecks.com/blog/index.php/2011/06/23/basic-of-tfs-process-template-customization/)  
3 – [Adding Field to a Work Item Definition](http://www.codewrecks.com/blog/index.php/2011/06/24/customization-of-tfs-process-template-adding-field-to-a-work-item-definition/)

In the third part of this tutorial I showed how to add a field to a Work Item Definition, in this post I’ll show how you can customize field’s behavior with the addition of *Rules.*

If I select the new field I just created (called Note di revisione), I can press edit to modify its definition and in the “Field Definition” form I can manage all the *Rules*applied to the field. ( **Figure 1** ).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image25.png)

 ***Figure 1***: *Adding a rule to a field is really simple*

Each rule has a different meaning, but all of them shares some common behavior. Let’s take the first rule of the list as example, it is called  **ALLOWEDVALUES** and is used to specify a list of allowed values for the field.

In our example the field admit only the value “non effettuate” (not present), “in lavorazione” (working), “approvata” (approved), because these are the only three state that are allowed for this field in our customized process. After we choose the ALLOWEDVALUES rule in  **Figure 1** and press OK a new window appears to customize this specific rule. ( **Figure 2** )

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/106eec0264a9_11177/image_thumb_1.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/106eec0264a9_11177/image_4.png)

 ***Figure 2***: *This specific rule has a list of allowed values, you can: add, edit and delete values.*

Each rule can have its parameters, the upper part is common (we will see shortly how it is used), and the bottom part contains the configuration parameter for the specific rule we choose. After I added the three allowed value in the list of valid values, I can simply confirm (OK Button), then save the definition to the Team Process and finally I try to create a new bug to verify if the rules configuration is ok. You can see from  **Figure 3** , that the rules is now applied to your custom field, because the interface looks different from before.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image26.png)

 ***Figure 3***: *Since the ALLOWEDVALUES permits only a predefinite range of values, TFS changes the UI and uses a combo to edit the value of the field.*

The most interesting aspect is that the UI checks all the rules of the WorkItem and modify the layout accordingly; since we have an ALLOWEDVALUES the field is edited with a ComboBox that contains only the three values I inserted in the rule configuration. Another interesting feature is that a rule can be applied only to certain role, suppose that in our process the value “Approvate” (Approved) can be used only by the administrator of the project, because standard developers could not approve revision note.

To obtain this result we need to add the ALLOWEDVALUES rule two times, as shown in Figure 4.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb27.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image27.png)

 ***Figure 4***: *We can apply the same rule, with different configuration, to different securable objects.*

As shown in  **Figure 4** , the solution to the problem is simple, just add the same rule two times with different configuration and use the * **For** *rule parameter to restrict the application of the two different configuration. When you edit a WI the only rules that are applied are those one that are not assigned to any specific group (the For parameter is left empty) or that are assigned to a group that comprehend the editing user. In the previous example the For field was left empty (the rule apply to all users), now I have two rules, each one applied to a different group.

You can notice that the For parameter can be changed by a combo in the Rule editor, but it contains only the  **[global]** groups of Tfs, that are common to the entire *Project Collection*. This does not mean that you can choose only among the listed value, because you can select any securable object you like. In this example I choose to specify Tfs group specific to the project, that has the form  **[project]\groupname.** You can simply click in the combo and write whatever user or TFS group you want.

Now login as an administrator and you should see all three allowed values in the combo as shown in Figure 3, but if you log to TFS with a user that belong to the contributors group you should only see the two values “*Non effettuate”* and “*In Lavorazione”*.

There are a lot of useful rules in TFS and in subsequent posts I’ll show the most common ones, as well as some other interesting customization you can do to a Work Item Definition.

Stay Tuned.

alk.

Tags: [Tfs](http://technorati.com/tag/Tfs)
