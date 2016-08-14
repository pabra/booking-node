"use strict";

var co = require('co'),
    logger = require('../logger'),
    transactionPromise = require('./_transactionPromise'),
    transactionQueryPromise = require('./_transactionQueryPromise');


module.exports = function putItemBookingFn (itemUid, fromDate, toDate) {
    var txFn;

    logger.debug('define txFn');
    txFn = co.wrap(function * (conn) {
        var q, result;

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
        result = yield transactionQueryPromise(conn, q, ['requ09', fromDate, toDate]);
        logger.debug('in txFn res2:', result);
        // throw new Error('test');

        return result;
    });

    return transactionPromise(txFn);
};
