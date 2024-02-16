## Objects

<dl>
<dt><a href="#crdtuxp">crdtuxp</a> : <code>object</code></dt>
<dd><p><code>crdtuxp</code> contains a number of useful functions. Some of these functions
are part of crdtux.js and are synchronous. </p>
<p>Other functions are delegated to a daemon process, and are always asynchronous.</p>
<p><code>crdtuxp</code> steps out of the UXP security sandbox - which means that as a developer, 
you need to be judicious when using this. </p>
<p>Every solution operates in a unique context. The UXP security measures are
helpful in keeping things secure, but in many situations, they are a massive overkill.</p>
<p>It should be up to the user/developer/IT department to decide how to handle security.</p>
<p>Sometimes the whole workflow can be contained inside a sandbox or walled garden, on
a disconnected network, without any contact with the outside world and not allowed to run any
unvetted software. </p>
<p>Sometimes the OS security is safe enough for the workflow at hand.</p>
<p>In those cases, the UXP security measures are counter-productive: they represent 
unnessary hurdles to the software development, or make the user interace clunky and
user-unfriendly.</p>
<p>Using the UXP sandboxing should be an option, not an enforced requirement, and it should
be up to the developer and/or the IT department to decide what is appropriate and what not.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#DNS_NAME_FOR_LOCALHOST">DNS_NAME_FOR_LOCALHOST</a> : <code>string</code></dt>
<dd><p>&quot;localhost.tgrg.net&quot; resolves to 127.0.0.1</p>
<p>The Tightener daemon manages the necessary certificate for https</p>
</dd>
<dt><a href="#PORT_TIGHTENER_DAEMON">PORT_TIGHTENER_DAEMON</a> : <code>number</code></dt>
<dd><p>The Tightener daemon listens for HTTPS connections on port 18888.</p>
</dd>
<dt><a href="#TQL_SCOPE_NAME_DEFAULT">TQL_SCOPE_NAME_DEFAULT</a> : <code>string</code></dt>
<dd><p>The Tightener daemon provides persistent named scopes (similar to persistent ExtendScript engines)
When executing multiple TQL scripts in succession a named scope will retain any globals that
were defined by a previous script</p>
</dd>
<dt><a href="#LOG_LEVEL_OFF">LOG_LEVEL_OFF</a> : <code>number</code></dt>
<dd><p>Setting log level to LOG_LEVEL_OFF causes all log output to be suppressed</p>
</dd>
<dt><a href="#LOG_LEVEL_ERROR">LOG_LEVEL_ERROR</a> : <code>number</code></dt>
<dd><p>Setting log level to LOG_LEVEL_ERROR causes all log output to be suppressed,
except for errors</p>
</dd>
<dt><a href="#LOG_LEVEL_WARNING">LOG_LEVEL_WARNING</a> : <code>number</code></dt>
<dd><p>Setting log level to LOG_LEVEL_WARNING causes all log output to be suppressed,
except for errors and warnings</p>
</dd>
<dt><a href="#LOG_LEVEL_NOTE">LOG_LEVEL_NOTE</a> : <code>number</code></dt>
<dd><p>Setting log level to LOG_LEVEL_NOTE causes all log output to be suppressed,
except for errors, warnings and notes</p>
</dd>
<dt><a href="#LOG_LEVEL_TRACE">LOG_LEVEL_TRACE</a> : <code>number</code></dt>
<dd><p>Setting log level to LOG_LEVEL_TRACE causes all log output to be output</p>
</dd>
<dt><a href="#DESKTOP_DIR">DESKTOP_DIR</a> : <code>string</code></dt>
<dd><p>Pass DESKTOP_DIR into crdtuxp.getDir() to get the path of the user&#39;s Desktop folder</p>
</dd>
<dt><a href="#DOCUMENTS_DIR">DOCUMENTS_DIR</a> : <code>string</code></dt>
<dd><p>Pass DOCUMENTS_DIR into crdtuxp.getDir() to get the path of the user&#39;s Documents folder</p>
</dd>
<dt><a href="#HOME_DIR">HOME_DIR</a> : <code>string</code></dt>
<dd><p>Pass HOME_DIR into crdtuxp.getDir() to get the path of the user&#39;s home folder</p>
</dd>
<dt><a href="#LOG_DIR">LOG_DIR</a> : <code>string</code></dt>
<dd><p>Pass LOG_DIR into crdtuxp.getDir() to get the path of the Tightener logging folder folder</p>
</dd>
<dt><a href="#SYSTEMDATA_DIR">SYSTEMDATA_DIR</a> : <code>string</code></dt>
<dd><p>Pass SYSTEMDATA_DIR into crdtuxp.getDir() to get the path of the system data folder
(%PROGRAMDATA% or /Library/Application Support)</p>
</dd>
<dt><a href="#TMP_DIR">TMP_DIR</a> : <code>string</code></dt>
<dd><p>Pass TMP_DIR into crdtuxp.getDir() to get the path of the temporary folder</p>
</dd>
<dt><a href="#USERDATA_DIR">USERDATA_DIR</a> : <code>string</code></dt>
<dd><p>Pass USERDATA_DIR into crdtuxp.getDir() to get the path to the user data folder
(%APPDATA% or ~/Library/Application Support)</p>
</dd>
</dl>

<a name="crdtuxp"></a>

## crdtuxp : <code>object</code>
`crdtuxp` contains a number of useful functions. Some of these functions
are part of crdtux.js and are synchronous. 

Other functions are delegated to a daemon process, and are always asynchronous.

`crdtuxp` steps out of the UXP security sandbox - which means that as a developer, 
you need to be judicious when using this. 

Every solution operates in a unique context. The UXP security measures are
helpful in keeping things secure, but in many situations, they are a massive overkill.

It should be up to the user/developer/IT department to decide how to handle security.

Sometimes the whole workflow can be contained inside a sandbox or walled garden, on
a disconnected network, without any contact with the outside world and not allowed to run any
unvetted software. 

Sometimes the OS security is safe enough for the workflow at hand.

In those cases, the UXP security measures are counter-productive: they represent 
unnessary hurdles to the software development, or make the user interace clunky and
user-unfriendly.
 
Using the UXP sandboxing should be an option, not an enforced requirement, and it should
be up to the developer and/or the IT department to decide what is appropriate and what not.

**Kind**: global namespace  

* [crdtuxp](#crdtuxp) : <code>object</code>
    * [.base64decode(base64Str)](#crdtuxp.base64decode) ⇒ <code>string</code>
    * [.base64encode(s_or_ByteArr)](#crdtuxp.base64encode) ⇒ <code>string</code>
    * [.binaryUTF8ToStr(in_byteArray)](#crdtuxp.binaryUTF8ToStr) ⇒ <code>string</code>
    * [.decrypt(s_or_ByteArr, aesKey)](#crdtuxp.decrypt) ⇒ <code>array</code>
    * [.deQuote(quotedString)](#crdtuxp.deQuote) ⇒ <code>array</code>
    * [.dirDelete(filePath, recurse)](#crdtuxp.dirDelete) ⇒ <code>boolean</code>
    * [.dirExists(dirPath)](#crdtuxp.dirExists) ⇒ <code>boolean</code>
    * [.dirCreate(filePath)](#crdtuxp.dirCreate) ⇒ <code>array</code>
    * [.dirScan(filePath)](#crdtuxp.dirScan) ⇒ <code>array</code>
    * [.dQ(s_or_ByteArr)](#crdtuxp.dQ) ⇒ <code>string</code>
    * [.encrypt(s_or_ByteArr, aesKey)](#crdtuxp.encrypt) ⇒ <code>string</code>
    * [.evalTQL(tqlScript, tqlScopeName, resultIsRawBinary)](#crdtuxp.evalTQL) ⇒ <code>any</code>
    * [.fileClose(fileHandle)](#crdtuxp.fileClose) ⇒ <code>any</code>
    * [.fileDelete(filePath)](#crdtuxp.fileDelete) ⇒ <code>boolean</code>
    * [.fileExists(filePath)](#crdtuxp.fileExists) ⇒ <code>boolean</code>
    * [.fileOpen(fileName, mode)](#crdtuxp.fileOpen) ⇒ <code>number</code>
    * [.fileRead(fileHandle, isBinary)](#crdtuxp.fileRead) ⇒ <code>any</code>
    * [.fileWrite(fileHandle, s_or_ByteArr)](#crdtuxp.fileWrite) ⇒ <code>any</code>
    * [.getCapability(issuer, productCode, password)](#crdtuxp.getCapability) ⇒ <code>string</code>
    * [.getDir(dirTag)](#crdtuxp.getDir) ⇒ <code>string</code>
    * [.intPow(i, intPower)](#crdtuxp.intPow) ⇒ <code>number</code>
    * [.leftPad(s, padChar, len)](#crdtuxp.leftPad) ⇒ <code>string</code>
    * [.logEntry(reportingFunctionArguments)](#crdtuxp.logEntry)
    * [.logError(reportingFunctionArguments, message)](#crdtuxp.logError)
    * [.logExit(reportingFunctionArguments)](#crdtuxp.logExit)
    * [.logNote(reportingFunctionArguments, message)](#crdtuxp.logNote)
    * [.logTrace(reportingFunctionArguments, message)](#crdtuxp.logTrace)
    * [.logWarning(arguments, message)](#crdtuxp.logWarning)
    * [.machineGUID()](#crdtuxp.machineGUID) ⇒ <code>string</code>
    * [.popLogLevel()](#crdtuxp.popLogLevel) ⇒ <code>number</code>
    * [.pushLogLevel(newLogLevel)](#crdtuxp.pushLogLevel) ⇒ <code>number</code>
    * [.rightPad(s, padChar, len)](#crdtuxp.rightPad) ⇒ <code>string</code>
    * [.setIssuer(issuerGUID, issuerEmail)](#crdtuxp.setIssuer) ⇒ <code>boolean</code>
    * [.sQ(s_or_ByteArr)](#crdtuxp.sQ) ⇒ <code>string</code>
    * [.strToUTF8(in_s)](#crdtuxp.strToUTF8) ⇒ <code>array</code>
    * [.sublicense(key, activation)](#crdtuxp.sublicense) ⇒ <code>boolean</code>
    * [.toHex(i, numDigits)](#crdtuxp.toHex) ⇒ <code>string</code>

<a name="crdtuxp.base64decode"></a>

### crdtuxp.base64decode(base64Str) ⇒ <code>string</code>
(async) Decode a string that was encoded using base64. This function has not been speed-tested;
I suspect it might only be beneficial for very large long strings, if that. The overheads might be
larger than the speed benefit.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - decoded string  

| Param | Type | Description |
| --- | --- | --- |
| base64Str | <code>string</code> | base64 encoded string |

<a name="crdtuxp.base64encode"></a>

### crdtuxp.base64encode(s_or_ByteArr) ⇒ <code>string</code>
(async) Encode a string or an array of bytes using Base 64 encoding. This function has not been speed-tested;
I suspect it might only be beneficial for very large long strings, if that. The overheads might be
larger than the speed benefit.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - encoded string  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | either a string or an array containing bytes (0-255). |

<a name="crdtuxp.binaryUTF8ToStr"></a>

### crdtuxp.binaryUTF8ToStr(in_byteArray) ⇒ <code>string</code>
(sync) Decode an array of bytes that contains a UTF-8 encoded string

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - a string or undefined if the UTF-8 is not valid  

| Param | Type | Description |
| --- | --- | --- |
| in_byteArray | <code>array</code> | an array containing bytes (0-255) for a string using UTF-8 encoding. |

<a name="crdtuxp.decrypt"></a>

### crdtuxp.decrypt(s_or_ByteArr, aesKey) ⇒ <code>array</code>
(async) Reverse the operation of the `crdtuxp.encrypt` function

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>array</code> - an array of bytes  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a string or an array of bytes |
| aesKey | <code>string</code> | a string or an array of bytes |

<a name="crdtuxp.deQuote"></a>

### crdtuxp.deQuote(quotedString) ⇒ <code>array</code>
(sync) Reverse the operation of @crdtuxp.dQ or @crdtuxp.sQ

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>array</code> - a byte array. If the quoted string contains any \uXXXX codes,
these are first encoded using UTF-8 before storing them into the byte array.  

| Param | Type | Description |
| --- | --- | --- |
| quotedString | <code>string</code> | a quoted string |

<a name="crdtuxp.dirDelete"></a>

### crdtuxp.dirDelete(filePath, recurse) ⇒ <code>boolean</code>
(async) Delete a directory

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 
| recurse | <code>boolean</code> | 

<a name="crdtuxp.dirExists"></a>

### crdtuxp.dirExists(dirPath) ⇒ <code>boolean</code>
(async) Verify whether a directory exists. 

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>boolean</code> - true or false  

| Param | Type | Description |
| --- | --- | --- |
| dirPath | <code>string</code> | a path to a directory |

<a name="crdtuxp.dirCreate"></a>

### crdtuxp.dirCreate(filePath) ⇒ <code>array</code>
(async) Create a directory

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>array</code> - list if items in directory  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="crdtuxp.dirScan"></a>

### crdtuxp.dirScan(filePath) ⇒ <code>array</code>
(async) Scan a directory

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>array</code> - list if items in directory  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="crdtuxp.dQ"></a>

### crdtuxp.dQ(s_or_ByteArr) ⇒ <code>string</code>
(sync) Wrap a string or a byte array into double quotes, encoding any
binary data as a string. Knows how to handle Unicode characters
or binary zeroes. When the input is a string, high Unicode characters are
encoded as \uHHHH

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - a string enclosed in double quotes. This string is pure 7-bit
ASCII and can be used into generated script code 
Example:
var script = "a=b(" + dQ(somedata) + ");";  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a Unicode string or an array of bytes |

<a name="crdtuxp.encrypt"></a>

### crdtuxp.encrypt(s_or_ByteArr, aesKey) ⇒ <code>string</code>
(async) Encrypt a string or array of bytes using a key. A random salt
is added into the mix, so even when passing in the same parameter values, the result will
be different every time.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - a base-64 encoded encrypted string.  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a string or an array of bytes |
| aesKey | <code>string</code> | a string or an array of bytes |

<a name="crdtuxp.evalTQL"></a>

### crdtuxp.evalTQL(tqlScript, tqlScopeName, resultIsRawBinary) ⇒ <code>any</code>
(async) Send a TQL script to the daemon and wait for the result

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>any</code> - a string or a byte array  

| Param | Type | Description |
| --- | --- | --- |
| tqlScript | <code>string</code> | a script to run |
| tqlScopeName | <code>string</code> | a scope name to use. Scopes are persistent for the duration of the daemon process and can be used to pass data between different processes |
| resultIsRawBinary | <code>boolean</code> | whether the resulting data is raw binary, or can be decoded as a string |

<a name="crdtuxp.fileClose"></a>

### crdtuxp.fileClose(fileHandle) ⇒ <code>any</code>
(async) Close a currently open file

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>any</code> - return value from daemon  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by fileOpen() |

<a name="crdtuxp.fileDelete"></a>

### crdtuxp.fileDelete(filePath) ⇒ <code>boolean</code>
(async) Delete a file

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="crdtuxp.fileExists"></a>

### crdtuxp.fileExists(filePath) ⇒ <code>boolean</code>
(async) Check if a file exists

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>boolean</code> - existence of file  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="crdtuxp.fileOpen"></a>

### crdtuxp.fileOpen(fileName, mode) ⇒ <code>number</code>
(async) Open a binary file and return a handle

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>number</code> - file handle  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | a native full file path to the file |
| mode | <code>string</code> | one of 'a', 'r', 'w' (append, read, write) |

<a name="crdtuxp.fileRead"></a>

### crdtuxp.fileRead(fileHandle, isBinary) ⇒ <code>any</code>
(async) Read a file into memory

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>any</code> - retn either a byte array or a string  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by fileOpen() |
| isBinary | <code>boolean</code> | whether the file is considered a binary file (as opposed to a UTF-8 text file) |

<a name="crdtuxp.fileWrite"></a>

### crdtuxp.fileWrite(fileHandle, s_or_ByteArr) ⇒ <code>any</code>
(async) Binary write to a file. Strings are written as UTF-8

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>any</code> - retn value from daemon  

| Param | Type | Description |
| --- | --- | --- |
| fileHandle | <code>number</code> | a file handle as returned by fileOpen() |
| s_or_ByteArr | <code>string</code> | data to write to the file |

<a name="crdtuxp.getCapability"></a>

### crdtuxp.getCapability(issuer, productCode, password) ⇒ <code>string</code>
(async) Query the daemon to see whether some software is currently activated or not

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - a JSON structure with capability data (customer GUID, decrypted data from the activation file)  

| Param | Type | Description |
| --- | --- | --- |
| issuer | <code>string</code> | a GUID identifier for the developer account as seen in the License Manager |
| productCode | <code>string</code> | a product code for the software product to be activated (as determined by the developer) |
| password | <code>string</code> | the password (created by the developer) needed to decode the capability data |

<a name="crdtuxp.getDir"></a>

### crdtuxp.getDir(dirTag) ⇒ <code>string</code>
(async) Get the path of a system directory

Not limited to the UXP security sandbox.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - file path of dir or undefined  

| Param | Type | Description |
| --- | --- | --- |
| dirTag | <code>string</code> | a tag representing the dir:    crdtuxp.DESKTOP_DIR    crdtuxp.DOCUMENTS_DIR    crdtuxp.HOME_DIR    crdtuxp.LOG_DIR    crdtuxp.SYSTEMDATA_DIR    crdtuxp.TMP_DIR    crdtuxp.USERDATA_DIR |

<a name="crdtuxp.intPow"></a>

### crdtuxp.intPow(i, intPower) ⇒ <code>number</code>
(sync) Calculate an integer power of an int value. Avoids using floating point, so 
should not have any floating-point round-off errors. Math.pow() will probably
give the same result, but I am doubtful some implementations might use log and exp 
to handle Math.pow()

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>number</code> - i ^ intPower  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | Integer base |
| intPower | <code>number</code> | integer power |

<a name="crdtuxp.leftPad"></a>

### crdtuxp.leftPad(s, padChar, len) ⇒ <code>string</code>
(sync) Extend or shorten a string to an exact length, adding padChar as needed

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - padded or shortened string  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | string to be extended or shortened |
| padChar | <code>string</code> | string to append repeatedly if length needs to extended |
| len | <code>number</code> | desired result length |

<a name="crdtuxp.logEntry"></a>

### crdtuxp.logEntry(reportingFunctionArguments)
(async) Make a log entry of the call of a function. Pass in the 'arguments' keyword as a parameter.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current arguments to the function. This is used to determine the function's name for the log |

<a name="crdtuxp.logError"></a>

### crdtuxp.logError(reportingFunctionArguments, message)
(async) Make a log entry of an error message. Pass in the 'arguments' keyword as the first parameter
If the error level is below LOG_LEVEL_ERROR nothing happens

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current arguments to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | error message |

<a name="crdtuxp.logExit"></a>

### crdtuxp.logExit(reportingFunctionArguments)
(async) Make a log entry of the exit of a function. Pass in the 'arguments' keyword as a parameter.

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current arguments to the function. This is used to determine the function's name for the log |

<a name="crdtuxp.logNote"></a>

### crdtuxp.logNote(reportingFunctionArguments, message)
(async) Make a log entry of a note. Pass in the 'arguments' keyword as the first parameter.
If the error level is below LOG_LEVEL_NOTE nothing happens

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current arguments to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | the note to output |

<a name="crdtuxp.logTrace"></a>

### crdtuxp.logTrace(reportingFunctionArguments, message)
(async) Emit a trace messsage into the log. Pass in the 'arguments' keyword as the first parameter.
If the error level is below LOG_LEVEL_TRACE nothing happens

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| reportingFunctionArguments | <code>array</code> | pass in the current arguments to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | the trace message to output |

<a name="crdtuxp.logWarning"></a>

### crdtuxp.logWarning(arguments, message)
(async) Emit a warning messsage into the log. Pass in the 'arguments' keyword as the first parameter.
If the error level is below LOG_LEVEL_WARNING nothing happens

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  

| Param | Type | Description |
| --- | --- | --- |
| arguments | <code>array</code> | pass in the current arguments to the function. This is used to determine the function's name for the log |
| message | <code>string</code> | the warning message to output |

<a name="crdtuxp.machineGUID"></a>

### crdtuxp.machineGUID() ⇒ <code>string</code>
(async) The unique GUID of this computer

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - a GUID string  
<a name="crdtuxp.popLogLevel"></a>

### crdtuxp.popLogLevel() ⇒ <code>number</code>
(sync) Restore the log level to what it was when pushLogLevel was called

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>number</code> - log level that was popped off the stack  
<a name="crdtuxp.pushLogLevel"></a>

### crdtuxp.pushLogLevel(newLogLevel) ⇒ <code>number</code>
(sync) Save the previous log level and set a new log level

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>number</code> - previous log level  

| Param | Type | Description |
| --- | --- | --- |
| newLogLevel | <code>number</code> | new log level to set |

<a name="crdtuxp.rightPad"></a>

### crdtuxp.rightPad(s, padChar, len) ⇒ <code>string</code>
(sync) Extend or shorten a string to an exact length, adding padChar as needed

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - padded or shortened string  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | string to be extended or shortened |
| padChar | <code>string</code> | string to append repeatedly if length needs to extended |
| len | <code>number</code> | desired result length |

<a name="crdtuxp.setIssuer"></a>

### crdtuxp.setIssuer(issuerGUID, issuerEmail) ⇒ <code>boolean</code>
(async) Send in activation data so the daemon can determine whether some software is currently activated or not
Needs to be followed by a @crdtuxp.sublicense() call

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>boolean</code> - - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| issuerGUID | <code>string</code> | a GUID identifier for the developer account as seen in the License Manager |
| issuerEmail | <code>string</code> | the email for the developer account as seen in the License Manager |

<a name="crdtuxp.sQ"></a>

### crdtuxp.sQ(s_or_ByteArr) ⇒ <code>string</code>
(sync) Wrap a string or a byte array into single quotes, encoding any
binary data as a string. Knows how to handle Unicode characters
or binary zeroes. When the input is a string, high Unicode characters are
encoded as \uHHHH

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - a string enclosed in double quotes. This string is pure 7-bit
ASCII and can be used into generated script code 
Example:
var script = "a=b(" + sQ(somedata) + ");";  

| Param | Type | Description |
| --- | --- | --- |
| s_or_ByteArr | <code>string</code> | a Unicode string or an array of bytes |

<a name="crdtuxp.strToUTF8"></a>

### crdtuxp.strToUTF8(in_s) ⇒ <code>array</code>
(sync) Encode a string into an byte array using UTF-8

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>array</code> - a byte array  

| Param | Type | Description |
| --- | --- | --- |
| in_s | <code>string</code> | a string |

<a name="crdtuxp.sublicense"></a>

### crdtuxp.sublicense(key, activation) ⇒ <code>boolean</code>
(async) Send in sublicense info generated in the License Manager so the daemon can determine whether some software is currently activated or not
Needs to be preceded by a @crdtuxp.setIssuer() call

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>boolean</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key needed to decode activation data |
| activation | <code>string</code> | encrypted activation data |

<a name="crdtuxp.toHex"></a>

### crdtuxp.toHex(i, numDigits) ⇒ <code>string</code>
(sync) Convert an integer into a hex representation with a fixed number of digits
Negative numbers are converted using 2-s complement (so -15 results in 0x01)

**Kind**: static method of [<code>crdtuxp</code>](#crdtuxp)  
**Returns**: <code>string</code> - hex-encoded integer  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | integer to convert to hex |
| numDigits | <code>number</code> | How many digits. Defaults to 4 if omitted. |

<a name="DNS_NAME_FOR_LOCALHOST"></a>

## DNS\_NAME\_FOR\_LOCALHOST : <code>string</code>
"localhost.tgrg.net" resolves to 127.0.0.1

The Tightener daemon manages the necessary certificate for https

**Kind**: global constant  
<a name="PORT_TIGHTENER_DAEMON"></a>

## PORT\_TIGHTENER\_DAEMON : <code>number</code>
The Tightener daemon listens for HTTPS connections on port 18888.

**Kind**: global constant  
<a name="TQL_SCOPE_NAME_DEFAULT"></a>

## TQL\_SCOPE\_NAME\_DEFAULT : <code>string</code>
The Tightener daemon provides persistent named scopes (similar to persistent ExtendScript engines)
When executing multiple TQL scripts in succession a named scope will retain any globals that
were defined by a previous script

**Kind**: global constant  
<a name="LOG_LEVEL_OFF"></a>

## LOG\_LEVEL\_OFF : <code>number</code>
Setting log level to LOG_LEVEL_OFF causes all log output to be suppressed

**Kind**: global constant  
<a name="LOG_LEVEL_ERROR"></a>

## LOG\_LEVEL\_ERROR : <code>number</code>
Setting log level to LOG_LEVEL_ERROR causes all log output to be suppressed,
except for errors

**Kind**: global constant  
<a name="LOG_LEVEL_WARNING"></a>

## LOG\_LEVEL\_WARNING : <code>number</code>
Setting log level to LOG_LEVEL_WARNING causes all log output to be suppressed,
except for errors and warnings

**Kind**: global constant  
<a name="LOG_LEVEL_NOTE"></a>

## LOG\_LEVEL\_NOTE : <code>number</code>
Setting log level to LOG_LEVEL_NOTE causes all log output to be suppressed,
except for errors, warnings and notes

**Kind**: global constant  
<a name="LOG_LEVEL_TRACE"></a>

## LOG\_LEVEL\_TRACE : <code>number</code>
Setting log level to LOG_LEVEL_TRACE causes all log output to be output

**Kind**: global constant  
<a name="DESKTOP_DIR"></a>

## DESKTOP\_DIR : <code>string</code>
Pass DESKTOP_DIR into crdtuxp.getDir() to get the path of the user's Desktop folder

**Kind**: global constant  
<a name="DOCUMENTS_DIR"></a>

## DOCUMENTS\_DIR : <code>string</code>
Pass DOCUMENTS_DIR into crdtuxp.getDir() to get the path of the user's Documents folder

**Kind**: global constant  
<a name="HOME_DIR"></a>

## HOME\_DIR : <code>string</code>
Pass HOME_DIR into crdtuxp.getDir() to get the path of the user's home folder

**Kind**: global constant  
<a name="LOG_DIR"></a>

## LOG\_DIR : <code>string</code>
Pass LOG_DIR into crdtuxp.getDir() to get the path of the Tightener logging folder folder

**Kind**: global constant  
<a name="SYSTEMDATA_DIR"></a>

## SYSTEMDATA\_DIR : <code>string</code>
Pass SYSTEMDATA_DIR into crdtuxp.getDir() to get the path of the system data folder
(%PROGRAMDATA% or /Library/Application Support)

**Kind**: global constant  
<a name="TMP_DIR"></a>

## TMP\_DIR : <code>string</code>
Pass TMP_DIR into crdtuxp.getDir() to get the path of the temporary folder

**Kind**: global constant  
<a name="USERDATA_DIR"></a>

## USERDATA\_DIR : <code>string</code>
Pass USERDATA_DIR into crdtuxp.getDir() to get the path to the user data folder
(%APPDATA% or ~/Library/Application Support)

**Kind**: global constant  
