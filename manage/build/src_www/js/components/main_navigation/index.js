import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('main-navigation', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.dataStore = comm.storeGet(['companySelected', 'tokenUserName']);
        this.goCompany = () => comm.pageSet('company');
        this.goUser = () => comm.pageSet('user');
        this.selectedCompanyText = ko.pureComputed(() => {
            return (this.dataStore.companySelected() || {}).company_name;
        });
    },
});
