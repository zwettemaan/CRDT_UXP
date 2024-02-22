/**
 * For downloading and installation info, visit
 *
 * https://www.rorohiko.com/crdt
 *
 *  `crdtuxp` contains a number of useful functions. Some of these functions
 * are implemented in JavaScript in `crdtux.js` and are synchronous. 
 * 
 * Other functions are delegated to a daemon process, and are always asynchronous.
 *
 * The list of endpoints is further down
 * 
 * `crdtuxp` steps out of the UXP security sandbox - which means that as a developer, 
 * you need to be judicious when using this. 
 * 
 * Every solution operates in a unique context. The UXP security measures are
 * helpful in keeping things secure, but in many situations, they are a massive overkill.
 * 
 * It should be up to the user/developer/IT department to decide how to handle security.
 * 
 * Sometimes the whole workflow can live inside walled garden, on
 * a disconnected network, without any contact with the outside world and not be allowed to run any
 * unvetted software. 
 * 
 * Or sometimes the OS security is safe enough for the workflow at hand.
 *
 * In those cases, the UXP security measures are counter-productive: they represent 
 * unnessary hurdles to the software development, or make the user interace clunky and
 * user-unfriendly.
 *  
 * Using the UXP sandboxing should be a developer-selectable option, not an enforced requirement, and it should
 * be up to the developer and/or the IT department to decide what is appropriate and what not.
 * 
 * @namespace crdtuxp
 */

/**
 * "localhost.tgrg.net" resolves to 127.0.0.1
 * 
 * The Tightener daemon manages the necessary certificate for https
 * 
 * @constant {string} DNS_NAME_FOR_LOCALHOST
 */

const DNS_NAME_FOR_LOCALHOST = "localhost.tgrg.net";

/**
 * The Tightener daemon listens for HTTPS connections on port `18888`. 
 *
 * @constant {number} PORT_TIGHTENER_DAEMON
 */
const PORT_TIGHTENER_DAEMON = 18888;

const LOCALHOST_URL = "https://" + DNS_NAME_FOR_LOCALHOST+ ":" + PORT_TIGHTENER_DAEMON;

/**
 * The Tightener daemon provides persistent named scopes (similar to persistent ExtendScript engines)
 * When executing multiple TQL scripts in succession a named scope will retain any globals that
 * were defined by a previous script
 *
 * @constant {string} TQL_SCOPE_NAME_DEFAULT
 */
const TQL_SCOPE_NAME_DEFAULT = "defaultScope";

const PLATFORM_MAC_OS_X = "darwin";



if (! module.exports) {
    module.exports = {};
}

module.exports.IS_MAC = require('os').platform() == PLATFORM_MAC_OS_X;
module.exports.IS_WINDOWS = ! module.exports.IS_MAC;

/**
 * Setting log level to `LOG_LEVEL_OFF` causes all log output to be suppressed
 *
 * @constant {number} LOG_LEVEL_OFF
 */
const LOG_LEVEL_OFF = 0;
module.exports.LOG_LEVEL_OFF = LOG_LEVEL_OFF;

/**
 * Setting log level to `LOG_LEVEL_ERROR` causes all log output to be suppressed,
 * except for errors
 *
 * @constant {number} LOG_LEVEL_ERROR
 */
const LOG_LEVEL_ERROR = 1;
module.exports.LOG_LEVEL_ERROR = LOG_LEVEL_ERROR;

/**
 * Setting log level to `LOG_LEVEL_WARNING` causes all log output to be suppressed,
 * except for errors and warnings
 *
 * @constant {number} LOG_LEVEL_WARNING
 */
const LOG_LEVEL_WARNING = 2;
module.exports.LOG_LEVEL_WARNING = LOG_LEVEL_WARNING;

/**
 * Setting log level to `LOG_LEVEL_NOTE` causes all log output to be suppressed,
 * except for errors, warnings and notes
 *
 * @constant {number} LOG_LEVEL_NOTE
 */
const LOG_LEVEL_NOTE = 3;
module.exports.LOG_LEVEL_NOTE = LOG_LEVEL_NOTE;

/**
 * Setting log level to `LOG_LEVEL_TRACE` causes all log output to be output
 * 
 * @constant {number} LOG_LEVEL_TRACE
 */
const LOG_LEVEL_TRACE = 4;
module.exports.LOG_LEVEL_TRACE = LOG_LEVEL_TRACE;

// Symbolic params to crdtuxp.getDir()

/**
 * Pass `DESKTOP_DIR` into `crdtuxp.getDir()` to get the path of the user's Desktop folder
 * 
 * @constant {string} DESKTOP_DIR
 */
module.exports.DESKTOP_DIR    = "DESKTOP_DIR";

/**
 * Pass `DOCUMENTS_DIR` into `crdtuxp.getDir()` to get the path of the user's Documents folder
 * 
 * @constant {string} DOCUMENTS_DIR
 */
module.exports.DOCUMENTS_DIR  = "DOCUMENTS_DIR";

/**
 * Pass `HOME_DIR` into `crdtuxp.getDir()` to get the path of the user's home folder
 * 
 * @constant {string} HOME_DIR
 */
module.exports.HOME_DIR       = "HOME_DIR";

/**
 * Pass `LOG_DIR` into `crdtuxp.getDir()` to get the path of the Tightener logging folder folder
 * 
 * @constant {string} LOG_DIR
 */
module.exports.LOG_DIR        = "LOG_DIR";

/**
 * Pass `SYSTEMDATA_DIR` into `crdtuxp.getDir()` to get the path of the system data folder
 * (`%PROGRAMDATA%` or `/Library/Application Support`)
 * 
 * @constant {string} SYSTEMDATA_DIR
 */
module.exports.SYSTEMDATA_DIR = "SYSTEMDATA_DIR";

/**
 * Pass `TMP_DIR` into `crdtuxp.getDir()` to get the path of the temporary folder
 * 
 * @constant {string} TMP_DIR
 */
module.exports.TMP_DIR        = "TMP_DIR";

/**
 * Pass `USERDATA_DIR` into `crdtuxp.getDir()` to get the path to the user data folder
 * (`%APPDATA%` or `~/Library/Application Support`)
 * 
 * @constant {string} USERDATA_DIR
 */
module.exports.USERDATA_DIR   = "USERDATA_DIR";

// 
// UXP internally caches responses from the server - we need to avoid this as each script
// run can return different results. `HTTP_CACHE_BUSTER` will be incremented after each use
//
var HTTP_CACHE_BUSTER         = Math.floor(Math.random() * 1000000);

var LOG_LEVEL_STACK           = [];
var LOG_ENTRY_EXIT            = false;
var LOG_LEVEL                 = LOG_LEVEL_OFF;
var IN_LOGGER                 = false;
var LOG_TO_UXPDEVTOOL_CONSOLE = true;
var LOG_TO_FILEPATH           = undefined;

var SYS_INFO;

/**
 * (async) Decode a string that was encoded using base64. This function has not been speed-tested;
 * I suspect it might only be beneficial for very large long strings, if that. The overheads might be
 * larger than the speed benefit.
 * 
 * @function crdtuxp.base64decode
 * 
 * @param {string} base64Str - base64 encoded string
 * @return {string} decoded string
 */
async function base64decode(base64Str) {

    var retVal;

    var response = await evalTQL("base64decode(" + dQ(base64Str) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.base64decode = base64decode;

/**
 * (async) Encode a string or an array of bytes using Base 64 encoding. This function has not been speed-tested;
 * I suspect it might only be beneficial for very large long strings, if that. The overheads might be
 * larger than the speed benefit.
 * 
 * @function crdtuxp.base64encode
 * 
 * @param {string} s_or_ByteArr - either a string or an array containing bytes (0-255).
 * @return {string} encoded string
 */
async function base64encode(s_or_ByteArr) {

    var retVal;

    var response = await evalTQL("base64encode(" + dQ(s_or_ByteArr) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.base64encode = base64encode;

/**
 * (sync) Decode an array of bytes that contains a UTF-8 encoded string
 * 
 * @function crdtuxp.binaryUTF8ToStr
 * 
 * @param {array} in_byteArray - an array containing bytes (0-255)
 * for a string using UTF-8 encoding.
 * @return {string} a string or undefined if the UTF-8 is not valid
 */
function binaryUTF8ToStr(in_byteArray) {

    var retVal = "";

    try {
        var idx = 0;
        var len = in_byteArray.length;
        var c;
        while (idx < len) {
            var byte = in_byteArray[idx];
            idx++;
            var bit7 = byte >> 7;
            if (! bit7) {
                // U+0000 - U+007F
                c = String.fromCharCode(byte);
            }
            else {
                var bit6 = (byte & 0x7F) >> 6;
                if (! bit6) {
                    // Invalid
                    retVal = undefined;
                    break;
                }
                else {
                    var byte2 = in_byteArray[idx];
                    idx++;
                    var bit5 = (byte & 0x3F) >> 5;
                    if (! bit5) {
                        // U+0080 - U+07FF
                        c = String.fromCharCode(((byte & 0x1F) << 6) | (byte2 & 0x3F));
                    }
                    else {
                        var byte3 = in_byteArray[idx];
                        idx++;
                        var bit4 = (byte & 0x1F) >> 4;
                        if (! bit4) {
                            // U+0800 - U+FFFF
                            c = String.fromCharCode(((byte & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
                        }
                        else {
                            // Not handled U+10000 - U+10FFFF
                            retVal = undefined;
                            break;
                        }
                    }
                }
            }
            retVal += c;
        }
    }
    catch (err) {
        retVal = undefined;
    }

    return retVal;
}
module.exports.binaryUTF8ToStr = binaryUTF8ToStr;

// (sync) charCodeToUTF8__: internal function: convert a Unicode character code to a 1 to 3 byte UTF8 byte sequence
// returns undefined if invalid in_charCode

function charCodeToUTF8__(in_charCode) {

    var retVal = undefined;

    try {

        if (in_charCode <= 0x007F) {
            retVal = [];
            retVal.push(in_charCode);
        }
        else if (in_charCode <= 0x07FF) {
            var hi = 0xC0 + ((in_charCode >> 6) & 0x1F);
            var lo = 0x80 + ((in_charCode      )& 0x3F);
            retVal = [];
            retVal.push(hi);
            retVal.push(lo);
        }
        else {
            var hi =  0xE0 + ((in_charCode >> 12) & 0x1F);
            var mid = 0x80 + ((in_charCode >>  6) & 0x3F);
            var lo =  0x80 + ((in_charCode      ) & 0x3F);
            retVal = [];
            retVal.push(hi);
            retVal.push(mid);
            retVal.push(lo);
        }
    }
    catch (err) {
        // anything weird, we return undefined
        retVal = undefined;
    }

    return retVal;
}

/**
 * (async) Reverse the operation of the @crdtuxp.encrypt function
 * 
 * @function crdtuxp.decrypt
 * 
 * @param {string} s_or_ByteArr - a string or an array of bytes
 * @param {string} aesKey - a string or an array of bytes
 * @return {array} an array of bytes 
 */

async function decrypt(s_or_ByteArr, aesKey, aesIV) {

    var retVal;

    if (! aesIV) {
        aesIV = "";
    }

    var response = await evalTQL("decrypt(" + dQ(s_or_ByteArr) + ", " + dQ(aesKey) + ", " + dQ(aesIV) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.decrypt = decrypt;

/**
 * (sync) Reverse the operation of @crdtuxp.dQ or @crdtuxp.sQ
 * 
 * @function crdtuxp.deQuote
 * 
 * @param {string} quotedString - a quoted string
 * @return {array} a byte array. If the quoted string contains any \uXXXX codes,
 * these are first encoded using UTF-8 before storing them into the byte array.
 */
function deQuote(quotedString) {

    var retVal = [];

    do {

        var qLen = quotedString.length;
        if (qLen < 2) {
            break;
        }
        
        var quoteChar = quotedString.charAt(0);
        qLen -= 1;
        if (quoteChar != quotedString.charAt(qLen)) {
            break;
        }

        if (quoteChar != '"' && quoteChar != "'") {
            break;
        }

        var buffer = [];
        var state = 0;
        var cCode = 0;
        for (charIdx = 1; charIdx < qLen; charIdx++) {

            if (state == -1) {
                break;
            }

            var c = quotedString.charAt(charIdx);
            switch (state) {
            case 0:
                if (c == '\\') {
                    state = 1;
                }
                else {
                    buffer.push(c.charCodeAt(0));
                }
                break;
            case 1:
                if (c == 'x') {
                    // state 2->3->0
                    state = 2;
                }
                else if (c == 'u') {
                    // state 4->5->6->7->0
                    state = 4;
                }
                else if (c == 't') {
                    buffer.push(0x09);
                    state = 0;
                }
                else if (c == 'r') {
                    buffer.push(0x0D);
                    state = 0;
                }
                else if (c == 'n') {
                    buffer.push(0x0A);
                    state = 0;
                }
                else {
                    buffer.push(c.charCodeAt(0));
                    state = 0;
                }
                break;
            case 2:
            case 4:
                if (c >= '0' && c <= '9') {
                    cCode = c.charCodeAt(0)      - 0x30;
                    state++;
                }
                else if (c >= 'A' && c <= 'F') {
                    cCode = c.charCodeAt(0) + 10 - 0x41;
                    state++;
                }
                else if (c >= 'a' && c <= 'f') {
                    cCode = c.charCodeAt(0) + 10 - 0x61;
                    state++;
                }
                else {
                    state = -1;
                }
                break;
            case 3:
            case 5:
            case 6:
            case 7:

                if (c >= '0' && c <= '9') {
                    cCode = (cCode << 4) + c.charCodeAt(0)      - 0x30;
                }
                else if (c >= 'A' && c <= 'F') {
                    cCode = (cCode << 4) + c.charCodeAt(0) + 10 - 0x41;
                }
                else if (c >= 'a' && c <= 'f') {
                    cCode = (cCode << 4) + c.charCodeAt(0) + 10 - 0x61;
                }
                else {
                    state = -1;
                }

                if (state == 3)  {
                    // Done with \xHH
                    buffer.push(cCode);
                    state = 0;
                }
                else if (state == 7) {
                    // Done with \uHHHHH - convert using UTF-8
                    var bytes = charCodeToUTF8__(cCode);
                    if (! bytes) {
                        state = -1
                    }
                    else {
                        for (var byteIdx = 0; byteIdx < bytes.length; byteIdx++) {
                            buffer.push(bytes[byteIdx]);
                        }
                        state = 0;
                    }
                }
                else {
                    // Next state: 2->3, 4->5->6->7
                    state++;
                }
                break;
            }
        }
    }
    while (false);

    if (state == 0) {
        retVal = buffer;
    }

    return retVal;
}
module.exports.deQuote = deQuote;

/**
 * (async) Delete a directory
 * 
 * Not limited to the UXP security sandbox.
 * 
 * Be very careful with the `recurse` parameter! It is very easy to delete the wrong directory.
 * 
 * @function crdtuxp.dirDelete
 * 
 * @param {string} filePath
 * @param {boolean} recurse
 * @return {boolean} success or failure
 */

async function dirDelete(filePath, recurse) {

    var retVal;

    var response = await evalTQL("dirDelete(" + dQ(filePath) + "," + (recurse ? "true" : "false") + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.dirDelete = dirDelete;

/**
 * (async) Verify whether a directory exists. Will return `false` if the path points to a file (instead of a directory).
 * Also see @crdtuxp.fileExists
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.dirExists
 * 
 * @param {string} dirPath - a path to a directory
 * @return {boolean} true or false 
 */

async function dirExists(dirPath) {

    var retVal;

    var response = await evalTQL("dirExists(" + dQ(dirPath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.dirExists = dirExists;

/**
 * (async) Create a directory
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.dirCreate
 * 
 * @param {string} filePath
 * @return {array} list if items in directory
 */

async function dirCreate(filePath) {

    var retVal;

    var response = await evalTQL("dirCreate(" + dQ(filePath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.dirCreate = dirCreate;

/**
 * (async) Scan a directory
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.dirScan
 * 
 * @param {string} filePath
 * @return {array} list if items in directory
 */

async function dirScan(filePath) {

    var retVal;

    var response = await evalTQL("enquote(dirScan(" + dQ(filePath) + ").toString())");
    if (response && ! response.error) {
        retVal = JSON.parse(binaryUTF8ToStr(deQuote(response.text)));
    }

    return retVal;
}
module.exports.dirScan = dirScan;

/**
 * (sync) Wrap a string or a byte array into double quotes, encoding any
 * binary data as a string. Knows how to handle Unicode characters
 * or binary zeroes. 
 * 
 * When the input is a string, high Unicode characters are
 * encoded as `\uHHHH`. 
 * 
 * When the inoput is a byte array, all bytes are encoded
 * as characters or as `\xHH` escape sequences.
 * 
 * @function crdtuxp.dQ
 * 
 * @param {string} s_or_ByteArr - a Unicode string or an array of bytes
 * @return {string} a string enclosed in double quotes. This string is pure 7-bit
 * ASCII and can be used into generated script code 
 * Example:
 * var script = "a=b(" + dQ(somedata) + ");";
 */
function dQ(s_or_ByteArr) {
    return enQuote__(s_or_ByteArr, "\"");
}
module.exports.dQ = dQ;

/**
 * (async) Encrypt a string or array of bytes using a key. A random salt
 * is added into the mix, so even when passing in the same parameter values, the result will
 * be different every time.
 * 
 * @function crdtuxp.encrypt
 * 
 * @param {string} s_or_ByteArr - a string or an array of bytes
 * @param {string} aesKey - a string or an array of bytes
 * @return {string} a base-64 encoded encrypted string. 
 */

async function encrypt(s_or_ByteArr, aesKey, aesIV) {
    var retVal;

    if (! aesIV) {
        aesIV = "";
    }

    var response = await evalTQL("encrypt(" + dQ(s_or_ByteArr) + ", "+ dQ(aesKey) + ", " + dQ(aesIV) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.encrypt = encrypt;

//
// (sync) enQuote__: Internal helper function. Escape and wrap a string in quotes
//
function enQuote__(s_or_ByteArr, quoteChar) {

    var retVal = "";

    var quoteCharCode = quoteChar.charCodeAt(0);

    var isString = ("string" == typeof s_or_ByteArr);
    var escapedS = "";
    var sLen = s_or_ByteArr.length;
    for (var charIdx = 0; charIdx < sLen; charIdx++) {
        var cCode;
        if (isString) {
            cCode = s_or_ByteArr.charCodeAt(charIdx);
        }
        else {
            cCode = s_or_ByteArr[charIdx];
        }
        if (cCode == 0x5C) {
            escapedS += '\\\\';
        }
        else if (cCode == quoteCharCode) {
            escapedS += '\\' + quoteChar;
        }
        else if (cCode == 0x0A) {
            escapedS += '\\n';
        }
        else if (cCode == 0x0D) {
            escapedS += '\\r';
        }
        else if (cCode == 0x09) {
            escapedS += '\\t';
        }
        else if (cCode < 32 || cCode == 0x7F || (! isString && cCode >= 0x80)) {
            escapedS += "\\x" + toHex(cCode, 2);
        }
        else if (isString && cCode >= 0x80) {
            escapedS += "\\u" + toHex(cCode, 4);
        }
        else {
            escapedS += String.fromCharCode(cCode);
        }

    }

    retVal = quoteChar + escapedS + quoteChar;

    return retVal;
}

/**
 * (async) Send a TQL script to the daemon and wait for the result
 * 
 * @function crdtuxp.evalTQL
 * 
 * @param {string} tqlScript - a script to run
 * @param {string} tqlScopeName - a scope name to use. Scopes are persistent for the duration of the daemon process and can
 * be used to pass data between different processes
 * @param {boolean} resultIsRawBinary - whether the resulting data is raw binary, or can be decoded as a string
 * @return {any} a string or a byte array
 */
async function evalTQL(tqlScript, tqlScopeName, resultIsRawBinary) {

    var retVal = {
        error: true
    };

    try {

        if (! tqlScopeName) {
            tqlScopeName = TQL_SCOPE_NAME_DEFAULT;
        }

        const init = {
            method: "POST",
            body: tqlScript
        };

        const response = await fetch(LOCALHOST_URL + "/" + tqlScopeName + "?" + HTTP_CACHE_BUSTER, init);
        HTTP_CACHE_BUSTER = HTTP_CACHE_BUSTER + 1;
        
        const responseText = await response.text();
        var responseTextUnwrapped;
        if (resultIsRawBinary) {
            responseTextUnwrapped = responseText;
        }
        else {
            responseTextUnwrapped = binaryUTF8ToStr(deQuote(responseText));
        }
        
        retVal = {
            error: false,
            text: responseTextUnwrapped
        };

    } catch (e) {
        throw "CRDT daemon is probably not running. Use License Manager to verify CRDT is activated, then use the Preferences screen to start it";
    }

    return retVal;
}
module.exports.evalTQL = evalTQL;

/**
 * (async) Close a currently open file
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.fileClose
 * 
 * @param {number} fileHandle - a file handle as returned by fileOpen()
 * @return {boolean} success or failure
 */

async function fileClose(fileHandle) {

    var retVal;

    var response = await evalTQL("fileClose(" + fileHandle + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileClose = fileClose;

/**
 * (async) Delete a file
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.fileDelete
 * 
 * @param {string} filePath
 * @return {boolean} success or failure
 */

async function fileDelete(filePath) {

    var retVal;

    var response = await evalTQL("fileDelete(" + dQ(filePath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileDelete = fileDelete;

/**
 * (async) Check if a file exists. Will return `false` if the file path points to a directory. 
 * Also see @crdtuxp.dirExists
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.fileExists
 * 
 * @param {string} filePath
 * @return {boolean} existence of file
 */

async function fileExists(filePath) {

    var retVal;

    var response = await evalTQL("fileExists(" + dQ(filePath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileExists = fileExists;

/**
 * (async) Open a binary file and return a handle
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.fileOpen
 * 
 * @param {string} fileName - a native full file path to the file
 * @param {string} mode - one of 'a', 'r', 'w' (append, read, write)
 * @return {number} file handle
 */

async function fileOpen(fileName, mode) {

    var retVal;

    var response;
    if (mode) {
        response = await evalTQL("enquote(fileOpen(" + dQ(fileName) + "," + dQ(mode) + "))");
    }
    else {
        response = await evalTQL("enquote(fileOpen(" + dQ(fileName) + "))");
    }
    if (response && ! response.error) {
        retVal = parseInt(binaryUTF8ToStr(deQuote(response.text)), 10);
    }

    return retVal;
}
module.exports.fileOpen = fileOpen;

/**
 * (async) Read a file into memory
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.fileRead
 * 
 * @param {number} fileHandle - a file handle as returned by fileOpen()
 * @param {boolean} isBinary - whether the file is considered a binary file (as opposed to a UTF-8 text file)
 * @return {any} retn either a byte array or a string
 */

async function fileRead(fileHandle, isBinary) {

    var retVal;

    var response = await evalTQL("enquote(fileRead(" + fileHandle + "))", undefined, true);
    if (response && ! response.error) {
        var byteArray = deQuote(response.text);
        if (isBinary) {
            retVal = deQuote(binaryUTF8ToStr(byteArray));
        }
        else {
            retVal = binaryUTF8ToStr(deQuote(binaryUTF8ToStr(byteArray)));
        }
    }

    return retVal;
}
module.exports.fileRead = fileRead;

/**
 * (async) Binary write to a file. Strings are written as UTF-8
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.fileWrite
 * 
 * @param {number} fileHandle - a file handle as returned by fileOpen()
 * @param {string} s_or_ByteArr - data to write to the file
 * @return {boolean} retn value from daemon
 */

async function fileWrite(fileHandle, s_or_ByteArr) {

    var retVal;

    var byteArray;
    if ("string" == typeof s_or_ByteArr) {
        byteArray = strToUTF8(s_or_ByteArr);
    }
    else {
        byteArray = s_or_ByteArr;
    }

    var response = await evalTQL("fileWrite(" + fileHandle + "," + dQ(byteArray) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileWrite = fileWrite;

/**
 * (async) Query the daemon to see whether some software is currently activated or not
 * 
 * @function crdtuxp.getCapability
 * 
 * @param {string} issuer - a GUID identifier for the developer account as seen in the License Manager
 * @param {string} productCode - a product code for the software product to be activated (as determined by the developer)
 * @param {string} password - the password (created by the developer) needed to decode the capability data
 * @return {string} a JSON structure with capability data (customer GUID, decrypted data from the activation file)
 */
async function getCapability(issuer, productCode, password) {

    var retVal;

    var response = await evalTQL("getCapability(" + dQ(issuer) + ", " + dQ(productCode) + ", " + dQ(password) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}    
module.exports.getCapability = getCapability;

/**
 * (async) Get the path of a system directory
 * 
 * Not limited to the UXP security sandbox.
 * 
 * @function crdtuxp.getDir
 * 
 * @param {string} dirTag - a tag representing the dir:
 * ```
 *    crdtuxp.DESKTOP_DIR
 *    crdtuxp.DOCUMENTS_DIR
 *    crdtuxp.HOME_DIR
 *    crdtuxp.LOG_DIR
 *    crdtuxp.SYSTEMDATA_DIR
 *    crdtuxp.TMP_DIR
 *    crdtuxp.USERDATA_DIR
 * ```
 * @return {string} file path of dir or undefined
 */
async function getDir(dirTag) {

    var retVal;

    var sysInfo = await getSysInfo__();
    if (dirTag in sysInfo) {
        retVal = sysInfo[dirTag];
    }

    return retVal;
}
module.exports.getDir = getDir;

/**
 * (async) Access the environment as seen by the daemon program
 * 
 * @function crdtuxp.getEnvironment
 * 
 * @param {string} getEnvironment - name of environment variable
 * @return {string} environment variable value
 */
async function getEnvironment(in_envVarName) {

    var retVal;

    var response = await evalTQL("getEnv(" + dQ(in_envVarName) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.getEnvironment = getEnvironment;

// Internal function getSysInfo__: fetch the whole Tightener sysInfo structure

async function getSysInfo__() {

    var retVal;

    if (! SYS_INFO) {
        var response = await evalTQL("enquote(sysInfo())");
        if (response && ! response.error) {
            SYS_INFO = JSON.parse(binaryUTF8ToStr(deQuote(response.text)))
        }
    }
    
    retVal = SYS_INFO;

    return retVal;
}

/**
 * (sync) Calculate an integer power of an int value. Avoids using floating point, so 
 * should not have any floating-point round-off errors. `Math.pow()` will probably
 * give the exact same result, but I am doubtful that some implementations might internally use `log` and `exp` 
 * to handle `Math.pow()`
 * 
 * @function crdtuxp.intPow
 * 
 * @param {number} i - Integer base
 * @param {number} intPower - integer power
 * @return {number} i ^ intPower
 */

function intPow(i, intPower) {

    var retVal;
    if (Math.floor(intPower) != intPower) {
        // Must be integer
        retVal = undefined;
    }
    else if (intPower == 0) {
        // Handle power of 0: 0^0 is not a number
        if (i == 0) {
            retVal = NaN;
        }
        else {
            retVal = 1;
        }
    }
    else if (i == 1) {
        // Multiplying 1 with itself is 1
        retVal = 1;
    }
    else if (intPower == 1) {
        // i ^ 1 is i
        retVal = i;
    }
    else if (intPower < 0) {
        // i^-x is 1/(i^x)
        retVal = 1/intPow(i, -intPower);
    }
    else {
        // Divide and conquer
        var halfIntPower = intPower >> 1;
        var otherHalfIntPower = intPower - halfIntPower;
        var part1 = intPow(i, halfIntPower);
        var part2;
        if (halfIntPower == otherHalfIntPower) {
            part2 = part1;
        }
        else {
            part2 =  intPow(i, otherHalfIntPower);
        }
        retVal = part1 * part2;
    }

    return retVal;
}
module.exports.intPow = intPow;

/**
 * (sync) Extend or shorten a string to an exact length, adding `padChar` as needed
 * 
 * @function crdtuxp.leftPad
 * 
 * @param {string} s - string to be extended or shortened
 * @param {string} padChar - string to append repeatedly if length needs to extended
 * @param {number} len - desired result length
 * @return {string} padded or shortened string
 */

function leftPad(s, padChar, len) {

    var retVal = undefined;

    do {
        try {

            retVal = s + "";
            if (retVal.length == len) {
                break;
            }

            if (retVal.length > len) {
                retVal = retVal.substring(retVal.length - len);
                break;
            }

            var padLength = len - retVal.length;

            var padding = new Array(padLength + 1).join(padChar)
            retVal = padding + retVal;
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}
module.exports.leftPad = leftPad;

/**
 * (async) Make a log entry of the call of a function. Pass in the `arguments` keyword as a parameter.
 * 
 * @function crdtuxp.logEntry
 * 
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 */

async function logEntry(reportingFunctionArguments) {
    if (LOG_ENTRY_EXIT) {
        await logTrace(reportingFunctionArguments, "Entry");
    }
}
module.exports.logEntry = logEntry;

/**
 * (async) Make a log entry of an error message. Pass in the `arguments` keyword as the first parameter
 * If the error level is below `LOG_LEVEL_ERROR` nothing happens
 * 
 * @function crdtuxp.logError
 * 
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - error message
 */
async function logError(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_ERROR) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage__(reportingFunctionArguments, "ERROR", message);
    }
}
module.exports.logError = logError;

/**
 * (async) Make a log entry of the exit of a function. Pass in the `arguments` keyword as a parameter.
 * 
 * @function crdtuxp.logExit
 * 
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 */

async function logExit(reportingFunctionArguments) {
    if (LOG_ENTRY_EXIT) {
        logTrace(reportingFunctionArguments, "Exit");
    }
}
module.exports.logExit = logExit;

/**
 * (sync) Extract the function name from its arguments
 * 
 * @function crdtuxp.functionNameFromArguments
 * 
 * @param {object} functionArguments - pass in the current `arguments` to the function. This is used to determine the function's name
 * @return {string} function name
 */

function functionNameFromArguments(functionArguments) {

    var functionName;
    try {
        functionName = functionArguments.callee.toString().match(/function ([^\(]+)/)[1];
    }
    catch (err) {
        functionName = "[anonymous function]";
    }

    return functionName;

}
module.exports.functionNameFromArguments = functionNameFromArguments;


// Internal use: write out a log message

async function logMessage__(reportingFunctionArguments, levelPrefix, message) {

    var savedInLogger = IN_LOGGER;

    do {
        try {

            if (IN_LOGGER) {
                break;
            }
            
            IN_LOGGER = true;
            
            var functionPrefix = "";

            if (! message) {

                  message = reportingFunctionArguments;
                  reportingFunctionArguments = undefined;

            }
            else if (reportingFunctionArguments) {

                if ("string" == typeof reportingFunctionArguments) {

                    functionPrefix += reportingFunctionArguments + ": ";
                    
                }
                else {

                    functionPrefix += functionNameFromArguments(reportingFunctionArguments) + ": ";

                }
            }
            
            var now = new Date();
            var timePrefix = 
                leftPad(now.getUTCDate(), "0", 2) + 
                "-" + 
                leftPad(now.getUTCMonth() + 1, "0", 2) + 
                "-" + 
                leftPad(now.getUTCFullYear(), "0", 4) + 
                " " + 
                leftPad(now.getUTCHours(), "0", 2) + 
                ":" + 
                leftPad(now.getUTCMinutes(), "0", 2) + 
                ":" + 
                leftPad(now.getUTCSeconds(), "0", 2) + 
                "+00 ";

            var platformPrefix = "U ";
            
            var logLine = platformPrefix + timePrefix + "- " + levelPrefix + ": " + functionPrefix + message;
                    
            if (LOG_TO_UXPDEVTOOL_CONSOLE) {
                console.log(logLine); 
            }

            if (LOG_TO_FILEPATH) {
                var fileHandle = await fileOpen(LOG_TO_FILEPATH, "a");
                await fileWrite(fileHandle, logLine + "\n");
                await fileClose(fileHandle);
            }

        }
        catch (err) {
        }
    }
    while (false);

    IN_LOGGER = savedInLogger;
}

/**
 * (async) Make a log entry of a note. Pass in the `arguments` keyword as the first parameter.
 * If the error level is below `LOG_LEVEL_NOTE` nothing happens
 * 
 * @function crdtuxp.logNote
 * 
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - the note to output
 */
async function logNote(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_NOTE) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage__(reportingFunctionArguments, "NOTE ", message);
    }
}
module.exports.logNote = logNote;

/**
 * (async) Emit a trace messsage into the log. Pass in the `arguments` keyword as the first parameter.
 * If the error level is below `LOG_LEVEL_TRACE` nothing happens
 * 
 * @function crdtuxp.logTrace
 * 
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - the trace message to output
 */
async function logTrace(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_TRACE) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage__(reportingFunctionArguments, "TRACE", message);
    }
}
module.exports.logTrace = logTrace;

/**
 * (async) Emit a warning messsage into the log. Pass in the `arguments` keyword as the first parameter.
 * If the error level is below `LOG_LEVEL_WARNING` nothing happens
 * 
 * @function crdtuxp.logWarning
 * 
 * @param {array} arguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - the warning message to output
 */
async function logWarning(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_WARNING) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage__(reportingFunctionArguments, "WARN ", message);
    }
}
module.exports.logWarning = logWarning;

/**
 * (async) The unique `GUID` of this computer
 * 
 * @function crdtuxp.machineGUID
 * 
 * @return {string} a `GUID` string
 */
async function machineGUID() {

    var retVal;

    var response = await evalTQL("machineGUID()");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}  
module.exports.machineGUID = machineGUID;  

/**
 * (sync) Restore the log level to what it was when pushLogLevel was called
 * 
 * @function crdtuxp.popLogLevel
 * 
 * @return {number} log level that was popped off the stack
 */

function popLogLevel() {

    var retVal;

    retVal = LOG_LEVEL;
    if (LOG_LEVEL_STACK.length > 0) {
        LOG_LEVEL = LOG_LEVEL_STACK.pop();
    }
    else {
        LOG_LEVEL = LOG_LEVEL_NONE;
    }
    
    return retVal;
}
module.exports.popLogLevel = popLogLevel;

/**
 * (sync) Save the previous log level and set a new log level
 * 
 * @function crdtuxp.pushLogLevel
 * 
 * @param {number} newLogLevel - new log level to set
 * @return {number} previous log level 
 */

function pushLogLevel(newLogLevel) {

    var retVal;

    retVal = LOG_LEVEL;
    LOG_LEVEL_STACK.push(LOG_LEVEL);
    LOG_LEVEL = newLogLevel;

    return retVal;
}
module.exports.pushLogLevel = pushLogLevel;

/**
 * (sync) Extend or shorten a string to an exact length, adding `padChar` as needed
 * 
 * @function crdtuxp.rightPad
 * 
 * @param {string} s - string to be extended or shortened
 * @param {string} padChar - string to append repeatedly if length needs to extended
 * @param {number} len - desired result length
 * @return {string} padded or shortened string
 */

function rightPad(s, padChar, len) {

    var retVal = undefined;

    do {
        try {

            retVal = s + "";

            if (retVal.length == len) {
                break;
            }

            if (retVal.length > len) {
                retVal = retVal.substring(0, len);
                break;
            }

            var padLength = len - retVal.length;

            var padding = new Array(padLength + 1).join(padChar)
            retVal = retVal + padding;
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}
module.exports.rightPad = rightPad;

/**
 * (async) Send in activation data so the daemon can determine whether some software is currently activated or not
 * Needs to be followed by a @crdtuxp.sublicense call
 * 
 * @function crdtuxp.setIssuer
 * 
 * @param {string} issuerGUID - a GUID identifier for the developer account as seen in the License Manager
 * @param {string} issuerEmail - the email for the developer account as seen in the License Manager
 * @returns { boolean } - success or failure
 */
async function setIssuer(issuerGUID, issuerEmail) {

    var retVal;

    var response = await evalTQL("setIssuer(" + dQ(issuerGUID) + "," + dQ(issuerEmail) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.setIssuer = setIssuer;

/**
 * (sync) Wrap a string or a byte array into single quotes, encoding any
 * binary data as a string. Knows how to handle Unicode characters
 * or binary zeroes.
 * 
 * When the input is a string, high Unicode characters are
 * encoded as `\uHHHH`
 * 
 * When the inoput is a byte array, all bytes are encoded as `\xHH` escape sequences.
 * 
 * @function crdtuxp.sQ
 * 
 * @param {string} s_or_ByteArr - a Unicode string or an array of bytes
 * @return {string} a string enclosed in double quotes. This string is pure 7-bit
 * ASCII and can be used into generated script code 
 * Example:
 * var script = "a=b(" + sQ(somedata) + ");";
 */
function sQ(s_or_ByteArr) {
    return enQuote__(s_or_ByteArr, "'");
}
module.exports.sQ = sQ;

/**
 * (sync) Encode a string into an byte array using UTF-8
 * 
 * @function crdtuxp.strToUTF8
 * 
 * @param {string} in_s - a string
 * @return { array } a byte array
 */
function strToUTF8(in_s) {

    var retVal = [];

    var idx = 0;
    var len = in_s.length;
    var cCode;
    while (idx < len) {
        cCode = in_s.charCodeAt(idx);
        idx++;
        var bytes = charCodeToUTF8__(cCode);
        if (! bytes) {
            retVal = undefined;
            break;
        }
        else {
            for (var byteIdx = 0; byteIdx < bytes.length; byteIdx++) {
                retVal.push(bytes[byteIdx]);
            }
        }
    }

    return retVal;
}
module.exports.strToUTF8 = strToUTF8;

/**
 * (async) Send in sublicense info generated in the License Manager so the daemon can determine whether some software is currently activated or not
 * Needs to be preceded by a @crdtuxp.setIssuer call
 * 
 * @function crdtuxp.sublicense
 * 
 * @param {string} key - key needed to decode activation data
 * @param {string} activation - encrypted activation data
 * @return { boolean } success or failure
 */
async function sublicense(key, activation) {

    var retVal;

    var response = await evalTQL("sublicense(" + dQ(key) + "," + dQ(activation) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.sublicense = sublicense;

/**
 * (sync) Convert an integer into a hex representation with a fixed number of digits
 * Negative numbers are converted using 2-s complement (so `-15` results in `0x01`)
 * 
 * @function crdtuxp.toHex
 * 
 * @param {number} i - integer to convert to hex
 * @param {number} numDigits - How many digits. Defaults to 4 if omitted.
 * @return { string } hex-encoded integer
 */
function toHex(i, numDigits) {

    if (! numDigits) {
        numDigits = 4;
    }

    if (i < 0) {
        var upper = intPow(2, numDigits*4);
        // Calculate 2's complement with numDigits if negative
        i = (intPow(2, numDigits*4) + i) & (upper - 1);
    }

    // Calculate and cache a long enough string of zeroes
    var zeroes = toHex.zeroes;
    if (! zeroes) {
        zeroes = "0";
    }
    while (zeroes.length < numDigits) {
        zeroes += zeroes;
    }
    toHex.zeroes = zeroes;

    var retVal = i.toString(16).toLowerCase(); // Probably always lowercase by default, but just in case...
    if (retVal.length > numDigits) {
        retVal = retVal.substring(retVal.length - numDigits);
    } 
    else if (retVal.length < numDigits) {
        retVal = zeroes.substr(0, numDigits - retVal.length) + retVal;
    }

    return retVal;
}
module.exports.toHex = toHex;