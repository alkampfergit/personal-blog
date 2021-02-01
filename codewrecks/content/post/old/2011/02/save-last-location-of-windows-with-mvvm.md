---
title: "Save last location of windows with MVVM"
description: ""
date: 2011-02-17T15:00:37+02:00
draft: false
tags: [MVVM,WPF]
categories: [WPF]
---
I've a WPF project composed of multiple Views, especially targeted to use multi monitor; the user should be able to position each view around multiple monitors. One of the key requirements is that the software should be able to keep track of the position of all the views to automatically position them in the very same position on opening.

Thanks to MVVM architecture obtaining this result is really simple because we can handle and test the whole logic inside a base viewmodel. I started with the creation of an object that could contain all values to reposition a windows

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Serializable]
public class WindowsPosition : UiObjectBase
{
/// <summary>
///
/// </summary>
/// <value></value>
public Double Left
{
get { return _left; }
set { this.Set(p => p.Left, value, ref _left); }
}
 
private Double _left;
 
/// <summary>
///
/// </summary>
/// <value></value>
public Double Top
{
get { return _top; }
set { this.Set(p => p.Top, value, ref _top); }
}
 
private Double _top;
 
/// <summary>
///
/// </summary>
/// <value></value>
public Double Height
{
get { return _height; }
set { this.Set(p => p.Height, value, ref _height); }
}
 
private Double _height;
 
/// <summary>
///
/// </summary>
/// <value></value>
public Double Width
{
get { return _width; }
set { this.Set(p => p.Width, value, ref _width); }
}
 
private Double _width;
}
{{< / highlight >}}

Then I insert some standard logic inside the base ViewModel, I simply want to store, for each ViewModel, the relative position of the corresponding view, and I can store everything in a simple dictionary using the name of the ViewModel as the key.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static Dictionary<string, WindowsPosition> _positions;
internal static Dictionary<string, WindowsPosition> Positions
{
get { return _positions ?? (_positions = GetPositions()); }
}
private static Dictionary<string, WindowsPosition> GetPositions()
{
try
{
return Serializer.Base64Deserialize<Dictionary<String, WindowsPosition>>(
Properties.Settings.Default.LastClosePositions);
}
catch (Exception)
{
Properties.Settings.Default.LastClosePositions = "";
}
return new Dictionary<string, WindowsPosition>();
}
{{< / highlight >}}

I use an Helper Serializer class that does binary serialization and convert the result in Base64 to store data in a simple String setting of the application to simplify save and load of the new values. Positions readonly property is static and contains all the logic to deserialize data from settings; if any exception occurs we discard everything and create a new empty dictionary for positions.

Now I add a property and some logic in the Dispose to save position of current View.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public override void Dispose(bool isDisposing)
{
Positions[GetType().Name] = Position;
base.Dispose(isDisposing);
}
 
/// <summary>
///
/// </summary>
/// <value></value>
public WindowsPosition Position
{
get { return _position; }
set { this.Set(p => p.Position, value, ref _position); }
}
 
private WindowsPosition _position;
{{< / highlight >}}

Really really simple, now at application exit I serialize the static Positions property of BaseViewModel into the corresponding application user settings and the game is done. To use this feature, we should simply bind windows position to the corresponding properties.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Window
 
...
 
Left="{Binding Position.Left, Mode=TwoWay}"
Top="{Binding Position.Top, Mode=TwoWay}"
Width="{Binding Position.Width, Mode=TwoWay}"
Height="{Binding Position.Height, Mode=TwoWay}">
{{< / highlight >}}

And the view gets repositioned in the same position he was when the application closed itself.

alk.
