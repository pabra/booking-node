"use strict";

var co = require('co'),
    uid = require('../uid'),
    queryPromise = require('./_queryPromise'),
    transactionQueryPromise = require('./_transactionQueryPromise'),
    maxTries = 25;


module.exports = co.wrap(function * (query, args, connection) {
    var i = 0,
        result, insErr;

    while (i++ === 0 || (insErr && 'ER_DUP_ENTRY' === insErr.code)) {
        if (i >= maxTries) throw new Error(`too many retries (${i}) for inserting uid`);

        args.uid = yield uid.getStrongUid(6);

        try {
            if (!connection) result = yield queryPromise(query, args);
            else result = yield transactionQueryPromise(connection, query, args);
        } catch (err) {
            if ('ER_DUP_ENTRY' === err.code) insErr = err;
            else throw err;
        }
    }

    return result;
});
