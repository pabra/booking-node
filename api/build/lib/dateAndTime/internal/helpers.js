'use strict';

const errors = require('../../errors');
const ValueError = errors.ValueError;
const utils = require('../../utils');
const parseStrictIntOrThrow = utils.parseStrictIntOrThrow;


/**
 * ensureValidYear - Validate passed year
 *
 * Valid year is currentYear -1 or currentYear +2
 *
 * @param {(string|number)} testYear
 *
 * @return {number} year as Integer if valid
 */
exports.ensureValidYear = function (testYear) {
    const currentYear = new Date().getUTCFullYear();
    const minYear = currentYear - 1;
    const maxYear = currentYear + 2;
    const yearInt = parseStrictIntOrThrow(testYear);

    if (yearInt < minYear) throw new ValueError(`year ${yearInt} < ${minYear}`);
    if (yearInt > maxYear) throw new ValueError(`year ${yearInt} > ${minYear}`);

    return yearInt;
};


/**
 * ensureValidMonth - Validate passed month
 *
 * Valid month is 1 <= month <= 12
 *
 * @param {(string|number)} testMonth
 *
 * @return {number} month as Integer
 */
exports.ensureValidMonth = function (testMonth) {
    const minMonth = 1;
    const maxMonth = 12;
    const monthInt = parseStrictIntOrThrow(testMonth);

    if (monthInt < minMonth) throw new ValueError(`month ${monthInt} < ${minMonth}`);
    if (monthInt > maxMonth) throw new ValueError(`month ${monthInt} < ${maxMonth}`);

    return monthInt;
};
