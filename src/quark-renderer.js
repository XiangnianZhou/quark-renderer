import QRendererEventHandler from './event/QRendererEventHandler';
import CanvasPainter from './canvas/CanvasPainter';
import GlobalAnimationMgr from './animation/GlobalAnimationMgr';
import DomEventProxy from './event/DomEventProxy';
import Storage from './Storage';
import * as textContain from './core/contain/text';
import guid from './core/utils/guid';
import env from './core/env';

/**
 * @class qrenderer.core.QuarkRenderer
 * QuarkRenderer, a high performance 2d drawing library.
 * Class QuarkRenderer is the global entry, every time you call qrenderer.init() will 
 * create an instance of QuarkRenderer class, each instance has an unique id.
 * 
 * QuarkRenderer 是一款高性能的 2d 渲染引擎。
 * QuarkRenderer 类是全局入口，每次调用 qrenderer.init() 会创建一个实例，
 * 每个 QuarkRenderer 实例有自己唯一的 ID。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

if(!env.canvasSupported){
    throw new Error("Need Canvas Environment.");
}

let painterMap = {
    canvas: CanvasPainter
};

// QuarkRenderer 实例map索引，浏览器中同一个 window 下的 QuarkRenderer 实例都存在这里。
let instances = {};

/**
 * @property {String}
 */
export let version = '1.0.11';

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
 * TODO: 不要export这个全局函数看起来也没有问题。
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
 * @param {String} id
 * @return {QuarkRenderer}
 */
export function getInstance(id) {
    return instances[id];
}

export function registerPainter(name, PainterClass) {
    painterMap[name] = PainterClass;
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
         * @property {Storage} storage
         */
        this.storage = new Storage();

        //根据参数创建不同类型的 Painter 实例。
        let rendererType = options.renderer;
        if (!rendererType || !painterMap[rendererType]) {
            rendererType = 'canvas';
        }
        this.painter = new painterMap[rendererType](this.host, this.storage, options, this.id);

        //利用代理拦截 DOM 事件，转发到 QuarkRenderer 自己封装的事件机制。
        let handerProxy =null;
        if(typeof this.host.moveTo!=='function'){
            if(!env.node && !env.worker && !env.wxa){
                handerProxy=new DomEventProxy(this.painter.getHost());
            }
        }else{
            // host is Context instance, override function.
            textContain.$override('measureText', function (text, font){
                self.font = font || textContain.DEFAULT_FONT;
                return self.host.measureText(text);
            });
        }
        /**
         * @private
         * @property {QRendererEventHandler} eventHandler
         * QuarkRenderer 自己封装的事件机制，这是画布内部的事件系统。
         */
        this.eventHandler = new QRendererEventHandler(this.storage, this.painter, handerProxy, this.painter.root);
    
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
         * @property {boolean}
         * @private
         */
        this._needRefresh=false;  
    }

    /**
     * @method
     * 获取实例唯一标识
     * @return {String}
     */
    getId() {
        return this.id;
    }

    /**
     * @method
     * 添加元素
     * @param  {qrenderer/Element} el
     */
    add(el) {
        el.__qr=this;
        this.storage.addToRoot(el);
        this.refresh();
    }

    /**
     * @method
     * 删除元素
     * @param  {qrenderer/Element} el
     */
    remove(el) {
        this.storage.delFromRoot(el);
        el.__qr=null;
        this.refresh();
    }

    /**
     * @private
     * @method
     * Change configuration of layer
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
        this.refresh();
    }

    /**
     * @method
     * Set background color
     * @param {String} backgroundColor
     */
    setBackgroundColor(backgroundColor) {
        if (this.painter.setBackgroundColor) {
            this.painter.setBackgroundColor(backgroundColor);
        }
        this.refresh();
    }

    /**
     * @private
     * @method
     * Repaint the canvas immediately
     */
    refreshImmediately() {
        // Clear needsRefresh ahead to avoid something wrong happens in refresh
        // Or it will cause qrenderer refreshes again and again.
        this._needRefresh = this._needRefreshHover = false;
        this.painter.refresh();
        // Avoid trigger qr.refresh in Element#beforeUpdate hook
        this._needRefresh = this._needRefreshHover = false;
    }

    /**
     * @method
     * Mark and repaint the canvas in the next frame of browser
     */
    refresh() {
        this._needRefresh = true;
    }

    /**
     * @private
     * @method
     * Perform all refresh
     * 刷新 canvas 画面，此方法会在 window.requestAnimationFrame 方法中被不断调用。
     */
    flush() {
        let triggerRendered;

        if (this._needRefresh) {      //是否需要全部重绘
            triggerRendered = true;
            this.refreshImmediately();
        }
        if (this._needRefreshHover) { //只重绘特定的元素，提升性能
            triggerRendered = true;
            this.refreshHoverImmediately();
        }

        triggerRendered && this.trigger('rendered');
    }

    /**
     * @private
     * @method
     * 与 Hover 相关的6个方法用来处理浮动层，当鼠标悬停在 canvas 中的元素上方时，可能会需要
     * 显示一些浮动的层来展现一些特殊的数据。
     * TODO:这里可能有点问题，Hover 一词可能指的是遮罩层，而不是浮动层，如果确认是遮罩，考虑
     * 把这里的 API 单词重构成 Mask。
     * 
     * Add element to hover layer
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
     * @method
     * Remove element from hover layer
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
     * @method
     * Find hovered element
     * @param {Number} x
     * @param {Number} y
     * @return {Object} {target, topTarget}
     */
    findHover(x, y) {
        return this.eventHandler.findHover(x, y);
    }

    /**
     * @private
     * @method
     * Clear all hover elements in hover layer
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
     * @method
     * Refresh hover in next frame
     */
    refreshHover() {
        this._needRefreshHover = true;
    }

    /**
     * @private
     * @method
     * Refresh hover immediately
     */
    refreshHoverImmediately() {
        this._needRefreshHover = false;
        this.painter.refreshHover && this.painter.refreshHover();
    }

    /**
     * @method
     * Resize the canvas.
     * Should be invoked when container size is changed
     * @param {Object} [options]
     * @param {Number|String} [options.width] Can be 'auto' (the same as null/undefined)
     * @param {Number|String} [options.height] Can be 'auto' (the same as null/undefined)
     */
    resize(options) {
        options = options || {};
        this.painter.resize(options.width, options.height);
        this.eventHandler.resize();
    }

    /**
     * @method
     * Get container width
     */
    getWidth() {
        return this.painter.getWidth();
    }

    /**
     * @method
     * Get container height
     */
    getHeight() {
        return this.painter.getHeight();
    }

    /**
     * @method
     * Converting a path to image.
     * It has much better performance of drawing image rather than drawing a vector path.
     * @param {graphic/Path} e
     * @param {Number} width
     * @param {Number} height
     */
    pathToImage(e, dpr) {
        return this.painter.pathToImage(e, dpr);
    }

    /**
     * @method
     * Set default cursor
     * @param {String} [cursorStyle='default'] 例如 crosshair
     */
    setCursorStyle(cursorStyle) {
        this.eventHandler.setCursorStyle(cursorStyle);
    }

    /**
     * @method
     * Bind event
     *
     * @param {String} eventName Event name
     * @param {Function} eventHandler Handler function
     * @param {Object} [context] Context object
     */
    on(eventName, eventHandler, context) {
        this.eventHandler.on(eventName, eventHandler, context);
    }

    /**
     * @method
     * Unbind event
     * @param {String} eventName Event name
     * @param {Function} [eventHandler] Handler function
     */
    off(eventName, eventHandler) {
        this.eventHandler.off(eventName, eventHandler);
    }

    /**
     * @method
     * Trigger event manually
     *
     * @param {String} eventName Event name
     * @param {event=} event Event object
     */
    trigger(eventName, event) {
        this.eventHandler.trigger(eventName, event);
    }

    /**
     * @method
     * Clear all objects and the canvas.
     */
    clear() {
        this.storage.delFromRoot();
        this.painter.clear();
    }
    
    /**
     * @method
     * Dispose self.
     */
    dispose() {
        this.globalAnimationMgr.clear();
        this.storage.dispose();
        this.painter.dispose();
        this.eventHandler.dispose();

        this.globalAnimationMgr = null;
        this.storage = null;
        this.painter = null;
        this.eventHandler = null;

        delete instances[this.id];
    }
}

// ---------------------------
// Events of qrenderer instance.
// ---------------------------
/**
 * @event onclick
 * @param {Function} null
 */
/**
 * @event onmouseover
 * @param {Function} null
 */
/**
 * @event onmouseout
 * @param {Function} null
 */
/**
 * @event onmousemove
 * @param {Function} null
 */
/**
 * @event onmousewheel
 * @param {Function} null
 */
/**
 * @event onmousedown
 * @param {Function} null
 */
/**
 * @event onmouseup
 * @param {Function} null
 */
/**
 * @event ondrag
 * @param {Function} null
 */
/**
 * @event ondragstart
 * @param {Function} null
 */
/**
 * @event ondragend
 * @param {Function} null
 */
/**
 * @event ondragenter
 * @param {Function} null
 */
/**
 * @event ondragleave
 * @param {Function} null
 */
/**
 * @event ondragover
 * @param {Function} null
 */
/**
 * @event ondrop
 * @param {Function} null
 */
/**
 * @event onpagemousemove
 * @param {Function} null
 */
/**
 * @event onpagemouseup
 * @param {Function} null
 */