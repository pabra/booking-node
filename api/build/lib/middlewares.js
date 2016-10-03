'use strict';

const jwt = require('jwt-simple');

exports.token = function (req, res, next) {
    const secret = 'MySuperSecretSuperLongSuperString';
    const authorization = req.get('Authorization');
    const authMatch = authorization ? authorization.match(/^Bearer ([^ ]+)$/) : null;
    const authToken = authMatch ? authMatch[1] : null;

    req.token = {
        encode: () => jwt.encode(req.token.payload, secret),
        payload: {
            _: new Date().getTime(),
        },
    };

    if (authToken) {
        try {
            const payload = jwt.decode(authToken, secret);
            req.token.payload = payload;
        } catch (err) {
            // noop
            (function () {})();
        }
    }

    next();
};

exports.validToken = function (req, res, next) {
    if (req.token.payload.uid) {
        next();
    } else {
        res.header('WWW-Authenticate', 'Bearer realm="booking-node"');
        res.status(401);
        res.send();
    }
};
