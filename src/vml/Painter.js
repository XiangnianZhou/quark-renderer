import * as vmlCore from './core';
import * as dataUtil from '../core/utils/dataStructureUtil';
import {each} from '../core/utils/dataStructureUtil';

/**
 * @class zrender.svg.VMLPainter
 * 
 * VML Painter.
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

/**
 * @method constructor VMLPainter
 * @param {*} root 
 * @param {*} storage 
 */
function VMLPainter(root, storage) {
    vmlCore.initVML();
    this.root = root;
    this.storage = storage;
    let vmlViewport = document.createElement('div');
    let vmlRoot = document.createElement('div');
    vmlViewport.style.cssText = 'display:inline-block;overflow:hidden;position:relative;width:300px;height:150px;';
    vmlRoot.style.cssText = 'position:absolute;left:0;top:0;';
    root.appendChild(vmlViewport);
    
    this._vmlRoot = vmlRoot;
    this._vmlViewport = vmlViewport;
    this.resize();

    // Modify storage
    let oldDelFromStorage = storage.delFromStorage;
    let oldAddToStorage = storage.addToStorage;
    storage.delFromStorage = function (el) {
        oldDelFromStorage.call(storage, el);
        if (el) {
            el.onRemove && el.onRemove(vmlRoot);
        }
    };

    storage.addToStorage = function (el) {
        // Displayable already has a vml node
        el.onAdd && el.onAdd(vmlRoot);
        oldAddToStorage.call(storage, el);
    };

    this._firstPaint = true;
}

VMLPainter.prototype = {

    constructor: VMLPainter,

    /**
     * @method getType
     */
    getType: function () {
        return 'vml';
    },

    /**
     * @method getViewportRoot
     * @return {HTMLDivElement}
     */
    getViewportRoot: function () {
        return this._vmlViewport;
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
     * @method refresh 刷新
     */
    refresh: function () {
        let list = this.storage.getDisplayList(true, true);
        this._paintList(list);
    },

    /**
     * @private
     * @method _paintList
     * @param {*} list 
     */
    _paintList: function (list) {
        let vmlRoot = this._vmlRoot;
        for (let i = 0; i < list.length; i++) {
            let el = list[i];
            if (el.invisible || el.ignore) {
                if (!el.__alreadyNotVisible) {
                    el.onRemove(vmlRoot);
                }
                // Set as already invisible
                el.__alreadyNotVisible = true;
            }else {
                if (el.__alreadyNotVisible) {
                    el.onAdd(vmlRoot);
                }
                el.__alreadyNotVisible = false;
                if (el.__dirty) {
                    el.beforeBrush && el.beforeBrush();
                    (el.brushVML || el.brush).call(el, vmlRoot);
                    el.afterBrush && el.afterBrush();
                }
            }
            el.__dirty = false;
        }

        if (this._firstPaint) {
            // Detached from document at first time
            // to avoid page refreshing too many times
            // FIXME 如果每次都先 removeChild 可能会导致一些填充和描边的效果改变
            this._vmlViewport.appendChild(vmlRoot);
            this._firstPaint = false;
        }
    },

    /**
     * @method resize
     * @param {Number} width 
     * @param {Number} height 
     */
    resize: function (width, height) {
        width = width == null ? this._getWidth() : width;
        height = height == null ? this._getHeight() : height;
        if (this._width !== width || this._height !== height) {
            this._width = width;
            this._height = height;
            let vmlViewportStyle = this._vmlViewport.style;
            vmlViewportStyle.width = width + 'px';
            vmlViewportStyle.height = height + 'px';
        }
    },

    /**
     * @method dispose
     */
    dispose: function () {
        this.root.innerHTML = '';
        this._vmlRoot =
        this._vmlViewport =
        this.storage = null;
    },

    /**
     * @method getWidth
     */
    getWidth: function () {
        return this._width;
    },

    /**
     * @method getHeight
     */
    getHeight: function () {
        return this._height;
    },

    /**
     * @method clear
     */
    clear: function () {
        if (this._vmlViewport) {
            this.root.removeChild(this._vmlViewport);
        }
    },

    /**
     * @private
     * @method _getWidth
     */
    _getWidth: function () {
        let root = this.root;
        let stl = root.currentStyle;

        return ((root.clientWidth || dataUtil.parseInt10(stl.width))
                - dataUtil.parseInt10(stl.paddingLeft)
                - dataUtil.parseInt10(stl.paddingRight)) | 0;
    },

    /**
     * @private
     * @method _getHeight
     */
    _getHeight: function () {
        let root = this.root;
        let stl = root.currentStyle;
        return ((root.clientHeight || dataUtil.parseInt10(stl.height))
                - dataUtil.parseInt10(stl.paddingTop)
                - dataUtil.parseInt10(stl.paddingBottom)) | 0;
    }
};

// Not supported methods
function createMethodNotSupport(method) {
    return function () {
        console.log('In IE8.0 VML mode painter not support method "' + method + '"');
    };
}

// Unsupported methods
[
    'getLayer', 'insertLayer', 'eachLayer', 'eachBuiltinLayer', 'eachOtherLayer', 'getLayers',
    'modLayer', 'delLayer', 'clearLayer', 'toDataURL', 'pathToImage'
].forEach((name,index)=>{
    VMLPainter.prototype[name] = createMethodNotSupport(name);
});

export default VMLPainter;