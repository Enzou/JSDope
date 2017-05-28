const express = require('express');
const app = require('../app/main');

const router = express.Router();

router.post('/', function(req, res, next) {
    console.log("Received post request");
    app.process();

    res.send('success');
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
