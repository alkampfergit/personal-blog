---
name: new-post
description: >
  Create a new blog post skeleton for either the English (codewrecks) or Italian (itablog) Hugo site.
  Use when the user asks to create a new post, scaffold a post, or start a new article.
---

# new-post

Create a new blog post skeleton in the correct Hugo page-bundle format.

## Usage

```
/new-post <site> <category/subcategory> <slug> [title]
```

- `site`: `en` for English (`codewrecks/`) or `it` for Italian (`itablog/`)
- `category/subcategory`: the topic subfolder path under `content/post/` (e.g., `ai`, `azdo/pills`, `ai-coding`)
- `slug`: short kebab-case directory name for the post (e.g., `harness-engineering-intro`)
- `title`: optional title; if omitted, derive one from the slug

**Examples:**

```
/new-post it ai-coding harness-engineering-intro
/new-post en ai agent-plan-then-execute "Agent Planning then Execution"
/new-post it general nuovo-post "Titolo del Post"
```

---

## What to create

For `/new-post it ai-coding my-post "Il mio Post"` create:

```
itablog/content/post/ai-coding/my-post/
├── index.md          ← front matter + placeholder body
└── images/           ← empty directory (create a .gitkeep)
```

For `/new-post en ai my-post "My Post"` create:

```
codewrecks/content/post/ai/my-post/
├── index.md          ← front matter + placeholder body
└── images/           ← empty directory (create a .gitkeep)
```

---

## Front matter templates

### Italian (`itablog/`) — use Italian field conventions

```markdown
---
title: "<derived or provided title>"
date: <today's date in YYYY-MM-DD format>
draft: true
categories: ["<primary-category>"]
tags: ["<tag1>"]
description: "<one-sentence description>"
summary: |
  <Two-sentence summary of the post.>
---

## <First section heading>

<Placeholder content.>

Gian Maria
```

### English (`codewrecks/`) — use English field conventions

```markdown
---
title: "<derived or provided title>"
description: "<one-sentence description>"
date: <today's date in RFC3339 format, e.g. 2026-04-24T09:00:00+00:00>
draft: true
tags: ["<Tag1>"]
categories: ["<Category>"]
---

## Introduction

<Placeholder content.>
```

---

## Step-by-step instructions

1. **Determine the base path** from `site`:
   - `en` → `codewrecks/content/post/`
   - `it` → `itablog/content/post/`

2. **Determine the full post directory**: `<base path><category/subcategory>/<slug>/`

3. **Derive the title** if not supplied: convert the slug from kebab-case to Title Case (e.g., `harness-engineering-intro` → `Harness Engineering Intro`).

4. **Derive the primary category** from the first segment of the category/subcategory path (e.g., `azdo/pills` → primary category is `azdo`).

5. **Create `index.md`** using the correct front matter template above. Fill in:
   - `title` — provided or derived
   - `date` — today's date (read from the `currentDate` context if available, otherwise use the current date)
   - `categories` — derived from the category/subcategory path
   - `tags` — one placeholder tag matching the primary category
   - `description` — a generic placeholder the user can replace
   - For Italian posts also write a two-sentence `summary`

6. **Create `images/.gitkeep`** so the directory is tracked by git without requiring a real image yet.

7. **Report** the created paths to the user and remind them to:
   - Replace `draft: true` with `draft: false` when ready to publish
   - Add the cover image to `images/` and reference it with the `copertina` shortcode (Italian) or standard Markdown image syntax (English)
   - Fill in `description`, `tags`, and `categories` with real values

---

## Referencing images in the post body

Images always live in the `images/` subfolder of the post bundle. Reference them with a path **relative to `index.md`** — no `../` prefix.

### English (`codewrecks/`) — inline image + figure caption

```markdown
![Alt text describing the image.](images/filename.png)

***Figure N:*** *Caption text that describes what the reader is looking at*
```

### Italian (`itablog/`) — cover image via shortcode

The first image in an Italian post is typically a cover, inserted with the `copertina` shortcode:

```markdown
{{< copertina
  titolo="Titolo visibile"
  dettaglio="Sottotitolo o descrizione breve"
  immagine="filename.png"
  alt="Descrizione accessibile dell'immagine"
>}}
```

Subsequent inline images use standard Markdown with the same `images/filename.png` path.

---

## Constraints

- Never create files outside `codewrecks/content/post/` or `itablog/content/post/`.
- Never set `draft: false` on a new post — always start as draft.
- Never overwrite an existing `index.md` without explicit user confirmation.
- Use kebab-case for the slug directory name.
- Images always go inside an `images/` subfolder within the post directory.
- Do not run Hugo builds after creating the skeleton — this is a content-only operation.
