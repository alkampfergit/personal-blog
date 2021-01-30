---
title: "Inspecting NHibernate Metadata"
description: ""
date: 2008-08-12T04:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
I have a little project based on [NSK](http://www.codeplex.com/NSK), it uses a query model to abstract the caller from nhibernate. Despite the reason for having or not a Query Model, I expanded the base translator to translate my Query object into a NHIbernate ICriteria.

To make this translation you need to create alias, if I you create a query for the order object and setup a constraint for Customer.Name, the ICriteria tells you that the Order object does not have a property called Customer.Name. This can be easily accomplished using Alias, but only if the object is mapped as an entity and not as a component.

If the customer has an Address of type Address mapped as a component and you create a constraint for the property *Customer.MainAddress.Number,*we need to create only an alias for Customer (because is an entity). This means that my translator has to distinguish between entities and components. The solution to these kind of problems can be solved inspecting metadata mapping for nhibernate.

I created a class that handle alias creation

{{< highlight csharp "linenos=table,linenostart=1" >}}
CriteriaAliasTranslator cat = 
new CriteriaAliasTranslator(
_session.SessionFactory.GetAllClassMetadata(), _rootType);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This translator needs only the type of the root object, and a dictionary of all types metadata, obtained from the method *GetAllClassMetadata()* from the SessionFactory object.

Then for each dotted constraint found in the query object, I pass it to this alias translator

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public String AddAlias(String fullpath)
{
    String[] path = fullpath.Split('.');
    String CurrentAliasPath = path[0];
    String ReturnValue = path[0];
    Type currentType = baseType;

    for (Int32 I = 0; I < path.Length - 1; ++I)
    {
        IEntityPersister mapping = (IEntityPersister) mappingMetadata[currentType];
        if (mapping.GetPropertyType(path[I]) is ComponentType)
        {
            for (Int32 innerI = I+1; innerI < path.Length; ++innerI)
                ReturnValue += "." + path[innerI];
            return ReturnValue;
        }
       ...{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I split the string with “.” character, then cycles through all the part of the property, and for each property I first check from the metadata if this is a component or not. If is a component than I can return from the function, because I do not need to create alias for components. The IEntityPersister interface stores all information for a type, then with the *GetPropertyType* you can get the NHibernate type of the property; to verify if the property is a component you can check with the is operator against the ComponentType.

If the component is an entity, then I go through the standard path, and store the aliases into a dictionary. When all the properties of the query gets translated I call the method *CreateAlias()* of the CriteriaAliasTranslator, that cycles through all values from the alias dictionary, and call create alias on the real ICriteria object.

A lot of thanks to [Marco](http://www.codemetropolis.com/) that originally told me this problem. In this little project I never used query model with components, so I never hit it. Marco created another querymodel, and when we made some confrontation he told me “Hey, you have this bug” :D, thanks again.

alk.

<!--dotnetkickit-->

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [Mapping Metadata](http://technorati.com/tag/Mapping%20Metadata)
