/* eslint no-multi-spaces: 0 */
describe('permission check', function () {
    const rewire = require('rewire');
    const permissionLib = rewire('../../lib/permissions');
    const hasPerm = permissionLib.hasPermission;
    const hasPermCheck = permissionLib.__get__('hasPermissionCheck');
    const addPermAct = permissionLib.__get__('addPermissionAction');
    const remPermAct = permissionLib.__get__('removePermissionAction');
    const errors = require('../../lib/errors');
    const ValueError = errors.ValueError;

    const permDenied =                  parseInt('0000', 2);    //  0
    const permView =                    parseInt('0001', 2);    //  1
    const permEdit =                    parseInt('0010', 2);    //  2
    const permCreate =                  parseInt('0100', 2);    //  4
    const permDelete =                  parseInt('1000', 2);    //  8

    const permViewEdit =                parseInt('0011', 2);    //  3
    const permViewCreate =              parseInt('0101', 2);    //  5
    const permViewDelete =              parseInt('1001', 2);    //  9
    const permViewEditCreate =          parseInt('0111', 2);    //  7
    const permViewEditDelete =          parseInt('1011', 2);    // 11
    const permViewCreateDelete =        parseInt('1101', 2);    // 13
    const permViewEditCreateDelete =    parseInt('1111', 2);    // 15

    const permEditCreate =              parseInt('0110', 2);    //  6
    const permEditDelete =              parseInt('1010', 2);    // 10
    const permEditCreateDelete =        parseInt('1110', 2);    // 14

    const permCreateDelete =            parseInt('1100', 2);    // 12

    it('should thow on unknown permission name', function () {
        let fn;

        fn = () => hasPerm('user', 'item', 'itemType', 'unknown_permission_name');
        expect(fn).toThrowError(ValueError, /^unknown permission/);
    });

    it('should check permissions right', function () {
        let checkPerm;

        checkPerm = permDenied;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permView;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permEdit;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permCreate;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = permViewEdit;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permViewCreate;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permViewDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = permViewEditCreate;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permViewEditDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = permViewCreateDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = permViewEditCreateDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = permEditCreate;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = permEditDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = permEditCreateDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = permCreateDelete;
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);
    });

    it('should add permissions right', function () {
        let checkPerm;

        checkPerm = addPermAct(permDenied, permView);
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = addPermAct(permViewCreate, permView);
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(true);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = addPermAct(permEditDelete, permView);
        expect(hasPermCheck(checkPerm, permView)).toBe(true);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);
    });

    it('should remove permissions right', function () {
        let checkPerm;

        checkPerm = remPermAct(permView, permView);
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(false);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(false);

        checkPerm = remPermAct(permViewEditDelete, permView);
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);

        checkPerm = remPermAct(permEditDelete, permView);
        expect(hasPermCheck(checkPerm, permView)).toBe(false);
        expect(hasPermCheck(checkPerm, permEdit)).toBe(true);
        expect(hasPermCheck(checkPerm, permCreate)).toBe(false);
        expect(hasPermCheck(checkPerm, permDelete)).toBe(true);
    });
});
