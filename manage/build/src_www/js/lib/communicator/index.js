import loginFn from './internal/loginFn';
import logoutFn from './internal/logoutFn';
import isAuthenticatedFn from './internal/isAuthenticatedFn';
import getItemsFn from './internal/getItemsFn';
import getProfileFn from './internal/getProfileFn';

const instance = (function () {
    // could hold private vars and functions here

    // return public API
    return {
        isAuthenticated: isAuthenticatedFn,
        logout: logoutFn,
        login: loginFn,
        getItems: getItemsFn,
        getProfile: getProfileFn,
    };
})();


export default instance;
