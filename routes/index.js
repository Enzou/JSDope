const express = require('express');
const app = require('../app/main');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home/home', {
        title: 'JavaScript Deobufscator',
        name: 'SIB',
        obfuscators: app.tools.obfuscators,
        deobfuscators: app.tools.deobfuscators,
    });
});


module.exports = router;
