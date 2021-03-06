import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('main-navigation', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.companySelected = comm.storeGet('companySelected');
        this.userAuthenticated = comm.storeGet('userAuthenticated');
        this.groupSelected = comm.storeGet('groupSelected');
        this.itemSelected = comm.storeGet('itemSelected');
        this.goCompany = () => comm.pageSet('company');
        this.goUser = () => comm.pageSet('user');
        this.goGroup = () => comm.pageSet('group');
        this.goItem = () => comm.pageSet('item');
        this.authenticatedUserName = ko.pureComputed(() => {
            const selected = this.userAuthenticated();
            return selected ?
                   selected.user_name() :
                   '';
        });
        this.selectedCompanyText = ko.pureComputed(() => {
            const selected = this.companySelected();
            return selected ?
                   selected.company_name() :
                   '';
        });
        this.selectedGroupText = ko.pureComputed(() => {
            const selected = this.groupSelected();
            return selected ?
                   selected.group_name() :
                   '';
        });
        this.selectedItemText = ko.pureComputed(() => {
            const selected = this.itemSelected();
            return selected ?
                   selected.item_name() :
                   '';
        });
    },
});
