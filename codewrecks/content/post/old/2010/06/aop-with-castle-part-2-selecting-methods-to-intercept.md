---
title: "Aop With castle ndash Part 2 ndash Selecting methods to intercept"
description: ""
date: 2010-06-08T13:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
Previous Part of the series

[Part 1 â€“ The basic of interception](http://www.codewrecks.com/blog/index.php/2010/06/01/aop-with-castle-part-1/)

Some people, after looking at interceptor concept, are not fully convinced that castle can support all concepts of AOP and the first question usually is: â€œHow can I choose witch method intercept, instead of intercepting calls to all methods, and how can I configure this with XML file or fluent configuration?â€. This answer can have various solutions, but in my opinion the simplest one is doing a little manual logic on interceptor.

Since the interceptor is resolved by castle it is possible to add a list of valid regular expressions used to select methods to intercept, and simply check the method name to decide if it needs to be intercepted. This approach is the most simple one because it is based only on the basic structure of castle, and it has the advantages of change the list of methods to intercept simply changing the configuration of the interceptor. You can put this code on an interceptor or create a base interceptor class that contains the base logic.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class BetterDumpInterceptor : IInterceptor
{
public List<String> RegexSelector { get; set; }
 
public void Intercept(IInvocation invocation)
{
if (!CanIntercept(invocation)) {
invocation.Proceed();
return;
}
{{< / highlight >}}

This is a simple example on how you can filter method to intercept, the CanIntercept() can be implemented in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private Boolean CanIntercept(IInvocation invocation)
{
if (RegexSelector == null || RegexSelector.Count == 0) return true;
foreach (var regex in RegexSelector)
{
if (Regex.IsMatch(invocation.Method.Name, regex))
return true;
}
return false;
}
{{< / highlight >}}

The only modification is during registration, because now you need to specify the list of regexes to identify methods that needs to be intercepted

{{< highlight csharp "linenos=table,linenostart=1" >}}
container.Register(
Component.For<IInterceptor>()
.ImplementedBy<BetterDumpInterceptor>()
.Named("myinterceptor")
.DependsOn(Property.ForKey("RegexSelector").Eq(new List<String>() { "DoSomething" })));
{{< / highlight >}}

This is really a simple solution, and you can verify from the output that only selected methods are intercepted.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image16.png)

In red I highlighted the calls to regex.Match(), and since they are a little bit expensive, to speedup execution we can add caching using a dictionary, to store result of methods already scanned, just to avoid using too much regex at each call; the basic concept is always the same:

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class BetterDumpInterceptor : IInterceptor
{
public List<String> RegexSelector { get; set; }
 
private Dictionary<RuntimeMethodHandle, Boolean> _scanned
= new Dictionary<RuntimeMethodHandle, bool>();
{{< / highlight >}}

I stored the result of the CanIntercept directly in a dictionary, and I use RuntimeMethodHandle just to save a little bit of memory not storing the full MethodInfo object. Then I modify the CanIntercept function in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private Boolean CanIntercept(IInvocation invocation)
{
if (!_scanned.ContainsKey(invocation.Method.MethodHandle))
{
if (RegexSelector == null || RegexSelector.Count == 0) return true;
foreach (var regex in RegexSelector)
{
if (Regex.IsMatch(invocation.Method.Name, regex))
{
_scanned[invocation.Method.MethodHandle] = true;
return true;
}
}
_scanned[invocation.Method.MethodHandle] = false;
}
return _scanned[invocation.Method.MethodHandle];
}
{{< / highlight >}}

Now the same configuration produces this output.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image17.png)

As you can see the regex are called only for the first call of a method, each subsequent calls does not requires Regex.Match anymore.

And with this little trick I simply end with an interceptor that permits to select methods you want to intercept with configuration.

If you do not like doing this manually, Castle offers a native way to decide which method to intercept, based on the interface IInterceptorSelector, that contains a single method with this signature.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public IInterceptor[] SelectInterceptors(Type type, System.Reflection.MethodInfo method, IInterceptor[] interceptors)
{{< / highlight >}}

Basically it receives the Type and MethodInfo for the method being called, and a list of interceptors configured for that method, the purpose of the selector is to return an array containing only the interceptors that are allowed to be used on that method. A possible implementation is the following one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Dictionary<Type, List<String>> RegexSelector { get; set; }
 
public InterceptorSelector(Dictionary<Type, List<string>> regexSelector)
{
RegexSelector = regexSelector;
}
 
private Boolean CanIntercept(MethodInfo methodInfo, IInterceptor interceptor)
{
List<String> regexForInterceptor;
if (!RegexSelector.TryGetValue(interceptor.GetType(), out regexForInterceptor))
return false;
if (regexForInterceptor == null) return false;
 
foreach (var regex in regexForInterceptor)
{
if (Regex.IsMatch(methodInfo.Name, regex))
{
return true;
}
}
return false;
}
 
#region IInterceptorSelector Members
 
public IInterceptor[] SelectInterceptors(Type type, System.Reflection.MethodInfo method, IInterceptor[] interceptors)
{
Utils.ConsoleWriteline(ConsoleColor.Red, "Called interceptor selector for method {0}.{1} and interceptors {2}",
type.FullName,
method.Name,
interceptors
.Select(i => i.GetType().Name)
.Aggregate((s1, s2) => s1 + " " + s2));
return interceptors.Where(i => CanIntercept(method, i)).ToArray();
}
 
#endregion
{{< / highlight >}}

This selector contains a dictionary of Type and List&lt;String&gt;, basically for each interceptor type it contains a list of regex to identify methods to be intercepted. The rest of the selector is really simple, with a little bit of LINQ we can select only the interceptors that are in the dictionary and have at least one match with the method name. You can use it in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Dictionary<Type, List<String>> RegexSelector = new Dictionary<Type, List<string>>();
RegexSelector.Add(typeof(DumpInterceptor), new List<string>() { "DoSomething" });
RegexSelector.Add(typeof(LogInterceptor), new List<string>() { "Augment" });
InterceptorSelector selector = new InterceptorSelector(RegexSelector);
{{< / highlight >}}

I created a selector that permits to select a couple of interceptors, one is the DumpInterceptor, and I want it to intercept the â€œDoSomethingâ€ method, while the LogInterceptor should intercept only the â€œAugmentâ€ method. Once the selector is configured you can simply use it in fluent configuration.

{{< highlight csharp "linenos=table,linenostart=1" >}}
container.Register(
Component.For<IInterceptor>()
.ImplementedBy<DumpInterceptor>()
.Named("DumpInterceptor"));
container.Register(
Component.For<IInterceptor>()
.ImplementedBy<LogInterceptor>()
.Named("LogInterceptor"));
 
container.Register(
Component.For<ISomething>()
.ImplementedBy<Something>()
.Interceptors(
InterceptorReference.ForKey("DumpInterceptor"),
InterceptorReference.ForKey("LogInterceptor"))
.SelectedWith(selector).Anywhere);
{{< / highlight >}}

Now you can run the program and look at the output.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image18.png)

With red color I highlight the calls to the SelectInterceptors method, and you can immediately see that Castle does caching internally and does not call the SelectInterceptors() method more than once for each method, so we does not need to cache stuff. As you can see from the output the result is the one I expect, dumpInterceptor is intercepting only the method DoSomething while the LogInterceptor intercepts only the Augment.

You can use the approach you prefer.

Alk.
