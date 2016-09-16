'use strict';

const fs = require('fs');
const logger = require('../logger');
const connect = require('./connect');
const database = connect.database;


exports.loadSchema = function () {
    let conn = connect.getMultiConn();
    let schemaStr;
    let responseHandler;
    let getSchema;
    let emptyDb;
    let applySchema;
    let close;

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
        const q = `DROP DATABASE IF EXISTS ${database};
                   CREATE DATABASE ${database};
                   USE ${database}`;

        logger.info('multiquery:', q);
        conn.query(q, function (err) {
            responseHandler(err, applySchema);
        });
    };

    applySchema = function () {
        logger.info('apply Schema ', conn.threadId);
        conn.query(schemaStr, function (err) {
            responseHandler(err, close);
        });
    };

    close = function () {
        logger.info('close connection', conn.threadId);
        conn.end();
    };

    getSchema();
};
