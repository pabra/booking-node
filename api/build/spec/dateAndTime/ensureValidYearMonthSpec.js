describe('ensureValidYearMonth', function () {
    const currentYear = new Date().getUTCFullYear();
    const minYear = currentYear - 1;
    const maxYear = currentYear + 2;
    const ensureValidYearMonth = require('../../lib/dateAndTime/ensureValidYearMonth');
    const errors = require('../../lib/errors');
    const ValueError = errors.ValueError;

    it('should return parsed year and month', function () {
        expect(ensureValidYearMonth(`${currentYear}-01`)).toEqual({year: currentYear, month: 1});
        expect(ensureValidYearMonth(`${minYear}-01`)).toEqual({year: minYear, month: 1});
        expect(ensureValidYearMonth(`${maxYear}-12`)).toEqual({year: maxYear, month: 12});

        expect(ensureValidYearMonth(`${currentYear}`)).toEqual({year: currentYear, month: null});
        expect(ensureValidYearMonth(`${minYear}`)).toEqual({year: minYear, month: null});
        expect(ensureValidYearMonth(`${maxYear}`)).toEqual({year: maxYear, month: null});
    });

    it('should throw TypeError', function () {
        let fn;

        fn = () => ensureValidYearMonth();
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth(null);
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth(true);
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth(false);
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth(function () {});
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth({x: 42});
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth([42]);
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth(NaN);
        expect(fn).toThrowError(TypeError, 'expected string type');

        fn = () => ensureValidYearMonth(currentYear);
        expect(fn).toThrowError(TypeError, 'expected string type');
    });

    it('should throw ValueError', function () {
        let fn;

        fn = () => ensureValidYearMonth('');
        expect(fn).toThrowError(ValueError, /^unexpected format/);

        fn = () => ensureValidYearMonth(`01-${currentYear}`);
        expect(fn).toThrowError(ValueError, /^unexpected format/);

        fn = () => ensureValidYearMonth('abcd');
        expect(fn).toThrowError(ValueError, /^unexpected format/);

        fn = () => ensureValidYearMonth(`${currentYear}-00`);
        expect(fn).toThrowError(ValueError, /^(?!unexpected format)/);

        fn = () => ensureValidYearMonth(`${currentYear}-13`);
        expect(fn).toThrowError(ValueError, /^(?!unexpected format)/);

        fn = () => ensureValidYearMonth('2001-01');
        expect(fn).toThrowError(ValueError, /^(?!unexpected format)/);

        fn = () => ensureValidYearMonth('2100-01');
        expect(fn).toThrowError(ValueError, /^(?!unexpected format)/);
    });
});
