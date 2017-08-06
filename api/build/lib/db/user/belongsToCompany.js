// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = belingsToCompany;

async function belingsToCompany (userUid, companyUid) {
    const q = `
        SELECT      1 AS isTrue
        FROM        companies c
        LEFT JOIN   users u ON u.company = c.id
        WHERE       u.uid = ?
                    AND c.uid = ?
    `;

    const ret = await queryPromise(q, [userUid, companyUid]);

    return !!(ret[0] || {}).isTrue;
}
