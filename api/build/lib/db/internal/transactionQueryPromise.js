module.exports = function (conn, query, args) {
    return new Promise((resolve, reject) => {
        conn.query(query, args, (err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
