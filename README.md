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
| `game/`  | Today's Game. `game.js` is **generated** from the parts in `game/src/` (see below). `game-certs.js` (certificates + Qualification Room, loads before `game.js`), `game-styles.js` (its CSS), `game-markup.js` (its HTML), `game-overlay.css` (the popup frame). The game's CSS/HTML are stored as JS strings because the game injects them into its own sandboxed shadow DOM. |
| `tools/` | `build-game.py` — joins `game/src/*.js` into `game/game.js`. `dev-server.py` — local R&D server (http://localhost:8123): rebuilds the game on refresh, no caching, nothing is pushed. |
| `icons/` | App / home-screen icons, referenced by `site.webmanifest`. |
| `images/`| Product photos and swatches (unchanged). |

Common edits:
- **New headline story** → `data/headline-stories.js`
- **New product / price change** → `data/shop-products.js` (+ its card markup in `index.html`)
- **New timeline entry** → `index.html` (timeline entries are page markup)

## Today's Game: where things are

The engine is one big closure (all parts share the same variables), so it can't be separate `<script>` files. It lives as small named parts in `game/src/`, joined in filename order by `python tools/build-game.py` into `game/game.js`. **Edit the parts, then rebuild, then commit both.** `python tools/build-game.py --check` confirms `game.js` is up to date.

| Part | What's in it |
|------|--------------|
| `01-head.js` | Wrapper start, hooks to the certificate code, CSS/markup getters |
| `02-engine-setup.js` | `runTodayGame` start: page elements, difficulty and `BALANCE` numbers |
| `03-audio.js` | All sounds |
| `04-wave-helpers.js` | Wave progress, difficulty tier |
| `05-run-certificates.js` | The in-game certificate list and result data (see note below) |
| `06-state-and-config.js` | Starting state, text/copy, stages, `GAME_CONFIG` |
| `07-reactor-and-waves.js` | Reactor, wave labels, reset |
| `08-messages-and-speech.js` | Status line, banner messages, speech bubbles |
| `09-ai-nuke-and-gpu.js` | AI nuke offer, GPU intro and stations |
| `10-layout-and-spawning.js` | Resize, stats, start, enemy spawning |
| `11-targeting-and-combat.js` | Locks, firing, bullets, hits, explosions, upgrades |
| `12-drones.js` | Friendly and hostile drones, lasers |
| `12b-weapons.js` | Weapon pickups (laser, homing missiles, carpet bombs): spawning, firing, popup copy and diagrams |
| `13-hud-and-overlays.js` | HUD buttons, pause, drone and strike overlays |
| `14-decisions-and-endgame.js` | Decisions, nuclear flash, end screen, game over, win check |
| `15-update-loop.js` | Per-frame game logic |
| `16-rendering.js` | Everything drawn on the canvas |
| `16b-weapon-drawing.js` | Pickup icons, beams, missiles, bombs, active-weapon badge |
| `17-loop-and-input.js` | Main loop, pointer input, button wiring |
| `18-launcher.js` | Opens/closes the game overlay, mounts it, briefing buttons |

Certificate names, tiers and wording live in one place: the list at the top of `game-certs.js`. `05-run-certificates.js` only keeps each cert's ID and the game's own banner colour key, and looks the wording up from `game-certs.js`. Change wording there, not in `05`.
