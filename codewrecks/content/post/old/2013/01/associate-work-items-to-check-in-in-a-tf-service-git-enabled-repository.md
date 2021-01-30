---
title: "Associate Work Items to check-in in a TF Service Git enabled repository"
description: ""
date: 2013-01-31T20:00:37+02:00
draft: false
tags: [Git,TF Service]
categories: [Team Foundation Server]
---
Even if we are still in preview,  **Git support in TF Service already has some nice integration between git and all the rest of the world of TFS**. As an example suppose you have a Work Item you are working to.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image11.png)

 ***Figure 1***: *Simple Work Item in web interface*

Now suppose you  **want to associate a local commit to this Work Item** , all you need to do is  **inserting hashtag followed by the id of the Work Item in the comment of the commit** , es #437. Since we are in the first preview of Git support actually there is no UI support, but using a simple comment is really quick and simple.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image12.png)

 ***Figure 2***: *A commit that contains a reference to a Work Item*

Now when you push changes to the TF Service, the commit will be associated to the corresponding Work Item, as you can see from Web Interface Code browser.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image13.png)

 ***Figure 3***: *The Commits explorer window shows associated Work Item and all other details of the commit*

As you can verify from  **Figure 3** , you are able to visualize  **all the details of the commit with related Work Items included**. You can click the link to the Work Item and you are bring to the Work Item editor where you can verify that the association is correctly done directly to the Work Item.

[![SNAGHTML19a523c](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/SNAGHTML19a523c_thumb.png "SNAGHTML19a523c")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/SNAGHTML19a523c.png)

 ***Figure 4***: *Commit is correctly associated with a Commit Link to the related Work Item*

The association is not only in the commit explorer, but a real link is created between the Work Item artifact and the commit in code, as it happens in standard TFS VCS where the link points to a changesetid.

Gian Maria.
