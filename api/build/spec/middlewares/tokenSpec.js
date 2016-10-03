'use strict';

describe('token detection in HTTP request header', function () {
    const rewire = require('rewire');
    const middlewares = rewire('../../lib/middlewares');
    const jwt = middlewares.__get__('jwt');
    const decodeOrig = jwt.decode;
    const tokenContent = 'testToken';
    const res = {};
    const fnObj = {
        next: function () {},
    };
    let req;

    beforeEach(function () {
        jwt.decode = txt => txt;
        req = {
            get: header => `Bearer ${tokenContent}`,
        };

        spyOn(fnObj, 'next');
    });

    afterEach(function () {
        jwt.decode = decodeOrig;
    });

    it('should call next', function () {
        middlewares.token(req, res, fnObj.next);
        expect(fnObj.next).toHaveBeenCalled();
    });

    it('should not throw', function () {
        let fn = () => middlewares.token(req, res, fnObj.next);
        expect(fn).not.toThrow();
    });

    it('should add token payload to request', function () {
        middlewares.token(req, res, fnObj.next);
        expect(req.token.payload).toEqual(tokenContent);
    });

    describe('undecodeable token', function () {
        const now = new Date();

        beforeEach(function () {
            jwt.decode = function () {
                throw new Error('cannot decode');
            };
        });

        it('thrown Error should be cought', function () {
            middlewares.token(req, res, fnObj.next);
            expect(fnObj.next).toHaveBeenCalled();
        });

        it('should set initial token payload to request', function () {
            jasmine.clock().mockDate(now);
            middlewares.token(req, res, fnObj.next);
            expect(req.token.payload).toEqual({_: now.getTime()});
        });
    });

    describe('no token in HTTP request header', function () {
        const now = new Date();

        beforeEach(function () {
            req = {
                get: header => undefined,
            };
        });

        it('should not throw', function () {
            let fn = () => middlewares.token(req, res, fnObj.next);
            expect(fn).not.toThrow();
        });

        it('should set initial token payload to request', function () {
            jasmine.clock().mockDate(now);
            middlewares.token(req, res, fnObj.next);
            expect(req.token.payload).toEqual({_: now.getTime()});
        });
    });
});
