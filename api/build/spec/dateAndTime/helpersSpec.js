describe('date and time helpers', function () {
    const errors = require('../../lib/errors');
    const ValueError = errors.ValueError;
    const currentYear = new Date().getUTCFullYear();
    const dateAndTimeHelpers = require('../../lib/dateAndTime/internal/helpers');
    const ensureValidYear = dateAndTimeHelpers.ensureValidYear;
    const ensureValidMonth = dateAndTimeHelpers.ensureValidMonth;

    // good
    it('ensureValidYear should return year as Integer', function () {
        expect(ensureValidYear(currentYear)).toBe(currentYear);
        expect(ensureValidYear(currentYear - 1)).toBe(currentYear - 1);
        expect(ensureValidYear(currentYear + 1)).toBe(currentYear + 1);
        expect(ensureValidYear(currentYear + 2)).toBe(currentYear + 2);
        expect(ensureValidYear(String(currentYear))).toBe(currentYear);
        expect(ensureValidYear(String(currentYear - 1))).toBe(currentYear - 1);
        expect(ensureValidYear(String(currentYear + 1))).toBe(currentYear + 1);
        expect(ensureValidYear(String(currentYear + 2))).toBe(currentYear + 2);
    });

    it('ensureValidMonth should return month as Integer', function () {
        expect(ensureValidMonth(1)).toBe(1);
        expect(ensureValidMonth(2)).toBe(2);
        expect(ensureValidMonth(3)).toBe(3);
        expect(ensureValidMonth(4)).toBe(4);
        expect(ensureValidMonth(5)).toBe(5);
        expect(ensureValidMonth(6)).toBe(6);
        expect(ensureValidMonth(7)).toBe(7);
        expect(ensureValidMonth(8)).toBe(8);
        expect(ensureValidMonth(9)).toBe(9);
        expect(ensureValidMonth(10)).toBe(10);
        expect(ensureValidMonth(11)).toBe(11);
        expect(ensureValidMonth(12)).toBe(12);
        expect(ensureValidMonth(String(1))).toBe(1);
        expect(ensureValidMonth(String(2))).toBe(2);
        expect(ensureValidMonth(String(3))).toBe(3);
        expect(ensureValidMonth(String(4))).toBe(4);
        expect(ensureValidMonth(String(5))).toBe(5);
        expect(ensureValidMonth(String(6))).toBe(6);
        expect(ensureValidMonth(String(7))).toBe(7);
        expect(ensureValidMonth(String(8))).toBe(8);
        expect(ensureValidMonth(String(9))).toBe(9);
        expect(ensureValidMonth(String(10))).toBe(10);
        expect(ensureValidMonth(String(11))).toBe(11);
        expect(ensureValidMonth(String(12))).toBe(12);
    });

    // bad value
    it('ensureValidYear should throw ValueError for invalid year', function () {
        let fn;

        fn = () => ensureValidYear(0);
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidYear(-1);
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidYear(currentYear - 2);
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidYear(currentYear + 3);
        expect(fn).toThrowError(ValueError);
    });

    it('ensureValidMonth should throw ValueError for invalid month', function () {
        let fn;

        fn = () => ensureValidMonth(0);
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidMonth(-1);
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidMonth(13);
        expect(fn).toThrowError(ValueError);
    });

    // bad type
    it('ensureValidYear should throw TypeError for bad types', function () {
        let fn;

        fn = () => ensureValidYear();
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidYear(null);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidYear(NaN);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidYear('');
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidYear('abc');
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidYear(true);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidYear(false);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidYear(function () {});
        expect(fn).toThrowError(TypeError);
    });

    it('ensureValidMonth should throw TypeError for bad types', function () {
        let fn;

        fn = () => ensureValidMonth();
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidMonth(null);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidMonth(NaN);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidMonth('');
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidMonth('abc');
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidMonth(true);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidMonth(false);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidMonth(function () {});
        expect(fn).toThrowError(TypeError);
    });
});
