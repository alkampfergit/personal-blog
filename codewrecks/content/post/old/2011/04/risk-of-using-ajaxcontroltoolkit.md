---
title: "Risk of using AjaxControlToolkit"
description: ""
date: 2011-04-15T15:00:37+02:00
draft: false
tags: [JQuery]
categories: [JQuery]
---
I like the [AjaxControlToolkit](http://www.asp.net/ajax/ajaxcontroltoolkit/samples/), but using those controls without a real knowledge of what is happening behind the scenes can be dangerous. We have a simple page that shows a list of objects of type A; for each line there is a button called *Associate*, that opens a modal-like dialog where the user can search objects of type B. Each result of this search show a button call *Select* to associate that object to the A object. The page was written with ModalPopupExtender; for each line a User Control (that implements search and association) was included and managed by a ModalPopupExtender, a few lines of code behind, an updatePanel and the game is done, whoa, success

![](http://t0.gstatic.com/images?q=tbn:ANd9GcQibTJAPeCu_zm5Joz_TOvY7ahk9uPQMqeTVC06u63QXTNJ5UsZ)

The page was cool, thanks to updatepanel and partial rendering the user does not see page to flicker and thanks to [modalPopupExtender](http://www.codeproject.com/KB/ajax/ModalPopupExtender.aspx) all the logic is reduced to very few lines of code. This experience makes programmers loving those kind of controls, until the number of users grow and people start to complain about slow performance. Let's examine only the bandwidth consumed by this page and do not check other possible performance issue.

|  **Request** |  **Bytes uploaded** |  **Bytes downloaded** |
| --- | --- | --- |
| Open the page | 0 | 74,918 |
| Press Associate button | 0 | 0 |
| Search Objects | 136,275 | 196,682 |
| Press Select to associate an object | 136,323 | 196,770 |
| Press Close Button to close the modal | 136,171 | 446,582 |

WHAT!!!!!! these are pretty big numbers for such a simple operation (search and asosciate), but here is what is happening. First of all we use a custom HttpModule that compress the page before sending back to the caller, but it creates problems with the UpdatePanel, so each request made by an update panel (partial rendering) does not get compressed, and this is the reason why the page size is much bigger on subsequent requests. Then we have a big upload payload due to the huge viewstate of the page (there are a lot of other stuff in the page) and each operation issue a full POST roundrip to the server... a lot of traffic

![](http://t2.gstatic.com/images?q=tbn:ANd9GcT4gyr8L1UZHBLXvXwUPXJ76KwTG0sdt1gJ53ym9itEiFvllq8h)

The solution is using a real Ajax technique, I created a separate page to render the grid, and with a little bit of jQuery moved all this logic into a true Partial Rendering Ajax page. The page that manage the association only accepts GET request with all needed parameters and only render the grid. Now I did the same sequence of operation and look at the different result.

|  **Request** |  **Bytes uploaded** |  **Bytes downloaded** |
| --- | --- | --- |
| Open the page | 0 | 48,414 |
| Press Associate button | 0 | 1,744 |
| Search Objects | 0 | 1,662 |
| Press Select to associate an object | 1,658 | 247 |
| Press Close Button to close the modal | 0 | 0 |

The original request is much smaller because I removed all those Panels that were handled with ModalPopupExtender, so the whole page is smaller.

When the user press the Associate Button the page issue a GET request to the other page that renders a small bunch of HTML (a texbox to search and a button inside a div), and when the user press the Search Button I returned only resulting data formatted in a simple Table. Finally when the user press Select I call an asmx webservice thanks to Ajax.Net to create the association in the database, and finally pressing the close button simply removes all partial rendering content with javascript, so no roundtrip is needed.

![](http://t2.gstatic.com/images?q=tbn:ANd9GcR1Tx0DDYn28wAJrTHBT4FTQ-uwoELfAnUZpOd0-k2ZWQN5UWWcMQ)

This big improvement in performance was paid by more time needed to develop the solution, by the gain in performance and scalability is tremendous, and since this is one of the most common operation the user to with this web application, the overall improvement worth the time spent on it and the slightly more complicated code on the UI.

This kind of problems happen because using the Update Panel or other similar control (like the ModalPopupExtender) gave the programmer the sense of creating a real Ajax application, quite often I heard people telling me that the concept of ajax is only **avoid refreshing the whole page** so an update panel is the only control they need.

Such kind of problems arise because developers are used to test application locally, where size of the page does not impact on perceived performance. I strongly suggest you to constantly test your web application with tools capable of simulating various Bandwidth scenario, just to avoid to find problems only when you deploy the application on the production server just to verify that your server bandwidth is completely saturated by the app.

alk.
