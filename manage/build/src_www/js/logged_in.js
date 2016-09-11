"use strict";

module.exports = function (containerElement, headerElement) {
    var win = window,
        doc = win.document,
        ko = require('knockout'),
        mainHtml = require('html!../templates/logged_in.html'),
        headHtml = require('html!../templates/header.html'),
        Model, model;

    require('../css/logged_in.css');

    headerElement.innerHTML = headHtml;
    containerElement.innerHTML = mainHtml;

    Model = function () {
        var self = this,
            pages = [
                {name: 'member area 1', id: 1},
                {name: 'member area 2', id: 2},
                {name: 'logout', id: 0}
            ];

        self.pages = ko.observableArray(pages);
        self.page = ko.observable(pages[0]);
        self.token = ko.observable(sessionStorage.getItem('token'));
        self.uid = sessionStorage.getItem('uid');

        self.token.subscribe(function (newVal) {
            var current = sessionStorage.getItem('token');

            if (newVal === undefined) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('uid');
                location.href += '';
                return;
            }

            if (newVal !== current) {
                sessionStorage.setItem('token', newVal);
            }
        });

        self.select_page = function(page) {
            self.page(page);
        };

        self.logout = function () {
            self.token(undefined);
        };
    };

    ko.options.deferUpdates = true;
    model = new Model();
    ko.applyBindings(model);
    win['debug_model'] = model;
};
