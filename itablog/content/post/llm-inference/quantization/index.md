---
title: "LLM locali, benchmark, quantizzazione e sensazionalismo"
date: 2026-09-02
draft: false
categories: ["AI"]
tags: ["llm", "modelli locali"]
description: "Perché bisogna sempre mettere una 'tara' alle affermazioni sensazionalistiche che talvolta troviamo in giro sul far girare modelli locali."
summary: |
  I benchmark possono far sembrare un modello locale equivalente ai modelli più potenti, ma indipendentemente dalla bontà dei benchmark stessi, spesso leggendo articoli che iniziano con 'ho fatto girare un modello locale che ha le stesse capacità di Opus su 8 GB di VRAM' è necessario poi capire quale versione quantizzata realmente viene fatta eseguire.
---

## Modelli LLM e quantizzazione

Ultimamente Linkedin e la rete in generale sono pieni di contenuti un po sensazionalistici del tipo: come ho fatto girare un modello locale che ha la stessa capacità di Opus su 8 GB di VRAM.

Non è tutto oro quello che luccica, e sebbene si stiano facendo molti passi avanti e l'inferenza locale sia possibile, è necessario come sempre fare chiarezza al fine di non creare false aspettative, e fare una comuncazione corretta.

## Benckmark di modelli

**I benchmark non sono oro colato**, danno l'idea di quanto un modello sia "capace" ma non sono poi direttamente confrontabili con l'esperienza quotidiana. Il test di cui si parla spesso compara Qwen3.8-27B (un modello denso di soli 27 miliardi di parametri) e sembra stabilire che in modalità xHigh possa confrontarsi con Opus 5 con minimo livello di ragionamento.

Questo risultato è comunque impressionante comunque lo si voglia vedere. Se volete vedere un po di numeri potete [dare uno sguardo a questo link](https://artificialanalysis.ai/models/qwen3-8-27b) che mostra molti dettagli sul modello.

In [LM arena](https://arena.ai/leaderboard/text?q=Qwen+3.8&utm_source=chatgpt.com) è in posizione 89, per cui non è sicuramente nelle posizioni alte. Ma ragazzi, è sempre un modello di 27B.

## Quantizzazione

Ora permettetemi di fare un po di chiarezza, questi benchmark spesso sono fatti sul modello originale, NON quantizzato, per cui, se dite "ho fatto girare un modello che ha capacità di Opus su 8 GB di VRAM", probabilmente state un po esagerando. Qwen quando effettua test del proprio modello, sicuramente lo fa con il modello originale. Per benchmark di terze parti, controllate sempre la versione che viene eseguita.

Il modello tra l'altro **non è eguale ad opus in tutti i benchmark, in qualche benchmark in modalità xHigh si avvicina alla versione più bassa di opus**, per cui è sempre necessario dare un contesto. Per raggiungere risultati migliori genera tanti piu token intermedi solitamente, ma comunque su tutto va poi a pesare la quantizzazione.

Il modello nativamente ha i pesi scritti in floating point 16 bit, alcuni sono in FP16 altri in BF16, in generale sono quindi numeri con la virgola ed il range rappresentabile è molto ampio. In questo scenario la maggior parte dei modelli non potrebbe essere eseguito in una normale GPU, per mancanza di VRAM. Per questa ragione si effettua una quantizzazione, ovvero si va a ridurre il numero di bit utilizzati per ogni peso.

La tecnica è semplice, è dimostrato empiricamente che il numero dei parametri di un modello è importante più della precisione dei pesi, per questa ragione, se invece di utilizzare un numero BF16 (Qwen 3,8) per ogni peso utilizziamo un numero intero 8 bit otteniamo una notevole riduzione della RAM utilizzata senza perdere troppo in termini di capacità del modello.

Il problema è che **quantizzare significa approssimare**, significa che molti valori dei pesi verranno approssimati, per cui **il modello quantizzato non è più lo stesso modello originale**, e quindi non è detto che abbia le stesse capacità.

Il problema è ancora piu complesso perchè non tutti i pesi sono eguali e soprattutto, utilizzare un byte per ogni peso genera modelli ancora troppo grandi per essere eseguiti in consumer hardware, per cui bisogna quantizzare in modo ancora più aggressivo.

## Quantizzazzioni specifiche 

Quando noi quantizziamo la modalità più semplice è questa, abbiamo 8 bit, quindi 256 possibili valori, prendiamo il range di valori originali, associamo al valore minimo il numero 0, al valore massimo il numero 255 e stabiliamo un coefficiente di scala per tutti gli altri valori. Facciamo un esempio:

Quando noi quantizziamo la modalità più semplice è questa, abbiamo 8 bit, quindi 256 possibili valori, prendiamo il range di valori originali, associamo al valore minimo il numero 0, al valore massimo il numero 255 e stabiliamo un coefficiente di scala per tutti gli altri valori. Facciamo un esempio:

Supponiamo di avere un insieme di pesi con valori compresi tra -2.5 (minimo) e 3.1 (massimo). 

Il range totale è:

```
range = 3.1 - (-2.5) = 5.6
```

Con 8 bit abbiamo 256 valori possibili (da 0 a 255), quindi il coefficiente di scala è:

```
scala = range / 255 = 5.6 / 255 ≈ 0.02196
```

A questo punto:

- al valore -2.5 associamo l'intero 0
- al valore 3.1 associamo l'intero 255
- ogni altro valore x viene quantizzato con la formula:

```
q = round((x - min) / scala)
```

Proviamo con un valore intermedio, ad esempio x = 1.0:

```
q = round((1.0 - (-2.5)) / 0.02196) = round(3.5 / 0.02196) = round(159.4) = 159
```

Quindi il valore originale 1.0 viene rappresentato dall'intero **159** (che sta comodamente in 8 bit, tra 0 e 255).

Se poi vogliamo "de-quantizzare" per tornare a un valore approssimato in virgola mobile:

```
x_ricostruito = min + q × scala = -2.5 + 159 × 0.02196 ≈ 0.9917
```

Si vede quindi l'errore di quantizzazione: il valore originale era 1.0, quello ricostruito è 0.9917, con una perdita di circa 0.008 — questo è il prezzo che paghiamo per comprimere i valori da 16 bit (floating point) a soli 8 bit.

Nella realtà la quantizzazione dei modelli è molto più complessa, soprattutto perché, se consideriamo tutti i pesi, potremmo avere problemi nel caso di valori che sono molto più grandi o molto più piccoli della media, facciamo un esempio.

## Effetto di un outlier sulla quantizzazione

Vediamo cosa succede se, tra i valori da quantizzare, c'è un outlier: un valore molto più grande o piu piccolo degli altri. Prendiamo questi 10 valori, dove 9 sono vicini a 1 e uno è molto più grande (50):

```
1.00, 1.20, 0.90, 1.10, 1.05, 0.95, 1.15, 1.00, 0.98, 50.00
```

min = 0.90, max = 50.00, quindi range = 49.10 e scala = 49.10 / 255 ≈ 0.1925

Quantizzando e poi ricostruendo ogni valore otteniamo:

| valore originale | q (0-255) | valore ricostruito | errore assoluto | errore % |
|---|---|---|---|---|
| 1.00 | 1 | 1.0925 | 0.0925 | 9.25% |
| 1.20 | 2 | 1.2851 | 0.0851 | 7.09% |
| 0.90 | 0 | 0.9000 | 0.0000 | 0.00% |
| 1.10 | 1 | 1.0925 | 0.0075 | 0.68% |
| 1.05 | 1 | 1.0925 | 0.0425 | 4.05% |
| 0.95 | 0 | 0.9000 | 0.0500 | 5.26% |
| 1.15 | 1 | 1.0925 | 0.0575 | 5.00% |
| 1.00 | 1 | 1.0925 | 0.0925 | 9.25% |
| 0.98 | 0 | 0.9000 | 0.0800 | 8.16% |
| 50.00 | 255 | 50.0000 | 0.0000 | 0.00% |

Si vede subito il problema: i 9 valori "normali" occupano solo i livelli interi da 0 a 2 su 256 disponibili, perché l'outlier a 50 costringe la scala a coprire un range enorme (49.1) invece di uno piccolo. Il risultato è che quei valori vicini a 1 vengono schiacciati in pochissimi bucket, con errori percentuali anche del 9%, mentre l'outlier stesso viene rappresentato perfettamente (finisce esattamente su 255).

Per confronto, se togliamo l'outlier e quantizziamo solo i 9 valori normali (range 0.9–1.2, scala ≈ 0.00118), gli errori diventano trascurabili (praticamente zero, al massimo ~0.0006):

```
1.00 -> 1.0000  (errore 0.00000)
1.20 -> 1.2000  (errore 0.00000)
0.90 -> 0.9000  (errore 0.00000)
1.10 -> 1.1000  (errore 0.00000)
1.05 -> 1.0506  (errore 0.00059)
0.95 -> 0.9494  (errore 0.00059)
1.15 -> 1.1494  (errore 0.00059)
1.00 -> 1.0000  (errore 0.00000)
0.98 -> 0.9800  (errore 0.00000)
```

Questo è esattamente il motivo per cui **gli outlier sono un problema serio nella quantizzazione**: un singolo valore anomalo "allarga" il range e degrada la precisione di tutti gli altri valori, perché lo stesso coefficiente di scala deve coprire sia i valori normali sia quello estremo. È anche il motivo per cui tecniche come i K-quants (o altre come il clipping, la quantizzazione per canale, o l'esclusione degli outlier) esistono: servono proprio a evitare che pochi valori estremi rovinino la precisione di tutto il resto.

## Conclusione

Nella realtà i metodi di quantizzazione sono molto più complessi, appunto per tollerare outliers, e soprattutto alcune parti del modello potrebbero comunque rimanere non quantizzate. Inoltre non solamente si quantizzano i pesi ma anche la cache KV che rappresenta i valori intermedi della rete, e quindi anche in questo caso la quantizzazione può avere un impatto sulle prestazioni del modello.

Quello che ci portiamo a casa è che, comunque, **un modello quantizzato non è lo stesso modello originale** e quindi, ogni volta che vediamo una affermazione che dice: facciamo girare un modello che ha le stesse capacità di Opus su 8 GB di VRAM, facciamo tutte le dovute considerazioni del caso. Dico questo perché poi troviamo persone che prendendo una GPU da 8 GB poi vedono le loro aspettative deluse, e concludono quindi che i modelli locali non sono utili.

Deduzione che **non è assolutamente vera**, ma va messo tutto nel giusto contesto, contesto che spesso è assente o omesso perché oramai si cerca il click sul post e quindi il titolo deve essere il piu "sensazionale" possibile.


