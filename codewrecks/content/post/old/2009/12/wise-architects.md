---
title: "Wise architects"
description: ""
date: 2009-12-09T10:00:37+02:00
draft: false
tags: [Architecture]
categories: [Software Architecture]
---
Software architects are similar to civil architects, both of them work to create an artifact (software or building) on paper that will be subsequent realized. If you are committed to make a project of a building, witch of them you will like more to create?

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image9.png)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image10.png)

Iâ€™m sure that the first one is probably the first choice, for many reasons. It is more challenging, it will probably make you famous, it is surely more beautiful. The problem is that those two buildings are really different in use. The first can be a congress center, a museum, but the other one is a simple house for a standard family. The problem arise if a customer ask you for â€œan house for me and my familyâ€ and you will give him the project to build the first oneâ€¦. probably it is not the expected result, from the perspective of the customer.

The first solution is more expensive to build, it is probably more expensive to maintain, in winter you will spend tons of money to keep it warm and bla bla bla. The point is that the first building is a perfect structure for a museum, but absolutely the wrong one for a family, so if you, as an architect, will create the first one for a family, you have failed.

In software architecture the situation is the same, but with a great difference: the artifact that gets created, is immaterial (a software cannot be seen), and the customer does not perceive its complexity. Everyone can say â€œhey, I asked for an house, not for a congress centerâ€, but it is really more difficult to look at a software and say, hey, I asked for a simple web site for my football club, but you gave me a full e-commerce, that I does not need.

In this situation, the customer can ask for a software to manage some data from hardware RFID readers. The architect can create a big software made of separated executables, WCF, Remoting, flexible and pluggable algorithms, etc etc. The big problem is that probably it is enough a single executable connected to the readers, that stores raw data in db, plus another executables that manage those data and finally a bunch of web pages that show the result. The three parts are completely disconnected, and the whole architecture is Simple.

Sometimes architects discard simple solutions, they want the customer to think â€œThis architect is really good, he created really a good project that uses latest technologiesâ€. Then they realize, once in production, that they simply created the wrong stuff, because the whole think is difficult to maintain and probably the customer is not satisfied with the final result.

The conclusion is that, in my opinion, *simplicity*is a really great value for an architecture, and wise architects always takes it in consideration when they make a project. Creating a simple structure can be less challenging and less interesting, but the final goal is finding what the customer really needs, not giving fame or pleasure to the architect. So the wise architect is the one who really understand the needs of the customer and resists the temptation to create an architecture only for his personal pleasure.

Alk.

Tags: [Software architecture](http://technorati.com/tag/Software%20architecture)
