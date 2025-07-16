---
title: "Call o3-pro in Azure OpenAI using C# SDK"
description: "Utilizing GPT-4 for software development accelerates project initialization and code generation, enabling developers to focus on complex tasks and improve overall efficiency."
date: 2025-07-16T06:00:00+00:00
draft: false
tags: ["GPT4", "AI"]
categories: ["AI"]
---

Azure OpenAI supports now o3-pro model. This model is different from other ones, here is a brief summary of its advantages: *The o3-pro model excels at advanced reasoning, delivers high accuracy, supports long-context tasks, and integrates powerful tools like web search and code execution. It’s cost-effective, reliable, and ideal for complex workflows in research, business, and creative fields.*

You can find tons of example on how you can call Azure OpenAI models with C# Nuget Package but **o3-pro is a slightly different beast**. The usual problem is you will use existing code and you got this error.

{{< highlight text "linenos=table,linenostart=1" >}}
The chatCompletion operation does not work with the specified model, o3-pro. Please choose different model and try again.
{{< / highlight >}}

This error is due to the fact that o3-pro does not support chat model, **you should use a response model where you create a question and then you got the answer** (as well as some other details of the inner reasoning).

To solve this problem you first need to use the latest preview packate of Nuget, the 2.2.0-beta.5 at the time of this post.

{{< highlight xml >}}
<PackageReference Include="Azure.AI.OpenAI" Version="2.2.0-beta.5" />
{{< / highlight >}}

Then this is the C# code that you can use to call the model and examine the answer.

{{< highlight csharp  >}}
string endpoint = "https://yyyyyyyyy.openai.azure.com/";  // Your Azure endpoint
string apiKey = "xxxxxxxxxxxxx;                                    // Your API Key
string deploymentName = "o3-pro";              // Deployment name for o3-pro

var options = new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview);

AzureOpenAIClient azureClient = new(
    new Uri(endpoint),
    new AzureKeyCredential(apiKey),
    options);

// Can't use this because Chat client is not supported by o3-pro
// it will throw The chatCompletion operation does not work with the specified model, o3-pro. Please choose different model and try again

//ChatClient chatClient = azureClient.GetChatClient(deploymentName);
//var message = ChatMessage.CreateUserMessage("Which is the capital of France?");
//var response = chatClient.CompleteChat(message);

#pragma warning disable OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
var responseClient = azureClient.GetOpenAIResponseClient(deploymentName);
#pragma warning restore OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
var response = responseClient.CreateResponse("Which are the real benefit of async in C#? What whould I lose if I do not use it?");

Console.WriteLine("Response:" + response);

var output = response.Value.OutputItems;
foreach (var item in output)
{
#pragma warning disable OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    if (item is ReasoningResponseItem rri)
    {
        if (rri.SummaryParts.Count > 0)
        {
            Console.WriteLine("REASONING STEPS");
            foreach (var sp in rri.SummaryParts)
            {
                Console.WriteLine($"ReasonStep: {sp}");
            }
            Console.WriteLine("");
        }
    }
    else if (item is MessageResponseItem mri)
    {
        Console.WriteLine("ANSWER:");
        foreach (var content in mri.Content)
        {
            Console.Write($"Content: {content.Text}");
        }
    }
#pragma warning restore OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
}

Console.ReadKey();
{{< / highlight >}}

The code is really simple you just need to use a different mode, and you need to inspect the response, to **distinguish between the response that contains reasoning part and the part that contains real answer text.**.


Gian Maria