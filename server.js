const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');                   // parse http queries
// const sassMiddleware = require('node-sass-middleware');     // parse scss styles before serving them
const expressVue = require('express-vue');      // use vue with server side rendering

// load the allowed routes for the front-end
const index = require('./routes/index');
const api = require('./routes/api');

const app = express();

// view engine setup
app.set('vue', {
    componentsDir: path.join(__dirname, 'views', 'components'),
    defaultLayout: 'layout'
});
app.engine('vue', expressVue);
app.set('view engine', 'vue');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '1mb'}));     // parse the body of requests for easier // processing
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
// app.use(sassMiddleware({
//     src: path.join(__dirname, 'public'),
//     dest: path.join(__dirname, 'public'),
//     indentedSyntax: false, // true = .sass and false = .scss
//     prefix: 'css',
//     sourceMap: true,
//     debug: true
// }));

// declare all files in the public folders as content for the front-end
app.use(express.static(path.join(__dirname, 'public')));

// setup routes to the different pages
app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("'" + req.url + "' not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    console.error(err.stack);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // TODO render error properly
    res.render('error', {
        data: {
            title: 'JavaScript Deobfuscator',
            message: err.message,
            code: err.status,
            error: req.app.get('env') === 'development' ? err : {}
        },
        vue: {
            head: {
                title: 'JavaScript Deobfuscator',
                head: [
                    {property: 'og:title', content: 'Page Title'},
                    {name: 'twitter:title', content: 'Page Title'},
                ]
            }
        }
    });
});

module.exports = app;
