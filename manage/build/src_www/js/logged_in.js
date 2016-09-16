import ko from 'knockout';

module.exports = function (containerElement, headerElement) {
    const win = window;
    const mainHtml = require('html!../templates/logged_in.html');
    const headHtml = require('html!../templates/header.html');

    require('../css/logged_in.css');
    require('./components/manage_items');

    headerElement.innerHTML = headHtml;
    containerElement.innerHTML = mainHtml;

    const MainModel = function () {
        const pages = [
            {name: 'items', id: 1},
            {name: 'member area 2', id: 2},
            {name: 'logout', id: 0},
        ];

        this.pages = ko.observableArray(pages);
        this.page = ko.observable(pages[0]);
        this.token = ko.observable(sessionStorage.getItem('token'));
        this.uid = sessionStorage.getItem('uid');

        this.token.subscribe((newVal) => {
            const current = sessionStorage.getItem('token');

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

        this.select_page = page => this.page(page);
        this.logout = () => this.token(undefined);
    };

    ko.options.deferUpdates = true;
    const mainModel = new MainModel();
    ko.applyBindings(mainModel);
    win.debug_model = mainModel;
    win.ko = ko;
};
