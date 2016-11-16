'use strict';

// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');
const errors = require('../../errors');
const ValueError = errors.ValueError;

module.exports = function (params) {
    if (!params.user) throw new ValueError('user required');

    const qArgs = [params.user];
    let qCompanyFilter = '';

    if (params.company) {
        qArgs.push(params.company);
        qCompanyFilter = 'AND c.uid = ?';
    }

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
                    ${qCompanyFilter}
                    AND c.uid IS NOT NULL
    `;

    return queryPromise(q, qArgs);
};
