"use strict";

var jwt = require('jwt-simple'),
    logger = require('./logger');

module.exports = function (req, res, next) {
    var secret = 'MySuperSecretSuperLongSuperString';

    logger.debug('req.body.token', req.body.token);
    req.token = {
        payload: {
            _: new Date().getTime()
        },
        encode: function () {
            return jwt.encode(req.token.payload, secret);
        }
    };
    if (req.body.token) {
        try {
            req.token.payload = jwt.decode(req.body.token, secret);
        } catch (err) {
            // noop
            (function () {})();
        }
    }
    logger.debug('req.token', req.token);
    next();
};
