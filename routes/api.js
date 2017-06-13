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

router.post('/process', (req, res, next) => {
    let params = req.body;

    let fn = params.cmd === 'obfuscate' ? app.obfuscate : app.deobfuscate;

    fn(params.id, decodeURIComponent(params.code), params.options || {})
        .then((result) =>  {
            res.json(result);
        })
        .catch((err) => {
            console.error("Error during /process: " + err.stack);
            res.send({error: JSON.stringify(err)});
        });

});

module.exports = router;
