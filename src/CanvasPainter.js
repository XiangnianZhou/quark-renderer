import requestAnimationFrame from './animation/utils/request_animation_frame';
import {devicePixelRatio} from './config';
import * as dataUtil from './core/utils/data_structure_util';
import BoundingRect from './graphic/transform/BoundingRect';
import timsort from './core/utils/timsort';
import CanvasLayer from './CanvasLayer';
import Image from './graphic/Image';
import env from './core/env';
import {mathRandom,mathMax} from './graphic/constants';

/**
 * @class qrenderer.canvas.CanvasPainter
 * 这是基于 canvas 接口的 CanvasPainter 类
 * @see 基于 SVG 接口的 CanvasPainter 类在 svg 目录下
 * @see 基于 VML 接口的 CanvasPainter 类在 vml 目录下
 */

let HOVER_LAYER_QLEVEL = 1e5;
let CANVAS_QLEVEL = 314159;
let EL_AFTER_INCREMENTAL_INC = 0.01;
let INCREMENTAL_INC = 0.001;

/**
 * @private
 * @method isLayerValid
 * @param {*} layer 
 */
function isLayerValid(layer) {
    if (!layer){
        return false;
    }

    if (layer.__builtin__){
        return true;
    }

    if (typeof (layer.resize) !== 'function'
        || typeof (layer.refresh) !== 'function'){
        return false;
    }
    return true;
}

let tmpRect = new BoundingRect(0, 0, 0, 0);
let viewRect = new BoundingRect(0, 0, 0, 0);
/**
 * @private
 * @method isDisplayableCulled
 * @param {*} el 
 * @param {*} width 
 * @param {*} height 
 */
function isDisplayableCulled(el, width, height) {
    tmpRect.copy(el.getBoundingRect());
    if (el.transform) {
        tmpRect.applyTransform(el.transform);
    }
    viewRect.width = width;
    viewRect.height = height;
    return !tmpRect.intersect(viewRect);
}

/**
 * @private
 * @method isClipPathChanged
 * @param {*} clipPaths 
 * @param {*} prevClipPaths 
 */
function isClipPathChanged(clipPaths, prevClipPaths) {
    // displayable.__clipPaths can only be `null`/`undefined` or an non-empty array.
    if (clipPaths === prevClipPaths) {
        return false;
    }
    if (!clipPaths || !prevClipPaths || (clipPaths.length !== prevClipPaths.length)) {
        return true;
    }
    for (let i = 0; i < clipPaths.length; i++) {
        if (clipPaths[i] !== prevClipPaths[i]) {
            return true;
        }
    }
    return false;
}

/**
 * @private
 * @method doClip
 * @param {*} clipPaths 
 * @param {*} ctx 
 */
function doClip(clipPaths, ctx) {
    for (let i = 0; i < clipPaths.length; i++) {
        let clipPath = clipPaths[i];

        clipPath.setTransform(ctx);
        ctx.beginPath();
        clipPath.buildPath(ctx, clipPath.shape);
        ctx.clip();
        // Transform back
        clipPath.restoreTransform(ctx);
    }
}

/**
 * @private
 * @method createDomRoot
 * 不会直接在传入的 dom 节点内部创建 canvas 标签，而是再套一层div
 * 目的是加上一些必须的 CSS 样式，方便实现特定的功能。
 * @param {Number} width 
 * @param {Number} height 
 */
function createDomRoot(width, height) {
    let domRoot = document.createElement('div');
    // domRoot.onselectstart = returnFalse; // Avoid page selected
    domRoot.style.cssText = [
        'position:relative',
        // IOS13 safari probably has a compositing bug (z order of the canvas and the consequent
        // dom does not act as expected) when some of the parent dom has
        // `-webkit-overflow-scrolling: touch;` and the webpage is longer than one screen and
        // the canvas is not at the top part of the page.
        // Check `https://bugs.webkit.org/show_bug.cgi?id=203681` for more details. We remove
        // this `overflow:hidden` to avoid the bug.
        // 'overflow:hidden',
        'width:' + width + 'px',
        'height:' + height + 'px',
        'padding:0',
        'margin:0',
        'border-width:0'
    ].join(';') + ';';

    //为了让div能够响应键盘事件，这个属性是必须的
    // domRoot.setAttribute("tabindex","0");
    return domRoot;
}

/**
 * @method constructor
 * @param {HTMLElement} root 绘图容器
 * @param {Storage} storage
 * @param {Object} opts
 */
let CanvasPainter = function (root, storage, opts) {
    this.type = 'canvas';
    // In node environment using node-canvas
    let singleCanvas = !root.nodeName // In node ?
        || root.nodeName.toUpperCase() === 'CANVAS';
    this._opts = opts = dataUtil.extend({}, opts || {});
    /**
     * @property {Number} dpr
     */
    this.dpr = opts.devicePixelRatio || devicePixelRatio;
    /**
     * @property {Boolean} _singleCanvas
     * @private
     */
    this._singleCanvas = singleCanvas;
    /**
     * @property {HTMLElement} root 绘图容器
     */
    this.root = root;
    let rootStyle = root.style;
    if (rootStyle) {
        rootStyle['-webkit-tap-highlight-color'] = 'transparent';
        rootStyle['-webkit-user-select'] =
        rootStyle['user-select'] =
        rootStyle['-webkit-touch-callout'] = 'none';
        root.innerHTML = '';
    }

    /**
     * @property {Storage} storage
     */
    this.storage = storage;

    /**
     * @property {Array<Number>}
     * @private
     */
    let qlevelList = this._qlevelList = [];

    /**
     * @private
     * @property {Object<String, CanvasLayer>} layers
     */
    let layers = this._layers = {};

    /**
     * @private
     * @property {Object<String, Object>} _layerConfig
     */
    this._layerConfig = {};

    /**
     * @private
     * @property _needsManuallyCompositing
     * qrenderer will do compositing when root is a canvas and have multiple zlevels.
     */
    this._needsManuallyCompositing = false;

    if (!singleCanvas) {
        this._width = this._getSize(0);
        this._height = this._getSize(1);

        let domRoot = this._domRoot = createDomRoot(
            this._width, this._height
        );
        root.appendChild(domRoot);
    }else {
        let width = root.width;
        let height = root.height;

        if (opts.width != null) {
            width = opts.width;
        }
        if (opts.height != null) {
            height = opts.height;
        }
        this.dpr = opts.devicePixelRatio || 1;

        // Use canvas width and height directly
        root.width = width * this.dpr;
        root.height = height * this.dpr;

        this._width = width;
        this._height = height;

        // Create layer if only one given canvas
        // Device can be specified to create a high dpi image.
        let mainLayer = new CanvasLayer(root,this._width,this._height,this.dpr);
        mainLayer.__builtin__ = true;
        mainLayer.initContext();
        // FIXME Use canvas width and height
        // mainLayer.resize(width, height);
        layers[CANVAS_QLEVEL] = mainLayer;
        mainLayer.qlevel = CANVAS_QLEVEL;
        // Not use common qlevel.
        qlevelList.push(CANVAS_QLEVEL);

        this._domRoot = root;
    }

    /**
     * @private
     * @property {CanvasLayer} _hoverlayer
     */
    this._hoverlayer = null;
    /**
     * @private
     * @property {Array} _hoverElements
     */
    this._hoverElements = [];
};

CanvasPainter.prototype = {

    constructor: CanvasPainter,

    /**
     * @method getType
     * @return {String}
     */
    getType: function () {
        return 'canvas';
    },

    /**
     * @method isSingleCanvas
     * If painter use a single canvas
     * @return {Boolean}
     */
    isSingleCanvas: function () {
        return this._singleCanvas;
    },

    /**
     * @method getViewportRoot
     * @return {HTMLDivElement}
     */
    getViewportRoot: function () {
        return this._domRoot;
    },

    /**
     * @method getViewportRootOffset
     * @return {Object}
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
     * @method
     * 刷新
     * @param {Boolean} [paintAll=false] 是否强制绘制所有displayable
     */
    refresh: function (paintAll) {
        let list = this.storage.getDisplayList(true);
        let qlevelList = this._qlevelList;
        this._redrawId = mathRandom();
        this._paintList(list, paintAll, this._redrawId);

        // Paint custum layers
        for (let i = 0; i < qlevelList.length; i++) {
            let z = qlevelList[i];
            let layer = this._layers[z];
            if (!layer.__builtin__ && layer.refresh) {
                let clearColor = i === 0 ? this._backgroundColor : null;
                layer.refresh(clearColor);
            }
        }

        this.refreshHover();
        return this;
    },

    /**
     * @method addHover
     * 
     * @param {*} el 
     * @param {*} hoverStyle 
     */
    addHover: function (el, hoverStyle) {
        if (el.__hoverMir) {
            return;
        }
        let elMirror = new el.constructor({
            style: el.style,
            shape: el.shape,
            z: el.z,
            z2: el.z2,
            silent: el.silent
        });
        elMirror.__from = el;
        el.__hoverMir = elMirror;
        hoverStyle && elMirror.setStyle(hoverStyle);
        this._hoverElements.push(elMirror);
        return elMirror;
    },

    /**
     * @method removeHover
     * @param {*} el 
     */
    removeHover: function (el) {
        let elMirror = el.__hoverMir;
        let hoverElements = this._hoverElements;
        let idx = dataUtil.indexOf(hoverElements, elMirror);
        if (idx >= 0) {
            hoverElements.splice(idx, 1);
        }
        el.__hoverMir = null;
    },

    /**
     * @method clearHover
     * @param {*} el 
     */
    clearHover: function (el) {
        let hoverElements = this._hoverElements;
        for (let i = 0; i < hoverElements.length; i++) {
            let from = hoverElements[i].__from;
            if (from) {
                from.__hoverMir = null;
            }
        }
        hoverElements.length = 0;
    },

    /**
     * @method refreshHover
     */
    refreshHover: function () {
        let hoverElements = this._hoverElements;
        let len = hoverElements.length;
        let hoverLayer = this._hoverlayer;
        hoverLayer && hoverLayer.clear();

        if (!len) {
            return;
        }
        timsort(hoverElements, this.storage.displayableSortFunc);

        // Use a extream large qlevel
        // FIXME?
        if (!hoverLayer) {
            hoverLayer = this._hoverlayer = this.getLayer(HOVER_LAYER_QLEVEL);
        }

        let scope = {};
        hoverLayer.ctx.save();
        for (let i = 0; i < len;) {
            let el = hoverElements[i];
            let originalEl = el.__from;
            // Original el is removed
            // PENDING
            if (!(originalEl && originalEl.__qr)) {
                hoverElements.splice(i, 1);
                originalEl.__hoverMir = null;
                len--;
                continue;
            }
            i++;

            // Use transform
            // FIXME style and shape ?
            if (!originalEl.invisible) {
                el.transform = originalEl.transform;
                el.invTransform = originalEl.invTransform;
                el.__clipPaths = originalEl.__clipPaths;
                // el.
                this._doPaintEl(el, hoverLayer, true, scope);
            }
        }

        hoverLayer.ctx.restore();
    },

    /**
     * @method getHoverLayer
     */
    getHoverLayer: function () {
        return this.getLayer(HOVER_LAYER_QLEVEL);
    },

    /**
     * @method _paintList
     * @param {*} list 
     * @param {*} paintAll 
     * @param {*} redrawId 
     */
    _paintList: function (list, paintAll, redrawId) {
        //如果 redrawId 不一致，说明下一个动画帧已经到来，这里就会直接跳过去，相当于跳过了一帧
        if (this._redrawId !== redrawId) {
            return;
        }

        paintAll = paintAll || false;

        this._updateLayerStatus(list);

        let finished = this._doPaintList(list, paintAll);

        if (this._needsManuallyCompositing) {
            this._compositeManually();
        }

        //如果在一帧的时间内没有绘制完，在下一帧继续绘制
        //TODO:这里需要测试一个极限值出来，在 16ms 的时间里面最多能绘制多少个元素。
        if (!finished) {
            let self = this;
            requestAnimationFrame(function () {
                self._paintList(list, paintAll, redrawId);
            });
        }
    },

    /**
     * @method _compositeManually
     */
    _compositeManually: function () {
        let ctx = this.getLayer(CANVAS_QLEVEL).ctx;
        let width = this._domRoot.width;
        let height = this._domRoot.height;
        ctx.clearRect(0, 0, width, height);
        // PENDING, If only builtin layer?
        this.eachBuiltinLayer(function (layer) {
            if (layer.virtual) {
                ctx.drawImage(layer.canvasInstance, 0, 0, width, height);
            }
        });
    },

    /**
     * @method _doPaintList
     */
    _doPaintList: function (list, paintAll) {
        let layerList = [];
        for (let zi = 0; zi < this._qlevelList.length; zi++) {
            let qlevel = this._qlevelList[zi];
            let layer = this._layers[qlevel];
            if (layer.__builtin__
                && layer !== this._hoverlayer
                && (layer.__dirty || paintAll)
            ) {
                layerList.push(layer);
            }
        }

        let finished = true;

        for (let k = 0; k < layerList.length; k++) {
            let layer = layerList[k];
            let ctx = layer.ctx;
            let scope = {};
            ctx.save();

            let start = paintAll ? layer.__startIndex : layer.__drawIndex;

            let useTimer = !paintAll && layer.incremental && Date.now;
            let startTime = useTimer && Date.now();

            let clearColor = layer.qlevel === this._qlevelList[0]
                ? this._backgroundColor : null;
            // All elements in this layer are cleared.
            if (layer.__startIndex === layer.__endIndex) {
                layer.clear(false, clearColor);
            }else if (start === layer.__startIndex) {
                let firstEl = list[start];
                if (!firstEl.incremental || !firstEl.notClear || paintAll) {
                    layer.clear(false, clearColor);
                }
            }

            if (start === -1) {
                console.error('For some unknown reason. drawIndex is -1');
                start = layer.__startIndex;
            }

            let i = start;
            for (;i < layer.__endIndex; i++) {
                let el = list[i];
                this._doPaintEl(el, layer, paintAll, scope);
                el.__dirty = el.__dirtyText = false;

                if (useTimer) {
                    // Date.now can be executed in 13,025,305 ops/second.
                    let dTime = Date.now() - startTime;
                    // Give 15 millisecond to draw.
                    // The rest elements will be drawn in the next frame.
                    // 这里的时间计算非常重要，如果 15ms 的时间内没有能绘制完所有元素，则跳出，等待下一帧继续绘制
                    // 但是 15ms 的时间依然是有限的，如果元素的数量非常巨大，例如有 1000 万个，还是会卡顿。
                    // TODO: 这里需要实际 benchmark 一个数值出来。
                    if (dTime > 15) {
                        break;
                    }
                }
            }

            layer.__drawIndex = i;

            if (layer.__drawIndex < layer.__endIndex) {
                finished = false;
            }

            if (scope.prevElClipPaths) {
                // Needs restore the state. If last drawn element is in the clipping area.
                ctx.restore();
            }

            ctx.restore();
        }

        if (env.wxa) {
            // Flush for weixin application
            dataUtil.each(this._layers, function (layer) {
                if (layer && layer.ctx && layer.ctx.draw) {
                    layer.ctx.draw();
                }
            });
        }

        return finished;
    },

    /**
     * @method _doPaintEl
     * 绘制一个元素
     * @param {*} el 
     * @param {*} currentLayer 
     * @param {*} forcePaint 
     * @param {*} scope 
     */
    _doPaintEl: function (el, currentLayer, forcePaint, scope) {
        let ctx = currentLayer.ctx;
        let m = el.transform;
        if (
            (currentLayer.__dirty || forcePaint)
            // Ignore invisible element
            && !el.invisible
            // Ignore transparent element
            && el.style.opacity !== 0
            // Ignore scale 0 element, in some environment like node-canvas
            // Draw a scale 0 element can cause all following draw wrong
            // And setTransform with scale 0 will cause set back transform failed.
            && !(m && !m[0] && !m[3])
            // Ignore culled element
            && !(el.culling && isDisplayableCulled(el, this._width, this._height))
        ) {

            let clipPaths = el.__clipPaths;
            let prevElClipPaths = scope.prevElClipPaths;

            // Optimize when clipping on group with several elements
            if (!prevElClipPaths || isClipPathChanged(clipPaths, prevElClipPaths)) {
                // If has previous clipping state, restore from it
                if (prevElClipPaths) {
                    ctx.restore();
                    scope.prevElClipPaths = null;
                    // Reset prevEl since context has been restored
                    scope.prevEl = null;
                }
                // New clipping state
                if (clipPaths) {
                    ctx.save();
                    doClip(clipPaths, ctx);
                    scope.prevElClipPaths = clipPaths;
                }
            }

            //开始绘制元素，beforeBrush/brush/afterBrush 3个方法定义在基类 Displayable 中。
            //每个元素自己知道如何绘制自身的形状。
            el.beforeBrush && el.beforeBrush(ctx);

            el.brush(ctx, scope.prevEl || null);
            scope.prevEl = el;

            el.afterBrush && el.afterBrush(ctx);
        }
    },

    /**
     * @method getLayer
     * 获取 qlevel 所在层，如果不存在则会创建一个新的层
     * @param {Number} qlevel
     * @param {Boolean} virtual Virtual layer will not be inserted into dom.
     * @return {CanvasLayer}
     */
    getLayer: function (qlevel, virtual) {
        if (this._singleCanvas && !this._needsManuallyCompositing) {
            qlevel = CANVAS_QLEVEL;
        }
        let layer = this._layers[qlevel];
        if (!layer) {
            // Create a new layer
            layer = new CanvasLayer('qr_' + qlevel,this._width,this._height,this.dpr);
            layer.qlevel = qlevel;
            layer.__builtin__ = true;

            if (this._layerConfig[qlevel]) {
                dataUtil.merge(layer, this._layerConfig[qlevel], true);
            }

            if (virtual) {
                layer.virtual = virtual;
            }

            this.insertLayer(qlevel, layer);

            // Context is created after dom inserted to document
            // Or excanvas will get 0px clientWidth and clientHeight
            layer.initContext();
        }

        return layer;
    },

    /**
     * @method insertLayer
     * @param {*} qlevel 
     * @param {*} layer 
     */
    insertLayer: function (qlevel, layer) {
        let layersMap = this._layers;
        let qlevelList = this._qlevelList;
        let len = qlevelList.length;
        let prevLayer = null;
        let i = -1;
        let domRoot = this._domRoot;

        if (layersMap[qlevel]) {
            console.log('ZLevel ' + qlevel + ' has been used already');
            return;
        }
        // Check if is a valid layer
        if (!isLayerValid(layer)) {
            console.log('CanvasLayer of qlevel ' + qlevel + ' is not valid');
            return;
        }

        if (len > 0 && qlevel > qlevelList[0]) {
            for (i = 0; i < len - 1; i++) {
                if (
                    qlevelList[i] < qlevel
                    && qlevelList[i + 1] > qlevel
                ) {
                    break;
                }
            }
            prevLayer = layersMap[qlevelList[i]];
        }
        qlevelList.splice(i + 1, 0, qlevel);

        layersMap[qlevel] = layer;

        // Vitual layer will not directly show on the screen.
        // (It can be a WebGL layer and assigned to a ZImage element)
        // But it still under management of qrenderer.
        if (!layer.virtual) {
            if (prevLayer) {
                let prevDom = prevLayer.dom;
                if (prevDom.nextSibling) {
                    domRoot.insertBefore(
                        layer.canvasInstance,
                        prevDom.nextSibling
                    );
                }
                else {
                    domRoot.appendChild(layer.canvasInstance);
                }
            }else {
                if (domRoot.firstChild) {
                    domRoot.insertBefore(layer.canvasInstance, domRoot.firstChild);
                }
                else {
                    domRoot.appendChild(layer.canvasInstance);
                }
            }
        }
    },

    /**
     * @private
     * @method eachLayer
     * Iterate each layer
     * @param {Function} cb 
     * @param {Object} context 
     */
    eachLayer: function (cb, context) {
        let qlevelList = this._qlevelList;
        let z;
        let i;
        for (i = 0; i < qlevelList.length; i++) {
            z = qlevelList[i];
            cb.call(context, this._layers[z], z);
        }
    },

    /**
     * @private
     * @method eachBuiltinLayer
     * Iterate each buildin layer
     * @param {Function} cb 
     * @param {Object} context 
     */
    eachBuiltinLayer: function (cb, context) {
        let qlevelList = this._qlevelList;
        let layer;
        let z;
        let i;
        for (i = 0; i < qlevelList.length; i++) {
            z = qlevelList[i];
            layer = this._layers[z];
            if (layer.__builtin__) {
                cb.call(context, layer, z);
            }
        }
    },

    /**
     * @private
     * @method eachOtherLayer
     * Iterate each other layer except buildin layer
     * @param {Function} cb 
     * @param {Object} context 
     */
    eachOtherLayer: function (cb, context) {
        let qlevelList = this._qlevelList;
        let layer;
        let z;
        let i;
        for (i = 0; i < qlevelList.length; i++) {
            z = qlevelList[i];
            layer = this._layers[z];
            if (!layer.__builtin__) {
                cb.call(context, layer, z);
            }
        }
    },

    /**
     * @method getLayers
     * 获取所有已创建的层
     * @param {Array<CanvasLayer>} [prevLayer]
     */
    getLayers: function () {
        return this._layers;
    },

    /**
     * @private
     * @method _updateLayerStatus
     * @param {*} list 
     */
    _updateLayerStatus: function (list) {

        this.eachBuiltinLayer(function (layer, z) {
            layer.__dirty = layer.__used = false;
        });

        function updatePrevLayer(idx) {
            if (prevLayer) {
                if (prevLayer.__endIndex !== idx) {
                    prevLayer.__dirty = true;
                }
                prevLayer.__endIndex = idx;
            }
        }

        if (this._singleCanvas) {
            for (let i = 1; i < list.length; i++) {
                let el = list[i];
                if (el.qlevel !== list[i - 1].qlevel || el.incremental) {
                    this._needsManuallyCompositing = true;
                    break;
                }
            }
        }

        let prevLayer = null;
        let incrementalLayerCount = 0;
        let i = 0;
        for (;i < list.length; i++) {
            let el = list[i];
            let qlevel = el.qlevel;
            let layer;
            // PENDING If change one incremental element style ?
            // TODO Where there are non-incremental elements between incremental elements.
            if (el.incremental) {
                layer = this.getLayer(qlevel + INCREMENTAL_INC, this._needsManuallyCompositing);
                layer.incremental = true;
                incrementalLayerCount = 1;
            }
            else {
                layer = this.getLayer(
                    qlevel + (incrementalLayerCount > 0 ? EL_AFTER_INCREMENTAL_INC : 0),
                    this._needsManuallyCompositing
                );
            }

            if (!layer.__builtin__) {
                console.log('ZLevel ' + qlevel + ' has been used by unkown layer ' + layer.id);
            }

            if (layer !== prevLayer) {
                layer.__used = true;
                if (layer.__startIndex !== i) {
                    layer.__dirty = true;
                }
                layer.__startIndex = i;
                if (!layer.incremental) {
                    layer.__drawIndex = i;
                }
                else {
                    // Mark layer draw index needs to update.
                    layer.__drawIndex = -1;
                }
                updatePrevLayer(i);
                prevLayer = layer;
            }
            if (el.__dirty) {
                layer.__dirty = true;
                if (layer.incremental && layer.__drawIndex < 0) {
                    // Start draw from the first dirty element.
                    layer.__drawIndex = i;
                }
            }
        }

        updatePrevLayer(i);

        this.eachBuiltinLayer(function (layer, z) {
            // Used in last frame but not in this frame. Needs clear
            if (!layer.__used && layer.getElementCount() > 0) {
                layer.__dirty = true;
                layer.__startIndex = layer.__endIndex = layer.__drawIndex = 0;
            }
            // For incremental layer. In case start index changed and no elements are dirty.
            if (layer.__dirty && layer.__drawIndex < 0) {
                layer.__drawIndex = layer.__startIndex;
            }
        });
    },

    /**
     * @method clear
     * 清除hover层外所有内容
     */
    clear: function () {
        this.eachBuiltinLayer(this._clearLayer);
        return this;
    },

    /**
     * @private
     * @method _clearLayer
     */
    _clearLayer: function (layer) {
        layer.clear();
    },

    /**
     * @method setBackgroundColor
     */
    setBackgroundColor: function (backgroundColor) {
        this._backgroundColor = backgroundColor;
    },

    /**
     * @method configLayer
     * 修改指定zlevel的绘制参数
     *
     * @param {String} qlevel
     * @param {Object} [config] 配置对象
     * @param {String} [config.clearColor=0] 每次清空画布的颜色
     * @param {String} [config.motionBlur=false] 是否开启动态模糊
     * @param {Number} [config.lastFrameAlpha=0.7] 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */
    configLayer: function (qlevel, config) {
        if (config) {
            let layerConfig = this._layerConfig;
            if (!layerConfig[qlevel]) {
                layerConfig[qlevel] = config;
            }
            else {
                dataUtil.merge(layerConfig[qlevel], config, true);
            }

            for (let i = 0; i < this._qlevelList.length; i++) {
                let _zlevel = this._qlevelList[i];
                if (_zlevel === qlevel || _zlevel === qlevel + EL_AFTER_INCREMENTAL_INC) {
                    let layer = this._layers[_zlevel];
                    dataUtil.merge(layer, layerConfig[qlevel], true);
                }
            }
        }
    },

    /**
     * @method delLayer
     * 删除指定层
     * @param {Number} qlevel 层所在的zlevel
     */
    delLayer: function (qlevel) {
        let layers = this._layers;
        let qlevelList = this._qlevelList;
        let layer = layers[qlevel];
        if (!layer) {
            return;
        }
        layer.canvasInstance.parentNode.removeChild(layer.canvasInstance);
        delete layers[qlevel];

        qlevelList.splice(dataUtil.indexOf(qlevelList, qlevel), 1);
    },

    /**
     * @method resize
     * 区域大小变化后重绘
     * @param {Number} width
     * @param {Number} height
     */
    resize: function (width, height) {
        if (!this._domRoot.style) { // Maybe in node or worker
            if (width == null || height == null) {
                return;
            }
            this._width = width;
            this._height = height;

            this.getLayer(CANVAS_QLEVEL).resize(width, height);
        }
        else {
            let domRoot = this._domRoot;
            // FIXME Why ?
            domRoot.style.display = 'none';

            // Save input w/h
            let opts = this._opts;
            width != null && (opts.width = width);
            height != null && (opts.height = height);

            width = this._getSize(0);
            height = this._getSize(1);

            domRoot.style.display = '';

            // 优化没有实际改变的resize
            if (this._width !== width || height !== this._height) {
                domRoot.style.width = width + 'px';
                domRoot.style.height = height + 'px';

                for (let id in this._layers) {
                    if (this._layers.hasOwnProperty(id)) {
                        this._layers[id].resize(width, height);
                    }
                }
                dataUtil.each(this._progressiveLayers, function (layer) {
                    layer.resize(width, height);
                });

                this.refresh(true);
            }

            this._width = width;
            this._height = height;

        }
        return this;
    },

    /**
     * @method clearLayer
     * 清除单独的一个层
     * @param {Number} qlevel
     */
    clearLayer: function (qlevel) {
        let layer = this._layers[qlevel];
        if (layer) {
            layer.clear();
        }
    },

    /**
     * @method dispose
     * 释放
     */
    dispose: function () {
        this.root.innerHTML = '';

        this.root =
        this.storage =

        this._domRoot =
        this._layers = null;
    },

    /**
     * @method getRenderedCanvas
     * Get canvas which has all thing rendered
     * @param {Object} [opts]
     * @param {String} [opts.backgroundColor]
     * @param {Number} [opts.pixelRatio]
     */
    getRenderedCanvas: function (opts) {
        opts = opts || {};
        if (this._singleCanvas && !this._compositeManually) {
            return this._layers[CANVAS_QLEVEL].dom;
        }

        let imageLayer = new CanvasLayer('image',this._width,this._height,opts.pixelRatio || this.dpr);
        imageLayer.initContext();
        imageLayer.clear(false, opts.backgroundColor || this._backgroundColor);

        if (opts.pixelRatio <= this.dpr) {
            this.refresh();

            let width = imageLayer.dom.width;
            let height = imageLayer.dom.height;
            let ctx = imageLayer.ctx;
            this.eachLayer(function (layer) {
                if (layer.__builtin__) {
                    ctx.drawImage(layer.canvasInstance, 0, 0, width, height);
                }
                else if (layer.renderToCanvas) {
                    imageLayer.ctx.save();
                    layer.renderToCanvas(imageLayer.ctx);
                    imageLayer.ctx.restore();
                }
            });
        }
        else {
            // PENDING, echarts-gl and incremental rendering.
            let scope = {};
            let displayList = this.storage.getDisplayList(true);
            for (let i = 0; i < displayList.length; i++) {
                let el = displayList[i];
                this._doPaintEl(el, imageLayer, true, scope);
            }
        }

        return imageLayer.dom;
    },

    /**
     * @method getWidth
     * 获取绘图区域宽度
     * @return {Number}
     */
    getWidth: function () {
        return this._width;
    },

    /**
     * @method getHeight
     * 获取绘图区域高度
     * @return {Number}
     */
    getHeight: function () {
        return this._height;
    },

    /**
     * @method _getSize
     * @param {*} whIdx 
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
     * @method pathToImage
     * @param {*} path 
     * @param {*} dpr 
     */
    pathToImage: function (path, dpr) {
        dpr = dpr || this.dpr;

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let rect = path.getBoundingRect();
        let style = path.style;
        let shadowBlurSize = style.shadowBlur * dpr;
        let shadowOffsetX = style.shadowOffsetX * dpr;
        let shadowOffsetY = style.shadowOffsetY * dpr;
        let lineWidth = style.hasStroke() ? style.lineWidth : 0;

        let leftMargin = mathMax(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
        let rightMargin = mathMax(lineWidth / 2, shadowOffsetX + shadowBlurSize);
        let topMargin = mathMax(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
        let bottomMargin = mathMax(lineWidth / 2, shadowOffsetY + shadowBlurSize);
        let width = rect.width + leftMargin + rightMargin;
        let height = rect.height + topMargin + bottomMargin;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);
        ctx.dpr = dpr;

        let pathTransform = {
            position: path.position,
            rotation: path.rotation,
            scale: path.scale
        };
        path.position = [leftMargin - rect.x, topMargin - rect.y];
        path.rotation = 0;
        path.scale = [1, 1];
        path.updateTransform();
        if (path) {
            path.brush(ctx);
        }

        let ImageShape = Image;
        let imgShape = new ImageShape({
            style: {
                x: 0,
                y: 0,
                image: canvas
            }
        });

        if (pathTransform.position != null) {
            imgShape.position = path.position = pathTransform.position;
        }

        if (pathTransform.rotation != null) {
            imgShape.rotation = path.rotation = pathTransform.rotation;
        }

        if (pathTransform.scale != null) {
            imgShape.scale = path.scale = pathTransform.scale;
        }

        return imgShape;
    }
};

export default CanvasPainter;