import ajax from './ajax';

export default function (itemUid, itemData, callback) {
    if ('function' !== typeof callback) throw new TypeError('missing callback function');

    const dataMap = {
        item_name: 'name',
    };

    const sendData = {};

    for (let x in itemData) {
        if (!itemData.hasOwnProperty(x)) continue;
        if (!dataMap.hasOwnProperty(x)) continue;
        sendData[dataMap[x]] = itemData[x];
    }

    ajax({
        endpoint: `/item/${itemUid}`,
        method: 'post',
        data: sendData,
        callback: (data) => callback(data),
    });
}
