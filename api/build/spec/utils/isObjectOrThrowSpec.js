describe('isObject', function () {
    const utils = require('../../lib/utils');
    const isObjectOrThrow = utils.isObjectOrThrow;

    it('should not throw for valid objects', function () {
        let fn;

        fn = () => isObjectOrThrow({});
        expect(fn).not.toThrow();

        fn = () => isObjectOrThrow({a: 3});
        expect(fn).not.toThrow();

        fn = () => isObjectOrThrow(Object({a: 3}));
        expect(fn).not.toThrow();
    });

    it('should return false for non objects', function () {
        let fn;

        fn = () => isObjectOrThrow();
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow([]);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow([1,2]);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(Object([1,2]));
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow('');
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow('abc');
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(Object('abc'));
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(/abc/);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(1);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(Object(1));
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(Infinity);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(null);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(NaN);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(true);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(false);
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(function () {});
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(new Error('boohoo'));
        expect(fn).toThrowError(TypeError, 'not an Object');

        fn = () => isObjectOrThrow(Symbol('abc'));
        expect(fn).toThrowError(TypeError, 'not an Object');
    });
});
