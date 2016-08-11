"use strict";

var db = require('./db'),
    pool = db.pool,
    co = require('co'),
    errors = require('./errors'),
    ValueError = errors.ValueError,
    dateAndTime = require('./dateAndTime'),
    uidLib = require('./uid'),
    httpErrorHandler;


httpErrorHandler = function (e, res) {
    if (e instanceof ValueError) {
        res.status(400).send(e);
    } else {
        throw e;
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

exports.postItemBooking = function (req, res) {
    var uid, fromDate, toDate;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        fromDate = dateAndTime.ensureValidIsoDate(req.params.from);
        toDate = dateAndTime.ensureValidIsoDate(req.params.to);
        if (toDate < fromDate) {
            throw new ValueError(`${toDate} < ${fromDate}`);
        }

        res.send({uid: uid, from: fromDate, to: toDate});
    } catch(e) {
        httpErrorHandler(e, res);
    }
};

exports.auth = function (req, res) {
    var email = req.params.email;

    uidLib.getStrongUid(128, function (token) {
        res.send({email:email, pass:'xxx', token: token});
    });
};
