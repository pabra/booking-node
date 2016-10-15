import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-user', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.userSelected = comm.storeGet('userSelected');
        this.usersAvailable = comm.storeGet('usersAvailable');
        this.user = ko.pureComputed(() => {
            return this.userSelected() || {};
        });
        this.newName = ko.observable();
        this.newEmail = ko.observable();
        this.newPass = ko.observable();
        this.loading = ko.observable(false);
        this.hasChanged = ko.pureComputed(() => {
            const selected = this.userSelected();
            return (selected
                    && (selected.user_name() !== this.newName()
                        || selected.user_email() !== this.newEmail()
                        || selected.user_password() !== this.newPass()));
        });

        this.userSelected.subscribe(newUser => {
            this.newName(newUser.user_name());
            this.newEmail(newUser.user_email());
            this.newPass(newUser.user_password());
        });

        this.reset = () => {
            const selected = this.userSelected();
            if (!selected) return;
            this.newName(selected.user_name());
            this.newEmail(selected.user_email());
            this.newPass(selected.user_password());
        };

        this.save = () => {
            const selected = this.userSelected();
            if (!selected) return;
            this.loading(true);
            setTimeout(() => {
                selected.user_name(this.newName());
                selected.user_email(this.newEmail());
                selected.user_password(this.newPass());
                this.loading(false);
            }, 1000);
        };
        this.userSelected.valueHasMutated();
    },
});
