import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-items', {
    template: require('html!./template.html'),
    viewModel: function () {
        this.groups = ko.observable({});
        this.groupsAvailable = ko.observableArray();
        this.items = ko.observable({});

        this.getItems = () => {
            comm.getItems((data) => {
                ko.utils.arrayForEach(data, (v) => {
                    if (!(v.group_uid in this.groups())) {
                        this.groups()[v.group_uid] = {
                            group_uid: v.group_uid,
                            group_name: v.group_name,
                            itemsAvailable: ko.observableArray(),
                        };
                        this.groupsAvailable.push(v.group_uid);
                    }
                    this.groups()[v.group_uid].itemsAvailable.push(v.item_uid);
                    this.items()[v.item_uid] = {
                        item_uid: v.item_uid,
                        item_name: v.item_name,
                    };
                });
            });
        };
    },
});
