const transactionPromise = require('./internal/transactionPromise');
const transactionQueryPromise = require('./internal/transactionQueryPromise');
const uidInsertHelper = require('./internal/uidInsertHelper');
const errors = require('../errors');
const uidInserter = uidInsertHelper.uidInserter;
const UidClass = uidInsertHelper.UidClass;
const logger = require('../logger');

module.exports = putItemBooking;

function putItemBooking (obj) {
    return transactionPromise(async conn => {
        let q;
        let args;
        let result;

        try {
            logger.debug('running putItemBooking with conn: ', !!conn);
            if (!conn) throw new TypeError('conn is required');

            q = `
                SELECT  id
                FROM    items
                WHERE   ?
            `;
            args = {uid: obj.item};
            result = await transactionQueryPromise(conn, q, args);

            if (result.length === 0) {
                throw new errors.ValueError(`unknown item uid '${obj.item}'`);
            }

            obj.itemId = result[0].id;

            q = `
                INSERT INTO customers
                SET ?
            `;
            args = {
                uid: new UidClass(),
                name: obj.customerName,
            };

            result = await uidInserter(q, args, conn);

            q = `
                INSERT INTO requests
                SET request_time = NOW(),
                    ?
            `;
            args = {
                uid: new UidClass(),
                customer: result.insertId,
                date_from: obj.fromDate,
                date_to: obj.toDate,
            };

            result = await uidInserter(q, args, conn);

            q = `
                INSERT INTO request_items
                SET ?
            `;
            args = {
                request: result.insertId,
                item: obj.itemId,
            };
            result = await transactionQueryPromise(conn, q, args);
        } catch (e) {
            logger.error('cought error in putItemBooking', e);
        }

        return result;
    });
}
