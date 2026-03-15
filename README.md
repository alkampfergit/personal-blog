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
