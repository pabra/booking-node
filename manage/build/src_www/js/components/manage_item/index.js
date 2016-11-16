import ko from 'knockout';
import comm from '../../lib/communicator';
import valuesHandler from './../helpers/valuesHandler';

ko.components.register('manage-item', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.itemSelected = comm.storeGet('itemSelected');
        this.itemsAvailable = comm.storeGet('itemsAvailable');
        this.item = ko.pureComputed(() => {
            return this.itemSelected() || {};
        });

        this.loading = ko.observable(false);
        this.valuesHandler = valuesHandler({
            source: this.itemSelected,
            keys: ['item_name'],
        });

        this.save = () => {
            const selected = this.itemSelected();
            if (!selected) return;
            this.loading(true);
            // TODO: check permissions in selected.permissions
            const changedValues = this.valuesHandler.getChanged();
            window.console.log('changedValues', changedValues);
            comm.updateItem(selected.item_uid(), changedValues, data => {
                window.console.log('data', data);
                this.valuesHandler.save();
                this.loading(false);
            });
            // send changed data this.valuesHandler.getChanged() by ajax
            // setTimeout(() => {
            //     // if the API accept our update, update our model
            //     this.valuesHandler.save();
            //     this.loading(false);
            // }, 1000);
        };
        // this.itemSelected.valueHasMutated();
        window.debug_manage_item = this;
    },
});
