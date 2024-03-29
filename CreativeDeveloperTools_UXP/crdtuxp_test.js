const crdtuxp = require("./crdtuxp");
const os = require("os");

if (! module.exports) {
    module.exports = {};
}

async function testBase64() {

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

    var writeFileHandle1 = await crdtuxp.fileOpen(testFilePath, "w");
    await crdtuxp.fileWrite(writeFileHandle1, fileContentAsString);
    await crdtuxp.fileClose(writeFileHandle1);

    var writeFileHandle2 = await crdtuxp.fileOpen(testFilePath2, "w");
    await crdtuxp.fileWrite(writeFileHandle2, fileContentAsUTF8);
    await crdtuxp.fileClose(writeFileHandle2);

    var readFileHandle1 = await crdtuxp.fileOpen(testFilePath, "r");
    var binaryReadContent = await crdtuxp.fileRead(readFileHandle1, true);
    await crdtuxp.fileClose(readFileHandle1);

    var readFileHandle2 = await crdtuxp.fileOpen(testFilePath, "r");
    var stringReadContent = await crdtuxp.fileRead(readFileHandle2, false);
    await crdtuxp.fileClose(readFileHandle2);

    var readFileHandle3 = await crdtuxp.fileOpen(testFilePath2, "r");
    var file2ReadContent = await crdtuxp.fileRead(readFileHandle3, false);
    await crdtuxp.fileClose(readFileHandle3);

    if (fileContentAsString != stringReadContent) {
        await crdtuxp.logError(arguments, "failed to read file as string");
        retVal = false;
    }

    if (fileContentAsString != file2ReadContent) {
        await crdtuxp.logError(arguments, "failed to read UTF8 file as string");
        retVal = false;
    }

    var alternateStringReadContent = await crdtuxp.binaryUTF8ToStr(binaryReadContent);
    if (fileContentAsString != alternateStringReadContent) {
        await crdtuxp.logError(arguments, "failed to read file as binary then string");
        retVal = false;
    }

    var desktopFiles = await crdtuxp.dirScan(testDirPath);
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

    testDirExists = await crdtuxp.dirExists(testDirPath);
    if (! testDirExists) {
        await crdtuxp.logError(arguments, "testDir should not disappear as it is not empty");
        retVal = false;
    }

    // Recursive should succeed
    await crdtuxp.dirDelete(testDirPath, true);

    testDirExists = await crdtuxp.dirExists(testDirPath);
    if (testDirExists) {
        await crdtuxp.logError(arguments, "testDir should disappear with recursive delete");
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

async function testEnvironment() {

    var retVal = true;

    var homeDir = await crdtuxp.getDir(crdtuxp.HOME_DIR);
    var homeDirExists = await crdtuxp.dirExists(homeDir);
    if (! homeDirExists) {
        await crdtuxp.logError(arguments, "failed to verify existence of home dir");
        retVal = false;
    }

    var environmentHomeDirVariableName;
    var separator;
    if (crdtuxp.IS_MAC) {
        environmentHomeDirVariableName = "HOME";
        separator = "/";
    }
    else {
        environmentHomeDirVariableName = "USERPROFILE";
        separator = "\\";
    }
    var environmentHomeDir = await crdtuxp.getEnvironment(environmentHomeDirVariableName);

    var homeDirSplit = homeDir.split(separator);
    var homeDirSegmentIdx = homeDirSplit.length;

    var environmentHomeDirSplit = environmentHomeDir.split(separator);
    var environmentDirSegmentIdx = environmentHomeDirSplit.length;

    var matchSucceeded = false;
    var matchFailed = false;

    while  (! matchSucceeded && ! matchFailed) {

        // Skip over empty segments in either path

        do {
            homeDirSegmentIdx--;        
        }
        while (homeDirSegmentIdx >= 0 && homeDirSplit[homeDirSegmentIdx] == "");

        do {
            environmentDirSegmentIdx--;        
        }
        while (environmentDirSegmentIdx >= 0 && environmentHomeDirSplit[environmentDirSegmentIdx] == "");

        if (homeDirSegmentIdx < 0 && environmentDirSegmentIdx < 0) {
            // If we managed to compare all segments and it all matched, we've found a match
            matchSucceeded = true;
        }
        else if (homeDirSegmentIdx < 0 || environmentDirSegmentIdx < 0) {
            // If one has more non-empty segments than the other, it cannot be a match
            matchFailed = true;
        }
        else if (homeDirSplit[homeDirSegmentIdx] != environmentHomeDirSplit[environmentDirSegmentIdx]) {
            // If we find a non-matching segment, it cannot be a match
            matchFailed = true;
        }
        // else, keep going, look at the next segment
    }

    if (! matchSucceeded) {
        await crdtuxp.logError(arguments, "HOME_DIR " + homeDir + " does not match env. var " + environmentHomeDirVariableName + " = " + environmentHomeDir);
        retVal = false;
    }

    return retVal;
}

async function testIntPow() {

    var retVal = true;

    var x = crdtuxp.intPow(2, 10);
    if (x != 1024) {
        await crdtuxp.logError(arguments, "2^10 intPow failed");
        retVal = false;
    }

    x = crdtuxp.intPow(-2, 11);
    if (x != -2048) {
        await crdtuxp.logError(arguments, "(-2)^11 intPow failed");
        retVal = false;
    }

    x = crdtuxp.intPow(0,0);
    if (! isNaN(x)) {
        await crdtuxp.logError(arguments, "0^0 intPow failed");
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
    if (s != "'\\x00\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\x08\\t\\n\\x0b\\x0c\\r\\x0e\\x0f\\x10\\x11\\x12\\x13\\x14\\x15\\x16\\x17\\x18\\x19\\x1a\\x1b\\x1c\\x1d\\x1e\\x1f !\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\\x7f\\x80\\x81\\x82\\x83\\x84\\x85\\x86\\x87\\x88\\x89\\x8a\\x8b\\x8c\\x8d\\x8e\\x8f\\x90\\x91\\x92\\x93\\x94\\x95\\x96\\x97\\x98\\x99\\x9a\\x9b\\x9c\\x9d\\x9e\\x9f\\xa0\\xa1\\xa2\\xa3\\xa4\\xa5\\xa6\\xa7\\xa8\\xa9\\xaa\\xab\\xac\\xad\\xae\\xaf\\xb0\\xb1\\xb2\\xb3\\xb4\\xb5\\xb6\\xb7\\xb8\\xb9\\xba\\xbb\\xbc\\xbd\\xbe\\xbf\\xc0\\xc1\\xc2\\xc3\\xc4\\xc5\\xc6\\xc7\\xc8\\xc9\\xca\\xcb\\xcc\\xcd\\xce\\xcf\\xd0\\xd1\\xd2\\xd3\\xd4\\xd5\\xd6\\xd7\\xd8\\xd9\\xda\\xdb\\xdc\\xdd\\xde\\xdf\\xe0\\xe1\\xe2\\xe3\\xe4\\xe5\\xe6\\xe7\\xe8\\xe9\\xea\\xeb\\xec\\xed\\xee\\xef\\xf0\\xf1\\xf2\\xf3\\xf4\\xf5\\xf6\\xf7\\xf8\\xf9\\xfa\\xfb\\xfc\\xfd\\xfe\\xff'") {
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

async function testPersistData() {

    var retVal = true;

    do {
        var sampleIssuerGUID = "3a0c0e2dfa2a4b24b4e5a6a97c2a4cdd";
        var sampleDataKey = "My Data";
        var key = "My" + "secret";

        var now = new Date();
        var nowTimestamp = now.getTime();

        var persistData = await crdtuxp.getPersistData(sampleIssuerGUID, sampleDataKey, key);
        if (! persistData) {
            persistData = nowTimestamp + "\t" + (nowTimestamp + 1000);
            await crdtuxp.setPersistData(sampleIssuerGUID, sampleDataKey, key, persistData);
        }

        var splitTimestamps = persistData.split("\t");
        if (splitTimestamps.length != 2) {
            await crdtuxp.logError(arguments, "failed to split timestamps");
            retVal = false;
            break;
        }

        var lastSavedTimestamp = parseInt(splitTimestamps[0]);
        var lastSavedTimestampPlus1000 = parseInt(splitTimestamps[1]);
        if (lastSavedTimestamp + 1000 != lastSavedTimestampPlus1000) {
            await crdtuxp.logError(arguments, "failed to match timestamps");
            retVal = false;
            break;
        }

        var secondsSinceLastRun = nowTimestamp - lastSavedTimestamp;
        if (secondsSinceLastRun < 0) {
            await crdtuxp.logError(arguments, "invalid secondsSinceLastRun");
            retVal = false;
            break;
        }

    }
    while (false);

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
    testEnvironment,
    testIntPow,
    testLeftRightPad,
    testQuoteDequote,
    testPersistData,
    testToHex,
    testUTFRoundTrip
];

async function run() {

    crdtuxp.pushLogLevel(crdtuxp.LOG_LEVEL_NOTE);
    
    try {
        await crdtuxp.logNote(arguments, "Starting crdtuxp_test");

        // You need something similar to this to enable CRDT
        // await crdtuxp.setIssuer("1186cb861234567377c49d7eade","my@email.com");

        var success = true;

        for (var idx = 0; idx < tests.length; idx++) {
            try {
                var ftn = tests[idx];
                var result = await ftn();            
                if (! result) {
                    await crdtuxp.logError(arguments, "failed test " + ftn.name);
                }
                else {
                    await crdtuxp.logNote(arguments, "passed test " + ftn.name);
                }
            }
            catch (err) {
                await crdtuxp.logError(arguments, "throws " + err + " for test idx " + idx);
                result = false;
            }

            success = result && success;
        }
    }
    catch (err) {
        await crdtuxp.logError(arguments, "throws " + err);
    }
    
    await crdtuxp.logNote(arguments, "crdtuxp_test complete");

    crdtuxp.popLogLevel();

    return success;
}

module.exports.run = run;
