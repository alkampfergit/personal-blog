---
title: "My First Experiment with a Heavily Quantized Local Model"
description: "Testing a heavily quantized Qwen 3.6 local model with an isolated email workflow to find out whether aggressive quantization is practical for real-world use."
date: 2026-09-24T08:00:00+00:00
draft: false
tags: ["AI", "Local LLM", "Qwen", "Quantization"]
categories: ["AI"]
---

I've an hermes installation that I'm using with local model to test a situation where I want maximum privacy. The goal is reading my emails, telling me what I have unread, have a classification and actionable suggestions for each email, then mark all the email as read.

To minimize risk I have an isolated machine so the AI agent can only access an ip on the local network that expose the LLM endpoint and also another endpoint to execute commands like

```
curl -X POST http://<isolated-machine-ip>:<command-endpoint-port>/execute -d '{"command": "smtp -summary -accountname blah"}'
```

This makes the Hermes machine completely isolated, it does not contains anything related to authentication to my email, and it can't even perform SMTP raw command through another machine, it can only execute some commands that I'm allowing.

This is orchestrated with a simple skill, and I'm using Qwen 3.6 35B A3B model for the local LLM endpoint, with some satisfaction. Usually the process is smooth, it reads email, classifies, mark as read and so on. Sometimes I still have some error with office 365 that has really **long ids so sometimes it got malformed ids and needs to do a second pass**.

Then I tried one of the heavily quantized models, bonsay for Qwen 3.8, and the result was, meh. If you read in the internet you surely will find tons of persons that post something like **I run a xxxxB parameter on my fridge** and usually we have heavy quantization, untested technique, so you always need to test these on a real process.

Actually the best command line is 

```
.\llama-server.exe `                                                                      pwsh 
>     -m "S:\HuggingFace\lmstudio\unsloth\Qwen3.6-35B-A3B-GGUF\Qwen3.6-35B-A3B-UD-IQ3_XXS.gguf" `
>     --alias qwen3.6-35b --host 0.0.0.0 --port 9010 -c 131072 -np 1 `
>     -ngl 999 -ncmoe 0 -fa on -b 2048 -ub 512 `
>     -ctk q8_0 -ctv q8_0 -fit off -lm none -t 12 -tb 12 `
>     --temp 0.6 --top-p 0.95 --top-k 20 --min-p 0.0
```

> Really aggressive quantization are not bad per-se, but you need to benchmark the model onto your real use case to find the sweet spot.

Even if quantization is IQ3_XXS the quality of the answer is quite good, and easily sufficient for my use case, I've checked email, it had a minor hiccup counting email, but generally speaking it works good. This configuration is using only my 5060 ti 16 GB that is used also to manage the display and other GPU tasks.

So, whenever you heard about the new fantastic model, you should always test it in your real use case and verify its performance before fully relying on it.

Gian Maria.