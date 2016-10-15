import ko from 'knockout';

export default function (args) {
    const handler = {
        values: {},
    };

    handler.changed = ko.pureComputed(() => {
        let anyChange = false;
        if (!args.source()) return anyChange;

        for (let x of args.keys) {
            if (handler.values[x]() !== args.source()[x]()) {
                anyChange = true;
                break;
            }
        }

        return anyChange;
    });

    handler.getChanged = () => {
        const changed = {};
        if (!args.source()) return changed;

        for (let x of args.keys) {
            if (handler.values[x]() !== args.source()[x]()) {
                changed[x] = handler.values[x]();
            }
        }

        return changed;
    };

    handler.reset = () => {
        const changed = handler.getChanged();
        for (let k in changed) {
            if (!changed.hasOwnProperty(k)) continue;
            handler.values[k](args.source()[k]());
        }
    };

    handler.save = () => {
        const changed = handler.getChanged();
        for (let k in changed) {
            if (!changed.hasOwnProperty(k)) continue;
            args.source()[k](changed[k]);
        }
    };

    const getSourceVal = (key) => {
        return args.source() ?
        args.source()[key]() :
        undefined;
    };

    const init = () => {
        for (let x of args.keys) {
            handler.values[x] = ko.observable(getSourceVal(x));
        }
    };

    const refresh = () => {
        for (let x of args.keys) {
            handler.values[x](getSourceVal(x));
        }
    };

    init();

    args.source.subscribe(refresh);

    return handler;
}
