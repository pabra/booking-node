import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('main-navigation', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.companySelected = comm.storeGet('companySelected');
        this.userAuthenticated = comm.storeGet('userAuthenticated');
        this.goCompany = () => comm.pageSet('company');
        this.goUser = () => comm.pageSet('user');
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
    },
});
