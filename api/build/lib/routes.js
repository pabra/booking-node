'use strict';

const db = require('./db');
const pool = db.pool;
const co = require('co');
const auth = require('basic-auth');
const logger = require('./logger');
const errors = require('./errors');
const ValueError = errors.ValueError;
const dateAndTime = require('./dateAndTime');
const uidLib = require('./uid');
const permissions = require('./permissions');
const httpErrorHandler = function (err, res) {
    if (err instanceof ValueError) {
        res.status(400).send(err);
    } else {
        res.status(400).send({errno: err.errno,
                              code: err.code,
                              message: err.message,
                              name: err.name});
        logger.error(err);
    }
};


exports.getIndex = function (req, res) {
    pool.query('SELECT NOW() AS now', function (err, rows, fields) {
        if (err) throw err;
        res.send('mysql says now is: ' + rows[0].now);
    });
};

exports.reloadDb = function (req, res) { // TODO: remove
    try {
        db.loadSchema(true);
        res.send({ok: true});
    } catch (e) {
        httpErrorHandler(e, res);
    }
};

exports.getUnavailItemPeriod = co.wrap(function * (req, res) {
    let uid;
    let yearMonth;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(req.params.yearMonth);
        debug = {item_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = yield db.getUnavailItemPeriod(uid, yearMonth.year, yearMonth.month);

        res.send({data, debug});
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.getUnavailGroupPeriod = co.wrap(function * (req, res) {
    let uid;
    let yearMonth;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(req.params.yearMonth);
        debug = {group_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = yield db.getUnavailGroupPeriod(uid, yearMonth.year, yearMonth.month);

        res.send({data, debug});
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.postItemBooking = co.wrap(function * (req, res) {
    let uid;
    let fromDate;
    let toDate;
    let customerName;
    let passObject;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        fromDate = dateAndTime.ensureValidIsoDate(req.params.from);
        toDate = dateAndTime.ensureValidIsoDate(req.params.to);
        customerName = req.body.name;
        passObject = {item: uid, fromDate, toDate, customerName};

        if (toDate < fromDate) {
            throw new ValueError(`${toDate} < ${fromDate}`);
        }
        if (!customerName) {
            throw new ValueError('missing name');
        }
        debug = {uid, fromDate, toDate, customerName};
        data = yield db.putItemBooking(passObject);

        res.send({data, debug});
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.newAccount = co.wrap(function * (req, res) {
    let companyName;
    let userName;
    let userEmail;
    let userPass;
    let passObject;
    let data;

    try {
        companyName = req.body.company_name;
        userName = req.body.user_name;
        userEmail = req.body.user_email;
        userPass = req.body.user_pass;
        passObject = {companyName, userName, userEmail, userPass};
        if (!companyName) throw new ValueError('missing company name');
        if (!userName) throw new ValueError('missing user name');
        if (!userEmail) throw new ValueError('missing user email');
        if (!userPass) throw new ValueError('missing user password');
        data = yield db.newAccount(passObject);

        res.send({data, debug: passObject});
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.auth = co.wrap(function * (req, res) {
    const credentials = auth(req) || {};
    const email = credentials.name;
    const pass = credentials.pass;
    const data = {};

    try {
        if (!email) throw new ValueError('missing email');
        if (!pass) throw new ValueError('missing pass');
        const result = yield db.userAuth(email, pass);

        if (result.uid) {
            req.token.payload.uid = result.uid;
            data.access_token = req.token.encode();
            data.access_token_type = 'Bearer';
            data.user_uid = result.uid;
            data.user_name = result.name;
            res.send(data);
        } else {
            res.header('WWW-Authenticate', 'Bearer realm="booking-node"');
            res.status(401);
            res.send({});
        }
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.putGroup = co.wrap(function * (req, res) {
    const token = req.token.payload;
    const newGroupName = req.params.newGroupName;

    try {
        if (!newGroupName) throw new ValueError('missing newGroupName');
        const companyUid = uidLib.ensureValidUid(req.params.companyUid);
        const userBelongsToCompany = yield db.userBelongsToCompany(token.uid, companyUid);
        if (!userBelongsToCompany) throw new ValueError('user does not belong to company');

        // res.send({test: userBelongsToCompany});
        const newGroupResult = yield db.putGroup(companyUid, newGroupName);

        res.send({res:newGroupResult});
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.getCompanies = co.wrap(function * (req, res) {
    const token = req.token.payload;

    try {
        const companies = yield permissions.getThingsWithPermission('company', {user: token.uid});
        res.send(companies);
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.getUsers = co.wrap(function * (req, res) {
    const token = req.token.payload;

    try {
        const users = yield db.getUsers(token.uid);
        res.send(users);
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.getGroups = co.wrap(function * (req, res) {
    const token = req.token.payload;

    try {
        const companyUid = uidLib.ensureValidUid(req.params.companyUid);
        const params = {user: token.uid, company: companyUid};
        const groups = yield permissions.getThingsWithPermission('itemGroup', params);
        res.send(groups);
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.getItems = co.wrap(function * (req, res) {
    const token = req.token.payload;

    try {
        const groupUid = uidLib.ensureValidUid(req.params.groupUid);
        const params = {user: token.uid, itemGroup: groupUid};
        const items = yield permissions.getThingsWithPermission('item', params);
        res.send(items);
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.updateCompany = co.wrap(function * (req, res) {
    const token = req.token.payload;

    try {
        const companyUid = uidLib.ensureValidUid(req.params.uid);
        const params = {
            user: token.uid,
            company: companyUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const companyData = yield permissions.getThingsWithPermission('company', params, perms);

        if (companyData.length === 0) throw new ValueError(`no company with uid ${companyUid}`);
        res.send(yield db.updateCompany(companyUid, req.body));
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.updateItemGroup = co.wrap(function * (req, res) {
    const token = req.token.payload;

    try {
        const itemGroupUid = uidLib.ensureValidUid(req.params.uid);
        const params = {
            user: token.uid,
            itemGroup: itemGroupUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const itemGroupData = yield permissions.getThingsWithPermission('itemGroup', params, perms);

        if (itemGroupData.length === 0) throw new ValueError(`no item group with uid ${itemGroupUid}`);
        res.send(yield db.updateItemGroup(itemGroupUid, req.body));
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.updateItem = co.wrap(function * (req, res) {
    const token = req.token.payload;

    try {
        const itemUid = uidLib.ensureValidUid(req.params.uid);
        const params = {
            user: token.uid,
            item: itemUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const itemData = yield permissions.getThingsWithPermission('item', params, perms);

        if (itemData.length === 0) throw new ValueError(`no item with uid ${itemUid}`);
        res.send(yield db.updateItem(itemUid, req.body));
    } catch (e) {
        httpErrorHandler(e, res);
    }
});
