---
title: "Open a windows in a specific monitor in full screen mode in a WPF application"
description: ""
date: 2013-01-05T09:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
If you have a Multi Monitor setup in Windows and you want to open a WPF window in  **fullscreen in a specific monitor you have no native option** , but it is quite simple to obtain such functionality. First of all you need to reference Winform assembly, because you need winform code to identify information for screens setup in the current system.

In my requirements I need to store the position of every view at the time of last usage, so I can restore its position when the user will open it a second time and I need to support fullscreen and multi-monitor setup.

I decided to save the name of the screen of each View in a dictionary as well as windows coordinates and **a boolean that tells me if its maximized**. The code to detect this kind of information is really simple, if the window is not maximized I need only to store Top, Left, Height and Width property,  **if it is maximized I need to find the name of the monitor where the windows is maximized into** {{< highlight csharp "linenos=table,linenostart=1" >}}


position.IsMaximized = true;
var allScreens = System.Windows.Forms.Screen.AllScreens.ToList();
var locationScreen = allScreens.SingleOrDefault(s => this.Left >= s.WorkingArea.Left && this.Left < s.WorkingArea.Right);
if (locationScreen != null)
{
    position.DeviceName = locationScreen.DeviceName;
}

{{< / highlight >}}

All windows create a Position object on OnClosed method and that information is stored in application settings. Whenever a view is opened, if a previous Position object is present you can restore the position of the form with simple code, first of all identify  **the name of the screen where the form was at the time of closing** {{< highlight csharp "linenos=table,linenostart=1" >}}


var allScreens = System.Windows.Forms.Screen.AllScreens.ToList();
var screen = allScreens.SingleOrDefault(s => s.DeviceName == positionInfo.DeviceNameAtTimeOfClosing
);

{{< / highlight >}}

 **If the form was closed when it is not in full screen the code to restore the position is really trivial** , because I need only to restore the four positioning properties. This code fully supports multi monitor, because even if you have more than one monitor configured, you have only one coordinate system, as an example  **if you have a monitor to the left of your primary monitor, the Left position of the windows will be negative**. This lead to the fact that to support multi monitor setup you needs only to save and restore the standard four positioning properties.

{{< highlight vb "linenos=table,linenostart=1" >}}


viewBase.Left = position.X;
viewBase.Top = position.Y;
viewBase.Width = position.Width;
viewBase.Height = position.Height;
viewBase.WindowState = WindowState.Normal;

{{< / highlight >}}

ViewBase is a base class that every Window inherit from; this code is not MVVM like, but when it is time to handle positioning and other windows properties, using a base class is a simpler alternative that doing all this logic in a Base View Model and position the windows with Binding. I’ve blogged some time ago on how to [save last location of Windows object with MVVM](http://www.codewrecks.com/blog/index.php/2011/02/17/save-last-location-of-windows-with-mvvm/), but that solution did not implement the support for fullscreen and it is quite tedious to use.

 **If the form was closed while it was in full screen to restore it in the original screen you need a slightly different code,** because simply restoring coordinates is clearly not enough.

{{< highlight csharp "linenos=table,linenostart=1" >}}


viewBase.WindowState = System.Windows.WindowState.Normal;
viewBase.Left = screen.WorkingArea.Left + 10;
viewBase.Top = screen.WorkingArea.Top + 10;
viewBase.WindowState = System.Windows.WindowState.Maximized;

{{< / highlight >}}

The trick is to be *sure that the windows is in NormalState, then  position the upper left corner of the windows inside the chosen screen, with an offset of a slightly amount of pixel (in this example 10), finally you can change the WindowState to maximize the window, and it will be maximized in your screen of choice*. This code works because when a window is maximized the system maximize it automatically in the screen where it is placed.

 **This code is one of the primary reason why a full MVVM approach does not works well**. This code should be run when the windows is fully initialized and after some tentative, I found that the safest solution is to be able to handle windows events like OnInitialized instead of relaying only on binding and MVVM when it is time to manage window positioning and full screen restore.

*All this logic is inside a base class and all I need to do is inherit all View from this class called ViewBase, instead of using standard Window class and all the rest is automatic*. I found this approach simpler than binding Top, Left, WindowsState, etc window properties to MVVM.

Alk.
