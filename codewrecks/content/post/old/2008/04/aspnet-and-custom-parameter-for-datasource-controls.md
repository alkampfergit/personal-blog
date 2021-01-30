---
title: "ASPNet and custom parameter for datasource controls"
description: ""
date: 2008-04-29T23:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
ASp.net 2.0 introduces datasource controls, such as SqlDataSource and ObjectDataSource, these controls work quite well, expecially the objectDataSource that permits you to bind to methods of a custom object. In an application of mine there is a user control that has a datagrid with custom logic, that data should be enclosed in different pages, and the control support filtering records. The problem is that in some page we need to be able to pass a parameter to querystring to set the filter, in other pages we have a series of control used by the user to set the filter. The obvious solution is to create a custom parameter object to support this situation.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
Public Class CustomControlParameter : Inherits System.Web.UI.WebControls.ControlParameter

  Public Property QueryStringPath() As String
            Get
                Return mQueryStringPath
            End Get
            Set(ByVal value As String)
                mQueryStringPath = value
            End Set
        End Property
        Public mQueryStringPath As String

        Protected Overrides Function Evaluate(ByVal context As System.Web.HttpContext, ByVal control As System.Web.UI.Control) As Object
            If Not String.IsNullOrEmpty(QueryStringPath) Then
                Dim queryStringvalue As String = context.Request.QueryString(QueryStringPath)
                If Not String.IsNullOrEmpty(queryStringvalue) Then
                    Return queryStringvalue

                End If
            End If

            If ControlID.Length = 0 Then
                Return Nothing
            End If
            Dim component As Control = Utils.RecFindControl(control.Page.Controls, ControlID)
            If component Is Nothing Then
                Return Nothing
            End If

            Return MyBase.Evaluate(context, control)
        End Function
    End Class
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The control is really simple, it inherit from the standard ControlParameter, and it defines another property called  **QueryStringPath** used to specify the key in the querystring that contains the parameter. The core of the work is done overriding the Evaluate function, first I check if the data is in the querystring (that is prioritary), if not I check if the control exists using a recursive function called RecFindControl, then if the control does not exists I simply return nothing, if the control exists I delegate the work to the base class.

With this parameter I can solve my problem

alk.

Tags: [ASP.Net](http://technorati.com/tag/ASP.Net) [DataSource](http://technorati.com/tag/DataSource)
