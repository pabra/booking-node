"use strict";

const   expression = /^[a-zA-Z][a-zA-Z0-9]{5}$/,
        ensureValidUid = require('./ensureValidUid'),
        getStrongUid = require('./getStrongUid');


exports.ensureValidUid = ensureValidUid;
exports.expression = expression;
exports.getStrongUid = getStrongUid;
