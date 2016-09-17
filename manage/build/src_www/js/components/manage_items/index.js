import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-items', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.items = ko.observableArray();

        this.getItems = () => {
            comm.getItems((data) => this.items(data));
        };
    },
});
