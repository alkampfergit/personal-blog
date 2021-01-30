---
title: "Weak reference to delegate never do it"
description: ""
date: 2011-06-30T14:00:37+02:00
draft: false
tags: [Net]
categories: [NET framework]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2011/04/15/o-reference-from-singleton-why-thou-are-so-subtle/) I explained how I modified the Broker class to store WeakReference to Action&lt;Message&lt;T&gt;&gt; delegate to avoid the broker preventing garbage collection of the subscribers. This is a strong requirement, an object register an handler to the broker, but it does not want to share the same lifecycle of the broker because it is singleton. After this modification I have a strange bug, the program works, but after some minutes messages stops flowing, I scratched my head and then understand that this is normal, because my code that uses a WeakReference to an even is flawed. If you do not understand where the error is, think with care what is happening under the hood.

When an object registers a message listener to the broker, he passes a *Action&lt;Message&lt;T&gt;&gt;* object, and this object is stored by the broker with a WeakReference. The problem is that an Action&lt;T&gt; is a class that inherits from Multicast Delegate, thus is a real object, that as shown in  **Figure 1** keeps a reference to the target object that contains the method to be called.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb28.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image28.png)

 ***Figure 1***: *The implementation of Delegate object taken from Reflector.*

Now let’s look again at the code needed to register a message listener to the broker (line 3).

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Test(Broker broker)
{
broker.RegisterForMessage<String>(this, t => ExecuteMessage(t));
}
{{< / highlight >}}

If you think carefully, this test creates a delegate, pass that delegate to the broker and the brokers stores a WeakReference on it to send message ( **Figure 2** ).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image29.png)

 ***Figure 2***: *The broker stores a WeakReference to delegate in a Registration object, but this is the only reference to the Delegate object.*

The problem is that delegate is referenced only by a WeakDelegate and since no other object have a reference to it, it will be collected by the garbage collector after some time. To verify this problem we can change the code that register for message a little bit.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Test(Broker broker)
{
Registration = broker.RegisterForMessage<String>(ExecuteMessage);
}
 
public Broker.Registration Registration { get; set; }
 
private void ExecuteMessage(Message<string> obj)
{
Interlocked.Increment(ref CallCount);
}
{{< / highlight >}}

The only difference is that the caller stores a reference to the Registration object returned from the RegisterForMessage method, the broker creates a registration object and store a WeakReference on it ( **Figure 3** ). This reference now keeps the delegate alive.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb30.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image30.png)

 ***Figure 3***: *Now the object stores a reference to the registration object, and the broker a WeakReference to the same object*

This is the original desired situation, until *Object* is alive, it takes a reference to the *registration object*, that keeps the delegate and the object alive. When the object is not references by any other root, except from the delegate, the garbage collector verify that the registration/delegate and object could be collected, because Broker has only a WeakReference to the Registration object.

This solution is not perfect, because if â€œobjectâ€ forgot to keep references to Registration object, it will cease to receive message at the first passage of the garbage collector. A possible solution is using reflection to call instance methods.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class WeakRegistration : ActionRegistrationBase
{
private WeakReference<Object> Target { get; set; }
 
private MethodInfo MethodInfo { get; set; }
 
public WeakRegistration(object target, MethodInfo methodInfo)
: base(null)
{
Target = new WeakReference<object>(target);
MethodInfo = methodInfo;
}
 
public override void Execute<T>(Message<T> message)
{
Object target = Target.Target;
if (target != null)
{
MethodInfo.Invoke(target, new object[] { message });
}
}
 
public override bool IsAlive
{
get { return Target.IsAlive; }
}
}
{{< / highlight >}}

There is no secret here, I pass target object and a method info to the constructor and then use Methodinfo.Invoke to call the handler method through reflection. This technique can be used only if the caller pass a call to an instance method, as done in this snippet.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Test(Broker broker)
{
broker.RegisterForMessage<String>(this, t => ExecuteMessage(t));
}
 
private void ExecuteMessage(Message<string> obj)
{
Interlocked.Increment(ref CallCount);
}
{{< / highlight >}}

As you can see Iâ€™m passing to RegisterForMessage both the object (this) and a lambda that calls the method, here is the implementation of this new version of RegisterForMessage.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void RegisterForMessage<T>(Object target, Expression<Action<Message<T>>> action)
{
if (action.Body is MethodCallExpression)
{
MethodCallExpression mex = (MethodCallExpression)action.Body;
if (target != null && mex.Method.DeclaringType == target.GetType())
{
WeakRegistration registration = new WeakRegistration(target, mex.Method);
RegisterForMessage<T>(null, false, registration);
return;
}
}
Action<Message<T>> action1 = action.Compile();
RegisterForMessage<T>(null, false, new ActionRegistration(null, action1));
}
{{< / highlight >}}

This method accepts an Expression, and if the expression is a MethodCallExpression, we can use some Expression manipulation to extract the MethodInfo needed to create an instance of WeakRegistration class. If the Expression is not a methodCAllExpression defined on the same object passed as instance I can compile the expression and pass the compiled Action&lt;Message&lt;T&gt;&gt; to the standard ActionRegistration Object.

This is not a perfect solution, but if the caller restrict itself to register only instance method in the broker, we do not risk any leak.

Alk.
