import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-user', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.dataStore = comm.storeGet(['userSelected', 'users', 'usersAvailable']);
        this.selectedUserText = userUid => {
            return userUid in this.dataStore.users ?
                   this.dataStore.users[userUid].user_name :
                   '';
        };
        this.user = ko.pureComputed(() => {
            const selected = this.dataStore.userSelected();
            return selected in this.dataStore.users ?
                   this.dataStore.users[selected] :
                   {};
        });
    },
});
