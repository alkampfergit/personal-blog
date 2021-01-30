---
title: "Design for testability"
description: ""
date: 2007-05-11T22:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Testing a web application can be challenging, there are a lot of tools to accomplish such a difficult task, replay browser capable of recording the input of the user, library as nUnit Asp.NET or WatiN, but in my opinion the best way to do unit testing on a site, is design the site itself to be testable. In the example attached with this article I show a very simple asp.net page to add two integer number together starting from a canonical version to a more testable form.  Page Default.aspx shows a standard implementation where all the code to perform the validation and the addition is enclosed in the code behind file. This example is very simple but is significant because it follows a standard path for web.page, validate user input, perform business logic and show result or error messages to the user. What is wrong with this implementation is the difficulty to do a unit test to verify the correctness of both validation code and business logic. (I know that there is no need to test a simple addition, but think as if this example really contains complex business logic).

protectedvoid  Button1\_Click(object  sender,  EventArgs  e)  {  
if  (ValidateInput())  {  
        txtResult.Text  =  (Int32.Parse(TextBox1.Text)  +  Int32.Parse(TextBox2.Text)).ToString();  
  }  
else  {  
        txtResult.Text  =  String.Empty;  
  }  
}  
  
privateBoolean  ValidateInput()  {  
Int32  num;  
  lblError.Text  =  String.Empty;  
if  (!Int32.TryParse(TextBox1.Text,  out  num))  {  
        lblError.Text  =  “Primo  addendo  errato”;  
  }  
if  (!Int32.TryParse(TextBox2.Text,  out  num))  {  
        lblError.Text  +=  “  Secondo  addendo  errato”;  
  }  
returnString.IsNullOrEmpty(lblError.Text);  
}

Sadly enough a lot of application are written in this way, the first thing to do to make this code testable, is moving away business logic code and verification code in a different assembly, and write some unit test against it. Page3.aspx is a possible result

protectedvoid  Button1\_Click(object  sender,  EventArgs  e)  {  
if  (ValidateInput())  {  
        TextBox3.Text  =  DomainLogic.Domain2.Add(  
Int32.Parse(TextBox1.Text),  
Int32.Parse(TextBox2.Text)).ToString();  
  }  
else  {  
        TextBox3.Text  =  String.Empty;  
  }  
}  
  
privateBoolean  ValidateInput()  {  
  
  lblError.Text  =  DomainLogic.Domain2.ValidateInput(  
        TextBox1.Text,  TextBox2.Text);  
returnString.IsNullOrEmpty(lblError.Text);  
}

Now you can see that code behind delegate the business logic and the validation to an external class contained into an external assembly. It is worth to notice that if you put code in app\_code directory this code cannot be tested with xUnit frameworks. If you look at the example you can now see that the Domain Logic and validation code can be tested in Nunit project, the test file is called TestPAge3Logic.cs.

But this page is still not fully testable, this because some logic still lurks around code behind file. To achieve full testability really no logic should be included in code behind file, but in page3.aspx we have still embedded the logic of displaying the result to the user. The route to maximum testability lead to Model View Controller pattern, but it is not the subject of this post. If you look at page4.aspx you can see that code behind file really contains no logic.

publicpartialclassPage4  :  System.Web.UI.Page,  DomainLogic.IPageAddition  {  
protectedvoid  Page\_Load(object  sender,  EventArgs  e)  {  
  
  }  
  
  #region  IPageAddition  Members  
  
publicvoid  SetError(string  errorString)  {  
        lblError.Text  =  errorString;  
        lblError.Visible  =  true;  
  }  
  
publicvoid  SetResult(string  resultValue)  {  
        txtResult.Text  =  resultValue;  
  }  
  
  #endregion  
  
protectedvoid  Button1\_Click(object  sender,  EventArgs  e)  {  
        DomainLogic.Domain3.PerformAdd(TextBox1.Text,  TextBox2.Text,  this);    
  }  
}

The key is to enclose the operation of the UI in an interface, and make the page implement this interface. In this example the logic of the page can be reduced to two operation: display the result and display the error messages to the user, so the interface contains only two methods: *SetError()* and *SetResult()*. The handler of the button now delegate all the work to the Domain3 object, that can be seen as the controller for the MVC pattern. Domain3 has a method called *PerformAdd()* that contains all the logic of the page, it validates input, calls business logic method, and finally drive the UI to show result or errors. As you can see PerformAdd() method accepts as parameters the raw input of the user as well as an instance of *DomainLogic.IPageAddition*object. The whole method is really simple

publicstaticvoid  PerformAdd(  
String  addendo1,    
String  addendo2,    
IPageAddition  page)  {  
  
Int32  add1,  add2;  
String  errorString  =  String.Empty;  
if  (!Int32.TryParse(addendo1,  out  add1))  {  
        errorString  =  “Primo  addendo  errato”;  
  }  
if  (!Int32.TryParse(addendo2,  out  add2))  {  
        errorString  +=  “  Secondo  addendo  errato”;  
  }  
if  (String.IsNullOrEmpty(errorString))  {  
        page.SetResult((add1  +  add2).ToString());  
  }  
else  {  
        page.SetResult(“”);  
        page.SetError(errorString);    
  }  
}

As you can see this method is really simple and it is  **Fully Testable**. Working this way is the path to Design For Testability, a page designed like this can be easily tested with mock object. Using RhinoMocks we can do a lot of useful tests: first of all we check that the controller does a good addition

[Test]  
publicvoid  TestGood()  {  
MockRepository  rep  =  newMockRepository();  
  DomainLogic.IPageAddition  ipa  =  rep.CreateMock&lt;DomainLogic.IPageAddition&gt;();  
  ipa.SetResult(“15”);  
  rep.ReplayAll();  
  DomainLogic.Domain3.PerformAdd(“12”,  “3”,  ipa);  
  rep.VerifyAll();  
}

This test verifies that passing “12” and “3” as user input the controller calls SetResult() method on the UI with the value “15”, but we can do more interesting tests.

[Test]  
publicvoid  TestWrong2()  {  
MockRepository  rep  =  newMockRepository();  
    DomainLogic.IPageAddition  ipa  =  rep.CreateMock&lt;DomainLogic.IPageAddition&gt;();  
    ipa.SetResult(“”);  
    ipa.SetError(“”);  
LastCall.IgnoreArguments();  
    rep.ReplayAll();  
    DomainLogic.Domain3.PerformAdd(“12”,  “32f”,  ipa);  
    rep.VerifyAll();  
}

This test verifies that passing parameters  “12” and “32f”, the controller calls SetError(), because the second addend is not an integer number, and also calls SetResult() with an empty string to clear a previous result if present. The key concept here is that the UI is abstracted with an interface, so it can be really simulated by a mock object and we can verify that the controller interacts with the UI correctly.

This little example shows that to really test every aspect of an application, the application itself must be  **designed to be testable**. Moreover, an application designed in this way is really loosely coupled, if we needs to realize a windows version of the UI it is matter of seconds, because all the logic is detatched from the UI.

Alk.

[sample11.zip](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2007/05/sample11.zip "sample11.zip")
