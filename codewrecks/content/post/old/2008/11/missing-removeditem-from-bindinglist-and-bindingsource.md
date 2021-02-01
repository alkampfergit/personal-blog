---
title: "Missing RemovedItem from BindingList and BindingSource"
description: ""
date: 2008-11-18T05:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
If you work with Windows Forms you cannot live without binding :D, but something is missing from the base structure. I want to create a simple form with a [BindingSource](http://msdn.microsoft.com/en-us/library/system.windows.forms.bindingsource.aspx), then bind a list of object to a grid and some textboxes to create a master detail form, moreover I set up a simple navigator to make simple for the user navigating the structure, the navigator has the addnew and remove button and the user likes them.

The user can Add and Remove element from the navigator, or directly from a DataGridView, and I simply need to call the appropriate method of Repository to save and delete objects. This structure is really clean, but you encounter a problem: nor the BindingSource nor the [BindingList&lt;T&gt;](http://msdn.microsoft.com/en-us/library/ms132679.aspx) raises a RemovingItem event. I do not know why these classes are designed in this way, you have an [AddingNew](http://msdn.microsoft.com/en-us/library/system.windows.forms.bindingsource.addingnew.aspx) Event in the Binding Source and BindingList&lt;T&gt; but no corresponding RemovingItem. You have a ListChanged event that tells you when an element is removed, but the element is already gone from the list, so you cannot use to detect object removal.

If you look at the events of [BindingList&lt;T&gt;](http://msdn.microsoft.com/en-us/library/ms132740.aspx) you can notice that there is no way to be informed of the exact element that gets removed. A simple solution is to inherit from the BindingList&lt;T&gt;

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class RemoveItemEventArgs : EventArgs
{
    public Object RemovedItem
    {
        get { return removedItem;}
    }
    private Object removedItem;
    public RemoveItemEventArgs(object removedItem)
    {
        this.removedItem = removedItem;
    }
}
public class MyBindingList<T> : BindingList<T>
{
    public event EventHandler<RemoveItemEventArgs> RemovingItem;
    protected virtual void OnRemovingItem(RemoveItemEventArgs args)
    {
        EventHandler<RemoveItemEventArgs> temp = RemovingItem;
        if (temp != null)
        {
            temp(this, args);
        }
    }
    protected override void RemoveItem(int index)
    {
        OnRemovingItem(new RemoveItemEventArgs(this[index]));
        base.RemoveItem(index);
    }
    public MyBindingList(IList<T> list) : base(list)
    {
    }
    public MyBindingList()
    {
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see implementing such a functionality is a breeze, you should simply override the RemoveItem method and raise a custom RemovingItem event. Now I can use this new BindingList in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
MyBindingList<UIDomainProxy> source = new MyBindingList<UIDomainProxy>(
    Repository<Domain>.GetAll().Select(d => new UIDomainProxy(d)).ToList());
source.AddingNew +=source_AddingNew;
source.RemovingItem +=source_RemovingItem;
domainBindingSource.DataSource = source;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I gets all the element from the repository, then I wrap then in a UIProxy (I'll explain this in a future post), then I intercept the addingNew and RemovingItem events simply calling Save and Delete methods from the repository. Finally I set the BindingList as the source of the BindingSource created by the designer.

I wonder why this event is missing from the basic BindingList&lt;T&gt; implementation.

alk.

Tags: [" rel=tag&gt;BindingList](http://technorati.com/tag/BindingList&lt;T&gt;) [.NET](http://technorati.com/tag/.NET) [Binding](http://technorati.com/tag/Binding) [Windows Forms](http://technorati.com/tag/Windows%20Forms)
