# InDesign UXPScript Speed

Or, “how a single comment line can make an InDesign UXPScript run more than five times slower”.

## The Issue

I discovered a weird anomaly in InDesign UXP Scripting which can adversely affect the execution speed of a UXPScript.

I also tried it out with Photoshop. As far as I can tell, Photoshop UXPScript is not affected by this.

Simply adding a _comment_ line like

`// async whatever`

into the ‘main’ `.idjs` file makes my script way, way slower.

A noticeable difference is a different redraw behavior while the script is executing.

I suspect the InDesign internal UXP Scripting module performs some crude preliminary textual scan of the script source code before launching the script, and InDesign behaves differently depending on whether it found certain keyword patterns or not.

The textual scan does not seem to care _where_ the patterns occur: e.g. in comments, or in strings or in actual source code.

The issue does not occur for anything that appears in a submodules (`require`). I am guessing the preliminary textual scan only inspects the ‘top level’ `.idjs` script.

Because this textual scan does not account for patterns occurring in comments, I can simply add a dummy comment line with the right pattern and trigger the behavior, and make my script become much slower.

It took me a fair amount of time to figure this out, because the same behavior _also_ occurs when you run the script from the _Adobe UXP Developer Tools_.

Because there were two unrelated causes for the same symptom, I had to resort to tricks to avoid the ‘Heisenberg effect’.

Initially, each time I tried to observe/debug it, the issue was always ‘there’. And it sometimes did and sometimes did not happen when I ran my script from the _Scripts Panel_. I tell you, there was much growling and gnashing of teeth.

## Demo

I have a benchmarking script, called _InDesignBrot_, which I keep handy and occasionally use for speed-testing InDesign. I have both ExtendScript and UXPScript variants of the script.

While trying to figure out what was going on, and to help make the issue stand out, I’ve re-worked the UXPScript variant of the _InDesignBrot_ script so it _only_ using `Promises`. It does not use the `async` or `await` keywords at all.

If you run this script from the InDesign Scripts panel, it will calculate a rough visualization of the Mandelbrot set in InDesign, using an NxN grid of square frames.

[![](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.13.12 PM-1024x690.png)](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.13.12%E2%80%AFPM.png)

You can then tweak the parameters on the pasteboard and re-run the script.

On my M2 Max MacBook Pro, the script executes in about 0.5 seconds for a 19×19 grid.

While the script is running, the screen will not update, and the script does not redraw the page until it has completed the calculation.

Then I add a single comment line with the word `async` followed by a space and another word, like

```
// async whatever
```

anywhere in the _InDesignBrot.idjs_ script.

This innocuous change makes the redraw behavior change, and I can now see individual frames being filled, despite InDesign being set to

`app.scriptPreferences.enableRedraw = false`;

[![](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.13.37 PM-1024x691.png)](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.13.37%E2%80%AFPM.png)

In the end, the same script will take around 3 seconds or more to execute.

[![](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.13.45 PM-1024x699.png)](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.13.45%E2%80%AFPM.png)

The _InDesignBrot_ script can be reconfigured by way of a text frame on the pasteboard. If I change the `num pixels` to 29, the times become 1 second vs 20 seconds.

If you’re interested in trying this out for yourself, I’ve made a specific branch in the InDesignBrot Github repo. This branch has been trimmed down to remove stuff that’s not relevant to the discussion.

[https://github.com/zwettemaan/InDesignBrot/tree/Odd\_async\_demo](https://github.com/zwettemaan/InDesignBrot/tree/Odd_async_demo)

Pull the repo or download the repo `.zip` and move the _InDesignBrot_ folder onto the Scripts Panel.

[![](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.28.29 PM-1024x670.png)](https://coppieters.nz/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-6.28.29%E2%80%AFPM.png)

Then double-click `InDesignBrot.idjs` to run the script.

You can tweak the settings on the InDesign pasteboard and experiment by re-running the script as many times as desired.

