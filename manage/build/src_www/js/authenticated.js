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
    require('./components/main_navigation');

    headerElement.innerHTML = headHtml;
    containerElement.innerHTML = mainHtml;

    const MainModel = function () {
        const pages = [
            {name: 'items', id: 1},
            {name: 'user', id: 2},
            {name: 'company', id: 3},
            {name: 'logout', id: 0},
        ];

        comm.storeSetObject({
            tokenUserUid:       sessionStorage.getItem('access_token_uid'),
            tokenUserName:      sessionStorage.getItem('access_token_name'),
            pages:              ko.observableArray(pages),
            page:               ko.observable(pages[0]),
            usersAvailable:     ko.observableArray(),
            users:              {},
            userSelected:       ko.observable(),
            companiesAvailable: ko.observableArray(),
            companies:          {},
            companySelected:    ko.observable(),
        });

        this.dataStore = comm.storeGet([
            'page','pages',
            'tokenUserUid',
            'companies', 'companiesAvailable', 'companySelected',
            'users', 'usersAvailable', 'userSelected',
        ]);
        this.select_page = page => comm.pageSet(page.name);
        this.logout = () => {
            comm.logout();
            win.location.href += '';
        };

        if (this.dataStore.companiesAvailable.length === 0) {
            comm.getCompanies(data => {
                for (let company of data) {
                    this.dataStore.companiesAvailable.push(company.company_uid);
                    this.dataStore.companies[company.company_uid] = company;
                }
                if (this.dataStore.companySelected() === undefined && this.dataStore.companiesAvailable.length >= 0) {
                    this.dataStore.companySelected(this.dataStore.companiesAvailable()[0]);
                }
            });
        }

        if (this.dataStore.usersAvailable.length === 0) {
            comm.getUsers(data => {
                for (let user of data) {
                    this.dataStore.usersAvailable.push(user.user_uid);
                    this.dataStore.users[user.user_uid] = user;
                    if (user.user_uid === this.dataStore.tokenUserUid)
                        this.dataStore.userSelected(user.user_uid);
                }
            });
        }

    };

    ko.options.deferUpdates = true;
    const mainModel = new MainModel();
    ko.applyBindings(mainModel);
    win.debug_model = mainModel;
    win.debug_comm = comm;
    win.ko = ko;
};
