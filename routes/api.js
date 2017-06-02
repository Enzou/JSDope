/**
 * Created by Me on 02-Jun-17.
 */
const express = require('express');
const app = require('../app/main');

const router = express.Router();

router.post('/', function(req, res, next) {
    let params = req.body;
    // TODO validate parameters
    app.process(params.code, params.info || {})
        .then((result) =>  {
            res.json(result);
        })
        .catch((err) => {
            console.error(err.stack);
            res.send("error "+ err);
        })
});


module.exports = router;
