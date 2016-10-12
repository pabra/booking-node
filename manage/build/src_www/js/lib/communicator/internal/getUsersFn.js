import ajax from './ajax';

export default function (callback) {
    if ('function' !== typeof callback) throw new TypeError('missing callback function');

    ajax({
        endpoint: '/users',
        method: 'get',
        callback: (data) => callback(data),
    });
}
