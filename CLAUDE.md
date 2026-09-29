# CLAUDE.md — LLM2WMD.COM

Read this first, every session. Then read `README.md` for the file layout.

## What this is
LLM2WMD.COM is a static site (hosted on GitHub Pages from this repo) that documents AI development and its path toward military use: a sourced timeline, Headline Mode, System Analysis, Thesis, FAQ, a Proximity Test quiz, "Today's Game", a merch shop, and a V.I.P email list.

It is built and run by one person, Chris. Chris does not write code. Claude makes every change, checks it, and commits it.

## Where things live
- `index.html` — page markup, including all timeline entries.
- `css/` — one stylesheet per feature. `base.css` is the main site stylesheet.
- `js/` — one script per feature. `core.js` is the main site logic.
- `data/headline-stories.js` — Headline Mode stories. **New stories go at the START of the array** so they show first.
- `data/system-stories.js` — System Analysis pieces.
- `data/shop-products.js` — product images, names, prices, sizes.
- `game/` — Today's Game (`game.js` engine, `game-styles.js`, `game-markup.js`, `game-overlay.css`).
- `images/` — product photos and swatches. Product images belong in `images/products/`.

The order of `<link>` and `<script>` tags in `index.html` matters. Add new files next to related ones; never reorder existing tags. Do not merge scripts together — some define functions with the same names on purpose, and load order decides which wins.

## Hard rules
- **Only work from the files in this repo.** Ignore any old builds, exports or "split" attempts elsewhere on this computer (e.g. files in Downloads with names like `llm2wmdbuild3_...`). If Chris points you at a specific file, use exactly that file and nothing else.
- **Never soften or average out the site's voice.** It is dry, deadpan, second-person. Facts imply the dread; no hedging, no chirpy host language, irony through understatement.
- **Use Chris's wording verbatim** when he supplies copy. Tighten only if asked.
- **No box stretches edge-to-edge** of its container by default (buttons, cards, tiles, anything boxed). Give every box a deliberate inset margin, consistently.
- Visual identity: dark military aesthetic, Share Tech Mono + Barlow Condensed, orange/gold glow accents.
- Chris writes short, typo-heavy messages. Work out the intent; don't ask him to rephrase.
- Don't show Chris code as the answer. Make the change in the files and tell him plainly what changed.

## Before committing
1. Syntax-check any JS you touched (`node --check file.js`).
2. Load the site locally (e.g. `python -m http.server`) and check the pages you changed, on desktop and mobile widths, in both the Dark and Simple themes. Use a headless browser with real clicks if one is available. Confirm there are no console errors.
3. Check nothing has ended up in a nested folder (e.g. `images/images/`, `css/css/`).
4. Commit with a clear message.
5. **Push only when Chris says so** — pushing updates the live site immediately. If a push breaks something, revert the commit and push the revert.

## Note
This repo is public, so this file is visible to anyone. Don't add passwords, API keys, account IDs or private details here.
