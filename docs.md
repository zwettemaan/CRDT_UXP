<a name="module_crdtuxp"></a>

## crdtuxp
Creative Developer Tools (CRDT) is a growing suite of tools aimed at script developers and plug-in developers for the Adobe Creative Cloud eco-system.

There are two different versions of CRDT: one for UXP/UXPScript and another for ExtendScript.

For downloading and installation info, visit

https://CreativeDeveloperTools.com

 `crdtuxp` contains a number of useful functions. Some of these functions
are implemented in JavaScript in `crdtux.js` and are synchronous.

Other functions are delegated to a daemon process, and are always asynchronous.

The list of endpoints is further down

`crdtuxp` steps out of the UXP security sandbox - which means that as a developer,
you need to be judicious when using this.

Every solution operates in a unique context. The UXP security measures are
helpful in keeping things secure, but in many situations, they are a massive overkill.

It should be up to the user/developer/IT department to decide how to handle security.

Sometimes the whole workflow can live inside walled garden, on a disconnected network, 
without any contact with the outside world and not be allowed to run any
unvetted software.

Or sometimes the OS security is safe enough for the workflow at hand.

In those cases, the UXP security measures are counter-productive: they represent
unnessary hurdles to the software development, or make the user interace clunky and
user-unfriendly.

Using the UXP sandboxing should be a developer-selectable option, not an enforced requirement, and it should
be up to the developer and/or the IT department to decide what is appropriate and what not.


* [crdtuxp](#module_crdtuxp)
    * _static_
        * [.UNIT_NAME_NONE](#module_crdtuxp.UNIT_NAME_NONE)
        * [.UNIT_NAME_INCH](#module_crdtuxp.UNIT_NAME_INCH)
        * [.UNIT_NAME_CM](#module_crdtuxp.UNIT_NAME_CM)
        * [.UNIT_NAME_MM](#module_crdtuxp.UNIT_NAME_MM)
        * [.UNIT_NAME_CICERO](#module_crdtuxp.UNIT_NAME_CICERO)
        * [.UNIT_NAME_PICA](#module_crdtuxp.UNIT_NAME_PICA)
        * [.UNIT_NAME_PIXEL](#module_crdtuxp.UNIT_NAME_PIXEL)
        * [.UNIT_NAME_POINT](#module_crdtuxp.UNIT_NAME_POINT)
    * _inner_
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
        * [~addTrailingSeparator(filePath, [separator])](#module_crdtuxp..addTrailingSeparator) ⇒
        * [~alert(message)](#module_crdtuxp..alert) ⇒ <code>Promise.&lt;any&gt;</code>
        * [~base64decode(base64Str, [options])](#module_crdtuxp..base64decode) ⇒ <code>Promise.&lt;(string\|array\|undefined)&gt;</code>
        * [~base64encode(s_or_ByteArr, [options])](#module_crdtuxp..base64encode) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
        * [~baseName(filePath, [separator])](#module_crdtuxp..baseName) ⇒ <code>string</code>
        * [~binaryUTF8ToStr(in_byteArray)](#module_crdtuxp..binaryUTF8ToStr) ⇒ <code>string</code> \| <code>undefined</code>
        * [~byteArrayToRawString(in_byteArray)](#module_crdtuxp..byteArrayToRawString) ⇒ <code>string</code> \| <code>undefined</code>
        * [~charCodeToUTF8__(in_charCode)](#module_crdtuxp..charCodeToUTF8__) ⇒ <code>array</code>
        * [~configLogger(logInfo)](#module_crdtuxp..configLogger) ⇒ <code>boolean</code>
        * [~consoleLog(...args)](#module_crdtuxp..consoleLog)
        * [~decrypt(s_or_ByteArr, aesKey)](#module_crdtuxp..decrypt) ⇒ <code>Promise.&lt;(Array\|undefined)&gt;</code>
        * [~delayFunction(delayTimeMilliseconds, ftn, ...args)](#module_crdtuxp..delayFunction) ⇒ <code>Promise.&lt;any&gt;</code>
        * [~deQuote(quotedString)](#module_crdtuxp..deQuote) ⇒ <code>array</code>
        * [~dirCreate(filePath)](#module_crdtuxp..dirCreate) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~dirDelete(filePath, recurse)](#module_crdtuxp..dirDelete) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~dirExists(dirPath)](#module_crdtuxp..dirExists) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~dirName(filePath, [options], [separator])](#module_crdtuxp..dirName) ⇒
        * [~dirScan(filePath)](#module_crdtuxp..dirScan) ⇒ <code>Promise.&lt;(Array\|undefined)&gt;</code>
        * [~dQ(s_or_ByteArr)](#module_crdtuxp..dQ) ⇒ <code>string</code>
        * [~encrypt(s_or_ByteArr, aesKey, [aesIV])](#module_crdtuxp..encrypt) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
        * [~evalTQL(tqlScript, [tqlScopeName], [options])](#module_crdtuxp..evalTQL) ⇒ <code>Promise.&lt;any&gt;</code>
        * [~fileAppend_(filePath, data)](#module_crdtuxp..fileAppend_)
        * [~fileAppendString(fileName, appendStr, [options])](#module_crdtuxp..fileAppendString) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~fileClose(fileHandle)](#module_crdtuxp..fileClose) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~fileDelete(filePath)](#module_crdtuxp..fileDelete) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~fileExists(filePath)](#module_crdtuxp..fileExists) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~fileNameExtension(filePath, [separator])](#module_crdtuxp..fileNameExtension) ⇒
        * [~fileOpen(filePath, mode)](#module_crdtuxp..fileOpen) ⇒ <code>Promise.&lt;(Number\|undefined)&gt;</code>
        * [~fileRead(fileHandle, options)](#module_crdtuxp..fileRead) ⇒ <code>Promise.&lt;any&gt;</code>
        * [~fileWrite(fileHandle, s_or_ByteArr)](#module_crdtuxp..fileWrite) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~finalize()](#module_crdtuxp..finalize)
        * [~functionNameFromArguments(functionArguments)](#module_crdtuxp..functionNameFromArguments) ⇒ <code>string</code>
        * [~getBooleanFromINI(in_value)](#module_crdtuxp..getBooleanFromINI) ⇒ <code>boolean</code>
        * [~getCapability(issuer, capabilityCode, encryptionKey)](#module_crdtuxp..getCapability) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
        * [~getCreativeDeveloperToolsLevel()](#module_crdtuxp..getCreativeDeveloperToolsLevel) ⇒ <code>Promise.&lt;(Number\|undefined)&gt;</code>
        * [~getDir(dirTag)](#module_crdtuxp..getDir) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
        * [~getEnvironment(envVarName)](#module_crdtuxp..getEnvironment) ⇒ <code>Promise.&lt;string&gt;</code>
        * [~getFloatWithUnitFromINI(in_valueStr, [in_convertToUnit])](#module_crdtuxp..getFloatWithUnitFromINI) ⇒ <code>number</code>
        * [~getFloatValuesFromINI(in_valueStr)](#module_crdtuxp..getFloatValuesFromINI) ⇒ <code>array</code> \| <code>undefined</code>
        * [~getIntValuesFromINI(in_valueStr)](#module_crdtuxp..getIntValuesFromINI) ⇒ <code>array</code> \| <code>undefined</code>
        * [~getPersistData(issuer, attribute, password)](#module_crdtuxp..getPersistData) ⇒ <code>Promise.&lt;any&gt;</code>
        * [~getPluginInstallerPath()](#module_crdtuxp..getPluginInstallerPath) ⇒ <code>Promise.&lt;string&gt;</code>
        * [~getSysInfo__()](#module_crdtuxp..getSysInfo__) ⇒ <code>object</code>
        * [~getUnitFromINI(in_value, in_defaultUnit)](#module_crdtuxp..getUnitFromINI) ⇒ <code>string</code>
        * [~getContext()](#module_crdtuxp..getContext) ⇒ <code>object</code>
        * [~getUXPContext()](#module_crdtuxp..getUXPContext) ⇒ <code>object</code>
        * [~init()](#module_crdtuxp..init) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~injectProxyPromiseClass()](#module_crdtuxp..injectProxyPromiseClass)
        * [~intPow(i, intPower)](#module_crdtuxp..intPow) ⇒ <code>number</code> \| <code>undefined</code>
        * [~leftPad(s, padChar, len)](#module_crdtuxp..leftPad) ⇒ <code>string</code>
        * [~logEntry(reportingFunctionArguments)](#module_crdtuxp..logEntry) ⇒ <code>Promise</code>
        * [~logError(reportingFunctionArguments, message)](#module_crdtuxp..logError) ⇒ <code>Promise</code>
        * [~logExit(reportingFunctionArguments)](#module_crdtuxp..logExit) ⇒ <code>Promise</code>
        * [~logMessage(reportingFunctionArguments, logLevel, message)](#module_crdtuxp..logMessage) ⇒ <code>Promise</code>
        * [~logNote(reportingFunctionArguments, message)](#module_crdtuxp..logNote) ⇒ <code>Promise</code>
        * [~logTrace(reportingFunctionArguments, message)](#module_crdtuxp..logTrace) ⇒ <code>Promise</code>
        * [~logWarning(reportingFunctionArguments, message)](#module_crdtuxp..logWarning)
        * [~machineGUID()](#module_crdtuxp..machineGUID) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
        * [~pluginInstaller()](#module_crdtuxp..pluginInstaller) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~popLogLevel()](#module_crdtuxp..popLogLevel) ⇒ <code>number</code>
        * [~promisify(ftn)](#module_crdtuxp..promisify) ⇒ <code>function</code>
        * [~promisifyWithContext(ftn)](#module_crdtuxp..promisifyWithContext) ⇒ <code>function</code>
        * [~pushLogLevel(newLogLevel)](#module_crdtuxp..pushLogLevel) ⇒ <code>number</code>
        * [~rawStringToByteArray(in_str)](#module_crdtuxp..rawStringToByteArray) ⇒ <code>array</code> \| <code>undefined</code>
        * [~readINI(in_text)](#module_crdtuxp..readINI) ⇒ <code>object</code>
        * [~rightPad(s, padChar, len)](#module_crdtuxp..rightPad) ⇒ <code>string</code>
        * [~s(stringCode, [locale])](#module_crdtuxp..s) ⇒ <code>string</code>
        * [~setIssuer(issuerGUID, issuerEmail)](#module_crdtuxp..setIssuer) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~sQ(s_or_ByteArr)](#module_crdtuxp..sQ) ⇒ <code>string</code>
        * [~setPersistData(issuer, attribute, password, data)](#module_crdtuxp..setPersistData) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~stripTrailingSeparator(filePath, [separator])](#module_crdtuxp..stripTrailingSeparator) ⇒
        * [~strToUTF8(in_s)](#module_crdtuxp..strToUTF8) ⇒ <code>array</code> \| <code>undefined</code>
        * [~sublicense(key, activation)](#module_crdtuxp..sublicense) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~testDirectFileAccess()](#module_crdtuxp..testDirectFileAccess) ⇒ <code>boolean</code>
        * [~testNetworkAccess()](#module_crdtuxp..testNetworkAccess) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
        * [~toHex(i, numDigits)](#module_crdtuxp..toHex) ⇒ <code>string</code>
        * [~unitToInchFactor(in_unit)](#module_crdtuxp..unitToInchFactor) ⇒ <code>number</code>
        * [~waitForFile(filePath, [interval], [timeout])](#module_crdtuxp..waitForFile) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>

<a name="module_crdtuxp.UNIT_NAME_NONE"></a>

### crdtuxp.UNIT\_NAME\_NONE
`UNIT_NAME_NONE` represents unit-less values.

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp.UNIT_NAME_INCH"></a>

### crdtuxp.UNIT\_NAME\_INCH
`UNIT_NAME_INCH` for inches.

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp.UNIT_NAME_CM"></a>

### crdtuxp.UNIT\_NAME\_CM
`UNIT_NAME_CM` for centimeters

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp.UNIT_NAME_MM"></a>

### crdtuxp.UNIT\_NAME\_MM
`UNIT_NAME_MM` for millimeters

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp.UNIT_NAME_CICERO"></a>

### crdtuxp.UNIT\_NAME\_CICERO
`UNIT_NAME_CICERO` for ciceros

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp.UNIT_NAME_PICA"></a>

### crdtuxp.UNIT\_NAME\_PICA
`UNIT_NAME_PICA` for picas

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp.UNIT_NAME_PIXEL"></a>

### crdtuxp.UNIT\_NAME\_PIXEL
`UNIT_NAME_PIXEL` for pixels

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp.UNIT_NAME_POINT"></a>

### crdtuxp.UNIT\_NAME\_POINT
`UNIT_NAME_POINT` for points

**Kind**: static property of [<code>crdtuxp</code>](#module_crdtuxp)  
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
<a name="module_crdtuxp..addTrailingSeparator"></a>

### crdtuxp~addTrailingSeparator(filePath, [separator]) ⇒
Make sure a path ends in a trailing separator (helps identify directory paths)

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: file path with a terminating separator  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | a file path |
| [separator] | <code>string</code> | the separator to use. If omitted, will try  guess the separator. |

<a name="module_crdtuxp..alert"></a>

### crdtuxp~alert(message) ⇒ <code>Promise.&lt;any&gt;</code>
Show an alert.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | string to display |

<a name="module_crdtuxp..base64decode"></a>

### crdtuxp~base64decode(base64Str, [options]) ⇒ <code>Promise.&lt;(string\|array\|undefined)&gt;</code>
Decode a string that was encoded using base64.

The evalTQL variant of the function has not been speed-tested; it's mainly for 
testing things.

I suspect it might only be beneficial for very large long strings, if that. 
The overheads might be larger than the speed benefit.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(string\|array\|undefined)&gt;</code> - decoded string  

| Param | Type | Description |
| --- | --- | --- |
| base64Str | <code>string</code> | base64 encoded string |
| [options] | <code>object</code> | options: {   isBinary: true/false, default false,   forceNetworkAPI: true/false, default false } |

<a name="module_crdtuxp..base64encode"></a>

### crdtuxp~base64encode(s_or_ByteArr, [options]) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
Encode a string or an array of bytes using Base 64 encoding.

The evalTQL variant of the function has not been speed-tested; it's mainly for 
testing things.

I suspect it might only be beneficial for very large long strings, if that. 
The overheads might be larger than the speed benefit.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - encoded string  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | either a string or an array containing bytes (0-255). |
| [options] | <code>object</code> | options: {   forceNetworkAPI: true/false, default false } |

<a name="module_crdtuxp..baseName"></a>

### crdtuxp~baseName(filePath, [separator]) ⇒ <code>string</code>
Get the last segment of a path

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - the last segment of the path  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | a file path |
| [separator] | <code>string</code> | the separator to use. If omitted, will try  guess the separator. |

<a name="module_crdtuxp..binaryUTF8ToStr"></a>

### crdtuxp~binaryUTF8ToStr(in_byteArray) ⇒ <code>string</code> \| <code>undefined</code>
Decode an array of bytes that contains a UTF-8 encoded string.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> \| <code>undefined</code> - a string or undefined if the UTF-8 is not valid  

| Param | Type | Description |
| --- | --- | --- |
| in_byteArray | <code>array</code> | an array containing bytes (0-255) for a string using UTF-8 encoding. |

<a name="module_crdtuxp..byteArrayToRawString"></a>

### crdtuxp~byteArrayToRawString(in_byteArray) ⇒ <code>string</code> \| <code>undefined</code>
Make a byte array into a 'fake string'. Not UTF8-aware

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> \| <code>undefined</code> - a string with the exact same bytes  

| Param | Type | Description |
| --- | --- | --- |
| in_byteArray | <code>string</code> | a byte array |

<a name="module_crdtuxp..charCodeToUTF8__"></a>

### crdtuxp~charCodeToUTF8\_\_(in_charCode) ⇒ <code>array</code>
Internal: convert a Unicode character code to a 1 to 3 byte UTF8 byte sequence

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> - an array with 1 to 3 bytes  

| Param | Type | Description |
| --- | --- | --- |
| in_charCode | <code>number</code> | a Unicode character code |

<a name="module_crdtuxp..configLogger"></a>

### crdtuxp~configLogger(logInfo) ⇒ <code>boolean</code>
Configure the logger

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - success/failure  

| Param | Type | Description |
| --- | --- | --- |
| logInfo | <code>object</code> | object with logger setup info     logLevel: 0-4     logEntryExit: boolean     logToUXPConsole: boolean     logToCRDT: boolean     logToFilePath: undefined or a file path for logging |

<a name="module_crdtuxp..consoleLog"></a>

### crdtuxp~consoleLog(...args)
Bottleneck for consoleLog

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | args for function |

<a name="module_crdtuxp..decrypt"></a>

### crdtuxp~decrypt(s_or_ByteArr, aesKey) ⇒ <code>Promise.&lt;(Array\|undefined)&gt;</code>
Reverse the operation of the `encrypt()` function.

Only available to paid developer accounts

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(Array\|undefined)&gt;</code> - an array of bytes  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a string or an array of bytes |
| aesKey | <code>string</code> | a string or an array of bytes |

<a name="module_crdtuxp..delayFunction"></a>

### crdtuxp~delayFunction(delayTimeMilliseconds, ftn, ...args) ⇒ <code>Promise.&lt;any&gt;</code>
Delayed execution of a function

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| delayTimeMilliseconds | <code>number</code> | a delay in milliseconds |
| ftn | <code>function</code> | a function |
| ...args | <code>\*</code> | optional args for function |

<a name="module_crdtuxp..deQuote"></a>

### crdtuxp~deQuote(quotedString) ⇒ <code>array</code>
Reverse the operation of `dQ()` or `sQ()`.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> - a byte array. If the quoted string contains any `\uHHHH`` codes,
these are first re-encoded using UTF-8 before storing them into the byte array.  

| Param | Type | Description |
| --- | --- | --- |
| quotedString | <code>string</code> | a quoted string |

<a name="module_crdtuxp..dirCreate"></a>

### crdtuxp~dirCreate(filePath) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Create a directory.

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..dirDelete"></a>

### crdtuxp~dirDelete(filePath, recurse) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Delete a directory.

Not restricted by the UXP security sandbox.

Be very careful with the `recurse` parameter! It is very easy to delete the wrong 
directory.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 
| recurse | <code>boolean</code> | 

<a name="module_crdtuxp..dirExists"></a>

### crdtuxp~dirExists(dirPath) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Verify whether a directory exists. Will return `false` if the path points to a file 
(instead of a directory).

Also see `fileExists()`.

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| dirPath | <code>string</code> | a path to a directory |

<a name="module_crdtuxp..dirName"></a>

### crdtuxp~dirName(filePath, [options], [separator]) ⇒
Get the parent directory of a path

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: the parent of the path  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | a file path |
| [options] | <code>object</code> | options:  {    addTrailingSeparator: true/false, default false,   separator: separatorchar. the separator to use. If omitted, will try to guess the    separator. } |
| [separator] | <code>string</code> | - |

<a name="module_crdtuxp..dirScan"></a>

### crdtuxp~dirScan(filePath) ⇒ <code>Promise.&lt;(Array\|undefined)&gt;</code>
Scan a directory.

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(Array\|undefined)&gt;</code> - list of items in directory  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..dQ"></a>

### crdtuxp~dQ(s_or_ByteArr) ⇒ <code>string</code>
Wrap a string or a byte array into double quotes, encoding any
binary data as a string. Knows how to handle Unicode characters
or binary zeroes.

When the input is a string, high Unicode characters are
encoded as `\uHHHH`.

When the input is a byte array, all bytes are encoded
as characters or as `\xHH` escape sequences.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a string enclosed in double quotes. This string is pure 7-bit
ASCII and can be used into generated script code
Example:
`let script = "a=b(" + dQ(somedata) + ");";`  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> \| <code>Array</code> | a Unicode string or an array of bytes |

<a name="module_crdtuxp..encrypt"></a>

### crdtuxp~encrypt(s_or_ByteArr, aesKey, [aesIV]) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
Encrypt a string or array of bytes using a key. A random salt
is added into the mix, so even when passing in the same parameter values, the result will
be different every time.

Only available to paid developer accounts

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - a base-64 encoded encrypted string.  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a string or an array of bytes |
| aesKey | <code>string</code> | a string or an array of bytes, key |
| [aesIV] | <code>string</code> | a string or an array of bytes, initial vector |

<a name="module_crdtuxp..evalTQL"></a>

### crdtuxp~evalTQL(tqlScript, [tqlScopeName], [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Send a TQL script to the daemon and wait for the result

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;any&gt;</code> - a string or a byte array  

| Param | Type | Description |
| --- | --- | --- |
| tqlScript | <code>string</code> | a script to run |
| [tqlScopeName] | <code>string</code> | a scope name to use. Scopes are persistent for the  duration of the daemon process and can be used to pass data between different  processes |
| [options] | <code>object</code> | optional.    options.wait when false don't wait to resolve, default true   options.isBinary default false   options.forceNetworkAPI default false; override uxpContext.hasNetworkAccess   options.tqlScopeName default TQL_SCOPE_NAME_DEFAULT or can be decoded as a string |

<a name="module_crdtuxp..fileAppend_"></a>

### crdtuxp~fileAppend\_(filePath, data)
(Internal) Inefficient file append, for debugging use

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | file to append to |
| data | <code>string</code> | string to append |

<a name="module_crdtuxp..fileAppendString"></a>

### crdtuxp~fileAppendString(fileName, appendStr, [options]) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Append a string to a file (useful for logging)

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | path to file |
| appendStr | <code>string</code> | data to append. If a newline is needed it needs to be part of appendStr |
| [options] | <code>object</code> | {      options.wait = false means don't wait to resolve } |

<a name="module_crdtuxp..fileClose"></a>

### crdtuxp~fileClose(fileHandle) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Close a currently open file

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by `fileOpen()`. |

<a name="module_crdtuxp..fileDelete"></a>

### crdtuxp~fileDelete(filePath) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Delete a file

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..fileExists"></a>

### crdtuxp~fileExists(filePath) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Check if a file exists. Will return `false` if the file path points to a directory.

Also see `dirExists()`.

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - existence of file  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="module_crdtuxp..fileNameExtension"></a>

### crdtuxp~fileNameExtension(filePath, [separator]) ⇒
Get the file name extension of a path

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: the lowercased file name extension, without leading period  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | a file path |
| [separator] | <code>string</code> | the separator to use. If omitted, will try  guess the separator. |

<a name="module_crdtuxp..fileOpen"></a>

### crdtuxp~fileOpen(filePath, mode) ⇒ <code>Promise.&lt;(Number\|undefined)&gt;</code>
Open a binary file and return a handle

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(Number\|undefined)&gt;</code> - file handle  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | a native full file path to the file |
| mode | <code>string</code> | one of `'a'`, `'r'`, `'w'` (append, read, write) |

<a name="module_crdtuxp..fileRead"></a>

### crdtuxp~fileRead(fileHandle, options) ⇒ <code>Promise.&lt;any&gt;</code>
Read a file into memory

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;any&gt;</code> - either a byte array or a string  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by `fileOpen()`. |
| options | <code>boolean</code> \| <code>object</code> | options: { isBinary: true/false, default false } |

<a name="module_crdtuxp..fileWrite"></a>

### crdtuxp~fileWrite(fileHandle, s_or_ByteArr) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Binary write to a file. Strings are written as UTF-8

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by `fileOpen()`. |
| s_or_ByteArr | <code>string</code> \| <code>Array</code> | data to write to the file |

<a name="module_crdtuxp..finalize"></a>

### crdtuxp~finalize()
Terminate crdtuxp

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..functionNameFromArguments"></a>

### crdtuxp~functionNameFromArguments(functionArguments) ⇒ <code>string</code>
Extract the function name from its arguments

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - function name  

| Param | Type | Description |
| --- | --- | --- |
| functionArguments | <code>object</code> | pass in the current `arguments` to the function. This is used to determine the function's name |

<a name="module_crdtuxp..getBooleanFromINI"></a>

### crdtuxp~getBooleanFromINI(in_value) ⇒ <code>boolean</code>
Interpret a value extracted from some INI data as a boolean. Things like y, n, yes, no, true, false, t, f, 0, 1

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - value  

| Param | Type | Description |
| --- | --- | --- |
| in_value | <code>string</code> | ini value |

<a name="module_crdtuxp..getCapability"></a>

### crdtuxp~getCapability(issuer, capabilityCode, encryptionKey) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
Query the daemon to see whether some software is currently activated or not

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - a JSON-encoded object with meta object (containing customer GUID, seatIndex, decrypted developer-provided data from the activation file).
The decrypted developer data is embedded as a string, so might be two levels of JSON-encoding to be dealt with to get to any JSON-encoded decrypted data  

| Param | Type | Description |
| --- | --- | --- |
| issuer | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| capabilityCode | <code>string</code> | a code for the software features to be activated (as determined by the developer who owns the account). `capabilityCode` is not the same as `orderProductCode` - there can be multiple `orderProductCode` associated with  a single `capabilityCode` (e.g. `capabilityCode` 'XYZ', `orderProductCode` 'XYZ_1YEAR', 'XYZ_2YEAR'...). |
| encryptionKey | <code>string</code> | the secret encryption key (created by the developer) needed to decode the capability data. You want to make sure this password is obfuscated and contained within encrypted script code. |

<a name="module_crdtuxp..getCreativeDeveloperToolsLevel"></a>

### crdtuxp~getCreativeDeveloperToolsLevel() ⇒ <code>Promise.&lt;(Number\|undefined)&gt;</code>
Determine the license level for CRDT: 0 = not, 1 = basic, 2 = full

Some functions, marked with "Only available to paid developer accounts" 
will only work with level 2. Licensing function only work with level 1

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(Number\|undefined)&gt;</code> - - 0, 1 or 2. -1 means: error  
<a name="module_crdtuxp..getDir"></a>

### crdtuxp~getDir(dirTag) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
Get the path of a system directory

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - file path of dir or undefined. Directory paths include a trailing slash or backslash.  

| Param | Type | Description |
| --- | --- | --- |
| dirTag | <code>string</code> | a tag representing the dir: ```    DESKTOP_DIR    DOCUMENTS_DIR    HOME_DIR    LOG_DIR    SYSTEMDATA_DIR    TMP_DIR    USERDATA_DIR ``` |

<a name="module_crdtuxp..getEnvironment"></a>

### crdtuxp~getEnvironment(envVarName) ⇒ <code>Promise.&lt;string&gt;</code>
Access the environment as available to the daemon program

Not restricted by the UXP security sandbox.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;string&gt;</code> - environment variable value  

| Param | Type | Description |
| --- | --- | --- |
| envVarName | <code>string</code> | name of environment variable |

<a name="module_crdtuxp..getFloatWithUnitFromINI"></a>

### crdtuxp~getFloatWithUnitFromINI(in_valueStr, [in_convertToUnit]) ⇒ <code>number</code>
Interpret a string extracted from some INI data as a floating point value, followed by an optional unit
If there is no unit, then no conversion is performed.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - value  

| Param | Type | Description |
| --- | --- | --- |
| in_valueStr | <code>string</code> | ini value |
| [in_convertToUnit] | <code>string</code> | default to use if no match is found |

<a name="module_crdtuxp..getFloatValuesFromINI"></a>

### crdtuxp~getFloatValuesFromINI(in_valueStr) ⇒ <code>array</code> \| <code>undefined</code>
Interpret a string extracted from some INI data as an array with float values (e.g. "[ 255, 128.2, 1.7]" )

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> \| <code>undefined</code> - array of numbers or undefined  

| Param | Type | Description |
| --- | --- | --- |
| in_valueStr | <code>string</code> | ini value |

<a name="module_crdtuxp..getIntValuesFromINI"></a>

### crdtuxp~getIntValuesFromINI(in_valueStr) ⇒ <code>array</code> \| <code>undefined</code>
Interpret a string extracted from some INI data as an array with int values (e.g. "[ 255, 128, 1]" )

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> \| <code>undefined</code> - array of ints or undefined  

| Param | Type | Description |
| --- | --- | --- |
| in_valueStr | <code>string</code> | ini value |

<a name="module_crdtuxp..getPersistData"></a>

### crdtuxp~getPersistData(issuer, attribute, password) ⇒ <code>Promise.&lt;any&gt;</code>
Query the daemon for persisted data

Only available to paid developer accounts

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;any&gt;</code> - whatever persistent data is stored for the given attribute  

| Param | Type | Description |
| --- | --- | --- |
| issuer | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| attribute | <code>string</code> | an attribute name for the data |
| password | <code>string</code> | the password (created by the developer) needed to decode the persistent data |

<a name="module_crdtuxp..getPluginInstallerPath"></a>

### crdtuxp~getPluginInstallerPath() ⇒ <code>Promise.&lt;string&gt;</code>
Get file path to PluginInstaller if it is installed

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;string&gt;</code> - file path  
<a name="module_crdtuxp..getSysInfo__"></a>

### crdtuxp~getSysInfo\_\_() ⇒ <code>object</code>
Internal function. Query the Tightener daemon for system information

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>object</code> - system info  
<a name="module_crdtuxp..getUnitFromINI"></a>

### crdtuxp~getUnitFromINI(in_value, in_defaultUnit) ⇒ <code>string</code>
Interpret a string extracted from some INI data as a unit name

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - value  

| Param | Type | Description |
| --- | --- | --- |
| in_value | <code>string</code> | ini value |
| in_defaultUnit | <code>string</code> | default to use if no match is found |

<a name="module_crdtuxp..getContext"></a>

### crdtuxp~getContext() ⇒ <code>object</code>
Get our bearings and figure out what operating system context we're operating in.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>object</code> - context  
<a name="module_crdtuxp..getUXPContext"></a>

### crdtuxp~getUXPContext() ⇒ <code>object</code>
Get our bearings and figure out what context we're operating in. Depending on the context
we will or won't have access to certain features

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>object</code> - context  
<a name="module_crdtuxp..init"></a>

### crdtuxp~init() ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Initialize crdtuxp

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - when true: valid issuer has made CRDT_UXP extra features available  
<a name="module_crdtuxp..injectProxyPromiseClass"></a>

### crdtuxp~injectProxyPromiseClass()
Wrap the system Promise with a new Promise class that allows us to track pending promises

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
<a name="module_crdtuxp..intPow"></a>

### crdtuxp~intPow(i, intPower) ⇒ <code>number</code> \| <code>undefined</code>
Calculate an integer power of an int value. Avoids using floating point, so
should not have any floating-point round-off errors. `Math.pow()` will probably
give the exact same result, but I am doubtful that some implementations might internally use `log` and `exp`
to handle `Math.pow()`

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> \| <code>undefined</code> - i ^ intPower  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | Integer base |
| intPower | <code>number</code> | integer power |

<a name="module_crdtuxp..leftPad"></a>

### crdtuxp~leftPad(s, padChar, len) ⇒ <code>string</code>
Extend or shorten a string to an exact length, adding `padChar` as needed

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - padded or shortened string  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | string to be extended or shortened |
| padChar | <code>string</code> | string to append repeatedly if length needs to extended |
| len | <code>number</code> | desired result length |

<a name="module_crdtuxp..logEntry"></a>

### crdtuxp~logEntry(reportingFunctionArguments) ⇒ <code>Promise</code>
Make a log entry of the call of a function. Pass in the `arguments` keyword as a parameter.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise</code> - - a promise that can be used to await the log call completion  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |

<a name="module_crdtuxp..logError"></a>

### crdtuxp~logError(reportingFunctionArguments, message) ⇒ <code>Promise</code>
Make a log entry of an error message. Pass in the `arguments` keyword as the first parameter
If the error level is below `LOG_LEVEL_ERROR` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise</code> - - a promise that can be used to await the log call completion  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>any</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>any</code> | error message |

<a name="module_crdtuxp..logExit"></a>

### crdtuxp~logExit(reportingFunctionArguments) ⇒ <code>Promise</code>
Make a log entry of the exit of a function. Pass in the `arguments` keyword as a parameter.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise</code> - - a promise that can be used to await the log call completion  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>any</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |

<a name="module_crdtuxp..logMessage"></a>

### crdtuxp~logMessage(reportingFunctionArguments, logLevel, message) ⇒ <code>Promise</code>
Output a log message. Pass in the `arguments` keyword as the first parameter.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise</code> - - a promise that can be used to await the log call completion  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>any</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| logLevel | <code>number</code> | log level 0 - 4 |
| message | <code>string</code> | the note to output |

<a name="module_crdtuxp..logNote"></a>

### crdtuxp~logNote(reportingFunctionArguments, message) ⇒ <code>Promise</code>
Make a log entry of a note. Pass in the `arguments` keyword as the first parameter.
If the error level is below `LOG_LEVEL_NOTE` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise</code> - - a promise that can be used to await the log call completion  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>any</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>any</code> | the note to output |

<a name="module_crdtuxp..logTrace"></a>

### crdtuxp~logTrace(reportingFunctionArguments, message) ⇒ <code>Promise</code>
Emit a trace messsage into the log. Pass in the `arguments` keyword as the first parameter.
If the error level is below `LOG_LEVEL_TRACE` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise</code> - - a promise that can be used to await the log call completion  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>any</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>any</code> | the trace message to output |

<a name="module_crdtuxp..logWarning"></a>

### crdtuxp~logWarning(reportingFunctionArguments, message)
Emit a warning messsage into the log. Pass in the `arguments` keyword as the first parameter.
If the error level is below `LOG_LEVEL_WARNING` nothing happens

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>any</code> | pass in the current `arguments` to the function. This is used to determine the function's name for the log |
| message | <code>any</code> | the warning message to output |

<a name="module_crdtuxp..machineGUID"></a>

### crdtuxp~machineGUID() ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
The unique `GUID` of this computer

Only available to paid developer accounts

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - a `GUID` string  
<a name="module_crdtuxp..pluginInstaller"></a>

### crdtuxp~pluginInstaller() ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Launch the PluginInstaller if it is installed and configured

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  
<a name="module_crdtuxp..popLogLevel"></a>

### crdtuxp~popLogLevel() ⇒ <code>number</code>
Restore the log level to what it was when pushLogLevel was called

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - log level that was popped off the stack  
<a name="module_crdtuxp..promisify"></a>

### crdtuxp~promisify(ftn) ⇒ <code>function</code>
Convert a callback-based function into a Promise

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>function</code> - promisified function  

| Param | Type | Description |
| --- | --- | --- |
| ftn | <code>function</code> | callback-based function |

<a name="module_crdtuxp..promisifyWithContext"></a>

### crdtuxp~promisifyWithContext(ftn) ⇒ <code>function</code>
Convert a callback-based member function into a Promise

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>function</code> - promisified function  

| Param | Type | Description |
| --- | --- | --- |
| ftn | <code>function</code> | callback-based function |

<a name="module_crdtuxp..pushLogLevel"></a>

### crdtuxp~pushLogLevel(newLogLevel) ⇒ <code>number</code>
Save the previous log level and set a new log level

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - previous log level  

| Param | Type | Description |
| --- | --- | --- |
| newLogLevel | <code>number</code> | new log level to set |

<a name="module_crdtuxp..rawStringToByteArray"></a>

### crdtuxp~rawStringToByteArray(in_str) ⇒ <code>array</code> \| <code>undefined</code>
Make a 'fake string' into a byte array. Not UTF8-aware

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> \| <code>undefined</code> - an array of bytes  

| Param | Type | Description |
| --- | --- | --- |
| in_str | <code>string</code> | a raw string (possibly invalid UTF-8) |

<a name="module_crdtuxp..readINI"></a>

### crdtuxp~readINI(in_text) ⇒ <code>object</code>
Read a bunch of text and try to extract structured information in .INI format

This function is lenient and is able to extract slightly mangled INI data from the text frame
content of an InDesign text frame.

This function knows how to handle curly quotes should they be present.

The following flexibilities have been built-in:

- Attribute names are case-insensitive and anything not `a-z 0-9` is ignored.
Entries like `this or that = ...` or `thisOrThat = ...` or `this'orThat = ...` are
all equivalent. Only letters and digits are retained, and converted to lowercase.

- Attribute values can be quoted with either single, double, curly quotes.
This often occurs because InDesign can be configured to convert normal quotes into
curly quotes automatically.
Attribute values without quotes are trimmed (e.g. `bla =    x  ` is the same as `bla=x`)
Spaces are retained in quoted attribute values.

- Any text will be ignore if not properly formatted as either a section name or an attribute-value
pair with an equal sign

- Hard and soft returns are equivalent

The return value is an object with the section names at the top level, and attribute names
below that. The following .INI
```
[My data]
this is = " abc "
that =      abc
```
returns
```
{
  "mydata": {
     "__rawSectionName": "My data",
     "thisis": " abc ",
     "that": "abc"
  }
}
```

Duplicated sections and entries are automatically suffixed with a counter suffix - e.g.

[main]
a=1
a=2
a=3

is equivalent with 

[main]
a=1
a_2=2
a_3=3

[a]
a=1
[a]
a=2

is equivalent with

[a]
a=1
[a_2]
a=2

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>object</code> - either the ini data or `undefined`.  

| Param | Type | Description |
| --- | --- | --- |
| in_text | <code>string</code> | raw text, which might or might not contain some INI-formatted data mixed with normal text |

<a name="module_crdtuxp..rightPad"></a>

### crdtuxp~rightPad(s, padChar, len) ⇒ <code>string</code>
Extend or shorten a string to an exact length, adding `padChar` as needed

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - padded or shortened string  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | string to be extended or shortened |
| padChar | <code>string</code> | string to append repeatedly if length needs to extended |
| len | <code>number</code> | desired result length |

<a name="module_crdtuxp..s"></a>

### crdtuxp~s(stringCode, [locale]) ⇒ <code>string</code>
Fetch a localized string.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a localized string. If the stringCode is not found, returns the stringCode itself.  

| Param | Type | Description |
| --- | --- | --- |
| stringCode | <code>string</code> | a token for the string to be localized (e.g. BTN_OK) |
| [locale] | <code>string</code> | a locale. Optional - defaults to "en_US" |

<a name="module_crdtuxp..setIssuer"></a>

### crdtuxp~setIssuer(issuerGUID, issuerEmail) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Send in activation data so the daemon can determine whether some software is currently activated or not.

Needs to be followed by a `sublicense()` call

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| issuerGUID | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| issuerEmail | <code>string</code> | the email for the developer account as seen in the PluginInstaller |

<a name="module_crdtuxp..sQ"></a>

### crdtuxp~sQ(s_or_ByteArr) ⇒ <code>string</code>
Wrap a string or a byte array into single quotes, encoding any
binary data as a string. Knows how to handle Unicode characters
or binary zeroes.

When the input is a string, high Unicode characters are
encoded as `\uHHHH`

When the input is a byte array, all bytes are encoded as `\xHH` escape sequences.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - a string enclosed in double quotes. This string is pure 7-bit
ASCII and can be used into generated script code
Example:
`let script = "a=b(" + sQ(somedata) + ");";`  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a Unicode string or an array of bytes |

<a name="module_crdtuxp..setPersistData"></a>

### crdtuxp~setPersistData(issuer, attribute, password, data) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Store some persistent data (e.g. a time stamp to determine a demo version lapsing)

Only available to paid developer accounts

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| issuer | <code>string</code> | a GUID identifier for the developer account as seen in the PluginInstaller |
| attribute | <code>string</code> | an attribute name for the data |
| password | <code>string</code> | the password (created by the developer) needed to decode the persistent data |
| data | <code>string</code> | any data to persist |

<a name="module_crdtuxp..stripTrailingSeparator"></a>

### crdtuxp~stripTrailingSeparator(filePath, [separator]) ⇒
Remove a trailing separator, if any, from a path

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: the file path without trailing separator  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | a file path |
| [separator] | <code>string</code> | the separator to use. If omitted, will try  guess the separator. |

<a name="module_crdtuxp..strToUTF8"></a>

### crdtuxp~strToUTF8(in_s) ⇒ <code>array</code> \| <code>undefined</code>
Encode a string into an byte array using UTF-8

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>array</code> \| <code>undefined</code> - a byte array  

| Param | Type | Description |
| --- | --- | --- |
| in_s | <code>string</code> | a string |

<a name="module_crdtuxp..sublicense"></a>

### crdtuxp~sublicense(key, activation) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Send in sublicense info generated in the PluginInstaller so the daemon can determine whether some software is currently activated or not.

Needs to be preceded by a `setIssuer()` call.

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key needed to decode activation data |
| activation | <code>string</code> | encrypted activation data |

<a name="module_crdtuxp..testDirectFileAccess"></a>

### crdtuxp~testDirectFileAccess() ⇒ <code>boolean</code>
Test if we can access the path-based file I/O APIs

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>boolean</code> - whether APIs are accessible  
<a name="module_crdtuxp..testNetworkAccess"></a>

### crdtuxp~testNetworkAccess() ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Test if we can access the network APIs

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - whether APIs are accessible  
<a name="module_crdtuxp..toHex"></a>

### crdtuxp~toHex(i, numDigits) ⇒ <code>string</code>
Convert an integer into a hex representation with a fixed number of digits.
Negative numbers are converted using 2-s complement (so `-15` results in `0x01`)

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>string</code> - hex-encoded integer  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | integer to convert to hex |
| numDigits | <code>number</code> | How many digits. Defaults to 4 if omitted. |

<a name="module_crdtuxp..unitToInchFactor"></a>

### crdtuxp~unitToInchFactor(in_unit) ⇒ <code>number</code>
Conversion factor from a length unit into inches

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>number</code> - conversion factor or 1.0 if unknown/not applicable  

| Param | Type | Description |
| --- | --- | --- |
| in_unit | <code>string</code> | unit name (`crdtes.UNIT_NAME...`) |

<a name="module_crdtuxp..waitForFile"></a>

### crdtuxp~waitForFile(filePath, [interval], [timeout]) ⇒ <code>Promise.&lt;(boolean\|undefined)&gt;</code>
Wait for a file to appear. Only works in UXP contexts with direct file access

**Kind**: inner method of [<code>crdtuxp</code>](#module_crdtuxp)  
**Returns**: <code>Promise.&lt;(boolean\|undefined)&gt;</code> - whether file appeared or not  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | file that needs to appear |
| [interval] | <code>number</code> | how often to check for file (milliseconds) |
| [timeout] | <code>number</code> | how long to wait for file (milliseconds) |

