---
title: "Sicurezza nello Sviluppo con Agenti AI"
date: 2026-05-29
draft: false
categories: ["ai-coding"]
tags: ["ai-coding"]
description: "Riflessioni su sviluppo software utilizzando agenti AI. Cosa dovremmo tenere in considerazione per limitare rischi e vulnerabilità."
summary: |
  Lo sviluppo assistito da agenti AI introduce nuove superfici di attacco e rischi spesso sottovalutati. Siamo sicuri di stare utilizzando  questi strumenti in modo veramente sicuro?.
---

## Introduzione

Oggi l'AI è l'hype del momemento, ma per chi sviluppa codice è oramai una realtà di cui non **si può piu fare a meno**. Il problema è che in questo settore alcune grandi compagnie (Anthropic / OpenAI / GitHub / Google) si stanno battendo per quote di mercato e quindi è chiaro che, in questo contesto, le feature su cui maggiormente si spingono sono quelle che portano probabilmente ad un aumento di Utenze.

Il rischio è che, le funzionalità di sicurezza siano semplicemente posticipate, perché molti utenti onestamente non hanno poi cosi in considerazione questo aspetto. Mi trovo a discutere con persone che dicono: ma veramente vi preoccupate oppure lanciate sempre

```
claude --dangerously-skip-permission
```

senza poi preoccuparvi in realtà di cosa può succedere? Installate OpenClaw, Hermes, gli date accesso alla vostra posta, al vostro calendario e buonanotte. Utilizzate browser con AI integrata dove fate login con i vostri account principali?

Io onestamente **non lo faccio perchè ho paura**. Tutto va bene fino a che magari la AI che comanda il vostro browser non viene ingannata da un prompt malevolo e magari poi cancella un ambiente di produzione... Di queste storie inizia ad essere pieno il web, vere o false il rischio esiste.

## Le principali aree di rischio

Se ci fermiamo ai tool per sviluppo, secondo me il primo errore è pensare all'agente AI come a un "autocomplete evoluto". In realtà stiamo **dando a un software la possibilità di leggere file, proporre modifiche, eseguire comandi, installare dipendenze** e, in alcuni casi, interagire con browser o servizi esterni. Il rischio quindi non è uno solo: sono più superfici di attacco che si sommano.

Una prima area critica è l'accesso ai segreti locali. In molti ambienti di sviluppo esistono file `.env`, credenziali cloud, chiavi API, token GitHub, sessioni browser già aperte, chiavi SSH o configurazioni di tool che contengono informazioni sensibili. Se un agente ha permessi troppo ampi, oppure se viene indotto a eseguire comandi o leggere file non necessari, il rischio di esposizione di questi dati diventa concreto. Nel mio caso ho anche aperto un bug su Codex perché, nei test che ho fatto su Windows, il comportamento sui permessi di lettura mi è sembrato troppo permissivo rispetto a quello che mi aspetterei da uno strumento di questo tipo. **In generale chiedetevi: affiderei il mio computer ad un utente che è un ingenuo e che potrebbe essere manipolato?** Se la risposta è no, allora dovreste essere più cauti anche con un agente AI.

Una seconda area è l'automazione del browser e degli strumenti esterni. Se nella mia sessione ho tool che permettono di controllare un browser autenticato, un calendario, una mailbox o una console cloud, allora il problema non è più solo leggere codice: l'agente può potenzialmente compiere azioni. In questo scenario la prompt injection smette di essere un concetto teorico e diventa un rischio operativo. **Anche qui il problema è il classico, se l'agente ha accesso allo stesso sistema dove io lavoro, potrebbe aprire un browser ed agire a mio nome**.

Per questo motivo il punto non è chiedersi se l'agente sia "intelligente". Il punto è chiedersi a cosa ha accesso, quali strumenti può usare, e quanto danno può fare se interpreta male una richiesta o viene manipolato.

### Attacchi basati su npm

Qui secondo me è importante distinguere bene il problema. Il primo rischio non nasce dagli agenti AI: nasce dalla supply chain JavaScript. `npm install`, per design, può eseguire automaticamente alcuni lifecycle hooks come `preinstall`, `install`, `postinstall` e, in certi contesti, `prepare`. Questo significa che una dipendenza malevola o compromessa può far partire codice sul mio ambiente prima ancora che io inizi davvero a usare quel pacchetto.

Il punto critico è che quegli script girano con i permessi dell'utente che ha lanciato il comando. Se nella macchina ci sono file sensibili, variabili d'ambiente, token cloud, chiavi SSH o configurazioni di tool di sviluppo, uno script ostile può tentare di leggerli o di esfiltrarli. Non è un comportamento "anomalo" di npm: è una conseguenza del suo modello di installazione e del fatto che l'ecosistema si appoggia da anni a questi hook per compilazione, bootstrap e setup. 

`--ignore-scripts` è una mitigazione utile, e oggi secondo me andrebbe considerata molto più seriamente di quanto si facesse in passato. Però non risolve tutto. Riduce una superficie di attacco importante, quella dell'esecuzione automatica durante l'installazione, ma non rende innocuo un pacchetto malevolo. Se poi eseguo script del progetto, lancio binari installati o importo codice compromesso a runtime, il rischio rimane. Inoltre non elimina problemi classici di supply chain come typosquatting, versioni compromesse o dipendenze introdotte con poca visibilità.

Il rischio specifico degli agenti AI è un altro livello ancora: aumentano velocità, autonomia e raggio d'azione. Un agente può decidere da solo di aggiungere dipendenze, lanciare installazioni e farlo in ambienti che contengono molti più segreti del necessario. Quindi il problema non è "npm oppure AI": il punto è che gli agenti possono amplificare un rischio di supply chain già esistente.

## Buone pratiche

A questo punto per essere sicuri dovremmo sviluppare **ogni progetto in un ambiente il piu possibile separato**. Fortunatamente se adottate DevContainer questa operazione può essere decisamente semplificata, oltre a ritrovarvi una struttura **che semplifica drasticamente le procedure di onboarding**. Un DevContainer non equivale automaticamente a un isolamento forte: resta comunque da capire quali cartelle vengono montate, quali credenziali sono disponibili, che accesso di rete esiste e quanto il tool sul client possa comunque interagire con la macchina host. Però è già un buon passo nella direzione giusta, perché sposta una parte importante dell'ambiente di sviluppo in un contesto più controllabile.

A questo punto per sviluppare vi serve semplicemente avere docker, il passo successivo, se volete davvero alzare il livello di isolamento, è creare VM dedicate dove installate solamente docker e fate girare i vostri container. In questo modo gli agenti lavorano in un container con il minimo di informazioni necessarie e, se configurate bene rete e accessi, quel container vive dentro una VM separata dal resto del vostro ambiente principale. Il costo è quello di impostare correttamente DevContainer e l'infrastruttura che gli sta intorno, ma in cambio ottenete un ambiente più sicuro e una procedura di onboarding molto più semplice: clone del repository, apertura del devcontainer, e vi trovate già buona parte degli strumenti necessari per lavorare sulla solution.

## Ci fidiamo degli strumenti?

Ho aperto un bug su [GitHub](https://github.com/openai/codex/issues/23459) ieri, perché dall'ultimo aggiornamento di codex (OpenAI) ho notato un comportamento sui permessi che, nei miei test, mi è sembrato meno prudente di quanto mi aspettassi. Questo **di per se non è un problema se il perimetro di lettura e scrittura resta molto chiaro e limitato**, ma nel mio caso ho avuto l'impressione che il sistema potesse leggere file fuori dal workspace con troppa facilità. Se questa impressione fosse confermata, significherebbe che un prompt scritto male o un contesto ambiguo potrebbe spingere lo strumento a leggere file che non dovrebbe toccare. OpenAI ha anche parlato della sua sandbox, orgogliosi di avere fatto una sandbox amministrativa che offre maggiore protezione, **peccato che l'igene di base per lavorare con un sistema è quella di usarlo con utente non amministratore, ergo io non posso usare la sandbox admin**. 

Ma non è nemmeno solo un problema di sandbox: con un agente è difficile aspettarsi garanzie perfette. Un agente potrebbe essere ingannato nel realizzare uno script o lanciare uno script che poi va a leggere file fuori dal workspace senza che l'harness riesca a capirlo in ogni situazione. D'altra parte io mi attenderei che, come default, la lettura semplice di file al di fuori del workspace fosse limitata il più possibile o almeno molto più esplicita dal punto di vista dei permessi. È proprio qui che, nel mio caso, ho percepito un comportamento troppo permissivo.

Questo mi fa riflettere molto sul livello di security di questi oggetti. Lo scopo principale è prendere quote di mercato, la sicurezza secondo me è molto in basso nei loro backlog. Ho immediatamente disinstallato qualsiasi cosa di OpenAI dalla macchina principale, avendo dati di più clienti è impensabile **sostenere il rischio dell'uso di uno strumento che di base non controlla cosa sta leggendo e che viene pilotato da un LLM**.

## Conclusioni

Gli agenti AI sono uno strumento oramai indispensabile per chi sviluppa, ma è bene non perdere di vista un punto fondamentale: **stiamo dando ad un programma la possibilità di eseguire comandi sulla nostra macchina** con i nostri permessi, i nostri token, le nostre chiavi. Il fatto che il programma sia "intelligente" non lo rende più sicuro, anzi: lo rende **più facilmente manipolabile**. Il livello di attenzione alla sicurezza di chi fa questi strumenti non mi sembra per ora adeguato, da una parte articoli che mostrano le novità delle Sandbox utilizzate, dall'altro nemmeno il più basico dei controlli sul leggere fuori dalla cartella di lavoro.

Il mio consiglio personale è di partire da un principio molto semplice: **trattate l'agente AI come tratteresti uno stagista al primo giorno**. Gli date accesso a quello che gli serve, non al resto. Lo fate lavorare in un ambiente isolato, non sulla macchina dove tenete le credenziali di produzione, le chiavi SSH personali e l'accesso alla mail aziendale. Dovete trattare un agente AI come un collaboratore, non troppo smart, ingenuo (può essere manipolato) e incurante dei danni che può generare. 

Sarò paranoico, ma mi sembra di vedere che le nozioni di sicurezza base siano bellamente ignorate a favore di "velocità velocità velocità". 

Gian Maria
