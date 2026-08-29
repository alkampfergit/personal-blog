---
title: "Memoria, CPU e registri: le basi dell'inferenza LLM"
date: 2026-08-18
draft: false
categories: ["llm-inference"]
tags: ["llm", "inferenza", "cpu", "memoria"]
description: "Come registri, cache e memoria principale influenzano le prestazioni di CPU e GPU nell'inferenza dei modelli LLM."
summary: |
  Per capire perché una GPU è più efficiente di una CPU nell'inferenza LLM bisogna partire dalla gerarchia della memoria: registri, cache e RAM hanno capacità, costi e velocità differenti.
---

# Memoria CPU e registri

Se vogliamo capire perchè una GPU funziona meglio di una CPU per l'inferenza di modelli LLM, e quali sono le variabili che influenzano le prestazioni, dobbiamo inevitabilmente partire dalle basi. 

Un computer è composto da varie componenti, iniziamo a parlare di Memoria e Unità computazionali. La memoria è sostanzialmente "dove" teniamo i nostri dati, mentre le unità computazionali sono capaci di elaborare i nostri dati, essenzialmente trasformandoli con varie operazioni.

La rappresentazione dei nostri dati è binaria, ovvero una sequenza di 1 e 0 ovvero una sequenza di bit, e solitamente sono organizzati in gruppi di bit, sempre multipli di 2, che permettono di identificare varie tipologie di dati. Quindi possiamo individuare

4 bit - nibble
8 bit - byte
16 bit - word
32 bit - double word
64 bit - quad word

Solitamente ci fermiamo a 64 bit anche se potremmo andare oltre, e la ragione è perche i processori moderni hanno registri a 64 bit. Ma cosa è un registro? Un registro è una sorta di memoria interna al processore, ed è speciale perché il processore è in grado di eseguire operazioni sui dati che sono contenuti nei registri. Solitamente quindi quando vogliamo fare una operazione semplice, come un addizione, dobbiamo prendere i dati, spostarli nei registri ed eseguire l'operazœone stessa. 

> Durante l'esecuzione di un programma quindi, a grandi linee, noi spostiamo dati dalla memoria principale ai registri, eseguiamo operazioni sui registri e poi spostiamo i dati nuovamente in memoria.

# Differenti tipi di memoria

La memoria si divide in molti tipologie, ma sicuramente abbiamo una distinzione principale tra memoria volatile e memoria non volatile. La memoria volatile è quella che viene persa quando il computer viene spento, mentre quella non volatile è persistente. Di base la memoria non volatile non ha bisogno di una continua alimentazione elettrica per mantenere i dati. 

La differenza di velocità tra questi due tipi di memorie storicamente era molto, molto elevata, ma con gli SSD moderni la differenza si è ridotta molto, anche se, a tutti gli effetti, è ancora sicuramente sensibile.

Per quanto riguarda la memoria volatile, abbiamo veramente tantissime tiplogie, e sicuramente avrete sentito parlare di RAM e VRAM (Sulle GPU). In realtà la VRAM è una tipologia di RAM, e la differenza principale è che la VRAM è ottimizzata per essere utilizzata dalle GPU, quindi per onore del vero possiamo parlare solamente di RAM.

Qui abbiamo poi la DRAM (Dynamic RAM) e la SRAM (Static RAM). La DRAM è la tipologia di RAM più diffusa, ed è quella che troviamo nei nostri computer. La SRAM invece è più veloce della DRAM, ma anche molto più costosa, per cui nei nostri computer troviamo essenzialmente DRAM. la VRAM delle nostre GPU è sempre una DRAM, per cui possiamo generalizzare dicendo che nei nostri computer tutto quello che è RAM è DRAM. 

Consideriamo quindi una operazione di addizione tra due numeri, e supponiamo che questi due numeri siano memorizzati in memoria principale. Per eseguire l'addizione dobbiamo spostare i due numeri nei registri, eseguire l'addizione e poi spostare il risultato nuovamente in memoria principale. Ora consideriamo che dopo l'addizione dobbiamo eseguire una ulteriore operazione su uno dei due numeri, e quindi dobbiamo spostare nuovamente il numero in memoria principale, per poi spostarlo nuovamente nei registri per eseguire l'operazione. Questa operazione di spostamento è comunque lenta, la DRAM ha una sua velocità che non è infinita.

Per questa ragione i processori moderni hanno una memoria cache, che è una memoria molto più veloce della DRAM, e che viene utilizzata per memorizzare i dati che vengono utilizzati più frequentemente. La cache è organizzata in vari livelli, L1, L2 e L3, e la differenza principale tra questi livelli è la velocità e la dimensione. La cache L1 è la più veloce e la più piccola, mentre la cache L3 è la più lenta e la più grande.

Quando eseguiamo un'addizione, però, i due numeri non vengono trasferiti sempre e in modo incondizionato attraverso tutti i livelli. Per caricare ciascun operando in un registro, il processore verifica prima se il dato è presente nella cache L1. Se lo trova, si parla di *cache hit* e può utilizzarlo immediatamente. In caso contrario, un *cache miss*, la ricerca prosegue nella cache L2 e poi nella cache L3. Soltanto se il dato non è presente in nessun livello viene recuperato dalla memoria principale. 

Una volta caricati gli operandi nei registri, il processore esegue l'addizione. Anche la scrittura del risultato non attraversa necessariamente e subito tutti i livelli fino alla DRAM: normalmente aggiorna prima la cache. Con una cache *write-back*, la memoria principale viene aggiornata in un secondo momento, per esempio quando la cache line modificata deve essere rimossa; con una cache *write-through*, invece, la scrittura viene propagata anche al livello di memoria successivo.

Ok, stiamo andando troppo nel dettaglio, quello che ci interessa è che le memorie hanno velocità molto differenti, memorie più veloci sono costose, per cui abbiamo solitamente grandi quantità di memoria più lenta, e poi a salire di velocità abbiamo memorie più piccole e costose. La speranza è che quando eseguo un algoritmo esso esegua molte operazioni sempre sugli stessi dati in modo che possano entrare in una cache più veloce.

# Conclusioni

La velocità di esecuzione di un algoritmo è quindi influenzata sicuramente dalla velocità della memoria, ma anche e soprattutto dal quantitativo di dati gestiti (meno dati possono entrare in memorie più veloci). Un algoritmo che esegue molte operazioni su pochi dati potrebbe essere tranquillamente più veloce di un algoritmo che esegue molte meno istruzioni ma su un quantitativo di dati molto più grande.