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
exports.putGroup = require('./putGroup');

exports.userBelongsToCompany = require('./user/belongsToCompany');
exports.getCompanies = require('./user/getCompanies');
exports.getUsers = require('./user/getUsers');

// reload database on startup
// loadSchema.loadSchema();

// export endpoint to force reload DB - TODO: remove
exports.loadSchema = loadSchema.loadSchema;
