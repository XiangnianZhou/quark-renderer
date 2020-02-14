import * as dataUtil from '../core/utils/dataStructureUtil';
import * as classUtil from '../core/utils/classUtil';
import * as vec2 from '../core/utils/vector';
import * as eventTool from '../core/utils/eventUtil';
import MultiDragDrop from './MultiDragDrop';
import Eventful from './Eventful';
import GestureMgr from '../core/GestureMgr';

/**
 * @class zrender.event.ZRenderEventHandler
 * Canvas 内置的API只在 canvas 实例本身上面触发事件，对画布内部的画出来的元素没有提供事件支持。
 * ZRenderEventHandler.js 用来封装画布内部元素的事件处理逻辑，核心思路是，在 canvas 收到事件之后，派发给指定的元素，
 * 然后再进行冒泡，从而模拟出原生 DOM 事件的行为。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

var SILENT = 'silent';

/**
 * @private
 * @method
 * @param {String} eveType 
 * @param {Object} targetInfo 
 * @param {Event} event 
 */
function makeEventPacket(eveType, targetInfo, event) {
    return {
        type: eveType,
        event: event,
        // target can only be an element that is not silent.
        target: targetInfo.target,
        // topTarget can be a silent element.
        topTarget: targetInfo.topTarget,
        cancelBubble: false,
        offsetX: event.zrX,
        offsetY: event.zrY,
        gestureEvent: event.gestureEvent,
        pinchX: event.pinchX,
        pinchY: event.pinchY,
        pinchScale: event.pinchScale,
        wheelDelta: event.zrDelta,
        zrByTouch: event.zrByTouch,
        zrIsFromLocal: event.zrIsFromLocal,
        which: event.which,
        stop: stopEvent
    };
}

/**
 * @private
 * @method
 * @param {Event} event  
 */
function stopEvent(event) {
    eventTool.stop(this.event);
}

function EmptyProxy() {}
EmptyProxy.prototype.dispose = function () {};

var handlerNames = [
    'click', 'dblclick', 'mousewheel', 'mouseout',
    'mouseup', 'mousedown', 'mousemove', 'contextmenu',
    'pagemousemove', 'pagemouseup',
    'pagekeydown','pagekeyup'
];

/**
 * @method
 * 监听页面上触发的事件，转换成当前实例自己触发的事件
 * @param {String} pageEventName 
 * @param {Event} event 
 */
function pageEventHandler(pageEventName, event) {
    this.trigger(pageEventName, makeEventPacket(pageEventName, {}, event));
}

/**
 * @method
 * 鼠标是否在指定的元素上方。
 * @param {Displayable} displayable 
 * @param {Number} x 
 * @param {Number} y 
 */
function isHover(displayable, x, y) {
    if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
        var el = displayable;
        var isSilent;
        while (el) {
            // If clipped by ancestor.
            // FIXME: If clipPath has neither stroke nor fill,
            // el.clipPath.contain(x, y) will always return false.
            if (el.clipPath && !el.clipPath.contain(x, y)) {
                return false;
            }
            if (el.silent) {
                isSilent = true;
            }
            el = el.parent;
        }
        return isSilent ? SILENT : true;
    }

    return false;
}

/**
 * @private
 * @method
 * @param {Function} handlerInstance 
 */
function afterListenerChanged(handlerInstance) {
    //监听整个页面上的事件
    var allSilent = handlerInstance.isSilent('pagemousemove')
        && handlerInstance.isSilent('pagemouseup')
        && handlerInstance.isSilent('pagekeydown')
        && handlerInstance.isSilent('pagekeyup');
    var proxy = handlerInstance.proxy;
    proxy && proxy.togglePageEvent && proxy.togglePageEvent(!allSilent);
}

/**
 * @method constructor ZRenderEventHandler
 * @param {Storage} storage Storage instance.
 * @param {Painter} painter Painter instance.
 * @param {HandlerProxy} proxy HandlerProxy instance.
 * @param {HTMLElement} painterRoot painter.root (not painter.getViewportRoot()).
 */
var ZRenderEventHandler = function (storage, painter, proxy, painterRoot) {
    Eventful.call(this, {
        afterListenerChanged: dataUtil.bind(afterListenerChanged, null, this)
    });

    /**
     * @property storage
     */
    this.storage = storage;

    /**
     * @property painter
     */
    this.painter = painter;

    /**
     * @property painterRoot
     */
    this.painterRoot = painterRoot;

    proxy = proxy || new EmptyProxy();

    /**
     * @property proxy
     * Proxy of event. can be Dom, WebGLSurface, etc.
     */
    this.proxy = null;

    /**
     * @private 
     * @property {Object} _hovered
     */
    this._hovered = {};

    /**
     * @private
     * @property {Date} _lastTouchMoment
     */
    this._lastTouchMoment;

    /**
     * @private
     * @property {Number} _lastX
     */
    this._lastX;

    /**
     * @private
     * @property {Number} _lastY
     */
    this._lastY;

    /**
     * @private
     * @property _gestureMgr
     */
    this._gestureMgr;

    new MultiDragDrop(this);

    this.setHandlerProxy(proxy);
};

ZRenderEventHandler.prototype = {

    constructor: ZRenderEventHandler,

    /**
     * @method setHandlerProxy
     * @param {*} proxy 
     */
    setHandlerProxy: function (proxy) {
        if (this.proxy) {
            this.proxy.dispose();
        }

        if (proxy) {
            dataUtil.each(handlerNames, function (name) {
                // 监听 Proxy 上面派发的原生DOM事件，转发给本类的处理方法。
                proxy.on && proxy.on(name, this[name], this);
            }, this);
            // Attach handler
            proxy.handler = this;
        }
        this.proxy = proxy;
    },

    /**
     * @method mousemove
     * @param {*} proxy 
     */
    mousemove: function (event) {
        var x = event.zrX;
        var y = event.zrY;

        var lastHovered = this._hovered;
        var lastHoveredTarget = lastHovered.target;

        // If lastHoveredTarget is removed from zr (detected by '__zr') by some API call
        // (like 'setOption' or 'dispatchAction') in event handlers, we should find
        // lastHovered again here. Otherwise 'mouseout' can not be triggered normally.
        // See #6198.
        if (lastHoveredTarget && !lastHoveredTarget.__zr) {
            lastHovered = this.findHover(lastHovered.x, lastHovered.y);
            lastHoveredTarget = lastHovered.target;
        }

        var hovered = this._hovered = this.findHover(x, y);
        var hoveredTarget = hovered.target;

        var proxy = this.proxy;
        proxy.setCursor && proxy.setCursor(hoveredTarget ? hoveredTarget.cursor : 'default');

        // Mouse out on previous hovered element
        if (lastHoveredTarget && hoveredTarget !== lastHoveredTarget) {
            this.dispatchToElement(lastHovered, 'mouseout', event);
        }

        // Mouse moving on one element
        this.dispatchToElement(hovered, 'mousemove', event);

        // Mouse over on a new element
        if (hoveredTarget && hoveredTarget !== lastHoveredTarget) {
            this.dispatchToElement(hovered, 'mouseover', event);
        }
    },

    /**
     * @method mouseout
     * @param {*} proxy 
     */
    mouseout: function (event) {
        this.dispatchToElement(this._hovered, 'mouseout', event);

        // There might be some doms created by upper layer application
        // at the same level of painter.getViewportRoot() (e.g., tooltip
        // dom created by echarts), where 'globalout' event should not
        // be triggered when mouse enters these doms. (But 'mouseout'
        // should be triggered at the original hovered element as usual).
        var element = event.toElement || event.relatedTarget;
        var innerDom;
        do {
            element = element && element.parentNode;
        }
        while (element && element.nodeType !== 9 && !(
            innerDom = element === this.painterRoot
        ));

        !innerDom && this.trigger('globalout', {event: event});
    },

    pagemousemove: dataUtil.curry(pageEventHandler, 'pagemousemove'),

    pagemouseup: dataUtil.curry(pageEventHandler, 'pagemouseup'),

    pagekeydown: dataUtil.curry(pageEventHandler, 'pagekeydown'),
    
    pagekeyup: dataUtil.curry(pageEventHandler, 'pagekeyup'),

    /**
     * @method resize
     * @param {Event} event 
     */
    resize: function (event) {
        this._hovered = {};
    },

    /**
     * @method dispatch
     * Dispatch event
     * @param {String} eventName
     * @param {Event} eventArgs
     */
    dispatch: function (eventName, eventArgs) {
        var handler = this[eventName];
        handler && handler.call(this, eventArgs);
    },

    /**
     * @method dispose
     */
    dispose: function () {
        this.proxy.dispose();
        this.storage = null;
        this.proxy = null;
        this.painter = null;
    },

    /**
     * @method setCursorStyle
     * 设置默认的cursor style
     * @param {String} [cursorStyle='default'] 例如 crosshair
     */
    setCursorStyle: function (cursorStyle) {
        var proxy = this.proxy;
        proxy.setCursor && proxy.setCursor(cursorStyle);
    },

    /**
     * @private
     * @method dispatchToElement
     * 事件分发代理，把事件分发给 canvas 中绘制的元素。
     *
     * @param {Object} targetInfo {target, topTarget} 目标图形元素
     * @param {String} eventName 事件名称
     * @param {Object} event 事件对象
     */
    dispatchToElement: function (targetInfo, eventName, event) {
        targetInfo = targetInfo || {};
        var el = targetInfo.target;
        if (el && el.silent) {
            return;
        }
        var eventHandler = 'on' + eventName;
        var eventPacket = makeEventPacket(eventName, targetInfo, event);

        //模拟DOM中的事件冒泡行为，事件一直向上层传播，直到没有父层节点为止。
        while (el) {
            el[eventHandler]
                && (eventPacket.cancelBubble = el[eventHandler].call(el, eventPacket));

            el.trigger(eventName, eventPacket);

            el = el.parent;

            if (eventPacket.cancelBubble) {
                break;
            }
        }

        if (!eventPacket.cancelBubble) {
            // 冒泡到顶级 zrender 对象
            this.trigger(eventName, eventPacket);
            // 分发事件到用户自定义层
            // 用户有可能在全局 click 事件中 dispose，所以需要判断下 painter 是否存在
            this.painter && this.painter.eachOtherLayer(function (layer) {
                if (typeof (layer[eventHandler]) === 'function') {
                    layer[eventHandler].call(layer, eventPacket);
                }
                if (layer.trigger) {
                    layer.trigger(eventName, eventPacket);
                }
            });
        }
    },

    /**
     * @method findHover
     * @param {Number} x
     * @param {Number} y
     * @param {Displayable} exclude
     * @return {Element}
     */
    findHover: function (x, y, exclude) {
        var list = this.storage.getDisplayList();
        var out = {x: x, y: y};

        //NOTE: 在元素数量非常庞大的时候，如 100 万个元素，这里的 for 循环会很慢，基本不能响应鼠标事件。
        for (var i = list.length - 1; i >= 0; i--) {
            var hoverCheckResult;
            if (list[i] !== exclude
                // getDisplayList may include ignored item in VML mode
                && !list[i].ignore
                && (hoverCheckResult = isHover(list[i], x, y))
            ) {
                !out.topTarget && (out.topTarget = list[i]);
                if (hoverCheckResult !== SILENT) {
                    out.target = list[i];
                    break;
                }
            }
        }

        return out;
    },

    /**
     * @method processGesture
     * @param {Event} event 
     * @param {String} phase 
     */
    processGesture: function (event, phase) {
        if (!this._gestureMgr) {
            this._gestureMgr = new GestureMgr();
        }
        var gestureMgr = this._gestureMgr;

        phase === 'start' && gestureMgr.clear();

        var gestureInfo = gestureMgr.recognize(
            event,
            this.findHover(event.zrX, event.zrY, null).target,
            this.proxy.dom
        );

        phase === 'end' && gestureMgr.clear();

        // Do not do any preventDefault here. Upper application do that if necessary.
        if (gestureInfo) {
            var type = gestureInfo.type;
            event.gestureEvent = type;

            this.dispatchToElement({target: gestureInfo.target}, type, gestureInfo.event);
        }
    }
};

// Common handlers
dataUtil.each(['click', 'mousedown', 
    'mouseup', 'mousewheel', 
    'dblclick', 'contextmenu'], function (name) {
    ZRenderEventHandler.prototype[name] = function (event) {
        // Find hover again to avoid click event is dispatched manually. Or click is triggered without mouseover
        var hovered = this.findHover(event.zrX, event.zrY);
        var hoveredTarget = hovered.target;

        if (name === 'mousedown') {
            this._downEl = hoveredTarget;
            this._downPoint = [event.zrX, event.zrY];
            // In case click triggered before mouseup
            this._upEl = hoveredTarget;
        }
        else if (name === 'mouseup') {
            this._upEl = hoveredTarget;
        }
        else if (name === 'click') {
            if (this._downEl !== this._upEl
                // Original click event is triggered on the whole canvas element,
                // including the case that `mousedown` - `mousemove` - `mouseup`,
                // which should be filtered, otherwise it will bring trouble to
                // pan and zoom.
                || !this._downPoint
                // Arbitrary value
                || vec2.dist(this._downPoint, [event.zrX, event.zrY]) > 4
            ) {
                return;
            }
            this._downPoint = null;
        }

        //把事件派发给目标元素
        this.dispatchToElement(hovered, name, event);
    };
});

classUtil.mixin(ZRenderEventHandler, Eventful);

export default ZRenderEventHandler;
