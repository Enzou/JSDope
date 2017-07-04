// let http = require("http");
const request = require('request-promise-native');
const cheerio = require('cheerio');


// a dictionary of all the possible options. This data structure serves as template for available options on the front-end
let toolOptions = {
    encodings: {        // values for the encoding types are read from the website
        'None': "0",
        'Numeric': "10",
        'Normal': "62",
        'High ASCII': "95",
        _selected: 'Normal'
    },
    fastDecode: true,
    specialChars: false
};


/**
 * Send the request with the given parameters to the website of Dans Tools
 * @param {Object} params - dictionary with code and parameters used for the obfuscation
 * @returns {Promise} a promise of the returned result. The data is properly transformed before it is returned.
 */
function send_request(params) {
    let options = {
        url: 'http://www.danstools.com/javascript-obfuscate/index.php',
        method: 'POST',
        transform: parseResult,   // apply parseResult as transformation function before returning the response
        form: params
    };

    return request(options);
        // .then((content) => {      // if extra work needs to be done before the obfuscated code is returned
        // });
}

/**
 * Transform the response from the request to extract all the relevant information
 * @param {string} htmlResponse - the response from the website
 * @returns {Object} object with the resulting code, the processing time and compression rate as returned from the website
 */
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
                    time = el.data.replace("Performed in", "").trim().slice(0, -3); // slice: remove ' s.' from the end
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

/**
 * Process the given code with the provided parameters
 * @param {string} code - The samplecode which shall be processed
 * @param {Object} options - The dictionary with all provided options for the obfuscation
 * @returns {Promise.<{code, compressionRate, time}>} a promise of an object with the result of the operation
 */
async function process(code, options) {
    let params = {
        "ascii_encoding": toolOptions.encodings[options.encodings._selected],
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
    process: process,
};