# CRDT_UXP Notes For InDesign UXP And UXPScript

This note documents the InDesign-specific bridge and Promise model now available in CRDT_UXP.

The short version is:

- UXP panels and UXPScript launchers are not the same runtime.
- InDesign UXPScript appears to have two launch modes, and the top-level launcher text matters.
- A top-level launcher that contains the token `async` can become much slower and can redraw even when `enableRedraw` is false.
- Fire-and-forget Promise work is unsafe at raw UXPScript shutdown unless the launcher drains pending CRDT promises before returning.
- CRDT_UXP now includes an InDesign bridge in `crdtuxpIDSN.js` so panel code can hand work over to a host-owned UXPScript launch path.

## Why This Matters

InDesign panel code is naturally Promise-driven. That is fine for outward work such as:

- network access
- config reads
- daemon calls
- user interaction
- preparation of payloads and file paths

The final InDesign DOM mutation phase is different. In practice it behaves better when the panel hands it off to a host-owned UXPScript launch instead of keeping the whole render inside the panel runtime.

CRDT_UXP now exposes a reusable bridge for that handoff.

## UXP And UXPScript Are Different Contexts

Treat these as different environments with different lifetime rules.

UXP panel or plugin code:

- is Promise-driven by nature
- is a good place for outward work
- is not a good place to assume one uninterrupted InDesign DOM pass

UXPScript launcher code:

- runs inside an InDesign-hosted script context
- is better suited for one contained InDesign DOM pass
- can fall off the end of the host wrapper while Promise work is still pending

That last point is the reason CRDT_UXP already injects a tracked Promise class during `crdtuxp.init()` and exposes `crdtuxp.finalize()`.

## Observed UXPScript Launch Modes

Observed InDesign behavior suggests that the main `.idjs` launcher is inspected before execution.

Two practical rules follow from that:

1. The top-level launcher text matters.
2. The token `async` in that launcher can switch the launch into a slower redraw-heavy mode.

Important details:

- the token appears to matter even in comments or strings
- submodules loaded through `require()` do not appear to trigger the same behavior
- Photoshop does not appear to show the same behavior in the same way

The safe rule for InDesign launchers is therefore:

> Keep the top-level bridged launcher free of `async` and `await` tokens unless you intentionally want that behavior.

For the launcher itself, prefer Promise-returning functions and `.then(...)` chains instead of `async` / `await`.

## Why Promises Need Explicit Finalization

CRDT_UXP makes heavy use of Promise-returning operations, including logger and daemon traffic.

That is fine while the launcher is still alive. The problem is the moment the raw UXPScript launcher returns.

If there are still pending Promises at that point:

- the host may tear the script down immediately
- pending log calls may never reach the daemon
- delayed cleanup can simply disappear

CRDT_UXP already solves the Promise-tracking side of this:

- `crdtuxp.init()` injects the tracked Promise proxy
- `crdtuxp.finalize()` waits for the pending tracked Promises to settle

The practical launcher rule is:

> If a bridged launcher uses CRDT Promise-returning features, end it with `return crdtuxp.finalize();` or equivalent Promise chaining that reaches `crdtuxp.finalize()` before returning.

## New Bridge API

The reusable bridge lives in `CreativeDeveloperTools_UXP/crdtuxpIDSN.js`.

The new functions are:

- `crdtuxpIDSN.wouldUXPScriptRunInAsyncMode(scriptText)`
- `crdtuxpIDSN.doUXPScript(scriptText, options)`
- `crdtuxpIDSN.doUXPScriptFile(filePath, options)`
- `crdtuxpIDSN.clearUXPScriptBridge(options)`

### `wouldUXPScriptRunInAsyncMode(scriptText)`

Use this as a fail-loud preflight on the exact top-level launcher text.

- It returns `true` when the launcher contains the token `async`.
- It is a heuristic based on observed InDesign behavior, not an Adobe-documented contract.

### `doUXPScript(scriptText, options)`

Runs a UXPScript source string through the bridge.

Default behavior:

- rejects source containing `async`
- clears any stale pending bridge task before queueing the new run
- uses a persistent ExtendScript engine and a one-shot idle task under the hood

Supported options:

- `allowAsyncToken`: allow source containing `async`
- `clearPending`: set to `false` to keep the previous queue instead of replacing it
- `engineName`: custom persistent ExtendScript engine name
- `taskName`: custom idle-task name

### `doUXPScriptFile(filePath, options)`

Runs a UXPScript file path through the same bridge.

Supported options:

- `basePath`: base folder used to resolve relative paths
- `sourceText`: optional launcher text used for sync-mode inspection
- `requireSourceInspection`: reject when `sourceText` is not supplied
- `allowAsyncToken`: allow inspected source containing `async`
- `clearPending`: set to `false` to keep the previous queue instead of replacing it
- `engineName`: custom persistent ExtendScript engine name
- `taskName`: custom idle-task name

If you want fail-loud inspection for file-based launchers, pass the same source text you wrote to disk as `options.sourceText` and set `requireSourceInspection: true`.

### `clearUXPScriptBridge(options)`

Removes the current bridge idle task and clears any queued runs for the selected task name.

Use this if a project wants explicit teardown before panel shutdown or before switching bridge names.

## Bridge Flow

The bridge path is:

1. panel code calls `crdtuxpIDSN.doUXPScript(...)` or `crdtuxpIDSN.doUXPScriptFile(...)`
2. CRDT_UXP executes an ExtendScript bridge through `app.doScript(..., ScriptLanguage.JAVASCRIPT)`
3. that bridge installs or reuses a persistent ExtendScript engine
4. the bridge creates a named idle task, removing stale duplicates first
5. on idle, the bridge disables redraw, launches the UXPScript payload with `app.doScript(..., ScriptLanguage.UXPSCRIPT)`, then tears the idle task down when the queue is empty

This is intentionally convoluted. The point is not elegance. The point is moving the InDesign-facing work onto a host-owned script path.

## Logger Behavior In Bridged UXPScript

The CRDT_UXP logger remains usable inside bridged UXPScript, but the shutdown rule matters.

If the launcher calls:

- `crdtuxp.logNote(...)`
- `crdtuxp.logWarning(...)`
- `crdtuxp.logError(...)`
- `crdtuxp.logTrace(...)`

those calls can still be Promise-backed when they go through the daemon or through `logToFilePath`.

That means:

- you can keep using the existing logger API
- you must not let the launcher return before the tracked Promises settle
- `crdtuxp.finalize()` is the normal way to flush the remaining tracked work

Relevant logger configuration options:

- `logToCRDT`: log through the daemon
- `logToFilePath`: file logging through the daemon append path
- `syncLogToFilePath`: direct synchronous file append path for contexts with direct file access

For bridged InDesign UXPScript, `syncLogToFilePath` can be useful as a local scratch log because the launcher already has direct file access. It is not required for correctness. The main correctness requirement is still to reach `crdtuxp.finalize()` before the launcher returns.

## Example Panel-Side Usage

```javascript
const crdtuxp = require("./CreativeDeveloperTools_UXP/crdtuxp.js");
const crdtuxpIDSN = require("./CreativeDeveloperTools_UXP/crdtuxpIDSN.js");

await crdtuxp.init({
    FILE_PATH_PROJECT_FOLDER: pluginFolder.nativePath + "/"
});

const launcherText = await launcherEntry.read();

if (crdtuxpIDSN.wouldUXPScriptRunInAsyncMode(launcherText)) {
    throw new Error("Launcher text contains the token async.");
}

await crdtuxpIDSN.doUXPScriptFile(launcherEntry.nativePath, {
    sourceText: launcherText,
    requireSourceInspection: true,
    clearPending: true
});
```

## Example Bridged Launcher Shape

The example below is the shape to aim for in the top-level `.idjs` launcher.

It intentionally avoids `async` / `await` in the launcher text and ends with `crdtuxp.finalize()`.

```javascript
});

if (! global.crdtuxp) {
    global.crdtuxp = require("./CreativeDeveloperTools_UXP/crdtuxp.js");
}

(function (exports, require, module, __filename, __dirname) {
    return Promise.resolve(crdtuxp.init()).then(function () {
        crdtuxp.configLogger({
            logLevel: crdtuxp.LOG_LEVEL_NOTE,
            logToCRDT: true
        });

        crdtuxp.logNote(arguments, "Launcher started");

        return Promise.resolve()
            .then(function () {
                return true;
            })
            .then(function (retVal) {
                return crdtuxp.finalize().then(function () {
                    return retVal;
                });
            }, function (err) {
                crdtuxp.logError(arguments, "throws " + err);
                return crdtuxp.finalize().then(function () {
                    throw err;
                });
            });
    });
```

The closing `})` is still supplied by the host wrapper.

## Practical Rules

When using the bridge, keep these rules together:

1. Do outward work in panel code.
2. Do the final InDesign DOM pass in a bridged UXPScript launcher.
3. Keep the top-level launcher free of `async` and `await` tokens.
4. If the launcher uses CRDT Promise-based services, end with `crdtuxp.finalize()`.
5. If you want fail-loud launcher inspection, run `wouldUXPScriptRunInAsyncMode()` on the exact launcher text before bridging it.
6. If you need explicit bridge cleanup, call `clearUXPScriptBridge()`.

## Historical Notes

The following files capture the discovery path that led to the current bridge design:

- `mddocs/UXPScriptSpeed.md`
- `mddocs/UXPScriptAsync.md`
- `mddocs/UXPWrapper.md`

Those notes are still useful background. The current reusable API, however, is the bridge now exported from `crdtuxpIDSN.js` together with the existing Promise drain in `crdtuxp.finalize()`.