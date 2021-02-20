---
title: "Using a single ModalPopupExtender to show Dynamic Complex Data"
description: ""
date: 2008-06-06T09:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
I'm not a javascript fan, but sometimes I have the need to write some client script code, to make the application more responsive.

In a project I was working on, we have the main page with a gridview that shows 15 components at time, each component has really a lot of information to show to the user, so the first version uses the ModalPopupExtender from AjaxControlToolkit to move in a popup the extended informations. We set a column in the gridview with a div with basic data, when you click on the div the modal popup opens up and shows extended data on the element clicked.

All works fine, until I realized that the page is 412kb too big...really too much. Commenting out the extended data in the modal popup the size dropped to 120 kb, still a big page, but really smaller than the original one. So I asked myself, *since the user does not want to see extended data for all the elements, it is possible to ask for these data on demand by client script code?*

The idea to manipulate complex dom objects makes me feel unconfortable, the panel with extended data contains dropdown, images, and a lot of other control, so I decided to try a quick and dirty approach. I move the code that generates the extended data in a page on his own, I pass the id of the record via querystring, and I put all the content in a div. The result is a page that when called returns a page with all the content I need to show in the popup panel.

The tricky part of the code was actually the javascript part that needs to

1) Store the div data in some sort of internal array (I do not want to ask for detail panel each time I click on the same object again and again)

2) If the div data is not saved, I had to call asincronously the server page that generate the data and grab all HTML

3) From the HTML returned by the page, I have to find the div that contains all data, then store the div in an internal array as cache

4) I must identify the div that is used by ModalPopupExtender, this div originally contains an empty div, my script simply swap the original empty div with the real one returned from the server page.

Here is part of the script

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 1 NSPreview.PreviewManager.prototype.ShowPanel = function(panelId, analysisId, fullPanelUrlGenerator, waitingimage, showPopup) {
 2    if (this._panels[panelId] == null || this._panels[panelId].id != analysisId) {
 3         var reqFinished;
 4         var request = new Sys.Net.WebRequest();
 5         request.set_url(fullPanelUrlGenerator);
 6         var array = this._panels;
 7         var div = document.getElementById(this._theDivId);
 8         request.add_completed(function(executor, eventargs) {
 9             var data  = new Object();
10             var pageContent = executor.get_responseData();
11             var fullcontent = document.createElement('div');
12             fullcontent.innerHTML = pageContent;
13             var allDivs = fullcontent.getElementsByTagName('div');
14             for (var I = 0; I < allDivs.length; ++I) {
15                 if (allDivs[I].id == 'info') data.divElement = allDivs[I]; 
16             }
17             data.id = analysisId;
18             array[panelId] = data;
19             
20             div.replaceChild(data.divElement, div.childNodes[0]);
21             showPopup();
22         });
23         request.invoke();
24    } else {
25         var div = document.getElementById(this._theDivId); //.innerHTML = this._panels[panelId].divElement.innerHTML;
26         div.replaceChild(this._panels[panelId].divElement, div.childNodes[0]);
27         showPopup();
28    }
29    this._current = panelId;
30 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The function accept 5 parameters, the first is the index of the element in the grid 1, 2, 3… the second is the id of the element, the third is the full url that generates the panel, the fourth is the address of an image to show that the page is doing something (actually still nt used) then finally is a callback to call after the data in the div is changed (Actually used to show the popup). The line 2 is the condition, if I do not have the div into the array, or if the id associated with the div is not the same (maybe I move to the next page of records) I need to update data. I use a WebRequest object and get all the data from the page. The trick is in line 11, I create a dynamic div element in the DOM, I assign to its innerHTML the content of the page, then with getElementsByTagName I’m able to browse all the divs to find the one that has the content. Then I simply create an object to store the actual id of the element and the div with the data. Finally I call replaceChild to swap the old div with the new one, the game is done.

The result is that with no great effort, with Ajax Library, you are able to ask for a page in the server, takes all content, and use that content in main page. Size of the page is dropped to 120kb and the server is more responsive. Moreover the first implementation has a ModalPopupExtender for each line in the gridview, the new version has only one that manipulate the div with the dynamic content.

Alk.

Tags: [ModalPopupExtender](http://technorati.com/tag/ModalPopupExtender)

<!--dotnetkickit-->
