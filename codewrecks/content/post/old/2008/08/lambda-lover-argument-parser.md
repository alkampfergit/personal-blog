---
title: "Lambda Lover 8211 argument parser"
description: ""
date: 2008-08-20T03:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
There are a lot of situations where LINQ and Lambda expressions can make your code simpler to write and also simpler to read. Today I stumble across an extension of a really old project. This project pass one parameter to a function, and this parameter is a list of comma separated BlockName. Despite the business meaning of a BlockName, I need an extension that permits also to add specific parameters to the block name, so we decided to use a syntax like:

*blockname1[param1=value;param2=value],blockname2[param1=valueother],…*

This is really an awkward way to pass parameters around, but these are the requirements, so we cannot question about it. I decided to write some general parameter class that permits me to deal with strongly typed parameters name and value, because I do not want monkeying  around with string that I have to parse etc, etc. In 10 minutes I write this simple class:

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class BlockParameters
{
    private static Dictionary<string, Action<BlockParameters, String> > definedParameters 
        = new Dictionary<string, Action<BlockParameters, String>>();

    static BlockParameters()
    {
        definedParameters.Add("BoolProp", (p, s) => p.BoolProp = Boolean.Parse(s));
        definedParameters.Add("Int64prop", (p, s) => p.Int64Prop = 
            s.StartsWith("0x", StringComparison.InvariantCultureIgnoreCase) ? 
                Int64.Parse(s.Substring(2), NumberStyles.HexNumber) : Int64.Parse(s));
        definedParameters.Add("StringProp", (p, s) => p.StringProp = s);
    }

    public BlockParameters(string blockString)
    {
        Match m = Regex.Match(blockString, "(?<name>.*)\\[(?<parameters>.*)\\]");
        if (m.Success)
        {
            BlockName = m.Groups["name"].Value;
            string[] parameters = m.Groups["parameters"].Value.Split(';');
            Array.ForEach(parameters, s =>
            {
                string[] paramvalue = s.Split('=');
                definedParameters
                   .Where(d => String.Compare(d.Key, paramvalue[0], true) == 0)
                   .SingleOrDefault()
                   .Value(this, paramvalue[1]);
            });
        }
        else
        {
            BlockName = blockString;
        }
    }

    public String BlockName { get; set; }
    public Boolean BoolProp { get; set; }
    public Int64 Int64Prop { get; set; }
    public String StringProp { get; set; }

    public override string ToString()
    {
        return String.Format("BlockName={0} BoolProp={1} Int64Prop={2} StringProp={3}", 
            BlockName, BoolProp, Int64Prop, StringProp);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This method is quite general and can be abstracted in a base class. The core is a dictionary of parameterDefinition, where each element has a string (parameterName) as a key, and an Action&lt;BlockParameters, String&gt; as value. In static constructor I fill this dictionary with my parameters, and I can specify a custom function that convert from string representation to the real value. For the Int64 value in fact, I check if the number if prefixed with 0x to use exadecimal conversion.

With lambda and a little bit of linq the class is simple, easy to read and to use. Here is a typical use

{{< highlight csharp "linenos=table,linenostart=1" >}}
BlockParameters p1 = new BlockParameters("MyName[BoolProp=true;Int64Prop=0xFFFFFFFFFF]");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you can use the variable p1 with full intellisense, moreover if you specify a parameter that is not permitted it throws an exception, and you have the ability to pass Int64 value both in normal formal and hexadecimal format.

Alk.
