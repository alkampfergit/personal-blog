---
title: "Pex to the rescue"
description: ""
date: 2009-06-16T06:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
[Pex](http://research.microsoft.com/en-us/projects/Pex/) is a product from microsoft research that is really useful for those Test Addicted developers. Pex is a White Box Testing tool for.Net, that is able to analyze your code to find every possible point of failure of a method or a class. This morning I had a couple of log from a server that runs a windows service that makes analysis on some text strings. These analysis where originally composed by some regular expressions, but since the amount of data is really big, I substitute some regexes with specialized routine that speeds up the time needed to finish the work.

Those exceptions I received this morning told me that my unit tests for that class are not so good, even if they cover the 100% of the class code. Before actually trying to review the code to find why it can give an IndexOutOfBoundException I fired Pex on that class.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image13.png)

It seems that there are really a lot of paths that makes my routine to fail. If you look at the Text column you see that some of the input strings that makes my routine fails are composed by string termination (\0) inside the string, or are null etc etc. Pex can find those specific input values because it analyzes the code of the Class under test, for this reason it is a tool of â€œWhite Boxâ€ testing. Another great feature of Pex is the â€œSuggestions Windowsâ€, since Pex found errors because he really analyze written code he can also give you suggestion on how to avoid a specific error.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image14.png)

SElecting the specific error, you can find a suggestion on how to avoid it, in this situation it seems that I completely forgot to test the length of the text to be analyzed. My next step is to add validation of text lenght to avoid those errors.

A real cool feature is the possibility to save one or more failing Pex test as a standard unit test.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image15.png)

This will create one test for each one of the selected tests, and you can run those test as standard ones.

After you have modified your class you can run pex again to check if some other error remains. Running Pex analysis took time, Pex have a time limit to avoid running forever, but you can click on appropriate icon to change default values (this needs the creation of a test project that pex will use to store information)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image16.png)

Once the test project is created you can find a test file named in the same way of the class under test with the suffix Test, it is composed of some test methods decorated with Pex specific attributes.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[PexMethod(MaxConstraintSolverTime = 2)]
        public MultiRange FindHit(
             [PexAssumeUnderTest]WildCardBeginEndKeywordFinder target,
             string keyword,
             string text
        )
        {
            // TODO: add assertions to method WildCardBeginEndKeywordFinderTest.FindHit(WildCardBeginEndKeywordFinder, String, String)
            MultiRange result = target.FindHit(keyword, text);
            return result;
        }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I changed the MaxConstraintSolverTime to 2 so Pex can spend more time to analyze my function, now I can simply right click Pex generated class, and select â€œRun Pex explorationâ€ to explore again the method with this new setting. Now Pex can do a more deep analysis (this does not means that will always find more errors).

Pex is really good to find input pattern that makes your code fail:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image17.png)

Iâ€™m sure I never think to pass 1\*\*\*\*\0 to my routine :D. After some correction you usually find that inputs that makes your code fail are really strange, and you can tell â€œOk, it is enoughâ€, if someone passes â€œ1\*\*\*\*\*\0â€ he should really got an exception as result, but in the end Pex is exceptional in finding obvious failing path in your code.

alk.

Tags: [Pex](http://technorati.com/tag/Pex) [Testing](http://technorati.com/tag/Testing)
