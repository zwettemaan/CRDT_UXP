# Creative Developer Tools

Documentation for Creative Developer Tools for ExtendScript

https://github.com/zwettemaan/CRDT_ES/blob/main/scripts/docs.md

Documentation for Creative Developer Tools for UXP and UXPScript

https://github.com/zwettemaan/CRDT_UXP/blob/main/docs.md

## Standard features (free of charge)

Standard features (Creative Developer Tools for ExtendScript)

```
crdtes.base64decode()
crdtes.base64encode()
crdtes.crdtesDir()
crdtes.dirCreate()
crdtes.dirDelete()
crdtes.dirExists()
crdtes.dirScan()
crdtes.dQ()
crdtes.evalScript()
crdtes.evalTQL()
crdtes.fileClose()
crdtes.fileDelete()
crdtes.fileExists()
crdtes.fileOpen()
crdtes.fileRead()
crdtes.fileWrite()
crdtes.getCreativeDeveloperToolsLevel()
crdtes.getDir()
crdtes.getEnvironment()
crdtes.getPluginInstallerPath()
crdtes.pluginInstaller()
crdtes.setIssuer()
crdtes.sQ()
crdtes.sublicense()
```

Pay-for features (Creative Developer Tools for ExtendScript)

```
crdtes.decrypt()
crdtes.encrypt()
crdtes.getPersistData()
crdtes.machineGUID()
crdtes.setPersistData()
```

Standard features (Creative Developer Tools for UXP)

```
async crdtuxp.base64decode()
async crdtuxp.base64encode()
async crdtuxp.dirCreate()
async crdtuxp.dirDelete()
async crdtuxp.dirExists()
async crdtuxp.dirScan()
      crdtuxp.dQ()
async crdtuxp.evalScript()
async crdtuxp.evalTQL()
async crdtuxp.fileClose()
async crdtuxp.fileDelete()
async crdtuxp.fileExists()
async crdtuxp.fileOpen()
async crdtuxp.fileRead()
async crdtuxp.fileWrite()
async crdtuxp.getCreativeDeveloperToolsLevel()
async crdtuxp.getDir()
async crdtuxp.getEnvironment()
async crdtuxp.getPluginInstallerPath()
async crdtuxp.pluginInstaller()
async crdtuxp.setIssuer()
      crdtuxp.sQ()
async crdtuxp.sublicense()
```

Pay-for features (Creative Developer Tools for UXP)

```
async crdtuxp.decrypt()
async crdtuxp.encrypt()
async crdtuxp.getPersistData()
async crdtuxp.machineGUID()
async crdtuxp.setPersistData()
```

## Use Cases

### Protect your code (somewhat like JSXBIN)

Need to install PluginInstaller and register for a developer account.

Add a few files and folders to your script.

Package your script using the PluginInstaller, and distribute the resulting .tpkg
file (download, email, store.tgrg.net).

The end-user needs to install PluginInstaller and import the .tpkg file.

User can then install/remove the software.

### Metrics

Optional pay-for feature for developers: get a monthly report with

- Number of package installs (tally of unique machines that have installed the software)
- Number of script runs over time (tally of `evalScript` calls).

### Activations and licensing

CRDT keeps track of how many seats use your software and disables the software when the number
of seats is overcomitted.

Currently, CRDT does not handle payments, but a future version will have the option of using
your own payment handling, or choose a ready-made solution (we plan for PayPal and Stripe initially).

### Sublicensing

If your software product is rather a component that you want to sell to other software developers who
will incorporate it into their own software (e.g. a library), then you can offer sublicensing to 
these developers: they can purchase seats from you, and they can then embed these pre-purchased
seats into their software, so the end-users don't have to deal with PluginInstaller or activations.

### Store

If you want, your products can be featured into a custom section of the store: if you have a pay-for
developer account, we can add a link to a web page on your servers, and this will incorporate your 
page to the PluginInstaller Store.

On that page, all you need to do is provide download links to one or more `.cate` (Catalog Entry) files.

The PluginInstaller will know how to handle these and help the user purchase and/or install the 
software.

### End-User Installing

If you use the PluginInstaller packager to package your ExtendScript, your end-user can then easily
install your scripts into their Creative Cloud apps.

### Code Signing

When you register a developer account, you automatically create a private and a public key. The private key is stored on your computer and should be kept safe and secure - it is a 'proof of identity' that only
you are meant to have.

The public key is stored in a publicy accessible repository (https://registry.tgrg.net) which allows the 
PluginInstaller to verify the origin of software it is installing by checking the code signature on the software.

### Additional features enabled by a Creative Developer Tools license

Need to install PluginInstaller and register for a developer account.

You need to embed a license for Creative Developer Tools into
your source code. Make sure this source code is encrypted in the .tpkg distribution file.

```
TIGHTENER.setIssuer("431ce798caa84ae6b3ce7df9f82a45e1","developer@mail.what");
```

If you have a pay-for developer account, you also get access to the following additional features:

ExtendScript:
```
crdtes.decryptStr()
crdtes.encryptStr()
crdtes.getPersistData()
crdtes.machineGUID()
crdtes.setPersistData()
```

UXP:
```
async crdtuxp.decryptStr()
async crdtuxp.encryptStr()
async crdtuxp.getPersistData()
async crdtuxp.machineGUID()
async crdtuxp.setPersistData()
```

When creating a new product entry in PluginInstaller, you can embed any (JSON-formatted) capability data.

In your script, you can call `getCapability()` to retrieve this data and determine what 
additional features are enabled or not. If the software is not properly licensed, the `getCapability()`
call will fail and your software can act accordingly.

If the user has a valid activation, the call will succeed.

If you want to have time-limited demo features, you could use `setPersistData/getPersistData` 
optional feature of CRDT.

This data is fairly persistent, and survives reinstalling the software. 

Finding the hiding spots is not all that hard, but the main advantage of this data is that 
when the user figures it out, and clears it, they also clear other unrelated, but valuable 
settings and will have to re-configure their software. 

Clearing the persistent data has annoying consequences, so most users will not want to do this.

Creative users hate having to re-hone their carefully crafted preferences, 
so clearing the persistent data becomes 'too much effort' pretty quick.
