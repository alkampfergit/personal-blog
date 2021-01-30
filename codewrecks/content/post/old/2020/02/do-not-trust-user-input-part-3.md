---
title: "Do not trust user input part 3"
description: ""
date: 2020-02-19T18:00:37+02:00
draft: false
tags: [Security]
categories: [security]
---
In [part 2](http://www.codewrecks.com/blog/index.php/2020/01/29/do-not-trust-user-input-part-2/) we continued our journey to prevent malicious users to receive dangerous data, limiting customer id to be a 5 letters string value. We have two aspect to improve because usually I got 2 complains when I show that code.

First one:  **Customer object, has a composite id, serialized value is somewhat clumsy to access from client code** as you can see in  **Figure 1**. Second: if you forget to create a CustomerId from value passed from the user, you are still victim of SQL Injection.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-25.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-25.png)

 ***Figure 1***: *Returned object has a composite id property.*

One possible solution is rewriting the CustomerId class to use a custom JsonConverter, capable of serializing / deserializing id object with custom code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[JsonConverter (typeof (CustomerIdClassConverter))]
public class CustomerId {
  private String _id;
  public CustomerId () { }

  public CustomerId (String customerId) {
    Id = customerId;
  }

  public String Id {
    get { return _id; } 
    set {
      if (value.Length != 5)
        throw new ArgumentException ("Invalid Id");
      if (value.Any (c = & gt; !Char.IsLetter (c))) throw new ArgumentException ("Invalid Id");
      _id = value;
    }
  }
}

{{< / highlight >}}

This is not a perfect solution, because, as you can see, **I inserted a default constructor that allows creation of an object with null id and I moved all validation inside setter of the property**. Sadly enough, default constructor is required from ASP.NET to allow people to directly bind the id to a get parameter.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-26.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-26.png)

 ***Figure 2***: *Thanks to CustomerId default constructor I can bind the id directly with get parameter*

Code in Figure 2 works because FromQuery simply create the object with default constructor, then it simply proceed to assign every property by convention with Get parameters.  **This allows you to create a nice Get request** [**http://localhost:5010/api/v1/QueryExample/GetCustomer?id=ALFKI**](http://localhost:5010/api/v1/QueryExample/GetCustomer?id=ALFKI) **but it introduces a default constructor that completely violates every good practice** , you can create a Customer Id with a null value.

Since I value protecting my object my final solution would be this one:

{{< highlight csharp "linenos=table,linenostart=1" >}}


[JsonConverter (typeof (CustomerIdClassConverter))]
public class CustomerId 
{
  private String _id;

  public String Id => _id;

  public CustomerId (String customerId) 
  {
    if (customerId.Length != 5)
      throw new ArgumentException ("Invalid Id");

    if (customerId.Any (c = & gt; !Char.IsLetter (c)))
      throw new ArgumentException ("Invalid Id");

    _id = customerId;
  }
}

{{< / highlight >}}

This is a nice Id object, it does not have default constructor, readonly id property and a constructor that allows only valid id to exists in my system.  **If you notice, I’ve also a nice JsonConverter attribute that specify a custom serializer for this class.** {{< highlight csharp "linenos=table,linenostart=1" >}}


    public class CustomerIdClassConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            if (objectType == typeof(CustomerId))
            {
                return true;
            }
            return false;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.Value is String id)
            {
                return new CustomerId(id);
            }
            reader.Read();
            if ("id".Equals(reader.Value as String, StringComparison.OrdinalIgnoreCase))
            {
                //we have an id property, just read it 
                reader.Read(); return new CustomerId(reader.Value as String);
            }
            throw new ArgumentException("Value is not a valid id");
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value is CustomerId customerId) 
            { 
                var o = JToken.FromObject(customerId.Id); 
                o.WriteTo(writer); 
                return; 
            }

            throw new ArgumentException("Value is not a valid id");
        }

{{< / highlight >}}

 **This simple serializer is specific for CustomerId class, but it is not difficult to generalize for every id of type string you need**. It simply contains three methods, a CanConvert that tells the caller if this converter can handle a specific type, then a WriteJson value that is used to convert this id to Json and a ReadJson that create a real CustomerId from a JsonReader.  **This** last method is the most interesting one, it accepts a single string, but if Value is not a string it read the stream, check if we have a property called id and then create a CustomerId from that value. This allows me to accept as valid customer id both a single string token, or a property CustomerId with corresponding value.

Now I can rewrite the API with a  different attribute

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-27.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-27.png)

 ***Figure 3***: *FromBody attribute allows using custom serialized in a POST call.*

Call is changed to be HttpPost, I know that a get seems better and more REST oriented, but if you do not want to have default constructor and use your custom serializer, using FromBody in a HttpPost is a viable solution.  **Now you can call the method in POST, specifying id you want to get and have a nice and plain JSON object as response.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-28.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-28.png)

 ***Figure 4***: *Call in Postman using custom serializer.*

As you can see the answer does not contains composite object, I simply have a CustomerId property with a value of ALFKI, the only drawback is that it is a POST request containing a json payload that represent required object.

 **If you really understand how the serializer is done, you can simply pass plain id as string, because a string is a valid JSON token.** The request still should be POST

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-29.png)

 ***Figure 5***: *You can pass a simple string as valid JSON token thanks to our custom serializer.*

This is a limitation of ASP.NET serializer, if you use FromQuery option to create a get request, the object must have a parameterless constructor and it is build setting properties with reflection. To use your custom serializer you need to issue a POST request with payload.

If you do not care that, to get a single customer by id, you need to do a POST call with a payload, this version has one distinct advantage, you can use CustomerId directly as parameter of your API call, preventing any injection.

 **This approach has a clear advantage if you start passing complex requestes composed by more than one parameter, you usually pass some DTO in POST.** {{< highlight csharp "linenos=table,linenostart=1" >}}


    public class GetCustomer2Dto
    {
        public CustomerId CustomerId { get; set; }

        public Int32 OtherParam { get; set; }
    }

{{< / highlight >}}

This object has two distinct property, one is a simple Int32 the other is a CustomerId. Thanks to my serializer I can call with this code.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-30.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-30.png)

 ***Figure 6***: *Using CustomerId inside a complex dto class.*

Maintaining the real advantage of strict validation, because if I pass something that is not a valid CustomerId, I got my request rejected.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-31.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-31.png)

 ***Figure 7***: *Passing wrong id trigger internal server error because an ArgumentException is raised.*

Form a security perspective, if you force your programmer to always require a specific DTO in every request composed only by custom objects with their validation, instead of simple strings, risks of injection are greatly reduced.  **Thanks to custom serializer you can pass simple string property from the caller, in this example customerId property is simple string from caller perspective, but in server side code an exception is thrown if something unexpected is passed because it gots translated in a real CustomerId object with specific validation.** Always double check everything comes from the user, if possible always implement a whitelist of permitted values, throwing exception if something unexpected is passed.

Code can be found here: [https://github.com/alkampfergit/AzureDevopsReleaseSamples](https://github.com/alkampfergit/AzureDevopsReleaseSamples "https://github.com/alkampfergit/AzureDevopsReleaseSamples")

Gian Maria.
