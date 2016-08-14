"use strict";

var fs = require('fs'),
    logger = require('../logger'),
    connect = require('./connect'),
    database = connect.database,
    loadSchema;

loadSchema = function () {
    var conn = connect.getMultiConn(),
        schemaStr, responseHandler, getSchema,
        emptyDb, applySchema, close;

    responseHandler = function (err, next) {
        if (err) throw err;

        if (next instanceof Function) {
            next();
        }
    };

    getSchema = function () {
        fs.readFile('./db_schema.sql', 'utf-8', function (err, data) {
            if (err) throw err;

            // info('schema data\n', data);
            schemaStr = data;

            emptyDb();
        });
    };

    emptyDb = function () {
        var q = `DROP DATABASE IF EXISTS ${database};
                 CREATE DATABASE ${database};
                 USE ${database}`;

        logger.info('multiquery:', q);
        conn.query(q, function(err) { responseHandler(err, applySchema); });
    };

    applySchema = function () {
        logger.info('apply Schema ', conn.threadId);
        conn.query(schemaStr, function (err) { responseHandler(err, close); });
    };

    close = function () {
        logger.info('close connection', conn.threadId);
        conn.end();
    };

    getSchema();
};

exports.loadSchema = loadSchema;
