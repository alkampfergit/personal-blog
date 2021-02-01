---
title: "Filtering in MVVM architecture"
description: ""
date: 2011-02-23T18:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
Wpf has great filtering capabilities based on [CollectionViewSource](http://msdn.microsoft.com/en-us/library/system.windows.data.collectionviewsource.aspx) class, but how can we use effectively in MVVM architecture? First of all we need to decide who has the responsibility of filtering data, and clearly the answer is: the ViewModel. VM  usually exposes an ObservableCollection&lt;T&gt; property for collections of items, the view bind to it and everything goes smooth, until you need to set a filter on it. A possible solution is to grab a reference to an ICollectionView in the viewmodel and manipulate that object

{{< highlight csharp "linenos=table,linenostart=1" >}}
ListCollectionView lcv = CollectionViewSource.GetDefaultView(myCollection) as ListCollectionView;
lcv.SortDescriptions.Add(new SortDescription(â€¦));
{{< / highlight >}}

I do not like very much this approach, are you sure that a valid default view exists during a UnitTest? So lets examine another possible solution.

Suppose you have a view that has a ListView currently bound to a property of ViewModel called  **Links** , and this property is an *ObservableCollection&lt;T&gt;,* suppose also that you need to filter content based on a property called  **Status**. What I want is â€œno codeâ€ on the View, and minimum impact on the already existing view, I want also the ability to test the filter function with a unit test.

For the first requirements, it is enough to expose to the view â€œsomethingâ€ bindable in the same property name ( **Links)** , since my ViewModel has an ObservableCollection&lt;SingleAnalysisLink&gt; called Links, I changed the viewmodel in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
internal ObservableCollection<SingleAnalysisLink> InnerLinks { get; set; };
 
internal CollectionViewSource CvsLinks{get; set; }
 
public ICollectionView Links
{
get { return CvsLinks.View; }
}
{{< / highlight >}}

The real ObservableCollection is now internal, then I added a CollectionViewSource property and finally the Links readonly property that return the View of the CollectionViewSource property (that is perfectly bindable). Now during VM initialization I need to setup everything.

{{< highlight csharp "linenos=table,linenostart=1" >}}
InnerLinks = new ObservableCollection<SingleAnalysisLink>();
CvsLinks = new CollectionViewSource();
CvsLinks.Source = InnerLinks;
CvsLinks.Filter += ApplyFilter;
{{< / highlight >}}

I create the ObservableCollection, the new CollectionViewSource and add the collection to the source, then bound the event ApplyFilter wrote this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
void ApplyFilter(object sender, FilterEventArgs e)
{
//each item is a specific object
SingleAnalysisLink si = (SingleAnalysisLink) e.Item;
if (StatusFilter == null)
{
e.Accepted = true;
} else
{
e.Accepted = si.Status == StatusFilter;
}
}
public SingleAnalysisStatus? StatusFilter
{
get { return _statusFilter; }
set {
this.Set(p => p.StatusFilter, value, ref _statusFilter);
OnFilterChanged();
}
}
private SingleAnalysisStatus? _statusFilter;
private void OnFilterChanged()
{
CvsLinks.View.Refresh();
}
{{< / highlight >}}

The function ApplyFilter filters object based on another property of the VM called StatusFilter, of the same type of the enum property used in the bound object. In the setter part of the StatusFilter property simply call a function that refresh the view. Now I can simply add a combo in the View, bind the SelecteValue property to the StatusFilter VM property and without any other change I've added filtering capabilities to the View.

The cool part is that I'm able to write unit test that verify filtering capabilities.

{{< highlight csharp "linenos=table,linenostart=1" >}}
...
sut.AddUrlToAnalyze(link);
sut.AddUrlToAnalyze(link2);
 
link2.Status = SingleAnalysisStatus.Match;
sut.StatusFilter = SingleAnalysisStatus.Match;
sut.Links.OfType<SingleAnalysisLink>()
.Count().Should().Be.EqualTo(1);
{{< / highlight >}}

I've added two SingleAnalysisLink to the VM, then change the status of only one of them to Match, set a filter to show only item with status == Match and assert that the count of items of the view is Equal To 1.

alk.
