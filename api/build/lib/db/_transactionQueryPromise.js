"use strict";

var logger = require('../logger');

module.exports = function (conn, query, args) {
    return new Promise(function(resolve, reject) {
        conn.query(query, args, function (err, rows, fields) {
            logger.debug('result of transaction query promise, rows', rows);
            if (err) {
                logger.debug('err in transaction query promise:', err.message);
                reject(err);
            }
            resolve(rows);
        });
    });
};
