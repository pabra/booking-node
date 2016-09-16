'use strict';

const co = require('co');
const uid = require('../../uid');
const queryPromise = require('./queryPromise');
const transactionQueryPromise = require('./transactionQueryPromise');
const dupUidRe = /ER_DUP_ENTRY: Duplicate entry '\w+' for key 'uid'/;
const maxTries = 25;


module.exports = co.wrap(function * (query, args, connection) {
    let i = 0;
    let result;
    let insErr;

    while (i++ === 0 || (insErr && 'ER_DUP_ENTRY' === insErr.code)) {
        if (i >= maxTries) throw new Error(`too many retries (${i}) for inserting uid`);

        args.uid = yield uid.getStrongUid(6);

        try {
            if (!connection) result = yield queryPromise(query, args);
            else result = yield transactionQueryPromise(connection, query, args);
        } catch (err) {
            if ('ER_DUP_ENTRY' === err.code && err.message.match(dupUidRe)) insErr = err;
            else throw err;
        }
    }

    return result;
});
