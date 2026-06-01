# Injecting UXPScript Wrapper

Further to my previous post, it turns out the trick I discovered might be useful.

I am still on the warpath, in full ‘discovery’ mode, so it’s perfectly possible that the approach outlined below is moot and there are easier ways to do the same, but I am recording this for future reference nevertheless…

Part of what I do in CRDT\_UXP is to handle a lot of stuff in a daemon process (e.g. there is a centralized logger). Sending stuff from UXPScript to the logs is async.

The issue is that the code in CRDT\_UXP creates a lot of `Promise`\-s without waiting for them to resolve.

I don’t want to slow down the code and wait for confirmation of, say, a `crdtuxp.logNote`() call.

So I will call  
`crdtuxp.logNote(...)`  
rather than  
`await crdtuxp.logNote(...)`

Waiting would create an unnecessary game of ping-pong between the UXPScript code and the daemon process.

The problem arises when the UXPScript terminates: the wrapper code in InDesign that calls my script does not wait for any still-pending promises to resolve.

At the time of termination, any ‘loose’ unresolved promises are simply discarded, and my `crdtuxp.logNote` calls don’t even make it to the daemon.

So, with the trick in my [previous post](https://coppieters.nz/?p=929), I could:

1) cast away the `async` prefix to the wrapper, so the ‘wrapping function’ becomes a bog-standard JavaScript function.

To avoid confusing the calling code, I make this function return a `Promise` so the calling code needs be none the wiser and can treat the function as if it were an `async` function.

2) Before opening a new scope and create a new `function` I can replace the default `Promise` class with a proxy replacement which adds tracking code for any as-of-yet unresolved promises.

Because I am doing this ‘outside’ the scope of the wrapper function, I can ‘inject’ a new `Promise` class.

3) At the end of my script, I add

`return Promise.all(Promise.pendingPromises());`

which is a promise to end all promises.

The call `Promise.pendingPromises()` is a static method on my proxy `Promise` class which returns an array of all ‘not-yet-resolved’ promises.

As it turns out, the calling code in InDesign accepts this return value and (I assume) has an `await` on it.

This way, I can make sure the script fulfils any ‘dangling’ promises before terminating – so all my logging calls make it into the log files before the script terminates.

WARNING: the following code is unfinished ‘work-in-progress’ – don’t copy-paste this into your own project sight unseen!!

For reference, my `.idjs` script now looks as follows.

```
// Close off the async wrapper created by the calling context
});

... stuff ...

const inDesign = require("indesign");
const app = inDesign.app;

// Save the original Promise class
const SystemPromise = global.Promise;

let PROMISES_PENDING = {};
let LAST_PROMISE_UNIQUE_ID = 0;

// Define the new Promise class
class Promise {
    constructor(executor) {

        this._state = 'pending';
        this._value = undefined;
        this._id = ++LAST_PROMISE_UNIQUE_ID;

        // Create a new instance of the original Promise
        this._promise = new SystemPromise((resolve, reject) => {
            executor(
                value => {
                    this._state = 'resolved';
                    this._value = value;
                    if (this._id in PROMISES_PENDING) {
                    	delete PROMISES_PENDING[this._id];
                    }
                    resolve(value);
                },
                reason => {
                    this._state = 'rejected';
                    this._value = reason;
                    if (this._id in PROMISES_PENDING) {
                    	delete PROMISES_PENDING[this._id];
                    }
                    reject(reason);
                });
        });
        PROMISES_PENDING[this._id] = this;
    }

    // Proxy static methods
	static pendingPromises() {
		let retVal = [];
		for (let id in PROMISES_PENDING) {
			retVal.push(PROMISES_PENDING[id]);
		}
		return retVal;
	}
	
    static resolve(value) {
        return SystemPromise.resolve(value);
    }

    static reject(reason) {
        return SystemPromise.reject(reason);
    }

    static all(promises) {
        return SystemPromise.all(promises);
    }

    static race(promises) {
        return SystemPromise.race(promises);
    }

    // Proxy instance methods
    then(onFulfilled, onRejected) {
        return this._promise.then(onFulfilled, onRejected);
    }

    catch(onRejected) {
        return this._promise.catch(onRejected);
    }

    finally(onFinally) {
        return this._promise.finally(onFinally);
    }
    
    isPending() {
        return this.state === 'pending';
    }

    isResolved() {
        return this.state === 'resolved';
    }

    isRejected() {
        return this.state === 'rejected';
    }

    getValue() {
        return this.value;
    }    
}

... stuff ...

// Open a new, non-async wrapper to pass back to the calling context. 
// The closing '})' is not in this file - it is instead provided by 
// the calling context.

(function (exports, require, module, __filename, __dirname) {

... the meat of the code ...

// End with a promise which will finalize all pending promises
// so the caller does not exit until all is done

return Promise.all(Promise.pendingPromises());

// No }) here - the calling wrapper provides that!
```

