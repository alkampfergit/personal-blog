---
title: "Run SSIS package from another server in workspace"
description: ""
date: 2011-08-05T12:00:37+02:00
draft: false
tags: [Sql Server,SSIS]
categories: [Sql Server]
---
Today I needed to move some SSIS packages that actually runs on the same server where the database resides, to another server dedicated to run SSIS packages. I do not have a domain and the second server is simply in the same network as the first server. I simply reconfigured a Job to run the Package from File system (as originally configured in the original server), but now I could not use Integrated Security because I'm running the SSIS package from another PC. So I changed the connection string to include user and pwd (SQL authentication), but when I saved the job step the password simply disappeared from the connection string.

This happens for security, every person that has right to look at job properties can see the password to connect to the other database server, thus password are not saved to job properties. [An answer can be found here](http://support.microsoft.com/kb/918760) and I decided to save the package to database server to store everything in the server.

First of all I connected to the analysis server where I want the SSIS to run and add a specific folder for my packages. You can see this in Figure 1, and the new folder is blured because it contains name of the product of my customer.

[![03-08-2011 12-46-17](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/03-08-2011-12-46-17_thumb.jpg "03-08-2011 12-46-17")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/03-08-2011-12-46-17.jpg)

 ***Figure 1***: *Adding a folder to contain all my packages.*

Now I open the package in business development studio and right click on an empty part of the designer, then choose properties (Figure 2).

[![Untitled](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled_thumb.jpg "Untitled")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled.jpg)

 ***Figure 2***: *Changing the protection level to Server Storage*

I changed the protection level to Server Storage then I go in menu * **File –&gt; Save copy of xxxxx.dtsx** *as to save a copy of this package to the SSIS Server. You should now see your package inside the new folder I created in Figure 1.

[![Untitled2](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled2_thumb.jpg "Untitled2")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled2.jpg)

 ***Figure 3***: *I saved a copy of the dtsx package inside the SSIS server*

Now I saved the package to the server, then try to execute again with no luck :(, when I insert userid=xxx;pwd=yyyy inside the configuration of the job step, the password is not stored inside the configuration, due to security reason and the package execution still fails to execute. The solution was to Right click on the designer of the package and choose to

Then I decided to store all configuration inside a table of the server.

[![1](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/1_thumb.jpg "1")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/1.jpg)

 ***Figure 4***: *Saving configuration inside a table in a database.*

I choose to save configuration inside a database table because it is much simplier to configure, everything is inside SQL server, no need of external XML or text file, or registry keys, or environment variable etc. After you choose the table used to store settings, you need to decide what to export into this configuration, I simply choose to move the two connection strings.

[![2](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/2_thumb.jpg "2")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/2.jpg)

 ***Figure 5***: *Save all connection string properties inside the table.*

You can choose to save only some of the properties of the connection string, but saving everything is not a problem, now I can open the table and modify the connections as needed.

[![3](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/3_thumb.jpg "3")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/3.jpg)

 ***Figure 5***: *All the information about connection strings are stored inside a table.*

Now I can schedule execution of SSIS package with SQL Server Agent with no problem. I must admit that I'm not SSIS Guru, but deploying SSIS package is not the most easy task to accomplish, especially if you do not use domain.

Alk.

Tags: [Sql Server](http://technorati.com/tag/Sql%20Server)
