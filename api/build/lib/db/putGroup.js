'use strict';

const uidInsertHelper = require('./internal/uidInsertHelper');
const uidInserter = uidInsertHelper.uidInserter;
const UidClass = uidInsertHelper.UidClass;

module.exports = function (companyUid, newName) {
    const q = `
        INSERT INTO item_groups (uid, name, company)
        VALUES
        (?, ?, (SELECT id FROM companies WHERE uid = ?))
    `;

    const args = [new UidClass(), newName, companyUid];

    return uidInserter(q, args);
};
