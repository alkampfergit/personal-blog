---
title: "AspNET 20 GridView Custom Sorting with PagedDataSource"
description: ""
date: 2008-02-09T02:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
ASP.Net Web Form is a great environment, but sometimes make me surprised. Suppose you have this situation, you have a great amount of records that can be returned from the database and you must show them in a gridview. Surely you will enable paging to improve performance, but standard paging consist in retrieving from the database  **all the records** , give them to the grid that will do the paging. This is a tremendous waste of memory, suppose you do not cache the dataset and have 10.000 record, each time the user change page or sorting direction, you retrieve 10.000 record in a dataset...what a tremendous work for the Garbage Collector.

Even if you cache the result you do not scale well, this because probably the user will only check the first two or three pages, and there is no reason to cache all 10.000 records.

The solution is simple, there are a lot of way to tell the database to retrieve exactly the record you want, actually paging directly in the datasource, in SQL Server 2005 you have the ROWCOUNT keyword, but it is easy even in sql2000, here it is a sample function.

private String PrepareQuery(String orderClause, Boolean directionAscending, Int32 pageIndex, Int32 pagesize, Int32 recCount) {         
Int32 numOfRecToReturn = pagesize;         
Int32 pageWidth = pagesize \* (pageIndex + 1);         
if (pageWidth &gt; recCount) {         
numOfRecToReturn -= (pageWidth – recCount);          
}          
return String.Format(         
@" sp\_executesql N’  
select \* from  
(select top {0} \* from   
(select top {1} \* from Customers order by {2} {3}) a  
order by {2} {4}) b  
order by {2} {3}’;",         
numOfRecToReturn,          
pageWidth,          
orderClause,          
directionAscending ? "ASC" : "DESC",         
directionAscending ? "DESC" : "ASC");         
}

This function prepare the query dynamically, it accepts the column for ordering the data, the direction, pageIndex and pageSize, and needs also to know the recordCount. With this function I can do real and efficient paging and sorting of the data, but now I have a problem with GridView: to use custom paging you should wrap this function in an object and access with ObjectDataSource. I must admit that I do not like object data source, I do not remember exactly the name of the function etc etc, I want a simple method to tell to the GridView " **Hey take this 30 records, but the source has 10.000 record count so create the pager** ". To make this possible you must create your control, inheriting from GridView

public class MyGridView : GridView {

public Int32 RecordCount {         
get { return (Int32) (ViewState[RecordCountKey] ?? 0); }         
set { ViewState[RecordCountKey] = value;}         
}          
private const String RecordCountKey = "RecCount";

public Int32 CustomPageIndex {         
get { return (Int32)(ViewState[CustomPageIndexKey] ?? 0); }         
set { ViewState[CustomPageIndexKey] = value; }         
}          
private const String CustomPageIndexKey = "CustomPageIndexKey";

protected override void InitializePager(GridViewRow row, int columnSpan, PagedDataSource pagedDataSource) {         
pagedDataSource.AllowPaging = true;         
pagedDataSource.AllowCustomPaging = true;         
pagedDataSource.VirtualCount = RecordCount;          
pagedDataSource.CurrentPageIndex = CustomPageIndex;          
this.PageIndex = CustomPageIndex;          
base.InitializePager(row, columnSpan, pagedDataSource);         
}          
}

You need to create two additional properties used for custom paging, the RecordCount and the CustomPageIndex, after this you should override the InitializePager function, take the pagedDataSource object that gets constructed automatically from the gridView and modify some properties. You need to tell to the PagedDataSource that you want to do paging and you want to do also CustomPaging, then you set the VirtualCount of records and set the current page. In this way you are able to tell to the gridview that even if the dataSource has only 10 objects the total count is the VirtualCount property so the pager gets created.

Using this control is straightforward, here is the handler for the pageIndexChanging

protected void MyGridView1\_PageIndexChanging(object sender, GridViewPageEventArgs e) {         
MyGridView1.CustomPageIndex = e.NewPageIndex;          
DoBind();          
}

As you can see all you should do is to use the CustomPageIndex property. The DoBind function should set the RecordCount property.

private void DoBind() {         
Int32 count = GetCount();         
String Query =         
PrepareQuery(CurrentOrder, AscendingOrder, MyGridView1.CustomPageIndex, MyGridView1.PageSize, count);          
using (SqlDataAdapter da = new SqlDataAdapter(Query,          
"server=localhost\\sql2000;Integrated Security=SSPI;Database=Northwind")) {         
DataSet ds = new DataSet();         
da.Fill(ds, "Customers");         
MyGridView1.RecordCount = count;          
MyGridView1.DataSource = ds.Tables[0].DefaultView;          
MyGridView1.DataBind();          
}          
}

The GetCount() function does a *Select count(\*) from Customers*, and should cache the result, in the DoBind function we need simply to set the right number of record in the RecordCount property and the game is done, no ObjectDataSource, high performance, simple code.

[Download sample code for the article](https://www.codewrecks.com/blog/wp-content/uploads/2008/02/custompaging.zip "Example")

Alk.
