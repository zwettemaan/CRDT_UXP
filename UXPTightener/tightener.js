const localURL = "https://localhost.tgrg.net:18888";
const tqlEngineName = "defaultScope";

var randomValue = Math.random();

// dQ: Wrap a string in double quotes
function dQ(s) {
    return '"' + s.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r") + '"';
}

// sQ: Wrap a string in single quotes
function sQ(s) {
    return "'" + s.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r") + "'";
}

async function evalTQL(tqlScript) {

    var retVal = {
        error: true
    };

    try {
        const init = {
            method: "POST",
            body: tqlScript
        };

        const response = await fetch(localURL + "/" + tqlEngineName + "?" + randomValue, init);
        randomValue = randomValue + 1;
        
        retVal = {
            error: false,
            text: await response.text()
        };

    } catch (e) {
        retVal.exception = e;
    }

    return retVal;
}

async function getCapability(issuer, productCode, password) {

    var retVal;

    var response = await evalTQL("getCapability(" + dQ(issuer) + ", " + dQ(productCode) + ", " + dQ(password) + ")");
    if (! response || response.error) {
        retVal = "Error";
    }
    else {
        retVal = response.text;
    }

    return retVal;
}    

async function machineGUID() {

    var retVal;

    var response = await evalTQL("machineGUID()");
    if (! response || response.error) {
        retVal = "Error";
    }
    else {
        retVal = response.text;
    }

    return retVal;
}    

if (! module.exports) {
    module.exports = {};
}

module.exports.dQ            = dQ;
module.exports.evalTQL       = evalTQL;
module.exports.getCapability = getCapability;
module.exports.machineGUID   = machineGUID;
module.exports.sQ            = sQ;
