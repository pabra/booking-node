"use strict";

var express = require('express'),
    app = express(),
    _debug = require('debug'),
    error = _debug('app:error'),
    warn = _debug('app:warn'),
    info = _debug('app:info'),
    debug = _debug('app:debug'),
    routes = require('./lib/routes');

app.get('/', routes.getIndex);
app.get('/item/:uid/:yearMonth', routes.getUnavailItemPeriod);
app.get('/group/:uid/:yearMonth', routes.getUnavailGroupPeriod);

app.post('/auth/:email', routes.auth);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
