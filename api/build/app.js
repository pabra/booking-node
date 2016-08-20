"use strict";

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('./lib/logger'),
    routes = require('./lib/routes');


app.use(bodyParser.json());

app.get('/', routes.getIndex);
app.get('/item/:uid/:yearMonth', routes.getUnavailItemPeriod);
app.get('/group/:uid/:yearMonth', routes.getUnavailGroupPeriod);

app.post('/item/:uid/:from..:to', routes.postItemBooking);
app.post('/auth/:email', routes.auth);

app.listen(3000, function () {
    logger.info('Example app listening on port 3000!');
});
