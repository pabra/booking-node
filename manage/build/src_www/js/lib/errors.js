class ExtendableError extends Error {
    constructor (message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class ValueError extends ExtendableError {
    constructor (m) {
        super(m);
    }
}

class AjaxError extends ExtendableError {
    constructor (m) {
        super(m);
    }
}

exports.ValueError = ValueError;
exports.AjaxError = AjaxError;
