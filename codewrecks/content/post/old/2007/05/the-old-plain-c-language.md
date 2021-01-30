---
title: "The old plain C language"
description: ""
date: 2007-05-27T22:00:37+02:00
draft: false
tags: [Languages]
categories: [Languages]
---
A friend of mine is taking a basic course in computer programming, and actually he is studying the basic of C language. Yesterday he told me that he must do a very simple exercise that will print on screen a triangle like this  
XXXXXXXXXX  
XXXXXXXXX  
XXXXXXXX  
And so on. He asked me if I could review his solution before he give his program to the teacher, because he is moving from the old house to a new house and actually he do not have access to a computer to try his solution. This morning I decided to refresh my knowledge of C solving this simple exercise, I must admit that I love C/C++â€¦.I cannot explain but they are really fascinating languages (I love assembly language too)

#include“stdio.h”  
#include“memory.h”  
  
#define  NUM\_OF\_CHARS  10  
  
int  main()  {  
char  str[NUM\_OF\_CHARS  +  1];  
int  I;  
  memset(str,  ‘X’,  NUM\_OF\_CHARS);  
for  (I  =  NUM\_OF\_CHARS;  I  &gt;  0;  –I)  {  
        str[I]  =  ‘\0’;    
        printf(“%s\n”,  str);  
  }    
}

The ability to manage memory of a string is one of the feature that I missed most when I program in C#.

Alk.
