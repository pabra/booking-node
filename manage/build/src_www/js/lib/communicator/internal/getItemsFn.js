import ajax from './ajax';

export default function (groupUid, callback) {
    if ('function' !== typeof callback) throw new TypeError('missing callback function');

    ajax({
        endpoint: `/items/${groupUid}`,
        method: 'get',
        callback: (data) => callback(data),
    });
}
