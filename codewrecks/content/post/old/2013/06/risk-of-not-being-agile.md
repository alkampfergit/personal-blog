---
title: "Risk of not being agile"
description: ""
date: 2013-06-23T16:00:37+02:00
draft: false
tags: [Agile,Scrum]
categories: [Agile]
---
Deciding if it worth change own process towards agile ones, es [Scrum](http://www.scrum.org), should be done not only estimating the advantage of using the new process, but also *estimating the risk of not using agile procedures developing software in these days*. Lets speak about a fail story that could be avoided with scrum (if you do not know what Scrum is you can read [What is Scrum on Scrum.org](http://www.scrum.org/Resources/What-is-Scrum)).

A project started with a set of requirements approved by the stakeholder, after initial basic features were implemented, developers started to work on an “advanced search functionality” requirement, that had * **quite technical difficulties and took quite a bit of time to develop** *. The result was good, it worked as requested and used some really advanced functionality for the time it was build.

After one year that the software was in production, there was the need of a simple upgrade, the team developed this upgrade in a really small amount of time, then we planned test in Pre-Production environment to verify regression bugs. We  **restored the exact production environment** , updated the dll (it was an asp.net project) then we did QA test.  **The tests showed us that the “advanced search functionality” was broken. As soon as you click on the button that trigger the search the system returned “Internal Error”.** We did a search in error log, and with great surprise we immediately found the cause: a simple and stupid configuration error, the web.config misses a parameter required by that feature and  **we had the same error in production environment. Then we did a search in the whole error log system looking for the same error and we found noone**.

* **<font color="#ff0000">That feature was never used by anyone in an entire year!</font>** *

This is one of the risk of not being agile, when you establish a set of feature with the stakeholder, and those requirements are decided at the start of the project you have a set of risks.

- *Developers tend to prefer working to requirement that poses technical difficulties because they like to being challenged*
- *Developers tend to “gold-plate” features if it give them fun (Es using new library to add some unnecessary little features)*
- *People do not like doing repetitive stuff, all requirement that are “boring” will be developed with minimum effort*

I can continue to list problems, but the real error we did was :* **not to** *[* **Groom Our Backlog** *](http://www.scrum.org/Assessments/Professional-Scrum-Developer-Assessments/PSD-Objective-Domain)* **with the customer** *. One of the  **risk of not being agile is working with a fixed set of un-prioritized set of feature and letting the team spent time where they think time should be spent**. If we had Scrum process ([you can find a quick guide on scrum.org](https://www.scrum.org/Portals/0/Documents/Scrum%20Guides/Scrum_Guide.pdf#zoom=100) if you do not know scrum) we would had prioritization of the feature, each sprint we would have revisited Backlog with the Product Owner, and * **probably the Advanced Search Feature would never had been developed** *, because it was not really needed.

One of the real advantage of Scrum process is the constant grooming of the Backlog, so each Sprint starts with a clear indication of what is more important for the customer to be developed next. In long term this reduces a lot the amount of time  wasted in unnecessary gold-plating on in developing unnecessary features and give to customer/stakeholder the ability to have the team implement what is really needed.

Gian Maria.
