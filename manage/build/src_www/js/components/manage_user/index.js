import ko from 'knockout';
import comm from '../../lib/communicator';
import valuesHandler from './../helpers/valuesHandler';

ko.components.register('manage-user', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.userSelected = comm.storeGet('userSelected');
        this.usersAvailable = comm.storeGet('usersAvailable');
        this.user = ko.pureComputed(() => {
            return this.userSelected() || {};
        });

        this.loading = ko.observable(false);
        this.valuesHandler = valuesHandler({
            source: this.userSelected,
            keys: ['user_name', 'user_email', 'user_password'],
        });

        this.save = () => {
            const selected = this.userSelected();
            if (!selected) return;
            this.loading(true);
            // send changed data this.valuesHandler.getChanged() by ajax
            setTimeout(() => {
                // if the API accept our update, update our model
                this.valuesHandler.save();
                this.loading(false);
            }, 1000);
        };
        // this.userSelected.valueHasMutated();
        window.debug_manage_user = this;
    },
});
