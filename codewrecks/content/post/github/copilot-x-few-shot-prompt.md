---
title: "GitHub Copilot-X in action: generation of test object with random data"
description: "Copilot chat can be a powerful assistant but you need to learn how to use it. Prompt engineering is probably one of the most fascinating thing to study right now."
date: 2023-05-20T06:00:00+00:00
draft: false
tags: ["GitHub", "chatGPT", "copilot"]
categories: ["AI"]
---

In real world software you often have complex classes, in this situation we have **AtomicReadmodels in a project heavily based on Event Sourcing**. One challenge they present is the presence of only private setters for all properties - a necessity due to the unconventional nature of these classes, **which rely on parsing domain events for property population**. This results in difficulties when creating test classes in memory during unit testing, as the private setters block external code from setting properties. Reflection or usage of libraries such as **Fasterflect are usually the solution but not without any annoyances**.

Designing in-memory classes becomes a painstaking process **due to the extensive reflection-based code it necessitates**. Not only does this method hold a high potential for errors, but also it could be exceedingly tedious and when developers are confronted with tedious code, they usually made errors. The ideal solution would be to **devise general factory methods capable of producing diverse random objects instead of identical ones**. Since I now have my Copilot Chat friend, I wonder if I can leverage it to generate these factory methods for me.

In such a situation a simple zero-shot prompt make copilot generate not useful code. The class is complex it has many properties and methods **and ChatGPT is not able to really understand my desire, especially it does not know exactly how to populate property with fasterflect**

So I tried to decompose the problem in smaller steps, and for each steps I designed a prompt **that is really detailed, asking for a precise result giving as much instruction I can**, thus elminate all the ambiguity. 

![A detailed prompt asking to create a simpler class to prosecute with the task](../images/first-detailed-prompt.png)

***Figure 1:*** *A detailed prompt asking to create a simpler class to prosecute with the task*

The first prompt is really specific and zero shot: 

> You are an experienced C# programmer, you will analize this class to find all public properties. You will generate the declaration of another class with the same public properties but with a standard getter and setter declaration. You will not include comment, you will not include any methods. You will include only properties 

As you can see **in this prompt I use the term "this class" because the cursor is on the declaration of the class**. Pressing ALT+ù opens copilot inline chat and a violet indication on the side of the code indicates the piece of the code that is present in the context. This helps because you can **insert a prompt exactly knowing the piece of code that will be included in the prompt**.

However, it's crucial to acknowledge that a zero-shot prompt isn't a silver bullet. These prompts, where no prior examples are provided and the request is made directly, can sometimes fall short. This is especially true when it comes to using Fasterflect, as the compiler may not be familiar with it. **I've done a couple of tentative but they are unsuccessful and I got poor result**.. 

What's fascinating about copilot chat is that it retains the context, so, **after it generates for me the class with the first prompt, I can ask in the chat **to populate its properties in a few-shot prompt where I'm indicating the syntax I want to be used**. 

![Few-shot prompt are really useful to instruct Copilot on desired result](../images/few-shot-copilot-prompt.png)

***Figure 2:*** *Few-shot prompt are really useful to instruct Copilot on desired result*

This is not a real few-shot, more a **one-shot**, but it explains the concept.

> Create an instance of the above class and then populate properties with the following syntax |||sut.SetPropertyValue("TicketNumber", 1);||| you will not use standard setter and getter, you can only use SetPropertyValue syntax.

Most important aspects of this prompt are:

  - I used **above class** to indicate the class Copilot generated in previous prompt
  - I must put everything on a single line so I used |||example||| syntax to tell Copilot the syntax I want to be used to populate property
  - I specifically reinforced the concept that **you can use only SetPropertyValue syntax**.

As you can see from **Figure 2** the result is quite good. Now it uses the simplified class generated in step one to generate the code **and the result is much better**. 

Following a couple of minor adjustments to the generated code, I can ask the copilot to modify my method to generate random data instead of static data. 

![Ask copilot to randomize data](../images/few-shot-randomization.png)

***Figure 3:*** *Ask copilot to randomize data*

And voilà, within moments, the copilot swiftly replaces the method, maintaining the syntax, but now using random data. **What's striking is that it correctly identifies DateTime properties like CreatedAt and DueDate and randomizes these dates using different intervals.** Notably, these intervals do not overlap, a smart practice to avoid potential unit testing issues. 

My feedback is: asking Copilot to analyze the complex class and produce immediately a factory method with random data **seems a too complex method and subdividing in step helps solve the problem**

Copilot is really really useful tool, what's crucial is **to understand how to generate few-show prompts, like the one demonstrated above for Fasterflect** so it has example to use. You do not need to be exaustive in all examples, the amazing thing it **is that it can infer many concepts by itself even from a single example.

Break down your tasks into a series of detailed prompts, which can help the compiler understand your problem better. Once the right prompt is found (which took me about 20 minutes), you can repurpose it for other classes, significantly reducing time and effort.

Gian Maria