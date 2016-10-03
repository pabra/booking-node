'use strict';

const co = require('co');
const uid = require('../../uid');
const queryPromise = require('./queryPromise');
const transactionQueryPromise = require('./transactionQueryPromise');
const dupUidRe = /ER_DUP_ENTRY: Duplicate entry '\w+' for key 'uid'/;
const maxTries = 25;
const UidClass = function () {};

exports.UidClass = UidClass;

exports.uidInserter = co.wrap(function * (query, args, connection) {
    let i = 0;
    let result;
    let insErr;
    let uidField = null;

    if (!args instanceof Object) throw new TypeError('args has to be of Object or Array');
    if (args instanceof Array) {
        let found = false;
        args.forEach((v, k) => {
            if (v instanceof UidClass) {
                if (found) throw new TypeError('there must be only one instance of UidClass in args');
                found = true;
                uidField = k;
            }
        });
    } else {
        let found = false;
        for (let k in args) {
            if (args[k] instanceof UidClass) {
                if (found) throw new TypeError('there must be only one instance of UidClass in args');
                found = true;
                uidField = k;
            }
        }
    }

    if (uidField === null) throw new TypeError('missing one instance of UidClass in args');

    while (i++ === 0 || (insErr && 'ER_DUP_ENTRY' === insErr.code)) {
        if (i >= maxTries) throw new Error(`too many retries (${i}) for inserting uid`);

        args[uidField] = yield uid.getStrongUid();

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
