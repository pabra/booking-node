const uidInsertHelper = require('./internal/uidInsertHelper');
const uidInserter = uidInsertHelper.uidInserter;
const UidClass = uidInsertHelper.UidClass;

module.exports = putGroup;

function putGroup (companyUid, newName) {
    const q = `
        INSERT INTO item_groups (uid, name, company)
        VALUES
        (?, ?, (SELECT id FROM companies WHERE uid = ?))
    `;

    const args = [new UidClass(), newName, companyUid];

    return uidInserter(q, args);
}
