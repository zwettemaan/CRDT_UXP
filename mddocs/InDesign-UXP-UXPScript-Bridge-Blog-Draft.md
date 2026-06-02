# When A Fast UXP Panel Turns Into A Painfully Slow InDesign DOM Job

Why handing the final DOM pass to a host-owned UXPScript launcher can make an InDesign UXP workflow feel sane again.

In the following blog post, I distinguish between two UXP-related execution contexts. 

On the one hand, we can run JavaScript code from within a UXP plugin (e.g. triggered by user interaction with a panel in a UXP plugin). 

On the other hand, we can run the same JavaScript code from within a UXPScript (e.g. launched from the Scripts Panel).

## The Pain

If you have been building an InDesign UXP panel and any of the following feels painfully familiar, this post is for you:

- Your panel feels fine while it is doing UI, config, file prep, or network work.
- The moment it starts doing real InDesign DOM work, everything slows to a crawl.
- You can literally watch the page redraw while the job is running.
- `enableRedraw = false` does not seem to save you.
- The same kind of job felt much better when driven from ExtendScript.
- Logging or cleanup that uses Promises mysteriously disappears at the end of a script run.

I have been digging into the difference between the InDesign UXP panel context and InDesign UXPScript context, and I have a mental model that seems to explain some of the differences between them.

The UXP context works best for 'outward' facing code. Fetching stuff from remote servers. Handle user interaction and clicks. Anything that does not need to touch the InDesign DOM. Anything truly asynchronous.

The UXPScript context is much more efficient for 'inward' facing, synchronous code that needs to touch the InDesign DOM. 

CRDT_UXP now has a bridge for exactly that.

The UXP context works well for a lot of things:

- panel UI
- reading configuration
- network traffic
- talking to daemons
- choosing files
- preparing data

But executing a DOM-heavy script in the UXP context was _a lot_ slower than running the same script in a UXPScript context or an equivalent ExtendScript context. For more complex layout work it could be tens or hundreds of times slower.

I am clearly not the only one who has run into this. There are public reports from other InDesign developers describing UXP DOM work as dramatically slower than older approaches for real-world jobs. 

One developer reported a yearly calendar build going from about 15 seconds in CEP to several minutes in UXP. Another explicitly said they keep the UXP side for basic interaction and call out to traditional scripting for the actual processing because the difference is so large. There are also public reports that redraw suppression is not working or not reliably preventing visible page updates during script-heavy loops.

## The Official Story Versus The Field Reality

Adobe's docs make an important distinction: UXP scripts and UXP plugins live in different execution contexts with different lifecycles.

- the same code running within a UXP panel or plugin context behaves differently compared to a UXPScript context
- async syntax in top-level source code text matters for the InDesign UXPScript
- Promise lifetime at UXPScript shutdown behaves in unexpected ways

## The Weird Part: InDesign Seems To Inspect The Top-Level `.idjs` Launcher

Based on repeated observation in InDesign, the top-level UXPScript code appears to be inspected before execution, and the exact source code text can affect the launch behavior.

You have to keep the top-level launcher free of obvious async syntax when you care about the fast Scripts Panel path.

The current evidence no longer points to a raw token scan that blindly hits comments. What still reproduces the problem is real async syntax in the top-level launcher, and comments mentioning `async` no longer seem to trigger it by themselves.

What I observed is that adding a dummy declaration like:

```javascript
async function dummy() {}
```

near the start of the main `.idjs` launcher would make the same UXPScript much slower and visibly redraw-heavy, even when `app.scriptPreferences.enableRedraw = false` was set.

CRDT_UXP exposes a rough optional preflight heuristic rather than a full parser: strip comments and quoted strings, look for common async forms, and let the caller opt out with `allowAsyncToken` when needed. That check is conservative; the bridge path itself does not have to rely on it.

## The Other Weird Part: Promises Can Fall Off The End Of A Raw UXPScript Launcher

CRDT_UXP does a lot of useful work through Promise-returning APIs, including logger traffic and daemon communication.

That is fine while the script is still alive.

The trouble starts when the raw UXPScript launcher returns.

If there are still pending Promises at that point, InDesign can tear the launcher down before those asynchronous operations settle. In practical terms that means:

- log lines vanish
- cleanup work vanishes
- delayed writes never happen

CRDT_UXP can track Promises during `crdtuxp.init()` and `crdtuxp.finalize()` to help avoid these issues.

If your bridged launcher uses CRDT Promise-based services, end it with `return crdtuxp.finalize();` or an equivalent Promise chain that reaches `crdtuxp.finalize()` before returning.

## The Bridge In CRDT_UXP

To make this usable rather than merely interesting, CRDT_UXP now includes an InDesign-specific bridge in `crdtuxpIDSN.js`.

The main public entry points are:

- `crdtuxpIDSN.wouldUXPScriptRunInAsyncMode(scriptText)`
- `crdtuxpIDSN.doUXPScript(scriptText, options)`
- `crdtuxpIDSN.doUXPScriptFile(filePath, options)`

The important point is not the API names. The important point is the change in execution model.

Instead of keeping the whole InDesign-facing job inside the panel runtime, the panel hands the final work over to a host-owned path.

At a high level, the bridge works like this:

1. The panel calls `doUXPScript(...)` or `doUXPScriptFile(...)`.
2. CRDT_UXP executes a small ExtendScript bridge through `app.doScript(..., ScriptLanguage.JAVASCRIPT)`.
3. That transient bridge disables redraw and immediately launches the UXPScript payload with `app.doScript(..., ScriptLanguage.UXPSCRIPT)`.

The point is to move the final InDesign-facing work onto a path that behaves better for this kind of job.

## Why This Helps

The pattern looks like this:

- UXP panel: user interaction, outward async work, prep, orchestration
- bridged UXPScript launcher: one contained DOM mutation phase inside an InDesign-hosted script path

## A Simple Panel-Side Shape

Here is the basic panel-side shape:

```javascript
const crdtuxp = require("./CreativeDeveloperTools_UXP/crdtuxp.js");
const crdtuxpIDSN = require("./CreativeDeveloperTools_UXP/crdtuxpIDSN.js");

await crdtuxp.init({
    FILE_PATH_PROJECT_FOLDER: pluginFolder.nativePath + "/"
});

await crdtuxpIDSN.doUXPScriptFile(launcherEntry.nativePath);
```

There are two ideas here that matter:

- keep the panel focused on orchestration, not the final heavy DOM pass
- add the async preflight only if you explicitly want that extra conservative check

## A Simple Bridged Launcher Shape

And here is the shape to aim for in the top-level `.idjs` launcher:

```javascript
});

if (!global.crdtuxp) {
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

The closing `})` is intentionally not in the launcher file itself. That closing wrapper is supplied by the host launch path.

Three things matter here:

- no top-level async syntax that matches the rough heuristic
- Promise chaining rather than `async` syntax in the launcher text
- explicit `crdtuxp.finalize()` before returning

## Who This Is Likely To Help

This pattern is especially relevant if you have any of the following:

- a UXP panel that collects options and then performs a large document mutation
- a migration from CEP or ExtendScript where the UI is easy but the document work feels much worse
- heavy table, frame, story, or page-item automation
- a workflow where logging or async cleanup must not disappear at script shutdown

If your job is mostly pure JavaScript with light DOM interaction, this may not buy you much.

If your pain is specifically the final InDesign-facing phase, this may buy you a lot.

## The Research Picture So Far

Here is where I think the public evidence stands at the moment:

- Adobe documents that UXP scripts and UXP plugins are different extension types with different runtime assumptions.
- Multiple public reports from InDesign developers describe UXP DOM work as substantially slower than older scripting paths for real jobs.
- Public articles and forum threads show that mixed-technology solutions are a normal production strategy in the InDesign world.
- Public `doScript` usage across scripting boundaries is common.
- The exact top-level async-syntax trigger for redraw-heavy UXPScript launches still appears to be a less widely documented finding.

So the broad problem is externally corroborated.

The exact CRDT_UXP diagnosis and bridge design still seem more specific and novel.

## External References

If you want to add links around the edges of this post, these are the ones I found most relevant:

- Adobe's overview of UXP scripts versus plugins for InDesign:
    https://developer.adobe.com/indesign/uxp/introduction/next-steps/script-and-plugin/
- Adobe's ExtendScript-to-UXP migration guide:
    https://developer.adobe.com/indesign/uxp/resources/migration-guides/extendscript/
- Public report of very slow UXP DOM processing in InDesign:
    https://forums.creativeclouddeveloper.com/t/dom-processing-is-extremely-slow-under-uxp/11817
- Public report of very slow UXP table scripting in InDesign:
    https://community.adobe.com/t5/indesign-discussions/uxp-table-scripting-extremely-slow/td-p/13835443
- Public report of redraw suppression being ignored in script-heavy loops:
    https://indesign.uservoice.com/forums/601180-adobe-indesign-bugs/suggestions/39395290-enableredraw-false-ignored-during-script-run
- Public thread showing `app.doScript(..., ScriptLanguage.UXPSCRIPT)` as a real execution boundary with different behavior:
    https://forums.creativeclouddeveloper.com/t/is-it-possible-to-make-undomodes-entire-script-when-executing-uxpscript-in-doscript/9047
- Public article arguing that mixed-technology InDesign solutions are often the right production answer:
    https://mapsoft.com/posts/indesign-extension-technologies.html

## The Practical Rule Set

If you only remember one thing from this post, make it this:

1. Do outward async work in the UXP panel.
2. Do the final heavy InDesign DOM pass in a bridged UXPScript launcher.
3. Keep the top-level launcher free of obvious async syntax.
4. If the launcher uses CRDT Promise-based services, end with `crdtuxp.finalize()`.
5. If you want fail-loud behavior, inspect the exact launcher text before bridging it. The current check is intentionally rough and can be bypassed.

That combination turns an ugly, vague pain point into a repeatable pattern.

## Related Reading

Some of the discovery path behind this post lives in earlier notes and experiments:

- `UXPScript Tidbit`
- `Injecting UXPScript Wrapper`
- `InDesign UXPScript Speed`
- `UXPScriptSparker`

The current reusable solution, however, is the bridge now exported from `crdtuxpIDSN.js`, together with the Promise drain already exposed through `crdtuxp.finalize()`.

If you have been staring at a UXP panel thinking "the UI is fine, but the real work feels wrong", this may be the split you were missing.
