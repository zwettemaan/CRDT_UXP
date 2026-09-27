# Samples

Benchmarks and test scripts that exercise `crdtuxp.js`, kept out of
`CreativeDeveloperTools_UXP/` (the library itself, plus its own
feature-demo sample plugin) so this folder can grow independently.

## Convention

- **`shared/`** - host-agnostic test/benchmark logic. A module here takes an
  already-`init()`ed `crdtuxp` as a parameter rather than `require()`-ing or
  initializing it itself, so the exact same code can run from a standalone
  UXPScript (`.psjs`/`.idjs`) or from inside a real UXP plugin panel -
  whichever bootstraps `crdtuxp` differently, the shared module doesn't care.
- Each **runnable sample** gets its own folder (e.g. `throughput-script/`,
  `throughput-panel/`), containing:
  - a local symlink `crdtuxp.js` → `../../CreativeDeveloperTools_UXP/crdtuxp.js`
  - a local symlink for whichever `shared/` module(s) it uses, e.g.
    `throughputTest.js` → `../shared/throughputTest.js`
  - its own runner: a `.psjs`/`.idjs` for a standalone script, or a
    `manifest.json` + `index.html` + `main.js` (+ `icons/`, itself symlinked
    from `CreativeDeveloperTools_UXP/icons/`) for a plugin panel.

  Local symlinks exist because a packaged UXP plugin cannot `require()`
  outside its own folder - every sample's own code always does
  `require("./crdtuxp.js")` / `require("./throughputTest.js")` (or
  `global.require(...)` in a standalone script), regardless of where the
  real file lives, so the exact same require line works whether the sample
  is a loose script or a plugin bundle. This also means nothing here is a
  vendored **copy** of `crdtuxp.js` - there is exactly one real copy, in
  `CreativeDeveloperTools_UXP/`, and every sample just links to it.

## Current samples

- **`throughput-script/`** + **`throughput-panel/`** - file throughput
  benchmark (direct local access vs. the daemon's old escaped-string
  protocol vs. its auto-negotiated protocol), both running
  `shared/throughputTest.js`. Run the script via Photoshop's
  File ▸ Scripts, or load the panel via UXP Developer Tools
  (*Add Plugin* → `throughput-panel/manifest.json` → *Load*).
