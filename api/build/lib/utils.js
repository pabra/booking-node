'use strict';


/**
 * isIntOrThrow - Description
 *
 * @param {type} testInt Description
 * @return {type} Description
 */
exports.isIntOrThrow = function (testInt) {
    if (typeof testInt !== 'number' || parseInt(testInt, 10) !== testInt)
        throw new TypeError(`"${testInt}" is not an Integer.`);
};


/**
 * parseStrictIntOrThrow - will onĺy parse Integer looking args (no float looking ones)
 *
 * @param {(number|string)} testInt has to look like Int not like Float
 * @return {number} always an Integer
 */
exports.parseStrictIntOrThrow = function (testInt) {
    const parsed = parseInt(testInt, 10);
    exports.isIntOrThrow(parsed);

    if (String(parsed) !== String(parseFloat(testInt))) throw new TypeError(`"${testInt}" does not look like Integer.`);

    return parsed;
};
