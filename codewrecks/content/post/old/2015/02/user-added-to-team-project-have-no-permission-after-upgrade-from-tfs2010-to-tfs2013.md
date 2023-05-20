---
title: "User added to Team Project have no permission after upgrade from TFS2010 to TFS2013"
description: ""
date: 2015-02-24T07:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
I’ve performed an upgrade from TFS2010 to TFS2013 at a customer site last week. The upgrade consisted in  **moving to a different machine and from a Workstation to an Active Directory Domain**. The operation was simple, because the customer uses only Source Control and they want to spent minimal time in the operation, so we decided for this strategy

1. *Stop TFS in the old machine*
2. *Backup and restore db in the new machine*
3. *Upgrade and verify that everything works correctly*

They do not care about user remapping, or reporting services or other stuff, they just want to do a  **quick  migration to new version to use local workspaces new feature** (introduced with TFS 2012). The do not care to remap old user to new user, they only care not to spend too much time in the upgrade.

The upgrade went smoothly, but we start facing a couple of problem. The first one is: after the migration, each team project has no user, because the machine is now joined to a domain with different users, but  **if we add users to a team project, they are not able to connect to team project, and they seems to have no permission**. All the users that are Project collection Administrators can use TFS with no problem.

The reason is simple, in TFS2012 the concept of *Teams* was introduced in the product. Each Team Project can have multiple Teams and when you add users from the home page of the Team, you are actually adding people to a TFS Group that correspond to that Team. For each Team Project a default Team with the same name of the Team Project is automatically created.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image2.png)

 ***Figure 1***: *Users added to Team through home page.*

In the above picture, I’ve added two user to the BuildExperiments Team, we can verify this in the Settings page of the Team Project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image3.png)

 ***Figure 2***: *User added through the home page, are added to the corresponding Tfs Security Group*

To understand the permission of that users, you should use the administration section of TFS, as you can see from Figure 3, BuildExperiments team has no permission associated.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image4.png)

 ***Figure 3***: *Permission associated to the Team Group*

The reason for this is: the Team is not part of the Contributors TFS Group, it can be verified from the  **Member Of** part of group properties

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image5.png)

 ***Figure 4***: *Team group belongs only to the Project Valid User*

**When you create a new Team Project, the default team (with the same name of the Team Project) is automatically added to the *Contributors*group**, it is that team that gives user the right to access the Team Project. To fix the above problem you can manually add the Team Tfs Group to the *Contributors*group using the *Join Group*button. Once the Team group is added to the Contributors group, all the people you add with web interface are now able to access the Team Project.

This behavior is the standard in TFS, if you create a new Team, the Ui suggests you to choose to add the new Team Group to an existing group to inherit permission.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/02/image6.png)

 **Team 5:** *Default option for a new group is to be part of the Contributors group.*

This is an optional choice, you can choose a different security group or you can choose no group, but you should then remember to explicitly add permission to the corresponding Team Group.

*When people does not access TFS and you believe that they should, always double check all the groups they belong and the effective permissions associated to them.*

Gian Maria.
