---
title: "Link nel primo commento"
date: 2026-08-18
draft: false
categories: ["generale"]
tags: ["internet"]
description: "Come cambia il modo di comunicare nella rete quando l'unico obiettivo sono visualizzazioni, impressioni e click."
summary: |
  Se i contenuti oramai vengono prodotti principalmente per ottenere visualizzazioni, impressioni e click, ha veramente senso informarsi in internet sui canali generalisti?
---

# Circuito per addizionare due numeri binari

## Porte logiche

Tutti conosciamo AND, OR, NOT, NAND, NOR, XOR e XNOR. Queste sono le porte logiche di base che ci permettono di costruire circuiti digitali. Tra di queste la NAND è una porta molto molto importante perché tramite essa possiamo costruire tutte le altre porte logiche. In realtà anche la NOR è una porta universale, ma la NAND è più diffusa.

L'inverter già visto precedentemente è chiaramente una porta NOT, nega il suo ingresso utilizzando due transistor.

Con quattro transistor possiamo costruire invece anche una porta NAND.

![NAND](nand.png)

I due transistor sopra sono PMOS quelli sotto sono NMOS, il funzionamento è banale.

Se uno dei due ingressi è 0, allora almeno uno dei due transistor NMOS è spento, e uno dei PMOS è acceso per cui l'uscita è connessa alla tensione di alimentazione e quindi 1.

Se invece entrambi sono 1, entrambi gli NMOS sono accesi ed entrambi i PMOS sono spenti per cui l'uscita è connessa a terra.

## NOR, anche lui quattro transistor

Non metto nemmeno la figura, mettete in alto i PMOS in serie ed in basso due NMOS in parallelo ed avete la vostra porta NOR. In questo caso basta che uno dei due ingressi sia 1 per far accendere almeno un NMOS e spegnere entrambi i PMOS, quindi l'uscita è connessa a terra e quindi 0. Se invece entrambi gli ingressi sono 0, entrambi i PMOS sono accesi ed entrambi gli NMOS sono spenti per cui l'uscita è connessa alla tensione di alimentazione e quindi 1.

## AND 6 transistor chiaramente

Dato che un NOT è un inverter da due transistor ed un NAND è una porta da quattro transistor, possiamo costruire una porta AND con sei transistor. Basta collegare l'uscita di una NAND ad un inverter e il gioco è fatto.

## XOR 12 transistor

La porta XOR può essere costruita con 12 transistor nella forma classica, ma in realtà esistono implementazione più efficienti con anche la metà dei transistor, che hanno però performances leggermente peggiori. Non ci interessa lo schema ci interessa la sua funzione logica, che è la seguente:

```
A B | A XOR B
0 0 | 0
0 1 | 1
1 0 | 1
1 1 | 0
```

Che è particolarmente interessante perché è la funzione di di addizione binaria, perchè il caso 1 + 1 in binario produce il riporto per cui il risultato di quel particolare bit è 0, mentre il riporto è dato dall'AND dei due ingressi.

## costruiamo l'addizionatore

Partiamo dal circuito chiamato "half adder" che prende due bit in ingresso e produce un bit di somma ed un bit di riporto, uno XOR e uno AND come detto sopra. (circa 18 transistor nell'implementazione canonica)

Un half adder non basta perché prende due soli input mentre invece quando facciamo un addizionatore, solamente la cifra più a destra è un half adder, per tutte le altre io ho tre ingressi, i due input ed il riporto proveniente dalla cifra precedente. 

Per la cifra risultante basta mettere in XOR anche il riporto, mentre per il riporto si usa una formula particolare che effettua AND delle due cifre messe in or con l'AND tra il riporto e lo XOR dei due input. 

A questo punto mettiamo in sequenza tanti full-adder in sequenza ed abbiamo un addizionatore a N bit, che prende due numeri binari di N bit e produce un numero binario di N bit più un bit di riporto. L'ultimo riporto viene detto overflow, e se è 1 significa che il risultato non può essere rappresentato con N bit.

## Frequenza di clock e circuiti combinatori

in questo caso il circuito è combinatorio, ovvero l'uscita dipende solamente dagli ingressi, e non da uno stato precedente. In questo caso la frequenza di clock della CPU è limitata dalla velocità dei transistor, quindi più transistor ci sono in un circuito e più il tempo di propagazione del segnale aumenta, per cui la frequenza di clock diminuisce. 

Ma comunque il nostro addizionatore è un circuito semplice, significa che dato gli ingressi avrà bisogno di un tempo di propagazione per produrre l'uscita, ma è sufficiente che questo tempo di uscita sia minore del tempo di clock della CPU per dire che possiamo addizionare due numeri in un colpo di clock.

# Moltiplicatore

Sebbene potrebbe essere possibile creare un moltiplcatore che sia puramente combinatorio, il suo tempo di propagazione sicuramente sarebbe maggiore di quello di un addizionatore, e quindi la frequenza di clock della CPU sarebbe limitata da questo circuito.

 Per questo motivo i moltiplicatori sono circuiti sequenziali, ovvero hanno uno stato interno che viene aggiornato ad ogni clock. Questo significa che per eseguire una moltiplicazione sono necessari piu cicli di clock. 

 Ci sono anche altre considerazioni, ovvero che se debbo moltiplicare tra loro tre coppie di numeri completamente scorrelate, spesso io posso mettere un nuovo input ad ogni colpo di clock, significa che se io necessito di tre colpi di clock avrò il primo risultato al terzo colpo di clock, il secondo al quarto e il terzo al quinto. 

 Senza complicare la discussione è comunque chiaro che, operazioni piu complesse non possono essere eseguite in un solo colpo di clock, e quindi la frequenza di clock della CPU è un dato importante per capire la velocità della CPU nell'eseguire operazioni, ma è importante capire quanti cicli di clock sono necessari per eseguire le varie operazioni.

 Le CPU moderne poi sono dette superscalari, ovvero hanno più circuiti per eseguire operazioni differenti, e quindi possono eseguire più operazioni in parallelo. 

 Tutto questo ci fa capire che la frequenza di clock è solamente uno dei fattori che determina la "velocità" con cui un processore esegue le operazioni richieste. 

## Registri e operazioni

Se ho più circuiti che fanno operazioni differenti, supponiamo un addizionatore ed un moltiplicatore ed i dati sono nei registri come faccio a scegliere quale operazione effettuare?

In una configurazione semplicistica e sicuramente non reale, io potrei connettere i due registri ad entrambi i circuiti. Questo significa che io eseguo entrambe le istruzioni sempre e poi scelgo quale risultato prendere. Questo significa che io sto eseguendo due operazioni invece di una, e quindi sto sprecando tempo e energia.

Di base quindi ho dei multiplexer, componenti che prendono più ingressi e ne selezionano uno solo in uscita. In questo modo io posso connettere i registri a più circuiti, ma selezionare quale circuito deve produrre il risultato.

Nella realtà le CPU moderne sono molto molto più complesse, hanno pipeline, branch prediction, esecuzione fuori ordine e tantissime altre ottimizzazioni, ma il concetto di base è quello che abbiamo visto sopra.

# Conclusioni

Con i transitor facciamo porte logiche, con porte logiche possiamo fare circuiti che rappresentano operazioni aritmetiche su numeri binari. Le operazioni possono essere combinatorie, ovvero l'uscita dipende solamente dagli ingressi, oppure sequenziali, ovvero l'uscita dipende anche da uno stato interno che viene aggiornato ad ogni colpo di clock.

Per questa ragione il troughput di una CPU non dipende solamente dalla frequenza di clock, ma anche da quanti cicli di clock sono necessari per eseguire le varie operazioni e da quanto ottimizzate sono le implementazioni per le varie operazioni.






