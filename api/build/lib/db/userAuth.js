"use strict";

var co = require('co'),
    queryPromise = require('./_queryPromise');


module.exports = co.wrap(function * (email, pass) {
    var q, args, res;

    q = `
        SELECT  uid
        FROM    users
        WHERE   email = ?
                AND pass = ?
    `;
    args = [email, pass];

    res = yield queryPromise(q, args);
    return res.length === 1 ? res[0].uid : null;
});
