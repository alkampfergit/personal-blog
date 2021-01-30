---
title: "Keep Codeplex projects and local TFS projects syncronized"
description: ""
date: 2010-09-30T07:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
[Codeplex](http://www.codeplex.com/) is Microsoft hosting site for open source projects, based on TFS or mercurial. Now suppose you have this scenario: an open source project, with a  core team that work actively on it, and some occasional contributors that do little work. Since Codeplex does not support every feature of tfs, (especially you lack the build machine), sharepoint integration and other stuff you loose many useful feature if you use only Codeplex for the project. You wish the core team to use an internal TFS to have the full power of TFS, while using Codeplex to make the project available to everyone. Thanks to [Integration Platform](http://tfsintegration.codeplex.com/) you can try to keep them synchronized and use the best of both of them.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/image.png)

Supporting this scenario with Integration Platform is not difficult, first of all, in the server where the IP is running, you should store the credential to access tfs in order to make possible for IP to access codeplex and local TFS. In windows 2008 R2 refer to  **Figure1** for how to do this.

[![Untitled](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/Untitled_thumb.png "Untitled")](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/Untitled.png)

 **Figure 1 â€“** *How to store credentials to tfs in the server where Integration Platform is running. Note: to avoid problem, use the owner of the project as the user to connect to codeplex and to local TFS.*

Now you can install Integration platform, create a new project and choose â€œVersionControlâ€ as type of synchronization; then simply configure the two servers, the codeplex one and the local tfs one. In  **Figure 2** I show the configuration with two-way manual synchronization, a configuration that you should use to test if everything work ok (in the final version you should use the Custom Workflow type to use automatic synchronization.

[![Untitled3](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/Untitled3_thumb.png "Untitled3")](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/Untitled3.png)

 **Figure 2 –** *How to specify the two Projects to synchronize, the sync type is Two-way Sync*

This is only the first step, because you need to specify mapping between the identities of codeplex and those one of the local server. If you fail to do so, every check-in will be transferred with the account mapped with network credentials ( **Figure 1** ). Since you usually want to preserve the user that did the checkin, you should specify how to map users from different domains. You need to configure everything as [described here](http://blogs.msdn.com/b/willy-peter_schaub/archive/2010/04/10/tfs-integration-platform-what-is-the-lookup-service-q-a-27.aspx), and the core part is reported in the following two snippets.

You need to press the xml tab in the bottom to see the whole xml configuration and change it by hand. This is the first part

{{< highlight csharp "linenos=table,linenostart=1" >}}
<SessionGroup CreationTime="2010-08-12T09:13:42.667+02:00" FriendlyName="Dexter" SessionGroupGUID="a728f99b-2a6b-4848-ae98-61079b894e1e" Creator="DEBRA\Administrator" SyncIntervalInSeconds="0" SyncDurationInMinutes="0">
<MigrationSources>
<MigrationSource InternalUniqueId="639ced1e-8037-4e2e-a86f-37a11a8d0ab7" FriendlyName="tfs.codeplex.com (VC)" ServerIdentifier="81fbe566-5dc4-48c1-bdea-7421811ca204" ServerUrl="https://tfs.codeplex.com/tfs/tfs05" SourceIdentifier="dexterblogengine" ProviderReferenceName="febc091f-82a2-449e-aed8-133e5896c47a">
<Settings>
<Addins />
<UserIdentityLookup />
<DefaultUserIdProperty UserIdPropertyName="DomainAlias" />
</Settings>
<CustomSettings />
<StoredCredential />
</MigrationSource>
<MigrationSource InternalUniqueId="8b5130fa-a39f-4953-95fb-deaf87ea1767" FriendlyName="debra (VC)" ServerIdentifier="cef14234-e6ab-48ca-8acc-aa69c35bef17" ServerUrl="http://debra:8080/tfs/dexter" SourceIdentifier="DexterTest2" ProviderReferenceName="febc091f-82a2-449e-aed8-133e5896c47a">
<Settings>
<Addins />
<UserIdentityLookup />
<DefaultUserIdProperty UserIdPropertyName="DomainAlias" />
</Settings>
<CustomSettings />
<StoredCredential />
</MigrationSource>
</MigrationSources>
{{< / highlight >}}

The lines I changed respect to generated configuration are: 7 and 16, where you must change the default value of the DefaultUserIdProperty from  **DisplayName** to  **DomainAlias**. Now you need to add mapping between users

{{< highlight csharp "linenos=table,linenostart=1" >}}
<WorkFlowType Frequency="ContinuousAutomatic" DirectionOfFlow="Bidirectional" SyncContext="Disabled" />
<CustomSettings />
<UserIdentityMappings EnableValidation="false">
<UserIdentityLookupAddins>
<UserIdentityLookupAddin>cdde6b6b-72fc-43b6-bbd1-b8a89a788c6f</UserIdentityLookupAddin>
</UserIdentityLookupAddins>
<AliasMappings DirectionOfMapping="LeftToRight">
<AliasMapping Left="alkampfer_cp" Right="alkampfer" MappingRule="SimpleReplacement" />
<AliasMapping Left="AGiorgetti_cp" Right="guardian" MappingRule="SimpleReplacement" />
</AliasMappings>
<AliasMappings DirectionOfMapping="RightToLeft">
<AliasMapping Left="alkampfer_cp" Right="alkampfer" MappingRule="SimpleReplacement" />
<AliasMapping Left="AGiorgetti_cp" Right="guardian" MappingRule="SimpleReplacement" />
</AliasMappings>
<DomainMappings DirectionOfMapping="LeftToRight">
<DomainMapping Left="SND" Right="Debra" MappingRule="SimpleReplacement" />
</DomainMappings>
<DomainMappings DirectionOfMapping="RightToLeft">
<DomainMapping Left="SND" Right="Debra" MappingRule="SimpleReplacement" />
</DomainMappings>
</UserIdentityMappings>
{{< / highlight >}}

Now under the &lt;CustomSettings /&gt; replace the UserIdentityMappings with the correct mapping from the users of the left project (Codeplex) and the users in the right one (Local TFS). In this example I used a test project where alkampfer\_cp is the owner in codeplex, and AGiorgetti\_cp is a contributor, the corresponding users in local Tfs are Alkampfer and Guardian. If you use a different user than the owner to access Codeplex ( **Figure 1** ) you could get this error:

*TF14098: Access Denied: User SND\AGiorgetti\_cp needs Checkin, CheckinOther permission(s) for $/TestSync/â€¦â€¦*

This is because the user AGiorgetti\_cp is not the owner of the Codeplex project (Alkampfer was the owner) is only a contributor, so he cannot do a checkin on behalf on other user. If everything is ok, you can try to do a check-in on the local TFS, wait a little bit and then go to codeplex to see what is happened.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/09/image1.png)

 **Figure 3 â€“** *The result of a check-in in the local tfs by the user AGiorgetti is correctly moved to the Codeplex project.*

As you can see in  **Figure 3** , latest check-in is done by AGiorgetti user, thus reflecting the fact that in Local Tfs the user guardian did the check-in, and the comment included in parenthesis, specify that the check-in derives from an integration between Codeplex and Debra , and the original id is 670.

With sync in place, the core team can work with the local tfs, using the full feature of it, while the occasional contributor, can still use Codeplex, grab latest changes do a check-in, and IP will take care of all the sync.

alk.

Tags: [Tfs Integration Platform](http://technorati.com/tag/Tfs%20Integration%20Platform)
