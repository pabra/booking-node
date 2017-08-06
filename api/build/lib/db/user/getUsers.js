// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = getUsers;

function getUsers (userUid) {
    const q = `
        SELECT  uid     AS user_uid,
                name    AS user_name,
                email   AS user_email,
                pass    AS user_password
        FROM    users
        WHERE   uid = ?
    `;

    return queryPromise(q, [userUid]);
}
