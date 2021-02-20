---
title: "Shim constructors to isolate 'Future Objects'"
description: ""
date: 2012-06-14T15:00:37+02:00
draft: false
tags: [shim,Unit Testing,Visual Studio,VS2012]
categories: [Testing]
---
I’ve already blogged previously about the new Shim Library of Visual Studio 2012

- [Using Shims in Visual Studio to test untestable code](http://www.codewrecks.com/blog/index.php/2012/04/27/using-shims-in-visual-studio-11-to-test-untestable-code/)
- [Shim and InstanceBehavior fallthrough to isolate part of the SUT.](http://www.codewrecks.com/blog/index.php/2012/05/10/shim-and-instancebehavior-fallthrough-to-isolate-part-of-the-sut/)

Now it is time to explore another scenario where shim can save your life. Suppose you are working with Hardware, Es. a barcode reader and you have a class in your system wrote in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class BarcodeReader
{
    public BarcodeReader() { 
        //connect to the hardware, if the hardware is not there 
        //throw an exception
    }

    public String ReadCode() 
    {
        //dialogate with the hardware and get the Barcode
    }
}

{{< / highlight >}}

This class manage the  **connection to a physical BarcodeReader in the constructor** and if  **something went wrong throws an exception** and expose a ReadCode method that ask the Physical reader to read a Barcode. This class is used with the following pattern throughout all the software.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class MyLogic
{
    private BarcodeReader reader;

    public MyLogic() {
        reader = new BarcodeReader();
    }

    public String RetrieveIndustrialCode()
    {
        String rawCode = reader.ReadCode();
        return rawCode.Substring(2, 10);
    }
}

{{< / highlight >}}

MyLogic is a class with some business logic based on the Barcode returned from the call to ReadCode() method, as you can see  **it simply instantiate an instance of BarcodeReader in the constructor and read the code in the RetrieveIndustrialCode Method** used to extract the industrial code from the raw content of the barcode. In this stupid example the algorithm to extract the Industrial Code from the Raw barcode read from the reader is simply reading chars from 2 to 10,  **but in real scenario we could have complex string parsing code that needs to be tested** , but how?? As you can see from the code you can test only when the real hardware is connected to the machine because if a physical reader is not connected the BarcodeReader will throw exception, but  **the most annoying part is that it is impossible to simulate a read during a Unit Test**.

This is another scenario where shims comes to the rescue, just add a fakes assembly (as described in the previous samples) and you can write this test.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Fact]
public void verify_retrieval_of_industrialCode()
{
    using (ShimsContext.Create())
    {
        ShimBarcodeReader.Constructor = @this =>  new ShimBarcodeReader(@this) {
            ReadCode = () => "IC1234567890BLABLABLA",
        };
        MyLogic sut = new MyLogic();
        var industrialCode = sut.RetrieveIndustrialCode();
        Assert.Equal("1234567890", industrialCode);
    }
}

{{< / highlight >}}

Whenever you fake an assembly, each Shim that gets created has one or more static property called ConstructorXXX, where the XXX part is used to distinguish from the overloaded version using paramers type. In this example  **I have a default constructor so my Shim has a static property called Constructor**.  **This specific property permits you to intercept the future creation of that type and even substitute it with a shim**. This specific property needs a lambda where the first parameter is the Instance of the object being created followed by all other parameters of the constructor.  **In my sample test I pass a lambda that based on the instance created, returns a new ShimBarcodeReader configured to return the code “IC1234567890BLABLABLA” from ReadCode() method**.

This technique is really powerful because permits you to Shim every future instance that will be created for a specific object and makes possible to inject Shims almost everywhere. When the test run, the MyLogic constructor creates an instance of BarcodeReader, but thanks to the Shim library I’m able to pass a shim where I’ve already set the return value of ReadCode() method.

Thanks to this capability I can write tests until I eventually found a bug, to show how the Shim Constructor changes when constructor has parameters, I’ve changed the BarcodeReader class to make the constructor accepts a Single String parameter and I want to write a test that verify that when the BarcodeReader returns an Empty String the Industrial code returned is also Empty.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Fact]
public void verify_retrieval_of_industrialCode_too_short()
{
    using (ShimsContext.Create())
    {
        ShimBarcodeReader.ConstructorString = (@this, value) => new ShimBarcodeReader(@this)
        {
            ReadCode = () => "",
        };
        MyLogic sut = new MyLogic("COM2");
        var industrialCode = sut.RetrieveIndustrialCode();
        Assert.Equal("", industrialCode);
    }
}

{{< / highlight >}}

 **To shim the creation of a ShimBarcodeReader I now need to use ConstructorString property** , since the constructor has now a parameter of type String. Thanks to Visual Studio 2012 and Shim Library you can now easily test untestable legacy code with minimum effort.

Gian Maria.
