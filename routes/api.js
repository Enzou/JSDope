/**
 * Created by Me on 02-Jun-17.
 */
const express = require('express');
const app = require('../app/main');

const router = express.Router();

// router.post('/', function(req, res, next) {
//     let params = req.body;
//     // TODO validate parameters
//     app.process(params.code, params.info || {})
//         .then((result) =>  {
//             res.json(result);
//         })
//         .catch((err) => {
//             console.error(err.stack);
//             res.send("error "+ err);
//         })
// });


router.get('/tools', (req, res, next) => {
    res.json(app.tools);
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
