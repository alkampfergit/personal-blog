---
title: "Home Made Zero trust Security step 2"
description: ""
date: 2020-03-14T10:00:37+02:00
draft: false
tags: [Zero Trust Security]
categories: [security]
---
If you read my old post about how to create a simple program that can manage Windows Firewall to [open ports](http://www.codewrecks.com/blog/index.php/2020/01/03/home-made-zero-trust-security/) with a simple udp request you surely got disappointed by the complete lack of security in the request. **That program was no more than a mere proof of concept to understand if I can manage windows firewall programmatically in.NET Core.** >  **The absolute critical problem in that program is that, UDP request to open a Tcp port is sent in clear text.** Basically the protocol is, a client  **C send to the server S a UDP packet in a specific port with a secret key,** the server S check if the secret is correct and opens a corresponding TCP port, associated by UDP port in configuration, for requesting IP only and for a predetermined period of time.

You can easily spot the problem: **the UDP packet was sent in clear text, everyone that intercept the communication will be able to open port because the secret is sent in clear text.** We have obvious solution to the problem, the most simple one is using the shared secret password to derive a symmetric cryptographic key to encrypt the message. This is far from being perfect, but it is a further step towards a more secure solution.

Since reusing the very same cryptographic key multiple time is not encouraged (even if using a different Initialization Vector solves the problem),  **a special class called PassdowrdDeriveBytes can be used to derive a sequence of bytes from a password, using a salt and it is cryptographically secure.** {{< highlight csharp "linenos=table,linenostart=1" >}}


public static ICryptoTransform GetEncryptorFromPassword(
    this Aes aes,
    string password,
    byte[] salt)
{
    using (var pdb = new PasswordDeriveBytes(password, salt))
    {
        var key = pdb.GetBytes(32);
        var IV = pdb.GetBytes(16);
        return aes.CreateEncryptor(key, IV);
    }
}

{{< / highlight >}}

The salt is a sequence of bytes to be used only once, to avoid generating the very same key each time you sent a message. You can use another approach, where you use the very same key and each time you change the Initialization vector, but using the salt to generate a unique Key and IV is probably a better method.

Given this brief introduction  **we can create a function to generate a random salt to be used for each message.** {{< highlight csharp "linenos=table,linenostart=1" >}}


public static byte[] GenerateRandomSalt()
{
    using (var csp = new RNGCryptoServiceProvider())
    {
        byte[] salt = new byte[saltSize];
        csp.GetBytes(salt);
        return salt;
    }
}

{{< / highlight >}}

 **Even for this simple method, it is important to use a random number generator that is cryptographically secure, such as RNGCryptoServiceProvider.** Armed with these two functions we can create a method to encrypt a generic stream of bytes.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static Byte[] SimmetricEncrypt(string password, byte[] salt, byte[] data)
{
    using (var aes = Aes.Create())
    using (var encryptor = aes.GetEncryptorFromPassword(password, salt))
    using (MemoryStream msEncrypt = new MemoryStream())
    {
        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
        {
            csEncrypt.Write(data, 0, data.Length);
        }

        // important, dispose CryptoStream before accessing the array
        return msEncrypt.ToArray();
    }
}

{{< / highlight >}}

As you can see the shared password and the salt are needed and clearly the sequence of byte to encrypt. Encrypted message can be decrypted by a corresponding method that basically accepts the very same set of parameters.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static Byte[] SimmetricDecrypt(string password, byte[] salt, byte[] data)
{
    try
    {
        using (var aes = Aes.Create())
        using (var encryptor = aes.GetDecryptorFromPassword(password, salt))
        using (MemoryStream msDecrypt = new MemoryStream())
        {
            using (MemoryStream msOriginalData = new MemoryStream(data))
            using (CryptoStream csDecrypt = new CryptoStream(msOriginalData, encryptor, CryptoStreamMode.Read))
            {
                csDecrypt.CopyTo(msDecrypt);
            }

            // important, dispose CryptoStream before accessing the array
            return msDecrypt.ToArray();
        }
    }
    catch (CryptographicException cex)
    {
        Log.Error(cex, "Error decrypting message");
        //Do not disclose anything to the caller.
        throw new SecurityException("Error in decrypting");
    }
}


{{< / highlight >}}

Code is really simple to read, the only special care is I’ve intercepted each CryptographicException that the code can raise (such as bad password) and I rethrow a generic Security Exception with no any information. The aim is avoiding to give to the caller any possible clue on what went wrong.

Armed with these two simple functions, we can change communication protocol between client and server, using the shared key to encrypt the request message, so anyone that intercepts the message cannot understand what is contained inside.

To avoid reply attack, were an attacker simple retransmit the very same intercepted UDP packet, content of encrypted packet is a simple class that contains three properties

{{< highlight csharp "linenos=table,linenostart=1" >}}


        /// <summary>
        /// This is the port we want to open
        /// </summary>
        public Int32 PortToOpen { get; private set; }

        /// <summary>
        /// This is the end of opening Date, remember that the
        /// server could leave the port opened for a lesser time
        /// if needed.
        /// </summary>
        public DateTime EndOpeningDate { get; private set; }

        /// <summary>
        /// Ip address to scope port opening to.
        /// </summary>
        public String IpAddress { get; private set; }

{{< / highlight >}}

Now an attacker can reply an intercepted request, but the net result is to reapply the very same request, opening a port for a required IpAddress. Since the message is encrypted he/she cannot read what is inside the message, nor they can alter it.

This solution is more secure and starts to be almost production ready.

As usual the code is on GitHub (as today encryption is still on a feature branch) [https://github.com/alkampfergit/StupidFirewallManager](https://github.com/alkampfergit/StupidFirewallManager "https://github.com/alkampfergit/StupidFirewallManager")

Gian Maria.
