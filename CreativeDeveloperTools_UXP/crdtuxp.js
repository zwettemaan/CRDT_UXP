//
// localhost.tgrg.net resolves to 127.0.0.1
// The Tightener daemon manages the necessary certificate for https
//
const DNS_NAME_FOR_LOCALHOST = "localhost.tgrg.net";
const PORT_TIGHTENER_DAEMON = 18888;

const LOCALHOST_URL = "https://" + DNS_NAME_FOR_LOCALHOST+ ":" + PORT_TIGHTENER_DAEMON;

//
// The Tightener daemon provides persistent named scopes (similar to persistent ExtendScript engines)
// When executing multiple TQL scripts in succession a named scope will retain any globals that
// were defined by a previous script
//
// When missing, by default, we will use this scope name
//
const TQL_SCOPE_NAME_DEFAULT = "defaultScope";

// 
// UXP internally caches responses from the server - we need to avoid this as each script
// run can return different results
//
var cacheBuster = Math.floor(Math.random() * 1000000);

if (! module.exports) {
    module.exports = {};
}

async function base64decode(base64Str) {

    var retVal;

    var response = await evalTQL("base64decode(" + dQ(base64Str) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.base64decode = base64decode;

async function base64encode(s_or_ByteArr) {

    var retVal;

    var response = await evalTQL("base64encode(" + dQ(s_or_ByteArr) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.base64encode = base64encode;

function binaryUTF8ToStr(in_byteArray) {

    var retVal = "";

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

    return retVal;
}
module.exports.binaryUTF8ToStr = binaryUTF8ToStr;

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

async function dirExists(dirPath) {

    var retVal;

    var response = await evalTQL("dirExists(" + dQ(dirPath) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.dirExists = dirExists;

//
// dQ: Wrap a string in double quotes, properly escaping as needed
//
function dQ(s_or_ByteArr) {
    return enQuote__(s_or_ByteArr, "\"");
}
module.exports.dQ = dQ;

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
// enQuote__: Helper function. Escape and wrap a string in quotes
//
function enQuote__(s_or_ByteArr, quoteChar) {

    var retVal = "";

    var quoteCharCode = quoteChar.charCodeAt(0);

    var isString = "string" == typeof s_or_ByteArr;
    var escapedS = "";
    var sLen = s_or_ByteArr.length;
    for (var charIdx = 0; charIdx < sLen; charIdx++) {
        var cCode;
        if (isString) {
            var c = s_or_ByteArr.charAt(charIdx);
            cCode = c.charCodeAt(0);
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
        else if (cCode < 32 || (cCode >= 0x7F && cCode <= 0xFF)) {
            escapedS += "\\x" + toHex(cCode, 2);
        }
        else if (cCode > 0xFF) {
            escapedS += "\\u" + toHex(cCode, 4);
        }
        else {
            escapedS += String.fromCharCode(cCode);
        }

    }

    retVal = quoteChar + escapedS + quoteChar;

    return retVal;
}

//
// deQuote: Unescape and remove quotes, return byte array
//
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

        if (quoteChar != '"' && quoteChar != '"') {
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
                    state = 2;
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
                if (c >= '0' && c <= '9') {
                    cCode = c.charCodeAt(0) - 0x30;
                    state = 3;
                }
                else if (c >= 'A' && c <= 'F') {
                    cCode = c.charCodeAt(0) + 10 - 0x41;
                    state = 3;
                }
                else if (c >= 'a' && c <= 'f') {
                    cCode = c.charCodeAt(0) + 10 - 0x61;
                    state = 3;
                }
                else {
                    state = -1;
                }
                break;
            case 3:
                if (c >= '0' && c <= '9') {
                    cCode = (cCode << 4) + c.charCodeAt(0) - 0x30;
                    buffer.push(cCode);
                    state = 0;
                }
                else if (c >= 'A' && c <= 'F') {
                    cCode = (cCode << 4) + c.charCodeAt(0) + 10 - 0x41;
                    buffer.push(cCode);
                    state = 0;
                }
                else if (c >= 'a' && c <= 'f') {
                    cCode = (cCode << 4) + c.charCodeAt(0) + 10 - 0x61;
                    buffer.push(cCode);
                    state = 0;
                }
                else {
                    state = -1;
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

async function fileClose(fileHandle) {

    var retVal;

    var response;
    response = await evalTQL("fileClose(" + fileHandle + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.fileClose = fileClose;

//
// fileOpen: open a file and return a handle for it. Use fileWrite/fileRead/fileClose with
// that handle
//
async function fileOpen(fileName, mode) {

    var retVal;

    var response;
    if (mode) {
        response = await evalTQL("fileOpen(" + dQ(fileName) + "," + dQ(mode) + ")");
    }
    else {
        response = await evalTQL("fileOpen(" + dQ(fileName) + ")");
    }
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.fileOpen = fileOpen;

//
// fileRead: read from a file handle obtained from fileOpen
//
async function fileRead(fileHandle, isBinary) {

    var retVal;

    var response;
    response = await evalTQL("fileRead(" + fileHandle + ")", undefined, true);
    if (response && ! response.error) {
        var byteArray = deQuote(response.text);
        if (isBinary) {
            retVal = byteArray;
        }
        else {
            retVal = binaryUTF8ToStr(byteArray);
        }
    }

    return retVal;
}
module.exports.fileRead = fileRead;

//
// fileWrite: write to a file handle obtained from fileOpen
//
async function fileWrite(fileHandle, s_or_ByteArr) {

    var retVal;

    var response;
    response = await evalTQL("fileWrite(" + fileHandle + "," + dQ(s_or_ByteArr) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.fileWrite = fileWrite;

//
// intPow: calculate a power by multiplication
//
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

//
// sQ: Escape and wrap a string in single quotes
//
function sQ(s_or_ByteArr) {
    return enQuote__(s_or_ByteArr, "'");
}
module.exports.sQ = sQ;

//
// evalTQL: Async function. Send a tqlScript to the daemon, and evaluate it in
// the named TQL scope. TQL scopes are persistent and globals are retained between
// consecutive calls to evalTQL
//
async function evalTQL(tqlScript, tqlScopeName, raw) {

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

        const response = await fetch(LOCALHOST_URL + "/" + tqlScopeName + "?" + cacheBuster, init);
        cacheBuster = cacheBuster + 1;
        
        const responseText = await response.text();
        var responseTextUnwrapped;
        if (raw) {
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
        retVal.exception = e;
    }

    return retVal;
}
module.exports.evalTQL = evalTQL;

//
// Async function. Query the Tightener activation system and fetch the activation data
//
async function getCapability(issuer, productCode, password) {

    var retVal;

    var response = await evalTQL("getCapability(" + dQ(issuer) + ", " + dQ(productCode) + ", " + dQ(password) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}    
module.exports.getCapability = getCapability;

//
// Async function. Query the Tightener machineGUID
//
async function machineGUID() {

    var retVal;

    var response = await evalTQL("machineGUID()");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}  
module.exports.machineGUID = machineGUID;  

async function setIssuer(issuerGUID, issuerEmail) {

    var retVal;

    var response = await evalTQL("setIssuer(" + dQ(issuerGUID) + "," + dQ(issuerEmail) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.setIssuer = setIssuer;

async function sublicense(key, activation) {

    var retVal;

    var response = await evalTQL("sublicense(" + dQ(key) + "," + dQ(activation) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.sublicense = sublicense;

//
// toHex: convert int to fixed length hex; default length is 4.
//
function toHex(i, numDigits) {

    if (! numDigits) {
        numDigits = 4;
    }

    if (i < 0) {
        // Calculate 2's complement with numDigits if negative
        i = intPow(2, numDigits*4) + i;
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

    var retVal = i.toString(16);
    if (retVal.length > numDigits) {
        retVal = retVal.substring(retVal.length - numDigits);
    } 
    else if (retVal.length < numDigits) {
        retVal = zeroes.substr(0, numDigits - retVal.length) + retVal;
    }

    return retVal;
}
module.exports.toHex = toHex;