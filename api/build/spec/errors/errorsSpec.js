describe('ValueError', function () {
    const errors = require('../../lib/errors');
    const ValueError = errors.ValueError;

    it('should throw with message', function () {
        let fn = () => {
            throw new ValueError('test');
        };
        expect(fn).toThrowError(ValueError, 'test');
    });

    it('should throw without message', function () {
        let fn = () => {
            throw new ValueError();
        };
        expect(fn).toThrowError(ValueError, '');
    });
});
