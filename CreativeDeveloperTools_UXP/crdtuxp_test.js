const crdtuxp = require("./crdtuxp");

function testQuoteDequote() {

    var retVal = false;

    do {
        
        var s = dQ("");
        if (s != "\"\"") {
            break;
        }

        s = dQ('');
        if (s != "\"\"") {
            break;
        }

        s = sQ("");
        if (s != "''") {
            break;
        }

        s = sQ('');
        if (s != "''") {
            break;
        }

        s = dQ("abc\x00\n\r\t\x0a\x0d\x09\u0061\u007f\u0080\u0123\u07ff\u1000\u7fff");
        if (s != "\"abc\x00\n\r\t\n\r\tA\x7f\x80\u0123\u07ff\u1000\u7fff\"") {
            break;
        }

        s = 
    }
    while (false);

    return retVal;
}
