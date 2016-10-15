import ko from 'knockout';
import comm from '../../lib/communicator';
import valuesHandler from './../helpers/valuesHandler';

ko.components.register('manage-company', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.companySelected = comm.storeGet('companySelected');
        this.companiesAvailable = comm.storeGet('companiesAvailable');
        this.company = ko.pureComputed(() => {
            return this.companySelected() || {};
        });

        this.loading = ko.observable(false);
        this.valuesHandler = valuesHandler({
            source: this.companySelected,
            keys: ['company_name'],
        });

        this.save = () => {
            const selected = this.companySelected();
            if (!selected) return;
            this.loading(true);
            // send changed data this.valuesHandler.getChanged() by ajax
            setTimeout(() => {
                // if the API accept our update, update our model
                this.valuesHandler.save();
                this.loading(false);
            }, 1000);
        };
        // this.companySelected.valueHasMutated();
        window.debug_manage_company = this;
    },
});
