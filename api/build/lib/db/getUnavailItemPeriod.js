"use strict";

const   queryPromise = require('./_queryPromise'),
        dat = require('../dateAndTime');

/**
 * getUnavailItemPeriodFn - queries the databse for unavailbility of an item
 *
 * @param  {string} itemUid - description
 * @param  {number} year    - description
 * @param  {number} month   - description
 * @return {type}           - description
 */
module.exports = function getUnavailItemPeriodFn (itemUid, year, month) {
    let q, monthStart, monthEnd, dateStart, dateEnd;

    monthStart = month ? month : 1;
    monthEnd = month ? month : 12;
    dateStart = dat.setFirstDayOfMonth(dat.mkDate(year, monthStart, 1));
    dateEnd = dat.setLastDayOfMonth(dat.mkDate(year, monthEnd, 1));
    q = `
        SELECT      r.uid               AS request_uid,
                    r.date_from,
                    r.date_to
        FROM        requests r
        LEFT JOIN   request_items ri    ON ri.request = r.id
        LEFT JOIN   items i             ON i.id = ri.item
        WHERE       i.uid = ?
                    AND date_to >= ?
                    AND date_from <= ?
        ORDER BY    r.date_from ASC,
                    r.date_to ASC
    `;

    return queryPromise(q, [itemUid, dateStart, dateEnd]);
};
