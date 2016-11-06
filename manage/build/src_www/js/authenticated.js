import ko from 'knockout';
import comm from './lib/communicator';
import observableObject from './lib/observableObject';

module.exports = function (containerElement, headerElement) {
    const win = window;
    const mainHtml = require('html!../templates/authenticated_body.html');
    const headHtml = require('html!../templates/authenticated_header.html');

    require('../css/authenticated.css');
    require('./components/manage_user');
    require('./components/manage_company');
    require('./components/manage_group');
    require('./components/manage_item');
    require('./components/main_navigation');

    headerElement.innerHTML = headHtml;
    containerElement.innerHTML = mainHtml;

    const MainModel = function () {
        const fn = {};
        const pages = [
            {name: 'item', id: 1},
            {name: 'user', id: 2},
            {name: 'company', id: 3},
            {name: 'group', id: 4},
            {name: 'logout', id: 0},
        ];

        comm.storeSetObject({
            tokenUserUid:       sessionStorage.getItem('access_token_uid'),
            tokenUserName:      sessionStorage.getItem('access_token_name'),
            pages:              ko.observableArray(pages),
            page:               ko.observable(pages[0]),
            usersAvailable:     ko.observableArray(),
            userSelected:       ko.observable(),
            userAuthenticated:  ko.observable(),
            companiesAvailable: ko.observableArray(),
            companySelected:    ko.observable(),
            groupsAvailable:    ko.observableArray(),
            groupSelected:      ko.observable(),
            itemsAvailable:     ko.observableArray(),
            itemSelected:       ko.observable(),
        });

        this.dataStore = comm.storeGet([
            'page','pages',
            'tokenUserUid',
            'usersAvailable', 'userSelected', 'userAuthenticated',
            'companiesAvailable', 'companySelected',
            'groupsAvailable', 'groupSelected',
            'itemsAvailable', 'itemSelected',
        ]);
        this.select_page = page => comm.pageSet(page.name);
        this.logout = () => {
            comm.logout();
            win.location.href += '';
        };

        this.dataStore.companySelected.subscribe(newComp => {
            fn.loadGroups();
        });

        this.dataStore.groupSelected.subscribe(newGroup => {
            fn.loadItems();
        });

        fn.loadCompanies = () => {
            comm.getCompanies(data => {
                for (let company of data) {
                    this.dataStore.companiesAvailable.push(observableObject(company));
                }
                if (this.dataStore.companySelected() === undefined && this.dataStore.companiesAvailable().length > 0) {
                    this.dataStore.companySelected(this.dataStore.companiesAvailable()[0]);
                }
            });
        };

        fn.loadUsers = () => {
            comm.getUsers(data => {
                for (let user of data) {
                    let observableUser = observableObject(user);
                    this.dataStore.usersAvailable.push(observableUser);
                    if (user.user_uid === this.dataStore.tokenUserUid) {
                        this.dataStore.userSelected(observableUser);
                        this.dataStore.userAuthenticated(observableUser);
                    }
                }
            });
        };

        fn.loadGroups = () => {
            this.dataStore.groupSelected(undefined);
            const company = this.dataStore.companySelected();
            if (!company || !ko.isObservable(company.company_uid) || !company.company_uid()) {
                return;
            }

            comm.getGroups(company.company_uid(), data => {
                this.dataStore.groupsAvailable([]);
                for (let group of data) {
                    this.dataStore.groupsAvailable.push(observableObject(group));
                }
                if (this.dataStore.groupsAvailable().length > 0) {
                    this.dataStore.groupSelected(this.dataStore.groupsAvailable()[0]);
                }
            });
        };

        fn.loadItems = () => {
            this.dataStore.itemSelected(undefined);
            const group = this.dataStore.groupSelected();
            if (!group || !ko.isObservable(group.group_uid) || !group.group_uid()) {
                return;
            }

            comm.getItems(group.group_uid(), data => {
                this.dataStore.itemsAvailable([]);
                for (let item of data) {
                    this.dataStore.itemsAvailable.push(observableObject(item));
                }
                if (this.dataStore.itemsAvailable().length > 0) {
                    this.dataStore.itemSelected(this.dataStore.itemsAvailable()[0]);
                }
            });
        };

        fn.loadCompanies();
        fn.loadUsers();
    };

    ko.options.deferUpdates = true;
    const mainModel = new MainModel();
    ko.applyBindings(mainModel);
    win.debug_model = mainModel;
    win.debug_comm = comm;
    win.ko = ko;
};
