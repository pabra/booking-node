describe('token validation', () => {
    const middlewares = require('../../lib/middlewares');
    const validToken = middlewares.validToken;
    const ctx = {
        token: {
            payload: {},
        },
        send: () => {},
        set: () => {},
    };
    const fnObj = {
        next: () => {},
    };

    beforeEach(() => {

        spyOn(fnObj, 'next');
        spyOn(ctx, 'send');
        spyOn(ctx, 'set');
    });

    it('should detect invalid token', () => {
        validToken(ctx, fnObj.next);
        expect(ctx.set).toHaveBeenCalled();
        expect(fnObj.next).not.toHaveBeenCalled();
    });

    it('should detect valid token', () => {
        ctx.token.payload.uid = 42;
        validToken(ctx, fnObj.next);
        expect(fnObj.next).toHaveBeenCalled();
    });
});
