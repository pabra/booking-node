"use strict";

var co = require('co'),
    transactionPromise = require('./_transactionPromise'),
    transactionQueryPromise = require('./_transactionQueryPromise'),
    uidInsertHelper = require('./_uidInsertHelper'),
    errors = require('../errors');


module.exports = function (obj) {
    var txFn;

    txFn = co.wrap(function * (conn) {
        var q, args, result, companyId, roleId;

        q = `
            INSERT INTO companies
            SET ?
        `;
        args = {uid: null,
                name: obj.companyName};

        result = yield uidInsertHelper(q, args, conn);
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
        args = {uid: null,
                name: obj.userName,
                email: obj.userEmail,
                pass: obj.userPass,
                company: companyId,
                role: roleId};

        result = yield uidInsertHelper(q, args, conn);

        return result;
    });

    return transactionPromise(txFn);
};
