import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-company', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.dataStore = comm.storeGet(['companySelected', 'companiesAvailable']);
        this.company = ko.pureComputed(() => {
            return this.dataStore.companySelected() || {};
        });
    },
});
