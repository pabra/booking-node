const fs = require('fs');
const logger = require('../logger');
const connect = require('./connect');
const database = connect.database;

exports.loadSchema = loadSchema;

function loadSchema (force) {
    let conn = connect.getMultiConn(true);
    let schemaStr;
    let responseHandler;
    let dbExists;
    let getSchema;
    let emptyDb;
    let applySchema;
    let close;

    if (force === undefined) force = false;

    responseHandler = (err, next) => {
        if (err) {
            close();
            throw err;
        }

        if (next instanceof Function) {
            next();
        }
    };

    dbExists = () => {
        const q = `SELECT  1 AS \`exists\`
                   FROM    information_schema.schemata
                   WHERE   schema_name = ?`;

        conn.query(q, [database], (err, rows) => {
            if (err) {
                close();
                throw err;
            }

            const exists = (rows[0] || {}).exists;
            if (!exists || force) getSchema();
            else conn.end();
        });
    };

    getSchema = () => {
        fs.readFile('./db_schema.sql', 'utf-8', (err, data) => {
            if (err) {
                close();
                throw err;
            }

            // info('schema data\n', data);
            schemaStr = data;

            emptyDb();
        });
    };

    emptyDb = () => {
        const q = `DROP DATABASE IF EXISTS ${database};
                   CREATE DATABASE ${database};
                   USE ${database}`;

        logger.info('multiquery:', q);
        conn.query(q, function (err) {
            responseHandler(err, applySchema);
        });
    };

    applySchema = () => {
        logger.info('apply Schema ', conn.threadId);
        conn.query(schemaStr, function (err) {
            responseHandler(err, close);
        });
    };

    close = () => {
        logger.info('close connection', conn.threadId);
        conn.end();
    };

    dbExists();
}
