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

    app.obfuscate(params.id, params.code, params.options || {})
        .then((result) =>  {
            res.json(result);
        })
        .catch((err) => {
            console.error(err.stack);
            res.send("error "+ err);
        });

    // res.json(app.tools);
});


module.exports = router;
