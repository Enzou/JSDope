let jsObfuscator = require('javascript-obfuscator');


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


async function process(code, options = {}) {
    // TODO validate options
    let result = jsObfuscator.obfuscate(code, options);

    return {
        code: result.code,
        compressionRate: result.compressionRate,
        time: result.time
    }
}


module.exports = {
    name: "JavaScript obfuscator for Node.js",
    options: toolOptions,
    process: process,
};
