'use strict';


module.exports = function (conn, query, args) {
    return new Promise(function (resolve, reject) {
        conn.query(query, args, function (err, rows, fields) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
