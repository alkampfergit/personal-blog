---
title: "Git showing file as modified even if it is unchanged"
description: ""
date: 2014-04-22T16:00:37+02:00
draft: false
tags: [Git]
categories: [Programming]
---
This is one annoying problem that happens sometimes to git users: the symptom is:* **git status** *command shows you some files as modified (you are sure that you had not modified that files), you revert all changes with a * **git checkout —.** *but the files stills are in modified state if you issue another * **git status** *.

This is a real annoying problem, suppose you want to switch branch with * **git checkout branchname** *, you will find that git does not allow you to switch because of uncommitted changes.

This problem is likely caused by the end-of-line normalization (I strongly suggest you to read all the details in [Pro Git book](http://git-scm.com/book) or read the [help of github](https://help.github.com/articles/dealing-with-line-endings)). I do not want to enter into details of this feature, but I only want to help people to diagnose and avoid this kind of problem.

To understand if you really have a Line Ending Issue you should run * **git diff -w** *command to verify what is really changed in files that git as modified with * **git status** *command. The -w options tells git to ignore whitespace and line endings, if this command shows no differences, you are probably victim of problem in Line Ending Normalization.

This is especially true if you are working with git svn, connecting to a subversion repository where developers did not pay attention to line endings and it happens usually when you have files with mixed CRLF / CR / LF. If you work in mixed environment (Unix/Linux, Windows, Macintosh) it is better to find files that are listed as modified and manually (or with some tool) normalize Line Endings. If you do not work in mixed environment*you can simply turn off eol normalization* *for the single repository where you experience the problem.*To do this you can issue a * **git config –local core.autocrlf false** *  but it works only for you and not for all the other developers that works to the project. Moreover some people reports that they still have problem even with core.autocrlf to false.

Remember that git supports.gitattributes files, used to change settings for a single subdirectory. If you set core.autocrlf to false and still have line ending normalization problem, please search for.gitattribuges files in every subdirectory of your repository, and verify if it has a line where autocrlf is turned on:

\* text=auto

now you can turn off in *all.gitattributes files you find in your repository*

\* text=off

To be sure that every developer of the team works with autocrlf turned off, you should place a.gitattributes file in repository root with autocrlf turned off. Remember that it is a better option to normalize files and leave autocrlf turned on, but if you are working with legacy code imported from another VCS, or you work with *git svn, git-tf*or similar tools, probably it is better turn autocrlf to off if you start experiencing that kind of problems.

Gian Maria.
