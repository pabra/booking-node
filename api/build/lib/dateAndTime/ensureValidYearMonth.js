"use strict";

var errors = require('../errors'),
    ValueError = errors.ValueError,
    helpers = require('./_helpers.js');


/**
 * Parse and return year and month
 *
 * testYearMonth is expected to be 4 digit year (eg '2016') or
 * year-month (eg '2016-06')
 */
module.exports = function ensureValidYearMonthFn (testYearMonth) {
    var year, month, matchYearMonth, matchYear;

    if ('string' !== typeof testYearMonth) {
        throw new ValueError(`'${testYearMonth}' is not a string`);
    }

    matchYearMonth = testYearMonth.match(/^(\d{4})-(\d{2})$/);
    matchYear = testYearMonth.match(/^\d{4}$/);

    if (!matchYearMonth && !matchYear) {
        throw new ValueError(`'${testYearMonth}' is unknown format`);
    }

    if (matchYearMonth) {
        year = helpers.ensureValidYear(matchYearMonth[1]);
        month = helpers.ensureValidMonth(matchYearMonth[2]);
    } else if (matchYear) {
        year = helpers.ensureValidYear(matchYearMonth[0]);
        month = null;
    }

    return {year: year, month: month};
};
