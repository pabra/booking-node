"use strict";

var mysql = require('mysql'),
    database = process.env.MYSQL_ENV_MYSQL_DATABASE || 'root',
    test_database = process.env.MYSQL_ENV_MYSQL_TEST_DATABASE || 'test',
    connOpt = {
        connectionLimit : 10,
        queueLimit      : 50,
        host            : process.env.MYSQL_PORT_3306_TCP_ADDR || 'localhost',
        port            : process.env.MYSQL_PORT_3306_TCP_PORT || 3306,
        user            : process.env.MYSQL_ENV_MYSQL_USER || 'booking_node',
        password        : process.env.MYSQL_ENV_MYSQL_PASSWORD || 'root',
        database        : database,
        timezone        : 'Europe/Berlin'
    },
    pool = mysql.createPool(connOpt),
    getMultiConn,
    _debug = require('debug'),
    info = _debug('app:info'),
    warn = _debug('app:warn');

pool.on('connection', function (connection) {
    // connection.query('SET SESSION auto_increment_increment=1')
    // debug('made new connection: ' + connection.threadId);
    info('made new connection: ' + connection.threadId);
});

pool.on('enqueue', function () {
    // debug('Waiting for available connection slot');
    warn('Waiting for available connection slot');
});

getMultiConn = function () {
    var opts = Object.assign({}, connOpt, {multipleStatements: true}),
        conn = mysql.createConnection(opts);

    conn.connect();
    info('made new multi statement connection: ' + conn.threadId);

    return conn;
};

exports.pool = pool;
exports.database = database;
exports.test_database = test_database;
exports.getMultiConn = getMultiConn;
