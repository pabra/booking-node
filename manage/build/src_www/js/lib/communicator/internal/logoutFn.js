export default function () {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token_type');
    sessionStorage.removeItem('user_uid');
    sessionStorage.removeItem('user_name');
}
