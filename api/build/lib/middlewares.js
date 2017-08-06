const jwt = require('jwt-simple');

exports.token = token;
exports.validToken = validToken;

async function token (ctx, next) {
    const secret = 'MySuperSecretSuperLongSuperString';
    const authorization = ctx.get('Authorization');
    const authMatch = authorization ? authorization.match(/^Bearer ([^ ]+)$/) : null;
    const authToken = authMatch ? authMatch[1] : null;

    ctx.token = {
        encode: () => jwt.encode(ctx.token.payload, secret),
        payload: {
            _: new Date().getTime(),
        },
    };

    if (authToken) {
        try {
            const payload = jwt.decode(authToken, secret);
            ctx.token.payload = payload;
        } catch (err) {
            // noop
            (() => {})();
        }
    }

    await next();
}

async function validToken (ctx, next) {
    if (ctx.token.payload.uid) {
        await next();
    } else {
        ctx.set('WWW-Authenticate', 'Bearer realm="booking-node"');
        ctx.status = 401;
    }
}
