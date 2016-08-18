"use strict";

var co = require('co'),
    uid = require('../uid'),
    transactionPromise = require('./_transactionPromise'),
    transactionQueryPromise = require('./_transactionQueryPromise'),
    maxTries = 25;


module.exports = function putItemBookingFn (itemUid, fromDate, toDate) {
    var txFn;

    txFn = co.wrap(function * (conn) {
        var q, result, newReqUid, insErr, i;

        q = 'SELECT NOW()';
        result = yield transactionQueryPromise(conn, q);

        q = `
            INSERT INTO requests
            (uid, customer, date_from, date_to, request_time)
            VALUES
            (?, 2, ?, ?, NOW())
        `;
        i = 0;
        while (i++ === 0 || (insErr && 'ER_DUP_ENTRY' === insErr.code)) {
            if (i >= maxTries) throw new Error(`too many retries (${i}) for inserting new request`);

            newReqUid = yield uid.getStrongUid(6);

            try {
                result = yield transactionQueryPromise(conn, q, [newReqUid, fromDate, toDate]);
            } catch (err) {
                if ('ER_DUP_ENTRY' === err.code) insErr = err;
                else throw err;
            }
        }

        return result;
    });

    return transactionPromise(txFn);
};
