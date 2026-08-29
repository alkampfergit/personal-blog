---
title: "Dal transistor al registro: clock, latch e flip-flop nella CPU"
date: 2026-08-18
draft: false
categories: ["llm-inference"]
tags: ["llm", "inferenza", "cpu", "registri", "clock"]
description: "Come transistor, inverter, transmission gate, latch e flip-flop permettono alla CPU di memorizzare dati nei registri e determinano la frequenza di clock."
summary: |
  Per capire cosa limita davvero la velocità di una CPU partiamo dai transistor e costruiamo, passo dopo passo, un flip-flop D: il componente alla base dei registri e del loro rapporto con il clock.
---

# CPU registri e velocità di clock

Molto spesso si considera come velocità di un processore la sua frequenza di clock, per capire perché questa caratteristica non è l'unica che influisca realmente sulla velocità di esecuzione di un algoritmo bisogna fare qualche precisazione tecnica.

## Cosa è un registro

Abbiamo spiegato in un precedente articolo che un registro è una memoria interna al processore e questa informazione è corretta, di base un registro è una sequenza di flip-flop. (in realtà nelle CPU moderne i registro sono componenti molto piu efficienti ma per uno schema semplificato un flip-flop è sufficiente).

Ok ma cosa è un flip-flop? 

In realtà un flip flop è un circuito elettronico minimale che può essere solamente in due stati, acceso o spento, uno o zero. Esistono differenti tipologie di flip flop e sono costruite da transistor.

A questo punto cosa è un transitor?

Un transistor è un componente elettronico assimilabile ad un interruttore, aperto o chiuso. Un transistor ha tre terminali, di cui uno è chiamato gate. Quando il Gate riceve una tensione elettrica il transistor si chiude e i due altri terminali si collegano. **Un transistor è quindi un interruttore controllato elettricamente.**

L'aspetto fondamentale però è che noi abbiamo due tipi di transistor, uno chiamato NMOS e uno chiamato PMOS, e la differenza è che il primo si chiude quando riceve una tensione positiva, mentre il secondo si chiude quando riceve una tensione negativa.

Nell'elettronica digitale li usiamo entrambi per questo la tecnologia è chiamata CMOS (Complementary Metal Oxide Semiconductor). Con questi due componenti fondamentali andiamo a creare le nostre CPU. 

**Inserire la figura di un transistor**

In binario ragioniamo con 1 e 0, ovvero acceso e spento, ma più in particolare tensione zero o tensione positiva. Non diciamo tensione 1, perchè l'effettivo valore di tensione che identifica il 1 dipende dalla tecnologia utilizzata. 

A questo punto nel nostro computer noi abbiamo una tensione positiva, e la terra, e un numero elevatissimo di interrutori.

# Un lungo viaggio verso un Flip Flop D o Latch

## Inverter

Iniziamo con un circuito basilare chiamato inverter, costituito da due soli transistor, un NMOS ed un PMOS messi in questa configurazione

![schema di un inverter](inverter.png)

In questo caso leggiamo la figura nel seguente modo, la linea in alto è la tensione positiva, la linea in basso è la terra. Il transistor sopra è un PMOS mentre quello sotto è un NMOS. La linea a sinistra è l'ingresso mentre quella a destra è l'uscita.

Il funzionamento è banale, se la tensione in ingresso è positiva, abbiamo il PMOS sopra aperto, l'NMOS sotto chiuso per cui l'uscita è collegata elettricamente alla terra, se l'ingresso è invece è a terra, i due transistor si comportano in modo opposto e l'uscita è collegata alla tensione positiva.

Questa è la ragione per cui questo circuito si chiama inverter, perchè inverte il valore logico dell'ingresso.

## Due inverter in cascata

Ora consideriamo di connettere due di questi inverter in cascata, e collegare l'uscita del secondo all'ingresso del primo a creare un circuito chiuso.

![schema di due inverter in cascata](two_inverters.png)

Questo circuito è detto bistabile perché può avere solamente due stati stabili. Se l'uscita del primo inverter è a terra, l'uscita del secondo inverter è positiva ed essendo collegata all'ingresso del primo tutto torna. 

La cosa positiva di questa configurazinoe è che è stabile, ha due stati per cui è un circuito che può memorizzare un bit di informazione. Questa è una caratteristica fondamentale per andare a costruire il nostro registro. 

Il problema è che ora bisogna aggiungere qualche cosa per poter controllare quale dei due stati vogliamo imporre e poter cambiare da uno stato ad un altro.

## Transmission gate e Clock

I circuiti digitali hanno solo due valori, 0 ed 1, ma i transistor hanno valori di corrente continui nel tempo. Questo significa che quando prendiamo un NMOS e diamo tensione positiva al gate, il transistor non si chiude istantamente.

Tornando al nostro inverter, supponiamo che la tensione in ingresso sia positiva e quindi l'uscita sia a terra. Se ora istantaneamente portiamo l'ingresso a terra, quello che accade è che il PMOS inizia a chiudersi, l'NMOS inizia ad aprirsi, e il voltaggio in uscita inizia a salire verso la tensione positiva.

Inoltre il transistor anche se chiuso ha sempre una minima resistenza, quindi l'uscita non è mai perfettamente a terra o perfettamente alla tensione positiva.

Per qusesta ragione se ad esempio la tensione positiva è di 3.2V noi consideriamo un segnale essere un 1 se è maggiore di un certo valore di soglia ad esempio 2.9V e un segnale essere uno 0 se è minore di un certo valore di soglia ad esempio 0.3V.

Stiamo andando lunghi ma tenete duro. In questa situazione significa che, una volta che io applico un segnale al nostro circuito esso necessita di un certo tempo per stabilizzarsi, e questo tempo è detto tempo di propagazione. Questo tempo dipende dalla tecnologia (grandezza dei transitor, tensione di alimentazinoe, temperatura, e tanto altro) ma di base più il tempo di propagazione è basso più la tecnologia è costosa.

Il clock non è altro che un segnale periodico che alterna 0 e 1, e viene utilizzato per sincronizzare i vari componenti del computer. In questo modo noi andiamo a "leggere" il valore del nostro circuito solo in determinati istanti di tempo, quando il tempo di propagazione è passato e il circuito si è stabilizzato. 

Uff, che fatica, ma ora capiamo perché serve un transmission gate. Il transmission gate è un interruttore controllato elettricamente, ma a differenza di un transistor può essere aperto o chiuso da un segnale positivo o negativo. Questo permette di avere un interruttore che può essere aperto o chiuso da un segnale di clock ed è quindi utilizzato per sincronizzare i componenti.

Un transmission gate è costituito da un NMOS ed un PMOS in parallelo, e funziona come un interruttore controllato elettricamente. Ora chiaramente ci si chiede, perché due transitor se abbiamo già detto che un transistor solo è assimilabile ad un interruttore? La ragione è che un NMOS trasmette benissimo il segnale 0, ma quando è aperto in realtà il segnale 1 ha una caduta di tensione. Al contrario il PMOS trasmette benissimo il segnale 1, ma non riesce ad arrivare perfettamente alla tensione 0.

Se io voglio invece trasmettere un segnale 0 o 1 perfettamente, devo utilizzare entrambi i transistor in parallelo, in modo che quando il segnale è 0 il PMOS sia aperto e l'NMOS chiuso, mentre quando il segnale è 1 l'NMOS sia aperto e il PMOS chiuso. In questo modo il segnale viene trasmesso perfettamente.

Questo è il nostro "transmission gate" spesso rappresentato con questo simbolo:

![Il simbolo del trasmission gate](transmissiongate.png)

EN indica dove connetto il clock, mentre A e B sono i due terminali dell'interruttore. Quando EN è alto, l'interruttore è chiuso e A e B sono connessi, quando EN è basso l'interruttore è aperto e A e B non sono connessi.

## Come controllare il valore del nostro doppio inverter

A questo punto possiamo costruire il seguente circuito aggiungendo due transmission gate al nostro doppio inverter, uno per controllare l'ingresso del primo inverter e uno per controllare l'ingresso del secondo inverter.

![Schema del doppio inverter con transmission gate](invertercontrollato.png)

Il funzionamento è semplice, il nostro D è il valore che vogliamo memorizzare nel bistabile, 1 o 0. Questo ingresso è connesso al primo transmission gate, che si chiude quando il clock è alto. Il secondo transmission gate invece si chiude quando il clock è basso. Questo significa che quando il clock è alto il valore di D viene trasmesso al primo inverter, ma il secondo transmission gate è aperto e quindi il valore del bistabile non può essere modificato. Quando il clock è basso invece il primo transmission gate è aperto il secondo è chiuso e quindi abbiamo il nostro bistabile che ha assunto il valore richiesto.

Questo componente è detto D latch.

## E finalmente un flip flop D

Il problema del latch è questo, durante tutto il fronte alto del clock, il valore di D viene trasmesso al bistabile, ma questo non è un comportamento desiderato. Quello che serve è un componente che, quando il clock passa da basso ad alto, memorizza il valore di D in quel momento, ma **se D cambia valore durante il fronte alto del clock, il valore memorizzato non deve cambiare.** Questo è fondamentale perché semplifica di molto la progettazione, concettualmente durante il colpo di clock il valore di D viene "catturato" e memorizzato istantaneamente (o nella maniera più veloce possibile).

Ecco finalmente lo schema del nostro flip flop D, che è costituito da due latch D, uno controllato dal clock e l'altro controllato dal clock negato.

![Schema del flip flop D](flipflopD.png)

Sono due latch D, il primo è controllato dall'inverso del clock, mentre il secondo è controllato dal clock. Consideriamo questa situazione, il clock è basso, il nostro primo latch è chiuso per cui il valore di D viene trasmesso al secondo latch. Questo secondo latch è però aperto, perchè controllato dal clock, quindi il valore del bistabile non cambia. Quando il clock passa da basso ad alto, il primo latch si apre e il secondo si chiude, quindi il valore di D viene catturato e memorizzato nel bistabile. Se D cambia valore durante il fronte alto del clock, il secondo latch è chiuso e quindi il valore memorizzato non cambia.

## E quindi???

Ok abbiamo quindi capito che con 16 transistor possiamo fare un flip flop D, ovvero un circuito che, al colpo di clock memorizza il valore del suo ingresso D. Questo è il componente fondamentale per costruire un registro, che è una sequenza di flip flop D, uno per ogni bit che vogliamo memorizzare.

In realtà un registro 64 bit necessiterebbe di 64 * 16 = 1024 transistor, ma in realtà i registri moderni sono costruiti con tecnologie più efficienti utilizzando molto meno transistor, ma il concetto di base è comunque questo.

# Conclusioni

Tramite transistor io posso costruire il registro, ovvero un componente in grado di memorizzare un bit di informazione. La tecnologia determina il tempo di propagazione e quindi la frequenza di clock massima con cui posso memorizzare dati nel mio registro. 

Questa è la ragione per cui se noi facciamo overclock di una CPU possiamo avere problemi di stabilità, perchè il tempo di propagazione dei transistor non è sufficiente per garantire che il valore memorizzato sia corretto. Questa è anche la ragione per cui se andiamo ad aumentare il voltaggio di alimentazione dei transistor possiamo aumentare la frequenza di clock, perchè il tempo di propagazione diminuisce, ma questo ha un costo in termini di consumo energetico e calore generato e quindi il rischio di danneggiare i transistor stessi.