---
title: "Includere una skill in un pacchetto Nuget"
date: 2026-03-16
draft: false
categories: ["ai-coding"]
tags: ["coding"]
description: "Come distribuire documentazione e skill per agenti AI direttamente da una libreria .NET pubblicata via NuGet."
summary: |
  Per migliorare l'utilizzo di librerie esterne dai propri Assistenti al codice, una skill è sempre la soluzione migliore. A questo punto perché non includere tale skill direttamente all'interno del pacchetto NuGet? 
---

Quando lavoro con librerie distribuite tramite NuGet, talvolta vedo gli assistenti AI fare dei giri strani: provano a trovare il repository sorgente (perché capiscono che è una libreria pubblicata da me), oppure cercano di scaricare il package per capire come e strutturata la libreria.

Il problema e che questo approccio e fragile, lento e soprattutto non sempre porta a risultati. Di base in .NET i modelli riescono ad utilizzare bene le librerie grazie ai commenti XML, per cui spesso si raggiunge un buon risultato, ma la verità **è che una buona skill fatta con tutti i crismi è sempre la soluzione migliore**.

## La documentazione per agenti dentro la libreria

Nel repository di `Jarvis.Framework` (una nostra libreria storica) ho fatto generare una skill direttamente dentro una cartella `llm` da Github Copilot. Gli ho fatto per ora generare documentazione per alcune classi chiave, soprattutto quelle per cui ho visto l'assistente fare più fatica a capire come usarle.

[Jarvis.Framework/llm](https://github.com/ProximoSrl/Jarvis.Framework/tree/develop/llm)

L'idea e semplice: se una libreria viene consumata da altri progetti, allora puo portarsi dietro anche una documentazione pensata per gli agenti AI. Non solo API e classi, ma istruzioni su come usare davvero il framework.

Questo cambia parecchio il gioco, perche l'assistente non deve piu dedurre struttura, convenzioni e pattern dal codice. Li trova gia spiegati.

{{< copertina
  titolo="La libreria non porta solo binari"
  dettaglio="Se il package include anche documentazione pensata per gli agenti, l'assistente smette di fare reverse engineering e parte subito con il contesto corretto."
  immagine="android.png"
  alt="Un assistente robotico consulta la documentazione di una libreria software in una biblioteca digitale"
>}}

## Il valore della progressive disclosure

Ora la questione è: come la organizzo questa documentazione? La skill funziona meglio quando segue una logica di  incremental disclosure: prima dai all'assistente una vista generale, poi gli fai aprire solo il dettaglio che serve davvero.

Questo approccio e utile per almeno tre motivi. Prima di tutto evita che l'agente si perda dentro tonnellate di file inutili. Poi riduce il rischio che prenda un dettaglio fuori contesto e lo trasformi nella regola generale. Infine lo costringe a lavorare in modo piu simile a un umano esperto: parti dalla mappa, capisci l'area, e solo dopo scendi nel codice. 

> Con incremental disclosure inoltre l'utilizzo del contesto del modello è molto efficiente.

Questo è solo un esempio che tra l'altro non è del tutto farina del mio sacco, ma lo trovate nella guida di Anthropic, [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en). Il punto chiave del documento e che una skill efficace dovrebbe lavorare su tre livelli: frontmatter YAML sempre disponibile per capire quando va attivata, corpo di `SKILL.md` caricato quando la skill e rilevante, e file aggiuntivi consultati solo quando servono davvero. In pratica, esattamente il meccanismo che consente di dare molto contesto senza buttare tutto subito nella finestra di token. 

In pratica la skill non dovrebbe essere un dump di Markdown, ma una guida a strati:

- una pagina iniziale che spiega il framework e i casi d'uso principali
- una serie di approfondimenti per area, ad esempio identity, projection engine o serializzazione
- riferimenti ai sorgenti reali solo quando serve entrare nel dettaglio implementativo

Nella stessa guida c'e anche un altro suggerimento che condivido parecchio: partire da pochi use case concreti, definire quando la skill deve attivarsi, e tenere la struttura semplice. `SKILL.md` e obbligatorio, `references/` e `assets/` sono opzionali.

In questo modo quando l'assistente deve capire come si usa il concetto di IIDentityManager della libreria legge il file SKILL.md da li va poi a prendere il file che spiega tutto il blocco delle identity, senza dover "ravanare" dentro il codice o nella dll.

## Il passaggio chiave: `GeneratePathProperty`

Nel progetto utilizzatore ho importato il package facendo attenzione ad aggiungere `GeneratePathProperty`:

```xml
<PackageReference Include="Jarvis.Framework" GeneratePathProperty="true" />
```

Questa piccola proprieta e fondamentale, perche chiede a MSBuild di esporre il path locale del package restaurato. Nel mio caso poi posso usare `$(PkgJarvis_Framework)` per andare a leggere i file che NuGet ha scaricato.

## Una target MSBuild che copia la skill

A quel punto ho aggiunto una target personalizzata che prende i file Markdown dalla cartella `llm` inclusa nel package e li copia nella cartella delle skill di Claude: (in questo caso ho un brutto percorso, ma onestamente il file di progetto si troverà sempre li rispetto alla root del repository, quindi non è un grosso problema)

```xml
<Target Name="UpdateAgentDocs">
    <PropertyGroup>
        <AgentDocsDestinationFolder>$(SolutionDir)../../../../../.claude/skills/framework/jarvis-framework/</AgentDocsDestinationFolder>
    </PropertyGroup>

    <Message Importance="high" Text="[UpdateAgentDocs] Target Started copy from $(PkgJarvis_Framework) to $(AgentDocsDestinationFolder)" />

    <Error Condition="'$(PkgJarvis_Framework)' == ''"
           Text="The package path property is empty. Please run 'dotnet restore' first." />

    <ItemGroup>
        <JarvisLlmDocFiles Include="$(PkgJarvis_Framework)\contentFiles\any\any\llm\**\*.md" />
    </ItemGroup>

    <RemoveDir Directories="$(AgentDocsDestinationFolder)" />

    <Copy SourceFiles="@(JarvisLlmDocFiles)"
          DestinationFolder="$(AgentDocsDestinationFolder)%(RecursiveDir)"
          SkipUnchangedFiles="true" />

    <Message Importance="high" Text="Successfully copied LLM docs from Jarvis.Framework.Shared to AgentDocs!" />
</Target>
```

Il risultato e molto comodo: la libreria distribuisce anche la sua conoscenza operativa, e il progetto che la usa puo aggiornare la skill locale con un solo comando.

## Il comando finale

Per eseguire tutto basta lanciare:

```bash
dotnet msbuild .\src\Intranet\Jarvis.Common.Shared\Jarvis.Common.Shared.csproj /t:UpdateAgentDocs -v m
```

E a quel punto nel progetto utilizzatore mi ritrovo automaticamente installata la skill di Claude. Il comando precedente viene messo in uno script Restore-Packages che già abbiamo e che lanciamo sempre quando cambiamo le references. Il gioco è fatto.

## Come questo cambia l'approccio alle librerie

Il punto non e solo tecnico. Il punto e che stiamo iniziando a trattare gli agenti come veri utilizzatori del nostro ecosistema software. Spesso la documentazione delle nostre librerie è lacunose, e siamo pigri, non ci interessa metterle a posto, l'utilizzatore magari è un altro programmatore che si guarda il codice. Ma se l'utilizzatore è un agente AI, allora la documentazione diventa parte integrante del prodotto perche **riduce i token utilizzati, riduce il tempo di esecuzione dei task e migliora la qualità del codice generato**.

Secondo me nei prossimi mesi vedremo sempre di piu questo pattern: non solo package che distribuiscono binari, ma package che distribuiscono anche contesto per gli agenti. La cosa realmente divertente è che, mentre scrivere documentazione per gli altri risulta a noi programmatori (aridi di cuore e non empatici verso il prossimo) noiosa, quando la scrivi per un agente e vedi che poi lui la usa realmente diventa un momento di soddisfazione. Non stai più **generando documentazione per un ipotetico utilizzatore, stai guidando il tuo agente e puoi subito vedere la differenza nella sua capacità di utilizzare la libreria**.

E' incredibile vedere quanto cambia il modo di scrivere codice ora che siamo nell'era degli assistenti AI. 

Gian Maria.
