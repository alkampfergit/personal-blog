---
title: "GitHub Copilot-X in action: Steps instructions in a single prompt"
description: "To have Copilot generates complex code, make it proceeds in steps is a good idea. Let's try to understand how to use a single prompt to have it reason in steps."
date: 2023-05-20T07:00:00+00:00
draft: false
tags: ["GitHub", "Copilot", "ChatGPT"]
categories: ["AI"]
---

If you look at [previous post on the subject](https://www.codewrecks.com/post/github/copilot-x-few-shot-prompt/) **I'm experimenting with Copilot Chat to have it automate mundane, repetitive operation** but that can operate on complex classes. In previous example I demonstrated how you can decompose a complex operation in multiple steps, actually guiding Copilot towards desired result.

> Now the question is: Once you got it right, is it possible to use a single prompt to have desired result?

Well the answer is **it depends**. It is not simple because the AI needs to perform an intermediate series of steps and the result can:

  - Contains some of the intermediate result, you do not want them
  - Have an error in some intermediate steps that **propagate to the last step**.
  - Use wrong context (remember that the original class is in the context of the request and it can complicate things)
  - Each time you run the prompt on a different class you get different result due to the nature of LLM

All of these points can deteriorate the quality of the output.

In this specific example, the complexity of the starting class **makes difficult for Copilot to generate what I want in a single steps, thus the trick to ask in the first step to create another class is the key**. The result is a three step process

  1. Analyze current class, find public properties, generates another class with only those property and standard syntax
  1. Using that new class Generate a method that create a new instance of the class **using a special syntax of Fasterflect to populate properties**.
  1. Rewrite method of step 2 using random value.

Step 2 is important because you can **use standard syntax to populate properties of intermediate class** but I want the code to be able to work with the original class. So I'm tricking copilot in using a different simpler class, but using a syntax that is valid for the final class.

I've done some tentative and after about 10 tentative starting from the original three prompts I've come up to this one.

> You are an experienced C# programmer given a task in a sequence of STEPS to be performed on CODE. First value of CODE is the code included in prompt. Each Steps uses code context and generates another piece of CODE that will replace the previous one. It is imperative that each step considers only actual CODE. Each step starts with STEPXXX. You will output CODE value for each step indicating STEP number in the header. List of steps following: STEPA: find all public properties and generates another class that contains only those public properties. STEPB: Create a method that create an instance of the above class and then populate properties with the following syntax |||sut.SetPropertyValue("PropertyName", 1);||| you will not use standard setter and getter, you can only use SetPropertyValue syntax. STEPC: Rewrite this method randomizing values used to populate properties.

Trying to create a single prompt that accomplish all steps was instructing, **it is always an interesting experiment trying to understand how an LLM works**. Actually the most interesting part and that one that dramatically 

## Trying to make it work with a state machine

I instruct Copilot to execute a series of STEPS, performed on CODE. Each steps will generate a new CODE, each step can only consider actual CODE. **This is the master trick, because it is trying to force Copilot to start from the class included in prompt in the first step, and ignore it in the subsequent one**. 

## Output intermediate steps

With this instruction I can understand which STEPS is understood poorly and needs fine-tuning in prompt, maybe with some examples.

Here is one of the output.

![Step 1 output](../images/copilot-x-steps1.png)

***Figure 1:*** *Step 1 output*

Perfect, it is printing what I'm expecting.

![Step 2 output](../images/copilot-x-steps2.png)

***Figure 2:*** *Step 2 output*

Step 2 is perfect, it is using the name of the class in step 1. Now I've tried to instruct him to generate a class that **has the same name of the original class but it tend to confuse him**, I prefer changing name of the class, then I substitute with the real name of my class when I paste the code in Visual Studio.

![Step 3 output](../images/copilot-x-steps3-ok.png)

***Figure 3:*** *Step 3 output*

Well it is good but it is not perfect, I prefer random to be initialized with a seed value so I can further tweaks step3, asking **to create a random object initialized with a random seed**. Then I re-run the prompt and get a weird result, really far from what I'm expecting. This is the joy and damnation of LLM, they seems to have some "intelligence" but they have some random components **that makes it challenging to find a good prompt that is stable in the output.**

> What is fun is that it seems that messing with capital STEP and step changes a lot the output.

To verify if prompt is stable run it few times **clearing the chat each run** to verify that the output is stable. Do not forget to **vote the result so Copilot can understand when it generates good output**.

After some experiments I found that 

  - it is really better to give specific name to intermediate classes.
  - Step 3 is not really useful, I can directly ask to use random value in step2

Removing one step seems to improve the result.

> You are an experienced C# programmer given a task in a sequence of steps to be performed on CODE. First value of CODE is the code included in prompt. Each step uses code context and generates another piece of CODE that will replace the previous one. It is imperative that each step considers only actual CODE. Each step starts with STEPXXX. You will output CODE value for each step indicating step number in the header. List of steps following: STEPA: find all public properties and generates another class called Intermediate that contains only those public properties. STEPB: Create a method called CreateIntermediate that create an instance of Intermediate class and then populate properties with the following syntax |||intermediate.SetPropertyValue("PropertyName", 1);||| you will not use standard setter and getter, you can only use SetPropertyValue syntax. STEPC: Rewrite CreateIntermediate method using random values, use a random object declared in this way |||rnd = new Random(DateTime.UtcNow % int.MaxValue);|||.

As you can see I specified Copilot that class created in step1 will be called Intermediate, and the method created in step2 is called CreateIntermediate. I got some **weird output**.

![What is CURRENT LINE WITH CURSOR?](../images/weird-copilot-1.png)

***Figure 4:*** *What is CURRENT LINE WITH CURSOR?*

In previous image I show that in one of the output I got CURRENT LINE WITH CURSOR output in various point of the output. One **of the problem of generated code is that I got random value that are not perfect.** It uses new Random() syntax that does not initialize Random with a random seed. It will not often randomize boolean and DateTime variables. So I changed the prompt removing some of the complexity.

This is another trick, generating a good random value for a Unit Test is not simple, it is **better to create a generic helper in your code and then instruct Copilot to call your generator function.** I've tried some tentative like the following one but with no great success

> You are an experienced C# programmer given a task in a sequence of 2 steps to be performed on CODE. First value of CODE is the code included in prompt. Each step uses code context and generates another piece of CODE that will replace the previous one. Remember that you have exactly 2 steps. It is imperative that you will proceed in steps. Each step starts with STEPXXX. You will output CODE value for each step indicating step number in the header. List of steps following: STEPA: find all public properties and generates another class called Intermediate that contains only those public properties. STEPB: Create a method called CreateIntermediate that create an instance of Intermediate class and then populate properties with the following syntax |||intermediate.SetPropertyValue("PropertyName", value);||| where value is obtained calling |||myRandom.GenerateValue<T>()|||. You will not use standard setter and getter, you can only use SetPropertyValue syntax. 

In Figure 5 you can see a really good and perfect result.

![Result is really good now in only TWO steps](../images/few-shot-final1.png)

***Figure 5:*** *Result is really good now in only TWO steps*

But I got often really bad output, and when it happens is when it **does not proceed in steps, it will generate result for a single step and it got completely confused by the complexity of the original class**. In such a scenario I need to focus in having Copilot **always decompose the prompt in steps**. 

The amazing thing is that using the old prompt that is not specifying how to generate random value is **more stable**, it seems that adding the extra complexity of using some specific random makes everything more complex. A good final prompt is 

> You are an experienced C# programmer that must execute a seriese of steps separated by ---. You will output CODE value for each step indicating step number in the header. --- Step1: find all public properties and generates another class called Intermediate that contains only those public properties. --- Step2: Create a method called CreateIntermediate that create an instance of Intermediate class and then populate properties with the following syntax |||intermediate.SetPropertyValue("PropertyName", value);|||. You will not use standard setter and getter, you can only use SetPropertyValue syntax. --- Step3: Rewrite CreateIntermediate using a random value obtained by this call |||myRandom.GenerateValue<T>()|||. 

One of the problems is that **Pressing ALT+ù in Visual Studio or writing in copilot chat allows you to insert a single line prompt so you need to be extra clear on how the steps are subdivided**. 

Then I was called to lunch by wife :), I had so much fun that I lost sense of time :D.

Gian Maria