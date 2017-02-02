'use strict';

const queryPromise = require('./internal/queryPromise');


module.exports = function *(email, pass) {
    const q = `
        SELECT  uid,
                name
        FROM    users
        WHERE   email = ?
                AND pass = ?
    `;
    const args = [email, pass];

    const result = yield queryPromise(q, args);

    const data = {
        uid: null,
        name: null,
    };

    if (result.length) {
        data.uid = result[0].uid;
        data.name = result[0].name;
    }

    return data;
};
