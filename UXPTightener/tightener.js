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

async function decrypt(s, aesKey, aesIV) {
    var retVal;

    if (! aesIV) {
        aesIV = "";
    }

    var response = await evalTQL("decrypt(" + dQ(s) + ", " + dQ(aesKey) + ", " + dQ(aesIV) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.decrypt = decrypt;

//
// dQ: Wrap a string in double quotes, properly escaping as needed
//
function dQ(s) {
    return enQuote__(s, "\"");
}
module.exports.dQ = dQ;

async function encrypt(s, aesKey, aesIV) {
    var retVal;

    if (! aesIV) {
        aesIV = "";
    }

    var response = await evalTQL("encrypt(" + dQ(s) + ", "+ dQ(aesKey) + ", " + dQ(aesIV) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.encrypt = encrypt;

//
// enQuote__: Helper function. Escape and wrap a string in quotes
//
function enQuote__(s, quoteChar) {

    var retVal = "";

    var escapedS = "";
    var sLen = s.length;
    for (var charIdx = 0; charIdx < sLen; charIdx++) {
        var c = s.charAt(charIdx);
        if (c == '\\') {
            escapedS += '\\\\';
        }
        else if (c == quoteChar) {
            escapedS += '\\' + quoteChar;
        }
        else if (c == '\n') {
            escapedS += '\\n';
        }
        else if (c == '\r') {
            escapedS += '\\r';
        }
        else if (c == '\t') {
            escapedS += '\\t';
        }
        else 
        {
            var cCode = c.charCodeAt(0)
            if (cCode < 32) {
                escapedS += "\\u" + toHex(cCode, 4);
            }
            else if (cCode >= 127) {
                escapedS += "\\u" + toHex(cCode, 4);
            }
            else {
                escapedS += c;
            }
        }

    }

    retVal = quoteChar + escapedS + quoteChar;

    return retVal;
}

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
function sQ(s) {
    return enQuote__(s, "'");
}
module.exports.sQ = sQ;

//
// evalTQL: Async function. Send a tqlScript to the daemon, and evaluate it in
// the named TQL scope. TQL scopes are persistent and globals are retained between
// consecutive calls to evalTQL
//
async function evalTQL(tqlScript, tqlScopeName) {

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
        const responseTextUnwrapped = eval(responseText);
        
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