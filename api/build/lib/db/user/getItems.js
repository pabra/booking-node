'use strict';

const co = require('co');
// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = co.wrap(function * (userUid, groupUid) {
    const q = `
        SELECT      i.uid           AS item_uid,
                    i.name          AS item_name
        FROM        items i
        LEFT JOIN   item_groups g   ON g.id = i.item_group
        LEFT JOIN   companies c     ON c.id = g.company
        LEFT JOIN   users u         ON u.company = c.id
        WHERE       g.uid = ?
                    AND u.uid = ?
    `;

    return yield queryPromise(q, [groupUid, userUid]);
});
