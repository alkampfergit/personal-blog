---
title: "Change the icon of a folder"
description: ""
date: 2011-04-28T07:00:37+02:00
draft: false
tags: [Programming]
categories: [Programming]
---
I need to change the default icon of Windows Explorer for some special folder inside a my application, I know that it could be done Through Desktop.Ini file, but after some frustrating tentative I did not succeed in using a custom.ico file stored as resource inside the assembly.

It was my fault, because the first resource you should check is MSDN, and when I read the [whole page dedicate to this argument](http://msdn.microsoft.com/en-us/library/cc144102%28v=vs.85%29.aspx) I found my error, I forgot to set the System Bit of the folder. Documentation states that

> Use [**PathMakeSystemFolder**](http://msdn.microsoft.com/en-us/library/bb773726%28v=vs.85%29.aspx) to make the folder a system folder. This sets the read-only bit on the folder to indicate that the special behavior reserved for Desktop.ini should be enabled.

Then the docs explain how you must set file permission

> Create a Desktop.ini file for the folder. You should mark it as *hidden* and *system* to ensure that it is hidden from normal users.
> 
> Make sure the Desktop.ini file that you create is in the Unicode format. This is necessary to store the localized strings that can be displayed to users.

Then you should finish reading all the page because there are the instruction on how to use an ico file stored inside the folder

>  **IconFile** > If you want to specify a custom icon for the folder, set this entry to the icon’s file name. The.ico file name extension is preferred, but it is also possible to specify.bmp files, or.exe and.dll files that contain icons. If you use a relative path, the icon is available to people who view the folder over the network. You must also set the  **IconIndex** entry.
> 
>  **IconIndex** > Set this entry to specify the index for a custom icon. If the file assigned to  **IconFile** only contains a single icon, set  **IconIndex** to 0.

Ok after reading this I wrote the code in a couple of minutes (And I curse myself for wasting half an hour in stupid tentative without reading first the whole documentation)

{{< highlight csharp "linenos=table,linenostart=1" >}}
string iconFileName = Path.Combine(keypath, "Folder.ico");
FileInfo icon = new FileInfo(iconFileName);
if (!Directory.Exists(keypath))
{
Directory.CreateDirectory(keypath);
DirectoryInfo info = new DirectoryInfo(keypath);
info.Attributes = info.Attributes | FileAttributes.System;
}
{{< / highlight >}}

With this code I create the name of the Folder.ico, and if the Directory does not exist, the routine creates it, and set the attribute System (Line 7) this is  **really important,** if you forget to change the attribute, the Destkop.ini file is  **ignored**.

Then I need to create the ini file.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (FileStream fs = new FileStream(iconFileName, FileMode.CreateNew))
{
Properties.Resources.SqlIcon.Save(fs);
}
File.SetAttributes(iconFileName, File.GetAttributes(iconFileName) | FileAttributes.Hidden);
String deskopIniFile = Path.Combine(keypath, "Desktop.ini");
File.WriteAllText(deskopIniFile,
@"[.ShellClassInfo]
IconFile=Folder.ico
IconIndex=0
");
File.SetAttributes(deskopIniFile, FileAttributes.System | FileAttributes.Hidden);
{{< / highlight >}}

First of all I save the icon file thanks to the Save method of the resource, then I hide the icon file (this is not needed, but I do not want the user to see the icon). Then save a simple DesktopIni file, but pay attention to the line 11  **because you need to set IconIndex to 0** , if you forget this, the icon file  **will be ignored**.

Finally you need to hide and set the System attribute to Destkop.ini file, if you forget to set the system attribute the file  **will be ignored**.

The motto of this story is, when you need to do something related to windows, always read with care MSDN documentation, avoiding to do stupid tentatives. (As I said I lost half an hour because I forgot to set the System bit of the Folder ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/wlEmoticon-smile1.png), this was because I simply change an icon to a folder, then look at generated Desktop.ini file, and replicate in code... but it did not work because the folder was not set to system. )

Alk.
