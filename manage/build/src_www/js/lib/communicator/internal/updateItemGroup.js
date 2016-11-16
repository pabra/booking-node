import ajax from './ajax';

export default function (itemGroupUid, itemGroupData, callback) {
    if ('function' !== typeof callback) throw new TypeError('missing callback function');

    const dataMap = {
        group_name: 'name',
    };

    const sendData = {};

    for (let x in itemGroupData) {
        if (!itemGroupData.hasOwnProperty(x)) continue;
        if (!dataMap.hasOwnProperty(x)) continue;
        sendData[dataMap[x]] = itemGroupData[x];
    }

    ajax({
        endpoint: `/itemGroup/${itemGroupUid}`,
        method: 'post',
        data: sendData,
        callback: (data) => callback(data),
    });
}
