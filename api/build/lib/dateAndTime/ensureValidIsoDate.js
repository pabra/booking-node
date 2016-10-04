'use strict';

const errors = require('../errors');
const ValueError = errors.ValueError;
const helpers = require('./internal/helpers');
const dateUtils = require('./internal/utils');
const mkDate = dateUtils.mkDate;
const utils = require('../utils');
const parseStrictIntOrThrow = utils.parseStrictIntOrThrow;


module.exports = function ensureValidIsoDate (testIsoDate) {
    if ('string' !== typeof testIsoDate) {
        throw new TypeError('expected string type');
    }

    const matchIsoDate = testIsoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!matchIsoDate) {
        throw new ValueError(`string does not look like ISO date: "${testIsoDate}"`);
    }

    const year = helpers.ensureValidYear(matchIsoDate[1]);
    const month = helpers.ensureValidMonth(matchIsoDate[2]);
    const day = parseStrictIntOrThrow(matchIsoDate[3]);
    const newDate = mkDate(year, month, day);

    return newDate;
};
