"use strict";

/**
 * Creating custom Error classes in Node.js
 * https://gist.github.com/justmoon/15511f92e5216fa2624b
 */

var util = require('util');

function ValueError (message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message || '';
  this.extra = extra;
}
util.inherits(ValueError, Error);

exports.ValueError = ValueError;
