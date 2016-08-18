"use strict";

var co = require('co'),
    transactionPromise = require('./_transactionPromise'),
    transactionQueryPromise = require('./_transactionQueryPromise'),
    uidInsertHelper = require('./_uidInsertHelper');


module.exports = function putItemBookingFn (itemUid, fromDate, toDate) {
    var txFn;

    txFn = co.wrap(function * (conn) {
        var q, args, result;

        q = 'SELECT NOW()';
        result = yield transactionQueryPromise(conn, q);

        q = `
            INSERT INTO requests
            SET request_time = NOW(),
                ?
        `;
        args = {uid: null,
                customer: 2,
                date_from: fromDate,
                date_to: toDate};

        result = uidInsertHelper(q, args, conn);

        return result;
    });

    return transactionPromise(txFn);
};
