---
title: "Create a SqlRule for database project in vs2010 beta2"
description: ""
date: 2009-12-30T14:00:37+02:00
draft: false
tags: [DataDude]
categories: [Visual Studio]
---
Custom Rule for database projects is one of my favorite extension point of Visual Studio 2008, and I blogged about [it some time ago](http://www.codewrecks.com/blog/index.php/2009/11/28/database-edition-custom-rule/). Yesterday I tried to convert my sample rule for visual studio 2010 beta2, and there are a lot of things that are changed. The result will be a simple rule that force column name to be in form xxxx\_xxxxxxxx as in the past example

First of all the extension needs to specify its details with attributes. The DatabaseSchemaProviderCompatibility permits you to specify the version of the database the rule applies to, in my example a standard sqlDatabase, then the DataRuleAttirbute is used to specify name, id, description, and other attributes of the rule. Finally you need to specify a series of SupportedElementTypeAttribute to declare the kind of database objects you want to validate, for this example you simply need to specify ISqlColumn because I want only to validate column names.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb25.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image25.png)

The important aspect is that all the strings passed to DataRuleAttribute needs to be included in a resource file, and the very first things to do is creating a suitable resource file.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb26.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image26.png)

Then you need to populate it with name and description that you want to use in your rule.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb27.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image27.png)

Now you can create a file that stores all these constants, for an easier use. As you can see the ResourceBaseName string is the name of the resource file.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb28.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image28.png)

And the game is done. Now you only need to write the code that validate column names.

{{< highlight xml "linenos=table,linenostart=1" >}}
 public override IList<DataRuleProblem> Analyze(DataRuleSetting ruleSetting, DataRuleExecutionContext context)
        {
            List<DataRuleProblem> problems = new List<DataRuleProblem>();

            IList<string> nameParts = context.ModelElement.Name.Parts;
            IDatabaseColumn column = context.ModelElement as IDatabaseColumn;
            if (column == null)
                return null;
            if (nameParts.Count == 3)
            {
                if (!Regex.Match(nameParts[2], @"^\w{4}_\w*").Success)
                {
                    string message = string.Format(
                        "Column {0} of table {1}.{2} must have the form pref_columnname.",
                         nameParts[2], nameParts[0], nameParts[1]);
                    DataRuleProblem p = new DataRuleProblem(this, message, context.ModelElement);

                    p.Severity = DataRuleProblemSeverity.Error;
                    problems.Add(p);
                }
            }
            return problems;
        }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This rule is really simple, but it works. One of the most difficult aspect in writing such an extension, is having a knowledge of the structure used by the database edition to represent objects. An important thing is that you can write everywhere in the rule the line

System.Diagnostic.Debugger.Break

And when you build the test database project, you can debug visual studio, and you can inspect with the debugger whatever object you need.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image29.png)

With the power of the debugger you can better understand data that is passed to the rule by the designer. To register the rule you need to copy into a specific Visual Studio folder, and register it in the gac. You can accomplish all with a series of post build actions.

{{< highlight csharp "linenos=table,linenostart=1" >}}
copy "$(TargetDir)$(TargetName)$(TargetExt)" "$(ProgramFiles)\Microsoft Visual Studio 10.0\VSTSDB\Extensions\$(TargetName)$(TargetExt)" /y

copy "$(ProjectDir)$(TargetName).Extensions.xml" "$(ProgramFiles)\Microsoft Visual Studio 10.0\VSTSDB\Extensions\$(TargetName).Extensions.xml" /y 

"C:\Program Files\Microsoft SDKs\Windows\v7.0A\Bin\NETFX 4.0 Tools\gacutil.exe" /if "$(ProgramFiles)\Microsoft Visual Studio 10.0\VSTSDB\Extensions\$(TargetName)$(TargetExt)" 

{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With these simple three lines we are copying the dll with the custom rule, register in the gat and copy the xml file with the description of the plugin, that is completely equal to the one used with the old example.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8" ?>
<extensions 
  assembly="" 
  version="1" 
  xmlns="urn:Microsoft.Data.Schema.Extensions" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xsi:schemaLocation="urn:Microsoft.Data.Schema.Extensions Microsoft.Data.Schema.Extensions.xsd">

    <extension type="SqlRule.MyStylePrefixedTable"
                assembly ="SqlRule, Version=1.0.0.0, Culture=neutral, PublicKeyToken=cc8904c79a049792"
                enabled="true"/>
</extensions>
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Alk.

Tags: [Visual Studio 2010](http://technorati.com/tag/Visual%20Studio%202010)
