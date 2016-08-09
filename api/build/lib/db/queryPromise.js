"use strict";

var db = require('../db'),
    pool = db.pool;

module.exports = function (query, args) {
    return new Promise(function(resolve, reject) {
        pool.query(query, args, function (err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
        });
    });
};
