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

    // TODO gierlma: parse result information
    let compression = 'n/a';
    let time = 'n/a';
    /*
    if (par.length > 0) {
        let children = par[0].children;
        compression = children[2];
        time = children[4];
    }
    a = 5;*/
    let meta = {
        compressionRate: compression,
        time: time
    };

    return {
        code: $("#packed").val(),
        info: meta
    };
}

async function process(code, options) {
    let params = {
        "ascii_encoding": toolOptions.encodings.Normal,
        // "fast_decode": "on",
        // "special_char": "on",
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
        code: result['code'],
        time: 0,
        compressionRate: 1
    }
}




module.exports = {
    name: "Dan's JavaScript Obfuscator",
    options: toolOptions,
    process: process
};