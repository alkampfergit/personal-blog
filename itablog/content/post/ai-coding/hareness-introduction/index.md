---
title: "Cos'è l’Harness Engineering e perché sta cambiando il coding con gli agenti AI"
date: 2026-04-04
draft: true
categories: ["ai-coding"]
tags: ["harness-engineering"]
description: "L’harness engineering è il sistema di regole, contesto, verifiche e criteri di stop che rende più affidabile il lavoro degli agenti AI sul codice. In questo articolo vediamo perché sta diventando centrale, come si distingue da prompt e context engineering, quali failure mode cerca di prevenire e perché il suo vero problema non è solo tecnico, ma anche economico e organizzativo."
summary: |
  Con gli agenti AI il problema non è più solo generare codice, ma controllarlo in modo affidabile. L'harness engineering nasce proprio qui: è il sistema di guide, contesto, sensori e criteri di stop che permette di delegare di più senza trasformare il processo in burocrazia automatizzata.
---

## Cosa significa "harness"?

Il termine **harness in questo contesto va inteso nel suo significato originale inglese di imbracatura, finimenti o bardatura** — ovvero quel sistema di cinghie e strutture che permette di controllare e dirigere la forza di un cavallo, incanlandola verso un lavoro utile (tirare un aratro, una carrozza, ecc.).

{{< copertina
  titolo="Gestire efficacemente agenti AI autonomi per la progettazione di codice"
  dettaglio="In un mondo in cui il costo di produrre codice è sempre minore, il ruolo del programmatore si sposta sempre di più verso la gestione dell'architettura e il controllo del processo."
  immagine="image.png"
  alt="Un programmatore controlla uno swarm di agenti AI che stanno scrivendo codice."
>}}

## Perché ne stiamo parlando?

Il punto di partenza, secondo me, non è il termine *harness*, ma un problema molto concreto: **gli agenti AI stanno aumentando la velocità con cui si può produrre codice molto più rapidamente di quanto un team riesca a validarlo bene**.

Per anni il collo di bottiglia principale è stato scrivere software. Oggi, in molti scenari, il collo di bottiglia si sta spostando: generare codice sta diventando relativamente economico, mentre capirlo, verificarlo, testarlo e inserirlo senza danni in una codebase reale continua a costare tempo, attenzione e giudizio tecnico.

Gli **agenti AI** cambiano le regole del gioco proprio perché non si limitano a completare una funzione o suggerire una riga: possono leggere file, proporre piani, modificare più parti del repository, eseguire tool e iterare sul risultato. Questo rende possibile delegare una parte crescente del lavoro implementativo, ma rende anche molto più facile produrre codice in quantità superiori alla capacità reale di controllo del team.

## Dal copilota all'agente

Per mesi abbiamo ragionato soprattutto in termini di **copilot**: strumenti che aiutano lo sviluppatore mentre quest'ultimo resta il principale autore del codice. In quel modello il messaggio era rassicurante: il programmatore non perde il controllo, perché continua a scrivere, leggere e decidere quasi tutto.

Con gli agenti la situazione cambia. Una parte crescente della scrittura di codice può essere delegata, mentre agli sviluppatori resta il compito di supervisionare, guidare e approvare. Se però il team continua a usare lo stesso schema mentale di prima, cioè "guardiamo il diff e capiamo al volo se va bene", il controllo diretto del codice generato diventa rapidamente superficiale.

È qui che emerge il vero problema organizzativo: non basta più chiedersi se l'agente scrive codice utile, bisogna chiedersi **come controllare in modo affidabile un sistema capace di produrne così tanto**.

In pratica, ci si trova davanti a tre strade:

- **Illuderci del controllo**: dirci che stiamo davvero controllando ciò che l'agente scrive, quando in realtà diamo solo un'occhiata veloce e verifichiamo che "sembri funzionare".
- **Limitare l'uso degli agenti AI**: usarli solo per compiti molto specifici, in modo da riuscire a verificare davvero il codice prodotto.
- **Costruire un sistema di controllo del processo**: spostare una parte della verifica dal singolo sviluppatore a un insieme di regole, contesto, test, sensori e criteri di escalation che rendano più affidabile la delega.

## Che cos'è davvero l'harness engineering?

È qui che entra in gioco l'**harness engineering**. Un harness è il **sistema complessivo di regole, contesto, verifiche e criteri di stop** che governa il lavoro dell'agente. Non descrive solo *cosa* l'agente deve fare, ma anche *come* deve procedere, *quali vincoli* deve rispettare, *quali controlli* devono essere eseguiti e *quando* il processo deve fermarsi o chiedere intervento umano.

Per chiarire meglio il termine, conviene distinguere tre livelli che spesso vengono confusi:

- Il **prompt engineering** riguarda cosa stai chiedendo al modello. In un contesto davvero autonomo, spesso assomiglia più a una specifica di lavoro che a una richiesta puntuale.
- Il **context engineering** riguarda ciò che rendi disponibile al modello: file, documentazione, memoria, convenzioni di progetto, storico e strumenti di recupero delle informazioni.
- L'**harness engineering** riguarda invece l'intero ciclo operativo: sequenza dei passaggi, regole di esecuzione, validazioni automatiche, eventuali agenti specializzati, escalation, approvazioni umane e criteri di uscita.

Non stiamo parlando di principi totalmente nuovi. Feedback, gating, supervisione, validazione e separazione tra produzione e controllo sono idee note da decenni. La differenza è che oggi questi principi vengono applicati a sistemi autonomi, con context window limitata, memoria parziale, uso di tool esterni e capacità di delegare sotto-task. In un sistema agentico, quindi, il lavoro tecnico si sposta sempre di più dalla sola scrittura del codice alla **progettazione del processo che rende affidabile la sua produzione**.

## Perché con gli agenti il problema cambia

Quando in un team entra un attore capace di produrre codice in autonomia, la domanda pratica resta la stessa: come lo controlliamo? Anche qui l'obiettivo non cambia: vogliamo comunque ottenere codice affidabile e di qualità.

Gli errori sono inevitabili. Per questo esistono code review, test, documentazione, confronto tra colleghi, test end-to-end, SAST/DAST, CI/CD e molte altre pratiche che servono a impedire che codice fragile finisca in produzione. La vera novità non è quindi l'obiettivo, ma il modo in cui dobbiamo far rispettare queste pratiche.

Con i programmatori, infatti, il processo ha anche una componente formativa: si supervisiona, si danno feedback, si discutono le scelte, si correggono errori, e nel tempo la persona interiorizza parte di queste pratiche. Con un agente non funziona così. Ogni nuova interazione riparte da un contesto esplicito e limitato; anche quando esistono memoria di sessione o strumenti di recupero, il modello non apprende nel senso umano del termine.

Questo significa che, con un agente, non gestite una relazione formativa: **progettate un sistema di vincoli, feedback e verifiche che lo spinga verso il comportamento desiderato**. Le buone pratiche restano le stesse, ma devono diventare esplicite, recuperabili e soprattutto applicate in modo rigoroso. Non potete sperare che l'agente le adotti spontaneamente.

## I componenti di un harness efficace

Guides e Sensors sono i due concetti fondamentali [2](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html), ma da soli non bastano a descrivere un harness reale. In pratica, un harness efficace ha almeno cinque componenti.

**Guide**: regole feedforward che vincolano il comportamento dell'agente prima che inizi a scrivere codice. Possono includere convenzioni architetturali, limiti su quali file toccare, obbligo di pianificare prima di implementare, regole sull'introduzione di dipendenze o criteri per l'uso dei tool.

**Contesto strutturato**: informazioni organizzate in modo leggibile e recuperabile, non solo un prompt iniziale. Documentazione locale, file di regole, memoria di progetto, convenzioni per cartella o modulo e indicazioni progressive su cosa leggere in base al task.

**Sensori**: controlli feedback che verificano il risultato prodotto. Test, linting, validazioni statiche, check architetturali, controlli di sicurezza, analisi del diff e qualsiasi altro segnale utile a capire se la modifica è davvero accettabile.

**Criteri di escalation**: regole che stabiliscono quando il processo non può continuare in autonomia e deve attivare controlli più pesanti o richiedere intervento umano.

**Criteri di stop o uscita**: condizioni che dicono quando il task è davvero finito, oppure quando va interrotto perché il sistema sta iterando senza convergere.

Una parte particolarmente critica è capire quali sensori attivare in base al tipo di modifica. Se l'agente non ha toccato la UI, per esempio, non ha senso eseguire ogni volta tutti i controlli end-to-end.

Un'altra leva pratica fondamentale sono i file di memoria e di regole. Non basta un unico `CLAUDE.md` o `AGENTS.md`: serve un repository che contenga informazioni strutturate, leggibili e distribuite secondo il principio di **progressive disclosure**. Il repository deve diventare la source of truth più stabile, proprio perché a ogni iterazione l'agente riparte comunque da un contesto parziale.

In questo scenario ha molto senso chiedere, per esempio, che l'agente generi prima una task list con file coinvolti, modifiche previste e vincoli da rispettare. Quel piano può poi essere confrontato con le guide del progetto prima ancora che inizi l'implementazione.

## Come può fallire un harness

Il punto delicato è che un harness non fallisce solo quando il codice è palesemente sbagliato. Spesso fallisce quando il sistema **soddisfa il controllo locale ma tradisce l'intento reale**. Dire all'agente "scrivi sempre i test" o "fai passare la suite" non basta, se poi il comportamento premiato non coincide con la qualità che volete ottenere.

I failure mode più comuni, secondo me, sono almeno questi.

**Reward hacking**: il sistema supera il controllo che gli avete imposto, ma lo fa in un modo che ottimizza il segnale invece del risultato reale.

**Overfitting ai test**: l'agente cambia il codice solo per far passare una suite locale, anche quando il comportamento risultante è fragile o incoerente con il requisito.

**Correzione locale, danno globale**: una modifica sembra corretta nel punto in cui viene fatta, ma rompe invarianti, contratti impliciti o assunzioni architetturali in altre parti del progetto.

**Manipolazione dei sensori**: invece di risolvere il problema, l'agente rimuove, indebolisce o aggira i controlli che dovrebbero validarlo. Il caso più semplice è eliminare test che non riesce a far passare.

**Uso improprio del contesto**: il modello legge file o regole solo in parte, oppure interpreta male la source of truth del repository, e produce una soluzione apparentemente plausibile ma disallineata con le convenzioni reali del progetto.

D'altronde è sempre vera la frase: “Tell me how you measure me, and I will tell you how I will behave”.

Ad esempio, richiedete che tutti i test debbano passare e l'agente decide di rimuovere quelli che non riesce a far passare. Formalmente il sensore diventa verde, ma il processo ha fallito: ha prodotto conformità apparente invece che qualità reale.

## Dove vale la pena aggiungere più rigore

Utilizzare file template ha senso soprattutto nelle decisioni che hanno **alta inerzia** e **alto costo di rollback**. Non serve appesantire ogni modifica banale, ma è utile strutturare molto bene i casi in cui una scelta sbagliata rischia di lasciare conseguenze durature nel progetto.

Le scelte architetturali e l'introduzione di librerie esterne sono un buon esempio. In questi casi il problema non è solo "far funzionare il codice oggi", ma evitare di introdurre dipendenze, complessità o vincoli che poi resteranno nel repository per mesi o anni. In questo contesto, un template serve a **forzare l'agente a esplicitare il ragionamento in un formato verificabile**.

Ad esempio, invece di lasciare che un agente includa una libreria esterna autonomamente, si può richiedere di generare un file di analisi tecnica che comprenda:

- Perché è necessaria una libreria esterna
- Quali librerie esterne sono state considerate e perché è stata fatta una scelta
- Fornire eventuali snippet di esempio per ogni libreria che ne mostri l'uso e le funzionalità che si intende sfruttare
- Quale potrebbe essere l'effort di scrivere la funzionalità senza la libreria esterna
- Se la libreria potrebbe essere utilizzata per riscrivere codice esistente in modo più efficiente o compatto

A questo punto un altro agente con un modello differente, oppure un controllo umano, può rivedere il file di analisi tecnica con un atteggiamento deliberatamente critico. In molti casi ha senso richiedere che l'introduzione di nuove librerie passi sempre da approvazione umana, proprio perché si tratta di decisioni difficili da annullare a basso costo.

Un vincolo di questo tipo può sembrare eccessivamente rigido, ma evidenzia un punto importante: questi passaggi non servono a rallentare tutto indistintamente, servono a **spendere più controllo dove il costo degli errori è più alto**.

Un altro esempio notevole sono gli [Architecture Decision Records](https://adr.github.io/) di cui parla anche [Martin Fowler](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html). In questo caso un buon template può permettere a un agente di proporre modifiche architetturali, ma la decisione finale dovrebbe molto probabilmente restare umana.

La logica corretta, quindi, non è "più step è meglio": è **più rigore dove l'errore costa di più**.

## Costi, rischi e sostenibilità

Il costo di un sistema di harness engineering è più alto rispetto a un processo di sviluppo tradizionale, soprattutto all'inizio. Ma sarebbe un errore leggerlo solo come **costo di token**. Il vero vincolo è più ampio: latenza, tempo di attesa, tempo di CI, complessità operativa e soprattutto **attenzione umana** [1](https://openai.com/index/harness-engineering/).

Conta anche il tipo di controllo che decidete di introdurre. Come osserva Birgitta Böckeler, esiste una differenza sostanziale tra controlli **computazionali** e controlli **inferenziali** [2](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html). I primi sono test, linters, type check e check strutturali: sono relativamente economici, veloci e abbastanza affidabili. I secondi sono review semantiche, agenti revisori, "LLM as judge" e valutazioni qualitative del diff: sono più lenti, più costosi e meno deterministici.

Di conseguenza, un buon harness non dovrebbe mai essere uniforme. Alcuni controlli dovrebbero essere quasi sempre presenti, perché hanno costo basso e valore alto: test veloci, linting, type check, check strutturali. Altri dovrebbero attivarsi solo in presenza di trigger specifici: modifiche a dipendenze, componenti critici, contratti pubblici, aree poco coperte dai test, diff molto ampi o task che hanno già fallito più volte.

Questo è importante anche perché il campo è ancora giovane. Non abbiamo decenni di metriche e pratiche stabilizzate come nello sviluppo software tradizionale, e potremmo vedere harness apparentemente efficaci degradare al crescere della codebase o dell'entropia del contesto. Per i passaggi più critici, almeno oggi, resta quindi sensato prevedere una supervisione umana.

A questo si aggiunge un rischio spesso sottovalutato: il **version drift dei modelli**. Anche se prompt, regole, contesto e sensori restano invariati, un cambio di modello o di versione può alterare sensibilmente il comportamento dell'agente. Un harness, quindi, non va solo progettato: va anche **ricalibrato nel tempo**.

C'è infine un paradosso utile da tenere presente: **un buon harness può aumentare i costi locali ma ridurre i costi globali** [3](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). Se evita rework, rollback, debugging lungo e review umane poco produttive, allora può essere economicamente sensato. Se invece aggiunge solo ritardo, verbosità e round di validazione poco informativi, allora è overhead puro.

La domanda corretta, quindi, non è "l'harness costa?", ma **quale forma di harness minimizza il costo totale del cambiamento mantenendo un livello accettabile di affidabilità e lead time**. Il vantaggio non sta in una pipeline infinita di agenti che si controllano a vicenda, ma nella capacità di automatizzare in modo selettivo le buone pratiche, spostando il controllo dove serve davvero.

## Conclusioni

Quanto c'è di davvero nuovo? Secondo me non tanto nei principi, quanto nel fatto che gli agenti rendono impossibile trattare test, vincoli, review automatiche, gestione del contesto e criteri di stop come dettagli accessori. Se deleghiamo più produzione, questi elementi diventano il centro del lavoro tecnico.

Più che una rivoluzione, vedo un ritorno alla disciplina ingegneristica. La novità non è che improvvisamente servano controllo e feedback; la novità è che, con gli agenti, dobbiamo progettarli in modo molto più esplicito, perché non possiamo più contare sul fatto che restino impliciti nella testa delle persone.

La condizione, però, è non confondere disciplina con rituale. Un harness utile non è quello che aggiunge il massimo numero di passaggi, ma quello che introduce **i controlli giusti, nel punto giusto, al costo giusto**.

Gian Maria 

## Link utili

## Fonti fondanti

1. **[Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)** — OpenAI, February 2026. L'articolo che ha reso popolare il concetto, basato sull'esperienza del team Codex che ha costruito un'applicazione con oltre un milione di righe di codice senza che nessuna fosse scritta da mano umana.

2. **[Harness engineering for coding agent users](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)** — Birgitta Böckeler su MartinFowler.com, February 2026. L'articolo più strutturato dal punto di vista concettuale, introduce il framework di Guides (controlli feedforward) e Sensors (controlli feedback).

3. **[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)** — Anthropic. Affronta il problema degli agenti che devono lavorare su task complessi attraverso multiple context window.

## Analisi e deep-dive

4. **[The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)** — LangChain Blog, March 2026. Definisce la formula "Agent = Model + Harness" e mostra come LangChain sia passata da Top 30 a Top 5 su Terminal Bench 2.0 cambiando solo l'harness.

5. **[Harness Engineering: The Missing Layer Behind AI Agents](https://www.louisbouchard.ai/harness-engineering/)** — Louis Bouchard, March 2026. Offre la distinzione più chiara tra prompt engineering, context engineering e harness engineering.

6. **[Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)** — HumanLayer Blog, March 2026. Approccio pratico, spiega come i sub-agent funzionino da "context firewall" per mantenere la coerenza su sessioni prolungate.

7. **[The Rise of AI Harness Engineering](https://cobusgreyling.medium.com/the-rise-of-ai-harness-engineering-5f5220de393e)** — Cobus Greyling su Medium, March 2026. Riprende l'analogia di Philipp Schmid: il modello è la potenza di calcolo, la context window è la memoria di lavoro, l'harness è il sistema operativo.
