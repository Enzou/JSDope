
function decode(str) {
    function Function(a, b) {
        console.log("Function(" + a + ", " + b + ")");

        return function(c) {
            console.log("\tfunction(" + c + ")");
            if (b) {
                return Function(a, b) (c);
            } else {
                console.log(a);
                return a;
            }
            // return b ? Function(a, b) (c) : (console.log(a));
        };
    }
    console.log(" ---- start decoding ---- ");
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
        console.warn("Couldn't decode JavaScript2img string: " + exc);
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
