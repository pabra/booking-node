import loginFn from './internal/loginFn';
import getItemsFn from './internal/getItemsFn';
import getProfileFn from './internal/getProfileFn';

const instance = (function () {
    // could hold private vars and functions here

    // return public API
    return {
        authenticated: () => !!sessionStorage.getItem('access_token'),
        logout: () => sessionStorage.removeItem('access_token'),
        login: loginFn,
        getItems: getItemsFn,
        getProfile: getProfileFn,
    };
})();


export default instance;
