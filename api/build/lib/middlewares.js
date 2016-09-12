"use strict";

const   jwt = require('jwt-simple'),
        logger = require('./logger');

exports.token = function (req, res, next) {
    const secret = 'MySuperSecretSuperLongSuperString';

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

exports.crossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', req.headers['origin']);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, application/json, text/plain');
    // res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', 24 * 60 * 60);

    next();
};
