---
title: "Quickly create a test instance of KeyCloak in Azure Services"
description: "If you need a quick keycloak server to use as a test and publicly accessible, with Azure Services you have it up and running in less than a minute"
date: 2022-11-07T21:00:37+02:00
draft: false
tags: ["security", "OIDC"]
categories: ["security"]
---

[Keycloak](https://www.keycloak.org/) is a leader in the landscape of Identity Provider and if you need a quick instance **for dev testing, you can spin an instance in Azure App Services in less than a minute**. 

First of all creates a new Azure App Services and choose to use Docker

![Create a docker based app service](../images/keycloak-app-services.png)
***Figure 1***: *Create a docker based app service.*

Now you can simply choose **the image you want to run, jboss/keycloak** is perfectly ok for my scenario.

![Choose jboss/keycloak as container to run in app service](../images/app-services-container-selection.png)
***Figure 2***: *Choose jboss/keycloak as container to run in app service.*

You are almost done, you just need to **wait for azure infrastructure to create your new app service** and keycloak is ready to run, but you need first to go to **configuration section and add some basic settings**

![Basic configuration for your newly created KeyCloak instance](../images/keycloak-app-service-base-configuration.png)

***Figure 3***: *Basic configuration for your newly created KeyCloak instance.*

These three settings are the minimum you need to specify to **have a dev instance of KeyCloak up and running**. In particular you need to specify KEYCLOAK_FRONTEND_URL to the valid public url of your instance, otherwise you will not be able to login to the server. Actually Keycloak runs in container in standard port 8080 and is the azure service that allow **it to be served in https, but actually the container is not aware of the public url and it will generate wrong request in http that will prevent the site to work**. As an example I've configured a custom domain thanks to CloudFlare DNS proxy support, I've added the custom domain keycloakw.codewrecks.com to the instance and then configured the KEYCLOAK_FRONTEND_URL to the value https://keycloakw.codewrecks.com/auth.

Thanks to this configuration I'm able to specify username, password and front facing url. The server is now ready to be used, but remember, you are not using a **real database and the container is started in dev mode**. Nevertheless you can use it for dev testing, it is served in a https with a perfectly valid certificate, and is publicly accessible from the internet, in less than a minute.

The only problem of this approach is: if **you stop the service, and container will be restarted from scratch, you will lose all of your data**. This is a standard problem if you use KeyCloak docker container using internal database (H2). Clearly the correct solution **is using another container with a Database or an external database that is capable to store data surviving a reboot**. 

If you still want to have an easy to setup dev instance, but you'd like your configuration to survive a container reboot, you should [Check this article](https://learn.microsoft.com/en-us/troubleshoot/azure/app-service/faqs-app-service-linux). Reading that article you can discover that, if you set configuration value WEBSITES_ENABLE_APP_SERVICE_STORAGE to true, **all linux container /home folder will be persisted and shared between various instances**. Ok this is a good start, because if we configure KeyCloak to write the database into the /home folder, it will survive a reboot.

Luckily enough we have a feature in preview **that allows us to specify a Docker compose yml file** for the app service. This will give us the option to easily map the internal directory where keycloak stores data to a subfolder of the /home folder, this **will make H2 internal database survive a reboot**.

https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?pivots=container-linux

{{< highlight yaml "linenos=table,linenostart=1" >}}
version: 3
services:
  keycloak:
    image: jboss/keycloak:latest
    volumes:
      - ${WEBAPP_STORAGE_HOME}/data:/opt/jboss/keycloak/standalone/data
    restart: always
{{< / highlight >}}

This configuration will create a volume1 with the local driver, **and point the internal folder /opt/keycloak/data to the /home/data folder** of the host machine. Given that thanks to the **WEBSITES_ENABLE_APP_SERVICE_STORAGE** setting, the /home folder is persisted, **the H2 database used by keycloak will be persisted too**.

![Use Docker compose for an Azure App Service](../images/docker-compose-for-app-service.png)

***Figure 4***: *Use Docker compose for an Azure App Service.*

Gian Maria.
