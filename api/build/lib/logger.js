const winston = require('winston');
const logDir = __dirname + '/../log';

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ json: false, timestamp: true, colorize: true, level: 'debug' }),
        new (winston.transports.File)({ filename: logDir + '/debug.log', json: false, level: 'debug' }),
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true, colorize: true }),
        new (winston.transports.File)({ filename: logDir + '/exceptions.log', json: false }),
    ],
    exitOnError: false,
});
