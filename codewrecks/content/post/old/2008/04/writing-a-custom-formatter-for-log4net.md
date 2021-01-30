---
title: "Writing a custom formatter for log4net"
description: ""
date: 2008-04-29T06:00:37+02:00
draft: false
tags: [Frameworks]
categories: [Frameworks]
---
Log4Net is certainly one of the most important instrumentation library  for logging. Let’s see how to extend, writing a custom formatter for exceptions. Exceptions are important things to log, and it is important to log more information as possible, here is how can you write a simple class to log exception

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class ExceptionLayoutExtended : log4net.Layout.LayoutSkeleton {
   private PatternLayout patternLayout;
   PatternLayout PatternLayout {
      get { return patternLayout ?? (patternLayout = new PatternLayout(Pattern)); }
   }
public ExceptionLayoutExtended() {
   this.IgnoresException = false;
}

public String Pattern { get; set; }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the class must inherit from *LayoutSkeleton* base class, then I insert a property of type *PatternLayout*, we will see shortly how it will be used, for now notice that it use lazy construction to actually create the object only at first access, and it pass it a property called Pattern

This is written in C# 3.0, so I can use the short form to define properties. The core of the logging is in the Format() Method.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 1 override public void Format(TextWriter writer, LoggingEvent loggingEvent) {
 2    if (loggingEvent == null) {
 3       throw new ArgumentNullException("loggingEvent");
 4    }
 5    ;
 6    String header = String.Empty;
 7    writer.Write("\n-EXCEPTION EXTENDED LOG START");
 8    //writer.Write("\nBASE MESSAGE:" + loggingEvent.MessageObject);
 9    PatternLayout.Format(writer, loggingEvent);
10    Exception curEx = loggingEvent.ExceptionObject;
11  
12    while (curEx != null) {
13       writer.Write(header + "\nExceptionMessage:  ");
14       writer.Write(header + curEx.Message);
15       writer.Write(header + "\nExceptionType:    ");
16       writer.Write(header + curEx.GetType().FullName);
17 
18       writer.Write(header + "\nStackTrace:    ");
19       if (curEx.StackTrace != null) {
20          writer.Write(header + curEx.StackTrace.ToString());
21       }
22       curEx = curEx.InnerException;
23       if (curEx != null) {
24          writer.Write("\n" + header + "INNER EXCEPTION");
25          header += new string('-', 4);
26       }
27    }
28    writer.Write("\nEXCEPTION EXTENDED LOG END");
29 
30 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a very simple way to format the exception, first of all I write an header (line7) then I use the log4Net class *PatternLayout* to write a formatted header, then I begin to log some information from exception object. At each iteration I goes deeper into exception hierarchy dumping information for the *innerException* object, until I found a null innerExcception.

In the configuration file now I can use my new layout in this way

{{< highlight xml "linenos=table,linenostart=1" >}}
<appender name="ExceptionAppender" type="log4net.Appender.FileAppender">
   <param name="File" value="Exceptions.txt" />
   <param name="AppendToFile" value="true" />
   <layout type="mynamespace.ExceptionLayoutExtended, MyAssembly" >
      <param name="Pattern" value="%d - %exception% Detail:%m%newline" />
   </layout>
</appender>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I created a new appender of type FileAppender, the interesting part is in the layout property: I put my new layout class in type, and then I set a param of name Pattern with value  **%d – %exception% Detail:%m%newline.** With such a definition the log4net configurator look into my ExceptionLAyoutExtended class for a property named Pattern and set it with the value specified in the configuration. Into my layout class I simply use the base PatternLayout class to use the familiar and standard notation usable with log4Net.

[Code Sample](http://www.nablasoft.com/Alkampfer/Storage/_ExceptionLayoutExtended.zip)

Alk.

Tags: [log4Net](http://technorati.com/tag/log4Net) [Instrumentation](http://technorati.com/tag/Instrumentation)
