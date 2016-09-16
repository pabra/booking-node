"use strict";

var xhr = require('xhr'),
    ko = require('knockout'),
    win = window;

ko.components.register('manage-items', {
    template: require('html!./template.html'),
    viewModel: function (params) {
        var self = this,
            groupItems;

        if (!params.tokenObservable) throw new Error('missing "tokenObservable" in params');

        self.items = ko.observableArray();

        self.getItems = function () {
            xhr({
                method: 'post',
                url: 'http://localhost:3000/getItems',
                data: JSON.stringify({token: params.tokenObservable()}),
                responseType: 'json',
                headers: {
                    // Firefox won't send cross domain data as type json
                    "Content-Type": "text/plain"
                }
            }, function (err, res, body) {
                if (err) {
                    win.console.log('err', err);
                    return;
                }
                win.console.log('body', body);
                self.items(groupItems(body));
            });
        };

        groupItems = function (items) {
            var grouped = {},
                asArray = [];

            ko.utils.arrayForEach(items, function (row) {
                if (!grouped.hasOwnProperty(row.group_uid)) {
                    grouped[row.group_uid] = {
                        items: [],
                        data: row
                    };
                }
                grouped[row.group_uid].items.push(row);
            });

            ko.utils.objectForEach(grouped, function (k, v) {
                asArray.push(v);
            });

            return asArray;
        };
    }
});
