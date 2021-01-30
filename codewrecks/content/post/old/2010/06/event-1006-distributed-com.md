---
title: "Event 1006 Distributed Com"
description: ""
date: 2010-06-08T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
In a Tfs Test machine I have I see that there are error in the System log

> The application-specific permission settings do not grant Local Activation permission for the COM Server application with CLSID {&lt;CLSID&gt;} to the user &lt;user&gt; SID (&lt;SID&gt;). This security permission can be modified using the Component Services administrative tool.

To solve this problem simply open â€œComponent Servicesâ€ tool, expand the Computers/MyComputer/DCOMConfig, then locate the entry with the CLSID you find in the message, then right click and select property

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image13.png)

This will open a property windows, you need to locate the Security Tab, and customize the â€œLaunch and Activation Permissionsâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image14.png)

From here add to the user the required security permission and the Error Log should not appears anymore.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image15.png)

alk.
