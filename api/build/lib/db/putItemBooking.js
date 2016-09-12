"use strict";

const   co = require('co'),
        transactionPromise = require('./_transactionPromise'),
        transactionQueryPromise = require('./_transactionQueryPromise'),
        uidInsertHelper = require('./_uidInsertHelper'),
        errors = require('../errors');


module.exports = function putItemBookingFn (obj) {
    return transactionPromise(
        co.wrap(function * (conn) {
            let q, args, result;

            q = `
                SELECT  id
                FROM    items
                WHERE   ?
            `;
            args = {uid: obj.item};
            result = yield transactionQueryPromise(conn, q, args);

            if (result.length === 0) throw new errors.ValueError(`unknown item uid '${obj.item}'`);

            obj.itemId = result[0].id;

            q = `
                INSERT INTO customers
                SET ?
            `;
            args = {uid: null,
                    name: obj.customerName};

            result = yield uidInsertHelper(q, args, conn);

            q = `
                INSERT INTO requests
                SET request_time = NOW(),
                    ?
            `;
            args = {uid: null,
                    customer: result.insertId,
                    date_from: obj.fromDate,
                    date_to: obj.toDate};

            result = yield uidInsertHelper(q, args, conn);

            q = `
                INSERT INTO request_items
                SET         request = ?,
                            item = ?
            `;
            args = {request: result.insertId,
                    item: obj.itemId};
            args = [result.insertId, obj.itemId];
            result = yield transactionQueryPromise(conn, q, args);

            return result;
        })
    );
};
