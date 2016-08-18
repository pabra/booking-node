"use strict";

var db = require('../db'),
    pool = db.pool,
    co = require('co'),
    transErrFn;


transErrFn = function (conn, err) {
    conn.rollback(function() {
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
            var res;

            if (err) throw err;

            conn.beginTransaction(co(function * (err) {
                if (err) throw err;

                try {
                    res = yield txFn(conn);
                } catch (err) {
                    transactionFailed = true;
                    resolve(transErrFn(conn, err));
                }

                if (!transactionFailed) {
                    conn.commit(function(err) {
                        if (err) transErrFn(conn, err);
                        else {
                            conn.release();
                            resolve(res);
                        }
                    });
                }
            }));
        });
    });
};
