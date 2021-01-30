---
title: "Database Edition Custom Rule"
description: ""
date: 2009-11-28T10:00:37+02:00
draft: false
tags: [Visual Studio Database Edition]
categories: [Visual Studio]
---
One of the coolest feature of Visual Studio Database Edition is the ability to run Rules against a database project, like fxcop against a c# project. And the coolest part about this feature is that is really simple to write a custom rule.

Rules are important, Iâ€™ve seen project where there is no naming rule for objects in database, and so you will end with tables with column like, ablr\_xxxx or xxxxx\_xxx\_Authorname etc etc, and the whole database looses consistency over time. Thanks to database edition I can create a custom rule that  **force** all developers to use for example a standard naming scheme for the column.

Creating a rule is really simple, first of all create a c# project strongly signed, then add a class like this one.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
using System;
using System.Collections.Generic;
using Microsoft.Data.Schema.Extensibility;
using Microsoft.Data.Schema.SchemaModel;
using Microsoft.Data.Schema.SchemaModel.Abstract;
using Microsoft.Data.Schema.ScriptDom.Sql;
using Microsoft.Data.Schema.Sql.SchemaModel.SqlServer;
using Microsoft.Data.Schema.Sql.SqlDsp;
using Microsoft.Data.Schema.StaticCodeAnalysis;

[DatabaseSchemaProviderCompatibility(typeof(SqlDatabaseSchemaProvider))]
internal class MyStylePrefixedTable : Rule{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

To give visual studio full details about your new rule, simply use the right constructor.

{{< highlight sql "linenos=table,linenostart=1" >}}
public MyStylePrefixedTable()
: base(
     "SqlRule",
     "DD0002",
     "All columns must be in form xxxx_xxxxxxxx",
     "All columns must be in form xxxx_xxxxxxxx where the part befor the _ is table code, and part after is descriptivename",
     "",
     "MyStylePrefixedTable"){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can verify is really simple to define details of the rule, just give a the namespace where the rule resides then a unique code, name and description and some other information like help location.

A rule is a simple class that inherits from Microsoft.Data.Schema.StaticCodeAnalysis.Rule, then you simply need to specify what kind of object you want to check.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public override bool IsSupported(IModelElement element)
{
    return element is IColumn;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This specific rule has the purpose to enforce a specific naming of all columns of database. Each column must in fact contain 4 letters (table code) then an underscore and then the name of the column. If we have the table Customer the id column will be cust\_id. This naming scheme could not be the best one, but I want it to be enforced into the database, because I really dislike that each table has is own naming scheme. All the check is done in the Analyze method

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public override IList<Problem> Analyze(IModelElement modelElement, RuleSetting ruleSetting, RuleExecutionContext context)
{
    List<Problem> problems = new List<Problem>();
    if (modelElement.Name == null)
    {
        return null;
    }
    IList<string> nameParts = modelElement.Name.Parts;
    IColumn column = modelElement as IColumn;

    if (nameParts.Count == 3)
    {
        if (!Regex.Match(nameParts[2], @"\w{4}_\w*").Success)
        {
            string message = string.Format(
                "Column {0} of table {1}.{2} must have the form pref_columnname.",
                 nameParts[2], nameParts[0], nameParts[1]);

            Problem p = new Problem(this, message, (IModelElement)modelElement);

            p.Severity = ProblemSeverity.Error;
            problems.Add(p);
        }
    }

    return problems;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code is really simple, the important part is that each object has a name subdivided in parts, a column has three parts: schema, table and column name, so I check the last part (column name) and I validate against a regular expression. If the validation fails, I simply create a [Problem](http://msdn.microsoft.com/en-us/library/microsoft.data.schema.staticcodeanalysis.problem.aspx) object. The Analyze method must in fact return a list of Problem object, each one describing a single and unique problem of the object being analyzed.

Problem object have several properties that can be used, but the most important one is the Severity, that is needed to specify if this problem is a warning or an Error. Since I want that my convention is enforced for every table, I set Problem to Error Severity.

Once you have this class ready you need to create an xml file that contains data about the rule

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8" ?>
<extensions 
  assembly="" 
  version="1" 
  xmlns="urn:Microsoft.Data.Schema.Extensions" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xsi:schemaLocation="urn:Microsoft.Data.Schema.Extensions Microsoft.Data.Schema.Extensions.xsd">

    <extension type="SqlRule.MyStylePrefixedTable"
                assembly ="SqlRule, Version=1.0.0.0, Culture=neutral, PublicKeyToken=43c7c037e2f19384"
                enabled="true"/>
</extensions>
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You must sign your assembly, and specify full qualified name in the xml, then you need to copy this xml file, along with the assembly that contains the rule, into the directory  **program files** \Microsoft Visual Studio 9.0\VSTSDB\Extensions. Now you can reopen visual studio and verify that the rule gets loaded correctly

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb27.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image27.png)

To verify the rule Iâ€™ve simply created one simple table with one valid column and one not valid column.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb28.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image28.png)

If you build the project you will get.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image29.png)

As you can see my custom rule gets executed, and the project will not compile until all columns are not named correctly.

[Code can be found here](http://www.codewrecks.com/blog/Storage/sqlrule.zip).

Alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
