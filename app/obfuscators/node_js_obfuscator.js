/**
 * Wrapper for the JavaScript obfuscator for Node.js
 * Github: https://github.com/javascript-obfuscator/javascript-obfuscator
 */

const jsObfuscator = require('javascript-obfuscator');

/**
 * a dictionary of all the possible options. This data structure serves as template for available options on the front-end
 */
let toolOptions = {
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: true,
    mangle: false,
    reservedNames: [],
    rotateStringArray: true,
    seed: 0,
    selfDefending: false,
    sourceMap: false,
    sourceMapBaseUrl: '',
    sourceMapFileName: '',
    sourceMapMode: 'separate',
    stringArray: true,
    stringArrayEncoding: false,
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
};


/**
 * Check types of each option and parse it if necessary.
 * The passed object can be modified in the process.
 * @param {Object} options - The dictionary with all provided options for the obfuscation
 */
function validateOptions(options) {
    const numProps = ['controlFlowFlatteningThreshold', 'deadCodeInjectionThreshold', 'stringArrayThreshold'];

    for (let prop of numProps) {
        if (options.hasOwnProperty(prop) && typeof(options[prop]) === 'string') {
            options[prop] = parseFloat(options[prop]);
        }
    }
}

/**
 * Process the given code with the provided parameters
 * @param {string} code - The samplecode which shall be processed
 * @param {Object} options - The dictionary with all provided options for the obfuscation
 * @returns {Promise.<{code, time}>} a promise of an object with the result of the operation
 */
async function obfuscate(code, options = {}) {
    validateOptions(options);

    let result = "";
    let time = 0;
    try {
        let t = process.hrtime();
        result = jsObfuscator.obfuscate(code, options);
        t = process.hrtime(t);      // time difference in the format [seconds, nanoseconds]
        time = t[0] + t[1] / 1000000000.;

        result = result.getObfuscatedCode();
    } catch (exc) {
        console.warn("[Node Obfuscator] Couldn't obfuscate sample: " + exc);
    }

    return {
        code: result,
        time: time
    }
}


module.exports = {
    name: "JavaScript obfuscator for Node.js",
    options: toolOptions,
    process: obfuscate,
};
