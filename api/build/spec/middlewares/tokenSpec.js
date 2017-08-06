describe('token detection in HTTP request header', () => {
    const rewire = require('rewire');
    const middlewares = rewire('../../lib/middlewares');
    const jwt = middlewares.__get__('jwt');
    const decodeOrig = jwt.decode;
    const tokenContent = 'testToken';
    const fnObj = {
        next: () => {},
    };
    let ctx;

    beforeEach(() => {
        jwt.decode = txt => txt;
        ctx = {
            get: header => `Bearer ${tokenContent}`,
        };

        spyOn(fnObj, 'next');
    });

    afterEach(() => {
        jwt.decode = decodeOrig;
    });

    it('should call next', () => {
        middlewares.token(ctx, fnObj.next);
        expect(fnObj.next).toHaveBeenCalled();
    });

    it('should not throw', () => {
        let fn = () => middlewares.token(ctx, fnObj.next);
        expect(fn).not.toThrow();
    });

    it('should add token payload to request', () => {
        middlewares.token(ctx, fnObj.next);
        expect(ctx.token.payload).toEqual(tokenContent);
    });

    describe('undecodeable token', () => {
        const now = new Date();

        beforeEach(() => {
            jwt.decode = () => {
                throw new Error('cannot decode');
            };
        });

        it('thrown Error should be cought', () => {
            middlewares.token(ctx, fnObj.next);
            expect(fnObj.next).toHaveBeenCalled();
        });

        it('should set initial token payload to request', () => {
            jasmine.clock().mockDate(now);
            middlewares.token(ctx, fnObj.next);
            expect(ctx.token.payload).toEqual({_: now.getTime()});
        });
    });

    describe('no token in HTTP request header', () => {
        const now = new Date();

        beforeEach(() => {
            ctx = {
                get: header => undefined,
            };
        });

        it('should not throw', () => {
            let fn = () => middlewares.token(ctx, fnObj.next);
            expect(fn).not.toThrow();
        });

        it('should set initial token payload to request', () => {
            jasmine.clock().mockDate(now);
            middlewares.token(ctx, fnObj.next);
            expect(ctx.token.payload).toEqual({_: now.getTime()});
        });
    });
});
