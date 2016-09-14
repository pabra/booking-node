"use strict";

module.exports = function (containerElement, headerElement) {
    var win = window,
        ko = require('knockout'),
        ItemsModel = require('../modules/manage_items'),
        mainHtml = require('html!../templates/logged_in.html'),
        headHtml = require('html!../templates/header.html'),
        MainModel, mainModel;

    require('../css/logged_in.css');

    headerElement.innerHTML = headHtml;
    containerElement.innerHTML = mainHtml;

    MainModel = function () {
        var self = this,
            pages = [
                {name: 'items', id: 1},
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

        self.itemsModel = new ItemsModel({
            tokenObservable: self.token,
            containerElement: containerElement.querySelector('section[data-name=items]'),
            modelName: 'itemsModel'
        });

    };

    ko.options.deferUpdates = true;
    mainModel = new MainModel();
    ko.applyBindings(mainModel);
    win['debug_model'] = mainModel;
};
