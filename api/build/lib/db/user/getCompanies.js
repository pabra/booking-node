'use strict';

const co = require('co');
// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = co.wrap(function * (userUid) {
    const q = `
        SELECT      c.uid           AS company_uid,
                    c.name          AS company_name,
                    IFNULL(pc.permission, 0) | IFNULL(pg.permission, 0)
                                    AS permission
        FROM        users u
        LEFT JOIN   perm_global pg  ON pg.user = u.id
        LEFT JOIN   perm_company pc ON pc.user = u.id
        LEFT JOIN   companies c     ON c.id IN (pc.company, u.company) OR pg.user
        WHERE       u.uid = ?
    `;

    return yield queryPromise(q, [userUid]);
});
