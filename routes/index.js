const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', {
        title: 'JavaScript Deobufscator',
        name: 'SIB',
        obfuscators: ['Dan\'s JS Obfuscator', 'YUI Compressor', 'JavaScript Obfuscator', 'JS Obfuscator for Node.js', 'JavaScript2Image', 'JJEncode'],
        deobfuscators: ['JSBeautifier', 'Kahu Security\s Revelo', 'JavaScript Debofuscator Firefox Add-On', 'Honeybadger', 'JSDetox']
    });
});

module.exports = router;
