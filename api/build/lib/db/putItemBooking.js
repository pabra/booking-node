'use strict';

const co = require('co');
const transactionPromise = require('./internal/transactionPromise');
const transactionQueryPromise = require('./internal/transactionQueryPromise');
const uidInsertHelper = require('./internal/uidInsertHelper');
const errors = require('../errors');
const uidInserter = uidInsertHelper.uidInserter;
const UidClass = uidInsertHelper.UidClass;


module.exports = function putItemBookingFn (obj) {
    return transactionPromise(
        co.wrap(function * (conn) {
            let q;
            let args;
            let result;

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
            args = {uid: new UidClass(),
                    name: obj.customerName};

            result = yield uidInserter(q, args, conn);

            q = `
                INSERT INTO requests
                SET request_time = NOW(),
                    ?
            `;
            args = {uid: new UidClass(),
                    customer: result.insertId,
                    date_from: obj.fromDate,
                    date_to: obj.toDate};

            result = yield uidInserter(q, args, conn);

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
