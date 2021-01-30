---
title: "A better nUnit assertion to verify content of a database Row"
description: ""
date: 2008-06-30T08:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Sometimes you need to check that the content of various fields in a database row match some constraints, in this situation a little helper could make it possible to write more elegant assertion

{{< highlight sql "linenos=table,linenostart=1" >}}
[Test]
public void TestInsertACustomerDataFluent()
{
    NorthwindCustomerDao sut = new NorthwindCustomerDao();
    sut.CreateACustomer("RICCI", "DotNetMarche", "contact", "Loc piano frassineta 31");
    DbAssert.OnQuery(
        @"SELECT * from Customers where CustomerId = 'RICCI'")
       .That("CustomerID", Is.EqualTo("RICCI"))
       .That("CompanyName", Is.EqualTo("DotNetMarche"))
       .That("ContactName", Is.EqualTo("contact"))
       .That("Address", Text.Contains("31")).ExecuteAssert();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The assertion can be read very quicly, assert that on query “Select … ” CustomerID is equal to Ricci, etc etc. The advantage is that you can easily use constraint for each field, in this way the whole assertion is really clear. The class to obtain this result is the following

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    public class DbAssert
    {
        public static DbAssert OnQuery(String query)
        {
            return new DbAssert(query);
        }

        public DbAssert That(String field, Constraint constraint)
        {
            constraints.Add(field, constraint);
            return this;
        }

        private DbAssert(string query)
        {
            this.query = query;
        }

        private String query;
        private Dictionary<String, Constraint> constraints = new Dictionary<String, Constraint>();

        public void ExecuteAssert()
        {
            using (SqlConnection conn = new SqlConnection(Properties.Settings.Default.NorthWindTestConnectionString))
            {
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = query;
                    conn.Open();
                    using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleRow))
                    {
                        NUnit.Framework.Assert.That(dr.Read(), "La query " + query + " non ha ritornato dati");
                        foreach(KeyValuePair<String, Constraint> kvp in constraints)
                        {
                            NUnit.Framework.Assert.That(dr[kvp.Key], kvp.Value, String.Format("field {0} reason:", kvp.Key));
                        }
                    }
                }
            }
        }

    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In this version I simply use a Sql connection and a connection string stored in Settings, but it is not difficult to adapt this class to your project, or extend to make it possible to specify from external code the database to use.

alk.

Tags: [xUnit](http://technorati.com/tag/xUnit) [Testing](http://technorati.com/tag/Testing)

<!--dotnetkickit-->
