---
title: "Hello terraform"
description: "Terraform is a really nice product that helps you to automate provisioning of Cloud infrastructure, lets have a quick look at it"
date: 2021-04-03T07:00:18+02:00
draft: false
tags: ["Azure", "terraform"]
categories: ["DevOps"]
---

I'm studying [Terraform Up and Running](https://www.oreilly.com/library/view/terraform-up/9781492046899/) book, a really good book but all the examples are for AWS. I have nothing against AWS, but I'm familiar with Azure, so I'd like to **start porting some of the example of the book for Azure**. While I'm not sure if I'll keep up with the conversion, if you are curious I've started the work [in this repository](https://github.com/AlkampferOpenSource/terraform-up-and-running-code/tree/master/code/terraformAzure), feel free to post any correction (remember that I'm learning Terraform, I'm not an expert :))

For the first example, I used a script from Microsoft to create a Linux Virtual Machine with a public IP, then I modified it to **install nginx on it and being able to connect to port 80 and see my machine up and running**. Original Microsoft sample [is taken from this page](https://docs.microsoft.com/en-gb/azure/developer/terraform/create-linux-virtual-machine-with-infrastructure) and you can find in my repository the final version.

Since this is the conversion of first example of the book, everything is a **single main.tf terraform file, without any variable or modules**. **ALSO BE WARY THAT, UNLIKE THE ORIGINAL EXAMPLE, I'M NOT PAYING ATTENTION TO THE SIZE OF THE MACHINE, YOU NEED TO HAVE AN AZURE SUBSCRIPTION AND PROVISION MACHINE WILL COST YOU MONEY DEPENDING ON YOUR ACTUAL PLAN**.

This is my final script, with my modifications to being able to retrieve the public dynamic IP and to provision nginx on my VM.

{{< highlight terraform "linenos=table,linenostart=1" >}}
# taken from here: https://docs.microsoft.com/en-gb/azure/developer/terraform/create-linux-virtual-machine-with-infrastructure

terraform {
  required_version = ">= 0.14"
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>2.0"
    }
  }
}

provider "azurerm" {
  version = "~>2.0"
  features {}
}

# Create a resource group if it doesn't exist
resource "azurerm_resource_group" "myterraformgroup" {
    name     = "Terraform1"
    location = "westeurope"

    tags = {
        environment = "Terraform Demo"
    }
}

# Create virtual network
resource "azurerm_virtual_network" "myterraformnetwork" {
    name                = "myVnet"
    address_space       = ["10.0.0.0/16"]
    location            = "westeurope"
    resource_group_name = azurerm_resource_group.myterraformgroup.name

    tags = {
        environment = "Terraform Demo"
    }
}

# Create subnet
resource "azurerm_subnet" "myterraformsubnet" {
    name                 = "terraformSubnet"
    resource_group_name  = azurerm_resource_group.myterraformgroup.name
    virtual_network_name = azurerm_virtual_network.myterraformnetwork.name
    address_prefixes       = ["10.0.1.0/24"]
}

# Create public IPs
resource "azurerm_public_ip" "myterraformpublicip" {
    name                         = "myPublicIP"
    location                     = "westeurope"
    resource_group_name          = azurerm_resource_group.myterraformgroup.name
    allocation_method            = "Dynamic"

    tags = {
        environment = "Terraform Demo"
    }
}

# Create Network Security Group and rule
resource "azurerm_network_security_group" "myterraformnsg" {
    name                = "myNetworkSecurityGroup"
    location            = "westeurope"
    resource_group_name = azurerm_resource_group.myterraformgroup.name

    security_rule {
        name                       = "SSH"
        priority                   = 1001
        direction                  = "Inbound"
        access                     = "Allow"
        protocol                   = "Tcp"
        source_port_range          = "*"
        destination_port_range     = "22"
        source_address_prefix      = "*"
        destination_address_prefix = "*"
    }

     security_rule {
        name                       = "HTTP"
        priority                   = 1002
        direction                  = "Inbound"
        access                     = "Allow"
        protocol                   = "Tcp"
        source_port_range          = "*"
        destination_port_range     = "80"
        source_address_prefix      = "*"
        destination_address_prefix = "*"
    }

    tags = {
        environment = "Terraform Demo"
    }
}

# Create network interface
resource "azurerm_network_interface" "myterraformnic" {
    name                      = "myNIC"
    location                  = "westeurope"
    resource_group_name       = azurerm_resource_group.myterraformgroup.name

    ip_configuration {
        name                          = "myNicConfiguration"
        subnet_id                     = azurerm_subnet.myterraformsubnet.id
        private_ip_address_allocation = "Dynamic"
        public_ip_address_id          = azurerm_public_ip.myterraformpublicip.id
    }

    tags = {
        environment = "Terraform Demo"
    }
}

# Connect the security group to the network interface
resource "azurerm_network_interface_security_group_association" "example" {
    network_interface_id      = azurerm_network_interface.myterraformnic.id
    network_security_group_id = azurerm_network_security_group.myterraformnsg.id
}

# Generate random text for a unique storage account name
resource "random_id" "randomId" {
    keepers = {
        # Generate a new ID only when a new resource group is defined
        resource_group = azurerm_resource_group.myterraformgroup.name
    }

    byte_length = 8
}

# Create storage account for boot diagnostics
resource "azurerm_storage_account" "mystorageaccount" {
    name                        = "diag${random_id.randomId.hex}"
    resource_group_name         = azurerm_resource_group.myterraformgroup.name
    location                    = "westeurope"
    account_tier                = "Standard"
    account_replication_type    = "LRS"

    tags = {
        environment = "Terraform Demo"
    }
}

# Create (and display) an SSH key
resource "tls_private_key" "example_ssh" {
  algorithm = "RSA"
  rsa_bits = 4096
}
output "tls_private_key" { value = tls_private_key.example_ssh.private_key_pem }

# Create virtual machine
resource "azurerm_linux_virtual_machine" "myterraformvm" {
    name                  = "myVM"
    location              = "westeurope"
    resource_group_name   = azurerm_resource_group.myterraformgroup.name
    network_interface_ids = [azurerm_network_interface.myterraformnic.id]
    size                  = "Standard_B1s"

    os_disk {
        name              = "myOsDisk"
        caching           = "ReadWrite"
        storage_account_type = "Premium_LRS"
    }

    source_image_reference {
        publisher = "Canonical"
        offer     = "UbuntuServer"
        sku       = "18.04-LTS"
        version   = "latest"
    }

    computer_name  = "myvm"
    admin_username = "azureuser"
    disable_password_authentication = true

    admin_ssh_key {
        username       = "azureuser"
        public_key     = tls_private_key.example_ssh.public_key_openssh
    }

    boot_diagnostics {
        storage_account_uri = azurerm_storage_account.mystorageaccount.primary_blob_endpoint
    }

    tags = {
        environment = "Terraform Demo"
    }

    custom_data = filebase64("./init.sh")
}

data "azurerm_public_ip" "myterraformpublicip" {
  name                = azurerm_public_ip.myterraformpublicip.name
  resource_group_name = azurerm_linux_virtual_machine.myterraformvm.resource_group_name
}

output "ip_address" { 
    value = data.azurerm_public_ip.myterraformpublicip
}
{{< / highlight >}}

The example is long but it is really simple, to be able to run it, you need to install Terraform and you **need also to be logged into your azure account; this is done with the AZ cli tools**.

{{< highlight powershell "linenos=table,linenostart=1" >}}
az login
az account list --query "[].{name:name, subscriptionId:id}"
az account set --subscription="<subscription_id>"
{{< / highlight >}}

Az login will open a browser window to perform login, account list allows you to list all of your subscriptions actually available and the third line is needed to select the subscription you want to work with.

> Azure CLI tools need to be installed to work properly with Terraform

Line 187 of the script is the point where I'm setting [Virtual Machine Custom Data](https://docs.microsoft.com/en-us/azure/virtual-machines/custom-data), in this situation this is a **super simple shell script to install nginx, but can be almost everything that stay in 64KB size limit**. User Data should be base64 encoded.

This is the super complex bash script I've used :) 

{{< highlight bash "linenos=table,linenostart=1" >}}
apt-get update
apt-get install nginx -y
{{< / highlight >}}

Now another interesting part is line 190-197 where I retrieve as output the ip_address. You need to be aware that **if you are using dynamic public IP in azure, the IP is assigned only after the IP resource is assigned to something (like a VM)**. This imply that you need to create VM resource with the IP BEFORE retrieving the IP as output. 

> To effectively retrieve dynamic IP public address in azure you should use data (as in example lines 190-197).

After you terraform init, terraform plan and terraform apply, you can verify if the IP is correct with this simple PowerShell.

{{< highlight powershell "linenos=table,linenostart=1" >}}
$ipAddress = terraform output -json ip_address | ConvertFrom-json
$ipAddress.ip_address
{{< / highlight >}}

Terraform output in json format is really convenient because you can **ConvertFrom-Json in PowerShell to have a nice object you can interact with**.

![Public dynamic IP data](../images/terraform-public-ip.png)
***Figure 1***: *Public dynamic IP data*

> Thanks to PowerShell Json parsing capabilities, I can use complex Terraform Output objects natively.

As you can see from **Figure 1** I got a nice object with properties that represents all data for the public IP just created, now I **only need to browser that IP to verify that I've really have an nginx instance answering from the other side**. I can also browse the resource group from Azure Portal to verify what was really created.

![All resources created by terraform main.tf file](../images/terrfaorm1-resource-group.png)
***Figure 2***: *All resources created by terraform main.tf file*

This is all we need to automate the creation of a VM in azure, but, wait, can the example be made a little bit better? This approach, is not perfect because the **SSH key is created by terraform and it is contained in the state file**, this is not a perfect scenario because I do not want my SSH key to be contained in terraform store. 

![RSA key was stored inside terraform state](../images/terraform-created-RSA-key.png)
***Figure 3***: *RSA key was stored inside terraform state*

Ok, time to improve the script, but before **DO NOT FORGET TO DO A TERRAFORM DESTROY REMOVING EVERYTHING TO AVOID PAYING FOR RESOURCES YOU ARE NOT USING, A TERRAFORM DESTROY WILL REMOVE EVERY RESOURCE FROM AZURE THAT WERE CREATED BY THIS SCRIPT**

The new script has some interesting modifications

- It uses a pre-created RSA key, **but remember that private key should not be protected with password**
- It uses resource provisioning to configure the machine.

First of all, lets create a nice RSA key with the command *ssh-keygen.exe -b 4096*, when prompted save the key in local directory giving the name .\my-key, **choose a blank password** and you will end with two files: my-key.pub and my-key. We need not to setup password because Terraform resource for provisioning is not capable of using password. **Using this approach has the advantage to not store the RSA key in terraform state**. You can simply take the key and store in some secure vault or password manager, because you are not supposed to regularly SSH into azure machine (you should automate almost everything).

All new code can be found [here in GitHub](https://github.com/AlkampferOpenSource/terraform-up-and-running-code/tree/master/code/terraformAzure/01-why-terraform/web-server-provision) and I'm going to paste here only the relevant changes.

RSA key is not created anymore in the main.tf file, it is just referenced from external code

{{< highlight terraform "linenos=table,linenostart=1" >}}
    admin_ssh_key {
        username       = "azureuser"
        public_key     = file("my-key.pub")
    }
{{< / highlight >}}

Thanks to the file function I can load public key directly from disk. Then I need to provision the VM, but **remember the previous example when I told you that you do not have a public IP until you assign to the machine**, this can be a problem, because the provisioner is actually connecting to that machine, and needs the public IP to do the connection.

It turns out that I cannot specify the provisioner inside Virtual Machine resource (because it would not know the IP address), but I can use the null_resource as a trick. **After Virtual Machine creation you can add this code**.

{{< highlight terraform "linenos=table,linenostart=1" >}}
data "azurerm_public_ip" "myterraformpublicip" {
  name                = azurerm_public_ip.myterraformpublicip.name
  resource_group_name = azurerm_linux_virtual_machine.myterraformvm.resource_group_name
}

output "ip_address" { 
    value = data.azurerm_public_ip.myterraformpublicip
}

resource "null_resource" "vm_provision" {
    connection {
        type        = "ssh"
        host        = data.azurerm_public_ip.myterraformpublicip.ip_address
        user        = "azureuser"
        private_key = file("my-key")
    }

    provisioner "file" {
        source      = "init.sh"
        destination = "/tmp/init.sh"
    }

    provisioner "remote-exec" {
        inline = [
            "sudo bash /tmp/init.sh",
        ]
    }
}
{{< / highlight >}}

The trick is simple, use data to retrieve public IP **after the machine is created**, then **add a null resource just to contain provisioning code**. Actually to provision a VM you need to specify a connection (because we are outside VM resource), you need to specify the private key file to use (and since we do not have the ability to specify a password you need to have it created without password). After the connection a file provisioner will copy a file into the machine, and a remote-exec provisioner will execute that bash script into the target machine.

After the machine is created you can actually retrieve public ip and try to navigate to the ip, you should see nginx welcome page. **Do not forget to destroy everything to avoid paying for test resources**. Also save and store your my-key RSA in some secure place if you plan to connect to the machine in the future.

> Remember that automating Cloud Resources creation is the heart of adopting a DevOps mindset for Cloud. 

Once you have a Terraform file, you can use in Azure DevOps pipelines or in GitHub actions to actually deploy resources on the cloud.

A special thanks to [Giulio Vian](http://blog.casavian.eu/) for his invaluable support.

Gian Maria.