---
title: "Do not trust user input part 2"
description: ""
date: 2020-01-29T20:00:37+02:00
draft: false
tags: [Security]
categories: [security]
---
After we fixed our code in [part 1](http://www.codewrecks.com/blog/index.php/2020/01/28/do-not-trust-user-input-enforce-whitelists-narrow-allowable-input/) of this serie, we continue to expand our API adding a method to select  a Customer. Northwind database Customer table has an id of type string, so we could start with this very bad, bad, bad piece of code.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-11.png)

 ***Figure 1***: *Another bad example of API vulnerable with Sql Injection*

Again the question is: what is the most critical error in that piece of code? If you answer “Query with string concatenation” probably you are wrong. Indeed that is a huge problem, but  **in my mind is accepting a string from the user is still the number one problem**.

> Remember that accepting a string from the user basically means that you accept really every possible sequence of characters, probably not what you really want.

If in part 1 example using a parameter string for an integer id is a real stupid error, someone could be tempted to affirm that, since the id of the customer is a string, it is normal for the API to accept a string. Believe me, the answer is: NO!

 **If I look at northwind database, id is composed by 5 uppercase letters, every id has this specific pattern and is not random.** This is the reason why I can define a specific class to represent a valid customer id that throws exception if anything different from a valid pattern is passed as argument.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class CustomerIdClass
{
    public CustomerIdClass(String customerId)
    {
        if (customerId.Length != 5)
            throw new ArgumentException("Invalid Id", nameof(customerId));

        if (customerId.Any(c => !Char.IsLetter(c)))
            throw new ArgumentException("Invalid Id", nameof(customerId));

        Id = customerId;
    }

    public String Id { get; private set; }
}

{{< / highlight >}}

 **As you can see, this class is really simple, it represents the id of a customers that can be created only from a string composed exactly by 5 letters.** Customer object has CustomerId property of type CustomerIdClass and this will ensure that you cannot create a customer with invalid id. This enforces Customer Id pattern in every instance in your code, preventing you to create a customer with invalid id like “3”.

This type of technique is extremely useful also for security purposes, because you can now change your API method to construct a valid CustomerId.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-22.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-22.png)

 ***Figure 2***: *GetCustomer method now construct a valid CustomerIdClass before issuing the query*

Thanks to this code, you can still ask for customer with a simple get:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-23.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-23.png)

 ***Figure 3***: *Simple query for customers*

Any request that deviates from the standard pattern of a customer Id (5 chars) returns an error

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-24.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-24.png)

 ***Figure 4***: *Error returned from wrong id*

Now it is mandatory that you should also change the way you are issuing your query to Sql Engine removing the injection,  **but we can all agree that an attacker has an hard life to try injection of any kind using only 5 letters even if your query is really bad and directly concatenates strings.** The lesson is always the same: limit what the user can pass as parameter to the exact pattern of the data you can expect, instead of allowing any string to be passed.

Gian Maria.
