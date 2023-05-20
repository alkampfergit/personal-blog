---
title: "Team Foundation Service december update"
description: ""
date: 2011-12-11T07:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
One of the great advantage of using Tfs on Azure, called Team Foundation Service, is that you never should worry for update of the server, because everything is managed by the TFS team. If you already have an account, you probably noticed that the UI is radically changed, as described in [Brian Harry’s post](http://blogs.msdn.com/b/bharry/archive/2011/12/08/december-refresh-of-the-team-foundation-service.aspx), new features were added, a new UI is available and everything was done without any need for you intervention.

Another advantage of this approach, is that we can benefit from regular updates of TFS, instead of waiting for 2 years before the next release is available. As Brian stated

> We are now trying to transition our “major” update cycle to monthly.  I won’t promise that we’ll have major new features every month but we’re going to try to move to a cadence where we have new features show up in more months than not.

This is really cool and is another great advantage of using Team Foundation Service. In this new release, alerts were introduced:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image.png)

 ***Figure 1***: *The alert control panel.*

The alerting system is something that is available in TFS from long time, but it was not available on the Team Foundation Service until this release, mainly because it needs a complete new Web Interface to manage alters. (Actually in TFS 2010 you can manage alerts from Visual Studio). As an example, this is the interface that permits you to add an alert whenever someone do a check-in in the project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image1.png)

 ***Figure 2***: *All possible check-in alert available in Team foundation Service*

The cool part is that everything is done from a Web Interface that is fast, fluid and really efficient, when you select a check-in rule (in figure2 I choose to have an alert when any checkin occurs) another dialog permits me to refine the alert.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image2.png)

 ***Figure 3***: *Check-in alert rule dialog.*

As you can see, setting an alert on checkin is matter of few clicks. Clearly you can setup alerts for Work Items modification, for Builds and for Code Reviews (a new feature of next version of VS+TFS).

If you did not subscribe yet to this preview, check Brian’s post with a new invitation code (TfsDecUpdate), you can [find details here](http://blogs.msdn.com/b/bharry/archive/2011/12/09/a-new-invite-code-for-the-team-foundation-service.aspx).

Gian Maria.
