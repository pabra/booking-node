describe('mkdate', function () {
    const errors = require('../../lib/errors');
    const ValueError = errors.ValueError;
    const dateAndTimeUtils = require('../../lib/dateAndTime/internal/utils');
    const mkDate = dateAndTimeUtils.mkDate;

    it('should return Date object', function () {
        expect(mkDate(2001, 1, 1).toUTCString()).toBe('Mon, 01 Jan 2001 00:00:00 GMT');
        expect(mkDate(2036, 12, 31).toUTCString()).toBe('Wed, 31 Dec 2036 00:00:00 GMT');
    });

    it('should return TypeError for bad types passed in', function () {
        const expectedErrMsg = /^year, month, day/;
        let fn;

        fn = () => mkDate();
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate(2001, 1);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate('2001', '1', '1');
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate(NaN, NaN, NaN);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate(null, null, null);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate(true, true, true);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate(false, false, false);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate({42: 'b'});
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => mkDate([42, 'b']);
        expect(fn).toThrowError(TypeError, expectedErrMsg);
    });

    it('should return ValueError for bad values passed in', function () {
        let fn;

        fn = () => mkDate(2001, 1, 32);
        expect(fn).toThrowError(ValueError);

        fn = () => mkDate(2001, 2, 30);
        expect(fn).toThrowError(ValueError);

        fn = () => mkDate(2001, 13, 1);
        expect(fn).toThrowError(ValueError);

        fn = () => mkDate(2001, -1, 1);
        expect(fn).toThrowError(ValueError);

        fn = () => mkDate(2001, 1, -1);
        expect(fn).toThrowError(ValueError);

        fn = () => mkDate(2001, 1, 0);
        expect(fn).toThrowError(ValueError);

        fn = () => mkDate(2001, 0, 1);
        expect(fn).toThrowError(ValueError);
    });
});

describe('setFirstDayOfMonth', function () {
    const dateAndTimeUtils = require('../../lib/dateAndTime/internal/utils');
    const setFirstDayOfMonth = dateAndTimeUtils.setFirstDayOfMonth;

    it('should return Date object with first of month', function () {
        expect(setFirstDayOfMonth(new Date(Date.UTC(2001, 0, 1))).toUTCString()).toBe('Mon, 01 Jan 2001 00:00:00 GMT');
        expect(setFirstDayOfMonth(new Date(Date.UTC(2001, 0, 15))).toUTCString()).toBe('Mon, 01 Jan 2001 00:00:00 GMT');
        expect(setFirstDayOfMonth(new Date(Date.UTC(2001, 11, 1))).toUTCString()).toBe('Sat, 01 Dec 2001 00:00:00 GMT');
        expect(setFirstDayOfMonth(new Date(Date.UTC(2001, 11, 15))).toUTCString()).toBe('Sat, 01 Dec 2001 00:00:00 GMT');
    });

    it('should throw TypeError if non-Date is passed', function () {
        const expectedErrMsg = /^not an instance of Date/;
        let fn;

        fn = () => setFirstDayOfMonth();
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth(null);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth(true);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth(false);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth(() => {});
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth(NaN);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth(1);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth('a');
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth({'a': 1});
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setFirstDayOfMonth(['a']);
        expect(fn).toThrowError(TypeError, expectedErrMsg);
    });
});

describe('setLastDayOfMonth', function () {
    const dateAndTimeUtils = require('../../lib/dateAndTime/internal/utils');
    const setLastDayOfMonth = dateAndTimeUtils.setLastDayOfMonth;

    it('should return Date object with first of month', function () {
        expect(setLastDayOfMonth(new Date(Date.UTC(2001, 0, 1))).toUTCString()).toBe('Wed, 31 Jan 2001 00:00:00 GMT');
        expect(setLastDayOfMonth(new Date(Date.UTC(2001, 0, 15))).toUTCString()).toBe('Wed, 31 Jan 2001 00:00:00 GMT');
        expect(setLastDayOfMonth(new Date(Date.UTC(2001, 11, 1))).toUTCString()).toBe('Mon, 31 Dec 2001 00:00:00 GMT');
        expect(setLastDayOfMonth(new Date(Date.UTC(2001, 11, 15))).toUTCString()).toBe('Mon, 31 Dec 2001 00:00:00 GMT');
    });

    it('should throw TypeError if non-Date is passed', function () {
        const expectedErrMsg = /^not an instance of Date/;
        let fn;

        fn = () => setLastDayOfMonth();
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth(null);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth(true);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth(false);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth(() => {});
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth(NaN);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth(1);
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth('a');
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth({'a': 1});
        expect(fn).toThrowError(TypeError, expectedErrMsg);

        fn = () => setLastDayOfMonth(['a']);
        expect(fn).toThrowError(TypeError, expectedErrMsg);
    });
});
