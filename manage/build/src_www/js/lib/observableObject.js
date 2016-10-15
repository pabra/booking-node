import ko from 'knockout';

export default function (obj) {
    const newObj = {};

    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (typeof obj[key] !== 'string') throw new Error('object should only have string properties');
        newObj[key] = ko.observable(obj[key]);
    }

    return newObj;
}
