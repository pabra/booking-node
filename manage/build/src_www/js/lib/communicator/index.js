import ko from 'knockout';

import loginFn from './internal/loginFn';
import logoutFn from './internal/logoutFn';
import isAuthenticatedFn from './internal/isAuthenticatedFn';
import getItemsFn from './internal/getItemsFn';

import getCompaniesFn from './internal/getCompaniesFn';
import getUsersFn from './internal/getUsersFn';

const instance = (function () {
    // could hold private vars and functions here
    const store = {};
    const storeGetSingle = key => {
        if (!store.hasOwnProperty(key))
            throw new Error(`key not in store: ${key}`);
        return store[key];
    };
    const storeGetMultiple = keyArray => {
        const returnValue = {};
        let k;

        for (k of keyArray) {
            returnValue[k] = storeGetSingle(k);
        }

        return returnValue;
    };

    const storeGet = arg => {
        if (arg instanceof Array)
            return storeGetMultiple(arg);

        return storeGetSingle(arg);
    };

    const storeSet = (key, value) => {
        if (key in store)
            throw new Error(`will not overwrite existing key: ${key}`);

        store[key] = value;
    };

    const storeSetObject = (obj) => {
        let k;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                storeSet(k, obj[k]);
            }
        }
    };

    const pageSet = pageName => {
        if ('pages' in store && 'page' in store) {
            ko.utils.arrayForEach(store.pages(), (page) => {
                if (page.name === pageName) {
                    store.page(page);
                    return;
                }
            });
        }
    };

    // return public API
    return {
        storeGet:           storeGet,
        storeSet:           storeSet,
        storeSetObject:     storeSetObject,
        pageSet:            pageSet,
        isAuthenticated:    isAuthenticatedFn,
        logout:             logoutFn,
        login:              loginFn,
        getItems:           getItemsFn,
        getCompanies:       getCompaniesFn,
        getUsers:           getUsersFn,
    };
})();


export default instance;
