describe('uidInsertHelper', () => {
    const rewire = require('rewire');
    const uidInsertHelperLib = rewire('../../../lib/db/internal/uidInsertHelper');
    const uidInsertHelper = uidInsertHelperLib.uidInserter;
    const UidClass = uidInsertHelperLib.UidClass;
    const queryPromiseMock = function () {
        return new Promise(function (resolve, reject) {
            resolve('success!');
        });
    };

    beforeEach(() => {
        uidInsertHelperLib.__set__('queryPromise', queryPromiseMock);
        uidInsertHelperLib.__set__('transactionQueryPromise', queryPromiseMock);
    });

    // good
    it('should succeed', async done => {
        const data = await uidInsertHelper('query', [new UidClass()]);
        expect(data).toBe('success!');

        done();
    });

    it('should succeed', function (done) {
        const p = uidInsertHelper('query', {'field': new UidClass()});
        p.then(function (result) {
            expect(result).toBe('success!');
            done();
        });
    });

    it('should succeed', function (done) {
        const p = uidInsertHelper('query', [new UidClass()], 'connection');
        p.then(function (result) {
            expect(result).toBe('success!');
            done();
        });
    });

    it('should succeed', function (done) {
        const p = uidInsertHelper('query', {'field': new UidClass()}, 'connection');
        p.then(function (result) {
            expect(result).toBe('success!');
            done();
        });
    });

    // bad - multiple UidClass
    it('should fail because of multiple UidClass in array', function (done) {
        const p = uidInsertHelper('query', [new UidClass(), 'a', new UidClass()]);
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'there must be only one instance of UidClass in args') done();
        });
    });

    it('should fail because of multiple UidClass in object', function (done) {
        const p = uidInsertHelper('query', {'a': new UidClass(), 'b': 2, 'c': new UidClass()});
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'there must be only one instance of UidClass in args') done();
        });
    });

    it('should fail because of multiple UidClass in array', function (done) {
        const p = uidInsertHelper('query', [new UidClass(), 'a', new UidClass()], 'connection');
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'there must be only one instance of UidClass in args') done();
        });
    });

    it('should fail because of multiple UidClass in object', function (done) {
        const p = uidInsertHelper('query', {'a': new UidClass(), 'b': 2, 'c': new UidClass()}, 'connection');
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'there must be only one instance of UidClass in args') done();
        });
    });

    // bad - no UidClass
    it('should fail because of no UidClass in array', function (done) {
        const p = uidInsertHelper('query', ['a']);
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'missing one instance of UidClass in args') done();
        });
    });

    it('should fail because of no UidClass in object', function (done) {
        const p = uidInsertHelper('query', {'b': 2});
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'missing one instance of UidClass in args') done();
        });
    });

    it('should fail because of no UidClass in array', function (done) {
        const p = uidInsertHelper('query', ['a'], 'connection');
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'missing one instance of UidClass in args') done();
        });
    });

    it('should fail because of no UidClass in object', function (done) {
        const p = uidInsertHelper('query', {'b': 2}, 'connection');
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'missing one instance of UidClass in args') done();
        });
    });

    // bad - query args type
    it('should fail because of wrong query args type', function (done) {
        const p = uidInsertHelper('query');
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'not an Object') done();
        });
    });

    it('should fail because wrong query args type', function (done) {
        const p = uidInsertHelper('query', 'my args');
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'not an Object') done();
        });
    });

    it('should fail because wrong query args type', function (done) {
        const p = uidInsertHelper('query', function () {});
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'not an Object') done();
        });
    });

    it('should fail because wrong query args type', function (done) {
        const p = uidInsertHelper('query', new Error('boohoo'));
        p.then(function (result) {}).catch(function (e) {
            if (e instanceof TypeError && e.message === 'not an Object') done();
        });
    });

    describe('uidInsertHelper with duplicate key error', function () {
        const failingQueryPromiseMock = function () {
            return new Promise(function (resolve, reject) {
                const e = new Error("ER_DUP_ENTRY: Duplicate entry 'test' for key 'uid'");
                e.code = 'ER_DUP_ENTRY';
                reject(e);
            });
        };

        beforeEach(function () {
            uidInsertHelperLib.__set__('queryPromise', failingQueryPromiseMock);
            uidInsertHelperLib.__set__('transactionQueryPromise', failingQueryPromiseMock);
        });

        it('should fail of too many retries', function (done) {
            const p = uidInsertHelper('query', [new UidClass()]);
            p.then(result => {}).catch(e => {
                if (e instanceof Error && e.message.match(/^too many retries/)) done();
            });
        });
    });

    describe('uidInsertHelper with unexpected error', function () {
        const failingQueryPromiseMock = function () {
            return new Promise(function (resolve, reject) {
                const e = new Error('test');
                e.code = 'test';
                reject(e);
            });
        };

        beforeEach(function () {
            uidInsertHelperLib.__set__('queryPromise', failingQueryPromiseMock);
            uidInsertHelperLib.__set__('transactionQueryPromise', failingQueryPromiseMock);
        });

        it('should fail of unexpected error thrown by database', function (done) {
            const p = uidInsertHelper('query', [new UidClass()]);
            p.then(result => {}).catch(e => {
                if (e instanceof Error && e.message === 'test' && e.code === 'test') done();
            });
        });
    });
});
