// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');
const errors = require('../../errors');
const ValueError = errors.ValueError;

module.exports = getGrouops;

function getGrouops (params) {
    if (!params.user) throw new ValueError('user required');

    const qArgs = [params.user];
    let qCompanyFilter = '';
    let qItemGroupFilter = '';

    if (params.company) {
        qArgs.push(params.company);
        qCompanyFilter = 'AND c.uid = ?';
    }

    if (params.itemGroup) {
        qArgs.push(params.itemGroup);
        qItemGroupFilter = 'AND g.uid = ?';
    }

    const q = `
        SELECT      g.uid               AS group_uid,
                    g.name              AS group_name,
                    IFNULL(pig.permission, 0)
                        | IFNULL(pc.permission, 0)
                        | IFNULL(pg.permission, 0)
                                        AS permission
        FROM        users u
        LEFT JOIN   perm_global pg      ON pg.user = u.id
        LEFT JOIN   perm_company pc     ON pc.user = u.id
        LEFT JOIN   perm_item_group pig ON pig.user = u.id
        LEFT JOIN   companies c         ON c.id = u.company OR pg.user
        LEFT JOIN   item_groups g       ON g.company = c.id
        WHERE       u.uid = ?
                    ${qCompanyFilter}
                    ${qItemGroupFilter}
                    AND g.uid IS NOT NULL
    `;

    return queryPromise(q, qArgs);
}
