import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-company', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.companySelected = comm.storeGet('companySelected');
        this.companiesAvailable = comm.storeGet('companiesAvailable');
        this.company = ko.pureComputed(() => {
            return this.companySelected() || {};
        });
        this.newName = ko.observable();
        this.loading = ko.observable(false);
        this.hasChanged = ko.pureComputed(() => {
            const selected = this.companySelected();
            return selected ?
                   selected.company_name() !== this.newName() :
                   false;
        });

        this.companySelected.subscribe(newCompany => {
            this.newName(newCompany.company_name());
        });

        this.reset = () => {
            this.newName(this.company().company_name());
        };

        this.save = () => {
            const selected = this.companySelected();
            if (!selected) return;
            this.loading(true);
            setTimeout(() => {
                selected.company_name(this.newName());
                this.loading(false);
            }, 1000);
        };
        this.companySelected.valueHasMutated();
    },
});
