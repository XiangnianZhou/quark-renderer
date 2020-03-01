/**
 * @abstract
 * @class qrenderer.event.Eventful
 * 
 * Provide event system for the classes that do not support events, the implementation here
 * is similar to DOM events, the classes which need event support should mixin the functions
 * here.
 * 
 * 为不支持事件机制的类提供事件支持，基本机制类似 DOM 事件，需要事件机制的类可以 mixin 此类中的工具函数。
 * 
 * @author @Kener-林峰 <kener.linfeng@gmail.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

let arrySlice = Array.prototype.slice;

/**
 * @method constructor Eventful
 * @param {Object} [eventProcessor] The object eventProcessor is the scope when
 *        `eventProcessor.xxx` called. 事件处理者，也就是当前事件处理函数执行时的作用域。
 * @param {Function} [eventProcessor.normalizeQuery]
 *        param: {String|Object} Raw query.
 *        return: {String|Object} Normalized query.
 * @param {Function} [eventProcessor.filter] Event will be dispatched only
 *        if it returns `true`.
 *        param: {String} eventType
 *        param: {String|Object} query
 *        return: {Boolean}
 * @param {Function} [eventProcessor.afterTrigger] Called after all handlers called.
 *        param: {String} eventType
 * @param {Function} [eventProcessor.afterListenerChanged] Called when any listener added or removed.
 *        param: {String} eventType
 */
let Eventful = function (eventProcessor) {
    this._$handlers = {};
    this._$eventProcessor = eventProcessor;
    this._$suspends = new Set();
};

Eventful.prototype = {

    constructor: Eventful,

    clearAll:function(){
        this._$handlers = {};
        this._$eventProcessor = null;
        this._$suspends = new Set();
    },

    /**
     * @method
     * The handler can only be triggered once, then removed.
     *
     * @param {String} event The event name.
     * @param {String|Object} [query] Condition used on event filter.
     * @param {Function} handler The event handler.
     * @param {Object} context
     */
    one: function (event, query, handler, context) {
        return on(this, event, query, handler, context, true);
    },

    /**
     * @method
     * Bind a handler.
     *
     * @param {String} event The event name.
     * @param {String|Object} [query] Condition used on event filter.
     * @param {Function} handler The event handler.
     * @param {Object} [context]
     */
    on: function (event, query, handler, context) {
        return on(this, event, query, handler, context, false);
    },

    /**
     * @method
     * Whether any handler has bound.
     *
     * @param  {String}  event
     * @return {Boolean}
     */
    isSilent: function (event) {
        let _h = this._$handlers;
        return !_h[event] || !_h[event].length;
    },

    /**
     * @method
     * Unbind a event.
     *
     * @param {String} [event] The event name.
     *        If no `event` input, "off" all listeners.
     * @param {Function} [handler] The event handler.
     *        If no `handler` input, "off" all listeners of the `event`.
     */
    off: function (event, handler) {
        let _h = this._$handlers;
        if (!event) {
            this._$handlers = {};
            return this;
        }
        if (handler) {
            if (_h[event]) {
                let newList = [];
                for (let i = 0, l = _h[event].length; i < l; i++) {
                    if (_h[event][i].h !== handler) {
                        newList.push(_h[event][i]);
                    }
                }
                _h[event] = newList;
            }
            if (_h[event] && _h[event].length === 0) {
                delete _h[event];
            }
        }else {
            delete _h[event];
        }
        callListenerChanged(this, event);
        return this;
    },

    /**
     * @method
     * Trigger an event.
     *
     * @param {String} eventName The event name.
     */
    trigger: function (eventName) {
        if(this._$suspends.has(eventName)){
            return;
        }
        let _h = this._$handlers[eventName];
        let eventProcessor = this._$eventProcessor;
        if (_h) {
            let args = arguments;
            let argLen = args.length;

            if (argLen > 3) {
                args = arrySlice.call(args, 1);
            }

            let len = _h.length;
            for (let i = 0; i < len;) {
                let hItem = _h[i];
                if (eventProcessor
                    && eventProcessor.filter
                    && hItem.query != null
                    && !eventProcessor.filter(eventName, hItem.query)
                ) {
                    i++;
                    continue;
                }

                // Optimize advise from backbone
                switch (argLen) {
                    case 1:
                        hItem.h.call(hItem.ctx);
                        break;
                    case 2:
                        hItem.h.call(hItem.ctx, args[1]);
                        break;
                    case 3:
                        hItem.h.call(hItem.ctx, args[1], args[2]);
                        break;
                    case 4:
                        hItem.h.call(hItem.ctx, args[1], args[2], args[3]);
                        break;
                    case 5:
                        hItem.h.call(hItem.ctx, args[1], args[2], args[3], args[4]);
                        break;
                    default:
                        hItem.h.apply(hItem.ctx, args);
                        break;
                }

                if (hItem.one) {
                    _h.splice(i, 1);
                    len--;
                }else {
                    i++;
                }
            }
        }

        eventProcessor && eventProcessor.afterTrigger && eventProcessor.afterTrigger(eventName);
        return this;
    },

    /**
     * 被挂起的事件不会触发。在鼠标和触摸屏交互的过程中，经常需要把某个事件临时挂起，避免误触。
     * @param {String} eventName 
     */
    suspend:function(eventName){
        this._$suspends.add(eventName);
    },

    /**
     * 恢复触发。
     * @param {String} eventName 
     */
    resume:function(eventName){
        this._$suspends.delete(eventName);
    },

    /**
     * @method
     * Dispatch a event with context, which is specified at the last parameter.
     *
     * @param {String} eventName The event name.
     */
    triggerWithContext: function (eventName) {
        let _h = this._$handlers[eventName];
        let eventProcessor = this._$eventProcessor;

        if (_h) {
            let args = arguments;
            let argLen = args.length;

            if (argLen > 4) {
                args = arrySlice.call(args, 1, args.length - 1);
            }
            let ctx = args[args.length - 1];

            let len = _h.length;
            for (let i = 0; i < len;) {
                let hItem = _h[i];
                if (eventProcessor
                    && eventProcessor.filter
                    && hItem.query != null
                    && !eventProcessor.filter(eventName, hItem.query)
                ) {
                    i++;
                    continue;
                }

                // Optimize advise from backbone
                switch (argLen) {
                    case 1:
                        hItem.h.call(ctx);
                        break;
                    case 2:
                        hItem.h.call(ctx, args[1]);
                        break;
                    case 3:
                        hItem.h.call(ctx, args[1], args[2]);
                        break;
                    case 4:
                        hItem.h.call(ctx, args[1], args[2], args[3]);
                        break;
                    case 5:
                        hItem.h.call(ctx, args[1], args[2], args[3], args[4]);
                        break;
                    default:
                        hItem.h.apply(ctx, args);
                        break;
                }

                if (hItem.one) {
                    _h.splice(i, 1);
                    len--;
                }else {
                    i++;
                }
            }
        }

        eventProcessor && eventProcessor.afterTrigger && eventProcessor.afterTrigger(eventName);
        return this;
    }
};

/**
 * @private
 * @method
 * @param {Element} eventful 
 * @param {String} eventType 
 */
function callListenerChanged(eventful, eventType) {
    let eventProcessor = eventful._$eventProcessor;
    if (eventProcessor && eventProcessor.afterListenerChanged) {
        eventProcessor.afterListenerChanged(eventType);
    }
}

/**
 * @private
 * @method
 * @param {*} host 
 * @param {*} query 
 */
function normalizeQuery(host, query) {
    let eventProcessor = host._$eventProcessor;
    if (query != null && eventProcessor && eventProcessor.normalizeQuery) {
        query = eventProcessor.normalizeQuery(query);
    }
    return query;
}

/**
 * @private
 * @method
 * @param {Element} eventful 
 * @param {Event} event 
 * @param {*} query 
 * @param {Function} handler 
 * @param {Object} context 
 * @param {Boolean} isOnce 
 */
function on(eventful, event, query, handler, context, isOnce) {
    let _h = eventful._$handlers;

    if (typeof query === 'function') {
        context = handler;
        handler = query;
        query = null;
    }

    if (!handler || !event) {
        return eventful;
    }

    query = normalizeQuery(eventful, query);

    if (!_h[event]) {
        _h[event] = [];
    }

    for (let i = 0; i < _h[event].length; i++) {
        if (_h[event][i].h === handler) {
            return eventful;
        }
    }

    let wrap = {
        h: handler,
        one: isOnce,
        query: query,
        ctx: context || eventful,
        // FIXME
        // Do not publish this feature util it is proved that it makes sense.
        callAtLast: handler.qrEventfulCallAtLast
    };

    let lastIndex = _h[event].length - 1;
    let lastWrap = _h[event][lastIndex];
    (lastWrap && lastWrap.callAtLast)
        ? _h[event].splice(lastIndex, 0, wrap)
        : _h[event].push(wrap);

    callListenerChanged(eventful, event);

    return eventful;
}

export default Eventful;