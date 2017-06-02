// let http = require("http");
const request = require('request-promise-native');
const cheerio = require('cheerio');


let toolOptions = {
    encodings: {        // values for the encoding types are read from the website
        'None': "0",
        'Numeric': "10",
        'Normal': "62",
        'High ASCII': "95"
    },
    fastDecode: true,
    specialChars: false
};



function send_request(params) {
    let options = {
        url: 'http://www.danstools.com/javascript-obfuscate/index.php',
        method: 'POST',
        transform: parseResult,
        form: params
    };

    return request(options);
        // .then((content) => {      // if extra work needs to be done before the obfuscated code is returned
        // });
}

function parseResult(htmlResponse) {
    const $ = cheerio.load(htmlResponse);

    // parse information about the processing
    let par = $('p.success');
    let compression = 'n/a';
    let time = 'n/a';

    // extract content about compression and duration from the paragraph
    if (par.length > 0) {
        par[0].children.forEach((el) => {
            if (el.type === "text") {
                if (el.data.includes("Compression")) {      // compression information
                    let idx = el.data.indexOf(":");
                    compression = el.data.substr(idx + 1).trim();
                } else if(el.data.includes("Performed")) {  // time information
                    time = el.data.replace("Performed in", "").trim();
                }
            }
        });
    }

    return {
        code: $("#packed").val(),
        compressionRate: compression,
        time: time
    };
}

async function process(code, options) {
    let params = {
        "ascii_encoding": toolOptions.encodings.Normal,
        "src": code
    };

    if (options['fastDecode']) {
        params['fast_decode'] = "on"
    }
    if (options['specialChar']) {
        params['special_char'] = "on"
    }

    let result = await send_request(params);

    return {
        code: result.code,
        compressionRate: result.compressionRate,
        time: result.time
    }
}


module.exports = {
    name: "Dan's JavaScript Obfuscator",
    options: toolOptions,
    process: process
};