---
name: hugo-template
description: >
  This skill should be used when the user mentions "go template", "hugo template", "partial", "shortcode", "template syntax", "layout", "baseof", "block define", "{{ range }}", "{{ if }}", "{{ with }}", "{{ partial }}", "template lookup", "layout hierarchy", or any Hugo templating concepts. Provides comprehensive guidance on Go template syntax, layouts, partials, shortcodes, and template debugging.
---

 Hugo Templating

  Go Template Syntax Fundamentals

  Hugo uses Go's text/template and html/template packages with additional Hugo-specific functions. Understanding the core syntax is essential for all Hugo development.

Variables
{{/* Defining variables */}}
{{ $title := "My Page Title" }}
{{ $count := 5 }}
{{ $items := slice "one" "two" "three" }}

{{/* Accessing page variables (front matter and built-in) */}}
{{ .Title }}           {{/* Page title */}}
{{ .Content }}         {{/* Rendered content */}}
{{ .Params.author }}   {{/* Custom front matter parameter */}}
{{ .Date }}            {{/* Page date */}}
{{ .Permalink }}       {{/* Full URL to page */}}
{{ .RelPermalink }}    {{/* Relative URL to page */}}

{{/* Reassigning variables (note the = not :=) */}}
{{ $count = 10 }}
Conditionals
{{/* Basic if statement */}}
{{ if .Params.featured }}
  <span class="featured">Featured</span>
{{ end }}

{{/* if-else */}}
{{ if .Params.draft }}
  <span class="draft">Draft</span>
{{ else }}
  <span class="published">Published</span>
{{ end }}

{{/* if-else if-else chain */}}
{{ if eq .Type "post" }}
  <article class="post">...</article>
{{ else if eq .Type "page" }}
  <div class="page">...</div>
{{ else }}
  <div class="default">...</div>
{{ end }}

{{/* Comparison operators */}}
{{ if eq $a $b }}     {{/* equal */}}
{{ if ne $a $b }}     {{/* not equal */}}
{{ if lt $a $b }}     {{/* less than */}}
{{ if le $a $b }}     {{/* less than or equal */}}
{{ if gt $a $b }}     {{/* greater than */}}
{{ if ge $a $b }}     {{/* greater than or equal */}}

{{/* Logical operators */}}
{{ if and .Params.featured .Params.image }}
{{ if or .Params.author .Site.Params.defaultAuthor }}
{{ if not .Params.hidden }}
Loops with range
{{/* Iterate over pages */}}
{{ range .Pages }}
  <h2>{{ .Title }}</h2>
{{ end }}

{{/* With index */}}
{{ range $index, $page := .Pages }}
  <div class="item-{{ $index }}">{{ $page.Title }}</div>
{{ end }}

{{/* Iterate over maps */}}
{{ range $key, $value := .Params.metadata }}
  <dt>{{ $key }}</dt>
  <dd>{{ $value }}</dd>
{{ end }}

{{/* Range with else (for empty collections) */}}
{{ range .Pages }}
  <li>{{ .Title }}</li>
{{ else }}
  <li>No pages found</li>
{{ end }}

{{/* Limit iterations */}}
{{ range first 5 .Pages }}
  <li>{{ .Title }}</li>
{{ end }}
Pipes and Function Chaining
{{/* Pipes pass output to the next function */}}
{{ .Title | upper }}
{{ .Title | lower | truncate 50 }}
{{ .Content | plainify | truncate 200 "..." }}

{{/* Common pipe operations */}}
{{ .Date | time.Format "January 2, 2006" }}
{{ .Params.tags | sort | uniq }}
{{ .Summary | safeHTML }}

{{/* Multiple arguments with pipes */}}
{{ .Title | truncate 50 "..." }}    {{/* truncate to 50 chars, add "..." */}}
{{ .Content | replaceRE "<[^>]*>" "" }}  {{/* strip HTML tags */}}
Context: The Dot (.) and Global Context ($)
{{/* The dot represents current context */}}
{{ .Title }}  {{/* In page context, this is the page title */}}

{{/* Inside range, dot changes to the current item */}}
{{ range .Pages }}
  {{ .Title }}  {{/* This is now the iterated page's title */}}
{{ end }}

{{/* Use $ to access global/root context from within range */}}
{{ range .Pages }}
  {{ $.Site.Title }}: {{ .Title }}
{{ end }}

{{/* with changes context like range */}}
{{ with .Params.author }}
  <span class="author">{{ . }}</span>  {{/* dot is now the author value */}}
{{ end }}
Layout Hierarchy and Lookup Order

Hugo uses a sophisticated lookup system to find the right template for each page.

The baseof.html Template
The base template (layouts/_default/baseof.html) defines the overall HTML structure:

<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
  {{ block "head" . }}
    <meta charset="utf-8">
    <title>{{ .Title }} | {{ .Site.Title }}</title>
    {{ partial "head/meta.html" . }}
    {{ partial "head/css.html" . }}
  {{ end }}
</head>
<body>
  {{ partial "header.html" . }}

  <main>
    {{ block "main" . }}
      {{/* Default content - overridden by specific templates */}}
    {{ end }}
  </main>

  {{ partial "footer.html" . }}
  {{ block "scripts" . }}{{ end }}
</body>
</html>
Layout Lookup Order
Hugo searches for templates in this order (first match wins):

For a single page (e.g., content/blog/my-post.md):

layouts/blog/single.html
layouts/_default/single.html
Theme equivalents
For a list page (e.g., content/blog/_index.md):

layouts/blog/list.html
layouts/_default/list.html
Theme equivalents
For the home page:

layouts/index.html
layouts/home.html
layouts/_default/index.html
layouts/_default/home.html
With custom layout specified in front matter (layout: custom):

layouts/blog/custom.html
layouts/_default/custom.html
Directory Structure
layouts/
  _default/
    baseof.html      # Master template
    single.html      # Default single page
    list.html        # Default list page
    terms.html       # Taxonomy list (tags, categories)
    taxonomy.html    # Individual taxonomy term
  blog/
    single.html      # Blog post template
    list.html        # Blog listing template
  partials/
    header.html
    footer.html
    components/
      card.html
  shortcodes/
    youtube.html
    figure.html
Block Definitions

Blocks enable template inheritance, allowing child templates to override sections of the base template.

Defining and Using Blocks
{{/* In baseof.html - define block with default content */}}
{{ block "main" . }}
  <p>This is the default content if not overridden</p>
{{ end }}

{{/* In single.html - override the block */}}
{{ define "main" }}
  <article>
    <h1>{{ .Title }}</h1>
    {{ .Content }}
  </article>
{{ end }}

{{/* Empty block (placeholder only) */}}
{{ block "sidebar" . }}{{ end }}

{{/* Override with content */}}
{{ define "sidebar" }}
  {{ partial "sidebar/recent-posts.html" . }}
{{ end }}
Block Best Practices
{{/* Always pass context to blocks */}}
{{ block "main" . }}{{ end }}  {{/* CORRECT: passes current context */}}
{{ block "main" }}{{ end }}     {{/* WRONG: no context passed */}}

{{/* Common block pattern */}}
{{ define "main" }}
  {{/* Access page data through the passed context */}}
  <h1>{{ .Title }}</h1>

  {{/* Can still access global context */}}
  <p>Site: {{ $.Site.Title }}</p>
{{ end }}
Partials

Partials are reusable template fragments stored in layouts/partials/.

Basic Partial Usage
{{/* Include a partial - ALWAYS pass context */}}
{{ partial "header.html" . }}
{{ partial "components/card.html" . }}

{{/* Passing custom context */}}
{{ partial "author-bio.html" .Params.author }}

{{/* Passing a dict for multiple values */}}
{{ partial "card.html" (dict "title" .Title "image" .Params.image "link" .Permalink) }}
Partials That Return Values
{{/* layouts/partials/get-reading-time.html */}}
{{ $wordCount := len (split .Content " ") }}
{{ $readingTime := div $wordCount 200 }}
{{ return $readingTime }}

{{/* Using the partial */}}
{{ $time := partial "get-reading-time.html" . }}
<span>{{ $time }} min read</span>
Cached Partials
{{/* partialCached caches output based on cache key */}}
{{ partialCached "expensive-partial.html" . .Section }}

{{/* Cache key can be multiple values */}}
{{ partialCached "nav.html" . .Section .Kind }}

{{/* For truly static content, use context-independent key */}}
{{ partialCached "global-nav.html" . "global" }}
Inline Partials
{{/* Define an inline partial */}}
{{ define "partials/inline-card.html" }}
  <div class="card">
    <h3>{{ .title }}</h3>
    <p>{{ .description }}</p>
  </div>
{{ end }}

{{/* Use it */}}
{{ partial "inline-card.html" (dict "title" "Hello" "description" "World") }}
Shortcodes

Shortcodes add dynamic functionality to Markdown content. They bridge content and templates.

Shortcode Syntax in Content
{{</* Basic shortcode */>}}
{{< youtube id="dQw4w9WgXcQ" >}}

{{</* Named parameters */>}}
{{< figure src="https://raw.githubusercontent.com/hughescr/Codex-config/4e1acdf430252fc99e3226cefc5fa9aa213a25f9/plugins/hugo/skills/hugo-templating//images/photo.jpg" title="My Photo" alt="Description" >}}

{{</* Positional parameters */>}}
{{< highlight go >}}
fmt.Println("Hello")
{{< /highlight >}}

{{</* With inner content (paired shortcode) */>}}
{{< notice type="warning" >}}
This is a warning message.
{{< /notice >}}

{{</* Markdown processing: < vs % */>}}
{{< shortcode >}}   {{</* Inner content NOT processed as Markdown */>}}
{{% shortcode %}}   {{%/* Inner content IS processed as Markdown */%}}
Creating Shortcode Templates
{{/* layouts/shortcodes/youtube.html */}}
{{ $id := .Get "id" | default (.Get 0) }}
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/{{ $id }}"
          allowfullscreen></iframe>
</div>

{{/* layouts/shortcodes/notice.html */}}
{{ $type := .Get "type" | default "info" }}
<div class="notice notice-{{ $type }}">
  {{ .Inner | markdownify }}
</div>

{{/* layouts/shortcodes/figure.html - comprehensive example */}}
{{ $src := .Get "src" }}
{{ $title := .Get "title" }}
{{ $alt := .Get "alt" | default $title }}
{{ $class := .Get "class" }}

<figure{{ with $class }} class="{{ . }}"{{ end }}>
  <img src="https://raw.githubusercontent.com/hughescr/Codex-config/4e1acdf430252fc99e3226cefc5fa9aa213a25f9/plugins/hugo/skills/hugo-templating/{{ $src }}" alt="{{ $alt }}">
  {{ with $title }}<figcaption>{{ . }}</figcaption>{{ end }}
</figure>
Shortcode Context and Methods
{{/* Accessing parameters */}}
{{ .Get "name" }}       {{/* Get named parameter */}}
{{ .Get 0 }}            {{/* Get first positional parameter */}}
{{ .Params }}           {{/* All parameters as map */}}

{{/* Inner content */}}
{{ .Inner }}            {{/* Raw inner content */}}
{{ .Inner | markdownify }}  {{/* Process as Markdown */}}
{{ .InnerDeindent }}    {{/* Inner content with indentation removed */}}

{{/* Parent context */}}
{{ .Page }}             {{/* The page containing the shortcode */}}
{{ .Page.Title }}
{{ .Site }}             {{/* Site configuration */}}

{{/* Check if parameter exists */}}
{{ if .Get "title" }}
  <h3>{{ .Get "title" }}</h3>
{{ end }}
Shortcodes vs Partials
Use Shortcodes When	Use Partials When
Adding to Markdown content	Building layout templates
Content authors need it	Developers use it
Per-content customization	Site-wide components
Dynamic content embeds	Header, footer, navigation
Common Hugo Functions

Data Structure Functions
{{/* Create a dictionary (map) */}}
{{ $data := dict "name" "John" "age" 30 "active" true }}
{{ $data.name }}

{{/* Create a slice (array) */}}
{{ $items := slice "apple" "banana" "cherry" }}
{{ index $items 0 }}  {{/* "apple" */}}

{{/* Merge dictionaries */}}
{{ $merged := merge $defaults $overrides }}

{{/* Scratch for mutable state */}}
{{ $.Scratch.Set "counter" 0 }}
{{ $.Scratch.Add "counter" 1 }}
{{ $.Scratch.Get "counter" }}
Context Functions
{{/* with - changes context if value is truthy */}}
{{ with .Params.author }}
  <span>By {{ . }}</span>
{{ else }}
  <span>Anonymous</span>
{{ end }}

{{/* range - iterate with changed context */}}
{{ range .Pages }}
  {{ .Title }}
{{ end }}

{{/* Conditional assignment */}}
{{ $author := .Params.author | default .Site.Params.author }}
Asset Pipeline Functions
{{/* Get resource from assets/ directory */}}
{{ $css := resources.Get "css/main.css" }}
{{ $js := resources.Get "js/app.js" }}

{{/* Process SCSS */}}
{{ $style := resources.Get "scss/main.scss" | toCSS }}

{{/* Fingerprint for cache busting */}}
{{ $style := $style | fingerprint }}
<link rel="stylesheet" href="https://github.com/hughescr/Codex-config/blob/4e1acdf430252fc99e3226cefc5fa9aa213a25f9/plugins/hugo/skills/hugo-templating/{{ $style.RelPermalink }}">

{{/* Concatenate files */}}
{{ $bundle := slice $js1 $js2 | resources.Concat "js/bundle.js" }}

{{/* Minify */}}
{{ $min := $style | minify }}
Template Debugging

Inspecting Variables
{{/* Print variable structure */}}
{{ printf "%#v" . }}

{{/* Print type */}}
{{ printf "%T" .Params }}

{{/* Pretty print for development */}}
<pre>{{ debug.Dump . }}</pre>

{{/* Print to terminal during build */}}
{{ warnf "Current page: %s" .Title }}
{{ errorf "Missing required param: %s" "author" }}  {{/* Stops build */}}
Common Errors and Solutions
{{/* ERROR: can't evaluate field X */}}
{{/* Solution: Check if field exists first */}}
{{ with .Params.author }}{{ . }}{{ end }}

{{/* ERROR: range can't iterate over nil */}}
{{/* Solution: Use default or check first */}}
{{ range .Params.tags | default slice }}

{{/* ERROR: wrong type for value */}}
{{/* Solution: Check types with printf "%T" */}}
{{ printf "%T" .Params.date }}  {{/* Might be string, not time.Time */}}

{{/* ERROR: partial not found */}}
{{/* Solution: Check path is relative to layouts/partials/ */}}
{{ partial "components/card.html" . }}  {{/* File: layouts/partials/components/card.html */}}
Build with Template Metrics
# Show template execution times
hugo --templateMetrics

# With detailed hints
hugo --templateMetrics --templateMetricsHints

# Example output helps identify slow templates
Development Helpers
{{/* Conditional debug output */}}
{{ if site.IsServer }}
  <div class="debug">
    Page: {{ .Title }}<br>
    Kind: {{ .Kind }}<br>
    Type: {{ .Type }}<br>
    Section: {{ .Section }}
  </div>
{{ end }}

{{/* Check what variables are available */}}
{{ range $key, $value := .Params }}
  {{ $key }}: {{ $value }}<br>
{{ end }}