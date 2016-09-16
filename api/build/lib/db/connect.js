'use strict';

const mysql = require('mysql');
const database = process.env.MYSQL_ENV_MYSQL_DATABASE || 'root';
const test_database = process.env.MYSQL_ENV_MYSQL_TEST_DATABASE || 'test';
const connOpt = {
    connectionLimit : 10,
    queueLimit      : 50,
    host            : process.env.MYSQL_PORT_3306_TCP_ADDR || 'localhost',
    port            : process.env.MYSQL_PORT_3306_TCP_PORT || 3306,
    user            : process.env.MYSQL_ENV_MYSQL_USER || 'booking_node',
    password        : process.env.MYSQL_ENV_MYSQL_PASSWORD || 'root',
    database        : database,
    // debug           : ['ComQueryPacket', 'RowDataPacket'],
    timezone        : 'Europe/Berlin',
};
const pool = mysql.createPool(connOpt);
const logger = require('../logger');
const getMultiConn = function () {
    const opts = Object.assign({}, connOpt, {multipleStatements: true});
    const conn = mysql.createConnection(opts);

    conn.connect();
    logger.info('made new multi statement connection: ' + conn.threadId);

    return conn;
};

pool.on('connection', function (connection) {
    logger.info('made new connection: ' + connection.threadId);
    logger.debug('connections in pool:', connection.config.pool._allConnections.length);
});

pool.on('enqueue', function () {
    logger.warn('Waiting for available connection slot');
    logger.debug('connections in pool:', this._allConnections.length);
});

exports.pool = pool;
exports.database = database;
exports.test_database = test_database;
exports.getMultiConn = getMultiConn;
