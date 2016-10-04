'use strict';

describe('belongsToCompany', function () {
    const rewire = require('rewire');
    const belongsToCompany = rewire('../../../lib/db/user/belongsToCompany');
    const companyUserRalation = {'comp01': {'user01': {'isTrue': 1}}};

    beforeEach(function () {
        belongsToCompany.__set__('queryPromise', function (query, args) {
            return new Promise(function (resolve, reject) {
                const userUid = String(args[0]);
                const companyUid = String(args[1]);
                resolve([(companyUserRalation[companyUid] || {})[userUid]]);
            });
        });
    });

    it('should succeed', function (done) {
        const p = belongsToCompany('user01', 'comp01');
        p.then(function (isTrue) {
            expect(isTrue).toBe(true);
            done();
        });
    });

    it('should fail', function (done) {
        const p = belongsToCompany('user02', 'comp02');
        p.then(function (isTrue) {
            expect(isTrue).toBe(false);
            done();
        });
    });
});
