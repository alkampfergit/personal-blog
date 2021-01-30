---
title: "Generate code with CodeDom"
description: ""
date: 2007-09-13T04:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Code generators are really useful because they could cut down the time needed to write tedious code. There are a very good code generator called CodeSmith, with an old version that is freeware, but it is possible to generate code with own code with the help of CodeDom. CodeDom namespace contains a lot of classes useful to define code that can be generated in various languages by a specific CodeDomProvider, let’s see an example.

classGenerator  {  
  
privateCodeNamespace  mNamespace;  
privateCodeTypeDeclaration  mTypeDeclaration;    
public  Generator()  {  
        mNamespace  =  newCodeNamespace(“MyNamespace”);  
        mTypeDeclaration  =  newCodeTypeDeclaration(“MyClass”);  
        mTypeDeclaration.IsClass  =  true;  
        mTypeDeclaration.Attributes  =  MemberAttributes.Public;  
        mNamespace.Types.Add(mTypeDeclaration);  
  }

I build a simple class called Generator, it contains a CodeNamespace and a CodeTypeDeclaration, in the constructor I create a namespace and then I define a class called MyClass. As you can see the CodeDom namespace provide a way for you to define namespace and classes without worrying of the language that will be used, let’s see how to define a property. First of all the code to generate a private field

CodeMemberField  objReference  =  newCodeMemberField(typeof(Person),  “mRoot”);  
objReference.Attributes  =  MemberAttributes.Private;  
mTypeDeclaration.Members.Add(objReference);

This is simple code, create a CodeMembertField giving the type of the data (Person is a simple class defined into the same assembly of the generator) and then you can refine the behavior of the field with the Attributes property, specifying that the field is private. Now it is time to create the wrapper property.

CodeMemberProperty  objProps  =  newCodeMemberProperty();  
objProps.Name  =  “Root”;  
objProps.Type  =  newCodeTypeReference(typeof(Person));  
objProps.Attributes  =  MemberAttributes.Public;  
objProps.GetStatements.Add(  
newCodeMethodReturnStatement(  
newCodeFieldReferenceExpression(  
newCodeThisReferenceExpression(),  “mRoot”)));  
objProps.SetStatements.Add(  
newCodeAssignStatement(  
newCodeFieldReferenceExpression(  
newCodeThisReferenceExpression(),  “mRoot”),    
newCodePropertySetValueReferenceExpression()));  
mTypeDeclaration.Members.Add(objProps);

Now things become more complicated. The major problem working with CodeDom is that the body of the various methods or properties must be written with no language in mind, so there is a lot of code, only to define a simple property. First of all we define a new CodeMemberProperty object, then specify the name and the type of the property and finally we must add the statements into the GetStatements or the SetStatements collection. These collection are special collection that can store object deriving from the base class CodeStatement, a class used to define a statement in.NET. The only instruction for the get part is a simple “return mRoot” in C#, but we need to create a *CodeMethodReturnStatement* a particular statement that return something. The constructor of this class accept a CodeExpression, in our situation we can simply use a CodeFieldReferenceExpression capable to store the concept of a reference to a field, this class accept two values: the first is a reference to an object, in our case a CodeThisReferenceExpression to specify “this” then we specify the name of the parameterâ€¦.whoaâ€¦quite a complex thing only to specify a single statement. The setter part is similar, but is more complex even if in C# we could write “mRoot = value”. We must use a CodeAssignStatement, then the same reference to the mRoot field and finally a CodePropertySetValueReferecenExpression that express the concept of the value part of a setter property.

At this point someone could really ask itself if codedom is really useful, the real usefulness is this.

privatevoid  GenerateAndDump(CodeDomProvider  provider)  {  
StringBuilder  sb  =  newStringBuilder();  
TextWriter  tw  =  newStringWriter(sb);  
  provider.GenerateCodeFromNamespace(mNamespace,  tw,  newCodeGeneratorOptions());  
  tw.Close();  
Console.WriteLine(sb.ToString());  
}

This is  a simple function that dump to console the namespace build with the preceding code, you can invoke this function in this way.

GenerateAndDump(newCSharpCodeProvider());  
GenerateAndDump(newVBCodeProvider());

This generates code in C# or in Vb from the same definition seen before. Quite an interesting thing for a code generator tool :D.

Alk.
