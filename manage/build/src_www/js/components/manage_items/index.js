import xhr from 'xhr';
import ko from 'knockout';

ko.components.register('manage-items', {
    template: require('html!./template.html'),
    viewModel: function (params) {
        const win = window;

        if (!params.tokenObservable) throw new Error('missing "tokenObservable" in params');

        this.items = ko.observableArray();

        this.getItems = () => {
            xhr({
                method: 'post',
                url: 'http://localhost:3000/getItems',
                data: JSON.stringify({token: params.tokenObservable()}),
                responseType: 'json',
                headers: {
                    // Firefox won't send cross domain data as type json
                    'Content-Type': 'text/plain',
                },
            }, (err, res, body) => {
                if (err) {
                    win.console.log('err', err);
                    return;
                }
                win.console.log('body', body);
                this.items(groupItems(body));
            });
        };

        let groupItems = (items) => {
            let grouped = {};
            let asArray = [];

            ko.utils.arrayForEach(items, (row) => {
                if (!grouped.hasOwnProperty(row.group_uid)) {
                    grouped[row.group_uid] = {
                        items: [],
                        data: row,
                    };
                }
                grouped[row.group_uid].items.push(row);
            });

            ko.utils.objectForEach(grouped, (k, v) => {
                asArray.push(v);
            });

            return asArray;
        };
    },
});
