---
name: codex-image-input
description: "Attach screenshots, mockups, diagrams, or image references to Codex CLI. Use when the user asks Codex to analyze an image, implement a UI from a design, compare screenshots, or fix an issue shown in an image."
argument-hint: "<prompt> <image-path> [additional-image-paths...]"
---

# Codex Image Input

Use Codex CLI's `--image` (or `-i`) option to provide visual context alongside a clear implementation or analysis prompt. This skill attaches images to Codex; it does not generate bitmap images.

## When to Use

- Analyze an error or diagram shown in a screenshot
- Implement or update a UI from a mockup
- Compare a design reference with the current implementation
- Review visual differences across desktop and mobile screenshots

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
