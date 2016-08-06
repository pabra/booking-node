"use strict";

var errors = require('./errors'),
    ValueError = errors.ValueError;


exports.ensureInt = function (testInt) {
    var sureInt;

    if (['string', 'number'].indexOf(typeof testInt) > -1) {
        // a float is typeof 'number' too, so always parse as int
        sureInt = parseInt(testInt, 10);
        if (isNaN(sureInt)) throw new ValueError(`cannot parse '${testInt}' as int`);
    } else throw new ValueError('unexpected type: ' + (typeof testInt));

    return sureInt;
};
