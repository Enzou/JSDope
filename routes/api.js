/**
 * Created by Me on 02-Jun-17.
 */
const express = require('express');
const app = require('../app/main');

const router = express.Router();

router.get('/tools', (req, res, next) => {
    res.json(app.tools);
});

router.get('/samples', (req, res, next) => {
    res.json(app.samples);
});

/**
 * Normalize the result of the tool to make sure all required properties are present
 * @param {Object} result - An object with the result from the tool
 * @param {Object} params - An object with the parameters for the processing, like samplecode and options
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

router.post('/process', (req, res, next) => {
    let params = req.body;
    params.code = decodeURIComponent(params.code);

    let fn = params.cmd === 'obfuscate' ? app.obfuscate : app.deobfuscate;

    let startTime = process.hrtime();

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
