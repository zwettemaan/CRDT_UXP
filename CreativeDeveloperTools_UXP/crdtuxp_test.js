const crdtuxp = require("./crdtuxp");

if (! module.exports) {
    module.exports = {};
}

async function testBase64() {

    var retVal = true;

    var s = await crdtuxp.base64encode("Hello World☜✿");
    if (s != "SGVsbG8gV29ybGTimJzinL8=") {
        await crdtuxp.logError(arguments, "failed to crdtuxp.base64encode(\"Hello World☜✿\")");
        retVal = false;
    }

    var s = await crdtuxp.base64decode("SGVsbG8gV29ybGTimJzinL8=");
    if (s != "Hello World☜✿") {
        await crdtuxp.logError(arguments, "failed to crdtuxp.base64decode(\"SGVsbG8gV29ybGTimJzinL8=\")");
        retVal = false;
    }

    return retVal;
}

async function testQuoteDequote() {

    var retVal = true;

    var s = crdtuxp.dQ("");
    if (s != "\"\"") {
        await crdtuxp.logError(arguments, "failed to crdtuxp.dQ(\"\")");
        retVal = false;
    }

    s = crdtuxp.dQ('');
    if (s != "\"\"") {
        await crdtuxp.logError(arguments, "failed to crdtuxp.dQ('')");
        retVal = false;
    }

    s = crdtuxp.sQ("");
    if (s != "''") {
        await crdtuxp.logError(arguments, "failed to crdtuxp.sQ(\"\")");
        retVal = false;
    }

    s = crdtuxp.sQ('');
    if (s != "''") {
        await crdtuxp.logError(arguments, "failed to crdtuxp.sQ('')");
        retVal = false;
    }

    s = crdtuxp.dQ("abc'\"\x00\n\r\t\x0a\x0d\x09\u0061\u007f\x80\u0080\u0123\u07ff\u1000\u7fff");
    if (s != "\"abc'\\\"\\x00\\n\\r\\t\\n\\r\\ta\\x7f\\u0080\\u0080\\u0123\\u07ff\\u1000\\u7fff\"") {
        await crdtuxp.logError(arguments, "failed crdtuxp.dQ complex string");
        retVal = false;
    }

    s = crdtuxp.sQ("abc'\"\x00\n\r\t\x0a\x0d\x09\u0061\u007f\x80\u0080\u0123\u07ff\u1000\u7fff");
    if (s != "'abc\\'\"\\x00\\n\\r\\t\\n\\r\\ta\\x7f\\u0080\\u0080\\u0123\\u07ff\\u1000\\u7fff'") {
        await crdtuxp.logError(arguments, "failed crdtuxp.sQ complex string");
        retVal = false;
    }

    // Byte array can contain 0x80 or 0xFF, which would not occur in a UTF-8 string as \u0080 is encoded 
    // into a 2-byte sequence.

    s = crdtuxp.dQ([0x61, 0x62, 0x63, 0x27, 0x22, 0x00, 0x0A, 0x0D, 0x09, 0x61, 0x7f, 0x80, 0xFF]);
    if (s != "\"abc'\\\"\\x00\\n\\r\\ta\\x7f\\x80\\xff\"") {
        await crdtuxp.logError(arguments, "failed crdtuxp.dQ complex byte array");
        retVal = false;
    }

    s = crdtuxp.sQ([0x61, 0x62, 0x63, 0x27, 0x22, 0x00, 0x0A, 0x0D, 0x09, 0x61, 0x7f, 0x80, 0xFF]);
    if (s != "'abc\\'\"\\x00\\n\\r\\ta\\x7f\\x80\\xff'") {
        await crdtuxp.logError(arguments, "failed crdtuxp.sQ complex byte array");
        retVal = false;
    }

    s = [];
    for (var idx = 0; idx < 256; idx++) {
        s.push(idx);
    }

    s = crdtuxp.sQ(s);
    if (s != '') {
        await crdtuxp.logError(arguments, "failed crdtuxp.sQ byte array with all bytes 0-255");
        retVal = false;        
    }

    s = crdtuxp.deQuote(s);
    var isOK = true;
    if (s.length != 256) {
        await crdtuxp.logError(arguments, "crdtuxp.deQuote wrong length");
        retVal = false;        
    }
    else {
        for (var idx = 0; idx < 256; idx++) {
            if (s[idx] != idx) {
                await crdtuxp.logError(arguments, "crdtuxp.deQuote wrong byte #" + idx);
                retVal = false;        
                break;
            }
        }
    }

    return retVal;
}

var tests = [
    testQuoteDequote,
    testBase64
];

async function run() {

    crdtuxp.pushLogLevel(crdtuxp.LOG_LEVEL_NOTE);
    
    await crdtuxp.logNote(arguments, "Starting crdtuxp_test");

    var success = true;

    for (var idx = 0; idx < tests.length; idx++) {
        try {
            var ftn = tests[idx];
            var result = await ftn();            
            if (! result) {
                await crdtuxp.logError(arguments, "failed test idx " + idx);
            }
        }
        catch (err) {
            await crdtuxp.logError(arguments, "throws " + err + " for test idx " + idx);
            result = false;
        }

        success = result && success;
    }

    crdtuxp.popLogLevel();

    return success;
}

module.exports.run = run;
