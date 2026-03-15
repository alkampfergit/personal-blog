# personal-blog

Two Hugo sites live in this repository:

- `codewrecks/`: English site
- `itablog/`: Italian site

## Run Locally

From a clean clone:

```bash
git submodule update --init --recursive
./scripts/install-hugo.sh
```

Run the English site:

```bash
cd codewrecks
../bin/hugo server -D
```

Run the Italian site:

```bash
cd itablog
../bin/hugo server -D
```

The repository pins Hugo Extended `0.148.1`. Use `./bin/hugo` instead of any system-wide `hugo` binary.

## Italian Theme Palettes

The Italian site (`itablog/`) supports two built-in palettes:

- `gunmetal`: default, used for the live Italian theme
- `bronze`: alternate muted bronze palette kept in code for comparison

Theme tokens live in `itablog/static/css/site.css`, and the active theme is selected by `itablog/static/js/theme-switcher.js`.

Quick switching for local A/B comparison:

```bash
http://localhost:1314/itablog/?theme=gunmetal
http://localhost:1314/itablog/?theme=bronze
```

The selected theme is persisted in `localStorage` under `itablog-theme`.

To clear the override and go back to the configured default:

```bash
http://localhost:1314/itablog/?theme=reset
```

The configured default theme is set in `itablog/config.toml` under `[params.appearance].defaultTheme`.
