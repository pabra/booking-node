"use strict";

var uidLib = require('./'),
    errors = require('../errors'),
    ValueError = errors.ValueError;

module.exports = function validUidFn (testUid) {
    var expression = uidLib.expression;


    if ('string' !== typeof testUid) {
        throw new ValueError(`uid '${testUid}' is not a string`);
    }

    if (!testUid.match(expression)) {
        throw new ValueError(`uid '${testUid}' is unknown format`);
    }

    return testUid;
};
