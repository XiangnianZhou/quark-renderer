import env from '../core/env';

let urn = 'urn:schemas-microsoft-com:vml';
let win = typeof window === 'undefined' ? null : window;
let vmlInited = false;

export let doc = win && win.document;

// Avoid assign to an exported variable, for transforming to cjs.
let doCreateNode;

if (doc && !env.canvasSupported) {
    try {
        !doc.namespaces.zrvml && doc.namespaces.add('zrvml', urn);
        doCreateNode = function (tagName) {
            return doc.createElement('<zrvml:' + tagName + ' class="zrvml">');
        };
    }catch (e) {
        doCreateNode = function (tagName) {
            return doc.createElement('<' + tagName + ' xmlns="' + urn + '" class="zrvml">');
        };
    }
}

// From raphael
export function initVML() {
    if (vmlInited || !doc) {
        return;
    }
    vmlInited = true;

    let styleSheets = doc.styleSheets;
    if (styleSheets.length < 31) {
        doc.createStyleSheet().addRule('.zrvml', 'behavior:url(#default#VML)');
    }else {
        // http://msdn.microsoft.com/en-us/library/ms531194%28VS.85%29.aspx
        styleSheets[0].addRule('.zrvml', 'behavior:url(#default#VML)');
    }
}

export function createNode(tagName) {
    return doCreateNode(tagName);
}