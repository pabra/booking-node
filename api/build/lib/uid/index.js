const expression = /^[a-zA-Z][a-zA-Z0-9]{5}$/;
const ensureValidUid = require('./ensureValidUid');
const getStrongUid = require('./getStrongUid');


exports.ensureValidUid = ensureValidUid;
exports.expression = expression;
exports.getStrongUid = getStrongUid;
