---
title: "Esempio copertina"
date: 2026-03-15
draft: false
categories: ["generale"]
tags: ["hugo"]
description: "Come aggiungere nei post italiani un blocco grafico con titolo, dettaglio e immagine."
summary: |
  Ho aggiunto uno shortcode Hugo per creare una copertina con titolo, dettaglio e immagine.
  In questa versione l'immagine vive nella sottocartella images del post, come risorsa del page bundle.
---

Questo post serve da esempio reale per un widget riusabile nella parte italiana del blog. Nel markdown devi solo indicare titolo, dettaglio e immagine, mentre il resto viene gestito lato UI.

## Come si usa nel markdown

Il post è un **page bundle**, quindi la struttura corretta è questa:

```text
content/post/general/esempio-copertina/
|-- index.md
`-- images/
    `-- catcyber.jpg
```

Nel markdown basta scrivere questo shortcode:

```go-html-template
{{</* copertina
  titolo="Gatti Hacker, un rischio reale?"
  dettaglio="Se nel browser che utilizza il vostro gatto vedete cose come Kali Linux, potreste avere un problema serio"
  immagine="catcyber.jpg"
  alt="Un gatto illustrato"
*/>}}
```

Lo shortcode cerca il file direttamente nelle risorse del post, quindi può trovarlo in automatico dentro la cartella images.

## Esempio renderizzato

{{< copertina
  titolo="Gatti Hacker, un rischio reale?"
  dettaglio="Se nel browser che utilizza il vostro gatto vedete cose come Kali Linux, potreste avere un problema serio"
  immagine="catcyber.jpg"
  alt="Un gatto illustrato"
>}}

## Come l'ho implementato

Lo shortcode sta nel file `layouts/shortcodes/copertina.html` e fa tre cose:

1. valida i parametri obbligatori;
2. recupera l'immagine come risorsa del post;
3. emette HTML minimale, lasciando il lavoro grafico al CSS.

La parte visiva è in `static/css/site.css`, nel blocco dedicato al widget. Il componente resta piccolo: titolo sopra, dettaglio a lato dell'immagine, niente elementi editoriali superflui.
