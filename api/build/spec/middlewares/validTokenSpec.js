'use strict';

describe('token validation', function () {
    const middlewares = require('../../lib/middlewares');
    const validToken = middlewares.validToken;
    const req = {
        token: {
            payload: {},
        },
    };
    const res = {
        header: () => {},
        status: () => {},
        send: () => {},
    };
    const fnObj = {
        next: () => {},
    };

    beforeEach(function () {

        spyOn(fnObj, 'next');
        spyOn(res, 'send');
    });

    it('should detect invalid token', function () {
        validToken(req, res, fnObj.next);
        expect(res.send).toHaveBeenCalled();
    });

    it('should detect valid token', function () {
        req.token.payload.uid = 42;
        validToken(req, res, fnObj.next);
        expect(fnObj.next).toHaveBeenCalled();
    });
});
