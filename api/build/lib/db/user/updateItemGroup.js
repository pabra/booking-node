const utils = require('../../utils');
const promiseReturner = utils.promiseReturner;
// not use const to be able to mock away for tests
let queryPromise = require('../internal/queryPromise');

module.exports = updateItemGroup;

function updateItemGroup (itemGroupUid, data) {
    const allowedFields = ['name'];
    const qArgs = [];
    const updates = [];

    for (let x in data) {
        if (!data.hasOwnProperty(x)) continue;
        if (allowedFields.indexOf(x) === -1) continue;
        updates.push('?? = ?');
        qArgs.push(x, data[x]);
    }

    if (updates.length === 0) {
        return promiseReturner({});
    }

    const updatesStr = updates.join(', ');
    const q = `
        UPDATE  item_groups
        SET     ${updatesStr}
        WHERE   uid = ?
    `;

    qArgs.push(itemGroupUid);

    return queryPromise(q, qArgs);
}
