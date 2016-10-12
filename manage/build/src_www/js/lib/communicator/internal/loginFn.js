import errors from '../../errors';
import ajax from './ajax';

const ValueError = errors.ValueError;

export default function (email, pass, callback) {
    if (!email) throw new ValueError('missing email');
    if (!pass) throw new ValueError('missing pass');
    if ('function' !== typeof callback) throw new ValueError('missing callback function');

    ajax({
        endpoint: '/auth',
        method: 'get',
        // type: 'text',
        headers: {
            'Authorization': 'Basic ' + btoa(`${email}:${pass}`),
        },
        // data: {email, pass},
        callback: (data) => {
            if (data && data.access_token) {
                sessionStorage.setItem('access_token', data.access_token);
                sessionStorage.setItem('access_token_type', data.access_token_type);
                sessionStorage.setItem('access_token_uid', data.user_uid);
                sessionStorage.setItem('access_token_name', data.user_name);
            }
            callback(data);
        },
    });
}
