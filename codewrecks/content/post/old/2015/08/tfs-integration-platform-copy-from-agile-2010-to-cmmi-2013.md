---
title: "TFS Integration Platform copy from Agile 2010 to CMMI 2013"
description: ""
date: 2015-08-05T19:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
Today I needed to move a bunch of Work Items from a TFS 2010  to TFS 2013, but I needed also to move from a TP based on Agile Template on a Project based on CMMI Template.

Number of Work Items is small, but lots of them have attachments,  **so I decided to use Integration Platform to migrate the history and attachments**. It turns out that we accomplished an acceptable result with little time. An alternative, if you do not care about attachments and history, is using Excel.

First of all you need to be aware of the [EnableBypassRuleDataSubmission](http://blogs.msdn.com/b/willy-peter_schaub/archive/2009/11/10/tfs-integration-platform-what-is-the-enablebypassruledatasubmission-in-the-configuration-file-question-answer-7.aspx "http://blogs.msdn.com/b/willy-peter_schaub/archive/2009/11/10/tfs-integration-platform-what-is-the-enablebypassruledatasubmission-in-the-configuration-file-question-answer-7.aspx") option that allow Integration Platform to bypass rule validation of Work Items. This options is expecially useful if you migrate to a different Process Template, because you are not sure that Work Items are valid when they transition from a process to another. This feature is also useful  **to preserve the Author of Work Item Change in destination project**. If you do not enable this feature, all changes will be recorded as done by the user that is doing the migration.

Moving to a different Process Template is mainly a matter of creating mapping between fields of the source template (Agile) to fields of detstination template (CMMI). A nice aspect is that you need to map only fields that are used on source Team Project. As a suggestion you should try to copy everything on a test Team Project in a test Project Collection, and repeat the migration several times, until the result is good.

You can start with a wildcard mapping, then  **start the migration and during Analysis Phase the Integration Platform will generate Conflicts that shows you what is wrong**. You can solve the problem and update mapping until everything run smootly. In  **Figure 1** you can the most common error, a field that is present in source Process Template is not present in destination Process Template. In that picture you can verify that the Microsoft.VSTS.Common.AcceptanceCriteria is missing in CMMI Project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image2.png)

 ***Figure 1***: *Conflicts occours because not all used fields are mapped in the configuration.*

Be sure to refer to the [Work Item Field Reference](https://msdn.microsoft.com/en-us/library/ms194971.aspx), to verify which fields are available in destination template. One of the nicest feature of Integration Platform is that  **you can simply specify target field during migration, and this automatically updates the mapping**. Since CMMI does not have acceptance criteria field, you can add it (editing process template of destination Team Project) or you can use another field, Es. Analysis, or you can do some complex mapping (will show an example later in the post)

You can also choose to update Mapping ignoring the field, this choose will ignore content of that field that will not be migrated. You  **can also do a manual update XML mapping configuration, if the resolution requires complex modification of the mapping**.

[![Complex resolution conflicts](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image_thumb3.png "To resolve complex conflict you can also edit XML mapping configuration")](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image3.png)

 ***Figure 2***: *Update configuration if you need to do some complex resolution*

At the end of the migration you should double check what happened, because bypassing Work Item rules usually lead to Work Items in unconsistent state. As an example, in Agile Process, a Task can have *new*status, while this is invalid in CMMI.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image4.png)

 ***Figure 3***: *Some of migrated Work Items can have invalid state because we decided to bypass validation rules.*

 **It is common to have same field that admit different values in different Process Template.** Task Work Item type have Activity field in Agile that can be mapped to Discipline in CMMI, but allowed values are different. In such a situation you can map a field Activity to be copied to Discipline but using a lookup map to convert values.

{{< highlight xml "linenos=table,linenostart=1" >}}


<MappedField 
    LeftName="Microsoft.VSTS.Common.Activity"
     RightName="Microsoft.VSTS.Common.Discipline" 
   MapFromSide="Left" 
    valueMap="ActivityMap" />
<ValueMap name="ActivityMap">
    <Value LeftValue="Deployment" RightValue="Development">
        <When />
    </Value>
    <Value LeftValue="Design" RightValue="User Experience">
        <When />
    </Value>
    <Value LeftValue="Development" RightValue="Development">
        <When />
    </Value>
    <Value LeftValue="Documentation" RightValue="Analysis">
        <When />
    </Value>
    <Value LeftValue="Requirements" RightValue="Analysis">
        <When />
    </Value>
    <Value LeftValue="Testing" RightValue="Test">
        <When />
    </Value>
</ValueMap>

{{< / highlight >}}

The last useful technique is  **the ability to compose destination value using multiple source fields.** As an example, CMMI does not have AcceptanceCriteria field, that is present in Agile. From my point of view, Acceptance Criteria in Agile can be considered part of the Description field in CMMI. Thanks to FieldAggregationGroup I was able to to copy both Description and AcceptanceCriteria field from User Story (Agile) to field Description of Requirement (CMMI).

{{< highlight xml "linenos=table,linenostart=1" >}}


<FieldsAggregationGroup MapFromSide="Left" TargetFieldName="System.Description" Format="Description:{0} AcceptanceCriteria:{1}">
<SourceField Index="0" SourceFieldName="System.Description" />
<SourceField Index="1" SourceFieldName="Microsoft.VSTS.Common.AcceptanceCriteria" />
</FieldsAggregationGroup>
{{< / highlight >}}

Thanks to this configuration, I can map multiple source fields in a single fields. In  **Figure 4** is depicted a User Story that has both Description and Acceptance Criteria populated.

[![Acceptance criteria and Description](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/SNAGHTML8d5b8f_thumb.png "A User Story Work Item that has both Details and Acceptance Criteria")](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/SNAGHTML8d5b8f.png)

 ***Figure 4***: *A User Story Work Item that has both Details and Acceptance Criteria*

Thanks to [FieldAggregationGroup](http://blogs.msdn.com/b/willy-peter_schaub/archive/2010/01/06/tfs-integration-platform-aggregated-fields-question-answer-17.aspx) I’m able to compose content of these two field in a single field of migrated work item. Here is corresponding Work Item on Destination Team Project after migration.

[![Result  of composing two source fields in a single destination field](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image_thumb5.png "Both Description and AcceptanceCriteria were moved from source Work Item into the Description Field of Requirements work item")](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image5.png)

 ***Figure 5***: *Result  of composing two source fields in a single destination field*

Another interesting feature is  **specifying a default value for required fields that exists only in the destination Team Project** , thanks to the [@@MissingField@@](http://blogs.msdn.com/b/willy-peter_schaub/archive/2010/01/05/tfs-integration-platform-missingfield-question-answer-16.aspx) placeholder. The @@MissingField@@ placeholder can be used to simply specify a Default Value for a field in Destination Team Project.

If you need resources about Integration Platform, I suggest you looking at this article that contains a huge amount of links that cover almost every need  [http://blogs.msdn.com/b/willy-peter\_schaub/archive/2011/06/06/toc-tfs-integration-tools-blog-posts-and-reference-sites.aspx](http://blogs.msdn.com/b/willy-peter_schaub/archive/2011/06/06/toc-tfs-integration-tools-blog-posts-and-reference-sites.aspx "http://blogs.msdn.com/b/willy-peter_schaub/archive/2011/06/06/toc-tfs-integration-tools-blog-posts-and-reference-sites.aspx")

Gian Maria.
