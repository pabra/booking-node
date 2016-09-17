import ko from 'knockout';
import comm from '../../lib/communicator';

ko.components.register('manage-profile', {
    template: require('html!./template.html'),
    viewModel: function () {
        const fn = {};

        this.profile = ko.observableArray();

        fn.formatData = (data) => {
            const arr = [];
            ko.utils.objectForEach(data, (key, value) => {
                arr.push({key, value});
            });
            return arr;
        };

        comm.getProfile((data) => this.profile(fn.formatData(data)));
    },
});
