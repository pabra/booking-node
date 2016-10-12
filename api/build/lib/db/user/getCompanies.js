'use strict';

const co = require('co');
// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = co.wrap(function * (userUid) {
    const q = `
        SELECT      c.uid           AS company_uid,
                    c.name          AS company_name
        FROM        users u
        LEFT JOIN   user_roles r    ON r.id = u.role
        LEFT JOIN   companies c     ON c.id = u.company OR r.name = 'root'
        WHERE       u.uid = ?
    `;

    return yield queryPromise(q, [userUid]);
});
