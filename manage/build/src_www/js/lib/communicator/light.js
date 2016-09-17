import loginFn from './internal/loginFn';

/**
 * communicator light
 *
 * provides only API with stuff used to login
 */
const instance = (function () {
    // could hold private vars and functions here

    // return public API
    return {
        authenticated: () => !!sessionStorage.getItem('access_token'),
        login: loginFn,
    };
})();


export default instance;
