"use strict";

var errors = require('../errors'),
    ValueError = errors.ValueError,
    ensureValidYear, ensureValidMonth;

/**
 * Validate passed year
 *
 * Valid year is currentYear -1 or currentYear +2
 */
ensureValidYear = function (year) {
    var currentYear = new Date().getFullYear(),
        minYear = currentYear - 1,
        maxYear = currentYear + 2;

    if (year < minYear) throw new ValueError(`year ${year} < ${minYear}`);
    if (year > maxYear) throw new ValueError(`year ${year} > ${minYear}`);

    return year;
};

/**
 * Validate passed month
 *
 * Valid month is 1 <= month <= 12
 */
ensureValidMonth = function (month) {
    var minMonth = 1,
        maxMonth = 12;

    if (month < minMonth) throw new ValueError(`month ${month} < ${minMonth}`);
    if (month > maxMonth) throw new ValueError(`month ${month} < ${maxMonth}`);

    return month;
};

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
        year = parseInt(matchYearMonth[1], 10);
        year = ensureValidYear(year);
        month = parseInt(matchYearMonth[2], 10);
        month = ensureValidMonth(month);
    } else if (matchYear) {
        year = parseInt(matchYear[0], 10);
        year = ensureValidYear(year);
        month = null;
    }

    return {year: year, month: month};
};
