import xhr from 'xhr';
import errors from '../../errors';
import config from '../../../config_.js';

const ValueError = errors.ValueError;
const AjaxError = errors.AjaxError;
const host = `${config.apiHostProto}://${config.apiHostName}:${config.apiHostPort}`;
const win = window;

function ajax (params = {}) {
    if (!params.endpoint) throw new ValueError('missing "endpoint" in params');

    let data;
    try {
        data = JSON.stringify(params.data);
    } catch (err) {
        data = undefined;
    }

    const access_token = sessionStorage.getItem('access_token');
    const access_token_type = sessionStorage.getItem('access_token_type');
    const headers = {
        // Firefox won't send cross domain data as type json
        'Content-Type': 'text/plain',
        'Authorization': `${access_token_type} ${access_token}`,
    };

    if (params.headers) {
        Object.assign(headers, params.headers);
    }

    xhr({
        method: params.method || 'post',
        url: `${host}${params.endpoint}`,
        body: data,
        responseType: params.type || 'json',
        headers: headers,
    }, function (err, res, body) {
        if (err) {
            win.console.log('err', err);
            throw new AjaxError(err.message);
        }
        win.console.log('res', res);
        win.console.log('body', body);

        if ('function' === typeof params.callback) params.callback(body);
    });
}

export default ajax;
