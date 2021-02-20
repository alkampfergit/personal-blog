---
title: "Model View Controller and Cross Thread Ui methods invoke"
description: ""
date: 2007-10-30T05:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
If you adopt a MVC pattern for your code in windows forms, each form should implements some Interface to make possible for the controller to communicate with the UI. This is needed so the Controller does not work directly with the form but instead with an interface such as *IShippingUi*. But what happens when the function of the controller are invoked not by the main thread that rules the UI...the result is an exception.

In a recent project of mine the form should receive data read from a RfId reader, so I have a dedicated thread that listen to the hardware to read data from the tags, then when the thread read a bunch of tags it calls a function of the controller that does some lookup into the database and call a specific event on the UI to inform the user on real data read. This is an extracts of the interface of the UI

publicinterfaceIShippingUI  :  IBaseUi  {  
  
void  ListElementReceived(IList&lt;ExchangeData&gt;  received);  
  …  
}  
As you can see the UI expect a list of ExchangeData, a specific entity of my project, it is duty of the controller to read raw byte[] data coming from the reader and make a lookup into the database to rehydrate the real ExchangeData entities associated with the hardware tag data. Usually I use an external component that setup the MVC, it creates the controller and the UI and then calls a method of controller to init the MVC stuff, if I pass a form that implements IShippingUI to the controller, when the controller method ReceiveData() is invoked by another thread, the ui cannot update its controls, because controls can be modified only by the main UI thread.

I do not want to pollute controller with the logic to handle this, nor the form itself, so I decided to create a dedicated object to handle this.

internalclassSyncronizedShippingUi  :  IShippingUI  {  
  
protectedinternalreadonlyISynchronizeInvoke  ui;  
  
public  SyncronizedShippingUi(ISynchronizeInvoke  ui)  {  
this.ui  =  ui;  
  }  
  
  #region  IShippingUI  Members  
  
publicvoid  ListElementReceived(IList&lt;ExchangeData&gt;  received)  {  
        ui.Invoke((VoidFunc&lt;IList&lt;ExchangeData&gt;&gt;)  delegate(IList&lt;ExchangeData&gt;  data)  {  
              ((IShippingUI)ui).ListElementReceived(data);  
        },  newObject[]  {received});  
  }  
  
#endregion  
}  
As you can see this class implements the IShippingUI interface, and he need a ISynchronizeInvoke object to work with. This particular interface is the one implemented by each object that needs his methods to be invoked in a specific thread, as for the System.Windows.Forms.Control object. The SyncronizedUi does nothing but delegating the invocation of the function to the real wrapped object. To make this code more secure we need to make a check into the controller to verify that object passed as argument implements also the IShippingUI interface, I omitted for clarity. With anonymous delegate the code is really short and readable. The VoidFunc&lt;&gt; delegate is a standard delegate that I use on my projects.

publicdelegatevoidVoidFunc();  
publicdelegatevoidVoidFunc&lt;TParam1&gt;(TParam1  param1);  
…

With this code it is duty of the object that setup the MVC to decide if we need a synchronized ui or we can set up a direct communication.

frmShipping  f  =  newfrmShipping();  
IShippingControllerBase  controllerBase  =  newShippingControllerExitGate(  
newSyncronizedShippingUiExitGate(f));

Alk.
