"use strict";

var db = require('../db'),
    pool = db.pool,
    co = require('co'),
    _debug = require('debug'),
    debug = _debug('app:debug'),
    transErrFn;


transErrFn = function (conn, err) {
    debug('will rollback transaction');
    conn.rollback(function() {
        debug('transaction rolled back');
        conn.destroy();
        // throw err;
    });
    debugger;
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
                debug('begin transaction');

                try {
                    debug('call txFn');
                    res = yield txFn(conn);
                    debug('out txFn res:', res);
                } catch (err) {
                    debug('caught error outside txFn');
                    transactionFailed = true;
                    resolve(transErrFn(conn, err));
                }

                if (!transactionFailed) {
                    debug('before commit, res:', res);
                    conn.commit(function(err) {
                        if (err) transErrFn(conn, err);
                        else {
                            debug('transaction committed, res:', res);
                            conn.release();
                            resolve(res);
                        }
                    });
                }
            }));
        });
    });
};
