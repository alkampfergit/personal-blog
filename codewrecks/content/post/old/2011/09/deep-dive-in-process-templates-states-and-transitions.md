---
title: "Deep dive in Process templatersquos states and transitions"
description: ""
date: 2011-09-19T09:00:37+02:00
draft: false
tags: [Process Template,Tfs]
categories: [Team Foundation Server]
---
1 – [Customize Tfs Process Template](http://www.codewrecks.com/blog/index.php/2011/06/22/customize-tfs-process-template/)  
2 – [Basic of TFS Process Template Customization](http://www.codewrecks.com/blog/index.php/2011/06/23/basic-of-tfs-process-template-customization/)  
3 – [Adding Field to a Work Item Definition](http://www.codewrecks.com/blog/index.php/2011/06/24/customization-of-tfs-process-template-adding-field-to-a-work-item-definition/)  
4 – [Customize Work Item Fields with Rules](http://www.codewrecks.com/blog/index.php/2011/06/25/customize-work-items-fields-with-rules/)  
5 – [Interesting rules to customize work items.](http://www.codewrecks.com/blog/index.php/2011/06/27/interesting-rules-to-customize-work-items/)  
6 – [Customize States and Transitions of a Work Item](http://www.codewrecks.com/blog/index.php/2011/06/30/customize-state-and-transitions-of-a-work-item/)

In previous post I did a brief introduction to the concept of States and Transitions of Work Items and it is time to do a little deep dive to understand how you can configure complex rules on transition between states. Lets introduce a new rule for our bug definition: <font color="#0000ff"><strong>we want to be able to move from the <em>Triage </em>state to <em>Closed</em>, only if the user is an administrator of the team project</strong></font>. This is a quite standard requirement because going from Triage to Closed basically means: *“ignore that bug”* and only an administrators should be able to take such a decision.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/image_thumb.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/image_2.png)

 **Figura 1:** *Transition from Triage to Closed is available only for Project administrators*

This requirements can be achieved with little work, as you can see from  **Figure 1** because the transition is a securable object you can restrict the roles that can use that object. If a role has no rights to use the transition, he/she cannot do the transition between the start and destination state of the transition.

Now we want to add more complexity,  **<font color="#0000ff">we need to add another field called “rejected Reason” where we want to insert a detailed description of the reason why this bug was rejected</font>** <font color="#0000ff"><strong>(moved from <em>triage</em> do <em>Closed</em>)</strong></font>. First of all we add the field and update the UI Accordingly (as seen in previous posts), The result is shown in  **Figure 2**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image2.png)

 **Figura 2:** *A field called RejectedReason was added to the Work Item Definition*

We are still really far from an optimal situation, first of all the *Rejected Reason* field is always editable, so we can add a requirement that stats that  **<font color="#0000ff">Rejected Reason should be editable only when the bug pass from state <em>triage </em>to <em>closed</em></font>** , because there is no meaning to have a Rejected Reason for bugs that were not rejected.

Solving this problem is really easy in TFS2010 thanks to the incredible flexibility in Wok Item configuration. We can double-click in the Triage status and open the edit details interface where we can add a series of RULES, in the same way we added RULES to single Work Item Field. RULES specified in a definition of a State are valid only when the Work Item is in that specific state.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/image_thumb_2.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/image_6.png)

 **Figura 3:** *Tiage state has a rule on the Rejected Reason field, in this situation I simply put the READONLY rule to make Rejected Reason not editable.*

To obtain desired result, we can insert the READONLY rule to *Rejected Reason*field in all states, excepts for the Closed state, with this configuration the Revision Note field will be editable only when the state is * **Closed**.*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image3.png)

 **Figura 4:** *When I’m in Triage state the field Revision Note is Readonly, but when I move to Closed State it is editable.*

This is still not perfect, because now you can add a Rejected Reason when the bug has a transition from * **Fixed** *to * **Closed** ,*because the * **Closed** *state has no READONLY RULE. To obtain our goal, we need to use another cool capability of Work Item state management, adding a rule to a transition. A RULE added to a transition is applied only when the state changes using that transition. In our scenario we can simply add a READONLY rule for the *Rejected Reason*field to the transition that bring the Bug from * **Fixed** *to * **Closed** *, now we can edit Rejected Reason only when the state pass from * **Triage** *to * **Closed**.*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image4.png)

 **Figura 5:** *The Rejected Reason field has the READONLY rule applied when the state pass from fixed to closed.*

As last requisite we add:  **<font color="#0000ff">when the bug moves from Triage to Closed, we want to insert automatically the value rejected into the field <em>Resolved Reason</em> and also we want the field <em>Rejected Reason </em>is mandatory when the <em>Reason </em>field is different from <em>Duplicate</em></font>**. The reason behind this requirement is: a value of Duplicate in the *Reason*field already gives me information about “why” the bug was rejected, but for any other reason I want a detailed specification in the *Rejected Reason*on why the bug was rejected.

We can satisfy this requirement with the following steps: first of all you need to edit the * **Closed** *status, adding a REQUIRED RULE for the Resolved Reason field, then the Resolved Reason field is put in readonly in the UI (figure 6) and finally we add the *Rejected* value to the list of ALLOWEDVALUES.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/image_thumb_5.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/image_12.png)

 **Figura 6:** *Resolved Reason should be put as readonly in the UI because it will be filled automatically*

We should now open the  **definition of the transition** , select the “Fields” tab and add a COPY RULE to the field Resolved Reason to automatically change the value of *Resolved Reason* field during that transition.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image5.png)

 **Figura 7:** *Steps needed to automatically fill the value of the ResolvedReason field during the transition from  **Trieage** to  **Closed**.*

What we did is specifying that when we apply the transition from * **Triage** *to * **Closed** *, the COPY RULE will be applied assigning the value  **Rejected** in the *Resolved Reason*field and the user could not change its value because it is not editable. The COPY rule in a transition is the perfect way to automatically assign a predetermined value to some field during a transition.

Finally we need to make Rejected Reason a required field only when the value of the field Reason is different from  **Duplicate**. This is really simple because we can simply add another RULE to the transition from *Triage*to *Closed* called WHEN NOT. This specific RULE permits to apply a series of other RULES when a condition is false and perfectly satisfies our need, because we can simply add a WHEN NOT System.Reason is equal to Duplicate to apply the REQUIRED RULE to the Rejected Reason.

[![SNAGHTMLc37265](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/SNAGHTMLc37265_thumb.png "SNAGHTMLc37265")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/a767ea96c8c5_E621/SNAGHTMLc37265.png)

 **Figura 8:** *Adding the REQUIRED RULE to the Rejected Reason field only when the System.Reason field is different from Duplicate*

As you see in  **Figure 8** , the first tab is used to specify the condition, in this example, since the rule is WHENNOT, the condition was read as "*When the System.Reason is different from duplicate”;*in the second tab (rules) you specify the set of RULES you want to apply then the previous condition is satisfied, in this example we specify REQUIRED rule.

Now you can create a new bug in *triage* status, save it and change the status in *closed;*now you can verify that if the Reason field is different from Duplicate, the Rejected Reason field become required.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image6.png)

 **Figura 9:** *The Reason is Duplicate, so the Work Item is valid, immediately after you change the Reason to Not Reproductble, the Work Item is not valid anymore because the Rejected Reason field is now REQUIRED.*

You can test this rule leaving the Rejected Reason blank and noticing that as soon you change the Reason field to a value different from  **Duplicate** the Work Item is not valid anymore and in upper part a yellow bar tells you that the field Rejected Reason could not be left blank, because it is REQUIRED.

This article can be a little complex, but it shows you the extreme flexibility you have in configuring your Work Item template to pefectly fits your process. The ability to insert RULES valid only for specific States or Transition and the special RULES WHEN and WHEN NOT permits you to create complex logic for your Work Item definition, like default values for specific transition and putting field REQUIRED or READONLY during certain transition or when the value of another field changes to a specific value.

Gian Maria.
