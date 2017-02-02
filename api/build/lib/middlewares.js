'use strict';

const jwt = require('jwt-simple');

exports.token = function *(next) {
    const secret = 'MySuperSecretSuperLongSuperString';
    const authorization = this.get('Authorization');
    const authMatch = authorization ? authorization.match(/^Bearer ([^ ]+)$/) : null;
    const authToken = authMatch ? authMatch[1] : null;

    this.token = {
        encode: () => jwt.encode(this.token.payload, secret),
        payload: {
            _: new Date().getTime(),
        },
    };

    if (authToken) {
        try {
            const payload = jwt.decode(authToken, secret);
            this.token.payload = payload;
        } catch (err) {
            // noop
            (() => {})();
        }
    }

    yield next;
};

exports.validToken = function *(next) {
    if (this.token.payload.uid) {
        yield next;
    } else {
        this.set('WWW-Authenticate', 'Bearer realm="booking-node"');
        this.status = 401;
    }
};
