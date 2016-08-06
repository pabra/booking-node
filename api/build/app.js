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

// function logModules() {
//     var tracker = {},
//         printModule = function(m, i) {
//         var indent = '',
//             myId = m.id.replace('/home/pepp/Private/git/booking-node/api/build/', ''),
//             x;
//         if (tracker[myId]) {tracker[myId] += 1;} else {tracker[myId] = 1;}
//         if ('undefined' === typeof i) {i = 0;} else {i += 1;}
//         for (x=0; x<=i; x++) indent += '  ';
//         console.log(i + indent, myId);
//         if (m.children.length) {
//             for (x=0; x<m.children.length; x++) {
//                 printModule(m.children[x], i);
//             }
//         }
//     };
//     printModule(require.main);
//     console.log(tracker);
// }
// setTimeout(logModules, 1000);
