import ko from 'knockout';
import comm from '../../lib/communicator';
import valuesHandler from './../helpers/valuesHandler';

ko.components.register('manage-group', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.groupSelected = comm.storeGet('groupSelected');
        this.groupsAvailable = comm.storeGet('groupsAvailable');
        this.group = ko.pureComputed(() => {
            return this.groupSelected() || {};
        });

        this.loading = ko.observable(false);
        this.valuesHandler = valuesHandler({
            source: this.groupSelected,
            keys: ['group_name'],
        });

        this.save = () => {
            const selected = this.groupSelected();
            if (!selected) return;
            this.loading(true);
            // send changed data this.valuesHandler.getChanged() by ajax
            setTimeout(() => {
                // if the API accept our update, update our model
                this.valuesHandler.save();
                this.loading(false);
            }, 1000);
        };
        // this.groupSelected.valueHasMutated();
        window.debug_manage_group = this;
    },
});
