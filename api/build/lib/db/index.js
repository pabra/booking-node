"use strict";

var connect = require('./connect'),
    loadSchema = require('./loadSchema');

exports.pool = connect.pool;

loadSchema.loadSchema();
