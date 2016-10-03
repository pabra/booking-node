'use strict';

describe('parseStrictIntOrThrow', function () {
    const utils = require('../../lib/utils');
    const parseStrictIntOrThrow = utils.parseStrictIntOrThrow;

    it('should not throw for valid args', function () {
        let fn;

        fn = () => parseStrictIntOrThrow('0');
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow('1');
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow('-1');
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow('1.0');
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow(0);
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow(1);
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow(-1);
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow(1.0);
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow(99999);
        expect(fn).not.toThrow();

        fn = () => parseStrictIntOrThrow('99999');
        expect(fn).not.toThrow();
    });

    it('should return parsed Integer', function () {
        expect(parseStrictIntOrThrow('0')).toBe(0);
        expect(parseStrictIntOrThrow('1')).toBe(1);
        expect(parseStrictIntOrThrow('-1')).toBe(-1);
        expect(parseStrictIntOrThrow('1.0')).toBe(1);
        expect(parseStrictIntOrThrow(0)).toBe(0);
        expect(parseStrictIntOrThrow(1)).toBe(1);
        expect(parseStrictIntOrThrow(-1)).toBe(-1);
        expect(parseStrictIntOrThrow(1.0)).toBe(1);
        expect(parseStrictIntOrThrow('01')).toBe(1);
        expect(parseStrictIntOrThrow(99999)).toBe(99999);
        expect(parseStrictIntOrThrow('99999')).toBe(99999);
    });

    it('should throw TypeError for invalid args', function () {
        let fn;

        fn = () => parseStrictIntOrThrow();
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(null);
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(Infinity);
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(NaN);
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(true);
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(false);
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(function () {});
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(new Error('boohoo'));
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow(1.1);
        expect(fn).toThrowError(TypeError);

        fn = () => parseStrictIntOrThrow('1.1');
        expect(fn).toThrowError(TypeError);
    });
});
