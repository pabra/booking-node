"use strict";

const   crypto = require('crypto'),
        // removed from alphabet: aeiouAEIOU 01l
        alphabet = 'bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ23456789',
        expAlpha = new RegExp('[^' + alphabet + ']', 'g'),
        maxUidLen = 256,
        maxTries = 25;


module.exports = function (len) {
    return new Promise(function(resolve, reject) {
        if (len < 2) reject(new Error(`len '${len}' < 2`));
        if (len > maxUidLen) reject(new Error(`len '${len}' > ${maxUidLen}`));

        const expMatch = new RegExp('[^0-9].{' + (len - 1) + '}');
        let i = 0,
            mkRnd, rnd;

        mkRnd = function () {
            if (++i >= maxTries) reject(new Error(`could not get uid of length ${len} within ${i} tries`));

            crypto.randomBytes(len * 2, function(err, buf) {
                if (err) reject(err);

                rnd = buf.toString('base64')
                         .replace(expAlpha, '')
                         .match(expMatch);

                if (rnd) resolve(rnd[0]);
                else mkRnd();
            });
        };

        mkRnd();
    });
};
