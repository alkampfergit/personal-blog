---
title: "Error synchronizing database with red gate SQL compare"
description: ""
date: 2007-05-02T01:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
Today I was synchronizing two database with red gate sql compare, newer database has 6 more additional view, but the sync script failed with some errors. One of the view is called MatterKnowledges and the script return error “matterknowledges” already exists, even if the destination database has no such view. The problem originates from the fact that the view (SQL2000) was create with a different name and then renamed to MatterKnowledges. The solution to the problem was dropping and then recreate the view on the original database, now all works ok.

Alk.
