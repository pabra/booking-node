import ajax from './ajax';

export default function (companyUid, companyData, callback) {
    if ('function' !== typeof callback) throw new TypeError('missing callback function');

    const dataMap = {
        company_name: 'name',
    };

    const sendData = {};

    for (let x in companyData) {
        if (!companyData.hasOwnProperty(x)) continue;
        if (!dataMap.hasOwnProperty(x)) continue;
        sendData[dataMap[x]] = companyData[x];
    }

    ajax({
        endpoint: `/company/${companyUid}`,
        method: 'post',
        data: sendData,
        callback: (data) => callback(data),
    });
}
