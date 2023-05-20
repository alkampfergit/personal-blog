---
title: "WatiN looking for content in GridView"
description: ""
date: 2007-06-19T04:00:37+02:00
draft: false
tags: []
categories: [General]
---
Quite often I need to automate test page and check that the contents of a GridView contains exactly some strings. First of all I have an [helper class](http://www.nablasoft.com/Alkampfer/?p=53) that helps me to cope with the name that asp.net give to controls contained in another controls, then I write some helper methods to assert that the content of a grid is what I expected to be.

publicstaticvoid  TableContentEqAssertion(IE  ie,  String  tableName,  Int32  row,  Int32  col,  String  expectedvalue)  {  
              NUnit.Framework.Assert.AreEqual(  
                    expectedvalue,    
                    ie.Table(AspControlFinder.FindById(tableName)).TableRows[row].TableCells[col].InnerHtml  );  
        }

This simple function accepts the IE entity used to check the table, then the row and column of the table and finally the expected value. I simply call this function in this way.

Helpers.TableContentEqAssertion(ie,  “GridEsperienze”,  1,  1,  “–“);

Simple and concise. But this is not enough, 99% of the times I need to make test and verify that the whole content of the table will contains expected test, with the above function I need to do code like this.

Helpers.TableContentEqAssertion(ie,  “GridEsperienze”,  1,  1,  “–“);  
Helpers.TableContentEqAssertion(ie,  “GridEsperienze”,  1,  2,  “Segretario  Ricevimento”);  
Helpers.TableContentEqAssertion(ie,  “GridEsperienze”,  1,  3,  “aziendaaaaaaaaaaa”);  
Helpers.TableContentEqAssertion(ie,  “GridEsperienze”,  1,  4,  “segretariato”);

This is not exiting L, so I decided to create another function,

publicstaticvoid  TableContentEqAssertion(  
IE  ie,  
String  tableName,  
Int32  startingrow,  
paramsString[]  expectedvalue)  {  
  
              WatiN.Core.Table  t  =  ie.Table(AspControlFinder.FindById(tableName));  
Int32  numOfColumn  =  t.TableRows[startingrow].TableCells.Length;  
Int32  curRow  =  startingrow;  
Int32  curColumn  =  0;  
foreach  (String  expected  in  expectedvalue)  {  
if  (expected  !=  null  )  
                          NUnit.Framework.Assert.AreEqual(expected,  t.TableRows[curRow].TableCells[curColumn].InnerHtml);  
if  (++curColumn  &gt;=  numOfColumn)  {  
                          curColumn  =  0;  
                          curRow++;  
                    }  
              }  
        }

This is far better, this function accepts the IE instance, the name of the grid, the starting row (usually 1 to avoid the header) and then a variable number of string arguments. Internally the function simply scan table cells one after another and does an assertion for each not null value in the expectedValue array. For example, in a test I have to verify content of a gridview with 8 column, 2 row + the header and the last three columns contain buttons for Create New, Delete and edit operation and should not be tested. I create the following test.

Helpers.TableContentEqAssertion(ie,  “GridEsperienze”,  1,    
“06/1991”,“–“,  “Segretario  Ricevimento”,“aziendaaaaaaaaaaa”,“segretariato”,  
null,  null,  null,  “06/1959”,  “06/1991”,  “Satinatore  di  metalli”,  “la  mia  azienda”,  “Satinatore  professionista  completo”);

This is a more readable test.

Alk.
