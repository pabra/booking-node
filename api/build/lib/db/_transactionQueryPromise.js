"use strict";

var _debug = require('debug'),
    debug = _debug('app:debug');

module.exports = function (conn, query, args) {
    return new Promise(function(resolve, reject) {
        conn.query(query, args, function (err, rows, fields) {
            debug('result of transaction query promise, rows', rows);
            if (err) {
                debug('err in transaction query promise:', err.message);
                reject(err);
            }
            resolve(rows);
        });
    });
};
