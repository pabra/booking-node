import ko from 'knockout';
import comm from './lib/communicator';

module.exports = function (containerElement, headerElement) {
    const win = window;
    const mainHtml = require('html!../templates/authenticated_body.html');
    const headHtml = require('html!../templates/authenticated_header.html');

    require('../css/authenticated.css');
    require('./components/manage_items');
    require('./components/manage_user');
    require('./components/manage_company');

    headerElement.innerHTML = headHtml;
    containerElement.innerHTML = mainHtml;

    const MainModel = function () {
        const pages = [
            {name: 'items', id: 1},
            {name: 'user', id: 2},
            {name: 'company', id: 3},
            {name: 'logout', id: 0},
        ];

        this.pages = ko.observableArray(pages);
        this.page = ko.observable(pages[0]);

        this.select_page = (page) => this.page(page);
        this.logout = () => {
            comm.logout();
            win.location.href += '';
        };
    };

    ko.options.deferUpdates = true;
    const mainModel = new MainModel();
    ko.applyBindings(mainModel);
    win.debug_model = mainModel;
    win.ko = ko;
};
