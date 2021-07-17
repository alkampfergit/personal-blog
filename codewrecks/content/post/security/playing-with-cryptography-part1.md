---
title: "Playing with Cryptography, Part 1" 
description: "Some though about cryptography and .NET"
date: 2021-07-17T09:13:30+02:00
draft: false
tags: ["security", "programming"]
categories: ["security"]
---

Cryptography is a fascinating subject, surely complex, but as a developer you probably have some **predefined libraries in your language/environment of choice that you can use**. DotNet is not an exception, so I've decided to create a sample repository to play a little bit with all cryptography primitives to show how easy is to use them [https://github.com/alkampfergit/DotNetCoreCryptography](https://github.com/alkampfergit/DotNetCoreCryptography).

This is not a tutorial, it is more a repository where I played with API to gain more confidence with **.Net Core version of the API**. The purpose is also to understand if you can **wrap Crypto API to make them simple to use for a developer, avoiding people to use them in different ways across a same software and to make them simpler to use**.

> This is not a tutorial, is some experiments I've done with Cryptography in .NET feel free to fork and made criticism, suggestions and point out any error you spot in the code.

First of all I'd like to abstract the real algorithm used to simplify migration to a different one if it will break in the future. I do not think that 256 bit AES will be broke in the near future, but 128 bit key could be made weak by [Quantum Computing](https://www.amazon.com/Cryptography-Apocalypse-Preparing-Quantum-Computing/dp/1119618193/ref=sr_1_1?dchild=1&keywords=quantum+apocalypse+cryptography&qid=1626513865&sr=8-1) so I **prefer an approach where I wrap the real key/algorithm in a custom class**.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public abstract class EncryptionKey : IDisposable
{
    public static EncryptionKey CreateDefault()
    {
        return new AesEncryptionKey();
    }
{{< / highlight >}}

Here we have a simple EncryptionKey class that wraps some symmetric key, and will create an AesEncryptionKey as default key (actually it is the only one in the code :) ). **Base class allows me to specify a series of behavior that I'm expecting for a symmetric key**, this allows me to swap a real implementation with another one if I decide to change it.

When I have a key, one of the problem is **where to securely store it**, so I'd like all my concrete keys implementations to be able to serialize the key to a simple byte array and deserialize it from there.

{{< highlight csharp "linenos=table,linenostart=1" >}}
/// <summary>
/// Serialize an AES key into a byte array
/// </summary>
/// <param name="aes"></param>
/// <returns></returns>
public static byte[] Serialize(this Aes aes)
{
    var array = new byte[
        aes.KeySize / 8     //Key size
        + 16                //IV size
        + 1                 //mode of operation
        + 1                 //first byte mark
    ];
    array[0] = (byte) KeyType.Aes256;
    Array.Copy(aes.IV, 0, array, 1, aes.IV.Length);
    Array.Copy(aes.Key, 0, array, 16 + 1, aes.Key.Length);
    array[array.Length - 1] = (byte) aes.Mode;
    return array;
}

public static Aes DeserializeToAes(this byte[] serializedAes)
{
    if (serializedAes[0] != (byte) KeyType.Aes256) 
    {
        throw new CryptographicException("Serialized key is not AES");
    }
    var aes = Aes.Create();
    var keyLength = serializedAes.Length - 16 - 1 - 1;
    aes.IV = new ArraySegment<byte>(serializedAes, 1, 16).ToArray();
    aes.Key = new ArraySegment<byte>(serializedAes, 17, keyLength).ToArray();
    aes.Mode = (CipherMode)serializedAes[serializedAes.Length - 1];
    return aes;
}
{{< / highlight >}}

I prefer to do this operation myself, because I use the first byte **to mark the type of key I'm using, thus providing me the ability to mix different algorithms without any risk of breaking the code**. Thanks to this way of serializing stuff, it is simple to create a generic method in base class to retrieve the correct key from serialized version.

{{< highlight csharp "linenos=table,linenostart=1" >}}
/// <summary>
/// Create correct type of key based on serialied version.
/// </summary>
/// <param name="serializedKey"></param>
/// <returns></returns>
public static EncryptionKey CreateFromSerializedVersion(byte[] serializedKey)
{
    var keyType = (KeyType)serializedKey[0];
    switch (keyType)
    {
        case KeyType.Aes256:
            return new AesEncryptionKey(serializedKey);
        default:
            throw new NotSupportedException($"Type of key {keyType} is not supported");
    }
}
{{< / highlight >}}

This gave me the ability to convert potentially different type of keys into a byte array and be able to deserialize them back into the correct class. EncryptionKey base class is able to read the first byte and restore the correct version of the key based on it. If **I'll need to change the algorithm I can create another concrete implementation of EncryptionKey and use a different first byte to identify it**.  

**Once I have this ability my next question is how to store the key safely somewhere**. To achieve this result I can create a simple interface called IKeyEncryptor. I'm not pretty sure of the name, but the concept is that **I can encrypt the key and decrypt with the help of another object that is supposed to be secure**. I started with a concept of IKeyVault, a place where I can safely store keys, but actually I'd like to explore a different strategy, once a key is encrypted it is supposed to be secure and you **can store the encrypted version everywhere, because it cannot be decrypted with the original IKeyEncryptor used to encrypt it**. This makes me think that I do not really need a Vault, a **place where the key is stored**, what I really need is some object that is capable to encrypt my key so I can store it anywhere.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public interface IKeyEncryptor
{
    public Task<byte[]> EncryptAsync(EncryptionKey key);

    public Task<EncryptionKey> DecriptAsync(byte[] encryptedKey);
}
{{< / highlight >}}

This approach gives me the ability to create a super simple **helper class that to encrypt stream of bytes that is extremely simple to use.**. It is called SecureEncryptor and has only two super simple methods.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class SecureEncryptor
{
    public SecureEncryptor(IKeyEncryptor keyVaultStore)
    {
        _keyVaultStore = keyVaultStore;
    }

    ...
    public async Task Encrypt(Stream streamToEncrypt, Stream destinationStream)
    ...

    public async Task Decrypt(Stream sourceEncryptedStream, Stream destinationDecryptedStream)
    ...
}
{{< / highlight >}}

This interface is super simple to use, **just specify source and destination Stream for encrypt and decrypt, you do not need anything else**. This kind of approach leaves no decision to the user on what algorithm to use or how to manage keys, the user does not even know where the key are stored. **This kind of interface is nice because leaves all complexity and risky code in just one place, the SecureEncryptor class**. 

If you look at SecureEncryptor class you can find that it **relies on the IKeyEncryptor class to encrypt keys.** This approach concentrates most of the risk into the concrete implementation of IKeyEncryptor, if you have an implementation that is super secure, you cannot decrypt keys encrypted with it and all the rest of the code is supposed to be more secure. **The less decision you leave to the user of your class, the better**.

This class internally encrypt stuff with a super simple approach: it generates a new key each time you encrypt a stream, **then encrypt the encryption key with the help of IKeyEncryptor, and store the encrypted version of the key at the start of the encrypted stream**, finally it uses the key to encrypt the original stream to the destination stream. This approach will produce a **single destination encrypted stream** that contains the encrypted version of the key used to encrypt the rest of the stream. To decrypt the stream you first retrieve the encrypted key from the stream, then decrypt with IKeyEncryptor, then use the decrypted key to decrypt the rest of the stream.

Here you have a simple test that shows how you can use the class.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Fact]
public async Task Full_secure_encryption_test()
{
    var sut = CreateSut();
    using var streamToEncrypt = GenerateStreamToEncrypt();

    //ok now we need to secure encrypt and decrypt the stream
    using var destinationStream = new MemoryStream();
    await sut.Encrypt(streamToEncrypt, destinationStream);

    //now we want to read again and decrypt
    using var sourceEncryptedStream = new MemoryStream(destinationStream.ToArray());
    using var destinationDecryptedStream = new MemoryStream();
    await sut.Decrypt(sourceEncryptedStream, destinationDecryptedStream);
    var decryptedContent = Encoding.UTF8.GetString(destinationDecryptedStream.ToArray());
    Assert.Equal(decryptedContent, someContenttoBeEncrypted);
}
{{< / highlight >}}

I'll deal with the implementation of IKeyEncryptor in a subsequent post.

Gian Maria.
