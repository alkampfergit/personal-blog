---
title: "Sicurezza nello Sviluppo con Agenti AI"
date: 2026-05-19
draft: true
categories: ["ai-coding"]
tags: ["ai-coding"]
description: "Riflessioni su sviluppo software utilizzando agenti AI."
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

Se ci fermiamo ai tool per sviluppo, in molti avranno installati server MCP che permettono di automatizzare un browser, siamo sicuri che in una sessione dove noi **abbiamo lanciato un agente che non deve chiedere i permessi** non possa esserci il rischio che si apra un browser con le nostre credenziali? E per quanto riguarda dei file .env o altri dove magari abbiamo delle chiavi di OpenAI che potrebbero essere lette ed esflitrate, magari facendoci arrivare una bolletta enorme? 

Questi strumenti sono nuovi, e non è ancora chiaro quali siano tutte le superfici di attacco. Recentemente molti pacchetti npm sono stati compromessi per far girare script che esflitravano chiavi di accesso a servizi cloud semplicemente con un npm install. In questo caso **non è piu nemmeno un problema di AI, potreste essere vittime di un attacco direttamente anche voi**. Quello che cambia nel mondo della AI è che ora gli attaccanti hanno a disposizione modelli per generare attacchi sempre piu economici e sofisticati e molti utenti hanno nelle loro macchine chiavi per servizi AI, che sono oggi un obiettivo molto interessante per gli attaccanti.

Facendo fare ad una AI una ricerca sull'argomento questi sono i risultati:

### Attacchi basati su npm

Qui secondo me è importante distinguere bene il problema. Il primo rischio non nasce dagli agenti AI: nasce dalla supply chain JavaScript. `npm install`, per design, può eseguire automaticamente alcuni lifecycle hooks come `preinstall`, `install`, `postinstall` e, in certi contesti, `prepare`. Questo significa che una dipendenza malevola o compromessa può far partire codice sul mio ambiente prima ancora che io inizi davvero a usare quel pacchetto.

Il punto critico è che quegli script girano con i permessi dell'utente che ha lanciato il comando. Se nella macchina ci sono file sensibili, variabili d'ambiente, token cloud, chiavi SSH o configurazioni di tool di sviluppo, uno script ostile può tentare di leggerli o di esfiltrarli. Non è un comportamento "anomalo" di npm: è una conseguenza del suo modello di installazione e del fatto che l'ecosistema si appoggia da anni a questi hook per compilazione, bootstrap e setup.

`--ignore-scripts` è una mitigazione utile, e oggi secondo me andrebbe considerata molto più seriamente di quanto si facesse in passato. Però non risolve tutto. Riduce una superficie di attacco importante, quella dell'esecuzione automatica durante l'installazione, ma non rende innocuo un pacchetto malevolo. Se poi eseguo script del progetto, lancio binari installati o importo codice compromesso a runtime, il rischio rimane. Inoltre non elimina problemi classici di supply chain come typosquatting, versioni compromesse o dipendenze introdotte con poca visibilità.

Il rischio specifico degli agenti AI è un altro livello ancora: aumentano velocità, autonomia e raggio d'azione. Un agente può decidere da solo di aggiungere dipendenze, lanciare installazioni e farlo in ambienti che contengono molti più segreti del necessario. Quindi il problema non è "npm oppure AI": il punto è che gli agenti possono amplificare un rischio di supply chain già esistente.

### Attacchi basati su npm, risultati ricerca

**Il meccanismo:** lifecycle hooks di npm:
npm install esegue automaticamente gli script definiti in package.json (preinstall, install, postinstall, prepare) — è il comportamento by design. Un singolo pacchetto compromesso può raccogliere credenziali in secondi, prima ancora che il prompt torni allo sviluppatore. Gli script girano con i permessi dell'utente che lancia npm install → accesso a $HOME, .env, token cloud, chiavi SSH, configurazioni di Claude/Cursor/Codex, ecc.

**Casi reali recenti (2025–2026)**
- Shai-Hulud (settembre 2025): 500+ pacchetti npm infettati in modo coordinato — watershed dell'attacco supply-chain moderno.
- pgserve (21 aprile 2026): script di credential-harvesting di 1.143 righe iniettato via postinstall. È un worm: se trova un token npm publish sulla macchina vittima, si re-inietta in ogni pacchetto pubblicabile con quel token.
- @bitwarden/cli: hook preinstall lancia uno stealer offuscato da 9,7 MB che punta esplicitamente a configurazioni dei tool di AI coding (Claude, Cursor, Codex, Copilot) oltre ai segreti classici.
- node-ipc (maggio 2026): versioni 9.1.6, 9.2.3, 12.0.1 con payload offuscato di credential stealing.
- axios 1.14.1: RAT distribuito tramite npm, mitigabile dagli --ignore-scripts.
- Mini Shai-Hulud (aprile–maggio 2026): TanStack, Mistral AI, Guardrails AI — stesso pattern, propagazione via token pubblicazione.

Il pericolo è reale, e a questo punto non è solo un problema di AI. Questi attacchi sono mitigabili da --ignore-scripts, ma parliamoci chiaro, chi lo usava prima di questi attacchi? Il concetto nella security non è se ma quando verrò compromesso. Pensare di essere immuni è **un'illusione pericolosa**. 

## Buone pratiche

A questo punto per essere sicuri dovremmo sviluppare **ogni progetto in un ambiente il piu possibile separato**. Fortunatamente se adottate DevContainer questa operazione può essere decisamente semplificata, oltre a ritrovarvi una struttura **che semplifica drasticamente le procedure di onboarding**. In questo caso potete semplicemente fare clone del progetto, aprire il progetto in devcontainer, e VsCode con Claude Code / Codex / Copilot sta in realtà girando in un container, che semplicemente condivide la cartella con il vostro sistema.

A questo punto per sviluppare vi serve semplicemente avere docker, il passo successivo è creare alcune VM completamente isolate, dove installate solamente docker e fate girare i vostri container. In questo modo i vostri agenti vengono eseguiti in un container che ha il minimo di informazioni necessarie, e che a sua volta **è un container che è in esecuzione in una VM isolata dalla vostra rete principale**. Il costo è quello di impostare correttamente DevContainer, a quel punto per lavorare sul progetto è veramente questione di un clone e start devcontainer, e **vi trovate installato tutto quello che è necessario per sviluppare sulla vostra solution**. Quindi non solamente ottenete un ambiente più sicuro, ma rendete cosi semplice l'onboarding per cui non esiste più nessuna scusa nel dire: non voglio creare un ambiente isolato perchè è troppo complicato.

## Ci fidiamo degli strumenti?

Ho aperto un bug su [GitHub](https://github.com/openai/codex/issues/23459) ieri, perché dall'ultimo aggiornamento di codex (OpenAI) ho notato che il sistema non mi chiedeva più il permesso prima di leggere e scrivere file. Questo **di per se non è un problema se non fosse che la lettura viene fatta tranquillamente su tutto il tuo file system**. Questo significa che, se beccate un prompt fatto male il vostro codex felicemente legge qualsiasi file sul vostro disco, **senza chiedere nulla**. OpenAI ha anche parlato della sua sandbox, orgogliosi di avere fatto una sandbox amministrativa che offre maggiore protezione, **peccato che l'igene di base per lavorare con un sistema è quella di usarlo con utente non amministratore, ergo io non posso usare la sandbox admin**. 

Ma non è nemmeno un problema di sandbox, è chiaro che con un agente è impossibile prevenire qualsiasi cosa, un agente potrebbe essere ingannato nel realizzare uno script o lanciare uno script che poi va a leggere file fuori dal workspace e l'harness non si accorge. D'altronde **è impossibile pensare che un sistema di harness controlli qualsiasi script o pezzo di codice per verificare cosa sta facendo**. D'altra parte mi attenderei che di base, la lettura semplice di file al di fuori del workspace fosse impedita per default, evidentemente non sembra cosi per Codex dopo uno degli ultimi update.

Questo mi fa riflettere molto sul livello di security di questi oggetti. Lo scopo principale è prendere quote di mercato, la sicurezza secondo me è molto in basso nei loro backlog. Ho immediatamente disinstallato qualsiasi cosa di OpenAI dalla macchina principale, avendo dati di più clienti è impensabile **sostenere il rischio dell'uso di uno strumento che di base non controlla cosa sta leggendo e che viene pilotato da un LLM**.

## Conclusioni

Gli agenti AI sono uno strumento oramai indispensabile per chi sviluppa, ma è bene non perdere di vista un punto fondamentale: **stiamo dando ad un programma la possibilità di eseguire comandi sulla nostra macchina** con i nostri permessi, i nostri token, le nostre chiavi. Il fatto che il programma sia "intelligente" non lo rende più sicuro, anzi: lo rende **più facilmente manipolabile**. Il livello di attenzione alla sicurezza di chi fa questi strumenti non mi sembra per ora adeguato, da una parte articoli che mostrano le novità delle Sandbox utilizzate, dall'altro nemmeno il più basico dei controlli sul leggere fuori dalla cartella di lavoro.

Il mio consiglio personale è di partire da un principio molto semplice: **trattate l'agente AI come tratteresti uno stagista al primo giorno**. Gli date accesso a quello che gli serve, non al resto. Lo fate lavorare in un ambiente isolato, non sulla macchina dove tenete le credenziali di produzione, le chiavi SSH personali e l'accesso alla mail aziendale. Dovete trattare un agente AI come un collaboratore, non troppo smart, ingenuo (può essere manipolato) e incurante dei danni che può generare. 

Sarò paranoico, ma mi sembra di vedere che le nozioni di sicurezza base siano bellamente ignorate a favore di "velocità velocità velocità". 

Gian Maria
