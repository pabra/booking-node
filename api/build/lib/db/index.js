'use strict';

const connect = require('./connect');
const loadSchema = require('./loadSchema');

exports.pool = connect.pool;
exports.getUnavailItemPeriod = require('./getUnavailItemPeriod');
exports.getUnavailGroupPeriod = require('./getUnavailGroupPeriod');
exports.putItemBooking = require('./putItemBooking');
exports.newAccount = require('./newAccount');
exports.userAuth = require('./userAuth');
exports.getItemsForUser = require('./getItemsForUser');
exports.getUserProfile = require('./getUserProfile');
exports.putGroup = require('./putGroup');

exports.userBelongsToCompany = require('./user/belongsToCompany');

// reload database on startup
// loadSchema.loadSchema();

// export endpoint to force reload DB - TODO: remove
exports.loadSchema = loadSchema.loadSchema;
