"use strict";

var db = require('../db'),
    pool = db.pool,
    co = require('co');

module.exports = co.wrap(function* (query, args) {
    return yield new Promise(function(resolve, reject) {
        pool.query(query, args, function (err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
        });
    });
});
