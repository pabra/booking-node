'use strict';
describe('isIntOrThrow', function () {
    const utils = require('../../lib/utils');
    const isIntOrThrow = utils.isIntOrThrow;

    it('should not throw for valid args', function () {
        let fn;

        fn = () => isIntOrThrow(0);
        expect(fn).not.toThrow();

        fn = () => isIntOrThrow(1);
        expect(fn).not.toThrow();

        fn = () => isIntOrThrow(-1);
        expect(fn).not.toThrow();

        fn = () => isIntOrThrow(2*2);
        expect(fn).not.toThrow();

        fn = () => isIntOrThrow(2.0);
        expect(fn).not.toThrow();
    });

    it('should throw TypeError for non-Integer args', function () {
        let fn;

        fn = () => isIntOrThrow();
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(NaN);
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(null);
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(Infinity);
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow('a');
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow('2');
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow('02');
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow('2.0');
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow({});
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow([]);
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow({42:2});
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow([42]);
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(2.1);
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(2.0001);
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(function () {});
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(new Error('boohoo'));
        expect(fn).toThrowError(TypeError, 'not an Integer');

        fn = () => isIntOrThrow(Symbol('abc'));
        expect(fn).toThrowError(TypeError, 'not an Integer');
    });
});
