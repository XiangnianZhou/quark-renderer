// FIXME
var _ctx;

export var createCanvas = function () {
    return document.createElement('canvas');
};

export function getContext(param) {
    if (!_ctx) {
        // Use util.createCanvas instead of createCanvas
        // because createCanvas may be overwritten in different environment
        _ctx = createCanvas().getContext('2d');
    }
    return _ctx;
}
