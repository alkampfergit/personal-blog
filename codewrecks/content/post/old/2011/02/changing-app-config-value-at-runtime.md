---
title: "Changing appconfig value at runtime"
description: ""
date: 2011-02-11T15:00:37+02:00
draft: false
tags: [Net]
categories: [NET framework]
---
Sometimes there is the need to modify the value of some part of the configuration file of a.NET application at runtime, this is an example: I have a software that read some content from xml files, and have several paths listed in the AppSettings section of application configuration file.

During the very first run the software should extract xml data from a zip file to a directory chosen by the user, then the software should update all these settings to reflect this changes. Here is the code

{{< highlight csharp "linenos=table,linenostart=1" >}}
DirectoryInfo di = new DirectoryInfo(xmlFileLocation)
Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
foreach (KeyValueConfigurationElement setting in config.AppSettings.Settings)
{
if (setting.Key.StartsWith("docroot"))
{
setting.Value = di.FullName;
}
}
config.Save(ConfigurationSaveMode.Modified);
ConfigurationManager.RefreshSection("appSettings");
{{< / highlight >}}

With this code I cycle to all path that begins with docroot, (there are many of them in app.config) and then change all of them pointing to the new folder, then save the application config again.

alk.
