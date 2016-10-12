import loginFn from './internal/loginFn';
import logoutFn from './internal/logoutFn';
import isAuthenticatedFn from './internal/isAuthenticatedFn';
import getItemsFn from './internal/getItemsFn';

import getCompaniesFn from './internal/getCompaniesFn';
import getUsersFn from './internal/getUsersFn';

const instance = (function () {
    // could hold private vars and functions here

    // return public API
    return {
        isAuthenticated:    isAuthenticatedFn,
        logout:             logoutFn,
        login:              loginFn,
        getItems:           getItemsFn,
        getCompanies:       getCompaniesFn,
        getUsers:           getUsersFn,
    };
})();


export default instance;
