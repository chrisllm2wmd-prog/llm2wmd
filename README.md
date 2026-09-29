# LLM2WMD.COM — file layout

`index.html` holds the page markup (timeline entries, FAQ, shop cards etc.).
Styles and scripts live in their own files and are loaded by `index.html`
**in a fixed order** — the order of the `<link>` / `<script>` tags matters,
so add new files near the related ones rather than moving existing tags.

| Folder   | What's in it |
|----------|--------------|
| `css/`   | One stylesheet per feature (`shop.css`, `cart.css`, `headlines-mode.css`…). `base.css` is the main site stylesheet. |
| `js/`    | One script per feature (`core.js` is the main site logic; `shop.js`, `cart.js`, `headlines-mode.js`…). |
| `data/`  | Content kept as data: `headline-stories.js` (Headline Mode), `system-stories.js` (System Analysis), `shop-products.js` (product images, names, prices, sizes). |
| `game/`  | Today's Game: `game.js` (engine), `game-styles.js` (its CSS), `game-markup.js` (its HTML), `game-overlay.css` (the popup frame). The game's CSS/HTML are stored as JS strings because the game injects them into its own sandboxed shadow DOM. |
| `icons/` | App / home-screen icons, referenced by `site.webmanifest`. |
| `images/`| Product photos and swatches (unchanged). |

Common edits:
- **New headline story** → `data/headline-stories.js`
- **New product / price change** → `data/shop-products.js` (+ its card markup in `index.html`)
- **New timeline entry** → `index.html` (timeline entries are page markup)
