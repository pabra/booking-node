const crypto = require('crypto');
const errors = require('../errors');
const ValueError = errors.ValueError;
        // removed from alphabet: aeiouAEIOU 01l
const alphabet = 'bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ23456789';
const maxUidLen = 256;
const maxTries = 25;

// not make it const to overwriteable for tests
let expAlpha = new RegExp('[^' + alphabet + ']', 'g');

module.exports = getStrongUid;

function getStrongUid (len=6) {
    return new Promise((resolve, reject) => {
        if (typeof len !== 'number' || parseInt(len) !== len) reject(new TypeError('expected integer not ' + typeof len));
        if (len < 2) reject(new ValueError(`len '${len}' < 2`));
        if (len > maxUidLen) reject(new ValueError(`len '${len}' > ${maxUidLen}`));

        const expMatch = new RegExp('[^0-9].{' + (len - 1) + '}');
        let i = 0;
        let mkRnd;
        let rnd;

        mkRnd = () => {
            if (++i >= maxTries) reject(new Error(`could not get uid of length ${len} within ${i} tries`));

            crypto.randomBytes(len * 2, (err, buf) => {
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
}
