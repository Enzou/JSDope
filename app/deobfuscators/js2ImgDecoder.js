
function decode(str) {
    function Function(a, b) {
        return function(c){
            return b ? Function(a, b) (c) : (console.log(a));
        };
    }
    eval(str);
}

async function process(str) {
    let code = "";
    let compressionRate = "-";
    let time = "-";

    try {

        code = decode(str);
        compressionRate =  str.length + "/" + code.length + " = " + (str.length / code.length).toFixed(2);


    } catch (exc) {
        console.warn("Couldn't decode JJEncoded string: " + exc);
    }

    return {
        code: code,
        time: time,
        compressionRate: compressionRate
    };
}

module.exports = {
    name: 'JS2Image Decoder',
    process: process
};
