---
title: "Adapting a model to make binding simpler"
description: ""
date: 2009-03-17T10:00:37+02:00
draft: false
tags: [NET framework,Software Architecture,WPF]
categories: [NET framework,Software Architecture,WPF]
---
I have a domain model composed by Clients, each client has a series of associated Typology objects and each Typology object has a certain number of associated Target. Now I need to bind this model to a series of three combo in WPF, but I have this little problem

The model is not directly accessible, I have already a service that has functions like GetAllCustomer, GetTyplogyForCustomer(Int32 customerId) and GetTargetForTyplogy(Int32 typologyId). Each method returns a list of the corresponding object, but they are DTO and not real object, so the Customer, Typology and Target returned from the service have no relation between them. Moreover I do not want to load everything when the application starts, because it will be extremely slow, I want to be able to load data as it needed, with lazy load. I created a couple of classes that I can use to lazily load entities

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image3.png)  The  **LazyPartitionedList** class is used to load collection of data partitioned by some value. I need such a base class for typology, I do not want to load all typologies in a single shot, I need only to load for currently selected customer, then when the current customer changed on the WPF interface I need to load (if it was not already loaded) from the service the list of typologies for the new customer. The LazyPartitionedList does this all for me. Then I create a browser class that link all toghether

{{< highlight CSharp "linenos=table,linenostart=1" >}}
   public class AnalysisDefinitionBrowser
   {
      private LazyCollection<Client> customers;
      private LazyPartitionedCollection<TypologyDto, Client> typologies;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The class analysisDefinitionBrowser have a lazycollection of customers (it loads all customer in one shot) then It has a LazyPartitionedCollection of TypologyDto partitioned by Client object. In the constructor of this object I initialize everything

{{< highlight xml "linenos=table,linenostart=1" >}}
customers = new LazyCollection<Client>(
   () => Services.CustomerService.GetAllClient().ToList());
typologies = new LazyPartitionedCollection<TypologyDto, Client>(
  c => Services.KeywordService.GetTipologiesForCustomer(c.Id));
...
customers.Reinit();
cvCustomers = CollectionViewSource.GetDefaultView(customers);
if (cvCustomers != null)
{
  cvCustomers.CurrentChanged += cvCustomers_CurrentChanged;
}
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Customers gets immediately loaded (Reinit Method), the interesting thing is that the LazyPartitionedCollection for typology Id is initialized with a function that calls the service to load typologies for current customer, actually no typology gets loaded. Another interesting thing is that using the CollectionViewSource Iâ€™m able to retrieve the default view for the Customer list.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
void cvCustomers_CurrentChanged(object sender, EventArgs e)
{
   CurrentClient = (Client)cvCustomers.CurrentItem;
}
private Client CurrentClient
{
   get { return currentClient; }
   set
   {
      currentClient = value;
      if (value != null)
         typologies.LoadPartition(value);
      currentTypologies.Clear();
      foreach (TypologyDto typology in typologies.Where(t => t.CustomerId == value.Id))
      {
         currentTypologies.Add(typology);
      }
   }
}
private Client currentClient;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The property CurrentClient have a particular Setter part, it loads the partition of the current Client object, then it copy in an ObservableCollection&lt;TypologyDto&gt; called currentTypologies only the typologies that are associated to current customer. With this trick if I already loaded that partition data are in memory and the service gets called only the first time, and only when it is needed. With this code Iâ€™ve created a class that load data only when it is needed, and keep selection in sync with the current properties. The beautiful thing of this object is that I can test it with no problem

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private void TestTemplate(
   Action<ICustomerService,IKeywordService> SetupAction, 
   Action ExerciseAction)
{
   ICustomerService cs = RhinoRepository.StrictMock<ICustomerService>();
   IKeywordService ks = RhinoRepository.StrictMock<IKeywordService>();

   SetupAction(cs, ks);
   RhinoRepository.ReplayAll();
   using (Services.CustomerService.Override(cs))
   using (Services.KeywordService.Override(ks))
   {
      ExerciseAction();
      RhinoRepository.VerifyAll();
   }
}

[Test]
public void VerifyLoadingOfTheSecondLevelTwoCustomer()
{
   Client c1 = new Client() { Id = 111 };
   Client c2 = new Client() { Id = 222 };
   TypologyDto t1 = new TypologyDto() { Id = 444, Name = "1", CustomerId = c1.Id };
   TypologyDto t2 = new TypologyDto() { Id = 445, Name = "2", CustomerId = c2.Id };
   TypologyDto t3 = new TypologyDto() { Id = 446, Name = "3", CustomerId = c2.Id };
   TestTemplate((cs, ks) =>
   {
      Expect.Call(cs.GetAllClient()).Return(new[] { c1, c2 });
      Expect.Call(ks.GetTipologiesForCustomer(c1.Id))
        .Repeat.Once()
        .Return(new List<TypologyDto> { t1 });
      Expect.Call(ks.GetTipologiesForCustomer(c2.Id))
        .Return(new List<TypologyDto> { t2, t3 });
   },
    () =>
    {
       AnalysisDefinitionBrowser sut = new AnalysisDefinitionBrowser();
       sut.cvCustomers.MoveCurrentToPosition(-1); //Resetto il binding
       sut.cvCustomers.MoveCurrentToFirst(); // Mi muovo sul primo
       Assert.That(sut.CurrentTipologies, Has.Count(1));
       sut.cvCustomers.MoveCurrentToPosition(1); // Mi muovo sul primo
       Assert.That(sut.CurrentTipologies, Has.Count(2));
       sut.cvCustomers.MoveCurrentToFirst(); // Mi muovo sul primo
       Assert.That(sut.CurrentTipologies, Has.Count(1));
    });
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The TestTemplate is used to create and setup mock for services, my services classes are static wrapper that permits me to override the real instance of service used, so I can use a different mock for each call of the service. Then the test simply setup some expectation and exercise the AnalysisDefinitionBrowser with direct manipulation of the ICollectionView object, thus simulating the user that changes currently selected item in the interface.

This test access the cvCustomers internal ICollectionView object because the Test assembly is InternalVisibleTo the test that contains the sut. The XAML code is something like this (Iâ€™ve bound a controller as the root source of the page, the controller initialize an instance of AnalysisDefinitoinBrowser and expose it with a dependency property called AnalysisDefinition)

{{< highlight xml "linenos=table,linenostart=1" >}}
<ComboBox DockPanel.Dock="Top" 
          ItemsSource="{Binding AnalysisDefinition.Customers}" 
          IsSynchronizedWithCurrentItem="True" 
          DisplayMemberPath="Name" 
          SelectedValuePath="Id"></ComboBox>
         ...
<ComboBox ItemsSource="{Binding AnalysisDefinition.CurrentTipologies}" 
          IsSynchronizedWithCurrentItem="True" 
          DisplayMemberPath="Name" 
          SelectedValuePath="Id" ></ComboBox>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now when I fired the application and look into the sql server profiler I can see that object gets transparently loaded while Iâ€™m browsing the objects with the two combo, each time I select a new customer I see query that load related typologies, when I select a customer that was already selected in the past data are already in memory.

alk.

Tags: [WPF](http://technorati.com/tag/WPF) [Binding](http://technorati.com/tag/Binding)
