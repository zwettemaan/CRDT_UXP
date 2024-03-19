<a name="module_crdtuxp"></a>

## crdtuxp
Creative Developer Tools (CRDT) is a growing suite of tools aimed at script developers and plug-in developers for the Adobe Creative Cloud eco-system.

Currently, it is at an alpha stage: the feature set is not frozen, and new features are added regularly.

There are two different versions of CRDT: one for UXP/UXPScript and another for ExtendScript.

The software is functional and useful, but without a doubt, there will be bugs and dragons…

Features include:

- Read/Write files beyond the UXP sandbox, including binary files
- Read the environment variables
- Provides a unique machine GUID for each end-user computer
- Provides a unique account GUID for each end user
- Add licensing and activation features to your script
- Protect sensitive source code and make it hard to reverse engineer
- AES-256 encryption/decryption functions
- Base64 encode and decode functions

More to come! You can contact us on dev@rorohiko.com with feature request

For downloading and installation info, visit

https://www.rorohiko.com/crdt

 `crdtuxp` contains a number of useful functions. Some of these functions
are implemented in JavaScript in `crdtux.js` and are synchronous.

Other functions are delegated to a daemon process, and are always asynchronous.

The list of endpoints is further down

`crdtuxp` steps out of the UXP security sandbox - which means that as a developer,
you need to be judicious when using this.

Every solution operates in a unique context. The UXP security measures are
helpful in keeping things secure, but in many situations, they are a massive overkill.

It should be up to the user/developer/IT department to decide how to handle security.

Sometimes the whole workflow can live inside walled garden, on
a disconnected network, without any contact with the outside world and not be allowed to run any
unvetted software.

Or sometimes the OS security is safe enough for the workflow at hand.

In those cases, the UXP security measures are counter-productive: they represent
unnessary hurdles to the software development, or make the user interace clunky and
user-unfriendly.

Using the UXP sandboxing should be a developer-selectable option, not an enforced requirement, and it should
be up to the developer and/or the IT department to decide what is appropriate and what not.


* [crdtuxp](#module_crdtuxp)
    * [~DNS_NAME_FOR_LOCALHOST](#module_crdtuxp..DNS_NAME_FOR_LOCALHOST) : <code>string</code>
    * [~PORT_TIGHTENER_DAEMON](#module_crdtuxp..PORT_TIGHTENER_DAEMON) : <code>number</code>
    * [~TQL_SCOPE_NAME_DEFAULT](#module_crdtuxp..TQL_SCOPE_NAME_DEFAULT) : <code>string</code>
    * [~LOG_LEVEL_OFF](#module_crdtuxp..LOG_LEVEL_OFF) : <code>number</code>
    * [~LOG_LEVEL_ERROR](#module_crdtuxp..LOG_LEVEL_ERROR) : <code>number</code>
    * [~LOG_LEVEL_WARNING](#module_crdtuxp..LOG_LEVEL_WARNING) : <code>number</code>
    * [~LOG_LEVEL_NOTE](#module_crdtuxp..LOG_LEVEL_NOTE) : <code>number</code>
    * [~LOG_LEVEL_TRACE](#module_crdtuxp..LOG_LEVEL_TRACE) : <code>number</code>
    * [~DESKTOP_DIR](#module_crdtuxp..DESKTOP_DIR) : <code>string</code>
    * [~DOCUMENTS_DIR](#module_crdtuxp..DOCUMENTS_DIR) : <code>string</code>
    * [~HOME_DIR](#module_crdtuxp..HOME_DIR) : <code>string</code>
    * [~LOG_DIR](#module_crdtuxp..LOG_DIR) : <code>string</code>
    * [~SYSTEMDATA_DIR](#module_crdtuxp..SYSTEMDATA_DIR) : <code>string</code>
    * [~TMP_DIR](#module_crdtuxp..TMP_DIR) : <code>string</code>
    * [~USERDATA_DIR](#module_crdtuxp..USERDATA_DIR) : <code>string</code>
    * [~base64decode(base64Str)](#module_crdtuxp..base64decode) ⇒ <code>string</code>
    * [~base64encode(s_or_ByteArr)](#module_crdtuxp..base64encode) ⇒ <code>string</code>
    * [~binaryUTF8ToStr(in_byteArray)](#module_crdtuxp..binaryUTF8ToStr) ⇒ <code>string</code>
    * [~decrypt(s_or_ByteArr, aesKey)](#module_crdtuxp..decrypt) ⇒ <code>array</code>
    * [~deQuote(quotedString)](#module_crdtuxp..deQuote) ⇒ <code>array</code>
    * [~dirDelete(filePath, recurse)](#module_crdtuxp..dirDelete) ⇒ <code>boolean</code>
    * [~dirExists(dirPath)](#module_crdtuxp..dirExists) ⇒ <code>boolean</code>
    * [~dirCreate(filePath)](#module_crdtuxp..dirCreate) ⇒ <code>array</code>
    * [~dirScan(filePath)](#module_crdtuxp..dirScan) ⇒ <code>array</code>
    * [~dQ(s_or_ByteArr)](#module_crdtuxp..dQ) ⇒ <code>string</code>
    * [~encrypt(s_or_ByteArr, aesKey)](#module_crdtuxp..encrypt) ⇒ <code>string</code>
    * [~evalTQL(tqlScript, tqlScopeName, resultIsRawBinary)](#module_crdtuxp..evalTQL) ⇒ <code>any</code>
    * [~fileClose(fileHandle)](#module_crdtuxp..fileClose) ⇒ <code>boolean</code>
    * [~fileDelete(filePath)](#module_crdtuxp..fileDelete) ⇒ <code>boolean</code>
    * [~fileExists(filePath)](#module_crdtuxp..fileExists) ⇒ <code>boolean</code>
    * [~fileOpen(fileName, mode)](#module_crdtuxp..fileOpen) ⇒ <code>number</code>
    * [~fileRead(fileHandle, isBinary)](#module_crdtuxp..fileRead) ⇒ <code>any</code>
    * [~fileWrite(fileHandle, s_or_ByteArr)](#module_crdtuxp..fileWrite) ⇒ <code>boolean</code>
    * [~getCapability(issuer, capabilityCode, encryptionKey)](#module_crdtuxp..getCapability) ⇒ <code>string</code>
    * [~getDir(dirTag)](#module_crdtuxp..getDir) ⇒ <code>string</code>
    * [~getEnvironment(envVarName)](#module_crdtuxp..getEnvironment) ⇒ <code>string</code>
    * [~getPluginInstallerPath()](#module_crdtuxp..getPluginInstallerPath) ⇒ <code>string</code>
    * [~getPersistData(issuer, attribute, password)](#module_crdtuxp..getPersistData) ⇒ <code>any</code>
    * [~intPow(i, intPower)](#module_crdtuxp..intPow) ⇒ <code>number</code>
    * [~leftPad(s, padChar, len)](#module_crdtuxp..leftPad) ⇒ <code>string</code>
    * [~pluginInstaller()](#module_crdtuxp..pluginInstaller) ⇒ <code>boolean</code>
    * [~logEntry(reportingFunctionArguments)](#module_crdtuxp..logEntry)
    * [~logError(reportingFunctionArguments, message)](#module_crdtuxp..logError)
    * [~logExit(reportingFunctionArguments)](#module_crdtuxp..logExit)
    * [~functionNameFromArguments(functionArguments)](#module_crdtuxp..functionNameFromArguments) ⇒ <code>string</code>
    * [~logNote(reportingFunctionArguments, message)](#module_crdtuxp..logNote)
    * [~logTrace(reportingFunctionArguments, message)](#module_crdtuxp..logTrace)
    * [~logWarning(arguments, message)](#module_crdtuxp..logWarning)
    * [~machineGUID()](#module_crdtuxp..machineGUID) ⇒ <code>string</code>
    * [~popLogLevel()](#module_crdtuxp..popLogLevel) ⇒ <code>number</code>
    * [~pushLogLevel(newLogLevel)](#module_crdtuxp..pushLogLevel) ⇒ <code>number</code>
    * [~rightPad(s, padChar, len)](#module_crdtuxp..rightPad) ⇒ <code>string</code>
    * [~setIssuer(issuerGUID, issuerEmail)](#module_crdtuxp..setIssuer) ⇒ <code>boolean</code>
    * [~sQ(s_or_ByteArr)](#module_crdtuxp..sQ) ⇒ <code>string</code>
    * [~setPersistData(issuer, attribute, password, data)](#module_crdtuxp..setPersistData) ⇒ <code>boolean</code>
    * [~strToUTF8(in_s)](#module_crdtuxp..strToUTF8) ⇒ <code>array</code>
    * [~sublicense(key, activation)](#module_crdtuxp..sublicense) ⇒ <code>boolean</code>
    * [~toHex(i, numDigits)](#module_crdtuxp..toHex) ⇒ <code>string</code>

<a name="module_crdtuxp..DNS_NAME_FOR_LOCALHOST"></a>

### crdtuxp~DNS\_NAME\_FOR\_LOCALHOST : <code>string</code>
`localhost.tgrg.net` resolves to `127.0.0.1`

The Tightener daemon manages the necessary certificate for https

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..PORT_TIGHTENER_DAEMON"></a>

### crdtuxp~PORT\_TIGHTENER\_DAEMON : <code>number</code>
The Tightener daemon listens for HTTPS connections on port `18888`.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..TQL_SCOPE_NAME_DEFAULT"></a>

### crdtuxp~TQL\_SCOPE\_NAME\_DEFAULT : <code>string</code>
The Tightener daemon provides persistent named scopes (similar to persistent ExtendScript engines).

When executing multiple TQL scripts in succession a named scope will retain any globals that
were defined by a previous script.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..LOG_LEVEL_OFF"></a>

### crdtuxp~LOG\_LEVEL\_OFF : <code>number</code>
Setting log level to `LOG_LEVEL_OFF` causes all log output to be suppressed.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..LOG_LEVEL_ERROR"></a>

### crdtuxp~LOG\_LEVEL\_ERROR : <code>number</code>
Setting log level to `LOG_LEVEL_ERROR` causes all log output to be suppressed,
except for errors.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..LOG_LEVEL_WARNING"></a>

### crdtuxp~LOG\_LEVEL\_WARNING : <code>number</code>
Setting log level to `LOG_LEVEL_WARNING` causes all log output to be suppressed,
except for errors and warnings.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..LOG_LEVEL_NOTE"></a>

### crdtuxp~LOG\_LEVEL\_NOTE : <code>number</code>
Setting log level to `LOG_LEVEL_NOTE` causes all log output to be suppressed,
except for errors, warnings and notes.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..LOG_LEVEL_TRACE"></a>

### crdtuxp~LOG\_LEVEL\_TRACE : <code>number</code>
Setting log level to `LOG_LEVEL_TRACE` causes all log output to be output.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..DESKTOP_DIR"></a>

### crdtuxp~DESKTOP\_DIR : <code>string</code>
Pass `DESKTOP_DIR` into `getDir()` to get the path of the user's Desktop folder.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..DOCUMENTS_DIR"></a>

### crdtuxp~DOCUMENTS\_DIR : <code>string</code>
Pass `DOCUMENTS_DIR` into `getDir()` to get the path of the user's Documents folder.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..HOME_DIR"></a>

### crdtuxp~HOME\_DIR : <code>string</code>
Pass `HOME_DIR` into `getDir()` to get the path of the user's home folder.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..LOG_DIR"></a>

### crdtuxp~LOG\_DIR : <code>string</code>
Pass `LOG_DIR` into `getDir()` to get the path of the Tightener logging folder.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..SYSTEMDATA_DIR"></a>

### crdtuxp~SYSTEMDATA\_DIR : <code>string</code>
Pass `SYSTEMDATA_DIR` into `getDir()` to get the path of the system data folder
(`%PROGRAMDATA%` or `/Library/Application Support`).

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..TMP_DIR"></a>

### crdtuxp~TMP\_DIR : <code>string</code>
Pass `TMP_DIR` into `getDir()` to get the path of the temporary folder.

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..USERDATA_DIR"></a>

### crdtuxp~USERDATA\_DIR : <code>string</code>
Pass `USERDATA_DIR` into `getDir()` to get the path to the user data folder
(`%APPDATA%` or `~/Library/Application Support`).

**Kind**: inner constant of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..base64decode"></a>

### crdtuxp~base64decode(base64Str) ⇒ <code>string</code>
(async) Decode a string that was encoded using base64.

This function has not been speed-tested;
I suspect it might only be beneficial for very large long strings, if that. The overheads might be
larger than the speed benefit.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - decoded string  

| Param | Type | Description |
| --- | --- | --- |
| base64Str | <code>string</code> | base64 encoded string |

<a name="module_crdtuxp..base64encode"></a>

### crdtuxp~base64encode(s_or_ByteArr) ⇒ <code>string</code>
(async) Encode a string or an array of bytes using Base 64 encoding.

This function has not been speed-tested.

I suspect it might only be beneficial for very large long strings, if that. The overheads might be
larger than the speed benefit.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - encoded string  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | either a string or an array containing bytes (0-255). |

<a name="module_crdtuxp..binaryUTF8ToStr"></a>

### crdtuxp~binaryUTF8ToStr(in_byteArray) ⇒ <code>string</code>
(sync) Decode an array of bytes that contains a UTF-8 encoded string.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a string or undefined if the UTF-8 is not valid  

| Param | Type | Description |
| --- | --- | --- |
| in_byteArray | <code>array</code> | an array containing bytes (0-255) for a string using UTF-8 encoding. |

<a name="module_crdtuxp..decrypt"></a>

### crdtuxp~decrypt(s_or_ByteArr, aesKey) ⇒ <code>array</code>
(async) Reverse the operation of the `encrypt()` function.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> - an array of bytes  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a string or an array of bytes |
| aesKey | <code>string</code> | a string or an array of bytes |

<a name="module_crdtuxp..deQuote"></a>

### crdtuxp~deQuote(quotedString) ⇒ <code>array</code>
(sync) Reverse the operation of `dQ()` or `sQ()`.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> - a byte array. If the quoted string contains any `\uHHHH`` codes,
these are first re-encoded using UTF-8 before storing them into the byte array.  

| Param | Type | Description |
| --- | --- | --- |
| quotedString | <code>string</code> | a quoted string |

<a name="module_crdtuxp..dirDelete"></a>

### crdtuxp~dirDelete(filePath, recurse) ⇒ <code>boolean</code>
(async) Delete a directory.

Not limited to the UXP security sandbox.

Be very careful with the `recurse` parameter! It is very easy to delete the wrong directory.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 
| recurse | <code>boolean</code> | 

<a name="module_crdtuxp..dirExists"></a>

### crdtuxp~dirExists(dirPath) ⇒ <code>boolean</code>
(async) Verify whether a directory exists. Will return `false` if the path points to a file (instead of a directory).

Also see `fileExists()`.

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - true or false  

| Param | Type | Description |
| --- | --- | --- |
| dirPath | <code>string</code> | a path to a directory |

<a name="module_crdtuxp..dirCreate"></a>

### crdtuxp~dirCreate(filePath) ⇒ <code>array</code>
(async) Create a directory.

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> - list if items in directory  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..dirScan"></a>

### crdtuxp~dirScan(filePath) ⇒ <code>array</code>
(async) Scan a directory.

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> - list if items in directory  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..dQ"></a>

### crdtuxp~dQ(s_or_ByteArr) ⇒ <code>string</code>
(sync) Wrap a string or a byte array into double quotes, encoding any
binary data as a string. Knows how to handle Unicode characters
or binary zeroes.

When the input is a string, high Unicode characters are
encoded as `\uHHHH`.

When the inoput is a byte array, all bytes are encoded
as characters or as `\xHH` escape sequences.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a string enclosed in double quotes. This string is pure 7-bit
ASCII and can be used into generated script code
Example:
`var script = "a=b(" + dQ(somedata) + ");";`  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a Unicode string or an array of bytes |

<a name="module_crdtuxp..encrypt"></a>

### crdtuxp~encrypt(s_or_ByteArr, aesKey) ⇒ <code>string</code>
(async) Encrypt a string or array of bytes using a key. A random salt
is added into the mix, so even when passing in the same parameter values, the result will
be different every time.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a base-64 encoded encrypted string.  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a string or an array of bytes |
| aesKey | <code>string</code> | a string or an array of bytes |

<a name="module_crdtuxp..evalTQL"></a>

### crdtuxp~evalTQL(tqlScript, tqlScopeName, resultIsRawBinary) ⇒ <code>any</code>
(async) Send a TQL script to the daemon and wait for the result

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>any</code> - a string or a byte array  

| Param | Type | Description |
| --- | --- | --- |
| tqlScript | <code>string</code> | a script to run |
| tqlScopeName | <code>string</code> | a scope name to use. Scopes are persistent for the duration of the daemon process and can be used to pass data between different processes |
| resultIsRawBinary | <code>boolean</code> | whether the resulting data is raw binary, or can be decoded as a string |

<a name="module_crdtuxp..fileClose"></a>

### crdtuxp~fileClose(fileHandle) ⇒ <code>boolean</code>
(async) Close a currently open file

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by `fileOpen()`. |

<a name="module_crdtuxp..fileDelete"></a>

### crdtuxp~fileDelete(filePath) ⇒ <code>boolean</code>
(async) Delete a file

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..fileExists"></a>

### crdtuxp~fileExists(filePath) ⇒ <code>boolean</code>
(async) Check if a file exists. Will return `false` if the file path points to a directory.

Also see `dirExists()`.

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - existence of file  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..fileOpen"></a>

### crdtuxp~fileOpen(fileName, mode) ⇒ <code>number</code>
(async) Open a binary file and return a handle

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - file handle  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | a native full file path to the file |
| mode | <code>string</code> | one of `'a'`, `'r'`, `'w'` (append, read, write) |

<a name="module_crdtuxp..fileRead"></a>

### crdtuxp~fileRead(fileHandle, isBinary) ⇒ <code>any</code>
(async) Read a file into memory

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>any</code> - either a byte array or a string  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by `fileOpen()`. |
| isBinary | <code>boolean</code> | whether the file is considered a binary file (as opposed to a UTF-8 text file) |

<a name="module_crdtuxp..fileWrite"></a>

### crdtuxp~fileWrite(fileHandle, s_or_ByteArr) ⇒ <code>boolean</code>
(async) Binary write to a file. Strings are written as UTF-8

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by `fileOpen()`. |
| s_or_ByteArr | <code>string</code> | data to write to the file |

<a name="module_crdtuxp..getCapability"></a>

### crdtuxp~getCapability(issuer, capabilityCode, encryptionKey) ⇒ <code>string</code>
(async) Query the daemon to see whether some software is currently activated or not

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a JSON-encoded object with meta object (containing customer GUID, seatIndex, decrypted developer-provided data from the activation file).
The decrypted developer data is embedded as a string, so might be two levels of JSON-encoding to be dealt with to get to any JSON-encoded decrypted data  

| Param | Type | Description |
| --- | --- | --- |
| issuer | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| capabilityCode | <code>string</code> | a code for the software features to be activated (as determined by the developer). `capabilityCode` is not the same as `orderProductCode` - there can be multiple `orderProductCode` associated with  a single `capabilityCode` (e.g. `capabilityCode` 'XYZ', `orderProductCode` 'XYZ_1YEAR', 'XYZ_2YEAR'...). |
| encryptionKey | <code>string</code> | the secret encryption key (created by the developer) needed to decode the capability data. You want to make sure this password is obfuscated and contained within encrypted script code. |

<a name="module_crdtuxp..getDir"></a>

### crdtuxp~getDir(dirTag) ⇒ <code>string</code>
(async) Get the path of a system directory

Not limited to the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - file path of dir or undefined. Directory paths include a trailing slash or backslash.  

| Param | Type | Description |
| --- | --- | --- |
| dirTag | <code>string</code> | a tag representing the dir: ```    DESKTOP_DIR    DOCUMENTS_DIR    HOME_DIR    LOG_DIR    SYSTEMDATA_DIR    TMP_DIR    USERDATA_DIR ``` |

<a name="module_crdtuxp..getEnvironment"></a>

### crdtuxp~getEnvironment(envVarName) ⇒ <code>string</code>
(async) Access the environment as seen by the daemon program

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - environment variable value  

| Param | Type | Description |
| --- | --- | --- |
| envVarName | <code>string</code> | name of environment variable |

<a name="module_crdtuxp..getPluginInstallerPath"></a>

### crdtuxp~getPluginInstallerPath() ⇒ <code>string</code>
(async) Get file path to PluginInstaller if it is installed

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - file path  
<a name="module_crdtuxp..getPersistData"></a>

### crdtuxp~getPersistData(issuer, attribute, password) ⇒ <code>any</code>
(async) Query the daemon for persisted data

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>any</code> - whatever persistent data is stored for the given attribute  

| Param | Type | Description |
| --- | --- | --- |
| issuer | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| attribute | <code>string</code> | an attribute name for the data |
| password | <code>string</code> | the password (created by the developer) needed to decode the persistent data |

<a name="module_crdtuxp..intPow"></a>

### crdtuxp~intPow(i, intPower) ⇒ <code>number</code>
(sync) Calculate an integer power of an int value. Avoids using floating point, so
should not have any floating-point round-off errors. `Math.pow()` will probably
give the exact same result, but I am doubtful that some implementations might internally use `log` and `exp`
to handle `Math.pow()`

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - i ^ intPower  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | Integer base |
| intPower | <code>number</code> | integer power |

<a name="module_crdtuxp..leftPad"></a>

### crdtuxp~leftPad(s, padChar, len) ⇒ <code>string</code>
(sync) Extend or shorten a string to an exact length, adding `padChar` as needed

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - padded or shortened string  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | string to be extended or shortened |
| padChar | <code>string</code> | string to append repeatedly if length needs to extended |
| len | <code>number</code> | desired result length |

<a name="module_crdtuxp..pluginInstaller"></a>

### crdtuxp~pluginInstaller() ⇒ <code>boolean</code>
(async) Launch the PluginInstaller if it is installed and configured

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success/failure  
<a name="module_crdtuxp..logEntry"></a>

### crdtuxp~logEntry(reportingFunctionArguments)
(async) Make a log entry of the call of a function. Pass in the `arguments` keyword as a parameter.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |

<a name="module_crdtuxp..logError"></a>

### crdtuxp~logError(reportingFunctionArguments, message)
(async) Make a log entry of an error message. Pass in the `arguments` keyword as the first parameter
If the error level is below `LOG_LEVEL_ERROR` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | error message |

<a name="module_crdtuxp..logExit"></a>

### crdtuxp~logExit(reportingFunctionArguments)
(async) Make a log entry of the exit of a function. Pass in the `arguments` keyword as a parameter.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |

<a name="module_crdtuxp..functionNameFromArguments"></a>

### crdtuxp~functionNameFromArguments(functionArguments) ⇒ <code>string</code>
(sync) Extract the function name from its arguments

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - function name  

| Param | Type | Description |
| --- | --- | --- |
| functionArguments | <code>object</code> | pass in the current `arguments` to the function. This is used to determine the function's name |

<a name="module_crdtuxp..logNote"></a>

### crdtuxp~logNote(reportingFunctionArguments, message)
(async) Make a log entry of a note. Pass in the `arguments` keyword as the first parameter.
If the error level is below `LOG_LEVEL_NOTE` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | the note to output |

<a name="module_crdtuxp..logTrace"></a>

### crdtuxp~logTrace(reportingFunctionArguments, message)
(async) Emit a trace messsage into the log. Pass in the `arguments` keyword as the first parameter.
If the error level is below `LOG_LEVEL_TRACE` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | the trace message to output |

<a name="module_crdtuxp..logWarning"></a>

### crdtuxp~logWarning(arguments, message)
(async) Emit a warning messsage into the log. Pass in the `arguments` keyword as the first parameter.
If the error level is below `LOG_LEVEL_WARNING` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| arguments | <code>array</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | the warning message to output |

<a name="module_crdtuxp..machineGUID"></a>

### crdtuxp~machineGUID() ⇒ <code>string</code>
(async) The unique `GUID` of this computer

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a `GUID` string  
<a name="module_crdtuxp..popLogLevel"></a>

### crdtuxp~popLogLevel() ⇒ <code>number</code>
(sync) Restore the log level to what it was when pushLogLevel was called

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - log level that was popped off the stack  
<a name="module_crdtuxp..pushLogLevel"></a>

### crdtuxp~pushLogLevel(newLogLevel) ⇒ <code>number</code>
(sync) Save the previous log level and set a new log level

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - previous log level  

| Param | Type | Description |
| --- | --- | --- |
| newLogLevel | <code>number</code> | new log level to set |

<a name="module_crdtuxp..rightPad"></a>

### crdtuxp~rightPad(s, padChar, len) ⇒ <code>string</code>
(sync) Extend or shorten a string to an exact length, adding `padChar` as needed

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - padded or shortened string  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | string to be extended or shortened |
| padChar | <code>string</code> | string to append repeatedly if length needs to extended |
| len | <code>number</code> | desired result length |

<a name="module_crdtuxp..setIssuer"></a>

### crdtuxp~setIssuer(issuerGUID, issuerEmail) ⇒ <code>boolean</code>
(async) Send in activation data so the daemon can determine whether some software is currently activated or not.

Needs to be followed by a `sublicense()` call

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| issuerGUID | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| issuerEmail | <code>string</code> | the email for the developer account as seen in the PluginInstaller |

<a name="module_crdtuxp..sQ"></a>

### crdtuxp~sQ(s_or_ByteArr) ⇒ <code>string</code>
(sync) Wrap a string or a byte array into single quotes, encoding any
binary data as a string. Knows how to handle Unicode characters
or binary zeroes.

When the input is a string, high Unicode characters are
encoded as `\uHHHH`

When the input is a byte array, all bytes are encoded as `\xHH` escape sequences.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a string enclosed in double quotes. This string is pure 7-bit
ASCII and can be used into generated script code
Example:
`var script = "a=b(" + sQ(somedata) + ");";`  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a Unicode string or an array of bytes |

<a name="module_crdtuxp..setPersistData"></a>

### crdtuxp~setPersistData(issuer, attribute, password, data) ⇒ <code>boolean</code>
(async) Store some persistent data (e.g. a time stamp to determine a demo version lapsing)

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| issuer | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| attribute | <code>string</code> | an attribute name for the data |
| password | <code>string</code> | the password (created by the developer) needed to decode the persistent data |
| data | <code>string</code> | any data to persist |

<a name="module_crdtuxp..strToUTF8"></a>

### crdtuxp~strToUTF8(in_s) ⇒ <code>array</code>
(sync) Encode a string into an byte array using UTF-8

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> - a byte array  

| Param | Type | Description |
| --- | --- | --- |
| in_s | <code>string</code> | a string |

<a name="module_crdtuxp..sublicense"></a>

### crdtuxp~sublicense(key, activation) ⇒ <code>boolean</code>
(async) Send in sublicense info generated in the PluginInstaller so the daemon can determine whether some software is currently activated or not.

Needs to be preceded by a `setIssuer()` call.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key needed to decode activation data |
| activation | <code>string</code> | encrypted activation data |

<a name="module_crdtuxp..toHex"></a>

### crdtuxp~toHex(i, numDigits) ⇒ <code>string</code>
(sync) Convert an integer into a hex representation with a fixed number of digits.
Negative numbers are converted using 2-s complement (so `-15` results in `0x01`)

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - hex-encoded integer  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | integer to convert to hex |
| numDigits | <code>number</code> | How many digits. Defaults to 4 if omitted. |

