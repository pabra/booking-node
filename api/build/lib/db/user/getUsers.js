'use strict';

const co = require('co');
// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = co.wrap(function * (userUid) {
    const q = `
        SELECT  uid     AS user_uid,
                name    AS user_name,
                email   AS user_email,
                pass    AS user_password
        FROM    users
        WHERE   uid = ?
    `;

    return yield queryPromise(q, [userUid]);
});
