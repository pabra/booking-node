'use strict';


/**
 * isIntOrThrow - test if passed testInttestInt is of type number and not a Float
 *
 * @param {number} testInt
 * @return {type} Description
 */
exports.isIntOrThrow = function (testInt) {
    if (typeof testInt !== 'number' || parseInt(testInt, 10) !== testInt)
        throw new TypeError('not an Integer');
};


/**
 * parseStrictIntOrThrow - will onĺy parse Integer looking args (no float looking ones)
 *
 * @param {(number|string)} testInt has to look like Int not like Float
 * @return {number} always an Integer
 */
exports.parseStrictIntOrThrow = function (testInt) {
    const parsed = typeof testInt === 'symbol' ?
                   testInt : parseInt(testInt, 10);
    exports.isIntOrThrow(parsed);

    if (String(parsed) !== String(parseFloat(testInt)))
        throw new TypeError(`does not look like Integer: "${testInt}"`);

    return parsed;
};

/**
 * isObject - test if passed obj is a JS Object like {}
 *
 * @param {any} obj thing to test
 *
 * @return {Boolean}
 */
exports.isObjectOrThrow = function (testObj) {
    if (Object.prototype.toString.call(testObj) !== '[object Object]')
        throw new TypeError('not an Object');
};
