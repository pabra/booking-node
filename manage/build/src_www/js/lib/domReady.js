export default function (fn) {
    const doc = document;
    const documentReadyState = doc.readyState;

    if (documentReadyState !== 'loading') {
        fn();
    } else if (doc.addEventListener) {
        doc.addEventListener('DOMContentLoaded', fn);
    } else {
        doc.attachEvent('onreadystatechange', function () {
            if (documentReadyState !== 'loading') {
                fn();
            }
        });
    }
}
