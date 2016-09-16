'use strict';

const errors = require('../../errors');
const ValueError = errors.ValueError;
const utils = require('../../utils');

let mkDate;
let setFirstDayOfMonth;
let setLastDayOfMonth;


/**
 * mkDateFn - get new Date object
 *
 * @param  {number} year    - year as int
 * @param  {number} month   - month as int
 * @param  {number} day     - day as int
 * @return {object}         - new Date() object
 */
mkDate = function mkDateFn (year, month, day) {
    let newDate;

    if (!utils.isInt(year) || !utils.isInt(month) || !utils.isInt(day)) {
        throw new ValueError(`year, month, day must be integer: ${year}, ${month}, ${day}`);
    }

    newDate = new Date(0);
    newDate.setUTCFullYear(year);
    newDate.setUTCMonth(month - 1);
    newDate.setUTCDate(day);

    if (newDate.getUTCFullYear() !== year
            || newDate.getUTCMonth() !== month - 1
            || newDate.getUTCDate() !== day) {

        throw new ValueError(`date "${newDate}" does not match passed year, month, day; ${year}, ${month}, ${day}`);
    }

    return newDate;
};

setFirstDayOfMonth = function setFirstDayOfMonthFn (dObj) {
    if (!dObj instanceof Date) {
        throw new ValueError(`not an instance of Date: ${dObj}`);
    }

    dObj.setUTCDate(1);
    dObj.setUTCHours(0);
    dObj.setUTCMinutes(0);
    dObj.setUTCSeconds(0);
    dObj.setUTCMilliseconds(0);

    return dObj;
};

setLastDayOfMonth = function setLastDayOfMonthFn (dObj) {
    const fullDay = 24 * 60 * 60 * 1000;

    if (!dObj instanceof Date) {
        throw new ValueError(`not an instance of Date: ${dObj}`);
    }

    dObj = setFirstDayOfMonth(dObj);
    // add 32 days
    dObj = setFirstDayOfMonth(new Date(dObj.getTime() + 32 * fullDay));
    // substract one day
    dObj = new Date(dObj.getTime() - fullDay);

    return dObj;
};

exports.mkDate = mkDate;
exports.setFirstDayOfMonth = setFirstDayOfMonth;
exports.setLastDayOfMonth = setLastDayOfMonth;
