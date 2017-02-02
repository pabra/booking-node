'use strict';

const db = require('./db');
const auth = require('basic-auth');
const logger = require('./logger');
const errors = require('./errors');
const ValueError = errors.ValueError;
const dateAndTime = require('./dateAndTime');
const uidLib = require('./uid');
const permissions = require('./permissions');
const httpErrorHandler = function (ctx, err) {
    ctx.status = 400;
    if (err instanceof ValueError) {
        ctx.body = err;
    } else {
        ctx.body = {
            errno: err.errno,
            code: err.code,
            message: err.message,
            name: err.name,
        };
        logger.error(err);
    }
};


exports.getIndex = function *() {
    const queryPromise = require('./db/internal/queryPromise');
    const dbDate = yield queryPromise('SELECT NOW() AS now');
    this.body = `mysql says now is: ${dbDate[0].now}`;
};

exports.reloadDb = function *(req, res) { // TODO: remove
    try {
        db.loadSchema(true);
        this.body = {ok: true};
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.getUnavailItemPeriod = function *() {
    let uid;
    let yearMonth;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(this.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(this.params.yearMonth);
        debug = {item_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = yield db.getUnavailItemPeriod(uid, yearMonth.year, yearMonth.month);

        this.body = {data, debug};
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.getUnavailGroupPeriod = function *() {
    let uid;
    let yearMonth;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(this.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(this.params.yearMonth);
        debug = {group_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = yield db.getUnavailGroupPeriod(uid, yearMonth.year, yearMonth.month);

        this.body = {data, debug};
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.postItemBooking = function *() {
    let uid;
    let fromDate;
    let toDate;
    let customerName;
    let passObject;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(this.params.uid);
        fromDate = dateAndTime.ensureValidIsoDate(this.params.from);
        toDate = dateAndTime.ensureValidIsoDate(this.params.to);
        customerName = this.request.body.name;
        passObject = {item: uid, fromDate, toDate, customerName};

        if (toDate < fromDate) {
            throw new ValueError(`${toDate} < ${fromDate}`);
        }
        if (!customerName) {
            throw new ValueError('missing name');
        }
        debug = {uid, fromDate, toDate, customerName};
        data = yield db.putItemBooking(passObject);

        this.body = {data, debug};
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.newAccount = function *() {
    let companyName;
    let userName;
    let userEmail;
    let userPass;
    let passObject;
    let data;

    try {
        companyName = this.request.body.company_name;
        userName = this.request.body.user_name;
        userEmail = this.request.body.user_email;
        userPass = this.request.body.user_pass;
        passObject = {companyName, userName, userEmail, userPass};
        if (!companyName) throw new ValueError('missing company name');
        if (!userName) throw new ValueError('missing user name');
        if (!userEmail) throw new ValueError('missing user email');
        if (!userPass) throw new ValueError('missing user password');
        data = yield db.newAccount(passObject);

        this.body = {data, debug: passObject};
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.auth = function *() {
    const credentials = auth(this) || {};
    const email = credentials.name;
    const pass = credentials.pass;
    const data = {};

    try {
        if (!email) throw new ValueError('missing email');
        if (!pass) throw new ValueError('missing pass');
        const result = yield db.userAuth(email, pass);

        if (result.uid) {
            this.token.payload.uid = result.uid;
            data.access_token = this.token.encode();
            data.access_token_type = 'Bearer';
            data.user_uid = result.uid;
            data.user_name = result.name;
            this.body = data;
        } else {
            this.response.set('WWW-Authenticate', 'Bearer realm="booking-node"');
            this.status = 401;
        }
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.putGroup = function *() {
    const token = this.token.payload;
    const newGroupName = this.params.newGroupName;

    try {
        if (!newGroupName) throw new ValueError('missing newGroupName');
        const companyUid = uidLib.ensureValidUid(this.params.companyUid);
        const userBelongsToCompany = yield db.userBelongsToCompany(token.uid, companyUid);
        if (!userBelongsToCompany) throw new ValueError('user does not belong to company');

        // this.body = {test: userBelongsToCompany};
        const newGroupResult = yield db.putGroup(companyUid, newGroupName);

        this.body = {res:newGroupResult};
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.getCompanies = function *() {
    const token = this.token.payload;

    try {
        const companies = yield permissions.getThingsWithPermission('company', {user: token.uid});
        this.body = companies;
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.getUsers = function *() {
    const token = this.token.payload;

    try {
        const users = yield db.getUsers(token.uid);
        this.body = users;
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.getGroups = function *() {
    const token = this.token.payload;

    try {
        const companyUid = uidLib.ensureValidUid(this.params.companyUid);
        const params = {user: token.uid, company: companyUid};
        const groups = yield permissions.getThingsWithPermission('itemGroup', params);
        this.body = groups;
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.getItems = function *() {
    const token = this.token.payload;

    try {
        const groupUid = uidLib.ensureValidUid(this.params.groupUid);
        const params = {user: token.uid, itemGroup: groupUid};
        const items = yield permissions.getThingsWithPermission('item', params);
        this.body = items;
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.updateCompany = function *() {
    const token = this.token.payload;

    try {
        const companyUid = uidLib.ensureValidUid(this.params.uid);
        const params = {
            user: token.uid,
            company: companyUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const companyData = yield permissions.getThingsWithPermission('company', params, perms);

        if (companyData.length === 0) throw new ValueError(`no company with uid ${companyUid}`);
        this.body = yield db.updateCompany(companyUid, this.request.body);
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.updateItemGroup = function *() {
    const token = this.token.payload;

    try {
        const itemGroupUid = uidLib.ensureValidUid(this.params.uid);
        const params = {
            user: token.uid,
            itemGroup: itemGroupUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const itemGroupData = yield permissions.getThingsWithPermission('itemGroup', params, perms);

        if (itemGroupData.length === 0) throw new ValueError(`no item group with uid ${itemGroupUid}`);
        this.body = yield db.updateItemGroup(itemGroupUid, this.request.body);
    } catch (e) {
        httpErrorHandler(this, e);
    }
};

exports.updateItem = function *() {
    const token = this.token.payload;

    try {
        const itemUid = uidLib.ensureValidUid(this.params.uid);
        const params = {
            user: token.uid,
            item: itemUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const itemData = yield permissions.getThingsWithPermission('item', params, perms);

        if (itemData.length === 0) throw new ValueError(`no item with uid ${itemUid}`);
        this.body = yield db.updateItem(itemUid, this.request.body);
    } catch (e) {
        httpErrorHandler(this, e);
    }
};
