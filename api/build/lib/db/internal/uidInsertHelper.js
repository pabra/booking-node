const uid = require('../../uid');
const utils = require('../../utils');
const isObjectOrThrow = utils.isObjectOrThrow;
const dupUidRe = /ER_DUP_ENTRY: Duplicate entry '\w+' for key 'uid'/;
const maxTries = 25;
const UidClass = function () {};
// not use const to be able to mock away for tests
let queryPromise = require('./queryPromise');
let transactionQueryPromise = require('./transactionQueryPromise');

exports.UidClass = UidClass;

/**
 * uidInserter - helper to insert entries containing uid into db
 *
 * @param {String} query the query to execute
 * @param {Object|Arry} args query args
 * @param {mysql.connection} connection optional connection to use - if passed, it's assumed we are within a transaction
 *
 * @return {Object} query result
 */
exports.uidInserter = async (query, args, connection) => {
    let i = 0;
    let result;
    let insErr;
    let uidField = null;

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
        isObjectOrThrow(args);
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

        args[uidField] = await uid.getStrongUid();

        try {
            if (!connection) result = await queryPromise(query, args);
            else result = await transactionQueryPromise(connection, query, args);
        } catch (err) {
            if ('ER_DUP_ENTRY' === err.code && err.message.match(dupUidRe)) insErr = err;
            else throw err;
        }
    }

    return result;
};
