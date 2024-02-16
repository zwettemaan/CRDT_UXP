const crdtuxp = require("./crdtuxp");
const os = require("os");

const PLATFORM_MAC_OS_X = "darwin";

if (! module.exports) {
    module.exports = {};
}

async function testBase64() {
debugger;
    var retVal = true;

    var s = "Hello World☜✿\x00\x7Féøo";
    var s64 = await crdtuxp.base64encode(s);
    if (s64 != "SGVsbG8gV29ybGTimJzinL8Af8Opw7hv") {
        await crdtuxp.logError(arguments, "failed to crdtuxp.base64encode()");
        retVal = false;
    }

    var sRoundTrip = await crdtuxp.base64decode(s64);
    if (s != sRoundTrip) {
        await crdtuxp.logError(arguments, "failed to crdtuxp.base64decode()");
        retVal = false;
    }

    return retVal;
}

async function testEncrypt() {

    var retVal = true;

    var key = "my secret key";

    var s = "Hello World☜✿\x00\x7Féøo";
    var s1 = await crdtuxp.encrypt(s, key);
    var s2 = await crdtuxp.encrypt(s, key);
    if (s1 == s2) {
        await crdtuxp.logError(arguments, "Encrypting the same string twice should give a different result");
        retVal = false;
    }

    var sRoundTrip1 = await crdtuxp.decrypt(s1, key);
    if (sRoundTrip1 != s) {
        await crdtuxp.logError(arguments, "failed to decrypt s1");
        retVal = false;
    }

    var sRoundTrip2 = await crdtuxp.decrypt(s2, key);
    if (sRoundTrip2 != s) {
        await crdtuxp.logError(arguments, "failed to decrypt s2");
        retVal = false;
    }

    return retVal;
}

async function testDirs() {

    var retVal = true;

    var desktopDir = await crdtuxp.getDir(crdtuxp.DESKTOP_DIR);
    var desktopDirExists = await crdtuxp.dirExists(desktopDir);
    if (! desktopDirExists) {
        await crdtuxp.logError(arguments, "failed to verify existence of desktop dir");
        retVal = false;
    }

    var testDirName = "crdtuxp_test_thisIsATestDir_feelFreeToDelete";
    var testDirPath = desktopDir + testDirName + "/";
    var testDirExists = await crdtuxp.dirExists(testDirPath);
    if (testDirExists) {
        await crdtuxp.logError(arguments, "testDir unexpectedly exists");
        retVal = false;
    }
    else {
        await crdtuxp.dirCreate(testDirPath);
        testDirExists = await crdtuxp.dirExists(testDirPath);
    }
    if (! testDirExists) {
        await crdtuxp.logError(arguments, "testDir unexpectedly does not exists");
        retVal = false;
    }

    var testFileName = "testFile1.txt";
    var testFilePath = testDirPath + testFileName;
    
    var testFileName2 = "testFile2.txt";
    var testFilePath2 = testDirPath + testFileName2;

    var fileContentAsString = "Hello World☜✿\x00\x7Féøo";
    var fileContentAsUTF8 = await crdtuxp.strToUTF8(fileContentAsString);

    var writeFileHandle = await crdtuxp.fileOpen(testFilePath, "w");
    await fileWrite(writeFileHandle, fileContentAsString);
    await fileClose(writeFileHandle);

    var writeFileHandle = await crdtuxp.fileOpen(testFilePath2, "w");
    await fileWrite(writeFileHandle, fileContentAsString);
    await fileClose(writeFileHandle);

    var readFileHandle = await crdtuxp.fileOpen(testFilePath, "r");
    var binaryReadContent = await crdtuxp.fileRead(readFileHandle, true);
    await fileClose(readFileHandle);

    readFileHandle = await crdtuxp.fileOpen(testFilePath, "r");
    var stringReadContent = await crdtuxp.fileRead(readFileHandle, false);
    await fileClose(readFileHandle);

    if (fileContentAsString != stringReadContent) {
        await crdtuxp.logError(arguments, "failed to read file as string");
        retVal = false;
    }

    var alternateStringReadContent = await crdtuxp.binaryUTF8ToStr(binaryReadContent);
    if (fileContentAsString != alternateStringReadContent) {
        await crdtuxp.logError(arguments, "failed to read file as binary then string");
        retVal = false;
    }

    var desktopFiles = await crdtuxp.dirScan(desktopDir);
    var foundTestFile = false;
    for (var idx = 0; ! foundTestFile && idx < desktopFiles.length; idx++) {
        var fileName = desktopFiles[idx];
        foundTestFile = testFileName == fileName;
    }

    if (! foundTestFile) {
        await crdtuxp.logError(arguments, "failed to find test file on Desktop");
        retVal = false;
    }

    var fileExists = await crdtuxp.fileExists(testFilePath);
    if (! fileExists) {
        await crdtuxp.logError(arguments, "fileExists failed");
        retVal = false;
    }

    var fileAsDirExists = await crdtuxp.dirExists(testFilePath);
    if (fileAsDirExists) {
        await crdtuxp.logError(arguments, "dirExists should not return 'true' on a file (instead of a dir)");
        retVal = false;
    }

    var success = await crdtuxp.fileDelete(testFilePath);
    if (! success) {
        await crdtuxp.logError(arguments, "fileDelete should return true");
        retVal = false;
    }

    var tryAgainSuccess = await crdtuxp.fileDelete(testFilePath);
    if (tryAgainSuccess) {
        await crdtuxp.logError(arguments, "second fileDelete on same file should return false");
        retVal = false;
    }

    var deletedFileExists = await crdtuxp.fileExists(testFilePath);
    if (deletedFileExists) {
        await crdtuxp.logError(arguments, "file should not exist any more");
        retVal = false;
    }

    // Should fail because second file is still in there
    await crdtuxp.dirDelete(testDirPath);

    testDirExists = await crdtuxp.fileExists(testFilePath);
    if (! testDirExists) {
        await crdtuxp.logError(arguments, "testDir should not disappear as it is not empty");
        retVal = false;
    }

    // Recursive should succeed
    await crdtuxp.dirDelete(testDirPath, true);

    testDirExists = await crdtuxp.fileExists(testFilePath);
    if (testDirExists) {
        await crdtuxp.logError(arguments, "testDir should disappear with recursive delete");
        retVal = false;
    }
    
    return retVal;
}

async function testIntPow() {

    var retVal = true;

    var x = intPow(2, 10);
    if (x != 1024) {
        await crdtuxp.logError(arguments, "2^10 intPow failed");
        retVal = false;
    }

    x = intPow(-2, 11);
    if (x != -2048) {
        await crdtuxp.logError(arguments, "(-2)^11 intPow failed");
        retVal = false;
    }

    x = intPow(0,0);
    if (! isNaN(x)) {
        await crdtuxp.logError(arguments, "0^0 intPow failed");
        retVal = false;
    }

    return retVal;

}

async function testToHex() {

    var retVal = true;

    if (crdtuxp.toHex(10, 2) != "0a") {
        await crdtuxp.logError(arguments, "toHex(10,2) failed");
        retVal = false;
    }

    // 2-s complement
    if (crdtuxp.toHex(-10, 2) != "f6") {
        await crdtuxp.logError(arguments, "toHex(-10,2) failed");
        retVal = false;
    }

    if (crdtuxp.toHex(65535, 2) != "ff") {
        await crdtuxp.logError(arguments, "toHex(65535,2) failed");
        retVal = false;
    }

    if (crdtuxp.toHex(-65535, 2) != "01") {
        await crdtuxp.logError(arguments, "toHex(-65535,2) failed");
        retVal = false;
    }

    return retVal;
}

async function testLeftRightPad() {

    var retVal = true;

    var s = "1234567890";
    if (crdtuxp.rightPad(s, "x", 12) != s + "xx") {
        await crdtuxp.logError(arguments, "rightPad extension fails");
        retVal = false;
    }

    if (crdtuxp.rightPad(s, "x", 10) != s) {
        await crdtuxp.logError(arguments, "rightPad non-extension fails");
        retVal = false;
    }

    if (crdtuxp.rightPad(s, "x", 8) != s.substring(0, 8)) {
        await crdtuxp.logError(arguments, "rightPad reduction fails");
        retVal = false;
    }

    if (crdtuxp.rightPad("", "x", 8) != "xxxxxxxx") {
        await crdtuxp.logError(arguments, "rightPad empty fails");
        retVal = false;
    }

    if (crdtuxp.leftPad(s, "x", 12) != "xx" + s) {
        await crdtuxp.logError(arguments, "leftPad extension fails");
        retVal = false;
    }

    if (crdtuxp.leftPad(s, "x", 10) != s) {
        await crdtuxp.logError(arguments, "leftPad non-extension fails");
        retVal = false;
    }

    if (crdtuxp.leftPad(s, "x", 8) != s.substring(2)) {
        await crdtuxp.logError(arguments, "leftPad reduction fails");
        retVal = false;
    }

    if (crdtuxp.leftPad("", "x", 8) != "xxxxxxxx") {
        await crdtuxp.logError(arguments, "leftPad empty fails");
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

async function testUTFRoundTrip() {

    var retVal = true;

    var s = "Hello World☜✿\x00\x7Féøo";
    var bytes = crdtuxp.strToUTF8(s);
    var sRoundTrip = crdtuxp.binaryUTF8ToStr(bytes);
    if (s != sRoundTrip) {
        await crdtuxp.logError(arguments, "failed to round trip a string to UTF8 and back");
        retVal = false;
    }

    return retVal;
}

var tests = [
    testBase64,
    testDirs,
    testEncrypt,
    testIntPow,
    testLeftRightPad,
    testQuoteDequote,
    testToHex,
    testUTFRoundTrip
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
