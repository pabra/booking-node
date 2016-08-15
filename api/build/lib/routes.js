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
    var uid, fromDate, toDate, data, debug;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        fromDate = dateAndTime.ensureValidIsoDate(req.params.from);
        toDate = dateAndTime.ensureValidIsoDate(req.params.to);
        if (toDate < fromDate) {
            throw new ValueError(`${toDate} < ${fromDate}`);
        }
        debug = {uid: uid, fromDate: fromDate, toDate: toDate};
        data = yield db.putItemBooking(uid, fromDate, toDate);

        res.send({data: data, debug: debug});
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
