'use strict';
// module.exports = function (method, ressource, txData, callback) {
//     var noop = require('./noop'),
//         xhr = new XMLHttpRequest();
//
//     method = method.toLowerCase();
//     txData = txData ? JSON.stringify(txData) : undefined;
//
//     xhr.open(method, ressource);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onload = function() {
//         var _xhr = this;
//         if (_xhr.status >= 200 && _xhr.status < 400){
//             if('function' === typeof callback){
//                 callback(JSON.parse(_xhr.responseText));
//             }
//         } else {
//             // We reached our target server, but it returned an error
//             noop();
//         }
//     };
//
//     xhr.onerror = function(err) {
//         window.console.log('error', err);
//         // There was a connection error of some sort
//         noop();
//     };
//
//     xhr.send(txData);
//     // IE does not like this if it comes to multiple requests per time
//     //xhr = null;
// };


/**
 *
 */
module.exports = function (options) {
    var xhr = new XMLHttpRequest(),
        method = (options.method || '').toLowerCase(),
        url = options.url,
        data = 'object' === typeof options.data ? JSON.stringify(options.data) : undefined,
        error;

    if ('withCredentials' in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
        error = new Error('CORS not supported.');
        if ('function' === typeof options.error) {
            options.error(error);
        } else {
            throw error;
        }
    }

    // Firefox only sends cross-domain data as text - not as json
    // xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            if ('function' === typeof options.success) {
                options.success(JSON.parse(this.responseText));
            }
        } else {
            error = new Error(this);
            if ('function' === typeof options.error) {
                options.error(error);
            } else {
                throw error;
            }
        }
    };
    xhr.onerror = function (err) {
        if ('function' === typeof options.error) {
            options.error(err);
        } else {
            throw err;
        }
    };
    xhr.send(data);
};
