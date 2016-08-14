"use strict";

var co = require('co'),
    _debug = require('debug'),
    debug = _debug('app:debug'),
    transactionPromise = require('./_transactionPromise'),
    transactionQueryPromise = require('./_transactionQueryPromise');


module.exports = co.wrap(function * putItemBookingFn(itemUid, fromDate, toDate) {
    var txFn, txRes;

    debug('define txFn');
    txFn = co.wrap(function * (conn) {
        var q, result;

        q = 'SELECT NOW()';
        debug('in txFn q1:', q);
        result = yield transactionQueryPromise(conn, q);
        debug('in txFn res1:', result);

        q = `
            INSERT INTO requests
            (uid, customer, date_from, date_to, request_time)
            VALUES
            (?, 2, ?, ?, NOW())
        `;
        debug('in txFn q2:', q);
        result = yield transactionQueryPromise(conn, q, ['requ09', fromDate, toDate]);
        debug('in txFn res2:', result);
        // throw new Error('test');

        return result;
    });

    // resolve transaction promise before return
    txRes =  yield transactionPromise(txFn);
    return txRes;
});
