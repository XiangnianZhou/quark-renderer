import {createElement} from './core';
import * as dataUtil from '../core/utils/dataStructureUtil';
import Path from '../graphic/Path';
import ZImage from '../graphic/Image';
import ZText from '../graphic/Text';
import arrayDiff from '../core/utils/arrayDiff2';
import GradientManager from './helper/GradientManager';
import ClippathManager from './helper/ClippathManager';
import ShadowManager from './helper/ShadowManager';
import {
    path as svgPath,
    image as svgImage,
    text as svgText
} from './graphic';

/**
 * @class zrender.svg.SVGPainter
 * 
 * SVG 画笔。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

function getSvgProxy(el) {
    if (el instanceof Path) {
        return svgPath;
    }else if (el instanceof ZImage) {
        return svgImage;
    }else if (el instanceof ZText) {
        return svgText;
    }
    return svgPath;
}

function checkParentAvailable(parent, child) {
    return child && parent && child.parentNode !== parent;
}

function insertAfter(parent, child, prevSibling) {
    if (checkParentAvailable(parent, child) && prevSibling) {
        let nextSibling = prevSibling.nextSibling;
        nextSibling ? parent.insertBefore(child, nextSibling)
            : parent.appendChild(child);
    }
}

function prepend(parent, child) {
    if (checkParentAvailable(parent, child)) {
        let firstChild = parent.firstChild;
        firstChild ? parent.insertBefore(child, firstChild)
            : parent.appendChild(child);
    }
}

function remove(parent, child) {
    if (child && parent && child.parentNode === parent) {
        parent.removeChild(child);
    }
}

function getTextSvgElement(displayable) {
    return displayable.__textSvgEl;
}

function getSvgElement(displayable) {
    return displayable.__svgEl;
}

/**
 * @method constructor SVGPainter
 * @param {HTMLElement} root 绘图容器
 * @param {Storage} storage
 * @param {Object} opts
 */
let SVGPainter = function (root, storage, opts, zrId) {
    this.root = root;
    this.storage = storage;
    this._opts = opts = dataUtil.extend({}, opts || {});
    let svgRoot = createElement('svg');
    
    svgRoot.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgRoot.setAttribute('version', '1.1');
    svgRoot.setAttribute('baseProfile', 'full');
    svgRoot.style.cssText = 'user-select:none;position:absolute;left:0;top:0;';

    this.gradientManager = new GradientManager(zrId, svgRoot);
    this.clipPathManager = new ClippathManager(zrId, svgRoot);
    this.shadowManager = new ShadowManager(zrId, svgRoot);

    let viewport = document.createElement('div');
    viewport.style.cssText = 'overflow:hidden;position:relative';

    this._svgRoot = svgRoot;
    this._viewport = viewport;

    root.appendChild(viewport);
    viewport.appendChild(svgRoot);

    this.resize(opts.width, opts.height);

    this._visibleList = [];
};

SVGPainter.prototype = {

    constructor: SVGPainter,

    /**
     * @method getType
     */
    getType: function () {
        return 'svg';
    },

    /**
     * @method getViewportRoot
     */
    getViewportRoot: function () {
        return this._viewport;
    },

    /**
     * @method getViewportRootOffset
     */
    getViewportRootOffset: function () {
        let viewportRoot = this.getViewportRoot();
        if (viewportRoot) {
            return {
                offsetLeft: viewportRoot.offsetLeft || 0,
                offsetTop: viewportRoot.offsetTop || 0
            };
        }
    },

    /**
     * @method refresh
     */
    refresh: function () {

        let list = this.storage.getDisplayList(true);

        this._paintList(list);
    },

    /**
     * @method setBackgroundColor
     */
    setBackgroundColor: function (backgroundColor) {
        // TODO gradient
        this._viewport.style.background = backgroundColor;
    },

    /**
     * @private
     * @method _paintList
     */
    _paintList: function (list) {
        this.gradientManager.markAllUnused();
        this.clipPathManager.markAllUnused();
        this.shadowManager.markAllUnused();

        let svgRoot = this._svgRoot;
        let visibleList = this._visibleList;
        let listLen = list.length;

        let newVisibleList = [];
        let i;
        let svgElement;
        let textSvgElement;
        for (i = 0; i < listLen; i++) {
            let displayable = list[i];
            let svgProxy = getSvgProxy(displayable);
            svgElement = getSvgElement(displayable)
                || getTextSvgElement(displayable);
            if (!displayable.invisible) {
                if (displayable.__dirty) {
                    svgProxy && svgProxy.brush(displayable);

                    // Update clipPath
                    this.clipPathManager.update(displayable);

                    // Update gradient and shadow
                    if (displayable.style) {
                        this.gradientManager.update(displayable.style.fill);
                        this.gradientManager.update(displayable.style.stroke);
                        this.shadowManager.update(svgElement, displayable);
                    }

                    displayable.__dirty = false;
                }
                newVisibleList.push(displayable);
            }
        }

        let diff = arrayDiff(visibleList, newVisibleList);
        let prevSvgElement;

        // First do remove, in case element moved to the head and do remove
        // after add
        for (i = 0; i < diff.length; i++) {
            let item = diff[i];
            if (item.removed) {
                for (let k = 0; k < item.count; k++) {
                    let displayable = visibleList[item.indices[k]];
                    svgElement = getSvgElement(displayable);
                    textSvgElement = getTextSvgElement(displayable);
                    remove(svgRoot, svgElement);
                    remove(svgRoot, textSvgElement);
                }
            }
        }
        for (i = 0; i < diff.length; i++) {
            let item = diff[i];
            if (item.added) {
                for (let k = 0; k < item.count; k++) {
                    let displayable = newVisibleList[item.indices[k]];
                    svgElement = getSvgElement(displayable);
                    textSvgElement = getTextSvgElement(displayable);
                    prevSvgElement
                        ? insertAfter(svgRoot, svgElement, prevSvgElement)
                        : prepend(svgRoot, svgElement);
                    if (svgElement) {
                        insertAfter(svgRoot, textSvgElement, svgElement);
                    }else if (prevSvgElement) {
                        insertAfter(svgRoot, textSvgElement, prevSvgElement);
                    }else {
                        prepend(svgRoot, textSvgElement);
                    }
                    // Insert text
                    insertAfter(svgRoot, textSvgElement, svgElement);
                    prevSvgElement = textSvgElement || svgElement
                        || prevSvgElement;

                    // zrender.Text only create textSvgElement.
                    this.gradientManager.addWithoutUpdate(svgElement || textSvgElement, displayable);
                    this.shadowManager.addWithoutUpdate(svgElement || textSvgElement, displayable);
                    this.clipPathManager.markUsed(displayable);
                }
            }else if (!item.removed) {
                for (let k = 0; k < item.count; k++) {
                    let displayable = newVisibleList[item.indices[k]];
                    svgElement = getSvgElement(displayable);
                    textSvgElement = getTextSvgElement(displayable);

                    svgElement = getSvgElement(displayable);
                    textSvgElement = getTextSvgElement(displayable);

                    this.gradientManager.markUsed(displayable);
                    this.gradientManager.addWithoutUpdate(svgElement || textSvgElement, displayable);

                    this.shadowManager.markUsed(displayable);
                    this.shadowManager.addWithoutUpdate(svgElement || textSvgElement, displayable);

                    this.clipPathManager.markUsed(displayable);

                    if (textSvgElement) { // Insert text.
                        insertAfter(svgRoot, textSvgElement, svgElement);
                    }
                    prevSvgElement = svgElement || textSvgElement || prevSvgElement;
                }
            }
        }

        this.gradientManager.removeUnused();
        this.clipPathManager.removeUnused();
        this.shadowManager.removeUnused();

        this._visibleList = newVisibleList;
    },

    /**
     * @private
     * @method _paintList
     */
    _getDefs: function (isForceCreating) {
        let svgRoot = this._svgRoot;
        let defs = this._svgRoot.getElementsByTagName('defs');
        if(defs.length!==0){
            return defs[0];
        }
        
        // Not exist
        if(!isForceCreating){
            return null;
        }
        defs = svgRoot.insertBefore(
            createElement('defs'), // Create new tag
            svgRoot.firstChild // Insert in the front of svg
        );
        if (!defs.contains) {
            // IE doesn't support contains method
            defs.contains = function (el) {
                let children = defs.children;
                if (!children) {
                    return false;
                }
                for (let i = children.length - 1; i >= 0; --i) {
                    if (children[i] === el) {
                        return true;
                    }
                }
                return false;
            };
        }
        return defs;
    },

    /**
     * @method resize
     */
    resize: function (width, height) {
        let viewport = this._viewport;
        // FIXME Why ?
        viewport.style.display = 'none';

        // Save input w/h
        let opts = this._opts;
        width != null && (opts.width = width);
        height != null && (opts.height = height);

        width = this._getSize(0);
        height = this._getSize(1);

        viewport.style.display = '';

        if (this._width !== width || this._height !== height) {
            this._width = width;
            this._height = height;

            let viewportStyle = viewport.style;
            viewportStyle.width = width + 'px';
            viewportStyle.height = height + 'px';

            let svgRoot = this._svgRoot;
            // Set width by 'svgRoot.width = width' is invalid
            svgRoot.setAttribute('width', width);
            svgRoot.setAttribute('height', height);
        }
    },

    /**
     * @method getWidth
     * 获取绘图区域宽度
     */
    getWidth: function () {
        return this._width;
    },

    /**
     * @method getHeight
     * 获取绘图区域高度
     */
    getHeight: function () {
        return this._height;
    },

    /**
     * @private
     * @method _getSize
     */
    _getSize: function (whIdx) {
        let opts = this._opts;
        let wh = ['width', 'height'][whIdx];
        let cwh = ['clientWidth', 'clientHeight'][whIdx];
        let plt = ['paddingLeft', 'paddingTop'][whIdx];
        let prb = ['paddingRight', 'paddingBottom'][whIdx];

        if (opts[wh] != null && opts[wh] !== 'auto') {
            return parseFloat(opts[wh]);
        }

        let root = this.root;
        // IE8 does not support getComputedStyle, but it use VML.
        let stl = document.defaultView.getComputedStyle(root);

        return (
            (root[cwh] || dataUtil.parseInt10(stl[wh]) || dataUtil.parseInt10(root.style[wh]))
            - (dataUtil.parseInt10(stl[plt]) || 0)
            - (dataUtil.parseInt10(stl[prb]) || 0)
        ) | 0;
    },

    /**
     * @method dispose
     */
    dispose: function () {
        this.root.innerHTML = '';

        this._svgRoot =
            this._viewport =
            this.storage =
            null;
    },

    /**
     * @method clear
     */
    clear: function () {
        if (this._viewport) {
            this.root.removeChild(this._viewport);
        }
    },

    /**
     * @method pathToDataUrl
     */
    pathToDataUrl: function () {
        this.refresh();
        let html = this._svgRoot.outerHTML;
        return 'data:image/svg+xml;charset=UTF-8,' + html;
    }
};

// Not supported methods
function createMethodNotSupport(method) {
    return function () {
        console.log('In SVG mode painter not support method "' + method + '"');
    };
}

// Unsuppoted methods
[
    'getLayer', 'insertLayer', 'eachLayer', 'eachBuiltinLayer',
    'eachOtherLayer', 'getLayers', 'modLayer', 'delLayer', 'clearLayer',
    'toDataURL', 'pathToImage'
].forEach((name,index)=>{
    SVGPainter.prototype[name] = createMethodNotSupport(name);
});

export default SVGPainter;