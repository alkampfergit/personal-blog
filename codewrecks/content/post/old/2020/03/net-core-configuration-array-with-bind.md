---
title: "NET core configuration array with Bind"
description: ""
date: 2020-03-14T09:00:37+02:00
draft: false
tags: [NET Core]
categories: [NET Core]
---
New configuration system of.NET core is really nice, but it does not works very well with arrays,  **I have a configuration object that has an array of FirewallRules** {{< highlight csharp "linenos=table,linenostart=1" >}}


        public FirewallRule[] Rules { get; set; }

{{< / highlight >}}

This rule is simply composed by four simple properties.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class FirewallRule
{
    internal FirewallRule()
    {
    }

    public FirewallRule(string name, int udpPort, int tcpPort, string secret)
    {
        Name = name;
        UdpPort = udpPort;
        TcpPort = tcpPort;
        Secret = secret;
    }

    public String Name { get; set; }

    public Int32 UdpPort { get; set; }

    public Int32 TcpPort { get; set; }

    public String Secret { get; set; }
}

{{< / highlight >}}

Ok, nothing complex, now  **I’m expecting to being able to write this json configuration file to configure a single rule.** {{< highlight jscript "linenos=table,linenostart=1" >}}


{
  "Rules" : [
    {
      "Name": "Rdp",
      "UdpPort": 23456,
      "TcpPort": 3389,
      "Secret": "this_is_a_secret"
    }
 ]
}

{{< / highlight >}}

And being able to configure using standard Bind utilities of.NET configuration extensions.

{{< highlight csharp "linenos=table,linenostart=1" >}}


            const string testValue = @"
{
  ""Rules"" : [
    {
      ""Name"": ""Rdp"",
      ""UdpPort"": 23456,
      ""TcpPort"": 3389,
      ""Secret"": ""this_is_a_secret""
    }
 ]
}";
            using var ms = new MemoryStream(Encoding.UTF8.GetBytes(testValue));
            IConfiguration configuration = new ConfigurationBuilder()
               .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
               .AddJsonStream(ms)
               .Build();

            var config = new Configuration();
            configuration.Bind(config);

{{< / highlight >}}

Now I’m disappointed because  **the test fails because in Rules array I have only a single null element.** It seems that Bind does not work perfectly with arrays or am I doing something wrong.

The solution was quite simple, I created a method inside the Configuration object that will allows binding from a standard.NET Core IConfiguration object

{{< highlight csharp "linenos=table,linenostart=1" >}}


public void Bind(IConfiguration configuration)
{
    configuration.Bind(this);

    List<FirewallRule> rulesList = new List<FirewallRule>();
    var rules = configuration.GetSection("Rules").GetChildren().ToList();
    foreach (var rule in rules)
    {
        var firewallRule = new FirewallRule();
        rule.Bind(firewallRule);
        rulesList.Add(firewallRule);
    }

    Rules = rulesList.ToArray();
}

{{< / highlight >}}

As you can see **I explicitly get the section Rules, and for each child I explicitly created a FirewallRule and populate properties with standard Bind() method. And everything worked perfectly.** I’am a little bit puzzled, because I suspect that I’m doing something wrong because base Bind() method should work out of the box, but at least with this fix all tests are still green.

Gian Maria.
