'use strict';

const co = require('co');
const transactionPromise = require('./internal/transactionPromise');
const transactionQueryPromise = require('./internal/transactionQueryPromise');
const uidInsertHelper = require('./internal/uidInsertHelper');
const uidInserter = uidInsertHelper.uidInserter;
const UidClass = uidInsertHelper.UidClass;


module.exports = function (obj) {
    return transactionPromise(
        co.wrap(function * (conn) {
            let q;
            let args;
            let result;
            let companyId;
            let roleId;

            q = `
                INSERT INTO companies
                SET ?
            `;
            args = {uid: new UidClass(),
                    name: obj.companyName};

            result = yield uidInserter(q, args, conn);
            companyId = result.insertId;

            q = `
                SELECT  id
                FROM    user_roles
                WHERE   name = 'owner'
            `;
            result = yield transactionQueryPromise(conn, q);
            roleId = result[0].id;

            q = `
                INSERT INTO users
                SET ?
            `;
            args = {uid: new UidClass(),
                    name: obj.userName,
                    email: obj.userEmail,
                    pass: obj.userPass,
                    company: companyId,
                    role: roleId};

            result = yield uidInserter(q, args, conn);

            return result;
        })
    );
};
