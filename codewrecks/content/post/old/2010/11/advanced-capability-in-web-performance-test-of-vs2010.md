---
title: "Advanced capability in Web Performance Test of VS2010"
description: ""
date: 2010-11-12T15:00:37+02:00
draft: false
tags: [Visual Studio,Web Test]
categories: [Testing]
---
Suppose you have a very stupid web page that adds two numbers together.

[![SNAGHTML1bfcde2](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1bfcde2_thumb.png "SNAGHTML1bfcde2")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1bfcde2.png)

 ***Figure 1***: *A stupid web page to sum two numbers*

WOW, this is really a beautiful and useful web page :), now I want to register a web performance test that is able to use extraction rules to use this page as a Fibonacci Number calculator. I start registering a simple web performance test that adds 1 and 2 together. This is a simple two steps web performance test.

[![SNAGHTML1e449c5](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1e449c5_thumb.png "SNAGHTML1e449c5")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1e449c5.png)

 ***Figure 2***: *recorded web performance test with two simple pages.*

Now execute the test in Visual Studio, then go to request tab, localize the txtB parameter and press right click and then Quick Find. Now in the Quick find windows press â€œfind nextâ€  to quickly localize the position of the input textbox in the response of the second request. This permits you to immediately localize where the page render the text.

[![SNAGHTML1e8ee2e](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1e8ee2e_thumb.png "SNAGHTML1e8ee2e")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1e8ee2e.png)

 ***Figure 3***: *With quick find I can localize with easy values of the request*

Now select the value â€œ2â€ in the response text, right click and then select Add Extraction Rule, repeat the same with the value 3 of the lblResult label. Now the test contains two extraction parameters called param0 and param1, just rename them to give them more meaningful names.

[![SNAGHTML1ec858d](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1ec858d_thumb.png "SNAGHTML1ec858d")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1ec858d.png)

 ***Figure 4***: *Rename extracted parameter to some more meaningful names.*

Now select the second request in the test and copy with CTRL+C and CTRL+V, now edit the form post parameter setting the txtA parameter to context parameter B and txtB field value to context parameter result. Remember that for Fibonacci numbers you can grab the next number in the series just adding the last two numbers (B and result of the previous request).

[![SNAGHTML1f11751](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1f11751_thumb.png "SNAGHTML1f11751")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1f11751.png)

 ***Figure 5***: *copy the second request and use the context parameter extracted in the previous request*

Now right click the request, and choose â€œInsert Loopâ€, simply select a For Loop and setup the loop to do 10 iterations.

[![SNAGHTML1f37bfc](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1f37bfc_thumb.png "SNAGHTML1f37bfc")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1f37bfc.png)

 ***Figure 6***: *A loop is added to the request, now the copied request will be executed 10 times.*

Now execute the test, and with few clicks of the mouse you have created a test that calculates fibonacci numbers.

[![SNAGHTML1f5441b](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1f5441b_thumb.png "SNAGHTML1f5441b")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1f5441b.png)

 ***Figure 7***: *The fibonacci number calculator web performance test in action.*

This example is really not so useful, but demonstrates how you can create a complex web automation test, with loops and requests that depends on the previous response, thanks to extraction rules.

Alk.
