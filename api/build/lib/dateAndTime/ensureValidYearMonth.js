const errors = require('../errors');
const ValueError = errors.ValueError;
const helpers = require('./internal/helpers.js');

module.exports = ensureValidYearMonth;

/**
 * ensureValidYearMonthFn - Parse and return year and month
 *
 * @param {string} testYearMonth - 4 digit year (eg '2016') or year-month (eg '2016-06')
 * @return {object} Object - object of `year` and `month` as integers (month can be null)
 */
function ensureValidYearMonth (testYearMonth) {
    let year;
    let month;

    if ('string' !== typeof testYearMonth) {
        throw new TypeError('expected string type');
    }

    const matchYearMonth = testYearMonth.match(/^(\d{4})-(\d{2})$/);
    const matchYear = testYearMonth.match(/^\d{4}$/);

    if (!matchYearMonth && !matchYear) {
        throw new ValueError(`unexpected format: "${testYearMonth}"`);
    }

    if (matchYearMonth) {
        year = helpers.ensureValidYear(matchYearMonth[1]);
        month = helpers.ensureValidMonth(matchYearMonth[2]);
    } else {
        year = helpers.ensureValidYear(matchYear[0]);
        month = null;
    }

    return {year, month};
}
