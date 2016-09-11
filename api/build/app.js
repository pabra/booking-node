"use strict";

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    midWare = require('./lib/middlewares'),
    cors = require('cors'),
    logger = require('./lib/logger'),
    routes = require('./lib/routes'),
    corsOptions = {
        // origin: true,
        methods: ['POST'],
        allowedHeaders: ['Content-Type', 'X-Requested-With', 'application/json', 'text/plain']
    };

app.use(bodyParser.json({type: ['json', 'text']}));
app.use(midWare.token);
// app.use(midWare.crossDomain);
app.use(cors(corsOptions));

app.get('/', routes.getIndex);
app.get('/item/:uid/:yearMonth', routes.getUnavailItemPeriod);
app.get('/group/:uid/:yearMonth', routes.getUnavailGroupPeriod);

app.post('/item/:uid/:from..:to', routes.postItemBooking);

app.post('/auth', routes.auth);
app.post('/new_account', routes.newAccount);

app.listen(3000, function () {
    logger.info('Example app listening on port 3000!');
});
