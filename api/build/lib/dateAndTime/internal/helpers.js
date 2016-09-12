"use strict";

const   errors = require('../../errors'),
        ValueError = errors.ValueError,
        utils = require('../../utils');


/**
 * Validate passed year
 *
 * Valid year is currentYear -1 or currentYear +2
 */
exports.ensureValidYear = function (testYear) {
    const currentYear = new Date().getFullYear(),
          minYear = currentYear - 1,
          maxYear = currentYear + 2,
          yearInt = utils.ensureInt(testYear);

    if (yearInt < minYear) throw new ValueError(`year ${yearInt} < ${minYear}`);
    if (yearInt > maxYear) throw new ValueError(`year ${yearInt} > ${minYear}`);

    return yearInt;
};

/**
 * Validate passed month
 *
 * Valid month is 1 <= month <= 12
 */
exports.ensureValidMonth = function (testMonth) {
    const minMonth = 1,
          maxMonth = 12,
          monthInt = utils.ensureInt(testMonth);

    if (monthInt < minMonth) throw new ValueError(`month ${monthInt} < ${minMonth}`);
    if (monthInt > maxMonth) throw new ValueError(`month ${monthInt} < ${maxMonth}`);

    return monthInt;
};
