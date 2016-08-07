"use strict";

var db = require('../db'),
    co = require('co');

/**
 * getUnavailItemPeriodFn - queries the databse for unavailbility of an item
 *
 * @param  {string} itemUid - description
 * @param  {number} year    - description
 * @param  {number} month   - description
 * @return {type}           - description
 */
module.exports = co.wrap(function * getUnavailItemPeriodFn (itemUid, year, month) {
    var q, monthStart, monthEnd, dayStart, dayEnd, res;

    monthStart = month ? month : 1;
    monthEnd = month ? month : 12;
    dayStart = 1;
    dayEnd = 28; // TODO: fix
    q = [
        'SELECT     r.uid AS request_uid,',
        '           r.date_from, ',
        '           r.date_to ',
        'FROM       requests r ',
        'LEFT JOIN  request_items ri ON ri.request = r.id ',
        'LEFT JOIN  items i ON i.id = ri.item ',
        'WHERE      i.uid = ? ',
        '           AND (date_to >= ? ',
        '                OR date_from <= ?)' // TODO: get rid of the OR?
    ].join('\n');

    // TODO: use date from passed `year` and `month`
    return yield db.queryPromise(q, [itemUid, new Date('2016-01-01'), new Date('2016-12-31')]);
});
