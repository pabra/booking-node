"use strict";

var domReady = require('./lib/domReady'),
    on = require('./lib/eventOn'),
    // ajax = require('./lib/ajax'),
    xhr = require('xhr');

domReady(function() {
    var win = window,
        doc = win.document,
        token  = sessionStorage.getItem('token'),
        loginForm = doc.querySelector('form[name=login]'),
        msgEl = loginForm.querySelector('span.msg'),
        mainEl = doc.querySelector('main'),
        headerEl = doc.querySelector('header');

    require('../css/main.css');

    if (!token) {
        on(loginForm, 'submit', function(ev) {
            ev.preventDefault();
            var emailEl = loginForm.elements.username,
                passEl = loginForm.elements.password;

            if (!emailEl.value || !passEl.value) {
                msgEl.textContent = 'email and password are needed';
                return false;
            }

            msgEl.textContent = '';

            xhr({
                method: 'post',
                url: 'http://localhost:3000/auth',
                data: JSON.stringify({email: emailEl.value, pass: passEl.value}),
                responseType: 'json',
                headers: {
                    // Firefox won't send cross domain data as type json
                    "Content-Type": "text/plain"
                }
            }, function (err, res, body) {
                if (err) {
                    win.console.log('err', err);
                    return;
                }
                win.console.log('res', res);
                win.console.log('body', body);
                if (body.token && body.uid) {
                    sessionStorage.setItem('token', body.token);
                    sessionStorage.setItem('uid', body.uid);
                    // remove the form to trigger Chrome to ask for saving password
                    loginForm.parentNode.removeChild(loginForm);
                    location.href += '';
                } else {
                    passEl.value = '';
                    msgEl.textContent = 'login failed';
                }
            });
        });
        win.console.log('show login form');
    } else {
        loginForm.parentNode.removeChild(loginForm);
        require(['./logged_in'], function(fn) {
            fn(mainEl, headerEl);
        });
    }
});
