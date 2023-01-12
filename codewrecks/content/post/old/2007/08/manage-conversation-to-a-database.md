---
title: "Manage conversation to a database"
description: ""
date: 2007-08-04T01:00:37+02:00
draft: false
tags: [Nhibernate,Sql Server]
categories: [Nhibernate,Sql Server]
---
When you begin to work with an ORM you encounter the concept of conversation, a conversation is the analogous of a transaction for database code, in a conversation I must be able to make a dialog to the ORM using the same context. In database there is no such concept, but I like it, and since sometimes I need to share nhibernate code and standard sql code in the same project I wish to be able to create a “conversation” that spans direct database access and nhibernate code. Basically a conversation has these properties

- All operation done into a conversation are transactional
- Inside a conversation Nhibernate share the same connection used by direct SQL code
- Inside a conversation I must use the same Nhibernate session.
- Code must be unaware of the presence of a conversation, this means that the code should not matter if we are in or outside a conversation

The first class I create is the Conversation,  a class that takes care of the creation of the connection, session, transaction and so on. This class should implement IDisposable so I can use the semantic of *using keyword* that is really useful.

publicclassConversation  :  IDisposable  {  
  
privateDbConnection  mConnection  =  null;  
privateDbTransaction  mTransaction  =  null;  
privateISession  mSession  =  null;  
privateBoolean  mIsDirty  =  false;  
  
internalvirtualDbConnection  Connection  {  
get  {return  mConnection  ??  (mConnection  =  CreateConnection());}  
        }  
  
internalvirtualDbTransaction  Transaction  {  
get  {return  mTransaction;}  
        }  
  
internalvirtualISession  Session  {  
get  {return  mSession  ??  (mSession  =  SessionManager.CreateNewSession(Connection));}  
        }

publicvirtualvoid  MarkDirty()  {  
              mIsDirty  =  true;  
        }  
  
publicvirtualvoid  Close()  {  
try  {  
if  (!mIsDirty)  
                          mTransaction.Commit();  
              }  
finally  {  
                    mTransaction.Dispose();  
                    Session.Dispose();  
                    mConnection.Dispose();  
              }  
        }  
  
publicvoid  Dispose()  {  
              Close();  
        }  
    }  
}

This class creates a connection when needed, it does the same thing with the Nhibernate session, using a session manager that inject code into nhibernate session. It is disposable, and when dispose is called the transaction will be committed if no one had called the *ISDirty()* method. If you want to rollback the conversation simply call *IsDirty()*  method and when the conversation will be closed, all operations will be rolled back. Now we need a static class called ConversationManager to keep track of the concept of “Current Conversation”

![External Image](https://www.codewrecks.com/blog/wp-content/uploads/2007/08/080407-0812-manageconve1.png)

BeginConversation() will return a conversation object and since it is diposable you can use code like this.

using  (Conversation  conv  =  ConversationManager.BeginConversation())  {  
//do  your  access  code  here  using conv.Transaction or conv.Session  
}

When code wants to access a database and wish to be enlisted in a Conversation, it should call *ConversationManager.GetConversation()*, this return a reference to the current conversation.

using  (Conversation  conversation  =  ConversationManager.GetConversation())  {  
//do  your  access  code  here  using conv.Transaction or conv.Session  
}

To make this code work The *GetConversation()* function in the ConversationManager class should not return a direct reference to the current conversation, because the caller code will dispose it before the conversation is really ended, so I use a weak reference.

publicclassConversationWeakReference  :  Conversation  {  
  
privateConversation  mOriginal;  
public  ConversationWeakReference  (Conversation  original)  {  
        mOriginal  =  original;  
  }  
  
publicoverride  System.Data.Common.DbConnection  Connection  {  
get  {return  mOriginal.Connection;}  
  }  
  
publicoverrideglobal::NHibernate.ISession  Session  {  
get  {return  mOriginal.Session;}  
  }  
  
publicoverride  System.Data.Common.DbTransaction  Transaction  {  
get  {return  mOriginal.Transaction;}  
  }  
  
protectedoverridevoid  Close()  {}  
}

As you can see this class Inherit from a Conversation and wraps the real Conversation, but override the CloseMethod with a no op method. This means that when a ConversationWeakReference gets disposed the real conversation still remain open. The key is in the GetConversation() method of the ConversationManager.

publicstaticConversation  GetConversation()  {  
Conversation  current  =  GetFromStorage();  
return  current  ==  null  ?  newConversation()  :  newConversationWeakReference(current);        
}

As you can notice the ConversationManager check if there is an active Conversation, and returns a new conversation or a new conversationWeakReference if there is an active conversation. With this trick if the caller is in a ConversationScope he will get a weak reference, but if the code is not in a conversation it will obtain a full conversation object that gets committed at the end of the scope. Real code has some more check but this is the general idea. Basically if we are not in a Conversation the code

using  (Conversation  conversation  =  ConversationManager.GetConversation())  {  
//do  your  access  code  here  using  conversation.Transaction  or  conversation.Session  
}

creates a new conversation that gets closed at the end of the scope, actually committing all work. But if the call chain is the following

using  (Conversation  conv  =  ConversationManager.BeginConversation())  {  
…  
//in  another  class  or  method  called    
  using  (Conversation  conversation  =  ConversationManager.GetConversation())  {  
//do  your  access  code  here  with  conversation  
  }  
  …  
//in  another  class  or  method  called    
  using  (Conversation  conversation  =  ConversationManager.GetConversation())  {  
//do  your  access  code  here  with  conversation  
  }  
}

The two inner using block will share the same conversation, accessed by two distinct ConnectionWeakReference. The good of this technique is that the inner code is unaware of the presence or absence of a conversation.

Final question is “where do you store the reference to the current conversation”? I use *System.Runtime.Remoting.Messaging.CallContext* because it can manage the concept of call context, and works well even in web scenario where the context will span a whole ASP.NET Request. If you dig with reflector in the HttpContext object you will end finding that the web context is stored in a CallContext.

Alk.
