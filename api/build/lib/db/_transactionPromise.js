"use strict";

var db = require('../db'),
    pool = db.pool,
    co = require('co'),
    transErrFn;


transErrFn = function (conn, err, reject) {
    conn.rollback(function() {
        conn.destroy();
        // conn.release();
        reject({errno: err.errno,
                code: err.code,
                message: err.message,
                name: err.name});
    });
};

module.exports = function (txFn) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, conn) {
            var res;

            if (err) {
                reject(err);
                return;
            }

            conn.beginTransaction(co(function * (err) {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    res = yield txFn(conn);
                } catch (err) {
                    transErrFn(conn, err, reject);
                    return;
                }

                conn.commit(function(err) {
                    if (err) transErrFn(conn, err, reject);
                    else {
                        conn.release();
                        resolve(res);
                    }
                });
            }));
        });
    });
};
