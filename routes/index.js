const express = require('express');
const app = require('../app/main');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main/main', {
        data: {
            title: 'JavaScript Deobfuscator',
            obfuscators: app.tools.obfuscators,
            deobfuscators: app.tools.deobfuscators,
            samples: app.samples
        },
        vue: {
            head: {
                title: 'JavaScript Deobfuscator',
                head: [
                    {property: 'og:title', content: 'Page Title'},
                    {name: 'twitter:title', content: 'Page Title'},
                ]
            },
            components: ['toolSelector', 'sampleSelector']
        }
    });
});


module.exports = router;
