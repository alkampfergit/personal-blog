---
title: "Localizable entities with Nhibernate Part 1"
description: ""
date: 2007-05-21T10:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
In a recent project I face the need to localize some entity with nhibernate. First of all I found [this interesting post](http://www.ayende.com/Blog/archive/7001.aspx) of Ayende that show an interesting solution, but it does not fits well in my project. I need a localization scheme with these features.

- Orthogonal to the user, and completely transparent
- The user should be able to change localization text
- The user can choose whathever language he desires, if no suitable localization exists the entity must returns a default localization
- The user can add a new localization language for the entity even if the language is not actually present.

At first these features seems very complicated, and I begin to work on a possible scheme that satisfies all of them. First of all the concept of current language should be orthogonal to the user, it means that the user should ask nhibernate to load an entity without worrying of the language. This kind of problems can be solved by the *Registry* pattern from Fowler (POEAA). This pattern description states: “*A well-known object that other objects can use to find common objects and services”*, this seems to me a suitable pattern to store the concept of *“Current Language”.*First of all I create the interface of my Registry in another assembly.

public interface IRegistry {  
LangCode CurrentLangCode { get; set;}  
LangCode DefaultLangCode { get; set;}  
}

As you can see this registry has only two property that can be used to get/set the current language and the default language, both of them stored as a custom LangCode object. I prefer to use a LangCode custom object because I’m working with a legacy database that stores lang code strings with char(5) fields, so if I simply use a string to store current lang code I’ll end in comparing “it” with “it   ” because the database pads the string with space chars, due to the fact that the fields are fixed length strings. LangCode class is a very straightforward one:

public class LangCode : IEquatable&lt;LangCode&gt; {

internal LangCode() {   
   }

public LangCode(String langcode) {  
  mCode = langcode.Trim();  
   }

public String Code {  
get { return mCode; }  
set { mCode = value.Trim(); }  
   }  
private String mCode;

#region Static lancode

public static LangCode It = new LangCode(“it”);  
public static LangCode En = new LangCode(“en”);  
public static LangCode De = new LangCode(“de”);

#endregion

#region IEquatable&lt;LangCode&gt; Members

public bool Equals(LangCode other) {  
return String.Compare(this.mCode, other.mCode, true) == 0;  
   }

public override bool Equals(object obj) {  
if (obj == null) return false;  
if (obj.GetType() != typeof(LangCode)) return false;  
return Equals((LangCode) obj);  
   }

public override int GetHashCode() {  
return mCode.GetHashCode();  
   }

#endregion  
}

I simply implement IEquatable interface and *Equals()* method, I also trim all lang code so I can use my legacy database that stores codes in fixed length string columns. To access Registry I simply used Windsor container and a static class:

readonly static IRegistry sRegistry = IoC.Resolve&lt;IRegistry&gt;();

static public LangCode CurrentLangCode {  
get { return sRegistry.CurrentLangCode;}  
set { sRegistry.CurrentLangCode = value; }  
   }

static public LangCode DefaultLangCode {  
get { return sRegistry.DefaultLangCode; }  
set { sRegistry.DefaultLangCode = value; }  
   }  
}

This makes possible to use different concrete classes to implement the registry, for example for a web application I can store the current language in user session, while for simple windows application I simply set the language programmatically by code in member variables.

public class WinFormRegistry : IRegistry {

public LangCode CurrentLangCode {  
get { return mCurrentLangCode; }  
set { mCurrentLangCode = value; }  
   }  
private static LangCode mCurrentLangCode = LangCode.En;

public LangCode DefaultLangCode {  
get { return mDefaultLangCode; }  
set { mDefaultLangCode = value; }  
   }  
private static LangCode mDefaultLangCode = LangCode.En;  
}

With castle Windsor I can specify in the app.config or web.config the right concrete class to use, this makes my Registry very flexible. Now the first point is satisfied, I have a registry that can be accessed from any class that needs to know current language or default languages. In the next post I’ll show you a possible scheme to handle a fully featured localized entity.

Alk.

[Localizable Entities with Nhibernate – Part 2](http://www.codewrecks.com/blog/?p=42)  
[Localizable Entities with Nhibernate – Part 3](http://www.codewrecks.com/blog/?p=44)
