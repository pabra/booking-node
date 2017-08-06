describe('ensureValidIsoDate', function () {
    const currentYear = new Date().getUTCFullYear();
    const minYear = currentYear - 1;
    const maxYear = currentYear + 2;
    const ensureValidIsoDate = require('../../lib/dateAndTime/ensureValidIsoDate');
    const errors = require('../../lib/errors');
    const ValueError = errors.ValueError;

    it('should return Date object', function () {
        expect(ensureValidIsoDate(`${currentYear}-01-01`).toUTCString()).toBe(new Date(Date.UTC(currentYear, 0, 1)).toUTCString());
        expect(ensureValidIsoDate(`${minYear}-01-01`).toUTCString()).toBe(new Date(Date.UTC(minYear, 0, 1)).toUTCString());
        expect(ensureValidIsoDate(`${maxYear}-01-01`).toUTCString()).toBe(new Date(Date.UTC(maxYear, 0, 1)).toUTCString());
    });

    it('should throw TypeError', function () {
        let fn;

        fn = () => ensureValidIsoDate();
        expect(fn).toThrowError(TypeError, /^expected string type$/);

        fn = () => ensureValidIsoDate(null);
        expect(fn).toThrowError(TypeError, /^expected string type$/);

        fn = () => ensureValidIsoDate(true);
        expect(fn).toThrowError(TypeError, /^expected string type$/);

        fn = () => ensureValidIsoDate(false);
        expect(fn).toThrowError(TypeError, /^expected string type$/);

        fn = () => ensureValidIsoDate(new Date());
        expect(fn).toThrowError(TypeError, /^expected string type$/);

        fn = () => ensureValidIsoDate(NaN);
        expect(fn).toThrowError(TypeError, /^expected string type$/);

        fn = () => ensureValidIsoDate(currentYear);
        expect(fn).toThrowError(TypeError, /^expected string type$/);
    });

    it('should throw ValueError', function () {
        let fn;

        fn = () => ensureValidIsoDate(`${currentYear}-01-32`);
        expect(fn).toThrowError(ValueError, /^(?!string does not look like ISO date)/);

        fn = () => ensureValidIsoDate(`${currentYear}-1-1`);
        expect(fn).toThrowError(ValueError, /^string does not look like ISO date/);
    });
});
