// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');
const errors = require('../../errors');
const ValueError = errors.ValueError;

module.exports = getItems;

function getItems (params) {
    if (!params.user) throw new ValueError('user required');

    const qArgs = [params.user];
    let qItemGroupFilter = '';
    let qItemFilter = '';

    if (params.itemGroup) {
        qArgs.push(params.itemGroup);
        qItemGroupFilter = 'AND g.uid = ?';
    }

    if (params.item) {
        qArgs.push(params.item);
        qItemFilter = 'AND i.uid = ?';
    }

    const q = `
        SELECT      i.uid               AS item_uid,
                    i.name              AS item_name,
                    IFNULL(pi.permission, 0)
                        | IFNULL(pig.permission, 0)
                        | IFNULL(pc.permission, 0)
                        | IFNULL(pg.permission, 0)
                                        AS permission
        FROM        users u
        LEFT JOIN   perm_global pg      ON pg.user = u.id
        LEFT JOIN   perm_company pc     ON pc.user = u.id
        LEFT JOIN   perm_item_group pig ON pig.user = u.id
        LEFT JOIN   perm_item pi        ON pi.user = u.id
        LEFT JOIN   companies c         ON c.id = u.company OR pg.user
        LEFT JOIN   item_groups g       ON g.company = c.id
        LEFT JOIN   items i             ON i.item_group = g.id
        WHERE       u.uid = ?
                    ${qItemGroupFilter}
                    ${qItemFilter}
                    AND i.uid IS NOT NULL
    `;

    return queryPromise(q, qArgs);
}
