"use strict";

var co = require('co'),
    uid = require('../uid'),
    logger = require('../logger'),
    transactionPromise = require('./_transactionPromise'),
    transactionQueryPromise = require('./_transactionQueryPromise'),
    maxTries = 25;


module.exports = function putItemBookingFn (itemUid, fromDate, toDate) {
    var txFn;

    logger.debug('define txFn');
    txFn = co.wrap(function * (conn) {
        var q, result, newReqUid, insErr, i;

        q = 'SELECT NOW()';
        logger.debug('in txFn q1:', q);
        result = yield transactionQueryPromise(conn, q);
        logger.debug('in txFn res1:', result);

        q = `
            INSERT INTO requests
            (uid, customer, date_from, date_to, request_time)
            VALUES
            (?, 2, ?, ?, NOW())
        `;
        logger.debug('in txFn q2:', q);
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
        logger.debug('in txFn res2:', result);
        // throw new Error('test');

        return result;
    });

    return transactionPromise(txFn);
};
