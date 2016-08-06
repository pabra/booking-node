"use strict";

var crypto = require('crypto'),
    // removed from alphabet: aeiouAEIOU 01l
    alphabet = 'bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ23456789',
    maxUidLen = 200,
    bytesLen = 255,
    maxTries = 25,
    getStrongUid;


getStrongUid = function (len, callback, i) {
    if (len < 2) throw new Error(`len '${len}' < 2`);
    if (len > maxUidLen) throw new Error(`len '${len}' > ${maxUidLen}`);

    i = i ? i + 1 : 1;

    if (i >= maxTries) throw new Error(`could not get uid of length ${len} within ${i} tries`);

    crypto.randomBytes(bytesLen, function(err, buf) {
        if (err) throw err;

        var expAlpha = new RegExp('[^' + alphabet + ']', 'g'),
            expMatch = new RegExp('[^0-9].{' + (len - 1) + '}'),
            rnd = buf.toString('base64')
                     .replace(expAlpha, '')
                     .match(expMatch);

        if (rnd) {
            callback(rnd[0]);
        } else {
            getStrongUid(len, callback, i);
        }
    });
};

module.exports = getStrongUid;
