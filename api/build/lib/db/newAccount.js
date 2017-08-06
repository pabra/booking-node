const transactionPromise = require('./internal/transactionPromise');
const transactionQueryPromise = require('./internal/transactionQueryPromise');
const uidInsertHelper = require('./internal/uidInsertHelper');
const uidInserter = uidInsertHelper.uidInserter;
const UidClass = uidInsertHelper.UidClass;
const logger = require('../logger');

module.exports = newAccount;

function newAccount (obj) {
    return transactionPromise(async conn => {
        let q;
        let args;
        let result;
        let companyId;
        let roleId;

        try {
            logger.debug('running newAccount with conn: ', !!conn);
            if (!conn) throw new TypeError('conn is required');
            q = `
                INSERT INTO companies
                SET ?
            `;
            args = {
                uid: new UidClass(),
                name: obj.companyName,
            };

            result = await uidInserter(q, args, conn);
            companyId = result.insertId;

            q = `
                SELECT  id
                FROM    user_roles
                WHERE   name = 'owner'
            `;
            result = await transactionQueryPromise(conn, q);
            roleId = result[0].id;

            q = `
                INSERT INTO users
                SET ?
            `;
            args = {
                uid: new UidClass(),
                name: obj.userName,
                email: obj.userEmail,
                pass: obj.userPass,
                company: companyId,
                role: roleId,
            };

            result = await uidInserter(q, args, conn);
        } catch (e) {
            logger.error('cought error in newAccount', e);
        }

        return result;
    });
}
