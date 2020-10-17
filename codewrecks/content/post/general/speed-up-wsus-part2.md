---
title: "Speedup WSUS in your AD (Part 2)"
description: "If you have WSUS and performance are horrible, sometimes manual intervention is the only thing you can do"
date: 2020-10-17T08:00:00+02:00
draft: false
tags: ["windows"]
categories: ["General"]
---

After I did some maintenance on my WSUS [with some tricks](http://www.codewrecks.com/post/general/speed-up-wsus/) I still had problem, after hours of cleanup, PowerShell script stopped working and constantly gave me a timeout.

![WSUS was unable to perform cleanup](../images/wsusl-unable-to-clean.png)
***Figure 1:*** *WSUS was unable to perform cleanup*

I did not had time to investigate the issue, but I got saved in my disk a small notes I've found somewhere that suggested how to **cleanup manually directly with SQL**.

{{< highlight SQL "linenos=table" >}}
EXEC spGetObsoleteUpdatesToCleanup
EXEC spDeleteUpdate @localUpdateID=<LocalUpdateID>
{{< / highlight >}}

In such situation my temptation to wipe out everything and start a new WSUS is really high, but I always resort on spending a **little time trying to do some manual tentative**. I've started looking at how the stored procedure is defined.


{{< highlight SQL "hl_lines=13,linenos=table" >}}
ALTER PROCEDURE [dbo].[spGetObsoleteUpdatesToCleanup]
AS
SET NOCOUNT ON
DECLARE @minimumDeadDeploymentTime DATETIME
DECLARE @revisionDeletionTimeThreshold INT
SELECT @revisionDeletionTimeThreshold=RevisionDeletionTimeThreshold FROM dbo.tbConfigurationC
IF @@ERROR <> 0
BEGIN
    RAISERROR('spGetObsoleteUpdatesToCleanup: failed to get RevisionDeletionTimeThreshold from dbo.tbConfigurationC', 16, -1)
    RETURN (1)
END
SET @minimumDeadDeploymentTime = DATEADD(day, 0 - @revisionDeletionTimeThreshold, getutcdate())
SELECT DISTINCT u.LocalUpdateID FROM  dbo.tbUpdate u
    INNER JOIN dbo.tbRevision r ON r.LocalUpdateID = u.LocalUpdateID
    INNER JOIN dbo.tbProperty p ON p.RevisionID = r.RevisionID
WHERE
     p.PublicationState = 1 
     AND (p.ExplicitlyDeployable = 1 OR p.UpdateType IN ('Category', 'Detectoid'))
     AND p.ReceivedFromCreatorService <= @minimumDeadDeploymentTime
     AND NOT EXISTS (SELECT * FROM dbo.tbBundleDependency bd 
                     INNER JOIN dbo.tbRevision r1 ON bd.BundledRevisionID = r1.RevisionID
                     WHERE r1.LocalUpdateID = u.LocalUpdateID)
     AND NOT EXISTS (SELECT * FROM dbo.tbPrerequisiteDependency pd
                     INNER JOIN dbo.tbRevision r2 ON pd.PrerequisiteRevisionID = r2.RevisionID
                     WHERE r2.LocalUpdateID = u.LocalUpdateID)
     AND NOT EXISTS (SELECT * FROM dbo.tbDeployment d
                     INNER JOIN dbo.tbRevision r3 ON d.RevisionID = r3.RevisionID
                     WHERE r3.LocalUpdateID = u.LocalUpdateID
                         AND d.TargetGroupTypeID = 0
                         AND d.ActionID IN (0, 1, 3))
     AND NOT EXISTS (SELECT * FROM dbo.tbDeadDeployment dd
                     INNER JOIN dbo.tbRevision r4 ON dd.RevisionID = r4.RevisionID
                     WHERE r4.LocalUpdateID = u.LocalUpdateID
                         AND dd.TargetGroupTypeID = 0
                         AND dd.ActionID IN (0, 1, 3)
                         AND dd.TimeOfDeath > @minimumDeadDeploymentTime)
ORDER BY u.LocalUpdateID DESC
RETURN (0)
{{< / highlight >}}

This some pretty standard SQL, **nothing obvious stands out**, but one thing bothers me a lot: **line 13 does a distinct and does not limit output in any way**. This is perfectly fine, but this forces the query to examine all the updates to **find all the candidates to delete**. So I duplicated the stored, and instead of a SELECT DISTINCT I used a simple SELECT top 100 to limit record to return.

> Limiting the number of obsolete update to retrieve is perfectly fine for me, I can cleanup in batches.

Launching the new stored procedure I got a pleasant surprise, because it took only 10 seconds to give me the first 100 updates to delete. **Clearly some of the results are duplicated, I got the same update more than one time, but nevertheless I was able to got 89 unique results and immediately proceed to cleanup those ones**.

The strategy of cleaning up in batch can be tedious, but it can be automated with a simple cursor and in my situation it seems that it is the only way to go to cleanup my server.

Clearly this is probably my last manual intervention on WSUS, the next problem will determine the end of it, I'll move to a new server, **more powerful hardware hoping to have an usable installation**.

> As always, if you plan on using WSUS server, consider having it virtualized to move to a more powerful hardware if needed [or at least for cleanup](http://www.codewrecks.com/blog/index.php/2015/08/04/cleaning-up-your-wsus-server/)

If you wonder what is the most resources used by WSUS, at least in my experiences, **it is always CPU**. This is usage of the computer during the cleanup procedures, it is constantly using both the CPU and still has plenty of memory. Disks are not impacted.

![WSUS resource usage](../images/wsus-resources-usage.png)

***Figure 2:*** *WSUS resource usage*

Gian Maria.
