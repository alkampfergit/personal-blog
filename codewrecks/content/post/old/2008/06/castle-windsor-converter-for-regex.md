---
title: "Castle windsor converter for Regex"
description: ""
date: 2008-06-04T03:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
In [previous](http://www.codewrecks.com/blog/index.php/2008/06/04/castle-windsor-no-converter-registered-to-handle-the-type/) post I explained how to build a Converter for castle, to make possibile specify regular expression in configuration file. The example is simplicistic, let’s see how to extend to create a better converter for Regular Expression.

The main problem is that RegularExpression is not only defined by the pattern but also by regular expression option. I decided to use this syntax

{pattern},{comma separated option}

so a possible definition is

{&lt;a\s\*href=”(?&lt;uri&gt;[^”]\*?)” rel=”bookmark”},{Singleline,IgnoreCase}

This is a regex I use to find some particular data in html page, as you can see the first part is the regex, then I specify the option *Singleline* and *IgnoreCase*. Let’s rewrite the conversion function to accept this new syntax.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private static Regex parser = new Regex(@"\{(?<rex>.*)\},{(?<opt>.*)}");
public override object PerformConversion(string value, Type targetType)
{
    Match m = parser.Match(value);
    if (!m.Success)
        throw new ConfigurationErrorsException(
            String.Format("Cannot convert the string {0} to Regex. String must be in the form {{regex}},{{options}}",value));
    String[] options = m.Groups["opt"].Value.Split(',');
    RegexOptions opt = RegexOptions.None;
    foreach(String option in options) {
        opt |= (RegexOptions) Enum.Parse(typeof(RegexOptions), option);
    }
    return new Regex(m.Groups["rex"].Value, opt);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I first create a simple Regex that split the two group, first of all I recreate the correct option, to do this I simply split the option part and use Enum.Parse to recreate correct values from string description. For each option I use the or= operator (RegexOptions is a Flag enum) and the game is done. Now I’m able to specify both pattern and options in Castle configuration file

alk.

Tags: [Castle Windsor](http://technorati.com/tag/Castle%20Windsor)

