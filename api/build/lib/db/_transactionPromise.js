"use strict";

var db = require('../db'),
    pool = db.pool,
    co = require('co'),
    logger = require('../logger'),
    transErrFn;


transErrFn = function (conn, err) {
    logger.debug('will rollback transaction');
    conn.rollback(function() {
        logger.debug('transaction rolled back');
        conn.destroy();
        // conn.release();
        // throw err;
    });
    return {errno: err.errno,
            code: err.code,
            message: err.message,
            name: err.name};
};

module.exports = function (txFn) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, conn) {
            var transactionFailed = false,
                res;

            if (err) throw err;

            conn.beginTransaction(co(function * (err) {
                if (err) throw err;
                logger.debug('begin transaction');

                try {
                    logger.debug('call txFn');
                    res = yield txFn(conn);
                    logger.debug('out txFn res:', res);
                } catch (err) {
                    logger.debug('caught error outside txFn');
                    transactionFailed = true;
                    resolve(transErrFn(conn, err));
                }

                if (!transactionFailed) {
                    logger.debug('before commit, res:', res);
                    conn.commit(function(err) {
                        if (err) transErrFn(conn, err);
                        else {
                            logger.debug('transaction committed, res:', res);
                            conn.release();
                            resolve(res);
                        }
                    });
                }
            }));
        });
    });
};
