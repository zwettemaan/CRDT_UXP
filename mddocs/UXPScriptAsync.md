UXPScript Tidbit
(note 2024-07-24: I’ve written a follow-up post, with a practical use of this technique:
https://coppieters.nz/?p=945)

I discovered this (probably useless) tidbit. When creating a UXPScript for InDesign, in its simplest form, you create an .idjs text file, and put a script into it.

You can then debug your script using Adobe’s Adobe UXP Developer Tools which are part of the Creative Cloud apps.

I noticed in the debugger, that when I ran my script, the calling context would wrap my script between two added lines:

(async function (exports, require, module, __filename, __dirname) {
.... the contents of my .idjs file...
});
which I assume is done by simple string manipulation, and then this string is parsed by the JavaScript engine, and then executed.

That led me to try a code injection in my .idjs script. I added a single line, at the top of my script.

This added line does not make sense on its own, but it ‘slots in’ when accounting for the wrapper.

After adding my ‘sneaky line’, my .idjs file becomes:

});(function (exports, require, module, __filename, __dirname) {
... the contents of my .idjs file ...
Hence, when I run this script, the effective code (i.e. my code combined with the wrapper provided by the calling UXPScript context) becomes:

(async function (exports, require, module, __filename, __dirname) {
});(function (exports, require, module, __filename, __dirname) {
... the contents of my .idjs file ...
});
My script does not contain any await statements, so it continues to work.

With this injection, I’ve ‘cast away’ the async nature of the wrapper, by replacing the async wrapper with a normal function wrapper.

I doubt that this is useful, and I don’t yet ‘grok’ the implications yet, but I suspect this might come in handy later, for example to inject stuff into the global variable space.

Things like:

(async function (exports, require, module, __filename, __dirname) {
});
let globalVar = 123;
(async function (exports, require, module, __filename, __dirname) {
… the contents of my .idjs file …
});

which creates a variable in the Script scope.

The reason I scratching around here is that I am currently exploring the ins and outs of UXPScript for InDesign, figuring out how to best integrate UXPScript into the Creative Developer Tools/Tightener technology stack and figure out how I can reduce friction and make the environment easier to use for simple ad-hoc scripts, which are the bread and butter of many workflows.

At present, I am planning to implement a ScriptUI-inspired UI environment for UXPScript, opening the door for simple UI, without needing to go full UXP. More later…