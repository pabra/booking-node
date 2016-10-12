import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('main-navigation', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.dataStore = comm.storeGet(['companySelected', 'companies', 'tokenUserName']);
        this.goCompany = () => comm.pageSet('company');
        this.goUser = () => comm.pageSet('user');
        this.selectedCompanyText = ko.pureComputed(() => {
            const selected = this.dataStore.companySelected();
            return selected in this.dataStore.companies ?
                   this.dataStore.companies[selected].company_name :
                   '';
        });
    },
});
