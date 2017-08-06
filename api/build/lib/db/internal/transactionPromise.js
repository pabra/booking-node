const db = require('../../db');
const pool = db.pool;
const logger = require('../../logger');
const transErrFn = (conn, err, reject) => {
    conn.rollback(() => {
        logger.debug('rolled back transaction');
        conn.destroy();
        reject({
            errno: err.errno,
            code: err.code,
            message: err.message,
            name: err.name,
        });
    });
};

module.exports = transactionPromise;

function transactionPromise (txFn) {
    logger.debug('txFn', txFn);
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (connectionError, conn) {
            let res;

            if (connectionError) {
                logger.error('connectionError', connectionError);
                reject(connectionError);
                return;
            }

            conn.beginTransaction(async function (beginError) {
                if (beginError) {
                    reject(beginError);
                    return;
                }

                try {
                    res = await txFn(conn);
                } catch (err) {
                    transErrFn(conn, err, reject);
                    return;
                }

                conn.commit(function (commitError) {
                    if (commitError) {
                        transErrFn(conn, commitError, reject);
                    } else {
                        conn.release();
                        resolve(res);
                    }
                });
            });
        });
    });
}
