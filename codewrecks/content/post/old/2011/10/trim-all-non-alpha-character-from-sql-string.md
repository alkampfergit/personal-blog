---
title: "Trim all non-alpha character from SQL string"
description: ""
date: 2011-10-28T08:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
I’have a table with some dirty data, if you select it seems that everything is ok, but since it was imported from an external source, it happens that some string field actually ends with strange non alpha char.

The symptom is that I have some strange behavior on some data, then I verify what is the content of that row, so I issue a Select \* from xxx where Name = ‘Azioni’ and got no result, so I select everything that contains Azioni and I found the record. This is the clear symptom that the field contains some strange stuff in it, so I simply to a Copy and paste in the editor to see *exactly*what is stored in the field, and I found

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image3.png)

Do you see the strange char at the end? So I need a trim function that removes every non alphabetic character from the beginning and the end of the string. Looking in the internet I found [this interesting article](http://stackoverflow.com/questions/1007697/how-to-strip-all-non-alphabetic-characters-from-string-in-sql-server) that lists a function that remove all non alpha char from the string, so I modified to make it remove non-alpha char only from the beginning and the end.

Here it is if you need it:

{{< highlight csharp "linenos=table,linenostart=1" >}}
create Function [dbo].[TrimNonAlphaCharacters](@Temp nVarChar(max))
Returns nVarChar(max)
AS
Begin
 
While PatIndex('[^a-z]%', @Temp) > 0
Set @Temp = Stuff(@Temp, PatIndex('[^a-z]%', @Temp), 1, '')
 
While PatIndex('%[^a-z]', @Temp) > 0
Set @Temp = Stuff(@Temp, PatIndex('%[^a-z]', @Temp), 1, '')
Return @TEmp
End
{{< / highlight >}}

I’ve not tested it extensively, just ran it against my data and verified that it solves my problem, so I’m pretty confident that it works, but feel free to post any correction or any better implementation if you have one :)

Gian Maria.
