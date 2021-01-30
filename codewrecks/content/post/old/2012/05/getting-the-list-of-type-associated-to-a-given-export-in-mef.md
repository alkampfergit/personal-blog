---
title: "Getting the list of Type associated to a given export in MEF"
description: ""
date: 2012-05-08T16:00:37+02:00
draft: false
tags: [Wcf]
categories: [Software Architecture]
---
- [Basic Request Response WCF service](http://www.codewrecks.com/blog/index.php/2012/03/12/basic-request-response-wcf-service/)
- [Reason behind a request – response service in WCF](http://www.codewrecks.com/blog/index.php/2012/04/05/reson-behind-request-responseservice-in-wc/)
- [Evolving Request Response service to separate contract and business logic](http://www.codewrecks.com/blog/index.php/2012/04/23/evolving-request-response-service-to-separate-contract-and-business-logic/)
- [How to instantiate WCF host class with MEF](http://www.codewrecks.com/blog/index.php/2012/05/08/how-to-instantiate-wcf-host-class-with-mef/)

One of the problem I had to solve to make WCF and MEF live together,  is knowing all the types discovered by MEF at runtime for a given export. This information is really important because  **I need the list of type that derived from Request and Response to inform WCF of all the KnownTypes available to the service.** First of all let’s see how I initialized MEF engine

{{< highlight csharp "linenos=table,linenostart=1" >}}


private static CompositionContainer theContainer; 
private static DirectoryCatalog catalog;

static MefHelper() 
{ 
    catalog = new DirectoryCatalog(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)); 
    theContainer = new CompositionContainer(catalog); 
}

{{< / highlight >}}

The catalog is instructed to load everything that is located in the current directory, a configuration that is suitable for my simple WCF Request / Response service; then I need to change the DynamicKnownType class to get the list of exported types loaded by MEF.

{{< highlight csharp "linenos=table,linenostart=1" >}}


class DynamicKnownType 
{ 
    static List<Type> knownTypes;

    static DynamicKnownType() 
    { 
        knownTypes = new List<Type>(); 
        knownTypes.AddRange(MefHelper.GetExportedTypes<Request>()); 
        knownTypes.AddRange(MefHelper.GetExportedTypes<Response>()); 
    }

{{< / highlight >}}

The GetExportedType() method is a little tricky, because MEF does not offer such a functionality out of the box, so  **I need to search inside information available from the catalog to identify all loaded types related to a specific Export**. The code is quite simple and it is composed only by few lines.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static IEnumerable<Type> GetExportedTypes<T>() 
{ 
    return catalog.Parts 
       .Select(part => ComposablePartExportType<T>(part)) 
       .Where(t => t != null); 
}

private static Type ComposablePartExportType<T>(ComposablePartDefinition part) 
{

    if (part.ExportDefinitions.Any( 
        def => def.Metadata.ContainsKey("ExportTypeIdentity") && 
            def.Metadata["ExportTypeIdentity"].Equals(typeof(T).FullName))) 
    { 
        return ReflectionModelServices.GetPartType(part).Value; 
    } 
    return null; 
}

{{< / highlight >}}

You can find all type related to an export because MEF Catalog contains a property named  **Parts** that is an IEnumerable of ComposablePartDefinition, where **each instance contains full details on a type discovered by MEF.** For each ComposablePartDefinition I can cycle inside all ExportDefinitions list to find if one ExportDefinition is related to the type I’m looking for. This specific information is not exposed directly, but it  **is contained in the Metadata associated to the ExportDefinition in a key called “ExportTypeIdentity” that contains the FullName of exported Type**.

If one of the ExportDefinition exports the type I’m searching for  **I can finally use the ReflectionModelService.GetPartType() static method to find the type of dynamically imported class**. This simple method make possible to discover the list of all concrete classes loaded by MEF that inherit from Request or Response to create the list of KnownTypes for WCF.

[![08-05-2012 19-26-21](https://www.codewrecks.com/blog/wp-content/uploads/2012/05/08-05-2012-19-26-21_thumb.png "08-05-2012 19-26-21")](https://www.codewrecks.com/blog/wp-content/uploads/2012/05/08-05-2012-19-26-211.png)

 ***Figure 1***: *From the Wcf Test Client you can choose between all the requests that were dynamically loaded by MEF*

Example [**can be downloaded here**](http://www.codewrecks.com/Files/requestresponsemef.zip) **.** Gian Maria.
