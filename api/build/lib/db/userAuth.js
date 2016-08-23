"use strict";

var co = require('co'),
    queryPromise = require('./_queryPromise');


module.exports = co.wrap(function * (email, pass) {
    var q, args, res;

    q = `
        SELECT  1 AS auth
        FROM    users
        WHERE   email = ?
                AND pass = ?
    `;
    args = [email, pass];

    try {
        res = yield queryPromise(q, args);
        return res.length === 1 && res[0].auth;
    } catch (err) {
        throw err;
    }
});
