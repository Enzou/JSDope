const express = require('express');
const app = require('../app/main');

const router = express.Router();

/**
 * API getter for the loaded tools. This return a JSON object with the obfuscators and deobfuscators
 */
router.get('/tools', (req, res, next) => {
    res.json(app.tools);
});

/**
 * API getter for an JSON object containing all the loaded samples
 */
router.get('/samples', (req, res, next) => {
    res.json(app.samples);
});

/**
 * Normalize the result of the tool to make sure all required properties are present
 * @param {Object} result - An object with the result from the tool
 * @param {Object} params - An object with the parameters for the processing, like samplecode and options
 * @param {number[]} startTime - the current high-resolution real time in a [seconds, nanoseconds] tuple Array. Used to calculate the processing duration
 */
function normalizeResult(result, params, startTime) {
    const isValid = result.code && result.code !== params.code;

    if (!isValid) {  // in case of invalid result there is no need to calculate proper values
        result['code'] = '';
        result['compressionRate'] = '-';
        result['time'] = '-';
        return;
    }

    // calculate compression rate in case it's not already done
    if (!result.hasOwnProperty('compressionRate') || !result.compressionRate) {
        let orig = params.code.length;
        result['compressionRate'] = orig + "/" + result.code.length + " = " + (orig / result.code.length).toFixed(2);
    }

    // calculate processing duration
    if (!result.hasOwnProperty('time') || !result.time) {
        let t = process.hrtime(startTime);      // time difference in the format [seconds, nanoseconds]
        result['time'] = t[0] + t[1] / 1000000000.;
    }
}

/**
 * API for processing the de-/obfuscation request. Responds with either the the result as JSON object, or the error object
 */
router.post('/process', (req, res, next) => {
    let params = req.body;
    params.code = decodeURIComponent(params.code);

    // use either obfuscation or deobfuscation depending on the given command
    let fn = params.cmd === 'obfuscate' ? app.obfuscate : app.deobfuscate;

    let startTime = process.hrtime(); // log start time in case the processing time has to be calculated manually

    fn(params.id, params.code, params.options || {})
        .then((result) =>  {
            normalizeResult(result, params, startTime);
            res.json(result);
        })
        .catch((err) => {
            console.error("Error during /process: " + err.stack);
            res.send({error: JSON.stringify(err)});
        });

});

module.exports = router;
