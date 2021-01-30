---
title: "Remove one pixel white border from WPF listview"
description: ""
date: 2011-02-01T18:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I used my [kineticlistview](http://kineticlistview.codeplex.com/) in one project, and I noticed that it has a nasty white border around the content, but when I change back the control to standard ListView I noticed that the border remains.

This means that this is standard behavior of the ListView, but it is inacceptable on this project where I use the ListView to show pictures.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image.png)

Now you can simply go to blend, right click the ListView and choose to edit the template

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image1.png)

Now I simply give a name to this new template and store them into a resource file

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image2.png)

This will make my new template available everywhere in the project. Here is the default template of the ListView

[![SNAGHTML20379ac](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTML20379ac_thumb.png "SNAGHTML20379ac")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTML20379ac.png)

Just set all paddings to zero and the game is done. Now that you have this new template in a resource file you can apply directly to every ListView of the project simply with a right click on the ListView in Blend.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image3.png)

Now run the program again andâ€¦. voilÃ  ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/wlEmoticon-smile.png) the nasty one pixel white border is gone.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image4.png)

Alk.
