---
title: "Writing modular software with castle"
description: ""
date: 2009-09-14T09:00:37+02:00
draft: false
tags: [Architecture]
categories: [Software Architecture]
---
Thanks to [Castle Windsor](http://www.google.it/url?sa=t&amp;source=web&amp;ct=res&amp;cd=1&amp;url=http%3A%2F%2Fwww.castleproject.org%2Fcontainer%2Findex.html&amp;ei=wmKqStPfLIuwsAbHhZjkBw&amp;usg=AFQjCNFGZtGw-ordWFZS86FEFPnx-S_Jtg&amp;sig2=G6cxIH_hY5aZJ93egyGxEw) you can write really modular software. I'm building a project in WinForm that needs to access the domain model through a service layer on a WS\* service. One of the most annoying stuff is the need to setup a local service to test the application and the interface.

The key to speedup development is writing high modular software, thanks to castle this is really simple. First of all I use [guardian facility](http://www.nablasoft.com/guardian/index.php/2009/06/08/unity-wcf-service-resolution-container-extension/) to create proxy. This permits me to decide with configuration file if a service interface must be resolved with a proxy, or with a real class. This gives you immense flexibility.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image17.png)

Simply changing a configuration file I can use the concrete class that have access to the database, or pass through a ws\* wcf webservice. All people inside the organization, that have vpn and access through the vpn network to the database, can use the concrete class of the service, completely bypassing wcf, while people outside the organization use a config that use wcf service.

The application is structured with a light custom MVC pattern, if a controller needs to access a specific service he simply declare a dependency.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class XXXManagementController : IXXXManagementController
{
    public IXXXManagementService XXXManagementService { get; set; }

    public ICustomerService CustomerService { get; set; }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Here is the startup of the application.

{{< highlight xml "linenos=table,linenostart=1" >}}
[STAThread]
static void Main()
{
    Application.EnableVisualStyles();
    Application.SetCompatibleTextRenderingDefault(false);
    Application.Run(login = IoC.Resolve<Login>());
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to an autoscan facility, all view are registered with code, in this software the Login View is always the same form, so I can register with an attribute.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[AutoscanComponent(LifestyleType.Transient, IsDefault = true, Id = "Login", ServiceType = typeof(Login))]
public partial class Login : Form{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to autoscan I no need to register all the views in configuration file.

If it seems complex, you should consider the advantage of using a MCV architecture when is come time to test.

{{< highlight xml "linenos=table,linenostart=1" >}}
container.Register(Component.For(typeof (LoginController)).ImplementedBy<LoginController>());
LoginController sut = container.Resolve<LoginController>();
sut.Settings.LastLoggedUserName ="MyUser";
sut.Settings.LastLoggedCustomerId = 3;

List<Customer> customers = new List<Customer>()
                             {
                                 new Customer(1, "pippo", ""),
                                 new Customer(2, "pippo1", ""),
                                 new Customer(3, "pippo2", ""),
                             };

sut.CustomerService.Expect(c => c.GetAllCustomers()).Return(customers);
BindingSource bs = new BindingSource();
bs.DataSource = customers;
sut.View.Expect(v => v.SetCustomers(customers)).Return(bs);
sut.Start();
Assert.That(bs.Position, Is.EqualTo(2));
sut.View.AssertWasCalled(v => v.SetUserText("MyUser"));
sut.View.AssertWasCalled(v => v.SetFocusToPassword());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This seems a complex test but is really simple, I used a custom version of a [AutoMockingContainer](http://blog.eleutian.com/CommentView,guid,762249da-e25a-4503-8f20-c6d59b1a69bc.aspx) to resolve the LoginController and creating Mocks for each dependency. Since I've abstracted the settings of the application with an Interface, settings property of the controller is a mock, so I can setup lastloggedUserName and LastLoggerCustomerId, then I create a list of customer, and finally setup the expectations. The only bad stuff is that in windows form we does not have the power of binding of WPF, so I need to manage binding with BindingSource objects. The View is a WinForm that has some BindingSource defined in designer, and those BindingSource are passed to the controller. With this test I'm asserting that if the user was already logged, the controller sets last customer and last user in the interface.

The good stuff of this test, is that it uses mocks, so he do not need service, wcf, or anything else to be run.

alk.

Tags: [Architecture](http://technorati.com/tag/Architecture)
