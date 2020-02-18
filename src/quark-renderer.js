import guid from './core/utils/guid';
import env from './core/env';
import QRendererEventHandler from './event/QRendererEventHandler';
import Storage from './Storage';
import CanvasPainter from './CanvasPainter';
import GlobalAnimationMgr from './animation/GlobalAnimationMgr';
import DomEventProxy from './event/DomEventProxy';
import * as textContain from './core/contain/text';

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

let useVML = !env.canvasSupported;

let painterMap = {
    canvas: CanvasPainter
};

// QuarkRenderer 实例map索引，浏览器中同一个 window 下的 QuarkRenderer 实例都存在这里。
let instances = {};

/**
 * @property {String}
 */
export let version = '4.1.2';

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
    }
    else {
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
         * @property {String}
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
         * @property {Storage}
         */
        this.storage = new Storage();
    
        let rendererType = options.renderer;
        // TODO:WebGL
        // TODO: remove vml
        if (useVML) {
            if (!painterMap.vml) {
                throw new Error('You need to require \'qrenderer/vml/vml\' to support IE8');
            }
            rendererType = 'vml';
        }else if (!rendererType || !painterMap[rendererType]) {
            rendererType = 'canvas';
        }

        //根据参数创建不同类型的 Painter 实例。
        this.painter = new painterMap[rendererType](this.host, this.storage, options, this.id);

        let handerProxy =null;
        if(typeof this.host.moveTo!=='function'){
            //代理DOM事件。
            if(!env.node && !env.worker && !env.wxa){
                handerProxy=new DomEventProxy(this.painter.getViewportRoot());
            }
        }else{
            // host is Context instance, override function.
            textContain.$override('measureText', function (text, font){
                self.font = font || textContain.DEFAULT_FONT;
                return self.measureText(text);
            });
        }
        
        //QuarkRenderer 自己封装的事件机制。
        this.eventHandler = new QRendererEventHandler(this.storage, this.painter, handerProxy, this.painter.root);
    
        /**
         * @property {GlobalAnimationMgr}
         * 利用 GlobalAnimationMgr 动画的 frame 事件渲染下一张画面， QuarkRenderer 依赖此机制来刷新 canvas 画布。
         * FROM MDN：
         * The window.requestAnimationFrame() method tells the browser that you wish 
         * to perform an animation and requests that the browser calls a specified 
         * function to update an animation before the next repaint. The method takes 
         * a callback as an argument to be invoked before the repaint.
         * 
         * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
         * 
         * NOTE: 这里有潜在的性能限制，由于 requestAnimationFrame 方法每秒回调60次，每次执行时间约 16ms
         * 如果在 16ms 的时间内无法渲染完一帧画面，会出现卡顿。也就是说， QuarkRenderer 引擎在同一张 canvas 上
         * 能够渲染的图形元素数量有上限。本机在 Chrome 浏览器中 Benchmark 的结果大约为 100 万个矩形会出现
         * 明显的卡顿。
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
        this._needsRefresh;
    
        // 修改 storage.delFromStorage, 每次删除元素之前删除动画
        // FIXME 有点ugly
        // What's going on here?
        let oldDelFromStorage = this.storage.delFromStorage;
        let oldAddToStorage = this.storage.addToStorage;
    
        this.storage.delFromStorage = function (el) {
            oldDelFromStorage.call(self.storage, el);
            el && el.removeSelfFromQr(self);
        };
    
        this.storage.addToStorage = function (el) {
            oldAddToStorage.call(self.storage, el);
            el.addSelfToQr(self);
        };    
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
        this.storage.addRoot(el);
        this._needsRefresh = true;
    }

    /**
     * @method
     * 删除元素
     * @param  {qrenderer/Element} el
     */
    remove(el) {
        this.storage.delRoot(el);
        this._needsRefresh = true;
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
        this._needsRefresh = true;
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
        this._needsRefresh = true;
    }

    /**
     * @private
     * @method
     * Repaint the canvas immediately
     */
    refreshImmediately() {
        // let start = new Date();
        // Clear needsRefresh ahead to avoid something wrong happens in refresh
        // Or it will cause qrenderer refreshes again and again.
        this._needsRefresh = this._needsRefreshHover = false;
        this.painter.refresh();
        // Avoid trigger qr.refresh in Element#beforeUpdate hook
        this._needsRefresh = this._needsRefreshHover = false;

        // let end = new Date();
        // let log = document.getElementById('log');
        // if (log) {
        //     log.innerHTML = log.innerHTML + '<br>' + (end - start);
        // }
    }

    /**
     * @method
     * Mark and repaint the canvas in the next frame of browser
     */
    refresh() {
        this._needsRefresh = true;
    }

    /**
     * @private
     * @method
     * Perform all refresh
     * 刷新 canvas 画面，此方法会在 window.requestAnimationFrame 方法中被不断调用。
     */
    flush() {
        let triggerRendered;

        if (this._needsRefresh) {      //是否需要全部重绘
            triggerRendered = true;
            this.refreshImmediately();
        }
        if (this._needsRefreshHover) { //只重绘特定的元素，提升性能
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
        this._needsRefreshHover = true;
    }

    /**
     * @private
     * @method
     * Refresh hover immediately
     */
    refreshHoverImmediately() {
        this._needsRefreshHover = false;
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
     * Stop and clear all animation immediately
     */
    clearAnimation() {
        this.globalAnimationMgr.clear();
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
        this.storage.delRoot();
        this.painter.clear();
    }

    /**
     * @method
     * Dispose self.
     */
    dispose() {
        this.globalAnimationMgr.stop();

        this.clear();
        this.storage.dispose();
        this.painter.dispose();
        this.eventHandler.dispose();

        this.globalAnimationMgr =
        this.storage =
        this.painter =
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