"use strict";

const   errors = require('./errors'),
        ValueError = errors.ValueError;


exports.ensureInt = function (testInt) {
    let sureInt;

    if (['string', 'number'].indexOf(typeof testInt) > -1) {
        // a float is typeof 'number' too, so always parse as int
        sureInt = parseInt(testInt, 10);
        if (isNaN(sureInt)) throw new ValueError(`cannot parse '${testInt}' as int`);
    } else throw new ValueError('unexpected type: ' + (typeof testInt));

    return sureInt;
};

exports.isInt = function isIntFn (testInt) {
    return isNaN(testInt) ? false :
           parseInt(testInt, 10) !== testInt ? false : true;
};
