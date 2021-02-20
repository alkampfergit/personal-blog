---
title: "Standard configuration for net 20"
description: ""
date: 2007-06-14T08:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
I’m trying to develop a little framework to include in future projects, actually I had classes and project spread around partition D F and G, and I realized that I’m not really a tidy person :D. At this moment I only had written some classes to handle access to db with direct Sql, and I really liked used Anonymous delegate as did ayende in one of his post. At a certain point I faced the problem to decide where to save the setting of the project, for example the main connectionString. I must admit that I really love the XML configuration of.Net, so instead of using plain application setting I plan to use a custom configuration. I started with a simple class to handle global section of the configuration.

publicclassNablaHelpersConfiguration  :  ConfigurationSection  {  
  
  [ConfigurationProperty(“DataAccessConfiguration”,  IsRequired  =  true)]  
publicDataAccessConfiguration  DataAccess  {  
get  {  
return  (DataAccessConfiguration)this[“DataAccessConfiguration”];  
        }  
  }  
}

This is the base class for the configuration, and right now it contains only a property that is an instance of the class that handle the configuration of the DataAccess part of the library. As you can see with *ConfigurationProperty*attribute I specify that my configuration has an element called DataAccessConfiguration of type DataAccessConfiguration, the class inherits from  **ConfigurationSection** because it is my config section for the library. Now it’s the turn of DataAccessConfigurationClass

publicclassDataAccessConfiguration  :  ConfigurationElement  {  
  
  [ConfigurationProperty(“MainConnectionString”)]  
publicConnectionStringSettings  ConnectionString  {  
get  {  return  (ConnectionStringSettings)this[“MainConnectionString”];  }  
set  {  this[“MainConnectionString”]  =  value;  }  
  }  
}

This class inherits from  **ConfigurationElement** and has a simple property marked with ConfigurationPropertyAttribute that states that my data access layer need an element called *MainConnectionString*of type ConnectionStringSettings, the standard class to store connection strings in.net. With these two classes I can simply create this app.config file.

&lt;configSections&gt;  
        &lt;section  
      name=“NablaHelpers“  
      type=“Nablasoft.Helpers.Configuration.NablaHelpersConfiguration,  NablaHelpers“/&gt;  
  &lt;/configSections&gt;  
  
  &lt;!–Configuration  for  the  nablahelper  assembly–&gt;  
  &lt;NablaHelpers&gt;  
        &lt;DataAccessConfiguration&gt;  
              &lt;MainConnectionString  
name=“MainConnectionString“  
connectionString=“Database=Northwind;Server=localhost\SQL2000;...  “  
providerName=“System.Data.SqlClient“/&gt;  
        &lt;/DataAccessConfiguration&gt;  
  &lt;/NablaHelpers&gt;

To use my custom configuration classes I firt specify in configSection the type of the configuration class (NablaHelpersConfiguration) as well as the node name that contains data for the configuration, then I create the section and name it “NablaHelpers”, and inside I store all my configuration. I must admit that I really love XML configuration files.  
To retrieve current configuration in the code you can simply ask to the *System.Configuration* class.

NablaHelpersConfigurationIConfigurationHandler.CurrentConfiguration  {  
get  {  
return  (NablaHelpersConfiguration)  System.Configuration  
                 .ConfigurationManager.GetSection(“NablaHelpers”);  
  }  
}

I include this property in an helper class to avoid to call System.Configuration each time, as you can see an instance of the configuration class can be obtained simply calling *System.Configuration.ConfigurationManager.GetSection()* specifying the name of the section to retrieve. With custom configuration classes you can include all your configuration in a single customized section of your config file.

Alk.
