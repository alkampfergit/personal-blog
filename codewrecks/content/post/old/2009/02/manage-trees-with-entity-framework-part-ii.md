---
title: "Manage trees with entity framework part II"
description: ""
date: 2009-02-28T08:00:37+02:00
draft: false
tags: [Enterprise Library]
categories: [Enterprise Library]
---
[Manage Tree With Entity Framework – The basic](http://www.codewrecks.com/blog/index.php/2009/02/27/manage-trees-with-entity-framework/)

One of the most obvious problem showed in previous post is the need to issue a single Select for each node to rebuild the tree, but the good thing is that there are a lot of solutions over there to solve this problem. One of the most interesting technique was developed by [Joe Celko](http://www.celko.com/), first of all I added two field to the table, one field is named * **hierarchyLevel** *and the other is named * **fullpath** *, then I setup a couple of triggers.

Both triggers manages these two columns, the first fire on insert

{{< highlight csharp "linenos=table,linenostart=1" >}}
ALTER TRIGGER [dbo].[trg_EmployeeInsert] ON [dbo].[Employee] FOR INSERT
AS 
BEGIN
    DECLARE @numrows int
    SET @numrows = @@ROWCOUNT
    if @numrows > 1 
    BEGIN
        RAISERROR('Only single row insertion is supported', 16, 1)
        ROLLBACK TRAN
    END
    ELSE    
    BEGIN
        UPDATE 
            E
        SET
            hierarchyLevel    = 
            CASE 
                WHEN E.parentId IS NULL THEN 0
                ELSE Parent.hierarchyLevel + 1
            END,
            fullPath = 
            CASE
                WHEN E.parentId IS NULL THEN '.'
                ELSE Parent.fullPath 
            END + CAST(E.id AS varchar(10)) + '.'
            FROM
                Employee AS E
            INNER JOIN
                inserted AS I ON I.id = E.id
            LEFT OUTER JOIN
                Employee AS Parent ON Parent.id = E.parentId
    END
END{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is really simple, for each node that I insert into the table it simply finds the parent and updates hierarchylevel and fullpath accordingly. The other trigger updates a whole subtree during an update of the parentId property

{{< highlight csharp "linenos=table,linenostart=1" >}}
ALTER TRIGGER [dbo].[trg_EmployeeUpdate] ON [dbo].[Employee] FOR UPDATE
AS 
BEGIN
  IF @@ROWCOUNT = 0 
        RETURN
    if UPDATE(parentid) 
    BEGIN
        UPDATE
            E
        SET
            hierarchyLevel    = 
                E.hierarchyLevel - I.hierarchyLevel + 
                    CASE 
                        WHEN I.parentId IS NULL THEN 0
                        ELSE Parent.hierarchyLevel + 1
                    END,
            fullPath = 
                ISNULL(Parent.fullPath, '.') +
                CAST(I.id as varchar(10)) + '.' +
                RIGHT(E.fullPath, len(E.fullPath) - len(I.fullPath))
            FROM
                Employee AS E
            INNER JOIN
                inserted AS I ON E.fullPath LIKE I.fullPath + '%'
            LEFT OUTER JOIN
                Employee AS Parent ON I.parentId = Parent.id
    END

END{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Et voilà, with this simple solution you will solve a lot of problems, first of all these two extra fields are completely transparent to the application because all the work is made by the two triggers, the next step is to update the model, and finally modify the two extra properties to have private setter, to avoid update to the additional columns.

With this new structure here is the code to load the whole subtree from a node.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
Employee root = context.Employee.Where(e => e.Parent == null).First();
IList<Employee> childs = context.Employee
  .Where(e => e.fullPath.StartsWith(root.fullPath))
  .OrderBy(e => e.fullPath)
  .ToList();
foreach (Employee child in childs)
{
   Console.WriteLine("{0}{1}", new String('-', child.hierarchyLevel.Value), child.Name);
}
Console.WriteLine("print tree recursively.");
PrintNoLoad(root, 0);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thansk to the *fullPath* property each descendant of a given node can be find simply with the condition * **fullPath.StartsWith(root.fullPath)** *and the beautiful thing is that *you need only a single SELECT* *to find all descendant nodes* ;). To make things more interesting, Entity Framework resolves all references for you, this means that the whole tree structure is reconstructed in memory, you can verify this with the *PrintNoLoad* function that print the whole subtree recursively.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static void PrintNoLoad(Employee employee, Int32 level)
{
   Console.WriteLine("{0}{1}", new String('-', level), employee.Name);
   foreach (Employee child in employee.Childs)
   {
      PrintNoLoad(child, level + 1);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This function differs from the old Print routine because it does not check the * **employee.Childs.IsLoaded** *condition because it is evaluated to False even if the childs are already loaded. This happens because EF had not explicitly loaded all the childs for tree nodes. We are sure that all descendants are loaded because of the fullpath column, but EF could not know it, so it consider the collection "not loaded" and if you check it you still ends with the N select. As you can verify in the following image, the IsLoaded property is false, but the collection of childs contains all the elements. We are sure that this node contains only 2 nodes because we loaded all nodes whose fullpath starts with the root path, so we did not miss any node.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image-thumb8.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image8.png)

Thus if you use the fullpath trick, be sure not to explicitly load again references. To make everything clearer you can create a method * **LoadSubtree** *with partial class to shield the user from a deep knowledge of the fullpath structure.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public partial class Employee
{
   public void LoadSubtree(TestEntities context)
   {
      context.Employee
        .Where(e => e.fullPath.StartsWith(this.fullPath))
        .ToList();
   }

...

using (TestEntities context = new TestEntities())
{
   Employee root = context.Employee.Where(e => e.Parent == null).First();
   root.LoadSubtree(context);
   PrintNoLoad(root, 0);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you can simply call LoadSubtree to issue only one select that will load all descendants of a node :D. Update of nodes is a breeze thanks to the trigger, if you run this code

{{< highlight CSharp "linenos=table,linenostart=1" >}}
Employee daniele = context.Employee.Where(e => e.Name == "Daniele").First();
Employee guardian = context.Employee.Where(e => e.Name == "Guardian").First();
daniele.Parent = guardian;
context.SaveChanges();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

you will obtain this output if you the tree before and after the update

{{< highlight csharp "linenos=table,linenostart=1" >}}
Original Tree
Alkampfer
-Guardian
--Peppe
--Giuseppe
-Daniele
--Fabio
Tree after update
Alkampfer
-Guardian
--Daniele
---Fabio
--Peppe
--Giuseppe{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image-thumb9.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image9.png)

As you can see, moving Daniele under the Guardian node correctly moved the whole subtree, the hierarchyLevel and the fullpath are correct thanks to the trigger.

You can also find the root with this method.

{{< highlight xml "linenos=table,linenostart=1" >}}
public Employee GetRoot(TestEntities context)
{
   String rootId = fullPath.Substring(1, fullPath.IndexOf('.', 1) - 1);
   return context.LoadByKey<Employee>(Int32.Parse(rootId));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It consists of a single query ;) and immediately find the root without the need to traverse the tree. You can also find all nodes that are sons of the same father.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public List<Employee> GetSiblings(TestEntities context)
{
   String parentPath = fullPath.Substring(0, fullPath.LastIndexOf('.', fullPath.Length - 2)); 
   return context.Employee
     .Where(e => e.fullPath.StartsWith(parentPath) && e.hierarchyLevel == hierarchyLevel)
     .ToList();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Each operation consists of only one query, and if you put an index on the fullpath column you can expect high speed tree operation ;).

Alk.

Tags: [Entity Framework](http://technorati.com/tag/Entity%20Framework) [.NET Framework](http://technorati.com/tag/.NET%20Framework) [Trees](http://technorati.com/tag/Trees)
