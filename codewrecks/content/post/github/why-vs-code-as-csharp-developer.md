---
title: "Why VS Code for C# Developers"
description: "Practical reasons C# developers should adopt Visual Studio Code, with a focus on GitHub Copilot and Codespaces."
date: 2026-01-06T06:00:00+00:00
draft: false
tags: ["GitHub", "Copilot", "VSCode", "C#"]
categories: ["AI"]
---

If you're a C# developer who has relied on a full Visual Studio IDE for years, Visual Studio Code (VS Code) might look like too small a tool for serious work. In reality **with big solutions you will find full Visual Studio more productive** but Visual Studio Code now has some specific features that makes it more useful especially for small project.

## C# Developer Toolkit

For productive C# development in VS Code you only need a few well-chosen pieces: the .NET SDK and `dotnet` CLI, the official `C#` extension (OmniSharp) for IntelliSense and debugging, a Test Explorer adapter for running unit tests, and a couple of linters/analysers (EditorConfig, Roslyn analyzers or StyleCop) to keep code consistent. These core tools give you a fast edit-build-test loop while keeping your environment simple and reproducible.

The extension **C# Dev Kit** from Microsoft bundles all these tools in a single install, making it easy to get started with C# development in VS Code. The problem is that it **does not rival with all the feature of full Visual Studio IDE** so the real question is:

> Why should a C# developer use VS Code instead of full Visual Studio IDE?

## GitHub Copilot

The experience of GitHub Copilot in VS Code is +*really better that what you got on other IDEs**. Not only I use VS code insiders and I can work with the **pre-release version of Copilot** but the whole experience is more fluid and integrated. 

Clearly you can work with both Visual Studio and VS Code opened in the same folder, you **can just use the tools more useful for the specific task**, (as an example Debugging in Visual Studio is WAY MORE powerful that VS code) so you can benefit of both worlds. 

## Codespaces

I usually have side projects that I develop on my workstation, then on my laptop etc, and one of the most annoying things is to keep all the tooling in sync. Since **I often works with MongoDB or Elasticsearch**, it is convenient configuring a devcontainer environment that will declare dependencies from other containers. This is an example of docker compose file for my devcontainer.

```yaml
version: '3.8'

services:
  app:
    image: mcr.microsoft.com/devcontainers/dotnet:1-10.0
    volumes:
      - ".:/workspace:cached"
    command: sleep infinity
    depends_on:
      - mongodb
      - elasticsearch
    networks:
      - app-network

  mongodb:
    image: mongo:6.0
    container_name: devcontainer_mongodb
    restart: unless-stopped
    ports:
      - 27017:27017
    volumes:
      - "mongodb_:/data/db"
    networks:
      - app-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:9.2.2
    restart: unless-stopped
    ports:
      - "9200:9200"
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    volumes:
      - "es_:/usr/share/elasticsearch/data"
    networks:
      - app-network

volumes:
  mongodb_:
  es_:

networks:
  app-network:
    driver: bridge
```

Thanks to this simple configuration I can have a consistent development environment everywhere, and since I can **connect to codespaces from a local instance of Visual Studio Code, I get the best of both worlds**. Since VS Code will connect to the remote environment I can simply **look inside MongoDB or Elasticsearch with the proper extensions installed in my local VS Code instance**, while the code is running in a remote environment.

Thanks to configuration I can specify envirnonment variables, ports to expose, and all the dependencies I need for my project. This is a section of my .devcontainer file

```json
	"containerEnv": {
		"TEST_MONGO_INSTANCE": "mongodb://mongodb/test",
		"AZURE_MODEL": "gpt-5-nano",
		"AZURE_EMBEDDING_MODEL": "text-embedding-3-small",
		"ELASTIC_TEST_URL": "http://elasticsearch:9200"
	}
```

I usually install also the extension for **Claude Code that works perfectly in my environment.**

Using devcontainer with codespaces is not the only option, if you have a powerful workstation you can use **docker desktop to bring your container to life locally**, the experience will be the same, but if you need to work from different machine, you just need docker and the rest is automatic.

## Conclusion

If you are a C# developer that wants to leverage the power of GitHub Copilot and Codespaces, Visual Studio Code is the natural choice. The experience with Copilot is simply better. For **some specific tasks you can always rely on full Visual Studio IDE**, but for the rest VS Code is lightweight, fast, and with the proper configuration you can have a consistent development environment everywhere.
