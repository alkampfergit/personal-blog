---
title: "Again on WebBrowser control in WPF and 64 bit issue"
description: ""
date: 2010-12-24T15:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I blogged some time ago on how to [disable Javascript errors in Web Browser](http://www.codewrecks.com/blog/index.php/2010/08/31/disable-javascript-error-in-wpf-webbrowser-control/) control in WPF, the core part is injecting a script inside the page to suppress errors.

But a problem arise when I use the browser in a 64 bit environment, because when it is time to inject script inside the HEAD element I got an error of invalid cast.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/12/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/12/image2.png)

An exception is raised because he could not cast elem to type HTMLHEadElementClass. Now I have 2 problems, the first is why in 64 it environment the MSHTML interop is changing the way it works returning me an object that implements a different set of COM interfaces, but I need also to know what kind of element I got in return asking for TagName (â€œHEADâ€).

Unfortunately the elem variable is of type  **\_\_ComObject** , and you could not query it for interfaces with reflection, to know what interface it implements. To accomplish this you need to know a little bit of COM and [read this article](http://fernandof.wordpress.com/2008/02/05/how-to-check-the-type-of-a-com-object-system__comobject-with-visual-c-net/). Basically you need to pass from IUnknown, and try to query it for every interface in MSHTML to find all COM interfaces implemented by that object. The first step is writing this code and running everything in 64 bit environment.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Debug.WriteLine(" ELEMENT:" + elem.outerHTML);
IntPtr ptr = Marshal.GetIUnknownForObject(elem);
Type[] alltype = Assembly.GetAssembly(typeof(HTMLHeadElementClass)).GetTypes();
foreach (Type type in alltype)
{
Guid iid = type.GUID;
if (!type.IsInterface || iid == Guid.Empty) continue;
 
IntPtr ipointer = IntPtr.Zero;
Marshal.QueryInterface(ptr, ref iid, out ipointer);
if (ipointer != IntPtr.Zero)
{
Debug.WriteLine("Support interface " + type.FullName);
}
}
{{< / highlight >}}

The above code dumps to debug console all interfaces belonging to MSHTML that are implemented by the object returned from the GetElementsByTagName/(â€œHEADâ€), here is the result.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Support interface mshtml.IHTMLElement
Support interface mshtml.DispHTMLStyle
Support interface mshtml.HTMLStyle
Support interface mshtml.DispHTMLRuleStyle
Support interface mshtml.HTMLRuleStyle
Support interface mshtml.DispHTMLRenderStyle
Support interface mshtml.HTMLRenderStyle
Support interface mshtml.DispHTMLCurrentStyle
Support interface mshtml.HTMLCurrentStyle
Support interface mshtml.IHTMLDOMNode
Support interface mshtml.IHTMLDOMNode2
Support interface mshtml.DispHTMLDOMAttribute
Support interface mshtml.HTMLDOMAttribute
Support interface mshtml.DispHTMLDOMTextNode
Support interface mshtml.HTMLDOMTextNode
Support interface mshtml.DispHTMLDOMImplementation
Support interface mshtml.HTMLDOMImplementation
Support interface mshtml.DispHTMLAttributeCollection
Support interface mshtml.HTMLAttributeCollection
Support interface mshtml.DispDOMChildrenCollection
Support interface mshtml.DOMChildrenCollection
Support interface mshtml.IHTMLElement2
Support interface mshtml.IHTMLElement3
Support interface mshtml.IHTMLElement4
Support interface mshtml.IHTMLElementRender
Support interface mshtml.IHTMLUniqueName
Support interface mshtml.DispHTMLDefaults
Support interface mshtml.HTMLDefaults
Support interface mshtml.DispHTCDefaultDispatch
Support interface mshtml.HTCDefaultDispatch
Support interface mshtml.DispHTCPropertyBehavior
Support interface mshtml.HTCPropertyBehavior
Support interface mshtml.DispHTCMethodBehavior
Support interface mshtml.HTCMethodBehavior
Support interface mshtml.DispHTCEventBehavior
Support interface mshtml.HTCEventBehavior
Support interface mshtml.DispHTCAttachBehavior
Support interface mshtml.HTCAttachBehavior
Support interface mshtml.DispHTCDescBehavior
Support interface mshtml.HTCDescBehavior
Support interface mshtml.DispHTMLGenericElement
Support interface mshtml.HTMLGenericElement
Support interface mshtml.DispHTMLStyleSheet
Support interface mshtml.HTMLStyleSheet
Support interface mshtml.DispHTMLLinkElement
Support interface mshtml.HTMLLinkElement
Support interface mshtml.DispHTMLFormElement
Support interface mshtml.HTMLFormElement
Support interface mshtml.DispHTMLTextElement
Support interface mshtml.HTMLTextElement
Support interface mshtml.DispHTMLImg
Support interface mshtml.HTMLImg
Support interface mshtml.DispHTMLBody
Support interface mshtml.HTMLBody
Support interface mshtml.DispHTMLFontElement
Support interface mshtml.HTMLFontElement
Support interface mshtml.DispHTMLAnchorElement
Support interface mshtml.HTMLAnchorElement
Support interface mshtml.DispHTMLLabelElement
Support interface mshtml.HTMLLabelElement
Support interface mshtml.DispHTMLListElement
Support interface mshtml.HTMLListElement
Support interface mshtml.DispHTMLUListElement
Support interface mshtml.HTMLUListElement
Support interface mshtml.DispHTMLOListElement
Support interface mshtml.HTMLOListElement
Support interface mshtml.DispHTMLLIElement
Support interface mshtml.HTMLLIElement
Support interface mshtml.DispHTMLBlockElement
Support interface mshtml.HTMLBlockElement
Support interface mshtml.DispHTMLDivElement
Support interface mshtml.HTMLDivElement
Support interface mshtml.DispHTMLDDElement
Support interface mshtml.HTMLDDElement
Support interface mshtml.DispHTMLDTElement
Support interface mshtml.HTMLDTElement
Support interface mshtml.DispHTMLBRElement
Support interface mshtml.HTMLBRElement
Support interface mshtml.DispHTMLDListElement
Support interface mshtml.HTMLDListElement
Support interface mshtml.DispHTMLHRElement
Support interface mshtml.HTMLHRElement
Support interface mshtml.DispHTMLParaElement
Support interface mshtml.HTMLParaElement
Support interface mshtml.DispHTMLElementCollection
Support interface mshtml.HTMLElementCollection
Support interface mshtml.DispHTMLHeaderElement
Support interface mshtml.HTMLHeaderElement
Support interface mshtml.DispHTMLSelectElement
Support interface mshtml.HTMLSelectElement
Support interface mshtml.DispHTMLOptionElement
Support interface mshtml.HTMLOptionElement
Support interface mshtml.DispHTMLInputElement
Support interface mshtml.HTMLInputElement
Support interface mshtml.DispHTMLTextAreaElement
Support interface mshtml.HTMLTextAreaElement
Support interface mshtml.DispHTMLRichtextElement
Support interface mshtml.HTMLRichtextElement
Support interface mshtml.DispHTMLButtonElement
Support interface mshtml.HTMLButtonElement
Support interface mshtml.DispHTMLMarqueeElement
Support interface mshtml.HTMLMarqueeElement
Support interface mshtml.IHTMLHeadElement
Support interface mshtml.DispHTMLHtmlElement
Support interface mshtml.HTMLHtmlElement
Support interface mshtml.DispHTMLHeadElement
Support interface mshtml.HTMLHeadElement
Support interface mshtml.DispHTMLTitleElement
Support interface mshtml.HTMLTitleElement
Support interface mshtml.DispHTMLMetaElement
Support interface mshtml.HTMLMetaElement
Support interface mshtml.DispHTMLBaseElement
Support interface mshtml.HTMLBaseElement
Support interface mshtml.DispHTMLIsIndexElement
Support interface mshtml.HTMLIsIndexElement
Support interface mshtml.DispHTMLNextIdElement
Support interface mshtml.HTMLNextIdElement
Support interface mshtml.DispHTMLBaseFontElement
Support interface mshtml.HTMLBaseFontElement
Support interface mshtml.DispHTMLUnknownElement
Support interface mshtml.HTMLUnknownElement
Support interface mshtml.DispCEventObj
Support interface mshtml.CEventObj
Support interface mshtml.DispHTMLScreen
Support interface mshtml.HTMLScreen
Support interface mshtml.DispHTMLWindow2
Support interface mshtml.HTMLWindow2
Support interface mshtml.DispHTMLWindowProxy
Support interface mshtml.HTMLWindowProxy
Support interface mshtml.DispHTMLDocument
Support interface mshtml.HTMLDocument
Support interface mshtml.DispHTMLEmbed
Support interface mshtml.HTMLEmbed
Support interface mshtml.DispHTMLAreasCollection
Support interface mshtml.HTMLAreasCollection
Support interface mshtml.DispHTMLMapElement
Support interface mshtml.HTMLMapElement
Support interface mshtml.DispHTMLAreaElement
Support interface mshtml.HTMLAreaElement
Support interface mshtml.DispHTMLTableCaption
Support interface mshtml.HTMLTableCaption
Support interface mshtml.DispHTMLCommentElement
Support interface mshtml.HTMLCommentElement
Support interface mshtml.DispHTMLPhraseElement
Support interface mshtml.HTMLPhraseElement
Support interface mshtml.DispHTMLSpanElement
Support interface mshtml.HTMLSpanElement
Support interface mshtml.DispHTMLTable
Support interface mshtml.HTMLTable
Support interface mshtml.DispHTMLTableCol
Support interface mshtml.HTMLTableCol
Support interface mshtml.DispHTMLTableSection
Support interface mshtml.HTMLTableSection
Support interface mshtml.DispHTMLTableRow
Support interface mshtml.HTMLTableRow
Support interface mshtml.DispHTMLTableCell
Support interface mshtml.HTMLTableCell
Support interface mshtml.DispHTMLScriptElement
Support interface mshtml.HTMLScriptElement
Support interface mshtml.DispHTMLNoShowElement
Support interface mshtml.HTMLNoShowElement
Support interface mshtml.DispHTMLObjectElement
Support interface mshtml.HTMLObjectElement
Support interface mshtml.DispHTMLParamElement
Support interface mshtml.HTMLParamElement
Support interface mshtml.DispHTMLFrameBase
Support interface mshtml.HTMLFrameBase
Support interface mshtml.DispHTMLFrameElement
Support interface mshtml.HTMLFrameElement
Support interface mshtml.DispHTMLIFrame
Support interface mshtml.HTMLIFrame
Support interface mshtml.DispHTMLDivPosition
Support interface mshtml.HTMLDivPosition
Support interface mshtml.DispHTMLFieldSetElement
Support interface mshtml.HTMLFieldSetElement
Support interface mshtml.DispHTMLLegendElement
Support interface mshtml.HTMLLegendElement
Support interface mshtml.DispHTMLSpanFlow
Support interface mshtml.HTMLSpanFlow
Support interface mshtml.DispHTMLFrameSetSite
Support interface mshtml.HTMLFrameSetSite
Support interface mshtml.DispHTMLBGsound
Support interface mshtml.HTMLBGsound
Support interface mshtml.DispHTMLStyleElement
Support interface mshtml.HTMLStyleElement
Support interface mshtml.DispHTMLPopup
Support interface mshtml.HTMLPopup
Support interface mshtml.DispHTMLAppBehavior
Support interface mshtml.HTMLAppBehavior
Support interface mshtml.OldHTMLDocument
Support interface mshtml.OldHTMLFormElement
Support interface mshtml.DispIHTMLInputButtonElement
Support interface mshtml.HTMLInputButtonElement
Support interface mshtml.DispIHTMLInputTextElement
Support interface mshtml.HTMLInputTextElement
Support interface mshtml.DispIHTMLInputFileElement
Support interface mshtml.HTMLInputFileElement
Support interface mshtml.DispIHTMLOptionButtonElement
Support interface mshtml.HTMLOptionButtonElement
Support interface mshtml.DispIHTMLInputImage
Support interface mshtml.htmlInputImage
{{< / highlight >}}

There are a lot of interfaces here, but one is interesting, HTMLBody and clearly I got no HTMLHEadElementClass :(. Since HTMLBody really have an appendChild method I can use that interface in 64 bit environment, but I really does not know why MSHTML has such a different behavior under 32 bit or 64 bit environments, but Iâ€™m now able to put a patch on my browser wrapper control.

{{< highlight csharp "linenos=table,linenostart=1" >}}
if (Is64BitMode())
{
HTMLBody head = (HTMLBody)elem;
head.appendChild((IHTMLDOMNode)script);
head.appendChild((IHTMLDOMNode)scriptErrorSuppressed);
}
else
{
//Appendo lo script all'head cosi Ã¨ attivo
HTMLHeadElementClass head = (HTMLHeadElementClass)elem;
head.appendChild((IHTMLDOMNode)script);
head.appendChild((IHTMLDOMNode)scriptErrorSuppressed);
}
{{< / highlight >}}

Now my code works even in 64 bit environments.

alk.
