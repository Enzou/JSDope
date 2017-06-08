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

router.post('/obfuscate', (req, res, next) => {
    let params = req.body;

    app.obfuscate(params.id, decodeURIComponent(params.code), params.options || {})
        .then((result) =>  {
            res.json(result);
        })
        .catch((err) => {
            console.error(err.stack);
            res.send("error "+ err);
        });

    // res.json(app.tools);
});

router.post('/deobfuscate', (req, res, next) => {
    let params = req.body;

    app.deobfuscate(params.id, decodeURIComponent(params.code), params.options || {})
        .then((result) =>  {
            res.json(result);
        })
        .catch((err) => {
            console.error(err.stack);
            res.send("error "+ err);
        });

    // res.json(app.tools);
});


router.post('/process', (req, res, next) => {
    let params = req.body;

    let fn = params.cmd == 'obfuscate' ? app.obfuscate : app.deobfuscate;

    fn(params.id, decodeURIComponent(params.code), params.options || {})
        .then((result) =>  {
            res.json(result);
        })
        .catch((err) => {
            console.error(err.stack);
            res.send("error "+ err);
        });

});

module.exports = router;
