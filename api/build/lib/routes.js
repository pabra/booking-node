"use strict";

var db = require('./db'),
    pool = db.pool,
    co = require('co'),
    logger = require('./logger'),
    errors = require('./errors'),
    ValueError = errors.ValueError,
    dateAndTime = require('./dateAndTime'),
    uidLib = require('./uid'),
    httpErrorHandler;


httpErrorHandler = function (err, res) {
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

exports.getUnavailItemPeriod = co.wrap(function * (req, res) {
    var uid, yearMonth, data, debug;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(req.params.yearMonth);
        debug = {item_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = yield db.getUnavailItemPeriod(uid, yearMonth.year, yearMonth.month);

        res.send({data: data, debug: debug});
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.getUnavailGroupPeriod = co.wrap(function * (req, res) {
    var uid, yearMonth, data, debug;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(req.params.yearMonth);
        debug = {group_uid: uid, year: yearMonth.year, month: yearMonth.month};
        data = yield db.getUnavailGroupPeriod(uid, yearMonth.year, yearMonth.month);

        res.send({data: data, debug: debug});
    } catch (e) {
        httpErrorHandler(e, res);
    }
});

exports.postItemBooking = co.wrap(function * (req, res) {
    var uid, fromDate, toDate, customerName, passObject, data, debug;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        fromDate = dateAndTime.ensureValidIsoDate(req.params.from);
        toDate = dateAndTime.ensureValidIsoDate(req.params.to);
        customerName = req.body.name;
        passObject = {item: uid,
                      fromDate: fromDate,
                      toDate: toDate,
                      customerName: customerName};

        if (toDate < fromDate) {
            throw new ValueError(`${toDate} < ${fromDate}`);
        }
        if (!customerName) {
            throw new ValueError(`missing name`);
        }
        debug = {uid: uid, fromDate: fromDate, toDate: toDate, customerName: customerName};
        data = yield db.putItemBooking(passObject);

        res.send({data: data, debug: debug});
    } catch(e) {
        httpErrorHandler(e, res);
    }
});

exports.newAccount = co.wrap(function * (req, res) {
    var companyName, userName, userEmail, userPass, passObject, data;

    try {
        companyName = req.body.company_name;
        userName = req.body.user_name;
        userEmail = req.body.user_email;
        userPass = req.body.user_pass;
        passObject = {companyName: companyName,
                      userName: userName,
                      userEmail: userEmail,
                      userPass: userPass};
        if (!companyName) throw new ValueError(`missing company name`);
        if (!userName) throw new ValueError(`missing user name`);
        if (!userEmail) throw new ValueError(`missing user email`);
        if (!userPass) throw new ValueError(`missing user password`);
        data = yield db.newAccount(passObject);

        res.send({data: data, debug: passObject});
    } catch(e) {
        httpErrorHandler(e, res);
    }
});

exports.auth = co.wrap(function * (req, res) {
    var email = req.params.email,
        token;

    try {
        token = yield uidLib.getStrongUid(128);

        res.send({email:email, pass:'xxx', token: token});
    } catch (e){
        httpErrorHandler(e, res);
    }
});
