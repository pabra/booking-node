'use strict';

const db = require('../../db');
const pool = db.pool;
const co = require('co');
const logger = require('../../logger');
const transErrFn = function (conn, err, reject) {
    conn.rollback(function () {
        logger.debug('rolled back transaction');
        conn.destroy();
        reject({errno: err.errno,
                code: err.code,
                message: err.message,
                name: err.name});
    });
};

module.exports = function (txFn) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (connectionError, conn) {
            let res;

            if (connectionError) {
                reject(connectionError);
                return;
            }

            conn.beginTransaction(co(function * (beginError) {
                if (beginError) {
                    reject(beginError);
                    return;
                }

                try {
                    res = yield txFn(conn);
                } catch (err) {
                    transErrFn(conn, err, reject);
                    return;
                }

                conn.commit(function (commitError) {
                    if (commitError) transErrFn(conn, commitError, reject);
                    else {
                        conn.release();
                        resolve(res);
                    }
                });
            }));
        });
    });
};
