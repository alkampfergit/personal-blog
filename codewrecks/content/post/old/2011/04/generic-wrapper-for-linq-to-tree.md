---
title: "Generic wrapper for LINQ to Tree"
description: ""
date: 2011-04-05T13:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
In [this post](http://www.codewrecks.com/blog/index.php/2011/03/31/create-a-tree-flatten-function-with-linq/) I dealt with a  simple extension function to flatten a tree and in one of the comment [Robert](http://bobbbloggg.blogspot.com/) shared an [interesting link](http://www.codeproject.com/KB/linq/LinqToTree.aspx) that deal with the creation of a wrapper structure to use LINQ style function on tree structure. That article is really interesting, but the adopted solution requires to create a wrapper for every structure you need to iterate into and I decided to spend a couple of minutes to verify how difficult is writing a generic solution.

Thanks to Func&lt;T&gt; is quite easy to write a wrapper that does not relay on code generation to wrap a specific tree type.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class TreeWrapper<T> where T : class
{
private readonly T _node;
private readonly Func<T, IEnumerable<T>> _getChildernFunc;
private readonly Func<T, T> _getParentFunc;
 
public TreeWrapper(
T node,
Func<T, IEnumerable<T>> getChildernFunc,
Func<T, T> getParentFunc)
{
_node = node;
_getChildernFunc = getChildernFunc;
_getParentFunc = getParentFunc;
}
{{< / highlight >}}

As you can see I created a wrapper that takes a node, and a couple of functions, one to find all child of the element, and the other to find the parent of the node. With this simple wrapper writing a Descendants() function is supereasy.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public IEnumerable<T> Descendants()
{
return Descendants(_getChildernFunc(_node));
}
 
private IEnumerable<T> Descendants(IEnumerable<T> elements)
{
return elements.Concat(
elements.SelectMany(e => Descendants(_getChildernFunc(e))));
}
{{< / highlight >}}

Et voilÃ , this simple method makes this test pass.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void VerifyGenericTreeNodeDescendants()
{
GenericTreeNode r1 = new GenericTreeNode(1,
new GenericTreeNode(2,
new GenericTreeNode(4)),
new GenericTreeNode(3),
new GenericTreeNode(5,
new GenericTreeNode(6), new GenericTreeNode(7)));
 
var w = TreeWrapper.Create(r1, n => n.GenericTreeNodes, n => n.Parent);
w.Descendants().Select(e => e.Id)
.Should().Have.SameSequenceAs(new int[] {2, 3, 5, 4, 6, 7});
}
{{< / highlight >}}

The GenericTreeNode class is used only for testing purpose and is a simple class that maintains a reference to parent and a collection of childs. The ancestors function is even simplier.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public IEnumerable<T> Ancestors()
{
T parent = _getParentFunc(_node);
while (parent != null)
{
yield return parent;
parent = _getParentFunc(parent);
}
}
{{< / highlight >}}

Simply iterate to all parents until the parent is null (reached the root node), but we can still add more interesting methods.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public IEnumerable<T> ElementBeforeSelf()
{
T parent = _getParentFunc(_node);
if (parent != null)
{
return _getChildernFunc(parent)
.TakeWhile(e => e != _node);
}
return new T[] {};
}
 
public IEnumerable<T> ElementAfterSelf()
{
T parent = _getParentFunc(_node);
if (parent != null)
{
return _getChildernFunc(parent)
.SkipWhile(e => e != _node)
.Skip(1);
}
return new T[] { };
}
{{< / highlight >}}

ElementsBeforeSelft() and ElementsAfterSelf() return all sibling elements (node at same level) before and after the current node element, this makes this test pass.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void VerifyGenericTreeElementBeforeSelf()
{
GenericTreeNode node;
new GenericTreeNode(1,
new GenericTreeNode(2,
new GenericTreeNode(4)),
new GenericTreeNode(3),
node = new GenericTreeNode(5,
new GenericTreeNode(6), new GenericTreeNode(7)),
new GenericTreeNode(8),
new GenericTreeNode(9));
 
var w = TreeWrapper.Create(node, n => n.GenericTreeNodes, n => n.Parent);
w.ElementBeforeSelf().Select(e => e.Id)
.Should().Have.SameSequenceAs(new int[] { 2, 3 });
 
w.ElementAfterSelf().Select(e => e.Id)
.Should().Have.SameSequenceAs(new int[] { 8, 9 });
}
{{< / highlight >}}

The only disadvantage of this technique, is that Iâ€™m not able to write something like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
w.Descendants().Single(e => e.Id == 5)
.ElementBeforeSelf().Select(e => e.Id)
.Should().Have.SameSequenceAs(new int[] { 2, 3 });
{{< / highlight >}}

This query simple select a single element and then iterates on all the element before self, but it does not compile, because the Descendants() method returns an IEnumerable&lt;T&gt; (T is the wrapped object) and not a IEnumerable&lt;TreeWrapper&lt;T&gt;&gt;. You could modify the Descendants() function to wrap each returned element, but this is not optimal, so I prefer a simply extension method to rewrap an element, that permits me to write this test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
w.Descendants().Single(e => e.Id == 5)
.TreeWrap(n => n.GenericTreeNodes, n => n.Parent)
.ElementBeforeSelf().Select(e => e.Id)
.Should().Have.SameSequenceAs(new int[] { 2, 3 });
{{< / highlight >}}

This syntax is not bad, the Single LINQ operator permits me to iterate in all Descendants node of the wrapped node, then I need to rewrap again the result to use the ElementBeforeSelf method to use again a function of the TreeWrapper class.

Alk.
