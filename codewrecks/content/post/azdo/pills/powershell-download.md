---
title: "Pills: Invoke-WebRequest really Slow"
description: "If you use Invoke-WebRequest cmdlet in PowerShell to download big binary files, it is sometimes much slower that downloading from a browser."
date: 2020-11-03T22:12:42+02:00
draft: false
categories: ["PowerShell"]
tags: ["Pills"]
---

There are times when using Invoke-WebRequest in PowerShell is really slow, especially compared to a direct download in a browser. The answer is as always on [StackOverflow in this post](https://stackoverflow.com/questions/28682642/powershell-why-is-using-invoke-webrequest-much-slower-than-a-browser-download) but for some reason approved answer is not my favorite.

Approved solution uses WebClient, **it is perfectly valid, but other answer are more correct** (and have more votes). In my opinion the real solution is disabling progress.

```powershell
$ProgressPreference = 'SilentlyContinue'
```

This usually is enough to speedup Invoke-WebRequest without changing every single call to use WebClient.

Gian Maria.