import on from './lib/eventOn';
import domReady from './lib/domReady';
import comm from './lib/communicator';
import errors from './lib/errors';

const ValueError = errors.ValueError;
const AjaxError = errors.AjaxError;

domReady(function () {
    var win = window,
        doc = win.document,
        loginForm = doc.querySelector('form[name=login]'),
        msgEl = loginForm.querySelector('span.msg'),
        mainEl = doc.querySelector('main'),
        headerEl = doc.querySelector('header');

    require('../css/main.css');

    if (!comm.authenticated()) {
        on(loginForm, 'submit', function (ev) {
            ev.preventDefault();
            const emailEl = loginForm.elements.username;
            const passEl = loginForm.elements.password;

            msgEl.textContent = '';

            try {
                comm.login(emailEl.value, passEl.value, (data) => {
                    if (data && data.access_token) {
                        // remove the form to trigger Chrome to ask for saving password
                        loginForm.parentNode.removeChild(loginForm);
                        location.href += '';
                    } else {
                        msgEl.textContent = 'authentication failure';
                    }
                });
            } catch (err) {
                if (err instanceof ValueError || err instanceof AjaxError) {
                    msgEl.textContent = err.message;
                } else {
                    throw err;
                }
            }
            return undefined;
        });
        win.console.log('show login form');
    } else {
        loginForm.parentNode.removeChild(loginForm);
        require(['./authenticated'], (fn) => fn(mainEl, headerEl));
    }
});
