import errors from '../../errors';
import ajax from './ajax';

const ValueError = errors.ValueError;

export default function (callback) {
    if ('function' !== typeof callback) throw new ValueError('missing callback function');

    const formatData = function (data) {
        const groupedData = {};
        const nestedArrays = [];

        for (const row of data) {
            if (!(row.group_id in groupedData)) {
                groupedData[row.group_id] = {
                    data: row,
                    items: [],
                };
            }

            groupedData[row.group_id].items.push(row);
        }

        for (const k in groupedData) {
            if (!groupedData.hasOwnProperty(k)) continue;
            nestedArrays.push(groupedData[k]);
        }

        callback(nestedArrays);
    };

    ajax({
        endpoint: '/getItems',
        method: 'get',
        callback: (data) => formatData(data),
    });
}
