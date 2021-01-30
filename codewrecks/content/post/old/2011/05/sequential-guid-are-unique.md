---
title: "Sequential GUID are Unique"
description: ""
date: 2011-05-17T12:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
This post refers to the [previous post](http://www.codewrecks.com/blog/index.php/2011/05/16/using-guid-id-in-nhibernate-index-fragmentation/comment-page-1/#comment-3822), where liviu warns against the â€œnon uniquenessâ€ of T-SQL sequential guid. The technique used is based on the [UuidCreateSequential](http://msdn.microsoft.com/en-us/library/aa379322%28v=vs.85%29.aspx) API function of the operating system. This function generates unique guid unless there is no NetworkCard in the system, but this function warns you when the guid can be considered unique only on local machine, when it returns the value RPC\_S\_UUID\_LOCAL\_ONLY.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image10.png)

This happens when the machine has not network card, and this is not a problem in my scenario, but if this is something you fear, you can simply change the function in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static class SequentialGuidGenerator
{
private const Int32 RPC_S_OK = 0x0;
 
/// <summary>
/// Questa funzione di sistema presa dalla dll rpcrt4.dll permette di generare
/// Guid sequenziali che sono piÃ¹ ottimali per inserimenti massivi di grandi quantitÃ 
/// di dati in database in cui l'indice cluster Ã¨ messo sull'id
/// </summary>
/// <param name="guid"></param>
/// <returns></returns>
[DllImport("rpcrt4.dll", SetLastError = true)]
internal static extern int UuidCreateSequential(out Guid guid);
 
public static Guid CreateSequentialGuid()
{
Guid guid;
Int32 retvalue = UuidCreateSequential(out guid);
if (retvalue != RPC_S_OK)
{
//it is not safe to generate a guid on this machine because it would be unique
//only in this machine
return Guid.NewGuid();
}
return guid;
}
 
}
{{< / highlight >}}

The change is in link 19, I check for the retvalue and if it is different from RPC\_S\_OK I use the standard Guid generator. This little change makes me sure that if the machine could not generate unique sequential guid, it uses standard guid generation avoiding the risk of having two identical GUID.

alk.
