const express = require('express');
const app = require('../app/main');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', {
        title: 'JavaScript Deobufscator',
        name: 'SIB',
        obfuscators: app.data.obfuscators,
        deobfuscators: app.data.deobfuscators
    });
});

module.exports = router;
