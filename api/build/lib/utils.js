exports.isIntOrThrow = isIntOrThrow;
exports.parseStrictIntOrThrow = parseStrictIntOrThrow;
exports.isObjectOrThrow = isObjectOrThrow;
exports.promiseReturner = promiseReturner;

/**
 * isIntOrThrow - test if passed testInttestInt is of type number and not a Float
 *
 * @param {number} testInt
 * @return {type} Description
 */
function isIntOrThrow (testInt) {
    if (typeof testInt !== 'number' || parseInt(testInt, 10) !== testInt)
        throw new TypeError('not an Integer');
}


/**
 * parseStrictIntOrThrow - will onĺy parse Integer looking args (no float looking ones)
 *
 * @param {(number|string)} testInt has to look like Int not like Float
 * @return {number} always an Integer
 */
function parseStrictIntOrThrow (testInt) {
    const parsed = typeof testInt === 'symbol' ?
                   testInt : parseInt(testInt, 10);
    exports.isIntOrThrow(parsed);

    if (String(parsed) !== String(parseFloat(testInt)))
        throw new TypeError(`does not look like Integer: "${testInt}"`);

    return parsed;
}

/**
 * isObject - test if passed obj is a JS Object like {}
 *
 * @param {any} obj thing to test
 *
 * @return {Boolean}
 */
function isObjectOrThrow (testObj) {
    if (Object.prototype.toString.call(testObj) !== '[object Object]')
        throw new TypeError('not an Object');
}

/**
 * promiseReturner - returns a Promise that can succeed or fail and pass value
 *
 * @param {any} value Value to pass to resolve or reject function
 * @param {string} [action=resolve] should the Promise succeed ('resolve') or fail ('reject')
 *
 * @return {Promise}
 */
function promiseReturner (value, action='resolve') {
    return new Promise((resolve, reject) => {
        if (action === 'resolve') resolve(value);
        else reject(value);
    });
}
