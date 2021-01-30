---
title: "Publish a project with ClickOnce via NANT and CCNet"
description: ""
date: 2009-06-18T05:00:37+02:00
draft: false
tags: [NET framework,Experiences]
categories: [NET framework,Experiences]
---
I have a project that needs to be published automatically through IIS directory, clickonce and CC.net machine. The easiest way to make this happens is to follow these simple instructions.

First of all goes into the machine where the CC.Net runs, prepare the IIS directory where the clickonce generated setup will be copied, open the solution into visual studio, goes to the project you want to publish and set everything needed for clickonce, set version to 1.0.0.0 and publish through visual studio IDE. This will create the folder structure in IIS and the application is published for the first time with the version number 1.0.0.0. Now take the publish.htm file and copy into the trunk of your project into a specific directory (I used Configuration\ClickOnce), rename it in OriginalPublish.htm, edit it and find the place where visual studio ide wrote the string 1.0.0.0, replace it with the string VERSIONNUMBERTOKEN.

This part is needed because msbuild is able to publish a clickonce enabled application, but it will not create the publish.htm file. Now create a target in nant, and inside it execute MsBuild against your project

{{< highlight xml "linenos=table,linenostart=1" >}}
<exec program="${MSBuild}"
        commandline="${ProjectDir}\Src\MyApp\MyApp.csproj" 
      basedir=".">
    <arg value="/target:publish" />
    <arg value="/p:Configuration=${BuildConfiguration}" />
    <arg value="/property:ApplicationVersion=${assembly.file.version}" />
    <arg value="/property:PublishUrl=http://10.8.0.5:10444/MyApp/" />
    <arg value="/Property:InstallUrl=http://10.8.0.5:10444/MyApp/" />
</exec>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I simply delegate to msbuild the task of publishing the application, specifiying the url used to distribute it. This task will create all needed click once files in the bin\debug\app.publish subdirectory of the project. Now you need to create the publis.htm file

{{< highlight xml "linenos=table,linenostart=1" >}}
<property name="clickOnePublishDir" value="${ProjectDir}\Src\MyApp\bin\${BuildConfiguration}\app.publish" />
<ReplaceTokenInFile 
    sourcefile="${ConfigurationDir}\ClickOnce\OriginalPublish.htm" 
    destfile="${clickOnePublishDir}\publish.htm" 
    token="VERSIONNUMBERTOKEN" 
    replacetoken="${assembly.file.version}" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This task takes the original publish.htm file and replace the token VERSIONNUMBERTOKEN, with the actual version number. The ReplaceTokenInFile task is c# code in nant script

{{< highlight xml "linenos=table,linenostart=1" >}}
    <script language="C#" prefix="FileOp" >

        <references>
            <include name="System.Dll"/>
        </references>
        <imports>
            <import namespace="NAnt.Core.Types"/>
        </imports>

        <code>
            <![CDATA[
          [TaskName("ReplaceTokenInFile")]
                public class ReplaceTokenInFile : Task {
                  #region Private Instance Fields

                  private string _sourceFile;
                        private string _destFile;
                        private string _token;
                        private string _replaceToken;
                  #endregion Private Instance Fields

                  #region Public Instance Properties

                  [TaskAttribute("sourcefile", Required=true)]
                  public string SourceFile {
                      get { return _sourceFile; }
                      set { _sourceFile = value; }
                  }

                  [TaskAttribute("destfile", Required=true)]
                  public string DestFile {
                      get { return _destFile; }
                      set { _destFile = value; }
                  }
                        [TaskAttribute("token", Required=true)]
                  public string Token {
                      get { return _token; }
                      set { _token = value; }
                  }
                        [TaskAttribute("replacetoken", Required=true)]
                  public string ReplaceToken {
                      get { return _replaceToken; }
                      set { _replaceToken = value; }
                  }
                  #endregion Public Instance Properties

                  #region Override implementation of Task

                  protected override void ExecuteTask() {
                      String source = System.IO.File.ReadAllText(SourceFile);
                            source = source.Replace(Token, ReplaceToken);
                            System.IO.File.WriteAllText(DestFile, source);
                            String message = "Replace token" + Token + " in file " + SourceFile + " with token " + ReplaceToken + " and saved into " + DestFile;
                             Log(Level.Info, message);
                  }
                  #endregion Override implementation of Task
                }

      ]]>
        </code>
    </script>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you can simply copy all the files into the folder where IIS maps the publishUrl and the game is done.

{{< highlight xml "linenos=table,linenostart=1" >}}
<copy todir="${ClickOnceDir}">
    <fileset basedir="${ProjectDir}\Src\MyApp\bin\${BuildConfiguration}\app.publish">
        <include name="**" />
    </fileset>
</copy>  {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The advantage of this approach, is that I can reuse the automatic version numbering I use in my CC.Net machine,  and at each checkin I have an automatically publish of new version of the application that my testers can use. Clearly for a software in production this action must be run manually only with stable and tested builds.

If you do not like deploying at each checkin you can simply schedule this action to run periodically, but the important stuff is that now everything is automatic and you can update clickonce application with a single click.

alk.

Tags: [Continuos Integration](http://technorati.com/tag/Continuos%20Integration) [Click Once](http://technorati.com/tag/Click%20Once)
