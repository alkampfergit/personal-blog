---
title: "Using certificate for SSH in Azure Linux VM"
description: ""
date: 2015-10-13T17:00:37+02:00
draft: false
tags: ["Security", "Linux"]
categories: ["Linux"]
---
If you like [to use certificate to connect via SSH to your Linux machine](http://www.codewrecks.com/blog/index.php/2015/10/10/using-certificate-to-connect-via-ssh-to-your-linux-machine/) you will probably use that technique to access all of your VMs, even those one hosted on Azure.

This operation is really simple, because  **Azure Portal allow you to specify the public key during VM creation** and everything else is managed by VM Creation Scripts. In the same blade where you specify username and password you can opt in to use a certificate instead of a password. You should open the file with.pub extension you’ve created previously (with ssh-keygen) and paste full content in appropriate textbox.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image11.png)

 ***Figure 1***: *Specifying ssh public key during VM Creation*

As you can see from  **Figure 1** the  **portal will validate the key with a little green sign at the right of the textbox, informing you that the public key is valid**. Once the VM is created you can [use Putty or your favourite ssh client](https://www.digitalocean.com/community/tutorials/how-to-create-ssh-keys-with-putty-to-connect-to-a-vps) to access your machine with the certificate.

> Thanks to Azure Portal you can choose to use an existing certificate to access your machine

If you already created your vm using standard username and password, you can easily connect to that machine and add public key to.ssh/authorized\_keys file as showed in previous blog post, or  **you can use [Azure CLI](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli/) to configure SSH on an existing VM**. First of all you need to convert the file generated with ssh-keygen in a format that can be understood by Azure CLI.

Unfortunately you cannot use the.pub file as you can when you are creating the machine;   **Command Line Interface tool require a file with.pem extension.** You can convert your file easily with openssl utility in a Linux VM.

{{< highlight bash "linenos=table,linenostart=1" >}}


openssl req -x509 -new -days 365 -key id_rsa_nopwd -out id_rsa_nopwd.pem

{{< / highlight >}}

Thanks to this command, my RSA private key file, generated with ssh-keygen is converted to a pem file. Now you can use it to configure your VM from Azure CLI.

{{< highlight bash "linenos=table,linenostart=1" >}}


azure vm 
reset-access 
--reset-ssh --ssh-key-file z:\Secure\Rsa\id_rsa_nopwd.pem 
--user-name gianmaria 
--password xxxxxx

{{< / highlight >}}

 **You will be prompted for Resource Group and VM Name** (you can specify those two parameter from command line), then the CLI will update your Virtual Machine for you.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image12.png)

 ***Figure 2***: *Result of the reset-access command*

 **Now you can access your VM using certificate** , and if you check your.ssh/authorized\_keys file, you can check that the public key was correctly added by the Azure CLI utility.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image13.png)

 ***Figure 3***: *I can now connect to my VM using certificate*

Gian Maria.
