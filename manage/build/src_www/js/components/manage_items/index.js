import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-items', {
    template: require('html!./template.html'),
    viewModel: function (params) {
        if (!params.tokenObservable) throw new Error('missing "tokenObservable" in params');

        this.items = ko.observableArray();

        this.getItems = () => {
            comm.getItems((data) => this.items(data));
        };
    },
});
