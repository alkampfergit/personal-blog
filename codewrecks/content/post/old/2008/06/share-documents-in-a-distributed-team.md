---
title: "Share documents in a distributed team"
description: ""
date: 2008-06-25T06:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
Some days ago I received a mail with an analysis document for a Project I’m working to. Since we are a distributed team of programmers, someone still uses mail to share document with members of the team.

* **This is simply WRONG!!!** *

The reason are

1) It lacks tracking. Some people uses to append a version such as Document\_Ver32.doc, but this is prone to error. If A and B modify the same document at the same time then we will have two version of Document\_Ver33.doc….too bad.

2) It lacks versioning. Some years ago we are working in a project, the stakeholder approves analysis document version X, it sets the budget and we begin to develop all the features described in the document, at the same time the analysis goes on, and after some time the system goes in production. The stakeholder told us that a feature was missing, but our version of the document is X+15, and we really did not remember if the feature is in version X. We had to waste a lot of time seeking in the mail the version X to check if the feature is really there.

3) It has no backup: What happened if all members of the team deletes all their mail?

4) It has no central place to find the document. Usually one person has a main computer where he works on, if you are on a different computer, you have no access to your mails and you cannot read the documents.

5) it is not easy to edit a document, you have to save from the mail to a local folder, then edit, then send to all members.

6) It is difficult to find the latest version of the document to edit, you should check your mail client to find last mail with the document.

The right solution is to store documents in a SCS like subversion because:

1) It supports traking; you can know with few clicks all the history of all documents, who, when, and what changed in each version. You can retrieve every version of the document, you can grab differences between every two version of the document

2) It can be backupped regularly, it is sufficient to schedule a backup of the central repository.

3) You have a central place where all the documents are stored, if you are working on a different computer, you can access the documents from the internet.

4) You can use features like “Locking” to avoid conflicts, and if two people are editing the same version at the same moment, the system tells you that there is a conflict.

5) before you modify a document, do an update, and you are sure to work with the latest version no matter what.

Alk.

<!--dotnetkickit-->

Tags: [Distributed Team](http://technorati.com/tag/Distributed%20Team)
