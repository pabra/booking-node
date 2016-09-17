import errors from '../../errors';
import ajax from './ajax';

const ValueError = errors.ValueError;

export default function (callback) {
    if ('function' !== typeof callback) throw new ValueError('missing callback function');

    ajax({
        endpoint: '/getProfile',
        method: 'get',
        callback: (data) => callback(data),
    });
}
