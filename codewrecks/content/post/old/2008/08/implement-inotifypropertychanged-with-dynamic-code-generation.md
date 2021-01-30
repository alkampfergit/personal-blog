---
title: "Implement INotifyPropertyChanged with dynamic code generation"
description: ""
date: 2008-08-04T03:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Code for this post can be found [here](http://www.codewrecks.com/blog/storage/ingen.zip).

[Andrea Saltarello](http://blogs.ugidotnet.org/pape), in [his post](http://blogs.ugidotnet.org/pape/archive/2008/07/29/beyond-persistence-ignorance-real-poco.aspx) of some days ago, told about POCO object and dynamic implementation of INotifyPropertyChanged.

The problem is, how to implement INotifyPropertyChanged with dynamic code generation? The answer is that is quite simple even if we do not relay on Castle.DynamicProxy, here is a simple domain class.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class Customer
{
    public virtual String Property
    {
        get { return property; }
        set { property = value; }
    }
    private String property;

    public virtual Int32 AnotherProp
    {
        get { return anotherProp; }
        set { anotherProp = value; }
    }
    private Int32 anotherProp;  
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now let’s see how you can create a dynamic type that inherits from it, and overrides all virtual properties implementing the INotifyPropertyChanged interface. The first step is to define the event PropertyChanged, so you need three methods, one for the add an event listener, the other for removing the event listener and the final one to raise the event. First step, create all the method info I’ll need for dynamic generation

{{< highlight csharp "linenos=table,linenostart=1" >}}
MethodInfo DelegateCombine = typeof(Delegate).GetMethod("Combine", new Type[] { typeof(Delegate), typeof(Delegate) });
MethodInfo DelegateRemove = typeof(Delegate).GetMethod("Remove", new Type[] { typeof(Delegate), typeof(Delegate) });
MethodInfo InvokeDelegate = typeof (PropertyChangedEventHandler).GetMethod("Invoke");
FieldBuilder eventBack = mTypeBuilder.DefineField("PropertyChanged", typeof(PropertyChangingEventHandler), FieldAttributes.Private);
ConstructorInfo CreateEventArgs = typeof (PropertyChangingEventArgs).GetConstructor(new Type[] {typeof (String)});{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I need Delegate.Combine and Delegate.Remove, then I need the invoke method of the PropertyChangedEventHandler, then I need to create a field named PropertyChanged used to store the delegate and finally I need the constructorInfo for the PropertyChangingEventArgs. Now, armed with these, I begin to create the event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 1 MethodBuilder AddPropertyChanged = mTypeBuilder.DefineMethod(
 2     "add_PropertyChanged", MethodAttributes.Public | MethodAttributes.Virtual | MethodAttributes.SpecialName | MethodAttributes.Final | MethodAttributes.HideBySig | MethodAttributes.NewSlot,
 3     typeof(void), new Type[] { typeof(PropertyChangedEventHandler) });
 4 ILGenerator gen = AddPropertyChanged.GetILGenerator();
 5 gen.Emit(OpCodes.Ldarg_0);
 6 gen.Emit(OpCodes.Ldarg_0);
 7 gen.Emit(OpCodes.Ldfld, eventBack);
 8 gen.Emit(OpCodes.Ldarg_1);
 9 gen.Emit(OpCodes.Call, DelegateCombine);
10 gen.Emit(OpCodes.Castclass, typeof(PropertyChangedEventHandler));
11 gen.Emit(OpCodes.Stfld, eventBack);
12 gen.Emit(OpCodes.Ret);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the code called when an object register a delegate to listen to the event. The IL code is really simple, in line 5 ad 6 load two times the instance of the object on the stack, with line 7 I push on the stack the content of the field storing the actual delegate, then in line 8 I push on the stack the new handler, and then call DelegateCombine. The result was cast to the right type and finally in line 11 I can store the new delegate in the field.

The remove part of the event is similar, it does not worth explanation. The third and final part of the event is the method called to raise the event itself.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 1 MethodBuilder RaisePropertyChanged = mTypeBuilder.DefineMethod(
 2     "OnPropertyChanged", MethodAttributes.Public,
 3     typeof(void), new Type[] { typeof(String) });
 4 gen = RaisePropertyChanged.GetILGenerator();
 5 Label lblDelegateOk = gen.DefineLabel();
 6 gen.DeclareLocal(typeof(PropertyChangedEventHandler));
 7 gen.Emit(OpCodes.Nop);
 8 gen.Emit(OpCodes.Ldarg_0);
 9 gen.Emit(OpCodes.Ldfld, eventBack);
10 gen.Emit(OpCodes.Stloc_0);
11 gen.Emit(OpCodes.Ldloc_0);
12 gen.Emit(OpCodes.Ldnull);
13 gen.Emit(OpCodes.Ceq);
14 gen.Emit(OpCodes.Brtrue, lblDelegateOk);
15 gen.Emit(OpCodes.Ldloc_0);
16 gen.Emit(OpCodes.Ldarg_0);
17 gen.Emit(OpCodes.Ldarg_1);
18 gen.Emit(OpCodes.Newobj, CreateEventArgs);
19 gen.Emit(OpCodes.Callvirt, InvokeDelegate);
20 gen.MarkLabel(lblDelegateOk);
21 gen.Emit(OpCodes.Ret);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This method is a little more complex, but essentially it store the value of the actual delegate in a local variable, then compare it to null to check if someone is interested in the event. If the event handler is not null it simply invoke it, actually raising the event. Now the work is half done, we need to subclass each virtual property, calling this method to raise the event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
foreach (PropertyInfo pinfo in parent.GetProperties(BindingFlags.Public | BindingFlags.Instance))
{
    if (pinfo.GetSetMethod().IsVirtual)
    {
        PropertyBuilder pb = mTypeBuilder.DefineProperty(
            pinfo.Name, PropertyAttributes.None, pinfo.PropertyType, Type.EmptyTypes);
        MethodAttributes getSetAttr =
            MethodAttributes.Public | MethodAttributes.SpecialName |
            MethodAttributes.HideBySig | MethodAttributes.Virtual;
        MethodBuilder getMethod =
            mTypeBuilder.DefineMethod(
                "get_" + pinfo.Name, getSetAttr, pinfo.PropertyType, Type.EmptyTypes);
        ILGenerator gen = getMethod.GetILGenerator();
        gen.Emit(OpCodes.Ldarg_0);
        gen.Emit(OpCodes.Call, pinfo.GetGetMethod());
        gen.Emit(OpCodes.Ret);
        pb.SetGetMethod(getMethod);
        MethodBuilder setMethod =
            mTypeBuilder.DefineMethod(
                "set_" + pinfo.Name, getSetAttr, null, new Type[] { pinfo.PropertyType });
        gen = setMethod.GetILGenerator();
        gen.Emit(OpCodes.Ldarg_0);
        gen.Emit(OpCodes.Ldstr, pinfo.Name);
        gen.Emit(OpCodes.Call, raiseEvent);
        gen.Emit(OpCodes.Ldarg_0);
        gen.Emit(OpCodes.Ldarg_1);
        gen.Emit(OpCodes.Call, pinfo.GetSetMethod());
        gen.Emit(OpCodes.Ret);
        pb.SetSetMethod(setMethod);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This method cycles through all properties, check if the property is virtual, then declare a corresponding property with MethodAttributes.Virtual, actually overriding each virtual property. The get part is really simple, I call the base GetMethod of the class, but in the Set part I first call the raiseEvent (It is loaded with the MethodBuilder of OnPropertyChanged generated method), then I call the setter part of the base class.

The result permits me to run this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
INPCEmit emitter = new INPCEmit();
Type generated = emitter.CreateType("ATEST", typeof(Customer));
Object instance = Activator.CreateInstance(generated);

Customer c = (Customer)instance;
c.Property = "TEST";

INotifyPropertyChanged inpc = (INotifyPropertyChanged)instance;
inpc.PropertyChanged += delegate(Object sender, PropertyChangedEventArgs args)
{ Console.WriteLine("PropertyChanged:" + args.PropertyName); };
c.Property = "TEST";
c.AnotherProp = 22;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I generate the dynamic type with the methods I explained before, then I can create an instance with Activator.CreateInstance, then I can cast it to a Customer (it is a derived class), but I can cast also to a INotifyPropertyChanged and register for the event. The output shows that the dynamic class correctly implements INotifyPropertyChanged

[All the code can be found here.](http://www.codewrecks.com/blog/storage/ingen.zip)

alk.

<!--dotnetkickit-->

Tags: [Reflection.Emit](http://technorati.com/tag/Reflection.Emit) [INotifyPropertyChanged](http://technorati.com/tag/INotifyPropertyChanged) [Dynamic code generation](http://technorati.com/tag/Dynamic%20code%20generation)
