const express = require('express');
const app = require('../app/main');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main/main', {
        data: {
            title: 'JSDope',
            obfuscators: app.tools.obfuscators,
            deobfuscators: app.tools.deobfuscators,
            samples: app.samples
        },
        vue: {
            head: {
                title: 'JSDope',
                head: [
                    {property: 'og:title', content: 'Page Title'},
                    {name: 'twitter:title', content: 'Page Title'},
                ]
            },
            components: ['toolSelector', 'sampleSelector', 'resultOverview', 'resultDetail', 'simpleResultList', 'modal']
        }
    });
});


module.exports = router;
