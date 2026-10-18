---
name: codex-image-input
description: "Use Codex CLI to generate or edit images, or attach screenshots, mockups, diagrams, and image references for analysis or implementation."
argument-hint: "<goal> [image-path] [destination-path]"
---

# Codex Image Input and Generation

Use Codex CLI to generate or edit bitmap images with its built-in `$imagegen` capability, and use `--image` (or `-i`) to attach existing images as visual context for analysis or implementation.

## When to Use

- Generate a new illustration, cover, diagram, or other bitmap image
- Create a variation or edit based on an existing image
- Analyze an error or diagram shown in a screenshot
- Implement or update a UI from a mockup
- Compare a design reference with the current implementation
- Review visual differences across desktop and mobile screenshots

## Generate or Edit an Image

Invoke the built-in image-generation capability explicitly with `$imagegen`. State the subject, composition, aspect ratio, style, and any text or details that must appear. Give the full destination path and filename in the prompt, and ask Codex to create the parent directory if needed.

```powershell
codex exec '$imagegen Generate a 16:9 cyberpunk manga image of a programmer using local AI. Save the final image to C:\Projects\MyBlog\images\cover.png. Create the destination directory if it does not exist.'
```

```bash
codex exec '$imagegen Generate a 16:9 cyberpunk manga image of a programmer using local AI. Save the final image to /home/me/Projects/MyBlog/images/cover.png. Create the destination directory if it does not exist.'
```

For an image revision, attach the source and describe the desired changes. Ask for a new output path unless the user explicitly wants to replace the source:

```bash
codex exec --image ./images/cover.png '$imagegen Edit the attached image to make the lighting brighter while preserving its composition. Save the revised image to ./images/cover-v2.png.'
```

The built-in generator creates the image under Codex's generated-images area first. When a destination is specified, ask Codex to copy or move the chosen result there and verify that the file exists. The built-in tool does not use an `--out` argument. Do not overwrite an existing image unless the user explicitly requests replacement.

The separate `scripts/image_gen.py` fallback is API-based, requires `OPENAI_API_KEY`, and supports `--out`; use it only when the user asks for that CLI/API workflow or needs its specific controls. See the [image-generation CLI reference](https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/imagegen/references/cli.md).

## Inputs

- A specific goal or question for Codex
- One or more local image paths
- Implementation constraints that are not visible in the image, such as framework, styling system, behavior, accessibility, and responsive requirements

Use PNG for screenshots and UI mockups where possible. Codex accepts PNG, JPEG, GIF, and WebP. Convert BMP, TIFF, SVG, and HEIC files to PNG or JPEG before attaching them. Prefer focused images below 5 MB.

## Procedure

1. Confirm that Codex CLI is installed and the supplied image paths exist:

   ```bash
   codex --version
   test -f ./path/to/reference.png
   ```

2. Write a prompt that identifies the desired outcome, target files, project constraints, and any interaction details the image cannot show.

3. Attach each relevant image with `--image` or `-i`. Use `codex exec` for a non-interactive task:

   ```bash
   codex exec --image ./specs/mockup.png "Implement this page in the existing project. Preserve the current design system, match the supplied layout, make it responsive, and verify the result with the relevant tests."
   ```

4. For visual comparisons, attach both images and clearly state their order:

   ```bash
   codex exec \
     -i ./specs/target-design.png \
     -i ./artifacts/current-page.png \
     "The first image is the target design and the second is the current implementation. List the material visual differences, update the implementation to match, and verify at desktop and mobile sizes."
   ```

5. For interactive work, launch `codex`, attach or paste the image, then provide the same detailed prompt. On Linux with Wayland, an image pasted with `Ctrl+V` may not show a placeholder even when it was attached; use a file path with `--image` when confirmation matters.

6. Review the resulting changes and run the project-specific validation. For UI work, verify responsive layouts, empty/error states, keyboard interaction, and visual fidelity rather than relying on the image alone.

## Prompt Checklist

Include the following when relevant:

- Technology and existing project conventions
- Files or route to change
- Desktop and mobile behavior
- Interactive states, validation, loading, and error states
- Accessibility requirements
- Required validation command and expected deliverable

## Limitations

- Reattach images in later Codex prompts; images are not automatically retained between prompts.
- GIF analysis uses the first frame. Describe animation behavior in the prompt.
- Crop irrelevant browser chrome and desktop content before attaching an image.
- Do not attach secrets, production credentials, personal information, or images you are not authorized to share.
