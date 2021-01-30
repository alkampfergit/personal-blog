---
title: "Compress data in sql server 2008 standard thanks to FILESTREAM and NHibernate"
description: ""
date: 2011-05-24T14:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
I have an entity that has a large Unicode string property actually persisted on a nvarchar(max) Sql server column type. After some months we verified that this column is consuming big amount of database space. Sql server enterprise supports data compression, but this software runs on a Sql Server standard, so we need some strategy to save space (compressing text data) but with minimum impact on the already existing code. Since this is text data we already know that it is possible to have a good compression ration, but adding compression in the domain is a solution I do not like.

The property is named *FullContent* and was never used in a query, it only contains long text data that needs to be analyzed over the time, so I decided to use the FILESTREAM feature of Sql Server to minimize the impact on the existing code.  First of all I enabled [FILESTREAM](http://msdn.microsoft.com/en-us/library/cc645923.aspx) on database and created a new column of type varbinary(max) to store data into FILESTREAM named *FullBinaryContent.*(Remember that FILESTREAM is enabled only on varbinary(max) and not on varchar(max) columns)

{{< highlight csharp "linenos=table,linenostart=1" >}}
 
ALTER DATABASE xxxxx ADD
FILEGROUP FileStream_TextData CONTAINS FILESTREAM;
GO
 
ALTER DATABASE xxxxx ADD FILE (
NAME = TextData,
FILENAME = 'd:\databases\FileStream\ContentFS')
TO FILEGROUP FileStream_TextData ;
GO
 
ALTER TABLE dbo.tablename
SET (    FILESTREAM_ON  = FileStream_TextData )
 
ALTER TABLE dbo.tablename ADD
FullBinaryContent varbinary(MAX) FILESTREAM NULL
{{< / highlight >}}

With this modification for each record of the table, the value of the column FullBinaryContent will be stored into standard NTFS filesystem. I start adding a Byte[] property to the original entity that will contains the text in binary form.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private Byte[] FullBinaryContent
{
get
{
return Encoding.Unicode.GetBytes(FullContent);
}
set
{
 
FullContent = Encoding.Unicode.GetString(value);
}
}
{{< / highlight >}}

This property uses the FullContent original property converting from and to a Byte[] type thanks to Encoding.Unicode functions. After this modification I simply changed the mapping, removing the FullContent property and adding the FullBinaryContent mapped to the new column. (this can be done because the original property was never used in a query so I do not care if the mapping changed). Now I need to update all data in the database running a simple * **update Tablename set FullBinaryContent = cast(FullContent as varbinary(max)).** *  This simple UPDATE query will update all data that is already in the database. When the update finished I can delete the original FullContent column and start using the new mapping based on binary representation of text into a FILESTREAM.

To achieve compression I simply go to directory *d:\databases\filestream\ContentFs* (where the FILESTREAM is located) and enable the standard NTFS file compression. The result is quite interesting.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/image11.png)

The amount of space occupied is less than an half, and existing code was not impacted by this modification, because the code can still use the *FullContent* property ignoring the fact that this property was actually persisted through the FullBinaryContent private property.

alk.
