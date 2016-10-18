import ajax from './ajax';

export default function (companyUid, callback) {
    if ('function' !== typeof callback) throw new TypeError('missing callback function');

    ajax({
        endpoint: `/groups/${companyUid}`,
        method: 'get',
        callback: (data) => callback(data),
    });
}
