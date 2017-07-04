const express = require('express');
const app = require('../app/main');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main/main', {
        data: { // initial data for the front-end
            title: 'JSDope',
            obfuscators: app.tools.obfuscators,
            deobfuscators: app.tools.deobfuscators,
            samples: app.samples
        },
        vue: {
            head: {
                title: 'JSDope',
            },
            // list of all the used components in the front-end. These names are the same es the vue-files in the configured components folders
            components: ['toolSelector', 'sampleSelector', 'resultOverview', 'resultDetail', 'simpleResultList', 'modal']
        }
    });
});


module.exports = router;
