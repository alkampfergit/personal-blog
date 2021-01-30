---
title: "ConventionalCommand in MVVM architecture"
description: ""
date: 2012-07-14T07:00:37+02:00
draft: false
tags: [MVVM,WPF]
categories: [WPF]
---
The original idea of ConventionalCommand was taken by [Radical Framework](http://radical.codeplex.com/) of my dear friend [Mauro](http://milestone.topics.it/), the purpose is  **using a Convention over Configuration to bind Ui element to Commands in a MVVM architecture**. You can find a real good and complete implementation of this concept in Radical, but I created a custom smaller and trivial stand-alone implementation to use in some of my project based on custom MVVM architecture. If you need a more robust and mature implementation I suggest you to have a look at Radical, but if you already have some custom code and you do not want to introduce dependency to an entire library only to use this concept I will show you how simple is to create a  **Command object that is capable to binding to MVVM methods based on Conventions**.

My typical ViewModel usually exposes one property of type DelegateCommand for each Command it implements and needs to initialize all commands with a  Fluent-like interface.

{{< highlight csharp "linenos=table,linenostart=1" >}}


     public DelegateCommand InsertLink { get; private set; }
.....
     public void InitializeCommands() {
            InsertLink = AsyncDelegateCommand.Create(this)
               .OnCanExecute(o => !String.IsNullOrEmpty(UrlToNavigate))
               .WaitMessage("Saving")
               .MonitorProperty(vm => vm.UrlToNavigate)
               .OnExecuteAsync(ExecuteInsert);

{{< / highlight >}}

As you can see initialization code define the CanExecute lambda, used by WPF to ask if the command can be executed, the WaitMessage specify the message to show in the UI during command execution (UI is disabled during command execution). MonitorProperty permits to specify properties that are used by the CanExecute lambda, whenever one of these property changes (you can call multiple time the MonitorProperty, once for each property you want to watch) AsyncDelegateCommand tells WPF to reevaluate the CanExecute lambda, finally the OnExecuteAsync specify the method to call when the command is invoked.

 **This structure has the advantage to create Designer-Bindable commands** , if you drop a button in the UI in blend, you can then browse all properties of ViewModel and choose the command to bind to the Button.Command property, but you have to type a lot of plumbing code in ViewModel for each command you want to implement and this started to become annoying.  **If you do not care to see available commands in blend designer, you can create a ConventionalCommand that operates based on convention**. Here is the full code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


    public class ConventionalCommand : ICommand
    {
        private FrameworkElement boundObject;

        private String commandName;

        private Boolean isAsync;

        private String waitMessage;

        public ConventionalCommand(FrameworkElement boundObject, String commandName, Boolean isAsync, String waitMessage)
        {
            this.boundObject = boundObject;
            this.commandName = commandName;
            this.isAsync = isAsync;
            this.waitMessage = waitMessage;
            RelatedViewModel = boundObject.DataContext as BaseViewModel;
            this.boundObject.DataContextChanged += boundObject_DataContextChanged;
        }

        void boundObject_DataContextChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            RelatedViewModel = e.NewValue as BaseViewModel;
        }

        BaseViewModel relatedViewModel;
        MethodInfo canExecute;
        MethodInfo execute;

        private BaseViewModel RelatedViewModel
        {

            get
            {
                return relatedViewModel;
            }
            set
            {
                if (relatedViewModel != null) {
                    relatedViewModel.PropertyChanged -= relatedViewModel_PropertyChanged;
                }
                relatedViewModel = value;
                if (relatedViewModel != null)
                {
                    Type vmt = relatedViewModel.GetType();
                    canExecute = vmt.GetMethod("CanExecute" + commandName, System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
                    execute = vmt.GetMethod("Execute" + commandName, System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
                    if (execute == null) {
                        Debug.WriteLine("Binding Error - Command Execute" + commandName + " not found in viewmodel of type " + vmt.GetType());
                    }
                    relatedViewModel.PropertyChanged += relatedViewModel_PropertyChanged;
                }
                OnCanExecuteChanged();
            }
        }

        void relatedViewModel_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "CanExecute" + commandName) 
            {
                OnCanExecuteChanged();
            }
        }

        public event EventHandler CanExecuteChanged;

        protected virtual void OnCanExecuteChanged()
        {
            EventHandler temp = CanExecuteChanged;
            if (temp != null)
            {
                temp(this, EventArgs.Empty);
            }
        }

        public bool CanExecute(object parameter)
        {
            if (RelatedViewModel == null) return false;
            if (canExecute == null) return true;

            return (Boolean)canExecute.Call(RelatedViewModel, new Object[] { parameter });
        }

        public void Execute(object parameter)
        {
            if (RelatedViewModel == null) return;

            if (!isAsync)
            {
                execute.Call(RelatedViewModel, new Object[] { parameter });
            }
            else 
            {
                RelatedViewModel.Execute(() => execute.Call(RelatedViewModel, new Object[] { parameter }), true, waitMessage);
            }
        }
    }

{{< / highlight >}}

ConventionalCommand is based on the following assumption. It has a commandName field used to specify the name of the command and given this name the following conventions are used

1. *Method name on the ViewModel that executes the command should be called ExecuteXXX where XXX is commandName value.*

2. *The function that determines if the command can be executed should be called CanExecuteXXX where XXX is commandName value*

3. *The reevaulation of the CanExecuteXXX is done if the viewmodel raise a property changed with property name CanExecuteXXX (even if a property with such a name does not exists).*

To avoid suffering performance penalties due to invocation through reflection I’ve simply used the [FastReflect](http://fasterflect.codeplex.com/) library that uses LCG to invoke methods at runtime. The code is really trivial, is based on a custom MVVM architecture **it stores the ViewModel that contains the method that implement the command inside a *RelatedViewModel* **property and then it uses RelatedViewModelExecute method to execute some code asynchronously and automatically setting the ViewModel in Busy status until the command finishes.

The main problem you need to face with such a structure is due to the fact that** you have no control over binding execution ordering and this is a problem to find the reference to RelatedViewModel **. If you look at the code you can see that constructor accepts a reference to the FrameworkElement that is used for the binding (Es. a Button)** and the command register itself to the DataContextChanged event. This is needed because you need to determine the value of RelatedViewModel at runtime from the DataContext property of FrameworkEement that is binding to the ConventionalCommand **. Thanks to DataContextChanged I can simply monitor whenever the DataContext of the FrameworkElement changed and update RelatedViewModel accordingly. This makes me indipendent from the order of binding execution, if the ConventionalCommand is created before DataContext of framework element is set, I do not have problem because I’ll be notified of the DataContext property changed when binding engine will change DataContext of Frameworkelement. All reflection code is inside the setter of RelatedViewModel and is really trivial code that does not work explanation.

To easy the use of this command you need a MarkupExtension and I decided to call it** MvvmCommand **,

{{< highlight csharp "linenos=table,linenostart=1" >}}


    public class MvvmCommand : MarkupExtension
    {

        /// <summary>
        /// This is the path of the command, the ViewModel should have a method called ExecutePath to 
        /// make everything work.
        /// </summary>
        public String CommandName { get; set; }

        [DefaultValue(false)]
        public Boolean IsAsync { get; set; }

        [DefaultValue("")]
        public String WaitMessage { get; set; }

        public MvvmCommand()
        {
            WaitMessage = String.Empty;
            CommandName = String.Empty;
        }

        public MvvmCommand(String path) : this() 
        {
            this.CommandName = path;
        }

        /// <summary>
        /// we need to provide the ICommand that will take care of command invocation.
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <returns></returns>
        public override object ProvideValue(IServiceProvider serviceProvider)
        {
            var service = serviceProvider.GetService(typeof(IProvideValueTarget)) as IProvideValueTarget;
            if (service == null) return false;

            FrameworkElement dobj = service.TargetObject as FrameworkElement;
            if (dobj == null) throw new ApplicationException("Cannot do Conventional Command Binding");
            return new ConventionalCommand(dobj, CommandName, IsAsync, WaitMessage);
        }
    }

{{< / highlight >}}

Thanks to this structure when I need to bind Command property of a control in the Ui to a method of the ViewModel I can simply write:

{{< highlight xml "linenos=table,linenostart=1" >}}


<Button Content="SaveAll"  Command="{mvvm:MvvmCommand SaveCustomer}"/>

{{< / highlight >}}

This declaration binds the button command to a SaveCustomer command so it looks for** CanExecuteSaveCustomer **and** ExecuteSaveCustomer**methods inside ViewModel. You do not need to create DelegateCommand property in ViewModel nor you need to create the command, you should only declare the above two methods and be sure that whenever you want WPF binding engine to reevaluate CanExecuteSaveCustomer you should raise a PropertyChanged event of the “CanExecuteSaveCustomer” fictional property.  To easy this last part I can write this code thanks to the PropertyLink helper

{{< highlight csharp "linenos=table,linenostart=1" >}}


            PropertyLink.OnObject(this)
               .Link(vm => vm.UserEmail, "CanExecuteSaveCustomer")
               .Link(vm => vm.UserName, "CanExecuteSaveCustomer")

{{< / highlight >}}

This code is contained in the constructor of ViewModel and basically is used to link notification of properties together. The above code means, link property on *this*ViewModel and whenever the UserEmail changes notify also the change ov CanExecuteSaveCustomer. The only ugly part is that you need to specify the name of linked property with a string, because there is no real property CanExecuteSaveCustomer on the ViewModel.

Gian Maria.
