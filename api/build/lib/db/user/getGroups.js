'use strict';

const co = require('co');
// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = co.wrap(function * (userUid, companyUid) {
    const q = `
        SELECT      g.uid           AS group_uid,
                    g.name          AS group_name
        FROM        item_groups g
        LEFT JOIN   companies c     ON c.id = g.company
        LEFT JOIN   users u         ON u.company = c.id
        WHERE       c.uid = ?
                    AND u.uid = ?
    `;
    console.log(q);
    console.log([companyUid, userUid]);

    return yield queryPromise(q, [companyUid, userUid]);
});
