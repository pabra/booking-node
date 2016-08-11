"use strict";

var db = require('../db'),
    dat = require('../dateAndTime');

/**
 * getUnavailItemPeriodFn - queries the databse for unavailbility of an item
 *
 * @param  {string} groupUid - description
 * @param  {number} year    - description
 * @param  {number} month   - description
 * @return {type}           - description
 */
module.exports = function getUnavailItemPeriodFn (groupUid, year, month) {
    var q, monthStart, monthEnd, dateStart, dateEnd;

    monthStart = month ? month : 1;
    monthEnd = month ? month : 12;
    dateStart = dat.setFirstDayOfMonth(dat.mkDate(year, monthStart, 1));
    dateEnd = dat.setLastDayOfMonth(dat.mkDate(year, monthEnd, 1));
    q = `
        SELECT      r.uid               AS request_uid,
                    i.uid               AS item_uid,
                    r.date_from,
                    r.date_to
        FROM        requests r
        LEFT JOIN   request_items ri    ON ri.request = r.id
        LEFT JOIN   items i             ON i.id = ri.item
        LEFT JOIN   item_groups ig      ON ig.id = i.item_group
        WHERE       ig.uid = ?
                    AND date_to >= ?
                    AND date_from <= ?
        ORDER BY    r.date_from ASC,
                    r.date_to ASC
    `;

    return db.queryPromise(q, [groupUid, dateStart, dateEnd]);
};
