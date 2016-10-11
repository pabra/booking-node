import loginFn from './internal/loginFn';
import isAuthenticatedFn from './internal/isAuthenticatedFn';

/**
 * communicator light
 *
 * provides only API with stuff used to login
 */
const instance = (function () {
    // could hold private vars and functions here

    // return public API
    return {
        isAuthenticated: isAuthenticatedFn,
        login: loginFn,
    };
})();


export default instance;
