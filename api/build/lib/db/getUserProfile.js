'use strict';

const queryPromise = require('./internal/queryPromise');

module.exports = function (uid) {
    const q = `
        SELECT      uid,
                    name,
                    email,
                    pass
        FROM        users
        WHERE       uid = ?
    `;

    return queryPromise(q, [uid]);
};
