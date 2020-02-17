let _ctx;

/**
 * 创建 canvas 实例
 * @param {String} id
 * @param {Number} width
 * @param {Number} height
 * @param {Number} dpr
 * @return {Canvas}
 */
export function createCanvas(id, width, height, dpr) {
    let canvas = document.createElement('canvas');
    
    if(width==null
        ||width==undefined
        ||height==null
        ||height==undefined){
        return canvas
    }

    // Canvas instance has no style attribute in nodejs.
    if (canvas.style) {
        canvas.style.position = 'absolute';
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.setAttribute('data-qr-dom-id', id);
    }

    if(dpr==null||dpr==undefined){
        return canvas
    }

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    return canvas;
}

export function getContext(param) {
    if (!_ctx) {
        // Use util.createCanvas instead of createCanvas
        // because createCanvas may be overwritten in different environment
        _ctx = createCanvas().getContext('2d');
    }
    return _ctx;
}
