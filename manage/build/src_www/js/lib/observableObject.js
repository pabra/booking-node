import ko from 'knockout';

const convert = function (obj) {
    const newObj = {};

    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        else if (obj[key] instanceof Array) newObj[key] = ko.observableArray(obj[key]);
        else if (obj[key] instanceof Object) newObj[key] = convert(obj[key]);
        else if (['string', 'number', 'boolean'].indexOf(typeof obj[key]) === -1) throw new Error('object should only have string, number or boolean properties');
        else newObj[key] = ko.observable(obj[key]);
    }

    return newObj;
};

export default convert;
