---
title: "Nunit fluent some details"
description: ""
date: 2008-02-05T02:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
In old post I spoke about one little library to easy the use of nunit assertion with fluent interface. All the game is done with a MyConstraintBuilder class that offers some basic properties and methods to build the assert expression. Internally I use a stack to store all the constraint

privateStack&lt;Constraint&gt;  constraints  =  newStack&lt;Constraint&gt;();

this permits me to create simple fluent interface in this way.

publicMyConstraintBuilder  Or  {  
get  {  
        constraints.Push(newOrOperator());  
returnthis;  
  }  
}

That one push into the stack an OrOperator, now the OrOperator descends from BinaryOperator, so the builder knows that the object has two properties called *LeftConstraint* and *RightConstraint* that are used to set the left and right constraint at execution time. The trick is that the caller use empty BinaryOperator during the build of the expression, the left and right constraint are the preceding and the following in the stack of Constraints. All the properties return *this* so the caller can continue to add constraint. The core of the execution is a couple of class that converts from infix expression to postfix expression. When all the constraints are in postfix form, the execution is in fact really simple.

publicstaticimplicitoperatorConstraint(MyConstraintBuilder  cnstr)  {  
  
ExpressionConverter&lt;Constraint&gt;  converter  =  newExpressionConverter&lt;Constraint&gt;(  
newConstraintOperatorChecker());  
PostfixConstraintExecutor  executor  =  newPostfixConstraintExecutor();  
List&lt;Constraint&gt;  list  =  newList&lt;Constraint&gt;();  
  list.AddRange(cnstr.constraints);  
  list.Reverse();  
IList&lt;Constraint&gt;  postfix  =  converter.InfixToPostfix(list);  
return  executor.ResolveExpression(postfix);

As you can see I create a ExpressionConverter for Constraint object passing a new instance of ConstraintOperatorChecker, that is responsible to tell to the algorithm if a constraint is unary, binary or is a value. Next I simple create a PostfixConstraintExecutor, reverse the stack into a list and feed it into the expression converter, then I resolve the expression with the postfix executor, the result is a single constraint that can be executed by nunit. Thanks to the postfix notation the ResolveExpression is a breeze to write

publicConstraint  ResolveExpression(IList&lt;Constraint&gt;  expression)  {  
Stack&lt;Constraint&gt;  stack  =  newStack&lt;Constraint&gt;();  
StringBuilder  errors  =  newStringBuilder();  
foreach  (Constraint  constraint  in  expression)  {  
if  (constraint  isBinaryOperator)  {  
BinaryOperator  binop  =  constraint  asBinaryOperator;  
Constraint  right  =  stack.Pop();  
Constraint  left  =  stack.Pop();  
                    stack.Push(binop.SetConstraint(left,  right));  
              }  elseif  (constraint  isUnaryOperator)  {  
Debug.Assert(stack.Count  &gt;  0,  “trying  to  apply  an  unary  constraint  on  a  null  object”);  
UnaryOperator  unop  =  constraint  asUnaryOperator;  
                    stack.Push(unop.SetConstraint(stack.Pop()));  
              }  
else  {  
                    stack.Push(constraint);  
              }  
        }  
return  stack.Pop();  
  }  
}

If the constraint is a BinaryOperator we need to pop two element from the stack, and assign to left and right constraint of the binary operator, if is an UnaryOperator we need  to pop only an element, and finally if is a simple constraint we push again in the stack. At the end of the process in *stack* variable remains only the composite constraint. If you are interested here is the function that convert the infix notation to posfix notation

publicIList&lt;T&gt;  InfixToPostfix(IEnumerable&lt;T&gt;  expression)  {  
  
Stack&lt;T&gt;  stack  =  newStack&lt;T&gt;();  
List&lt;T&gt;  result  =  newList&lt;T&gt;();  
foreach  (T  token  in  expression)  {  
if  (opChecker.IsBinaryOperator(token))  {  
while  (  
                          stack.Count  &gt;  0  &&  
                          !opChecker.IsOpenBracket(stack.Peek())  &&  
                          opChecker.OperatorAHasMorePrecedenceThanB(stack.Peek(),  token))  {  
                          result.Add(stack.Pop());  
                    }  
                    stack.Push(token);  
              }  elseif  (opChecker.IsUnaryOperator(token))  {  
                    stack.Push(token);  
              }  
elseif  (opChecker.IsClosedBracket(token))  {  
while  (stack.Count  &gt;  0  &&    
                          !opChecker.IsOpenBracket(stack.Peek()))  {  
                          result.Add(stack.Pop());        
                    }  
                    stack.Pop();  
              }  
elseif  (opChecker.IsOpenBracket(  token))  {  
                    stack.Push(token);  
              }  
else  {  
                    result.Add(token);  
//We  found  an  element,  apply  all  the  unary  operator  find  until  now.  
while  (stack.Count  &gt;  0  &&  opChecker.IsUnaryOperator(stack.Peek()))  
                          result.Add(stack.Pop());  
              }  
        }  
//This  one  is  for  operation  not  fully  bracketed  
while  (stack.Count  &gt;  0)  
              result.Add(stack.Pop());  
return  result;  
  }  
}

It is the standard routine, the only difference is that I build the conversion object passing an object that implement the IOperatorsChecker Interface. In this way I can use the routine for a generic type T, and this permits me to convert standard numeric notation, or a notation expressed by a IList&lt;Constraint&gt; that is the one I used into the MyConstraintBuilder.

publicinterfaceIOperatorsChecker&lt;T&gt;  {  
  
Boolean  IsBinaryOperator(T  token);  
  
Boolean  IsUnaryOperator(T  token);  
Boolean  OperatorAHasMorePrecedenceThanB(T  a,  T  b);  
Boolean  IsOpenBracket(T  token);  
Boolean  IsClosedBracket(T  token);  
}

That is all you need to know to build a fluent interface to express NUnit constraint with an infix notation.

Alk.
