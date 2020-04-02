/* eslint-disable no-prototype-builtins */
import * as textUtil from './utils/text_util';
import GlobalEventDispatcher from './event/GlobalEventDispatcher';
import CanvasPainter from './canvas/CanvasPainter';
import GlobalAnimationMgr from './animation/GlobalAnimationMgr';
import DomEventInterceptor from './event/DomEventInterceptor';
import Storage from './Storage';
import guid from './utils/guid';
import env from './utils/env';

/**
 * @class qrenderer.core.QuarkRenderer
 * QuarkRenderer, a high performance 2d drawing library.
 * Class QuarkRenderer is the global entry, every time you call qrenderer.init() will 
 * create an instance of QuarkRenderer class, each instance has an unique id.
 * 
 * 
 * QuarkRenderer 是一款高性能的 2d 渲染引擎。
 * QuarkRenderer 类是全局入口，每次调用 qrenderer.init() 会创建一个实例，每个 QuarkRenderer 实例有自己唯一的 ID。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

if(!env.canvasSupported){
    throw new Error("Need Canvas Environment.");
}

// 每种底层渲染技术的 Painter 都需要注册到这里，默认 CanvasPainter
// Each type of Painters for different rendering techniques should be registered here, default to CanvasPainter.
let painterMap = {
    canvas: CanvasPainter
};

/**
 * @static
 * @method registerPainter
 * Register the painter.
 * 
 * 
 * 注册 Painter。
 * @param {*} name 
 * @param {*} PainterClass 
 */
export function registerPainter(name, PainterClass) {
    painterMap[name] = PainterClass;
}

// QuarkRenderer 实例map索引，浏览器中同一个 window 下的 QuarkRenderer 实例都会存在这里。
// A map for caching QuarkRenderer instances, every instance of the same scope will be stored here.
let instances = {};

/**
 * @property {String} version
 */
export let version = '1.0.26';

/**
 * @method qrenderer.init()
 * Global entry for creating a qrenderer instance.
 * 
 * 全局总入口，创建 QuarkRenderer 的实例。
 * 
 * @param {HTMLDomElement|Canvas|Context} host 
 * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
 * or Context for Wechat mini-program.
 * 
 * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
 * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。
 * @param {Object} [options]
 * @param {String} [options.renderer='canvas'] 'canvas' or 'svg'
 * @param {Number} [options.devicePixelRatio]
 * @param {Number|String} [options.width] Can be 'auto' (the same as null/undefined)
 * @param {Number|String} [options.height] Can be 'auto' (the same as null/undefined)
 * @return {QuarkRenderer}
 */
export function init(host, options) {
    let qr = new QuarkRenderer(host, options);
    instances[qr.id] = qr;
    return qr;
}

/**
 * FIXME: 不要export这个全局函数看起来也没有问题。
 * Dispose qrenderer instance
 * @param {QuarkRenderer} qr
 */
export function dispose(qr) {
    if (qr) {
        qr.dispose();
    }else {
        for (let key in instances) {
            if (instances.hasOwnProperty(key)) {
                instances[key].dispose();
            }
        }
        instances = {};
    }
    return this;
}

/**
 * @static
 * @method getInstance
 * Get qrenderer instance by id.
 * 
 * 根据 id 获取 QuarkRenderer 的实例。
 * @param {String} id
 * @return {QuarkRenderer}
 */
export function getInstance(id) {
    return instances[id];
}

/**
 * @method constructor QuarkRenderer
 * @param {String} id
 * @param {HTMLElement} host
 * @param {Object} [options]
 * @param {String} [options.renderer='canvas'] 'canvas' or 'svg'
 * @param {Number} [options.devicePixelRatio]
 * @param {Number} [options.width] Can be 'auto' (the same as null/undefined)
 * @param {Number} [options.height] Can be 'auto' (the same as null/undefined)
 * @return {QuarkRenderer}
 */
class QuarkRenderer{
    constructor(host, options={}){
        /**
         * @private
         * @property {String} id
         */
        this.id = guid();

        /**
         * @property {HTMLDomElement|Canvas|Context} host 
         * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
         * or Context for Wechat mini-program.
         * 
         * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
         * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。
         */
        this.host = host;
    
        let self = this;
    
        /**
         * @private
         * @property {qrenderer.core.Storage} storage
         */
        this.storage = new Storage();

        //根据参数创建不同类型的 Painter 实例。
        let rendererType = options.renderer;
        if (!rendererType || !painterMap[rendererType]) {
            rendererType = 'canvas';
        }
        this.painter = new painterMap[rendererType](this.host, this.storage, options, this.id);

        //利用代理拦截 DOM 事件，转发到 QuarkRenderer 自己封装的事件机制。
        let eventInterceptor =null;
        if(typeof this.host.moveTo!=='function'){
            if(!env.node && !env.worker && !env.wxa){
                eventInterceptor=new DomEventInterceptor(this.painter.getHost());
            }
        }else{
            // host is Context instance, override function.
            textUtil.$override('measureText', function (text, font){
                self.font = font || textUtil.DEFAULT_FONT;
                return self.host.measureText(text);
            });
        }
        /**
         * @private
         * @property {GlobalEventDispatcher} eventDispatcher
         * QuarkRenderer 自己封装的事件机制，这是画布内部的事件系统。
         */
        this.eventDispatcher = new GlobalEventDispatcher(this.storage, this.painter, eventInterceptor, this.painter.root);
    
        /**
         * @property {GlobalAnimationMgr}
         * 利用 GlobalAnimationMgr 的 frame 事件刷新画布上的元素。
         */
        this.globalAnimationMgr = new GlobalAnimationMgr();
        this.globalAnimationMgr.on("frame",function(){
            self.flush();
        });
        this.globalAnimationMgr.start();
    
        /**
         * @property {Boolean}
         * @private
         */
        this.__dirty=false;  
    }

    /**
     * @method
     * Add element.
     * 
     * 
     * 添加元素。
     * @param  {qrenderer/Element} el
     */
    add(el) {
        el.__qr=this;
        this.storage.addToRoot(el);
        this.dirty();
    }

    /**
     * @method
     * Delete element.
     * 
     * 
     * 删除元素。
     * @param  {qrenderer/Element} el
     */
    remove(el) {
        this.storage.delFromRoot(el);
        el.__qr=null;
        this.dirty();
    }

    /**
     * @private
     * @method
     * Perform refresh operation, this method will be called by window.requestAnimationFrame contantly, 
     * if there is no elment need to be repaint, this method just do nothing. Please do NOT call this 
     * method directly.
     * 
     * 
     * 刷新 canvas 画面，此方法会在 window.requestAnimationFrame 方法中被不断调用，如果没有元素需要被重绘，
     * 这个方法什么都不做。请不要直接调用此方法。
     */
    flush() {
        if (this.__dirty) {//try refreshing all elements
            // Clear needsRefresh ahead to avoid something wrong happens in refresh
            // Or it will cause qrenderer refreshes again and again.
            this.__dirty = this.__hoverLayerDirty = false;
            this.painter.refresh && this.painter.refresh();
        }
        if (this.__hoverLayerDirty) {//only try refreshing hovered elements
            this.__dirty = this.__hoverLayerDirty = false;
            this.painter.refreshHover && this.painter.refreshHover();
        }
        // Avoid trigger qr.refresh in Element#beforeUpdate hook
        this.__dirty = this.__hoverLayerDirty = false;
        this.eventDispatcher.trigger('rendered');
    }

    /**
     * @method dirty
     * Mark the entire canvas as dirty, will be repaint in the next animation frame.
     * 
     * 
     * 把整个画布标记为 dirty，在下一帧中会全部重绘。
     */
    dirty() {
        this.__dirty = true;
    }

    /**
     * @private
     * @method addHover
     * Add element to a hover layer, the 6 methods below are related to hover layer, we may need a hover layer 
     * to display some special data when the mouse is hovered over an element.
     * 
     * 
     * 把元素添加到浮动层。
     * 以下与 Hover 相关的6个方法用来处理浮动层，当鼠标悬停在 canvas 中的元素上方时，可能会需要
     * 显示一些浮动的层来展现一些特殊的数据。
     * 
     * @param  {Element} el
     * @param {Object} style
     */
    addHover(el, style) {
        if (this.painter.addHover) {
            let elMirror = this.painter.addHover(el, style);
            this.refreshHover();
            return elMirror;
        }
    }

    /**
     * @private
     * @method removeHover
     * Remove element from hover layer.
     * 
     * 
     * 从浮动层中删除元素。
     * @param  {Element} el
     */
    removeHover(el) {
        if (this.painter.removeHover) {
            this.painter.removeHover(el);
            this.refreshHover();
        }
    }

    /**
     * @private
     * @method findHover
     * Find hovered element.
     * 
     * 
     * 查找浮动的元素。
     * @param {Number} x
     * @param {Number} y
     * @return {Object} {target, topTarget}
     */
    findHover(x, y) {
        return this.eventDispatcher.findHover(x, y);
    }

    /**
     * @private
     * @method clearHover
     * Clear all hover elements in hover layer.
     * 
     * 
     * 从浮动层中删掉所有元素。
     * @param  {Element} el
     */
    clearHover() {
        if (this.painter.clearHover) {
            this.painter.clearHover();
            this.refreshHover();
        }
    }

    /**
     * @private
     * @method refreshHover
     * Refresh hover in next frame.
     * 
     * 
     * 下一帧刷新浮动层。
     */
    refreshHover() {
        this.__hoverLayerDirty = true;
    }

    /**
     * @method resize
     * Resize the canvas.
     * Should be invoked when container size is changed.
     * 
     * 
     * 重设画布的尺寸，当外部容器的尺寸发生了变化时需要调用此方法来重新设置画布的大小。
     * @param {Object} [options]
     * @param {Number|String} [options.width] Can be 'auto' (the same as null/undefined)
     * @param {Number|String} [options.height] Can be 'auto' (the same as null/undefined)
     */
    resize(options) {
        options = options || {};
        this.painter.resize(options.width, options.height);
        this.eventDispatcher.resize();
    }

    /**
     * @method getWidth
     * Get container width.
     * 
     * 获取容器的宽度。
     */
    getWidth() {
        return this.painter.getWidth();
    }

    /**
     * @method getHeight
     * Get container height.
     * 
     * 
     * 获取容器的高度。
     */
    getHeight() {
        return this.painter.getHeight();
    }

    /**
     * @private
     * @method configLayer
     * Change configuration of layer.
     * 
     * 
     * 修改层属性。
     * @param {String} qLevel
     * @param {Object} [config]
     * @param {String} [config.clearColor=0] Clear color
     * @param {String} [config.motionBlur=false] If enable motion blur
     * @param {Number} [config.lastFrameAlpha=0.7] Motion blur factor. Larger value cause longer trailer
    */
    configLayer(qLevel, config) {
        if (this.painter.configLayer) {
            this.painter.configLayer(qLevel, config);
        }
        this.dirty();
    }

    /**
     * @method setBackgroundColor
     * Set background color.
     * 
     * 
     * 设置背景颜色。
     * @param {String} backgroundColor
     */
    setBackgroundColor(backgroundColor) {
        if (this.painter.setBackgroundColor) {
            this.painter.setBackgroundColor(backgroundColor);
        }
        this.dirty();
    }

    /**
     * @method pathToImage
     * Converting a path to image.
     * It has much better performance of drawing image rather than drawing a vector path.
     * 
     * 
     * 把路径导出成图片。
     * 绘制图片的性能比绘制路径高很多。
     * @param {Path} path
     * @param {Number} dpr
     */
    pathToImage(path, dpr) {
        return this.painter.pathToImage(path, dpr);
    }

    /**
     * @method setCursorStyle
     * Set default cursor.
     * 
     * 
     * 设置默认的鼠标形状。
     * @param {String} [cursorStyle='move']
     */
    setCursorStyle(cursorStyle) {
        this.eventDispatcher.setCursorStyle(cursorStyle);
    }

    /**
     * @method clear
     * Clear all objects and the canvas.
     * 
     * 
     * 清空画布上的所有对象。
     */
    clear() {
        this.storage.delFromRoot();
        this.painter.clear();
    }
    
    /**
     * @method dispose
     * Dispose self.
     * 
     * 
     * 销毁自身。
     */
    dispose() {
        this.globalAnimationMgr.clear();
        this.storage.dispose();
        this.painter.dispose();
        this.eventDispatcher.dispose();

        this.globalAnimationMgr = null;
        this.storage = null;
        this.painter = null;
        this.eventDispatcher = null;

        delete instances[this.id];
    }
}

// ---------------------------
// Events on QuarkRenderer instance.
// ---------------------------
/**
 * @event onclick
 */
/**
 * @event onmouseover
 */
/**
 * @event onmouseout
 */
/**
 * @event onmousemove
 */
/**
 * @event onmousewheel
 */
/**
 * @event onmousedown
 */
/**
 * @event onmouseup
 */
/**
 * @event ondrag
 */
/**
 * @event ondragstart
 */
/**
 * @event ondragend
 */
/**
 * @event ondragenter
 */
/**
 * @event ondragleave
 */
/**
 * @event ondragover
 */
/**
 * @event ondrop
 */
/**
 * @event onpagemousemove
 */
/**
 * @event onpagemouseup
 */