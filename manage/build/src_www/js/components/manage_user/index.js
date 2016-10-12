import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-user', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.dataStore = comm.storeGet(['userSelected', 'usersAvailable']);
        this.user = ko.pureComputed(() => {
            return this.dataStore.userSelected() || {};
        });
    },
});
