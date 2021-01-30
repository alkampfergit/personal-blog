---
title: "Loving MMVM and asynchronous operations"
description: ""
date: 2011-04-21T11:00:37+02:00
draft: false
tags: [MVVM]
categories: [WPF]
---
Iâ€™m using in a project a modified version of MVVM in WPF originally made by my dear friend [Mauro](http://www.topics.it/) (check his project [Radical](http://radical.codeplex.com/), it is really cool). Actually I use a custom DelegateCommand to handle communication between View and the View Model. Here is a sample snippet on how I initialize a command in View Model.

{{< highlight csharp "linenos=table,linenostart=1" >}}
SaveCurrent = DelegateCommand.Create()
.OnCanExecute(o => this.SelectedLinkResult != null)
.TriggerUsing(PropertyChangedObserver.Monitor(this)
.HandleChangesOf(vm => vm.SelectedLinkResult))
.OnExecute(ExecuteSaveCurrent);
{{< / highlight >}}

This works but I need to solve a couple of problems.

The first one is that I never remember the syntax :). I find the name *TriggerUsing()* somewhat confusing (it is surely my fault :) ) and moreover I hardly remember *PropertyChangedObserver* name of the class used to monitor the change of a property. This cause me every time I create a new DelegateCommand to search another VM to copy initialization. Since monitoring change of a property to reevaluate if a command can be executed is probably one of the most common logic, I wish for a better syntax to avoid being puzzled on what method to call.

![](http://successbeginstoday.org/wordpress/wp-content/uploads/2008/01/problems.jpg)

The second problem is that some operations are really time consuming (they talk with remote service that does heavy operations), and I need to disable all controls in the UI while showing some indicator that a time consuming operation is running. To achieve this result I want to write as less code as possible and I want to delegate everything to the DelegateCommand. Here is final result

{{< highlight csharp "linenos=table,linenostart=1" >}}
SaveCurrent = AsyncDelegateCommand.Create(this)
.OnCanExecute(o => this.SelectedLinkResult != null)
.MonitorProperty(vm => vm.SelectedLinkResult)
.OnExecuteAsync(ExecuteSaveCurrent);
{{< / highlight >}}

I found this syntax really simple, first of all I use a AsyncDelegateCommand that can be created only with a reference to the current ViewModel, it declares a method  **MonitorProperty()** that accepts an expression to specify witch property to monitor for reevaluation of OnCanExecute(). Finally I added a OnExecuteAsync that permits me to execute the command asynchronously.

All the burden of execution the command is now moved to another thread, and while the user wait for the result often we need to show a waiting indicator that suggest to the user that the program is working, and most important, this wait indicator will prevent the user to operate on controls while the command is executing. All this  burden is handled by *BaseViewModel*a base class used by every ViewModel. The only difference is that a ViewModel can simply use the *OnExecute()* or *OnExecuteAsync()*to decide to execute the command in the same thread of the UI or in different thread. You need only to pay attention when the async operation touches objects like Observable collections, because a change in a ObservableCollection will trigger an UI update and could be done only in the main UI thread.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void ExecuteGetData(object obj)
{
var result = GetResult();
UiThread.RunSync(() => PrepareNewPageOfData(result));
}
{{< / highlight >}}

This is done thanks to UiThread helper function. In future post Iâ€™ll show you some implementation Details.

alk.
