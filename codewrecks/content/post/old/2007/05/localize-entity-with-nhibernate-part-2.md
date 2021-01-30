---
title: "Localizable entities with Nhibernate part 2"
description: ""
date: 2007-05-21T23:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
After the creation of Registry pattern I need to create a localization scheme that will satisfy the remaining points of the list; first of all I write some tests following the best practices of Test Driven Development. The class under test will be called Entity, and has an integer property and two string properties that are to be localized. The scheme I used to localize the entity is to enclose all localizable properties in a different class called *EntityResources*, and storing all resources of an *Entity* instance through a simple IDictionary&lt;LangCode, EntityResources&gt;. This scheme has the advantage to be enough flexible to satisfy all my requirements, while keeping the class simple. The first test checks that a single localization is handled correctly

[Test]  
public void TestAddLocalization() {  
Entity ent = new Entity();  
   ent.AddResource(LangCode.En, new EntityResources(“Name”, “Description”));  
   Registry.InstanceRegistry.CurrentLangCode = LangCode.En;  
Assert.AreEqual(“Name”, ent.Name);  
Assert.AreEqual(“Description”, ent.Description);  
}

Then a couple of test to check that default localization is used when exact localization is not present

[Test]  
public void TestDefaultLocalization1() {  
Entity ent = new Entity();  
   ent.AddResource(LangCode.En, new EntityResources(“Name”, “Description”));  
   Registry.InstanceRegistry.CurrentLangCode = LangCode.De;  
Assert.AreEqual(“Name”, ent.Name);  
Assert.AreEqual(“Description”, ent.Description);  
}  
[Test]  
public void TestDefaultLocalizationEnglishDefault() {  
Entity ent = new Entity();  
   ent.AddResource(LangCode.It, new EntityResources(“Nome”, “Descrizione”));  
   ent.AddResource(LangCode.En, new EntityResources(“Name”, “Description”));  
   Registry.InstanceRegistry.CurrentLangCode = LangCode.De;  
   Registry.InstanceRegistry.DefaultLangCode = LangCode.En;   
Assert.AreEqual(“Name”, ent.Name);  
Assert.AreEqual(“Description”, ent.Description);  
}

The most interesting tests are those used to test transparent localization features such as this one

[Test]  
public void TestAutomaticLocalization() {  
Entity ent = new Entity();  
   Registry.InstanceRegistry.CurrentLangCode = LangCode.It;  
   ent.Name = “Nome”;  
   ent.Description = “Descrizione”;  
Assert.AreEqual(“Nome”, ent.Name);  
Assert.AreEqual(“Descrizione”, ent.Description);  
   Registry.InstanceRegistry.CurrentLangCode = LangCode.En;  
   ent.Name = “Name”;  
   ent.Description = “Description”;  
Assert.AreEqual(“Name”, ent.Name);  
Assert.AreEqual(“Description”, ent.Description);  
   Registry.InstanceRegistry.CurrentLangCode = LangCode.It;  
Assert.AreEqual(“Nome”, ent.Name);  
Assert.AreEqual(“Descrizione”, ent.Description);  
}

This test verify that a user can actually set properties of the Entity object without worrying if a suitable localization ResourceEntity already exists on the object. This feature is very useful for my project, but can be a little bit confusing. Let’s make an example: if current language is ‘de’ and the user ask for an object that has no resource for ‘de’ LangCode, the Entity class shows Name and Description properties taking default resource. At this time if the user changes the value of one of these properties a new localization resource gets created for ‘de’ language and added to Entity object transparently. If this is not the behavior you needs, simply disable this feature and throw an exception or permit the user to modify the default resource.

Now it’s time to look at Entity’s code, first of all the class stores all localization resources inside a IDictionary&lt;LangCode, EntityResource&gt;, Name and Description properties simply look for a suitable resource to show to the user.

public String Name {  
get { return GetResource().Name; }  
set { GetOrCreateResource().Name = value; }  
}

public String Description {  
get { return GetResource().Description; }  
set { GetOrCreateResource().Description = value; }  
}

As you can see the getter part of the property calls GetResource() method to find the most suitable resource, while setter part uses GetOrCreateResource() that actually create a new resource if the current language missing it. GetResource() simply check if a resource for the current language is present in the dictionary, if not it calls GetDefaultResource() that simply checks if the dictionary contains the resource for the default language. If the dictionary is empty, GetResource() returns an instance of a default resource.

protected  
EntityResources GetResource() {

LangCode locinfo = Registry.InstanceRegistry.CurrentLangCode;  
if (mResources.ContainsKey(locinfo))  
return mResources[locinfo];  
else  
return GetDefaultResource();  
}  
  
protected virtual EntityResources GetDefaultResource() {  
if (mResources.ContainsKey(Registry.InstanceRegistry.DefaultLangCode))  
return mResources[Registry.InstanceRegistry.DefaultLangCode];    
foreach (KeyValuePair&lt;LangCode, EntityResources&gt; element in mResources) {  
return element.Value;  
   }  
return EntityResources.DefaultResource;  
}

GetOrCreateResource() is a little bit interesting because it handle transparent localization. It first checks if a resource for the current langcode is present, if not it creates a new EntityResource making a clone of the current resource. This is necessary because if the user change only one property and a new resource needs to be created, the caller should see the other properties unchanged.

protected EntityResources GetOrCreateResource() {  
LangCode locinfo = Registry.InstanceRegistry.CurrentLangCode;  
if (mResources.ContainsKey(locinfo))  
return mResources[locinfo];  
else {  
EntityResources newResource = (EntityResources) GetResource().Clone();  
  AddResource(locinfo, newResource);  
return newResource;  
   }  
}

That’s all, with this scheme the Entity object now supports the concept of localization and thanks to the registry pattern we can access the current language and the default language from every classes. This scheme has some disadvantages, first of all an Entity object needs to contain all the resources for all languages to support Transparent localization, this approach uses more memory than a plain object. A second issue is that accessing Name and Description properties is slower compared to standard properties implemented with a private field. If performance is a key issue, and if the profiler shows you that the implementation of localized entities really impacts on your performance, you can adopt an internal cache of the resources. The first time that Name or Description properties are called, we store current resource in a private field as well as the current language, at each call we simply check if the language is changed, if not we can return cached resource without incurring in the penality of calling GetResource() or GetOrCreateResource(). My approach is not to worry too much about performance until a profiler shows me where and when the performance are poor and the code needs to be tuned, so previous scheme suits well most of my needs.

In the next part of this tutorial I’ll finally show you how to map this class with NHibernate along with some queries to work with localized objects.

Alk.

[Localizable Entities With Nhibernate â€“ Part 1](http://www.nablasoft.com/Alkampfer/?p=41)

[Localizable Entities With Nhibernate â€“ Part 3](http://www.nablasoft.com/Alkampfer/?p=44)
