---
title: "Create Charts in excel with Open Xml Sdk 25"
description: ""
date: 2013-08-13T06:00:37+02:00
draft: false
tags: [OpenXml]
categories: [Programming]
---
OpenXml Sdk is absolutely a fantastic library to  **programmatically create Office documents** , but when it is time to add Chart components in Excel I‘m starting to feel the pain. I’ve searched in MSDN to find resource on “how to create a chart in Excel with OpenXmlSdk 2.5” and the only resource I’ve found is this article: [How to: Insert a chart into a Spreadhseet document](http://msdn.microsoft.com/en-us/library/office/cc820055.aspx).

The article is good, but you immediately realize that the code is not so simple and that is not easy to understand how to modify it to suite your need. In my specific scenario  **I need a Pie Chart and I need also to create a chart that use data located in the same workbook of the Chart Itself**. Moreover the customer want to choose the format of the graph, with all the 3D options available in Excel 2013. The result is that the aforementioned example in MSDN is quite useless.

After some tentative, I understood that even changing the type of chart is not a trivial stuff, so I wrote in MS [Forum to get an answer](http://social.msdn.microsoft.com/Forums/office/en-US/2aeff966-ffcb-4974-9c20-3fe9c14d0de2/pie-chart-based-on-range-in-excel#088d552e-33ae-408d-becc-0840c68c2730). The answer pointed me in the right direction, I was not aware a cool feature of a tool called [Productivity Tool for Microsoft Office](http://www.microsoft.com/en-in/download/details.aspx?id=30425), that permits you to open an office file, navigate between the various parts that compose the document, and being able to reflect the code of the Sdk needed to create that part of the document. It is the Reflector of Office document.

Apart of being really useful to understand how the SDK works, it can be used to generate the code for you. I’ve started filling a Sheet with some test data, create a chart on it and formatted until the customer told me that it is good.  **Opening that file in the Productivity tools and selecting that sheet gives you a class that contains the complete code to regenerate that specific sheet**. Since the chart grab the data from selected cell range, you can simply use that code to recreate the test sheet, and then change the content of the cells to reflect the data you want to show.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image16.png)

 ***Figure 1***: *The ability to Reflect Code creates a class that generates selected part.*

If you inspect generated code, it contains a CreateWorksheetPart method that accepts a WorksheetPart and fill it to make it identical to my test file. Once imported in your project you should do little modification to the code to suite your need. Since I need to generate multiple sheets, each one with a specific name, I need to change the CreateWorksheetPart method to accepts the name of the worksheet.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public void CreateWorksheetPart(WorksheetPart part, String sheetName)
{
    actualPart = part;
    this.sheetName = sheetName;

{{< / highlight >}}

Then locate into the code all the code lines where the original name of the worksheet is used and change it with the real name of the worksheet. This is an example of the type of code you can find.

{{< highlight csharp "linenos=table,linenostart=1" >}}


C.StringReference stringReference2 = new C.StringReference();
C.Formula formula2 = new C.Formula();
formula2.Text = "\'" + sheetName + "\'!$A$2:$A$100";

{{< / highlight >}}

You should have the original name referenced in more than a single part,  **be sure to inspect all the code to find all references**. I suggest you to use a very distinct name as the sheet name in the original Example file used to generate the code. Now I can simply use that class to generate the sheet for me.

{{< highlight csharp "linenos=table,linenostart=1" >}}


foreach (var stats in dataToDisplay)
{
    Excel.AddWorksheet(spreadsheet, stats.Title);
    var worksheetPart = spreadsheet.WorkbookPart.WorksheetParts.Last();
    GeneratedClass sheet = new GeneratedClass();
    sheet.CreateWorksheetPart(worksheetPart, stats.Title);

{{< / highlight >}}

I have some data to display,  **for each series of numbers I create a Worksheet** using a simple helper function called AddWorksheet I’ve found in this interesting article on CodeProject: [Creating Basic Excel workbook with Open Xml](http://www.codeproject.com/Articles/371203/Creating-basic-Excel-workbook-with-Open-XML).  **After these 4 lines of code I simply proceed to put data in the range of cells used to feed the chart** and everything should works correctly.

I was disappointed because generated excel file is not valid and even recovering it gave me a series of sheets with only the data and no charts. It turns out that generated code does not save created chart objects, but this can be easily solved adding a few lines in the end of the CreateWorksheetPart.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public void CreateWorksheetPart(WorksheetPart part, String sheetName)
{
    actualPart = part;
    this.sheetName = sheetName;

    DrawingsPart drawingsPart1 = part.AddNewPart<DrawingsPart>(chartPart1Id);
    var drawing = GenerateDrawingsPart1Content(drawingsPart1);

    ChartPart chartPart1 = drawingsPart1.AddNewPart<ChartPart>(chartPart1Id);
    GenerateChartPart1Content(chartPart1);

    ChartColorStylePart chartColorStylePart1 = chartPart1.AddNewPart<ChartColorStylePart>(chartColorStylePart1Id);
    GenerateChartColorStylePart1Content(chartColorStylePart1);

    ChartStylePart chartStylePart1 = chartPart1.AddNewPart<ChartStylePart>(chartPart1Id);
    GenerateChartStylePart1Content(chartStylePart1);

    GeneratePartContent(part);
    chartStylePart1.RootElement.Save();
    chartColorStylePart1.RootElement.Save();
    chartPart1.ChartSpace.Save();
    drawingsPart1.WorksheetDrawing.Save();
    part.Worksheet.Save();
}

{{< / highlight >}}

The overall process is really quick.

1) Create an excel with a sheet that contains some test data and a chart formatted as you like  
2) Save that file and open in the SDK Productivity tool  
3) Copy all the code related to the sheet and import into your project (change the name of the class to have more meaningful names)  
4) Add the save instructions to save generated object  
5) Modify the range reference to include the real name of the workbook (if you want to be able to change the name at runtime or you need to create multiple sheet)

And you are ok.

Gian Maria.
