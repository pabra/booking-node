const db = require('./db');
const authBasic = require('basic-auth');
const logger = require('./logger');
const errors = require('./errors');
const ValueError = errors.ValueError;
const dateAndTime = require('./dateAndTime');
const uidLib = require('./uid');
const permissions = require('./permissions');
const httpErrorHandler = (ctx, err) => {
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

exports.getIndex = getIndex;
exports.reloadDb = reloadDb;
exports.getUnavailItemPeriod = getUnavailItemPeriod;
exports.getUnavailGroupPeriod = getUnavailGroupPeriod;
exports.postItemBooking = postItemBooking;
exports.newAccount = newAccount;
exports.auth = auth;
exports.putGroup = putGroup;
exports.getCompanies = getCompanies;
exports.getUsers = getUsers;
exports.getGroups = getGroups;
exports.getItems = getItems;
exports.updateCompany = updateCompany;
exports.updateItemGroup = updateItemGroup;
exports.updateItem = updateItem;

async function getIndex (ctx) {
    const queryPromise = require('./db/internal/queryPromise');
    const dbDate = await queryPromise('SELECT NOW() AS now');
    ctx.body = `mysql says now is: ${dbDate[0].now}`;
}

function reloadDb (ctx) { // TODO: remove
    try {
        db.loadSchema(true);
        ctx.body = {ok: true};
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function getUnavailItemPeriod (ctx) {
    let uid;
    let yearMonth;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(ctx.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(ctx.params.yearMonth);
        debug = {item_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = await db.getUnavailItemPeriod(uid, yearMonth.year, yearMonth.month);

        ctx.body = {data, debug};
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function getUnavailGroupPeriod (ctx) {
    let uid;
    let yearMonth;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(ctx.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(ctx.params.yearMonth);
        debug = {group_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = await db.getUnavailGroupPeriod(uid, yearMonth.year, yearMonth.month);

        ctx.body = {data, debug};
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function postItemBooking (ctx) {
    let uid;
    let fromDate;
    let toDate;
    let customerName;
    let passObject;
    let data;
    let debug;

    try {
        uid = uidLib.ensureValidUid(ctx.params.uid);
        fromDate = dateAndTime.ensureValidIsoDate(ctx.params.from);
        toDate = dateAndTime.ensureValidIsoDate(ctx.params.to);
        logger.debug('uid', uid);
        logger.debug('ctx.request.body', ctx.request.body);
        customerName = ctx.request.body.name;
        passObject = {item: uid, fromDate, toDate, customerName};

        if (toDate < fromDate) {
            throw new ValueError(`${toDate} < ${fromDate}`);
        }
        if (!customerName) {
            throw new ValueError('missing name');
        }
        debug = {uid, fromDate, toDate, customerName};
        data = await db.putItemBooking(passObject);

        ctx.body = {data, debug};
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function newAccount (ctx) {
    let companyName;
    let userName;
    let userEmail;
    let userPass;
    let passObject;
    let data;

    try {
        companyName = ctx.request.body.company_name;
        userName = ctx.request.body.user_name;
        userEmail = ctx.request.body.user_email;
        userPass = ctx.request.body.user_pass;
        passObject = {companyName, userName, userEmail, userPass};
        if (!companyName) throw new ValueError('missing company name');
        if (!userName) throw new ValueError('missing user name');
        if (!userEmail) throw new ValueError('missing user email');
        if (!userPass) throw new ValueError('missing user password');
        data = await db.newAccount(passObject);

        ctx.body = {data, debug: passObject};
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function auth (ctx) {
    const credentials = authBasic(ctx) || {};
    const email = credentials.name;
    const pass = credentials.pass;
    const data = {};

    try {
        if (!email) throw new ValueError('missing email');
        if (!pass) throw new ValueError('missing pass');
        const result = await db.userAuth(email, pass);

        if (result.uid) {
            ctx.token.payload.uid = result.uid;
            data.access_token = ctx.token.encode();
            data.access_token_type = 'Bearer';
            data.user_uid = result.uid;
            data.user_name = result.name;
            ctx.body = data;
        } else {
            ctx.response.set('WWW-Authenticate', 'Bearer realm="booking-node"');
            ctx.status = 401;
        }
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function putGroup (ctx) {
    const token = ctx.token.payload;
    const newGroupName = ctx.params.newGroupName;

    try {
        if (!newGroupName) throw new ValueError('missing newGroupName');
        const companyUid = uidLib.ensureValidUid(ctx.params.companyUid);
        const userBelongsToCompany = await db.userBelongsToCompany(token.uid, companyUid);
        if (!userBelongsToCompany) throw new ValueError('user does not belong to company');

        // ctx.body = {test: userBelongsToCompany};
        const newGroupResult = await db.putGroup(companyUid, newGroupName);

        ctx.body = {res:newGroupResult};
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function getCompanies (ctx) {
    const token = ctx.token.payload;

    try {
        const companies = await permissions.getThingsWithPermission('company', {user: token.uid});
        ctx.body = companies;
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function getUsers (ctx) {
    const token = ctx.token.payload;

    try {
        const users = await db.getUsers(token.uid);
        ctx.body = users;
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function getGroups (ctx) {
    const token = ctx.token.payload;

    try {
        const companyUid = uidLib.ensureValidUid(ctx.params.companyUid);
        const params = {user: token.uid, company: companyUid};
        const groups = await permissions.getThingsWithPermission('itemGroup', params);
        ctx.body = groups;
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function getItems (ctx) {
    const token = ctx.token.payload;

    try {
        const groupUid = uidLib.ensureValidUid(ctx.params.groupUid);
        const params = {user: token.uid, itemGroup: groupUid};
        const items = await permissions.getThingsWithPermission('item', params);
        ctx.body = items;
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function updateCompany (ctx) {
    const token = ctx.token.payload;

    try {
        const companyUid = uidLib.ensureValidUid(ctx.params.uid);
        const params = {
            user: token.uid,
            company: companyUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const companyData = await permissions.getThingsWithPermission('company', params, perms);

        if (companyData.length === 0) throw new ValueError(`no company with uid ${companyUid}`);
        ctx.body = await db.updateCompany(companyUid, ctx.request.body);
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function updateItemGroup (ctx) {
    const token = ctx.token.payload;

    try {
        const itemGroupUid = uidLib.ensureValidUid(ctx.params.uid);
        const params = {
            user: token.uid,
            itemGroup: itemGroupUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const itemGroupData = await permissions.getThingsWithPermission('itemGroup', params, perms);

        if (itemGroupData.length === 0) throw new ValueError(`no item group with uid ${itemGroupUid}`);
        ctx.body = await db.updateItemGroup(itemGroupUid, ctx.request.body);
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}

async function updateItem (ctx) {
    const token = ctx.token.payload;

    try {
        const itemUid = uidLib.ensureValidUid(ctx.params.uid);
        const params = {
            user: token.uid,
            item: itemUid,
            throwPermissionErrors: true,
        };
        const perms = ['edit'];
        const itemData = await permissions.getThingsWithPermission('item', params, perms);

        if (itemData.length === 0) throw new ValueError(`no item with uid ${itemUid}`);
        ctx.body = await db.updateItem(itemUid, ctx.request.body);
    } catch (e) {
        httpErrorHandler(ctx, e);
    }
}
