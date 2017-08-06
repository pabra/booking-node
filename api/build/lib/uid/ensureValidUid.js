const uidLib = require('./');
const errors = require('../errors');
const ValueError = errors.ValueError;

module.exports = ensureValidUid;

function ensureValidUid (testUid) {
    const expression = uidLib.expression;

    if ('string' !== typeof testUid) {
        throw new TypeError(`uid '${testUid}' is not a string`);
    }

    if (!testUid.match(expression)) {
        throw new ValueError(`uid '${testUid}' is unknown format`);
    }

    return testUid;
}
