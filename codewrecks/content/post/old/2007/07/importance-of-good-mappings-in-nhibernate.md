---
title: "Importance of good mappings in nhibernate"
description: ""
date: 2007-07-16T23:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Suppose you have created some classes to access customer table in northwind database, a good mapping could be the following.

&lt;?xmlversion=“1.0“encoding=“utf-8“  ?&gt;  
&lt;hibernate-mappingxmlns=“urn:nhibernate-mapping-2.2“  
namespace=“Nablasoft.NhibernateGen.Domain.Entities“  
assembly=“Nablasoft.NhibernateGen.Domain“&gt;  
  &lt;classname=“Customer“table=“Customers“lazy=“true“  &gt;  
        &lt;idname=“Id“column=“CustomerId“&gt;  
              &lt;generatorclass=“identity“  /&gt;  
        &lt;/id&gt;  
        &lt;componentname=“AddressInfo“&gt;  
              &lt;propertyname=“Address“  /&gt;  
              &lt;propertyname=“City“  /&gt;  
              &lt;propertyname=“Region“  /&gt;  
              &lt;propertyname=“PostalCode“  /&gt;  
              &lt;propertyname=“Country“  /&gt;  
        &lt;/component&gt;  
  
        &lt;componentname=“ContactInfo“&gt;  
              &lt;propertyname=“ContactName“/&gt;  
              &lt;propertyname=“ContactTitle“/&gt;  
        &lt;/component&gt;  
  
  
        &lt;propertyname=“CompanyName“/&gt;  
  
        &lt;propertyname=“FaxNumber“column=“Fax“  /&gt;  
        &lt;propertyname=“PhoneNumber“column=“Phone“/&gt;  
  &lt;/class&gt;  
&lt;/hibernate-mapping&gt;

Undoubtedly this mapping works well, but what happens when you use  **SchemaExport** class to recreate the schema of the database from the mapping? The answer is that the table that gets created is not so appealing.

createtable  dbo.Customers  (  
CustomerId  NVARCHAR(255)IDENTITYNOTNULL,  
  Address  NVARCHAR(255)null,  
  City  NVARCHAR(255)null,  
  Region  NVARCHAR(255)null,  
  PostalCode  NVARCHAR(255)null,  
  Country  NVARCHAR(255)null,  
  ContactName  NVARCHAR(255)null,  
  ContactTitle  NVARCHAR(255)null,  
  CompanyName  NVARCHAR(255)null,  
  Fax  NVARCHAR(255)null,  
  Phone  NVARCHAR(255)null,  
primarykey(CustomerId)  
)

As you can see all fields are of type nvarchar(255)  a default length chosen by nhibernate, moreover the table has no index. Even if you have a legacy database to work with, it is important to include in the mappings all the information to create a correct database schema from the mappings, this is expecially useful for testing purpose, for example if you want to use SQLLite to do some test. As example here is a more verbose mapping, but that generates a better table.

&lt;?xmlversion=“1.0“encoding=“utf-8“  ?&gt;  
&lt;hibernate-mappingxmlns=“urn:nhibernate-mapping-2.2“  
namespace=“Nablasoft.NhibernateGen.Domain.Entities“  
assembly=“Nablasoft.NhibernateGen.Domain“&gt;  
  &lt;classname=“Customer“table=“Customers“lazy=“true“  &gt;  
        &lt;idname=“Id“column=“CustomerId“type=“Int32“  &gt;  
              &lt;generatorclass=“identity“  /&gt;  
        &lt;/id&gt;  
        &lt;propertyname=“CompanyName“not-null=“true“length=“40“type=“String“  
index=“CompanyName“/&gt;  
  
        &lt;componentname=“ContactInfo“&gt;  
              &lt;propertyname=“ContactName“not-null=“false“length=“30“type=“String“/&gt;  
              &lt;propertyname=“ContactTitle“not-null=“false“length=“30“type=“String“  /&gt;  
        &lt;/component&gt;  
  
        &lt;componentname=“AddressInfo“&gt;  
              &lt;propertyname=“Address“not-null=“false“length=“60“type=“String“  /&gt;  
              &lt;propertyname=“City“not-null=“false“length=“15“type=“String“  
index=“City“/&gt;  
              &lt;propertyname=“Region“not-null=“false“length=“15“type=“String“  
index=“Region“/&gt;  
              &lt;propertyname=“PostalCode“not-null=“false“length=“10“type=“String“  
index=“PostalCode“/&gt;  
              &lt;propertyname=“Country“not-null=“false“length=“15“type=“String“/&gt;  
        &lt;/component&gt;  
  
        &lt;propertyname=“PhoneNumber“column=“Phone“not-null=“false“length=“24“type=“String“/&gt;  
        &lt;propertyname=“FaxNumber“column=“Fax“not-null=“false“length=“24“type=“String“/&gt;  
  
  &lt;/class&gt;  
&lt;/hibernate-mapping&gt;

As you can see each field has a length attribute that explicitly tells nhibernate the length of the field in the database, to recreate a table identical to the one in northwind I also include the attribute Index into all the columns that I want to be indexed. In this example we have all 1 column index, but if you want an index that span multiple columns it is sufficient to include an index attribute of the same value in multiple property tags. Note also the use of not-null attribute, used to tell nhibernate that the column CompanyName is mandatory. Now here is how the SchemaExport generate the table in the database

createtable  dbo.Customers  (  
CustomerId  INTIDENTITYNOTNULL,  
  CompanyName  NVARCHAR(40)notnull,  
  ContactName  NVARCHAR(30)null,  
  ContactTitle  NVARCHAR(30)null,  
  Address  NVARCHAR(60)null,  
  City  NVARCHAR(15)null,  
  Region  NVARCHAR(15)null,  
  PostalCode  NVARCHAR(10)null,  
  Country  NVARCHAR(15)null,  
  Phone  NVARCHAR(24)null,  
  Fax  NVARCHAR(24)null,  
primarykey(CustomerId)  
)  
createindex  Region  on  Customers  (Region)  
createindex  PostalCode  on  Customers  (PostalCode)  
createindex  City  on  Customers  (City)  
createindex  CompanyName  on  Customers  (CompanyName)

As you can see create a complete and correct mapping it is a very important thing.

Alk.
