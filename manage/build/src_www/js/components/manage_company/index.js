import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-company', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.dataStore = comm.storeGet(['companySelected', 'companies', 'companiesAvailable']);
        this.selectedCompanyText = companyUid => {
            return companyUid in this.dataStore.companies ?
                   this.dataStore.companies[companyUid].company_name :
                   '';
        };
        this.company = ko.pureComputed(() => {
            const selected = this.dataStore.companySelected();
            return selected in this.dataStore.companies ?
                   this.dataStore.companies[selected] :
                   {};
        });
    },
});
