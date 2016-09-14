"use strict";

const queryPromise = require('./internal/queryPromise');

module.exports = function (uid) {
    const q = `
        SELECT      c.name          AS company_name,
                    c.uid           AS company_uid,
                    g.uid           AS group_uid,
                    g.name          AS group_name,
                    i.uid           AS item_uid,
                    i.name          AS item_name
        FROM        users u
        LEFT JOIN   user_roles r    ON r.id = u.role
        LEFT JOIN   companies c     ON c.id = u.company
        LEFT JOIN   item_groups g   ON g.company = u.company
        LEFT JOIN   items i         ON i.item_group = g.id
        WHERE       u.uid = ?
                    AND r.name IN ('root', 'owner', 'deputy')
    `;

    return queryPromise(q, [uid]);
};
