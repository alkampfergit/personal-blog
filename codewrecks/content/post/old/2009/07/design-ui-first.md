---
title: "Design UI First"
description: ""
date: 2009-07-06T05:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
Some days ago we have a question on the possibility to have a â€œ[Design UI first](http://www.guisa.org/forums/t/182.aspx)â€ approach to a project. (the forum post is in Italian). If you asked me this question some years ago, I surely have answered â€œProbably notâ€. I must admit that I always thought that some people gave too many importance to the UI. Quite often Project managers are the kind of people that always ask for impressive interface to show to final customers, while we, as programmers, tend to spent more attention to the â€œcode partâ€ of the project, and usually do not care about UI. After all where is the pride in putting some labels and textboxes in a form respect in designing a well crafted Domain Model with ORM and AOP etc etc.

> I now realize that *this is wrong!!*

The problem is that the UI is directly perceived by the customer and final user, while internal structure is completely hidden. If you build a perfect program with a wrong ui, the customer will blame you, because even the most well crafted architecture fails if the UI is poorly designed. After all what is the point in having a perfect domain model, if the user can use it only through a poor interface?. This is the same of looking at a very good film full of special effects in an old 20â€™â€™ black and white screen, the film can be the best in the world, but you cannot perceive it because of viewing it through a poor interface.

Another key factor about UI is [usability](http://www.amazon.com/Think-Common-Sense-Approach-Usability/dp/0789723107). Building a good UI does not means using 3D animations and shocking effects, but it is all about  **usability.** If a software fails in usability, he is [doomed to disappear](http://www.amazon.com/Why-Software-Sucks-What-About/dp/0321466756/ref=sr_1_1?ie=UTF8&amp;s=books&amp;qid=1246642730&amp;sr=1-1).The problem here is that the world is not made of developers, and what is good for a developer, probably is not good for normal people.

For all those reason, probably it is possible to approach a problem starting with the UI, maybe side by side with Use Case approach. If you focus on the UI you need a tool that permits you to rapidly prototype a sketch of the interface, so the customer can immediately have a visual impact on the aspect of the final application. In this scenario [Balsamiq](http://www.balsamiq.com/) can save your life. Consider this mockup as example, it took me no more than 10 minutes to sketch, and it is one of the first time I use balsamiq

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image8.png)

This simple sketch can be immediately shown to the customer/user for review and validation. Moreover even if this is only a sketch, it gives immediately a clue on some technical difficulties that can arise. As an example we need Google Map integration, and we need to show various graphic artifacts like icons depending on properties of object. We also need internal link, because you can see a link that states â€œGo to Orderâ€. We must show picture, use various tab like controls that shows tabs on top or on left, etc.

This interface also  capture the minimum amount of properties of various object, from it we can be sure that Customer object need a Name, Last Name, Age, Nickname, IsAKid (boolean) properties, and we also need to extract from database projections, like â€œNumber of ordersâ€ for each customer. This means that even if we start with a UI prototyping, we also begin focusing on data that the software must handle, as well as relations between various objects.

Moreover if we begin the analysis of the project with use cases or other similar techniques, then build the software and finally show the result to the user, we have an high probability that the customer want to change something in the interface, and such changes sometimes impact on the overall architecture. (think to add a Drag and Drop to a web page). If you begin the analysis phase with UI mockup, the probability that the customer want to change the UI when it is finished is considerably lower.

After all [A picture is *worth* a thousand words](http://en.wikipedia.org/wiki/A_picture_is_worth_a_thousand_words) :D so I think that a UI First approach can be feasible.

Alk.

Tags: [Ui prototyping](http://technorati.com/tag/Ui%20prototyping)
