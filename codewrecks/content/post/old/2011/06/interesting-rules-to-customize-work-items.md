---
title: "Interesting rules to customize Work Items"
description: ""
date: 2011-06-27T15:00:37+02:00
draft: false
tags: [Process Template,Tfs]
categories: [Tfs]
---
1 – [Customize Tfs Process Template](http://www.codewrecks.com/blog/index.php/2011/06/22/customize-tfs-process-template/)  
2 – [Basic of TFS Process Template Customization](http://www.codewrecks.com/blog/index.php/2011/06/23/basic-of-tfs-process-template-customization/)  
3 – [Adding Field to a Work Item Definition](http://www.codewrecks.com/blog/index.php/2011/06/24/customization-of-tfs-process-template-adding-field-to-a-work-item-definition/)  
4 – [Customize Work Item Fields with Rules](http://www.codewrecks.com/blog/index.php/2011/06/25/customize-work-items-fields-with-rules/)

In fourth chapter we familiarized with Rules and how you can customize a Work Items adding rules to it. You can find a complete list of [Rules at this link](http://msdn.microsoft.com/en-us/library/ms194953%28v=VS.100%29.aspx), but I want to show you the most useful ones (at least in my opinion).

Since you already know the  **ALLOWEDVALUES** you should know the  **ALLOWEXISTINGVALUE** a rule without parameter and is used to specify that we want to maintain a value even if it is not in the list of allowed values. This rule is useful if you change the list of available values (called [PickingList](http://msdn.microsoft.com/en-us/library/ms194947.aspx)) but you want to maintain old values, even if they are no more in the picking list. If you change the PickingList and you edit a work item that has an invalid value in a field, you are forced to specify a valid value to save again the element.

Another rule related to the PickingList is the  **PROHIBITEDVALUE** that lists a series of values that are not allowed to be used in a field. As you see in Figure 1 the field is edited with a normal textbox, but if *blabla* is a prohibited value an error is shown.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb31.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image31.png)

 ***Figure 1***: *Error value for a field that contains a prohibited value.*

A third rule related to PickingList is the  **SUGGESTEDVALUES** that contains a series of suggested values, but you can insert any value you want. When you apply this rules the editing field of the Work Item is a combo that contains all suggested values, but you can type any value you want.

The rule  **CANNOTLOSEVALUE** states that a field once you set a valid value, could not be set to null anymore.

Another really interesting rule is called  **DEFAULT** that permits to specify the default value of a field and it is [really flexible](http://msdn.microsoft.com/en-us/library/ms194948.aspx).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb32.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image32.png)

 ***Figure 2***: *Specify a value taken from another field as DEFAULT.*

In  **Figure 2** I showed a very specific situation, I choosed * **field** *in the *from* combo, this specify to TFS that I want to use the value of another field as DEFAULT for the field this rule is applied to. Then I choosed the System.ChangedBy field and saved the rule. Now I create another Bug based on this template, did not write anything in the new field ("Revision note*) and simply press save to save the WI. Since the Revision Note contains the rule DEFAULT that states that the default value is taken from the field ChangedBy the value is updated accordingly as shown in  **Figure 3**.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Personalizzare-i-Work-Item-di-TFS_AFA7/image_thumb_2.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Personalizzare-i-Work-Item-di-TFS_AFA7/image_6.png)

 ***Figure 3***: *The content of Revision Note was automatically filled with DEFAULT value, taken from the ChangedBy*

Clearly you can specify a constant for DEFAULT, you should choose *value*for the *field*combo, and simply specify a constant value in the *value* textbox ( **Figure 4** )

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Personalizzare-i-Work-Item-di-TFS_AFA7/image_thumb_3.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Personalizzare-i-Work-Item-di-TFS_AFA7/image_8.png)

 ***Figure 4***: *This is a *classic* default value, when the user creates another WI based on this template, the field contains this constant value.*

You can use *currentuser*and *clock* as source of the default value.

Very similar to  **DEFAULT** is the rule  **COPY** , it is used to copy a value from a field to another during transition (I'll speak about transition in subsequent posts).

Finally another useful rule is the  **MATCH** , used to specify a pattern to check the validity of the content of the field..

alk.

Tags: [Tfs](http://technorati.com/tag/Tfs) [ALM](http://technorati.com/tag/ALM)
