const express = require('express');
const app = require('../app/main');

const router = express.Router();

router.post('/', function(req, res, next) {
    let params = req.body;
    // TODO validate parameters
    app.process(params.code, params.info || {})
        .then((result) =>  {
            // TODO return the results to the website
            res.send('success');
        })
        .catch((err) => {
            console.error(err.stack);
            res.send("error "+ err);
        })

    // res.send('success');
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', {
        title: 'JavaScript Deobufscator',
        name: 'SIB',
        obfuscators: app.data.obfuscators,
        deobfuscators: app.data.deobfuscators,
    });
});


module.exports = router;
