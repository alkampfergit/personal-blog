---
title: "jQuery to the rescue ndash some numbers"
description: ""
date: 2009-05-15T07:00:37+02:00
draft: false
tags: [ASPNET,JQuery]
categories: [ASPNET,JQuery]
---
In an old project I have a particular user control dedicated to identify data stored in a tree. The user can type some letters, and press â€œSearchâ€ button to find all the elements that match the search, or it can use a series of DropDownList to navigate from the higher element down to the hierarchy. It is used extensively in the site, and is used even to select location, from a table where location are stored in Nations, Region, Province and Location.

The control was designed as a user control, wrapped in an update panel, it works well, but it is really inefficient for high number of operations, so we decided to make a different version in [jQuery](http://jquery.com/). It tooks me about one day to recreate the control, mainly to maintain all the functionality it has in the past. Since the older version have already a decoupled DAL, I can reuse all server functions to search, manage the tree etc, and I need to write less code.

The old code was spread in four user control whose length is: 356, 557, 367 and 310 lines of code. This is mainly due to the fact that I decided to create two controls, one for the free text search, and the other for the DropDownList navigation, and other two controls that wire everything up. This kind of structure was chosen, because in some page we want to display only the DDL, in other only the search, and having each functionality in its own user control was simple to manage, I have only to change visibility.

Now we are testing the new control, it seems to work excepts some minor bugs that needs to be corrected, but I'm able to give you some numbers.

The control now is contained in only two server files and one javascript file. The first server control is the one used to render HTML and is 293 lines length (it is composed only by properties and some little logic, so it has really logic to mantain), the other file is an aspx page that stream json result data to the caller, and is 141 lines long, the js file is 192 lines and it is composed mainly by comments that explain how the script work. I'm happy because I reduced a lot server code, and the overall structure is simplier. Now it is time to look at request and response length. I recorded with fiddler a little section in witch I first search and select an option, then I use DropDownList part to select in a four level tree. I recorded both old version and new one in a real complex page of the program, here is the result.

| Operation | Download | Upload | Download | Upload |   |
| --- | --- | --- | --- | --- | --- |
| First search | 3684 | 0 | 133202 | 15432 |   |
| Selection | 0 | 0 | 133414 | 15560 |   |
|   |   |   |   |   |   |
| First combo | 8342 | 0 | 0 | 0 | Already loaded into the page |
| second combo | 661 | 0 | 15435 | 35721 |   |
| third combo | 158 | 0 | 15652 | 36228 |   |
| fourth combo | 5387 | 0 | 15804 | 37672 |   |
| Selection | 0 | 0 | 15959 | 37836 |   |
|  **TOTAL** |  **18232** |  **0** |  **329466** |  **178449** |   |

I immediately notice is that the old version does a lot of traffic. Since the new version only does GET reques it reduces the upload payload from 178k to zero !!!!! The download is also reduced and is about 6% of the original size. These numbers makes me think a lot, because Asp.Net is a great environment that can be used to do RAD developement, but sometimes it is not so efficient. Thanks to [jQuery](http://jquery.com/) we can still use asp.net optimizing some critical part with client logic.

alk.

Tags: [jQuery](http://technorati.com/tag/jQuery)
