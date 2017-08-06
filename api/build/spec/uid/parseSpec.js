describe('uid parsing', function () {
    const uidLib = require('../../lib/uid');
    const errors = require('../../lib/errors');
    const ensureValidUid = uidLib.ensureValidUid;
    const ValueError = errors.ValueError;

    it('should parse valid uid', function () {
        let uid;
        let ret;

        uid = 'abc123';
        ret = ensureValidUid(uid);
        expect(ret).toBe(uid);

        uid = 'XXXXXX';
        ret = ensureValidUid(uid);
        expect(ret).toBe(uid);

        uid = 'V12345';
        ret = ensureValidUid(uid);
        expect(ret).toBe(uid);

        uid = 'B1234B';
        ret = ensureValidUid(uid);
        expect(ret).toBe(uid);
    });

    it('should throw TypeError for non-string types', function () {
        let fn;

        fn = () => ensureValidUid(123456);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(Infinity);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(null);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(NaN);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(true);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(false);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(undefined);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid();
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid({'a': 1});
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(['V12345']);
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(function () {});
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(new String('abc123'));
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(Symbol('abc123'));
        expect(fn).toThrowError(TypeError);

        fn = () => ensureValidUid(new Error('boohuu'));
        expect(fn).toThrowError(TypeError);
    });

    it('should throw ValueError for invalid strings', function () {
        let fn;

        fn = () => ensureValidUid('');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('a');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('ab');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abc');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abcd');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abcde');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('1abcde');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abcdefg');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abc$12');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abcö12');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abc 12');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abc_12');
        expect(fn).toThrowError(ValueError);

        fn = () => ensureValidUid('abc-12');
        expect(fn).toThrowError(ValueError);
    });
});
