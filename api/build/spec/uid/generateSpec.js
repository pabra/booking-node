describe('generating uid', function () {
    const uidLib = require('../../lib/uid');
    const validUidRe = uidLib.expression;
    const getStrongUid = uidLib.getStrongUid;
    const errors = require('../../lib/errors');
    const ValueError = errors.ValueError;

    // good
    it('should return valid uid', function (done) {
        const p = getStrongUid();
        p.then(function (uid) {
            expect(uid).toMatch(validUidRe);
            done();
        });
    });

    it('should return shortest possible uid', function (done) {
        const p = getStrongUid(2);
        p.then(function (uid) {
            const re = /^[a-zA-Z][a-zA-Z0-9]$/;
            expect(uid).toMatch(re);
            done();
        });
    });

    it('should return longest possible uid', function (done) {
        const p = getStrongUid(256);
        p.then(function (uid) {
            const re = /^[a-zA-Z][a-zA-Z0-9]{255}$/;
            expect(uid).toMatch(re);
            done();
        });
    });


    // bad length
    it('should throw ValueError on too short length', function (done) {
        const p = getStrongUid(1);
        p.then(function (uid) {
            done.fail(`Expected thrown ValueError not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof ValueError) done();
            else done.fail('Expected ValueError to be thrown not "' + err.name + '".');
        });
    });

    it('should throw ValueError on too long length', function (done) {
        const p = getStrongUid(257);
        p.then(function (uid) {
            done.fail(`Expected ValueError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof ValueError) done();
            else done.fail('Expected ValueError to be thrown not "' + err.name + '".');
        });
    });


    // bad type
    it('should throw TypeError on passed string', function (done) {
        const p = getStrongUid('5');
        p.then(function (uid) {
            done.fail(`Expected TypeError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof TypeError) done();
            else done.fail('Expected TypeError to be thrown not "' + err.name + '".');
        });
    });

    it('should throw TypeError on passed null', function (done) {
        const p = getStrongUid(null);
        p.then(function (uid) {
            done.fail(`Expected TypeError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof TypeError) done();
            else done.fail('Expected TypeError to be thrown not "' + err.name + '".');
        });
    });

    it('should throw TypeError on passed NaN', function (done) {
        const p = getStrongUid(NaN);
        p.then(function (uid) {
            done.fail(`Expected TypeError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof TypeError) done();
            else done.fail('Expected TypeError to be thrown not "' + err.name + '".');
        });
    });

    it('should throw TypeError on passed true', function (done) {
        const p = getStrongUid(true);
        p.then(function (uid) {
            done.fail(`Expected TypeError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof TypeError) done();
            else done.fail('Expected TypeError to be thrown not "' + err.name + '".');
        });
    });

    it('should throw TypeError on passed false', function (done) {
        const p = getStrongUid(false);
        p.then(function (uid) {
            done.fail(`Expected TypeError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof TypeError) done();
            else done.fail('Expected TypeError to be thrown not "' + err.name + '".');
        });
    });

    it('should throw TypeError on passed object', function (done) {
        const p = getStrongUid({'4':2});
        p.then(function (uid) {
            done.fail(`Expected TypeError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof TypeError) done();
            else done.fail('Expected TypeError to be thrown not "' + err.name + '".');
        });
    });

    it('should throw TypeError on passed array', function (done) {
        const p = getStrongUid([42]);
        p.then(function (uid) {
            done.fail(`Expected TypeError to be thrown not return of "${uid}".`);
        }).catch(err => {
            if (err instanceof TypeError) done();
            else done.fail('Expected TypeError to be thrown not "' + err.name + '".');
        });
    });
});

describe('failing of uid generator if unable to generate long enough uid', function () {
    const rewire = require('rewire');
    const getStrongUid = rewire('../../lib/uid/getStrongUid');

    beforeEach(function () {
        // overwrite regex that should remove "bad" characters from generated string
        // with this regex we will remove all chars getStrongUid never generates a valid uid
        getStrongUid.__set__('expAlpha', /[a-zA-Z0-9+\/]/g);
    });

    it('should throw an Error', function (done) {
        const p = getStrongUid();
        p.then(function (uid) {
            done.fail(`we sould not get an uid: "${uid}"`);
        }).catch(function (err) {
            if (err instanceof Error) done();
            else done.fail('Expected Error to be thrown not "' + err.name + '".');
        });
    });
});

describe('failing of uid generator if crypto.randomBytes has an error', function () {
    const rewire = require('rewire');
    const getStrongUid = rewire('../../lib/uid/getStrongUid');
    const crypto = getStrongUid.__get__('crypto');
    const randomBytesOrig = crypto.randomBytes;

    beforeEach(function () {
        crypto.randomBytes = function (len, callback) {
            const err = new Error('test');
            callback(err);
        };
    });

    afterEach(function () {
        crypto.randomBytes = randomBytesOrig;
    });

    it('should throw an Error', function (done) {
        const p = getStrongUid();
        p.then(function (uid) {
            done.fail(`we sould not get an uid: "${uid}"`);
        }).catch(function (err) {
            if (err instanceof Error && err.message === 'test') done();
            else done.fail('Expected Error with message "test" to be thrown not "' + err.name + '" with "' + err.message + '".');
        });
    });
});
