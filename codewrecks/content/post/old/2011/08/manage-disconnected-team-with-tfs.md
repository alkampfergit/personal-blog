---
title: "Manage disconnected team with TFS"
description: ""
date: 2011-08-12T16:00:37+02:00
draft: false
tags: [ALM,Team Foundation Server]
categories: [Team Foundation Server]
---
Suppose you have this scenario, a team is working on company office to create some software that communicate with some complex hardware that will be deployed to a foreign country. When is time to set up everything in production the team goes physically to that foreign country and they will modify the software on the field doing final adjustments but usually they have no connection to the central office. How could you manage to keep your source code aligned when the team is on remote site not being able to access the central TFS?

[![Untitled](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled_thumb2.jpg "Untitled")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled3.jpg)

If no local person will access the team project during the period in witch the team is in the remote site, you can create a Project Collection dedicated to that team, then when the team will move to the remote site, they detach the collection, bring it with them with another installation of TFS, and when theyâ€™ll come back into the office, they will reattach the collection to the original TFS.

If people from central office should being able to access the Team Project from central office, while the team is working on code on customerâ€™s remote site, [Integration Platform](http://tfsintegration.codeplex.com/) could be the solution.

You starting creating another installation of TFS (usually on a virtual machine), and create a Team Project with the same name of the original Team Project or a similar name like * **original name portable** *, then install the Integration Platform on this Virtual Machine and configure an integration between the two Team Projects. First of all open the Integration Platform interface, choose â€œCreate Newâ€ and then choose Version Control if you want to keep in sync only source code, or VersionControlAndWorkItem if you want to keep in sync both WI and Source.

[![asdfasdf](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/asdfasdf_thumb.jpg "asdfasdf")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/asdfasdf.jpg)

 ***Figure 1***: *Choose to synchronize only version control if you are not interested in Work Items.*

Now you need to specify the two Team Projects that you want to keep in sync, you can store the credential to access those two server in [Windows Credential Manager](http://www.codewrecks.com/blog/index.php/2011/03/09/use-credential-manager-to-use-tfs-shell-extension-in-a-workgroup-or-outside-a-domain/), the final configuration should resemble those one in  **Figure 2**.

[![asdfasdfasdf](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/asdfasdfasdf_thumb.jpg "asdfasdfasdf")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/asdfasdfasdf.jpg)

 ***Figure 2***: *Configuration of Integration platform to keep in sync TailSpin toys and another Team project on a portable Virtual Machine.*

Now you can press â€œsave to databaseâ€ and the configuration is ready to be executed simply pressing the start button. When the integration runs, you can be presented with conflicts, this is an example.

> A namespace conflict has been detected between the source and the target system for the following item: $/TailSpinToysPortable/BuildProcessTemplates/UpgradeTemplate.xaml;39

The problem is that the destination Team Process Template already contains that specific file (it is a default file for a Team Project), so you need to resolve these conflicts simply telling to the Integration Platform the changeset you want to keep for each conflicts. Since this is the first synchronization between a full project and an empty one, the only conflict you can find is in the three default build template files.

Now you can stop the synchronization, take the Virtual Machine with you and let call it *REMOTE TFS*. When you are in the remote customerâ€™s site all team members will create a new workspace against *REMOTE TFS*. During the typical working day, the remote team will operate on *REMOTE TFS*, then you need to synchronize everything with the central server when you are able to reach your primary server again. Usually this happens when the team returns to the central office. Now you will open the Integration Platform interface again, open the right synchronization project  and press start again, now all the modification done to *REMOTE TFS* will be migrated to your central TFS.

[![ererqewrqw](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/ererqewrqw_thumb.jpg "ererqewrqw")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/ererqewrqw.jpg)

 ***Figure 3***: *The integration platform tool moves back all changeset to the central TFS machine.*

If you do not create a user mapping between the two machines, you will end up with warning message in the Integration Platform log telling you that it could not find the identity xxxxxxxxxx. This happens if the two tfs does not belongs to the same domain (es. you have no Active Directory in your organization), so you need to manually modify the [XML configuration file adding User mappings](http://www.codewrecks.com/blog/index.php/2010/09/30/keep-codeplex-projects-and-local-tfs-projects-syncronized/). The drawback of not creating the mapping between users is that all check-in are made with the user that you use to connect to TFS in the integration platform. As an example I modified some files on *REMOTE TFS*, then issue a sync and I see that all check-in were made by Abuobe. In this situation you should look at check-in comment to understand witch is the original user that issued this check-in

> modification to the interface (TFS Integration from ‘10.0.0.220 (VC)’ Id: 139;CreationDate: 2011-08-12 16:56:38 UTC;)((Edited by WIN-Y4ONZS094UP\Administrator))

The comment contains the original comment (modification to the interface) as well as complete note from Integration Platform on the original check in date, and the original user that issued the check-in.

To minimize the chance of conflicts during the integration, I strongly suggest to the remote team to create a branch in the original TFS before the synchronization starts, then during remote work they will work on that branch against the *REMOTE TFS*, no one from the central office should touch that branch. Finally when the team returns to the central office you start again synchronization from the Integration Platform and you are sure that no conflict will occour. When the sync is complete, that remote branch is now the â€œreleaseâ€ branch, because it contains the code that is actually running in the customer factory.

If you choose a sync configuration that will keep in sync even the Work Items, the remote team is able to create bug, issue to keep tracks of what is happened during remote development :).

Alk.
