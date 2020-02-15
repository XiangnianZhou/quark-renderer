(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.zrender = {})));
}(this, (function (exports) { 'use strict';

/**
 * zrender: 生成唯一id
 *
 * @author errorrik (errorrik@gmail.com)
 */

var idStart = 0x0907;

var guid = function () {
    return idStart++;
};

/**
 * echarts设备环境识别
 *
 * @desc echarts基于Canvas，纯Javascript图表库，提供直观，生动，可交互，可个性化定制的数据统计图表。
 * @author firede[firede@firede.us]
 * @desc thanks zepto.
 */

/* global wx */

var env = {};

if (typeof wx === 'object' && typeof wx.getSystemInfoSync === 'function') {
    // In Weixin Application
    env = {
        browser: {},
        os: {},
        node: false,
        wxa: true, // Weixin Application
        canvasSupported: true,
        svgSupported: false,
        touchEventsSupported: true,
        domSupported: false
    };
}
else if (typeof document === 'undefined' && typeof self !== 'undefined') {
    // In worker
    env = {
        browser: {},
        os: {},
        node: false,
        worker: true,
        canvasSupported: true,
        domSupported: false
    };
}
else if (typeof navigator === 'undefined') {
    // In node
    env = {
        browser: {},
        os: {},
        node: true,
        worker: false,
        // Assume canvas is supported
        canvasSupported: true,
        svgSupported: true,
        domSupported: false
    };
}
else {
    env = detect(navigator.userAgent);
}

var env$1 = env;

// Zepto.js
// (c) 2010-2013 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.

function detect(ua) {
    var os = {};
    var browser = {};
    // var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
    // var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    // var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    // var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    // var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    // var webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
    // var touchpad = webos && ua.match(/TouchPad/);
    // var kindle = ua.match(/Kindle\/([\d.]+)/);
    // var silk = ua.match(/Silk\/([\d._]+)/);
    // var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
    // var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
    // var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
    // var playbook = ua.match(/PlayBook/);
    // var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
    var firefox = ua.match(/Firefox\/([\d.]+)/);
    // var safari = webkit && ua.match(/Mobile\//) && !chrome;
    // var webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;
    var ie = ua.match(/MSIE\s([\d.]+)/)
        // IE 11 Trident/7.0; rv:11.0
        || ua.match(/Trident\/.+?rv:(([\d.]+))/);
    var edge = ua.match(/Edge\/([\d.]+)/); // IE 12 and 12+

    var weChat = (/micromessenger/i).test(ua);

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    // if (browser.webkit = !!webkit) browser.version = webkit[1];

    // if (android) os.android = true, os.version = android[2];
    // if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
    // if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
    // if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    // if (webos) os.webos = true, os.version = webos[2];
    // if (touchpad) os.touchpad = true;
    // if (blackberry) os.blackberry = true, os.version = blackberry[2];
    // if (bb10) os.bb10 = true, os.version = bb10[2];
    // if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
    // if (playbook) browser.playbook = true;
    // if (kindle) os.kindle = true, os.version = kindle[1];
    // if (silk) browser.silk = true, browser.version = silk[1];
    // if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
    // if (chrome) browser.chrome = true, browser.version = chrome[1];
    if (firefox) {
        browser.firefox = true;
        browser.version = firefox[1];
    }
    // if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true;
    // if (webview) browser.webview = true;

    if (ie) {
        browser.ie = true;
        browser.version = ie[1];
    }

    if (edge) {
        browser.edge = true;
        browser.version = edge[1];
    }

    // It is difficult to detect WeChat in Win Phone precisely, because ua can
    // not be set on win phone. So we do not consider Win Phone.
    if (weChat) {
        browser.weChat = true;
    }

    // os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
    //     (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
    // os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos ||
    //     (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
    //     (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

    return {
        browser: browser,
        os: os,
        node: false,
        // 原生canvas支持，改极端点了
        // canvasSupported : !(browser.ie && parseFloat(browser.version) < 9)
        canvasSupported: !!document.createElement('canvas').getContext,
        svgSupported: typeof SVGRect !== 'undefined',
        // works on most browsers
        // IE10/11 does not support touch event, and MS Edge supports them but not by
        // default, so we dont check navigator.maxTouchPoints for them here.
        touchEventsSupported: 'ontouchstart' in window && !browser.ie && !browser.edge,
        // <http://caniuse.com/#search=pointer%20event>.
        pointerEventsSupported: 'onpointerdown' in window
            // Firefox supports pointer but not by default, only MS browsers are reliable on pointer
            // events currently. So we dont use that on other browsers unless tested sufficiently.
            // Although IE 10 supports pointer event, it use old style and is different from the
            // standard. So we exclude that. (IE 10 is hardly used on touch device)
            && (browser.edge || (browser.ie && browser.version >= 11)),
        // passiveSupported: detectPassiveSupport()
        domSupported: typeof document !== 'undefined'
    };
}

// See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
// function detectPassiveSupport() {
//     // Test via a getter in the options object to see if the passive property is accessed
//     var supportsPassive = false;
//     try {
//         var opts = Object.defineProperty({}, 'passive', {
//             get: function() {
//                 supportsPassive = true;
//             }
//         });
//         window.addEventListener('testPassive', function() {}, opts);
//     } catch (e) {
//     }
//     return supportsPassive;
// }

/**
 * 用来操作数据的一些工具函数。
 * @module zrender/core/dataStructureUtil
 */

// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
    '[object Function]': 1,
    '[object RegExp]': 1,
    '[object Date]': 1,
    '[object Error]': 1,
    '[object CanvasGradient]': 1,
    '[object CanvasPattern]': 1,
    // For node-canvas
    '[object Image]': 1,
    '[object Canvas]': 1
};

var TYPED_ARRAY = {
    '[object Int8Array]': 1,
    '[object Uint8Array]': 1,
    '[object Uint8ClampedArray]': 1,
    '[object Int16Array]': 1,
    '[object Uint16Array]': 1,
    '[object Int32Array]': 1,
    '[object Uint32Array]': 1,
    '[object Float32Array]': 1,
    '[object Float64Array]': 1
};

var objToString = Object.prototype.toString;

var arrayProto = Array.prototype;
var nativeForEach = arrayProto.forEach;
var nativeFilter = arrayProto.filter;
var nativeSlice = arrayProto.slice;
var nativeMap = arrayProto.map;
var nativeReduce = arrayProto.reduce;

// Avoid assign to an exported variable, for transforming to cjs.
var methods = {};

function $override(name, fn) {
    // Clear ctx instance for different environment
    if (name === 'createCanvas') {
        _ctx = null;
    }

    methods[name] = fn;
}

/**
 * Those data types can be cloned:
 *     Plain object, Array, TypedArray, number, string, null, undefined.
 * Those data types will be assgined using the orginal data:
 *     BUILTIN_OBJECT
 * Instance of user defined class will be cloned to a plain object, without
 * properties in prototype.
 * Other data types is not supported (not sure what will happen).
 *
 * Caution: do not support clone Date, for performance consideration.
 * (There might be a large number of date in `series.data`).
 * So date should not be modified in and out of echarts.
 *
 * @param {*} source
 * @return {*} new
 */
function clone(source) {
    if (source == null || typeof source !== 'object') {
        return source;
    }

    var result = source;
    var typeStr = objToString.call(source);

    if (typeStr === '[object Array]') {
        if (!isPrimitive(source)) {
            result = [];
            for (var i = 0, len = source.length; i < len; i++) {
                result[i] = clone(source[i]);
            }
        }
    }
    else if (TYPED_ARRAY[typeStr]) {
        if (!isPrimitive(source)) {
            var Ctor = source.constructor;
            if (source.constructor.from) {
                result = Ctor.from(source);
            }
            else {
                result = new Ctor(source.length);
                for (var i = 0, len = source.length; i < len; i++) {
                    result[i] = clone(source[i]);
                }
            }
        }
    }
    else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
        result = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = clone(source[key]);
            }
        }
    }

    return result;
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */
function merge(target, source, overwrite) {
    // We should escapse that source is string
    // and enter for ... in ...
    if (!isObject(source) || !isObject(target)) {
        return overwrite ? clone(source) : target;
    }

    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var targetProp = target[key];
            var sourceProp = source[key];

            if (isObject(sourceProp)
                && isObject(targetProp)
                && !isArray(sourceProp)
                && !isArray(targetProp)
                && !isDom(sourceProp)
                && !isDom(targetProp)
                && !isBuiltInObject(sourceProp)
                && !isBuiltInObject(targetProp)
                && !isPrimitive(sourceProp)
                && !isPrimitive(targetProp)
            ) {
                // 如果需要递归覆盖，就递归调用merge
                merge(targetProp, sourceProp, overwrite);
            }
            else if (overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                // NOTE，在 target[key] 不存在的时候也是直接覆盖
                target[key] = clone(source[key], true);
            }
        }
    }

    return target;
}

/**
 * @param {Array} targetAndSources The first item is target, and the rests are source.
 * @param {boolean} [overwrite=false]
 * @return {*} target
 */
function mergeAll(targetAndSources, overwrite) {
    var result = targetAndSources[0];
    for (var i = 1, len = targetAndSources.length; i < len; i++) {
        result = merge(result, targetAndSources[i], overwrite);
    }
    return result;
}

/**
 * @param {*} target
 * @param {*} source
 * @memberOf module:zrender/core/dataStructureUtil
 */
function extend(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

var createCanvas = function () {
    return methods.createCanvas();
};

methods.createCanvas = function () {
    return document.createElement('canvas');
};

// FIXME
var _ctx;

function getContext() {
    if (!_ctx) {
        // Use util.createCanvas instead of createCanvas
        // because createCanvas may be overwritten in different environment
        _ctx = createCanvas().getContext('2d');
    }
    return _ctx;
}

/**
 * 查询数组中元素的index
 * @memberOf module:zrender/core/dataStructureUtil
 */
function indexOf(array, value) {
    if (array) {
        if (array.indexOf) {
            return array.indexOf(value);
        }
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === value) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * Consider typed array.
 * @param {Array|TypedArray} data
 */
function isArrayLike(data) {
    if (!data) {
        return;
    }
    if (typeof data === 'string') {
        return false;
    }
    return typeof data.length === 'number';
}

/**
 * 数组或对象遍历
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */
function each(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.forEach && obj.forEach === nativeForEach) {
        obj.forEach(cb, context);
    }
    else if (obj.length === +obj.length) {
        for (var i = 0, len = obj.length; i < len; i++) {
            cb.call(context, obj[i], i, obj);
        }
    }
    else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cb.call(context, obj[key], key, obj);
            }
        }
    }
}

/**
 * 数组映射
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function map(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.map && obj.map === nativeMap) {
        return obj.map(cb, context);
    }
    else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            result.push(cb.call(context, obj[i], i, obj));
        }
        return result;
    }
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Array} obj
 * @param {Function} cb
 * @param {Object} [memo]
 * @param {*} [context]
 * @return {Array}
 */
function reduce(obj, cb, memo, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.reduce && obj.reduce === nativeReduce) {
        return obj.reduce(cb, memo, context);
    }
    else {
        for (var i = 0, len = obj.length; i < len; i++) {
            memo = cb.call(context, memo, obj[i], i, obj);
        }
        return memo;
    }
}

/**
 * 数组过滤
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function filter(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.filter && obj.filter === nativeFilter) {
        return obj.filter(cb, context);
    }
    else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            if (cb.call(context, obj[i], i, obj)) {
                result.push(obj[i]);
            }
        }
        return result;
    }
}

/**
 * 数组项查找
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {*}
 */
function find(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    for (var i = 0, len = obj.length; i < len; i++) {
        if (cb.call(context, obj[i], i, obj)) {
            return obj[i];
        }
    }
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Function} func
 * @param {*} context
 * @return {Function}
 */
function bind(func, context) {
    var args = nativeSlice.call(arguments, 2);
    return function () {
        return func.apply(context, args.concat(nativeSlice.call(arguments)));
    };
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Function} func
 * @return {Function}
 */
function curry(func) {
    var args = nativeSlice.call(arguments, 1);
    return function () {
        return func.apply(this, args.concat(nativeSlice.call(arguments)));
    };
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} value
 * @return {boolean}
 */
function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} value
 * @return {boolean}
 */
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} value
 * @return {boolean}
 */
function isString(value) {
    return objToString.call(value) === '[object String]';
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} value
 * @return {boolean}
 */
function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return type === 'function' || (!!value && type === 'object');
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} value
 * @return {boolean}
 */
function isBuiltInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} value
 * @return {boolean}
 */
function isTypedArray(value) {
    return !!TYPED_ARRAY[objToString.call(value)];
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {*} value
 * @return {boolean}
 */
function isDom(value) {
    return typeof value === 'object'
        && typeof value.nodeType === 'number'
        && typeof value.ownerDocument === 'object';
}

/**
 * Whether is exactly NaN. Notice isNaN('a') returns true.
 * @param {*} value
 * @return {boolean}
 */
function eqNaN(value) {
    /* eslint-disable-next-line no-self-compare */
    return value !== value;
}

/**
 * If value1 is not null, then return value1, otherwise judget rest of values.
 * Low performance.
 * @memberOf module:zrender/core/dataStructureUtil
 * @return {*} Final value
 */
function retrieve(values) {
    for (var i = 0, len = arguments.length; i < len; i++) {
        if (arguments[i] != null) {
            return arguments[i];
        }
    }
}

function retrieve2(value0, value1) {
    return value0 != null
        ? value0
        : value1;
}

function retrieve3(value0, value1, value2) {
    return value0 != null
        ? value0
        : value1 != null
        ? value1
        : value2;
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Array} arr
 * @param {Number} startIndex
 * @param {Number} endIndex
 * @return {Array}
 */
function slice() {
    return Function.call.apply(nativeSlice, arguments);
}

/**
 * Normalize css liked array configuration
 * e.g.
 *  3 => [3, 3, 3, 3]
 *  [4, 2] => [4, 2, 4, 2]
 *  [4, 3, 2] => [4, 3, 2, 3]
 * @param {number|Array.<Number>} val
 * @return {Array<Number>}
 */
function normalizeCssArray(val) {
    if (typeof (val) === 'number') {
        return [val, val, val, val];
    }
    var len = val.length;
    if (len === 2) {
        // vertical | horizontal
        return [val[0], val[1], val[0], val[1]];
    }
    else if (len === 3) {
        // top | horizontal | bottom
        return [val[0], val[1], val[2], val[1]];
    }
    return val;
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {boolean} condition
 * @param {String} message
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {String} str string to be trimed
 * @return {String} trimed string
 */
function trim(str) {
    if (str == null) {
        return null;
    }
    else if (typeof str.trim === 'function') {
        return str.trim();
    }
    else {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
}

var primitiveKey = '__ec_primitive__';
/**
 * Set an object as primitive to be ignored traversing children in clone or merge
 */
function setAsPrimitive(obj) {
    obj[primitiveKey] = true;
}

function isPrimitive(obj) {
    return obj[primitiveKey];
}

/**
 * @constructor
 * @param {Object} obj Only apply `ownProperty`.
 */
function HashMap(obj) {
    var isArr = isArray(obj);
    // Key should not be set on this, otherwise
    // methods get/set/... may be overrided.
    this.data = {};
    var thisMap = this;

    (obj instanceof HashMap)
        ? obj.each(visit)
        : (obj && each(obj, visit));

    function visit(value, key) {
        isArr ? thisMap.set(value, key) : thisMap.set(key, value);
    }
}

HashMap.prototype = {
    constructor: HashMap,
    // Do not provide `has` method to avoid defining what is `has`.
    // (We usually treat `null` and `undefined` as the same, different
    // from ES6 Map).
    get: function (key) {
        return this.data.hasOwnProperty(key) ? this.data[key] : null;
    },
    set: function (key, value) {
        // Comparing with invocation chaining, `return value` is more commonly
        // used in this case: `var someVal = map.set('a', genVal());`
        return (this.data[key] = value);
    },
    // Although util.each can be performed on this hashMap directly, user
    // should not use the exposed keys, who are prefixed.
    each: function (cb, context) {
        context !== void 0 && (cb = bind(cb, context));
        /* eslint-disable guard-for-in */
        for (var key in this.data) {
            this.data.hasOwnProperty(key) && cb(this.data[key], key);
        }
        /* eslint-enable guard-for-in */
    },
    // Do not use this method if performance sensitive.
    removeKey: function (key) {
        delete this.data[key];
    }
};

function createHashMap(obj) {
    return new HashMap(obj);
}

function concatArray(a, b) {
    var newArray = new a.constructor(a.length + b.length);
    for (var i = 0; i < a.length; i++) {
        newArray[i] = a[i];
    }
    var offset = a.length;
    for (i = 0; i < b.length; i++) {
        newArray[i + offset] = b[i];
    }
    return newArray;
}


function noop() {}

/**
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} percent
 * @return {Number}
 */
function interpolateNumber(p0, p1, percent) {
    return (p1 - p0) * percent + p0;
}

/**
 * @param  {String} p0
 * @param  {String} p1
 * @param  {Number} percent
 * @return {String}
 */
function interpolateString(p0, p1, percent) {
    return percent > 0.5 ? p1 : p0;
}

/**
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Number} percent
 * @param  {Array} out
 * @param  {Number} arrDim
 */
function interpolateArray(p0, p1, percent, out, arrDim) {
    var len = p0.length;
    if(!len) return;
    if (arrDim === 1) {
        for (var i = 0; i < len; i++) {
            out[i] = interpolateNumber(p0[i], p1[i], percent);
        }
    }else {
        var len2 = p0[0].length;
        if(!len2) return;
        for (var i = 0; i < len; i++) {
            if(out[i]===undefined){
                return;
            }
            for (var j = 0; j < len2; j++) {
                out[i][j] = interpolateNumber(p0[i][j], p1[i][j], percent);
            }
        }
    }
}

// arr0 is source array, arr1 is target array.
// Do some preprocess to avoid error happened when interpolating from arr0 to arr1
function fillArr(arr0, arr1, arrDim) {
    var arr0Len = arr0.length;
    var arr1Len = arr1.length;
    if (arr0Len !== arr1Len) {
        // FIXME Not work for TypedArray
        var isPreviousLarger = arr0Len > arr1Len;
        if (isPreviousLarger) {
            // Cut the previous
            arr0.length = arr1Len;
        }
        else {
            // Fill the previous
            for (var i = arr0Len; i < arr1Len; i++) {
                arr0.push(
                    arrDim === 1 ? arr1[i] : Array.prototype.slice.call(arr1[i])
                );
            }
        }
    }
    // Handling NaN value
    var len2 = arr0[0] && arr0[0].length;
    for (var i = 0; i < arr0.length; i++) {
        if (arrDim === 1) {
            if (isNaN(arr0[i])) {
                arr0[i] = arr1[i];
            }
        }
        else {
            for (var j = 0; j < len2; j++) {
                if (isNaN(arr0[i][j])) {
                    arr0[i][j] = arr1[i][j];
                }
            }
        }
    }
}


/**
 * @param  {Array} arr0
 * @param  {Array} arr1
 * @param  {Number} arrDim
 * @return {boolean}
 */
function isArraySame(arr0, arr1, arrDim) {
    if (arr0 === arr1) {
        return true;
    }
    var len = arr0.length;
    if (len !== arr1.length) {
        return false;
    }
    if (arrDim === 1) {
        for (var i = 0; i < len; i++) {
            if (arr0[i] !== arr1[i]) {
                return false;
            }
        }
    }
    else {
        var len2 = arr0[0].length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len2; j++) {
                if (arr0[i][j] !== arr1[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}

/**
 * Catmull Rom interpolate array
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @param  {Number} t
 * @param  {Number} t2
 * @param  {Number} t3
 * @param  {Array} out
 * @param  {Number} arrDim
 */
function catmullRomInterpolateArray(
    p0, p1, p2, p3, t, t2, t3, out, arrDim
) {
    var len = p0.length;
    if (arrDim === 1) {
        for (var i = 0; i < len; i++) {
            out[i] = catmullRomInterpolate(
                p0[i], p1[i], p2[i], p3[i], t, t2, t3
            );
        }
    }
    else {
        var len2 = p0[0].length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len2; j++) {
                out[i][j] = catmullRomInterpolate(
                    p0[i][j], p1[i][j], p2[i][j], p3[i][j],
                    t, t2, t3
                );
            }
        }
    }
}

/**
 * Catmull Rom interpolate number
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @param  {Number} t2
 * @param  {Number} t3
 * @return {Number}
 */
function catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    return (2 * (p1 - p2) + v0 + v1) * t3
            + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
            + v0 * t + p1;
}

function cloneValue(value) {
    if (isArrayLike(value)) {
        var len = value.length;
        if (isArrayLike(value[0])) {
            var ret = [];
            for (var i = 0; i < len; i++) {
                ret.push(Array.prototype.slice.call(value[i]));
            }
            return ret;
        }

        return Array.prototype.slice.call(value);
    }

    return value;
}

function rgba2String(rgba) {
    rgba[0] = Math.floor(rgba[0]);
    rgba[1] = Math.floor(rgba[1]);
    rgba[2] = Math.floor(rgba[2]);

    return 'rgba(' + rgba.join(',') + ')';
}

function getArrayDim(keyframes) {
    var lastValue = keyframes[keyframes.length - 1].value;
    return isArrayLike(lastValue && lastValue[0]) ? 2 : 1;
}

function parseInt10(val) {
    return parseInt(val, 10);
}

var dataStructureUtil = (Object.freeze || Object)({
	$override: $override,
	clone: clone,
	merge: merge,
	mergeAll: mergeAll,
	extend: extend,
	createCanvas: createCanvas,
	getContext: getContext,
	indexOf: indexOf,
	isArrayLike: isArrayLike,
	each: each,
	map: map,
	reduce: reduce,
	filter: filter,
	find: find,
	bind: bind,
	curry: curry,
	isArray: isArray,
	isFunction: isFunction,
	isString: isString,
	isNumeric: isNumeric,
	isObject: isObject,
	isBuiltInObject: isBuiltInObject,
	isTypedArray: isTypedArray,
	isDom: isDom,
	eqNaN: eqNaN,
	retrieve: retrieve,
	retrieve2: retrieve2,
	retrieve3: retrieve3,
	slice: slice,
	normalizeCssArray: normalizeCssArray,
	assert: assert,
	trim: trim,
	setAsPrimitive: setAsPrimitive,
	isPrimitive: isPrimitive,
	createHashMap: createHashMap,
	concatArray: concatArray,
	noop: noop,
	interpolateNumber: interpolateNumber,
	interpolateString: interpolateString,
	interpolateArray: interpolateArray,
	fillArr: fillArr,
	isArraySame: isArraySame,
	catmullRomInterpolateArray: catmullRomInterpolateArray,
	catmullRomInterpolate: catmullRomInterpolate,
	cloneValue: cloneValue,
	rgba2String: rgba2String,
	getArrayDim: getArrayDim,
	parseInt10: parseInt10
});

/**
 * 构造类继承关系
 *
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Function} clazz 源类
 * @param {Function} baseClazz 基类
 */
function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;
    function F() {}
    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();

    for (var prop in clazzPrototype) {
        if (clazzPrototype.hasOwnProperty(prop)) {
            clazz.prototype[prop] = clazzPrototype[prop];
        }
    }
    clazz.prototype.constructor = clazz;
    clazz.superClass = baseClazz;
}

/**
 * 这里的 mixin 只拷贝 prototype 上的属性。
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Object|Function} target
 * @param {Object|Function} sorce
 * @param {boolean} overlay
 */
function mixin(target, source, overlay) {
    target = 'prototype' in target ? target.prototype : target;
    source = 'prototype' in source ? source.prototype : source;

    defaults(target, source, overlay);
}

/**
 * @method inheritProperties
 * 
 * Copy properties from super class, this method is designed for the classes which were not written in ES6 syntax.
 * 
 * 拷贝父类上的属性，此方法用来支持那么没有按照 ES6 语法编写的类。
 * 
 * @param {*} subInstance 子类的实例
 * @param {*} SuperClass 父类的类型
 * @param {*} opts 构造参数
 */
function inheritProperties(subInstance,SuperClass,opts){
    let sp=new SuperClass(opts);
    for(let name in sp){
        if(sp.hasOwnProperty(name)){
            subInstance[name]=sp[name];
        }
    }
}

/**
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overlay=false]
 * @memberOf module:zrender/core/dataStructureUtil
 */
function defaults(target, source, overlay) {
    for (var key in source) {
        if (source.hasOwnProperty(key)
            && (overlay ? source[key] != null : target[key] == null)
        ) {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * @method copyOwnProperties
 * 
 * Copy own properties from source object to target object, exclude inherited ones.
 * 
 * 从目标对象上拷贝属性，拷贝过程中排除那些通过继承而来的属性。
 * 
 * @param {Object} target 
 * @param {Object} source 
 * @param {Array} excludes 
 */
function copyOwnProperties(target,source,excludes=[]){
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if(excludes&&excludes.length){
                if(excludes.indexOf(key)!=-1){
                    continue;
                }
            }
            target[key] = source[key];
        }
    }
}

/* global Float32Array */

var ArrayCtor = typeof Float32Array === 'undefined'
    ? Array
    : Float32Array;

/**
 * 创建一个向量
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @return {Vector2}
 */
function create(x, y) {
    var out = new ArrayCtor(2);
    if (x == null) {
        x = 0;
    }
    if (y == null) {
        y = 0;
    }
    out[0] = x;
    out[1] = y;
    return out;
}

/**
 * 复制向量数据
 * @param {Vector2} out
 * @param {Vector2} v
 * @return {Vector2}
 */
function copy(out, v) {
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * 克隆一个向量
 * @param {Vector2} v
 * @return {Vector2}
 */
function clone$1(v) {
    var out = new ArrayCtor(2);
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * 设置向量的两个项
 * @param {Vector2} out
 * @param {Number} a
 * @param {Number} b
 * @return {Vector2} 结果
 */
function set(out, a, b) {
    out[0] = a;
    out[1] = b;
    return out;
}

/**
 * 向量相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function add(out, v1, v2) {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    return out;
}

/**
 * 向量缩放后相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Number} a
 */
function scaleAndAdd(out, v1, v2, a) {
    out[0] = v1[0] + v2[0] * a;
    out[1] = v1[1] + v2[1] * a;
    return out;
}

/**
 * 向量相减
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function sub(out, v1, v2) {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    return out;
}

/**
 * 向量长度
 * @param {Vector2} v
 * @return {Number}
 */
function len(v) {
    return Math.sqrt(lenSquare(v));
}
var length = len; // jshint ignore:line

/**
 * 向量长度平方
 * @param {Vector2} v
 * @return {Number}
 */
function lenSquare(v) {
    return v[0] * v[0] + v[1] * v[1];
}
var lengthSquare = lenSquare;

/**
 * 向量乘法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function mul(out, v1, v2) {
    out[0] = v1[0] * v2[0];
    out[1] = v1[1] * v2[1];
    return out;
}

/**
 * 向量除法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function div(out, v1, v2) {
    out[0] = v1[0] / v2[0];
    out[1] = v1[1] / v2[1];
    return out;
}

/**
 * 向量点乘
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Number}
 */
function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

/**
 * 向量缩放
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Number} s
 */
function scale(out, v, s) {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    return out;
}

/**
 * 向量归一化
 * @param {Vector2} out
 * @param {Vector2} v
 */
function normalize(out, v) {
    var d = len(v);
    if (d === 0) {
        out[0] = 0;
        out[1] = 0;
    }
    else {
        out[0] = v[0] / d;
        out[1] = v[1] / d;
    }
    return out;
}

/**
 * 计算向量间距离
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Number}
 */
function distance(v1, v2) {
    return Math.sqrt(
        (v1[0] - v2[0]) * (v1[0] - v2[0])
        + (v1[1] - v2[1]) * (v1[1] - v2[1])
    );
}
var dist = distance;

/**
 * 向量距离平方
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Number}
 */
function distanceSquare(v1, v2) {
    return (v1[0] - v2[0]) * (v1[0] - v2[0])
        + (v1[1] - v2[1]) * (v1[1] - v2[1]);
}
var distSquare = distanceSquare;

/**
 * 求负向量
 * @param {Vector2} out
 * @param {Vector2} v
 */
function negate(out, v) {
    out[0] = -v[0];
    out[1] = -v[1];
    return out;
}

/**
 * 插值两个点
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Number} t
 */
function lerp(out, v1, v2, t) {
    out[0] = v1[0] + t * (v2[0] - v1[0]);
    out[1] = v1[1] + t * (v2[1] - v1[1]);
    return out;
}

/**
 * 矩阵左乘向量
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Vector2} m
 */
function applyTransform(out, v, m) {
    var x = v[0];
    var y = v[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
}

/**
 * 求两个向量最小值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function min(out, v1, v2) {
    out[0] = Math.min(v1[0], v2[0]);
    out[1] = Math.min(v1[1], v2[1]);
    return out;
}

/**
 * 求两个向量最大值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function max(out, v1, v2) {
    out[0] = Math.max(v1[0], v2[0]);
    out[1] = Math.max(v1[1], v2[1]);
    return out;
}


var vector = (Object.freeze || Object)({
	create: create,
	copy: copy,
	clone: clone$1,
	set: set,
	add: add,
	scaleAndAdd: scaleAndAdd,
	sub: sub,
	len: len,
	length: length,
	lenSquare: lenSquare,
	lengthSquare: lengthSquare,
	mul: mul,
	div: div,
	dot: dot,
	scale: scale,
	normalize: normalize,
	distance: distance,
	dist: dist,
	distanceSquare: distanceSquare,
	distSquare: distSquare,
	negate: negate,
	lerp: lerp,
	applyTransform: applyTransform,
	min: min,
	max: max
});

/**
 * @abstract
 * @class zrender.event.Eventful
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
};

Eventful.prototype = {

    constructor: Eventful,

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
        }
        else {
            delete _h[event];
        }

        callListenerChanged(this, event);

        return this;
    },

    /**
     * @method
     * Dispatch a event.
     *
     * @param {String} type The event name.
     */
    trigger: function (type) {
        let _h = this._$handlers[type];
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
                    && !eventProcessor.filter(type, hItem.query)
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
                    default:
                        // have more than 2 given arguments
                        hItem.h.apply(hItem.ctx, args);
                        break;
                }

                if (hItem.one) {
                    _h.splice(i, 1);
                    len--;
                }
                else {
                    i++;
                }
            }
        }

        eventProcessor && eventProcessor.afterTrigger
            && eventProcessor.afterTrigger(type);

        return this;
    },

    /**
     * @method
     * Dispatch a event with context, which is specified at the last parameter.
     *
     * @param {String} type The event name.
     */
    triggerWithContext: function (type) {
        let _h = this._$handlers[type];
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
                    && !eventProcessor.filter(type, hItem.query)
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
                    default:
                        // have more than 2 given arguments
                        hItem.h.apply(ctx, args);
                        break;
                }

                if (hItem.one) {
                    _h.splice(i, 1);
                    len--;
                }
                else {
                    i++;
                }
            }
        }

        eventProcessor && eventProcessor.afterTrigger
            && eventProcessor.afterTrigger(type);

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
        callAtLast: handler.zrEventfulCallAtLast
    };

    let lastIndex = _h[event].length - 1;
    let lastWrap = _h[event][lastIndex];
    (lastWrap && lastWrap.callAtLast)
        ? _h[event].splice(lastIndex, 0, wrap)
        : _h[event].push(wrap);

    callListenerChanged(eventful, event);

    return eventful;
}

/**
 * The algoritm is learnt from
 * https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/
 * And we made some optimization for matrix inversion.
 * Other similar approaches:
 * "cv::getPerspectiveTransform", "Direct Linear Transformation".
 */

var LN2 = Math.log(2);

function determinant(rows, rank, rowStart, rowMask, colMask, detCache) {
    var cacheKey = rowMask + '-' + colMask;
    var fullRank = rows.length;

    if (detCache.hasOwnProperty(cacheKey)) {
        return detCache[cacheKey];
    }

    if (rank === 1) {
        // In this case the colMask must be like: `11101111`. We can find the place of `0`.
        var colStart = Math.round(Math.log(((1 << fullRank) - 1) & ~colMask) / LN2);
        return rows[rowStart][colStart];
    }

    var subRowMask = rowMask | (1 << rowStart);
    var subRowStart = rowStart + 1;
    while (rowMask & (1 << subRowStart)) {
        subRowStart++;
    }

    var sum = 0;
    for (var j = 0, colLocalIdx = 0; j < fullRank; j++) {
        var colTag = 1 << j;
        if (!(colTag & colMask)) {
            sum += (colLocalIdx % 2 ? -1 : 1) * rows[rowStart][j]
                // det(subMatrix(0, j))
                * determinant(rows, rank - 1, subRowStart, subRowMask, colMask | colTag, detCache);
            colLocalIdx++;
        }
    }

    detCache[cacheKey] = sum;

    return sum;
}

/**
 * Usage:
 * ```js
 * var transformer = buildTransformer(
 *     [10, 44, 100, 44, 100, 300, 10, 300],
 *     [50, 54, 130, 14, 140, 330, 14, 220]
 * );
 * var out = [];
 * transformer && transformer([11, 33], out);
 * ```
 *
 * Notice: `buildTransformer` may take more than 10ms in some Android device.
 *
 * @param {Array<Number>} src source four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @param {Array<Number>} dest destination four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @return {Function} transformer If fail, return null/undefined.
 */
function buildTransformer(src, dest) {
    var mA = [
        [src[0], src[1], 1, 0, 0, 0, -dest[0] * src[0], -dest[0] * src[1]],
        [0, 0, 0, src[0], src[1], 1, -dest[1] * src[0], -dest[1] * src[1]],
        [src[2], src[3], 1, 0, 0, 0, -dest[2] * src[2], -dest[2] * src[3]],
        [0, 0, 0, src[2], src[3], 1, -dest[3] * src[2], -dest[3] * src[3]],
        [src[4], src[5], 1, 0, 0, 0, -dest[4] * src[4], -dest[4] * src[5]],
        [0, 0, 0, src[4], src[5], 1, -dest[5] * src[4], -dest[5] * src[5]],
        [src[6], src[7], 1, 0, 0, 0, -dest[6] * src[6], -dest[6] * src[7]],
        [0, 0, 0, src[6], src[7], 1, -dest[7] * src[6], -dest[7] * src[7]]
    ];

    var detCache = {};
    var det = determinant(mA, 8, 0, 0, 0, detCache);
    if (det === 0) {
        return;
    }

    // `invert(mA) * dest`, that is, `adj(mA) / det * dest`.
    var vh = [];
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            vh[j] == null && (vh[j] = 0);
            vh[j] += ((i + j) % 2 ? -1 : 1)
                // det(subMatrix(i, j))
                * determinant(mA, 7, i === 0 ? 1 : 0, 1 << i, 1 << j, detCache)
                / det * dest[i];
        }
    }

    return function (out, srcPointX, srcPointY) {
        var pk = srcPointX * vh[6] + srcPointY * vh[7] + 1;
        out[0] = (srcPointX * vh[0] + srcPointY * vh[1] + vh[2]) / pk;
        out[1] = (srcPointX * vh[3] + srcPointY * vh[4] + vh[5]) / pk;
    };
}

/**
 * Utilities for mouse or touch events.
 */

var isDomLevel2 = (typeof window !== 'undefined') && !!window.addEventListener;

var MOUSE_EVENT_REG = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
var EVENT_SAVED_PROP = '___zrEVENTSAVED';
var _calcOut = [];

/**
 * Get the `zrX` and `zrY`, which are relative to the top-left of
 * the input `el`.
 * CSS transform (2D & 3D) is supported.
 *
 * The strategy to fetch the coords:
 * + If `calculate` is not set as `true`, users of this method should
 * ensure that `el` is the same or the same size & location as `e.target`.
 * Otherwise the result coords are probably not expected. Because we
 * firstly try to get coords from e.offsetX/e.offsetY.
 * + If `calculate` is set as `true`, the input `el` can be any element
 * and we force to calculate the coords based on `el`.
 * + The input `el` should be positionable (not position:static).
 *
 * The force `calculate` can be used in case like:
 * When mousemove event triggered on ec tooltip, `e.target` is not `el`(zr painter.dom).
 *
 * @param {HTMLElement} el DOM element.
 * @param {Event} e Mouse event or touch event.
 * @param {Object} out Get `out.zrX` and `out.zrY` as the result.
 * @param {boolean} [calculate=false] Whether to force calculate
 *        the coordinates but not use ones provided by browser.
 */
function clientToLocal(el, e, out, calculate) {
    out = out || {};

    // According to the W3C Working Draft, offsetX and offsetY should be relative
    // to the padding edge of the target element. The only browser using this convention
    // is IE. Webkit uses the border edge, Opera uses the content edge, and FireFox does
    // not support the properties.
    // (see http://www.jacklmoore.com/notes/mouse-position/)
    // In zr painter.dom, padding edge equals to border edge.

    if (calculate || !env$1.canvasSupported) {
        calculateZrXY(el, e, out);
    }
    // Caution: In FireFox, layerX/layerY Mouse position relative to the closest positioned
    // ancestor element, so we should make sure el is positioned (e.g., not position:static).
    // BTW1, Webkit don't return the same results as FF in non-simple cases (like add
    // zoom-factor, overflow / opacity layers, transforms ...)
    // BTW2, (ev.offsetY || ev.pageY - $(ev.target).offset().top) is not correct in preserve-3d.
    // <https://bugs.jquery.com/ticket/8523#comment:14>
    // BTW3, In ff, offsetX/offsetY is always 0.
    else if (env$1.browser.firefox && e.layerX != null && e.layerX !== e.offsetX) {
        out.zrX = e.layerX;
        out.zrY = e.layerY;
    }
    // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
    else if (e.offsetX != null) {
        out.zrX = e.offsetX;
        out.zrY = e.offsetY;
    }
    // For some other device, e.g., IOS safari.
    else {
        calculateZrXY(el, e, out);
    }

    return out;
}

function calculateZrXY(el, e, out) {
    // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect.
    if (el.getBoundingClientRect && env$1.domSupported) {
        var ex = e.clientX;
        var ey = e.clientY;

        if (el.nodeName.toUpperCase() === 'CANVAS') {
            // Original approach, which do not support CSS transform.
            // marker can not be locationed in a canvas container
            // (getBoundingClientRect is always 0). We do not support
            // that input a pre-created canvas to zr while using css
            // transform in iOS.
            var box = el.getBoundingClientRect();
            out.zrX = ex - box.left;
            out.zrY = ey - box.top;
            return;
        }
        else {
            var saved = el[EVENT_SAVED_PROP] || (el[EVENT_SAVED_PROP] = {});
            var transformer = preparePointerTransformer(prepareCoordMarkers(el, saved), saved);
            if (transformer) {
                transformer(_calcOut, ex, ey);
                out.zrX = _calcOut[0];
                out.zrY = _calcOut[1];
                return;
            }
        }
    }
    out.zrX = out.zrY = 0;
}

function prepareCoordMarkers(el, saved) {
    var markers = saved.markers;
    if (markers) {
        return markers;
    }

    markers = saved.markers = [];
    var propLR = ['left', 'right'];
    var propTB = ['top', 'bottom'];

    for (var i = 0; i < 4; i++) {
        var marker = document.createElement('div');
        var stl = marker.style;
        var idxLR = i % 2;
        var idxTB = (i >> 1) % 2;
        stl.cssText = [
            'position:absolute',
            'visibility: hidden',
            'padding: 0',
            'margin: 0',
            'border-width: 0',
            'width:0',
            'height:0',
            // 'width: 5px',
            // 'height: 5px',
            propLR[idxLR] + ':0',
            propTB[idxTB] + ':0',
            propLR[1 - idxLR] + ':auto',
            propTB[1 - idxTB] + ':auto',
            ''
        ].join('!important;');
        el.appendChild(marker);
        markers.push(marker);
    }

    return markers;
}

function preparePointerTransformer(markers, saved) {
    var transformer = saved.transformer;
    var oldSrcCoords = saved.srcCoords;
    var useOld = true;
    var srcCoords = [];
    var destCoords = [];

    for (var i = 0; i < 4; i++) {
        var rect = markers[i].getBoundingClientRect();
        var ii = 2 * i;
        var x = rect.left;
        var y = rect.top;
        srcCoords.push(x, y);
        useOld &= oldSrcCoords && x === oldSrcCoords[ii] && y === oldSrcCoords[ii + 1];
        destCoords.push(markers[i].offsetLeft, markers[i].offsetTop);
    }

    // Cache to avoid time consuming of `buildTransformer`.
    return useOld
        ? transformer
        : (
            saved.srcCoords = srcCoords,
            saved.transformer = buildTransformer(srcCoords, destCoords)
        );
}

/**
 * Find native event compat for legency IE.
 * Should be called at the begining of a native event listener.
 *
 * @param {Event} [e] Mouse event or touch event or pointer event.
 *        For lagency IE, we use `window.event` is used.
 * @return {Event} The native event.
 */
function getNativeEvent(e) {
    return e || window.event;
}

/**
 * Normalize the coordinates of the input event.
 *
 * Get the `e.zrX` and `e.zrY`, which are relative to the top-left of
 * the input `el`.
 * Get `e.zrDelta` if using mouse wheel.
 * Get `e.which`, see the comment inside this function.
 *
 * Do not calculate repeatly if `zrX` and `zrY` already exist.
 *
 * Notice: see comments in `clientToLocal`. check the relationship
 * between the result coords and the parameters `el` and `calculate`.
 *
 * @param {HTMLElement} el DOM element.
 * @param {Event} [e] See `getNativeEvent`.
 * @param {boolean} [calculate=false] Whether to force calculate
 *        the coordinates but not use ones provided by browser.
 * @return {UIEvent} The normalized native UIEvent.
 */
function normalizeEvent(el, e, calculate) {

    e = getNativeEvent(e);

    if (e.zrX != null) {
        return e;
    }

    var eventType = e.type;
    var isTouch = eventType && eventType.indexOf('touch') >= 0;

    if (!isTouch) {
        clientToLocal(el, e, e, calculate);
        e.zrDelta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
    }
    else {
        var touch = eventType !== 'touchend'
            ? e.targetTouches[0]
            : e.changedTouches[0];
        touch && clientToLocal(el, touch, e, calculate);
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right; otherwise: 0;
    // See jQuery: https://github.com/jquery/jquery/blob/master/src/event.js
    // If e.which has been defined, it may be readonly,
    // see: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/which
    var button = e.button;
    if (e.which == null && button !== undefined && MOUSE_EVENT_REG.test(e.type)) {
        e.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
    }
    // [Caution]: `e.which` from browser is not always reliable. For example,
    // when press left button and `mousemove (pointermove)` in Edge, the `e.which`
    // is 65536 and the `e.button` is -1. But the `mouseup (pointerup)` and
    // `mousedown (pointerdown)` is the same as Chrome does.

    return e;
}

/**
 * @param {HTMLElement} el
 * @param {String} name
 * @param {Function} handler
 */
function addEventListener(el, name, handler) {
    if (isDomLevel2) {
        // Reproduct the console warning:
        // [Violation] Added non-passive event listener to a scroll-blocking <some> event.
        // Consider marking event handler as 'passive' to make the page more responsive.
        // Just set console log level: verbose in chrome dev tool.
        // then the warning log will be printed when addEventListener called.
        // See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
        // We have not yet found a neat way to using passive. Because in zrender the dom event
        // listener delegate all of the upper events of element. Some of those events need
        // to prevent default. For example, the feature `preventDefaultMouseMove` of echarts.
        // Before passive can be adopted, these issues should be considered:
        // (1) Whether and how a zrender user specifies an event listener passive. And by default,
        // passive or not.
        // (2) How to tread that some zrender event listener is passive, and some is not. If
        // we use other way but not preventDefault of mousewheel and touchmove, browser
        // compatibility should be handled.

        // var opts = (env.passiveSupported && name === 'mousewheel')
        //     ? {passive: true}
        //     // By default, the third param of el.addEventListener is `capture: false`.
        //     : void 0;
        // el.addEventListener(name, handler /* , opts */);
        el.addEventListener(name, handler);
    }
    else {
        el.attachEvent('on' + name, handler);
    }
}

function removeEventListener(el, name, handler) {
    if (isDomLevel2) {
        el.removeEventListener(name, handler);
    }
    else {
        el.detachEvent('on' + name, handler);
    }
}

/**
 * preventDefault and stopPropagation.
 * Notice: do not use this method in zrender. It can only be
 * used by upper applications if necessary.
 *
 * @param {Event} e A mouse or touch event.
 */
var stop = isDomLevel2
    ? function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
    }
    : function (e) {
        e.returnValue = false;
        e.cancelBubble = true;
    };

/**
 * This method only works for mouseup and mousedown. The functionality is restricted
 * for fault tolerance, See the `e.which` compatibility above.
 *
 * @param {MouseEvent} e
 * @return {boolean}
 */


/**
 * To be removed.
 * @deprecated
 */

/**
 * @class zrender.event.MultiDragDrop
 * 支持同时拖拽多个元素，按住 Ctrl 键可以多选。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class MultiDragDrop{
    /**
     * @method constructor MultiDragDrop
     * @param {ZRenderEventHandler} handler 
     */
    constructor(handler){
        this.selectionMap=new Map();
        this.handler=handler;
        this.handler.on('mousedown', this._dragStart, this);
    }

    /**
     * @private
     * @method param
     * @param {Element} target 
     * @param {Event} e 
     */
    param(target, e) {
        return {target: target, topTarget: e && e.topTarget};
    }

    /**
     * @method getSelectedItems
     * 获取当前选中的元素
     * @return {Map} selectionMap
     */
    getSelectedItems(){
        return this.selectionMap;
    }

    /**
     * @method clearSelectionMap
     * 清除选中
     */
    clearSelectionMap(){
        this.selectionMap.forEach((el,key)=>{el.dragging=false;});
        this.selectionMap.clear();
    }

    /**
     * @private
     * @method _dragStart
     * 开始拖动
     * @param {Event} e 
     */
    _dragStart(e) {
        let el = e.target;
        let event = e.event;
        this._draggingItem=el;

        if(!el){
            this.clearSelectionMap();
            return;
        }

        if(!el.draggable){
            return;
        }

        if(!event.ctrlKey&&!this.selectionMap.get(el.id)){
            this.clearSelectionMap();
        }
        el.dragging=true;
        this.selectionMap.set(el.id,el);

        this._x = e.offsetX;
        this._y = e.offsetY;
        this.handler.on('pagemousemove', this._drag, this);
        this.handler.on('pagemouseup', this._dragEnd, this);

        this.selectionMap.forEach((el,key)=>{
            console.log(el);
            this.handler.dispatchToElement(this.param(el, e), 'dragstart', e.event);
        });
    }

    /**
     * @private
     * @method _drag
     * 拖动过程中
     * @param {Event} e 
     */
    _drag(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        let dx = x - this._x;
        let dy = y - this._y;
        this._x = x;
        this._y = y;

        this.selectionMap.forEach((el,key)=>{
            el.drift(dx, dy, e);
            this.handler.dispatchToElement(this.param(el, e), 'drag', e.event);
        });

        let dropTarget = this.handler.findHover(x, y, this._draggingItem).target;
        let lastDropTarget = this._dropTarget;
        this._dropTarget = dropTarget;

        if (this._draggingItem !== dropTarget) {
            if (lastDropTarget && dropTarget !== lastDropTarget) {
                this.handler.dispatchToElement(this.param(lastDropTarget, e), 'dragleave', e.event);
            }
            if (dropTarget && dropTarget !== lastDropTarget) {
                this.handler.dispatchToElement(this.param(dropTarget, e), 'dragenter', e.event);
            }
        }
    }

    /**
     * @private
     * @method _dragEnd
     * 拖动结束
     * @param {Event} e 
     */
    _dragEnd(e) {
        this.selectionMap.forEach((el,key)=>{
            el.dragging=false;
            this.handler.dispatchToElement(this.param(el, e), 'dragend', e.event);
        });
        this.handler.off('pagemousemove', this._drag);
        this.handler.off('pagemouseup', this._dragEnd);

        if (this._dropTarget) {
            this.handler.dispatchToElement(this.param(this._dropTarget, e), 'drop', e.event);
        }

        this._dropTarget = null;
    }
}

/**
 * @class zrender.core.GestureMgr
 * 
 * Implement necessary gestures for mobile platform.
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
function dist$1(pointPair) {
    let dx = pointPair[1][0] - pointPair[0][0];
    let dy = pointPair[1][1] - pointPair[0][1];

    return Math.sqrt(dx * dx + dy * dy);
}

function center(pointPair) {
    return [
        (pointPair[0][0] + pointPair[1][0]) / 2,
        (pointPair[0][1] + pointPair[1][1]) / 2
    ];
}

let recognizers = {
    pinch(track, event) {
        let trackLen = track.length;
        if (!trackLen) {
            return;
        }

        let pinchEnd = (track[trackLen - 1] || {}).points;
        let pinchPre = (track[trackLen - 2] || {}).points || pinchEnd;

        if (pinchPre
            && pinchPre.length > 1
            && pinchEnd
            && pinchEnd.length > 1
        ) {
            let pinchScale = dist$1(pinchEnd) / dist$1(pinchPre);
            !isFinite(pinchScale) && (pinchScale = 1);

            event.pinchScale = pinchScale;

            let pinchCenter = center(pinchEnd);
            event.pinchX = pinchCenter[0];
            event.pinchY = pinchCenter[1];

            return {
                type: 'pinch',
                target: track[0].target,
                event: event
            };
        }
    }

    // Only pinch currently.
};

class GestureMgr{
    constructor(){
        /**
         * @private
         * @property {Array<Object>}
         */
        this._track = [];
    }

    recognize(event, target, root) {
        this._doTrack(event, target, root);
        return this._recognize(event);
    }

    clear() {
        this._track.length = 0;
        return this;
    }

    _doTrack(event, target, root) {
        let touches = event.touches;

        if (!touches) {
            return;
        }

        let trackItem = {
            points: [],
            touches: [],
            target: target,
            event: event
        };

        for (let i = 0, len = touches.length; i < len; i++) {
            let touch = touches[i];
            let pos = clientToLocal(root, touch, {});
            trackItem.points.push([pos.zrX, pos.zrY]);
            trackItem.touches.push(touch);
        }

        this._track.push(trackItem);
    }

    _recognize(event) {
        for (let eventName in recognizers) {
            if (recognizers.hasOwnProperty(eventName)) {
                let gestureInfo = recognizers[eventName](this._track, event);
                if (gestureInfo) {
                    return gestureInfo;
                }
            }
        }
    }
}

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
    stop(this.event);
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
        afterListenerChanged: bind(afterListenerChanged, null, this)
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
            each(handlerNames, function (name) {
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

    pagemousemove: curry(pageEventHandler, 'pagemousemove'),

    pagemouseup: curry(pageEventHandler, 'pagemouseup'),

    pagekeydown: curry(pageEventHandler, 'pagekeydown'),
    
    pagekeyup: curry(pageEventHandler, 'pagekeyup'),

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
each(['click', 'mousedown', 
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
                || dist(this._downPoint, [event.zrX, event.zrY]) > 4
            ) {
                return;
            }
            this._downPoint = null;
        }

        //把事件派发给目标元素
        this.dispatchToElement(hovered, name, event);
    };
});

mixin(ZRenderEventHandler, Eventful);

/**
 * 3x2矩阵操作类
 * @exports zrender/core/matrix
 */

/* global Float32Array */

var ArrayCtor$1 = typeof Float32Array === 'undefined'
    ? Array
    : Float32Array;

/**
 * Create a identity matrix.
 * @return {Float32Array|Array.<Number>}
 */
function create$1() {
    var out = new ArrayCtor$1(6);
    identity(out);

    return out;
}

/**
 * 设置矩阵为单位矩阵
 * @param {Float32Array|Array.<Number>} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * 复制矩阵
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} m
 */
function copy$1(out, m) {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4];
    out[5] = m[5];
    return out;
}

/**
 * 矩阵相乘
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} m1
 * @param {Float32Array|Array.<Number>} m2
 */
function mul$1(out, m1, m2) {
    // Consider matrix.mul(m, m2, m);
    // where out is the same as m2.
    // So use temp variable to escape error.
    var out0 = m1[0] * m2[0] + m1[2] * m2[1];
    var out1 = m1[1] * m2[0] + m1[3] * m2[1];
    var out2 = m1[0] * m2[2] + m1[2] * m2[3];
    var out3 = m1[1] * m2[2] + m1[3] * m2[3];
    var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
    var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = out3;
    out[4] = out4;
    out[5] = out5;
    return out;
}

/**
 * 平移变换
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 * @param {Float32Array|Array.<Number>} v
 */
function translate(out, a, v) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4] + v[0];
    out[5] = a[5] + v[1];
    return out;
}

/**
 * 旋转变换
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 * @param {Number} rad
 */
function rotate(out, a, rad) {
    var aa = a[0];
    var ac = a[2];
    var atx = a[4];
    var ab = a[1];
    var ad = a[3];
    var aty = a[5];
    var st = Math.sin(rad);
    var ct = Math.cos(rad);

    out[0] = aa * ct + ab * st;
    out[1] = -aa * st + ab * ct;
    out[2] = ac * ct + ad * st;
    out[3] = -ac * st + ct * ad;
    out[4] = ct * atx + st * aty;
    out[5] = ct * aty - st * atx;
    return out;
}

/**
 * 缩放变换
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 * @param {Float32Array|Array.<Number>} v
 */
function scale$1(out, a, v) {
    var vx = v[0];
    var vy = v[1];
    out[0] = a[0] * vx;
    out[1] = a[1] * vy;
    out[2] = a[2] * vx;
    out[3] = a[3] * vy;
    out[4] = a[4] * vx;
    out[5] = a[5] * vy;
    return out;
}

/**
 * 求逆矩阵
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 */
function invert(out, a) {

    var aa = a[0];
    var ac = a[2];
    var atx = a[4];
    var ab = a[1];
    var ad = a[3];
    var aty = a[5];

    var det = aa * ad - ab * ac;
    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
}

/**
 * Clone a new matrix.
 * @param {Float32Array|Array.<Number>} a
 */
function clone$2(a) {
    var b = create$1();
    copy$1(b, a);
    return b;
}

var matrix = (Object.freeze || Object)({
	create: create$1,
	identity: identity,
	copy: copy$1,
	mul: mul$1,
	translate: translate,
	rotate: rotate,
	scale: scale$1,
	invert: invert,
	clone: clone$2
});

/**
 * @abstract
 * @class zrender.graphic.Transformable
 * 提供变换扩展
 * @author pissang (https://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

let mIdentity = identity;

let EPSILON = 5e-5;

function isNotAroundZero(val) {
    return val > EPSILON || val < -EPSILON;
}

/**
 * @method constructor Transformable
 */
let Transformable = function (opts) {
    opts = opts || {};
    // If there are no given position, rotation, scale
    if (!opts.position) {
        /**
         * @property {Array<Number>}
         * 平移
         */
        this.position = [0, 0];
    }
    if (opts.rotation == null) {
        /**
         * @property {Array<Number>}
         * 旋转
         */
        this.rotation = 0;
    }
    if (!opts.scale) {
        /**
         * @property {Array<Number>}
         * 缩放
         */
        this.scale = [1, 1];
    }
    /**
     * @property {Array<Number>}
     * 旋转和缩放的原点
     */
    this.origin = this.origin || null;
};

let transformableProto = Transformable.prototype;
transformableProto.transform = null;

/**
 * @method needLocalTransform
 * 判断是否需要有坐标变换
 * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
 */
transformableProto.needLocalTransform = function () {
    return isNotAroundZero(this.rotation)
        || isNotAroundZero(this.position[0])
        || isNotAroundZero(this.position[1])
        || isNotAroundZero(this.scale[0] - 1)
        || isNotAroundZero(this.scale[1] - 1);
};

let scaleTmp = [];
transformableProto.updateTransform = function () {
    let parent = this.parent;
    let parentHasTransform = parent && parent.transform;
    let needLocalTransform = this.needLocalTransform();

    let m = this.transform;
    if (!(needLocalTransform || parentHasTransform)) {
        m && mIdentity(m);
        return;
    }

    m = m || create$1();

    if (needLocalTransform) {
        this.getLocalTransform(m);
    }
    else {
        mIdentity(m);
    }

    // 应用父节点变换
    if (parentHasTransform) {
        if (needLocalTransform) {
            mul$1(m, parent.transform, m);
        }
        else {
            copy$1(m, parent.transform);
        }
    }
    // 保存这个变换矩阵
    this.transform = m;

    let globalScaleRatio = this.globalScaleRatio;
    if (globalScaleRatio != null && globalScaleRatio !== 1) {
        this.getGlobalScale(scaleTmp);
        let relX = scaleTmp[0] < 0 ? -1 : 1;
        let relY = scaleTmp[1] < 0 ? -1 : 1;
        let sx = ((scaleTmp[0] - relX) * globalScaleRatio + relX) / scaleTmp[0] || 0;
        let sy = ((scaleTmp[1] - relY) * globalScaleRatio + relY) / scaleTmp[1] || 0;

        m[0] *= sx;
        m[1] *= sx;
        m[2] *= sy;
        m[3] *= sy;
    }

    this.invTransform = this.invTransform || create$1();
    invert(this.invTransform, m);
};

transformableProto.getLocalTransform = function (m) {
    return Transformable.getLocalTransform(this, m);
};

/**
 * @method setTransform
 * 将自己的transform应用到context上
 * @param {CanvasRenderingContext2D} ctx
 */
transformableProto.setTransform = function (ctx) {
    let m = this.transform;
    let dpr = ctx.dpr || 1;
    if (m) {
        ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
    }
    else {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
};

transformableProto.restoreTransform = function (ctx) {
    let dpr = ctx.dpr || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

let tmpTransform = [];
let originTransform = create$1();

transformableProto.setLocalTransform = function (m) {
    if (!m) {
        // TODO return or set identity?
        return;
    }
    let sx = m[0] * m[0] + m[1] * m[1];
    let sy = m[2] * m[2] + m[3] * m[3];
    let position = this.position;
    let scale$$1 = this.scale;
    if (isNotAroundZero(sx - 1)) {
        sx = Math.sqrt(sx);
    }
    if (isNotAroundZero(sy - 1)) {
        sy = Math.sqrt(sy);
    }
    if (m[0] < 0) {
        sx = -sx;
    }
    if (m[3] < 0) {
        sy = -sy;
    }

    position[0] = m[4];
    position[1] = m[5];
    scale$$1[0] = sx;
    scale$$1[1] = sy;
    this.rotation = Math.atan2(-m[1] / sy, m[0] / sx);
};
/**
 * 分解`transform`矩阵到`position`, `rotation`, `scale`
 */
transformableProto.decomposeTransform = function () {
    if (!this.transform) {
        return;
    }
    let parent = this.parent;
    let m = this.transform;
    if (parent && parent.transform) {
        // Get local transform and decompose them to position, scale, rotation
        mul$1(tmpTransform, parent.invTransform, m);
        m = tmpTransform;
    }
    let origin = this.origin;
    if (origin && (origin[0] || origin[1])) {
        originTransform[4] = origin[0];
        originTransform[5] = origin[1];
        mul$1(tmpTransform, m, originTransform);
        tmpTransform[4] -= origin[0];
        tmpTransform[5] -= origin[1];
        m = tmpTransform;
    }

    this.setLocalTransform(m);
};

/**
 * @method getGlobalScale
 * Get global scale
 * @return {Array<Number>}
 */
transformableProto.getGlobalScale = function (out) {
    let m = this.transform;
    out = out || [];
    if (!m) {
        out[0] = 1;
        out[1] = 1;
        return out;
    }
    out[0] = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
    out[1] = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
    if (m[0] < 0) {
        out[0] = -out[0];
    }
    if (m[3] < 0) {
        out[1] = -out[1];
    }
    return out;
};
/**
 * @method transformCoordToLocal
 * 变换坐标位置到 shape 的局部坐标空间
 * @param {Number} x
 * @param {Number} y
 * @return {Array<Number>}
 */
transformableProto.transformCoordToLocal = function (x, y) {
    let v2 = [x, y];
    let invTransform = this.invTransform;
    if (invTransform) {
        applyTransform(v2, v2, invTransform);
    }
    return v2;
};

/**
 * @method transformCoordToGlobal
 * 变换局部坐标位置到全局坐标空间
 * @param {Number} x
 * @param {Number} y
 * @return {Array<Number>}
 */
transformableProto.transformCoordToGlobal = function (x, y) {
    let v2 = [x, y];
    let transform = this.transform;
    if (transform) {
        applyTransform(v2, v2, transform);
    }
    return v2;
};

/**
 * @static
 * @method getLocalTransform
 * @param {Object} target
 * @param {Array<Number>} target.origin
 * @param {Number} target.rotation
 * @param {Array<Number>} target.position
 * @param {Array<Number>} [m]
 */
Transformable.getLocalTransform = function (target, m) {
    m = m || [];
    mIdentity(m);

    let origin = target.origin;
    let scale$$1 = target.scale || [1, 1];
    let rotation = target.rotation || 0;
    let position = target.position || [0, 0];

    if (origin) {
        // Translate to origin
        m[4] -= origin[0];
        m[5] -= origin[1];
    }
    scale$1(m, m, scale$$1);
    if (rotation) {
        rotate(m, m, rotation);
    }
    if (origin) {
        // Translate back from origin
        m[4] += origin[0];
        m[5] += origin[1];
    }

    m[4] += position[0];
    m[5] += position[1];

    return m;
};

/**
 * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
 * 这里的缓动主要是一些数学计算公式，这些公式可以用来计算对象的坐标。
 * @see http://sole.github.io/tween.js/examples/03_graphs.html
 * @exports zrender/animation/easing
 */
let easing = {
    /**
    * @param {Number} k
    * @return {Number}
    */
    linear: function (k) {
        return k;
    },

    /**
    * @param {Number} k
    * @return {Number}
    */
    quadraticIn: function (k) {
        return k * k;
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    quadraticOut: function (k) {
        return k * (2 - k);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    quadraticInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k;
        }
        return -0.5 * (--k * (k - 2) - 1);
    },

    // 三次方的缓动（t^3）
    /**
    * @param {Number} k
    * @return {Number}
    */
    cubicIn: function (k) {
        return k * k * k;
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    cubicOut: function (k) {
        return --k * k * k + 1;
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    cubicInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k + 2);
    },

    // 四次方的缓动（t^4）
    /**
    * @param {Number} k
    * @return {Number}
    */
    quarticIn: function (k) {
        return k * k * k * k;
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    quarticOut: function (k) {
        return 1 - (--k * k * k * k);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    quarticInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k * k;
        }
        return -0.5 * ((k -= 2) * k * k * k - 2);
    },

    // 五次方的缓动（t^5）
    /**
    * @param {Number} k
    * @return {Number}
    */
    quinticIn: function (k) {
        return k * k * k * k * k;
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    quinticOut: function (k) {
        return --k * k * k * k * k + 1;
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    quinticInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
    },

    // 正弦曲线的缓动（sin(t)）
    /**
    * @param {Number} k
    * @return {Number}
    */
    sinusoidalIn: function (k) {
        return 1 - Math.cos(k * Math.PI / 2);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    sinusoidalOut: function (k) {
        return Math.sin(k * Math.PI / 2);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    sinusoidalInOut: function (k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    },

    // 指数曲线的缓动（2^t）
    /**
    * @param {Number} k
    * @return {Number}
    */
    exponentialIn: function (k) {
        return k === 0 ? 0 : Math.pow(1024, k - 1);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    exponentialOut: function (k) {
        return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    exponentialInOut: function (k) {
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if ((k *= 2) < 1) {
            return 0.5 * Math.pow(1024, k - 1);
        }
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    },

    // 圆形曲线的缓动（sqrt(1-t^2)）
    /**
    * @param {Number} k
    * @return {Number}
    */
    circularIn: function (k) {
        return 1 - Math.sqrt(1 - k * k);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    circularOut: function (k) {
        return Math.sqrt(1 - (--k * k));
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    circularInOut: function (k) {
        if ((k *= 2) < 1) {
            return -0.5 * (Math.sqrt(1 - k * k) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    },

    // 创建类似于弹簧在停止前来回振荡的动画
    /**
    * @param {Number} k
    * @return {Number}
    */
    elasticIn: function (k) {
        let s;
        let a = 0.1;
        let p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        return -(a * Math.pow(2, 10 * (k -= 1))
                    * Math.sin((k - s) * (2 * Math.PI) / p));
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    elasticOut: function (k) {
        let s;
        let a = 0.1;
        let p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        return (a * Math.pow(2, -10 * k)
                    * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    elasticInOut: function (k) {
        let s;
        let a = 0.1;
        let p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        if ((k *= 2) < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (k -= 1))
                * Math.sin((k - s) * (2 * Math.PI) / p));
        }
        return a * Math.pow(2, -10 * (k -= 1))
                * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

    },

    // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
    /**
    * @param {Number} k
    * @return {Number}
    */
    backIn: function (k) {
        let s = 1.70158;
        return k * k * ((s + 1) * k - s);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    backOut: function (k) {
        let s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    backInOut: function (k) {
        let s = 1.70158 * 1.525;
        if ((k *= 2) < 1) {
            return 0.5 * (k * k * ((s + 1) * k - s));
        }
        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    },

    // 创建弹跳效果
    /**
    * @param {Number} k
    * @return {Number}
    */
    bounceIn: function (k) {
        return 1 - easing.bounceOut(1 - k);
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    bounceOut: function (k) {
        if (k < (1 / 2.75)) {
            return 7.5625 * k * k;
        }
        else if (k < (2 / 2.75)) {
            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
        }
        else if (k < (2.5 / 2.75)) {
            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
        }
        else {
            return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
        }
    },
    /**
    * @param {Number} k
    * @return {Number}
    */
    bounceInOut: function (k) {
        if (k < 0.5) {
            return easing.bounceIn(k * 2) * 0.5;
        }
        return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
    }
};

/**
 * @class zrender.animation.Timeline
 * Timeline，时间线，用来计算元素上的某个属性在指定时间点的数值。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

class Timeline{
    /**
     * @method constructor Timeline
     * @param {Object} options 
     * @param {Element} options.target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
     * @param {Number} options.life(1000) 动画时长
     * @param {Number} options.delay(0) 动画延迟时间
     * @param {Boolean} options.loop(true)
     * @param {Number} options.gap(0) 循环的间隔时间
     * @param {Function} options.onframe
     * @param {String} options.easing(optional)
     * @param {Function} options.ondestroy(optional)
     * @param {Function} options.onrestart(optional)
     */
    constructor(options){
        this._target = options.target;
        this._lifeTime = options.lifeTime || 1000;
        this._delay = options.delay || 0;
        this._initialized = false;
        this.loop = options.loop == null ? false : options.loop;
        this.gap = options.gap || 0;
        this.easing = options.easing || 'Linear';
        this.onframe = options.onframe;
        this.ondestroy = options.ondestroy;
        this.onrestart = options.onrestart;
    
        this._pausedTime = 0;
        this._paused = false;
    }

    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} globalTime 当前时间
     * @param {Number} deltaTime  时间偏移量
     * //TODO:try move this into webworker
     */
    nextFrame(globalTime, deltaTime) {
        // Set startTime on first frame, or _startTime may has milleseconds different between clips
        // PENDING
        if (!this._initialized) {
            this._startTime = globalTime + this._delay;
            this._initialized = true;
        }

        if (this._paused) {
            this._pausedTime += deltaTime;
            return;
        }

        let percent = (globalTime - this._startTime - this._pausedTime) / this._lifeTime;
        // 还没开始
        if (percent < 0) {
            return;
        }
        percent = Math.min(percent, 1);

        let easing$$1 = this.easing;
        let easingFunc = typeof easing$$1 === 'string' ? easing[easing$$1] : easing$$1;
        let schedule = typeof easingFunc === 'function'
            ? easingFunc(percent)
            : percent;

        this.fire('frame', schedule);

        // 结束或者重新开始周期
        // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
        if (percent === 1) {
            if (this.loop) {
                this.restart(globalTime);
                return 'restart';
            }
            return 'destroy';
        }
        return percent;
    }

    /**
     * @method restart
     * 重新开始
     * @param {Number} globalTime 
     */
    restart(globalTime) {
        let remainder = (globalTime - this._startTime - this._pausedTime) % this._lifeTime;
        this._startTime = globalTime - remainder + this.gap;
        this._pausedTime = 0;
    }

    /**
     * @method fire
     * 触发事件
     * @param {String} eventType 
     * @param {Object} arg 
     */
    fire(eventType, arg) {
        eventType = 'on' + eventType;
        if (this[eventType]) {
            this[eventType](this._target, arg);
        }
    }

    /**
     * @method pause
     * 暂停
     */
    pause() {
        this._paused = true;
    }

    /**
     * @method resume
     * 恢复运行
     */
    resume() {
        this._paused = false;
    }
}

// Simple LRU cache use doubly linked list
// @module zrender/core/LRU

/**
 * Simple double linked list. Compared with array, it has O(1) remove operation.
 * @constructor
 */
var LinkedList = function () {

    /**
     * @property {module:zrender/core/LRU~Entry}
     */
    this.head = null;

    /**
     * @property {module:zrender/core/LRU~Entry}
     */
    this.tail = null;

    this._len = 0;
};

var linkedListProto = LinkedList.prototype;
/**
 * Insert a new value at the tail
 * @param  {} val
 * @return {module:zrender/core/LRU~Entry}
 */
linkedListProto.insert = function (val) {
    var entry = new Entry(val);
    this.insertEntry(entry);
    return entry;
};

/**
 * Insert an entry at the tail
 * @param  {module:zrender/core/LRU~Entry} entry
 */
linkedListProto.insertEntry = function (entry) {
    if (!this.head) {
        this.head = this.tail = entry;
    }
    else {
        this.tail.next = entry;
        entry.prev = this.tail;
        entry.next = null;
        this.tail = entry;
    }
    this._len++;
};

/**
 * Remove entry.
 * @param  {module:zrender/core/LRU~Entry} entry
 */
linkedListProto.remove = function (entry) {
    var prev = entry.prev;
    var next = entry.next;
    if (prev) {
        prev.next = next;
    }
    else {
        // Is head
        this.head = next;
    }
    if (next) {
        next.prev = prev;
    }
    else {
        // Is tail
        this.tail = prev;
    }
    entry.next = entry.prev = null;
    this._len--;
};

/**
 * @return {Number}
 */
linkedListProto.len = function () {
    return this._len;
};

/**
 * Clear list
 */
linkedListProto.clear = function () {
    this.head = this.tail = null;
    this._len = 0;
};

/**
 * @constructor
 * @param {} val
 */
var Entry = function (val) {
    /**
     * @property {}
     */
    this.value = val;

    /**
     * @property {module:zrender/core/LRU~Entry}
     */
    this.next;

    /**
     * @property {module:zrender/core/LRU~Entry}
     */
    this.prev;
};

/**
 * LRU Cache
 * @constructor
 * @alias module:zrender/core/LRU
 */
var LRU = function (maxSize) {

    this._list = new LinkedList();

    this._map = {};

    this._maxSize = maxSize || 10;

    this._lastRemovedEntry = null;
};

var LRUProto = LRU.prototype;

/**
 * @param  {String} key
 * @param  {} value
 * @return {} Removed value
 */
LRUProto.put = function (key, value) {
    var list = this._list;
    var map = this._map;
    var removed = null;
    if (map[key] == null) {
        var len = list.len();
        // Reuse last removed entry
        var entry = this._lastRemovedEntry;

        if (len >= this._maxSize && len > 0) {
            // Remove the least recently used
            var leastUsedEntry = list.head;
            list.remove(leastUsedEntry);
            delete map[leastUsedEntry.key];

            removed = leastUsedEntry.value;
            this._lastRemovedEntry = leastUsedEntry;
        }

        if (entry) {
            entry.value = value;
        }
        else {
            entry = new Entry(value);
        }
        entry.key = key;
        list.insertEntry(entry);
        map[key] = entry;
    }

    return removed;
};

/**
 * @param  {String} key
 * @return {}
 */
LRUProto.get = function (key) {
    var entry = this._map[key];
    var list = this._list;
    if (entry != null) {
        // Put the latest used entry in the tail
        if (entry !== list.tail) {
            list.remove(entry);
            list.insertEntry(entry);
        }

        return entry.value;
    }
};

/**
 * Clear the cache
 */
LRUProto.clear = function () {
    this._list.clear();
    this._map = {};
};

var kCSSColorTable = {
    'transparent': [0, 0, 0, 0], 'aliceblue': [240, 248, 255, 1],
    'antiquewhite': [250, 235, 215, 1], 'aqua': [0, 255, 255, 1],
    'aquamarine': [127, 255, 212, 1], 'azure': [240, 255, 255, 1],
    'beige': [245, 245, 220, 1], 'bisque': [255, 228, 196, 1],
    'black': [0, 0, 0, 1], 'blanchedalmond': [255, 235, 205, 1],
    'blue': [0, 0, 255, 1], 'blueviolet': [138, 43, 226, 1],
    'brown': [165, 42, 42, 1], 'burlywood': [222, 184, 135, 1],
    'cadetblue': [95, 158, 160, 1], 'chartreuse': [127, 255, 0, 1],
    'chocolate': [210, 105, 30, 1], 'coral': [255, 127, 80, 1],
    'cornflowerblue': [100, 149, 237, 1], 'cornsilk': [255, 248, 220, 1],
    'crimson': [220, 20, 60, 1], 'cyan': [0, 255, 255, 1],
    'darkblue': [0, 0, 139, 1], 'darkcyan': [0, 139, 139, 1],
    'darkgoldenrod': [184, 134, 11, 1], 'darkgray': [169, 169, 169, 1],
    'darkgreen': [0, 100, 0, 1], 'darkgrey': [169, 169, 169, 1],
    'darkkhaki': [189, 183, 107, 1], 'darkmagenta': [139, 0, 139, 1],
    'darkolivegreen': [85, 107, 47, 1], 'darkorange': [255, 140, 0, 1],
    'darkorchid': [153, 50, 204, 1], 'darkred': [139, 0, 0, 1],
    'darksalmon': [233, 150, 122, 1], 'darkseagreen': [143, 188, 143, 1],
    'darkslateblue': [72, 61, 139, 1], 'darkslategray': [47, 79, 79, 1],
    'darkslategrey': [47, 79, 79, 1], 'darkturquoise': [0, 206, 209, 1],
    'darkviolet': [148, 0, 211, 1], 'deeppink': [255, 20, 147, 1],
    'deepskyblue': [0, 191, 255, 1], 'dimgray': [105, 105, 105, 1],
    'dimgrey': [105, 105, 105, 1], 'dodgerblue': [30, 144, 255, 1],
    'firebrick': [178, 34, 34, 1], 'floralwhite': [255, 250, 240, 1],
    'forestgreen': [34, 139, 34, 1], 'fuchsia': [255, 0, 255, 1],
    'gainsboro': [220, 220, 220, 1], 'ghostwhite': [248, 248, 255, 1],
    'gold': [255, 215, 0, 1], 'goldenrod': [218, 165, 32, 1],
    'gray': [128, 128, 128, 1], 'green': [0, 128, 0, 1],
    'greenyellow': [173, 255, 47, 1], 'grey': [128, 128, 128, 1],
    'honeydew': [240, 255, 240, 1], 'hotpink': [255, 105, 180, 1],
    'indianred': [205, 92, 92, 1], 'indigo': [75, 0, 130, 1],
    'ivory': [255, 255, 240, 1], 'khaki': [240, 230, 140, 1],
    'lavender': [230, 230, 250, 1], 'lavenderblush': [255, 240, 245, 1],
    'lawngreen': [124, 252, 0, 1], 'lemonchiffon': [255, 250, 205, 1],
    'lightblue': [173, 216, 230, 1], 'lightcoral': [240, 128, 128, 1],
    'lightcyan': [224, 255, 255, 1], 'lightgoldenrodyellow': [250, 250, 210, 1],
    'lightgray': [211, 211, 211, 1], 'lightgreen': [144, 238, 144, 1],
    'lightgrey': [211, 211, 211, 1], 'lightpink': [255, 182, 193, 1],
    'lightsalmon': [255, 160, 122, 1], 'lightseagreen': [32, 178, 170, 1],
    'lightskyblue': [135, 206, 250, 1], 'lightslategray': [119, 136, 153, 1],
    'lightslategrey': [119, 136, 153, 1], 'lightsteelblue': [176, 196, 222, 1],
    'lightyellow': [255, 255, 224, 1], 'lime': [0, 255, 0, 1],
    'limegreen': [50, 205, 50, 1], 'linen': [250, 240, 230, 1],
    'magenta': [255, 0, 255, 1], 'maroon': [128, 0, 0, 1],
    'mediumaquamarine': [102, 205, 170, 1], 'mediumblue': [0, 0, 205, 1],
    'mediumorchid': [186, 85, 211, 1], 'mediumpurple': [147, 112, 219, 1],
    'mediumseagreen': [60, 179, 113, 1], 'mediumslateblue': [123, 104, 238, 1],
    'mediumspringgreen': [0, 250, 154, 1], 'mediumturquoise': [72, 209, 204, 1],
    'mediumvioletred': [199, 21, 133, 1], 'midnightblue': [25, 25, 112, 1],
    'mintcream': [245, 255, 250, 1], 'mistyrose': [255, 228, 225, 1],
    'moccasin': [255, 228, 181, 1], 'navajowhite': [255, 222, 173, 1],
    'navy': [0, 0, 128, 1], 'oldlace': [253, 245, 230, 1],
    'olive': [128, 128, 0, 1], 'olivedrab': [107, 142, 35, 1],
    'orange': [255, 165, 0, 1], 'orangered': [255, 69, 0, 1],
    'orchid': [218, 112, 214, 1], 'palegoldenrod': [238, 232, 170, 1],
    'palegreen': [152, 251, 152, 1], 'paleturquoise': [175, 238, 238, 1],
    'palevioletred': [219, 112, 147, 1], 'papayawhip': [255, 239, 213, 1],
    'peachpuff': [255, 218, 185, 1], 'peru': [205, 133, 63, 1],
    'pink': [255, 192, 203, 1], 'plum': [221, 160, 221, 1],
    'powderblue': [176, 224, 230, 1], 'purple': [128, 0, 128, 1],
    'red': [255, 0, 0, 1], 'rosybrown': [188, 143, 143, 1],
    'royalblue': [65, 105, 225, 1], 'saddlebrown': [139, 69, 19, 1],
    'salmon': [250, 128, 114, 1], 'sandybrown': [244, 164, 96, 1],
    'seagreen': [46, 139, 87, 1], 'seashell': [255, 245, 238, 1],
    'sienna': [160, 82, 45, 1], 'silver': [192, 192, 192, 1],
    'skyblue': [135, 206, 235, 1], 'slateblue': [106, 90, 205, 1],
    'slategray': [112, 128, 144, 1], 'slategrey': [112, 128, 144, 1],
    'snow': [255, 250, 250, 1], 'springgreen': [0, 255, 127, 1],
    'steelblue': [70, 130, 180, 1], 'tan': [210, 180, 140, 1],
    'teal': [0, 128, 128, 1], 'thistle': [216, 191, 216, 1],
    'tomato': [255, 99, 71, 1], 'turquoise': [64, 224, 208, 1],
    'violet': [238, 130, 238, 1], 'wheat': [245, 222, 179, 1],
    'white': [255, 255, 255, 1], 'whitesmoke': [245, 245, 245, 1],
    'yellow': [255, 255, 0, 1], 'yellowgreen': [154, 205, 50, 1]
};

function clampCssByte(i) {  // Clamp to integer 0 .. 255.
    i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
    return i < 0 ? 0 : i > 255 ? 255 : i;
}

function clampCssAngle(i) {  // Clamp to integer 0 .. 360.
    i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
    return i < 0 ? 0 : i > 360 ? 360 : i;
}

function clampCssFloat(f) {  // Clamp to float 0.0 .. 1.0.
    return f < 0 ? 0 : f > 1 ? 1 : f;
}

function parseCssInt(str) {  // int or percentage.
    if (str.length && str.charAt(str.length - 1) === '%') {
        return clampCssByte(parseFloat(str) / 100 * 255);
    }
    return clampCssByte(parseInt(str, 10));
}

function parseCssFloat(str) {  // float or percentage.
    if (str.length && str.charAt(str.length - 1) === '%') {
        return clampCssFloat(parseFloat(str) / 100);
    }
    return clampCssFloat(parseFloat(str));
}

function cssHueToRgb(m1, m2, h) {
    if (h < 0) {
        h += 1;
    }
    else if (h > 1) {
        h -= 1;
    }

    if (h * 6 < 1) {
        return m1 + (m2 - m1) * h * 6;
    }
    if (h * 2 < 1) {
        return m2;
    }
    if (h * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - h) * 6;
    }
    return m1;
}

function lerpNumber(a, b, p) {
    return a + (b - a) * p;
}

function setRgba(out, r, g, b, a) {
    out[0] = r;
    out[1] = g;
    out[2] = b;
    out[3] = a;
    return out;
}
function copyRgba(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
}

var colorCache = new LRU(20);
var lastRemovedArr = null;

function putToCache(colorStr, rgbaArr) {
    // Reuse removed array
    if (lastRemovedArr) {
        copyRgba(lastRemovedArr, rgbaArr);
    }
    lastRemovedArr = colorCache.put(colorStr, lastRemovedArr || (rgbaArr.slice()));
}

/**
 * @param {String} colorStr
 * @param {Array<Number>} out
 * @return {Array<Number>}
 * @memberOf module:zrender/util/color
 */
function parse(colorStr, rgbaArr) {
    if (!colorStr) {
        return;
    }
    rgbaArr = rgbaArr || [];

    var cached = colorCache.get(colorStr);
    if (cached) {
        return copyRgba(rgbaArr, cached);
    }

    // colorStr may be not string
    colorStr = colorStr + '';
    // Remove all whitespace, not compliant, but should just be more accepting.
    var str = colorStr.replace(/ /g, '').toLowerCase();

    // Color keywords (and transparent) lookup.
    if (str in kCSSColorTable) {
        copyRgba(rgbaArr, kCSSColorTable[str]);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;
    }

    // #abc and #abc123 syntax.
    if (str.charAt(0) === '#') {
        if (str.length === 4) {
            var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
            if (!(iv >= 0 && iv <= 0xfff)) {
                setRgba(rgbaArr, 0, 0, 0, 1);
                return;  // Covers NaN.
            }
            setRgba(rgbaArr,
                ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8),
                (iv & 0xf0) | ((iv & 0xf0) >> 4),
                (iv & 0xf) | ((iv & 0xf) << 4),
                1
            );
            putToCache(colorStr, rgbaArr);
            return rgbaArr;
        }
        else if (str.length === 7) {
            var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
            if (!(iv >= 0 && iv <= 0xffffff)) {
                setRgba(rgbaArr, 0, 0, 0, 1);
                return;  // Covers NaN.
            }
            setRgba(rgbaArr,
                (iv & 0xff0000) >> 16,
                (iv & 0xff00) >> 8,
                iv & 0xff,
                1
            );
            putToCache(colorStr, rgbaArr);
            return rgbaArr;
        }

        return;
    }
    var op = str.indexOf('(');
    var ep = str.indexOf(')');
    if (op !== -1 && ep + 1 === str.length) {
        var fname = str.substr(0, op);
        var params = str.substr(op + 1, ep - (op + 1)).split(',');
        var alpha = 1;  // To allow case fallthrough.
        switch (fname) {
            case 'rgba':
                if (params.length !== 4) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                alpha = parseCssFloat(params.pop()); // jshint ignore:line
            // Fall through.
            case 'rgb':
                if (params.length !== 3) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                setRgba(rgbaArr,
                    parseCssInt(params[0]),
                    parseCssInt(params[1]),
                    parseCssInt(params[2]),
                    alpha
                );
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            case 'hsla':
                if (params.length !== 4) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                params[3] = parseCssFloat(params[3]);
                hsla2rgba(params, rgbaArr);
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            case 'hsl':
                if (params.length !== 3) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                hsla2rgba(params, rgbaArr);
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            default:
                return;
        }
    }

    setRgba(rgbaArr, 0, 0, 0, 1);
    return;
}

/**
 * @param {Array<Number>} hsla
 * @param {Array<Number>} rgba
 * @return {Array<Number>} rgba
 */
function hsla2rgba(hsla, rgba) {
    var h = (((parseFloat(hsla[0]) % 360) + 360) % 360) / 360;  // 0 .. 1
    // NOTE(deanm): According to the CSS spec s/l should only be
    // percentages, but we don't bother and let float or percentage.
    var s = parseCssFloat(hsla[1]);
    var l = parseCssFloat(hsla[2]);
    var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    var m1 = l * 2 - m2;

    rgba = rgba || [];
    setRgba(rgba,
        clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255),
        clampCssByte(cssHueToRgb(m1, m2, h) * 255),
        clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255),
        1
    );

    if (hsla.length === 4) {
        rgba[3] = hsla[3];
    }

    return rgba;
}

/**
 * @param {Array<Number>} rgba
 * @return {Array<Number>} hsla
 */
function rgba2hsla(rgba) {
    if (!rgba) {
        return;
    }

    // RGB from 0 to 255
    var R = rgba[0] / 255;
    var G = rgba[1] / 255;
    var B = rgba[2] / 255;

    var vMin = Math.min(R, G, B); // Min. value of RGB
    var vMax = Math.max(R, G, B); // Max. value of RGB
    var delta = vMax - vMin; // Delta RGB value

    var L = (vMax + vMin) / 2;
    var H;
    var S;
    // HSL results from 0 to 1
    if (delta === 0) {
        H = 0;
        S = 0;
    }
    else {
        if (L < 0.5) {
            S = delta / (vMax + vMin);
        }
        else {
            S = delta / (2 - vMax - vMin);
        }

        var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
        var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
        var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;

        if (R === vMax) {
            H = deltaB - deltaG;
        }
        else if (G === vMax) {
            H = (1 / 3) + deltaR - deltaB;
        }
        else if (B === vMax) {
            H = (2 / 3) + deltaG - deltaR;
        }

        if (H < 0) {
            H += 1;
        }

        if (H > 1) {
            H -= 1;
        }
    }

    var hsla = [H * 360, S, L];

    if (rgba[3] != null) {
        hsla.push(rgba[3]);
    }

    return hsla;
}

/**
 * @param {String} color
 * @param {Number} level
 * @return {String}
 * @memberOf module:zrender/util/color
 */
function lift(color, level) {
    var colorArr = parse(color);
    if (colorArr) {
        for (var i = 0; i < 3; i++) {
            if (level < 0) {
                colorArr[i] = colorArr[i] * (1 - level) | 0;
            }
            else {
                colorArr[i] = ((255 - colorArr[i]) * level + colorArr[i]) | 0;
            }
            if (colorArr[i] > 255) {
                colorArr[i] = 255;
            }
            else if (color[i] < 0) {
                colorArr[i] = 0;
            }
        }
        return stringify(colorArr, colorArr.length === 4 ? 'rgba' : 'rgb');
    }
}

/**
 * @param {String} color
 * @return {String}
 * @memberOf module:zrender/util/color
 */
function toHex(color) {
    var colorArr = parse(color);
    if (colorArr) {
        return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + (+colorArr[2])).toString(16).slice(1);
    }
}

/**
 * Map value to color. Faster than lerp methods because color is represented by rgba array.
 * @param {Number} normalizedValue A float between 0 and 1.
 * @param {Array<Array.<Number>>} colors List of rgba color array
 * @param {Array<Number>} [out] Mapped gba color array
 * @return {Array<Number>} will be null/undefined if input illegal.
 */
function fastLerp(normalizedValue, colors, out) {
    if (!(colors && colors.length)
        || !(normalizedValue >= 0 && normalizedValue <= 1)
    ) {
        return;
    }

    out = out || [];

    var value = normalizedValue * (colors.length - 1);
    var leftIndex = Math.floor(value);
    var rightIndex = Math.ceil(value);
    var leftColor = colors[leftIndex];
    var rightColor = colors[rightIndex];
    var dv = value - leftIndex;
    out[0] = clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv));
    out[1] = clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv));
    out[2] = clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv));
    out[3] = clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv));

    return out;
}

/**
 * @deprecated
 */
var fastMapToColor = fastLerp;

/**
 * @param {Number} normalizedValue A float between 0 and 1.
 * @param {Array<String>} colors Color list.
 * @param {boolean=} fullOutput Default false.
 * @return {(string|Object)} Result color. If fullOutput,
 *                           return {color: ..., leftIndex: ..., rightIndex: ..., value: ...},
 * @memberOf module:zrender/util/color
 */
function lerp$1(normalizedValue, colors, fullOutput) {
    if (!(colors && colors.length)
        || !(normalizedValue >= 0 && normalizedValue <= 1)
    ) {
        return;
    }

    var value = normalizedValue * (colors.length - 1);
    var leftIndex = Math.floor(value);
    var rightIndex = Math.ceil(value);
    var leftColor = parse(colors[leftIndex]);
    var rightColor = parse(colors[rightIndex]);
    var dv = value - leftIndex;

    var color = stringify(
        [
            clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv)),
            clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv)),
            clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv)),
            clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv))
        ],
        'rgba'
    );

    return fullOutput
        ? {
            color: color,
            leftIndex: leftIndex,
            rightIndex: rightIndex,
            value: value
        }
        : color;
}

/**
 * @deprecated
 */
var mapToColor = lerp$1;

/**
 * @param {String} color
 * @param {number=} h 0 ~ 360, ignore when null.
 * @param {number=} s 0 ~ 1, ignore when null.
 * @param {number=} l 0 ~ 1, ignore when null.
 * @return {String} Color string in rgba format.
 * @memberOf module:zrender/util/color
 */
function modifyHSL(color, h, s, l) {
    color = parse(color);

    if (color) {
        color = rgba2hsla(color);
        h != null && (color[0] = clampCssAngle(h));
        s != null && (color[1] = parseCssFloat(s));
        l != null && (color[2] = parseCssFloat(l));

        return stringify(hsla2rgba(color), 'rgba');
    }
}

/**
 * @param {String} color
 * @param {number=} alpha 0 ~ 1
 * @return {String} Color string in rgba format.
 * @memberOf module:zrender/util/color
 */
function modifyAlpha(color, alpha) {
    color = parse(color);

    if (color && alpha != null) {
        color[3] = clampCssFloat(alpha);
        return stringify(color, 'rgba');
    }
}

/**
 * @param {Array<Number>} arrColor like [12,33,44,0.4]
 * @param {String} type 'rgba', 'hsva', ...
 * @return {String} Result color. (If input illegal, return undefined).
 */
function stringify(arrColor, type) {
    if (!arrColor || !arrColor.length) {
        return;
    }
    var colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];
    if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
        colorStr += ',' + arrColor[3];
    }
    return type + '(' + colorStr + ')';
}


var colorUtil = (Object.freeze || Object)({
	parse: parse,
	lift: lift,
	toHex: toHex,
	fastLerp: fastLerp,
	fastMapToColor: fastMapToColor,
	lerp: lerp$1,
	mapToColor: mapToColor,
	modifyHSL: modifyHSL,
	modifyAlpha: modifyAlpha,
	stringify: stringify
});

/**
 * @class zrender.animation.Track
 * 
 * Track, 轨道，与元素（Element）上可以用来进行动画的属性一一对应。
 * 元素上存在很多种属性，在动画过程中，可能会有多种属性同时发生变化，
 * 每一种属性天然成为一条动画轨道，把这些轨道上的变化过程封装在 Timeline 中。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

class Track{
    /**
     * @method constructor Track
     * @param {Object} options 
     */
    constructor(options){
        this._target=options._target;
        this._getter=options._getter;
        this._setter=options._setter;
        this._loop=options._loop;
        this._delay=options._delay;
        
        this.isFinished=false;
        this.keyframes=[];
        this.timeline;
    }

    /**
     * @method addKeyFrame
     * 添加关键帧
     * @param {Object} kf 数据结构为 {time:0,value:0}
     */
    addKeyFrame(kf){
        this.keyframes.push(kf);
    }

    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} time  当前时间
     * @param {Number} delta 时间偏移量
     */
    nextFrame(time, delta){
        if(!this.timeline){//TODO:fix this, there is something wrong here.
            return;
        }
        let result=this.timeline.nextFrame(time,delta);
        if(isNumeric(result)&&result===1){
            this.isFinished=true;
        }
        return result;
    }

    /**
     * @method fire
     * 触发事件
     * @param {String} eventType 
     * @param {Object} arg 
     */
    fire(eventType, arg){
        this.timeline.fire(eventType, arg);
    }

    /**
     * @method start
     * 开始动画
     * @param {String} easing 缓动函数名称
     * @param {String} propName 属性名称
     * @param {Boolean} forceAnimate 是否强制开启动画 
     */
    start(easing,propName, forceAnimate){
        let options=this._parseKeyFrames(
            easing, 
            propName, 
            forceAnimate
        );
    
        //如果传入的参数不正确，则无法构造实例
        if(!options){
            return null;
        }
        let timeline = new Timeline(options);
        this.timeline=timeline;
    }

    /**
     * @method stop
     * 停止动画
     * @param {Boolean} forwardToLast 是否快进到最后一帧 
     */
    stop(forwardToLast){
        if (forwardToLast) {
            // Move to last frame before stop
            this.timeline.onframe(this._target, 1);
        }
    }

    /**
     * @method pause
     * 暂停
     */
    pause(){
        this.timeline.pause();
    }

    /**
     * @method resume
     * 重启
     */
    resume(){
        this.timeline.resume();
    }
    
    /**
     * @private
     * @method _parseKeyFrames
     * 解析关键帧，创建时间线
     * @param {String} easing 缓动函数名称
     * @param {String} propName 属性名称
     * @param {Boolean} forceAnimate 是否强制开启动画 
     * //TODO:try move this into webworker
     */
    _parseKeyFrames(easing,propName,forceAnimate) {
        let loop=this._loop;
        let delay=this._delay;
        let target=this._target;
        let getter=this._getter;
        let setter=this._setter;
        let useSpline = easing === 'spline';
    
        let kfLength = this.keyframes.length;
        if (!kfLength) {
            return;
        }
        
        // Guess data type
        let firstVal = this.keyframes[0].value;
        let isValueArray = isArrayLike(firstVal);
        let isValueColor = false;
        let isValueString = false;
    
        // For vertices morphing
        let arrDim = isValueArray ? getArrayDim(this.keyframes) : 0;
    
        this.keyframes.sort((a, b)=>{
            return a.time - b.time;
        });
    
        let trackMaxTime = this.keyframes[kfLength - 1].time;
        let kfPercents = [];
        let kfValues = [];
        let prevValue = this.keyframes[0].value;
        let isAllValueEqual = true;
    
        for (let i = 0; i < kfLength; i++) {
            kfPercents.push(this.keyframes[i].time / trackMaxTime);
            // Assume value is a color when it is a string
            let value = this.keyframes[i].value;
    
            // Check if value is equal, deep check if value is array
            if (!((isValueArray && isArraySame(value, prevValue, arrDim))
                || (!isValueArray && value === prevValue))) {
                isAllValueEqual = false;
            }
            prevValue = value;
    
            // Try converting a string to a color array
            if (typeof value === 'string') {
                let colorArray = parse(value);
                if (colorArray) {
                    value = colorArray;
                    isValueColor = true;
                }else {
                    isValueString = true;
                }
            }
            kfValues.push(value);
        }
        if (!forceAnimate && isAllValueEqual) {
            return;
        }
    
        let lastValue = kfValues[kfLength - 1];
        // Polyfill array and NaN value
        for (let i = 0; i < kfLength - 1; i++) {
            if (isValueArray) {
                fillArr(kfValues[i], lastValue, arrDim);
            }else {
                if (isNaN(kfValues[i]) && !isNaN(lastValue) && !isValueString && !isValueColor) {
                    kfValues[i] = lastValue;
                }
            }
        }
        isValueArray && fillArr(getter(target, propName), lastValue, arrDim);
    
        // Cache the key of last frame to speed up when
        // animation playback is sequency
        let lastFrame = 0;
        let lastFramePercent = 0;
        let start;
        let w;
        let p0;
        let p1;
        let p2;
        let p3;
        let rgba = [0, 0, 0, 0];
    
        //Timeline 每一帧都会回调此方法。
        let onframe = function (target, percent) {
            // Find the range keyframes
            // kf1-----kf2---------current--------kf3
            // find kf2 and kf3 and do interpolation
            let frame;
            // In the easing function like elasticOut, percent may less than 0
            if (percent < 0) {
                frame = 0;
            }else if (percent < lastFramePercent) {
                // Start from next key
                // PENDING start from lastFrame ?
                start = Math.min(lastFrame + 1, kfLength - 1);
                for (frame = start; frame >= 0; frame--) {
                    if (kfPercents[frame] <= percent) {
                        break;
                    }
                }
                // PENDING really need to do this ?
                frame = Math.min(frame, kfLength - 2);
            }else {
                for (frame = lastFrame; frame < kfLength; frame++) {
                    if (kfPercents[frame] > percent) {
                        break;
                    }
                }
                frame = Math.min(frame - 1, kfLength - 2);
            }
            lastFrame = frame;
            lastFramePercent = percent;
    
            let range = (kfPercents[frame + 1] - kfPercents[frame]);
            if (range === 0) {
                return;
            }else {
                w = (percent - kfPercents[frame]) / range;
            }
            
            if (useSpline) {
                p1 = kfValues[frame];
                p0 = kfValues[frame === 0 ? frame : frame - 1];
                p2 = kfValues[frame > kfLength - 2 ? kfLength - 1 : frame + 1];
                p3 = kfValues[frame > kfLength - 3 ? kfLength - 1 : frame + 2];
                if (isValueArray) {
                    catmullRomInterpolateArray(
                        p0, p1, p2, p3, w, w * w, w * w * w,
                        getter(target, propName),
                        arrDim
                    );
                }else {
                    let value;
                    if (isValueColor) {
                        value = catmullRomInterpolateArray(
                            p0, p1, p2, p3, w, w * w, w * w * w,
                            rgba, 1
                        );
                        value = rgba2String(rgba);
                    }else if (isValueString) {
                        // String is step(0.5)
                        return interpolateString(p1, p2, w);
                    }else {
                        value = catmullRomInterpolate(
                            p0, p1, p2, p3, w, w * w, w * w * w
                        );
                    }
                    setter(
                        target,
                        propName,
                        value
                    );
                }
            }else {
                if (isValueArray) {
                    interpolateArray(
                        kfValues[frame], kfValues[frame + 1], w,
                        getter(target, propName),
                        arrDim
                    );
                }else {
                    let value;
                    if (isValueColor) {
                        interpolateArray(
                            kfValues[frame], kfValues[frame + 1], w,
                            rgba, 1
                        );
                        value = rgba2String(rgba);
                    }else if (isValueString) {
                        // String is step(0.5)
                        return interpolateString(kfValues[frame], kfValues[frame + 1], w);
                    }else {
                        value = interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
                    }
                    setter(
                        target,
                        propName,
                        value
                    );
                }
            }
        };
        
        let options={
            target:target,
            lifeTime: trackMaxTime,
            loop:loop,
            delay:delay,
            onframe: onframe,
            easing: (easing && easing !== 'spline')?easing:'Linear'
        };
        return options;
    }
}

/**
 * @class zrender.animation.AnimationProcess
 * 
 * AnimationProcess 表示一次完整的动画过程，每一个元素（Element）中都有一个列表，用来存储本实例上的动画过程。
 * GlobalAnimationMgr 负责维护和调度所有 AnimationProcess 实例。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor AnimationProcess
 * @param {Object} target 需要进行动画的元素
 * @param {Boolean} loop 动画是否循环播放
 * @param {Function} getter
 * @param {Function} setter
 */
// let AnimationProcess = function (target, loop, getter, setter) {
    
// };

// AnimationProcess.prototype = {};

class AnimationProcess{
    constructor(target, loop, getter, setter){
        this._trackCacheMap = new Map();
        this._target = target;
        this._loop = loop || false;
        this._getter = getter || function(target, key) {
            return target[key];
        };
        this._setter = setter || function(target, key, value) {
            target[key] = value;
        };
    
        this._delay = 0;
        this._paused = false;
        this._doneList = [];    //callback list when the entire animation process is finished
        this._onframeList = []; //callback list for each frame
    }

    /**
     * @method when
     * 为每一种需要进行动画的属性创建一条轨道
     * @param  {Number} time 关键帧时间，单位ms
     * @param  {Object} props 关键帧的属性值，key-value表示
     * @return {zrender.animation.AnimationProcess}
     */
    when(time, props) {
        for (let propName in props) {
            if (!props.hasOwnProperty(propName)) {
                continue;
            }

            // Invalid value
            let value = this._getter(this._target, propName);
            if (value == null) {
                // zrLog('Invalid property ' + propName);
                continue;
            }

            let track=this._trackCacheMap.get(propName);
            if(!track){
                track=new Track({
                    _target:this._target,
                    _getter:this._getter,
                    _setter:this._setter,
                    _loop:this._loop,
                    _delay:this._delay
                });
            }

            if (time !== 0) {
                track.addKeyFrame({
                    time: 0,
                    value: cloneValue(value)
                });
            }

            track.addKeyFrame({
                time: time,
                value: props[propName]
            });

            this._trackCacheMap.set(propName,track);
        }
        return this;
    }

    /**
     * @method during
     * 添加动画每一帧的回调函数
     * @param  {Function} callback
     * @return {zrender.animation.AnimationProcess}
     */
    during(callback) {
        this._onframeList.push(callback);
        return this;
    }

    /**
     * @private
     * @method _doneCallback
     * 动画过程整体结束的时候回调此函数
     */
    _doneCallback() {
        this._doneList.forEach((fn,index)=>{
            fn.call(this);
        });
        this._trackCacheMap = new Map();
    }

    /**
     * @method isFinished
     * 判断整个动画过程是否已经完成，所有 Track 上的动画都完成则整个动画过程完成
     */
    isFinished() {
        let isFinished=true;
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            if(!track.isFinished){
                isFinished=false;
            }
        });
        return isFinished;
    }

    /**
     * @method start
     * 开始执行动画
     * @param  {String|Function} [easing] 缓动函数名称，详见{@link zrender.animation.easing 缓动引擎}
     * @param  {Boolean} forceAnimate
     * @return {zrender.animation.AnimationProcess}
     */
    start(easing, forceAnimate) {
        let keys=[...this._trackCacheMap.keys()];
        keys.forEach((propName,index)=>{
            if (!this._trackCacheMap.get(propName)) {
                return;
            }
            let track=this._trackCacheMap.get(propName);
            track.start(easing,propName,forceAnimate);
        });

        // This optimization will help the case that in the upper application
        // the view may be refreshed frequently, where animation will be
        // called repeatly but nothing changed.
        if (!keys.length) {
            this._doneCallback();
        }
        return this;
    }

    /**
     * @method stop
     * 停止动画
     * @param {Boolean} forwardToLast If move to last frame before stop
     */
    stop(forwardToLast) {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.stop(this._target, 1);
        });
        this._trackCacheMap=new Map();
    }

    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} time  当前时间
     * @param {Number} delta 时间偏移量
     */
    nextFrame(time,delta){
        let deferredEvents = [];
        let deferredTracks = [];
        let percent="";

        [...this._trackCacheMap.values()].forEach((track,index)=>{
            let result = track.nextFrame(time, delta);
            if (isString(result)) {
                deferredEvents.push(result);
                deferredTracks.push(track);
            }else if(isNumeric(result)){
                percent=result;
            }
        });

        let len = deferredEvents.length;
        for (let i = 0; i < len; i++) {
            deferredTracks[i].fire(deferredEvents[i]);
        }

        if(isNumeric(percent)){
            for (let i = 0; i < this._onframeList.length; i++) {
                this._onframeList[i](this._target, percent);
            }
        }

        if(this.isFinished()){
            this._doneCallback();
        }
    }

    /**
     * @method pause
     * 暂停动画
     */
    pause() {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.pause();
        });
        this._paused = true;
    }

    /**
     * @method resume
     * 恢复动画
     */
    resume() {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.resume();
        });
        this._paused = false;
    }

    /**
     * @method isPaused
     * 是否暂停
     */
    isPaused() {
        return !!this._paused;
    }

    /**
     * @method delay
     * 设置动画延迟开始的时间
     * @param  {Number} time 单位ms
     * @return {zrender.animation.AnimationProcess}
     */
    delay(time) {
        this._delay = time;
        return this;
    }
    
    /**
     * @method done
     * 添加动画结束的回调
     * @param  {Function} cb
     * @return {zrender.animation.AnimationProcess}
     */
    done(cb) {
        if (cb) {
            this._doneList.push(cb);
        }
        return this;
    }
}

/**
 * @class zrender.animation.Animatable
 * 
 * 动画接口类，在 Element 类中 mixin 此类提供的功能，为元素提供动画功能。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @abstract
 * @method constructor Animatable
 */
let Animatable = function () {
    /**
     * @property {zrender.animation.AnimationProcess}
     * @readOnly
     */
    this.animationProcessList = [];
};

Animatable.prototype = {

    constructor: Animatable,

    /**
     * @method 
     * 创建动画实例
     * @param {String} path The path to fetch value from object, like 'a.b.c'.
     * @param {Boolean} [loop=false] Whether to loop animation.
     * @return {zrender.animation.AnimationProcess}
     * @example
     * el.animate('style', false)
     *   .when(1000, {x: 10} )
     *   .done(function(){ // Animation done })
     *   .start()
     */
    animate: function (path, loop) {
        let target;
        let animatingShape = false;
        let animatable = this;
        if (path) {
            let pathSplitted = path.split('.');
            let prop = animatable;
            // If animating shape
            animatingShape = pathSplitted[0] === 'shape';
            for (let i = 0, l = pathSplitted.length; i < l; i++) {
                if (!prop) {
                    continue;
                }
                prop = prop[pathSplitted[i]];
            }
            if (prop) {
                target = prop;
            }
        }else {
            target = animatable;
        }

        if (!target) {
            console.log(
                'Property "'
                + path
                + '" is not existed in element '
                + animatable.id
            );
            return;
        }

        let animationProcess = new AnimationProcess(target, loop);
        animationProcess.during(function (target) {
            animatable.dirty(animatingShape);
        })
        .done(function () {
            // FIXME AnimationProcess will not be removed if use `AnimationProcess#stop` to stop animation
            animatable.animationProcessList.splice(indexOf(animatable.animationProcessList, animationProcess), 1);
        });
        animatable.animationProcessList.push(animationProcess);

        // If animate after added to the zrender
        if (this.__zr) {
            this.__zr.globalAnimationMgr.addAnimationProcess(animationProcess);
        }

        return animationProcess;
    },

    /**
     * @method
     * 停止动画
     * @param {Boolean} forwardToLast If move to last frame before stop
     */
    stopAnimation: function (forwardToLast) {
        this.animationProcessList.forEach((ap,index)=>{
            ap.stop(forwardToLast);
        });
        this.animationProcessList.length=0;
        return this;
    },

    /**
     * @method
     * Caution: this method will stop previous animation.
     * So do not use this method to one element twice before
     * animation starts, unless you know what you are doing.
     * @param {Object} [target]
     * @param {Number} [time=500] Time in ms
     * @param {String} [easing='linear']
     * @param {Number} [delay=0]
     * @param {Function} [callback]
     * @param {Function} [forceAnimate] Prevent stop animation and callbackm immediently when target values are the same as current values.
     *
     * @example
     *  // Animate position
     *  el.animateTo({
     *      position: [10, 10]
     *  }, function () { // done })
     *
     *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
     *  el.animateTo({
     *      shape: {
     *          width: 500
     *      },
     *      style: {
     *          fill: 'red'
     *      }
     *      position: [10, 10]
     *  }, 100, 100, 'cubicOut', function () { // done })
     */
    animateTo: function (target, time, delay, easing, callback, forceAnimate) {
        _doAnimation(this, target, time, delay, easing, callback, forceAnimate);
    },

    /**
     * @method
     * Animate from the target state to current state.
     * The params and the return value are the same as `this.animateTo`.
     * @param {Object} [target]
     * @param {Number} [time=500] Time in ms
     * @param {String} [easing='linear']
     * @param {Number} [delay=0]
     * @param {Function} [callback]
     * @param {Function} [forceAnimate] Prevent stop animation and callbackm immediently when target values are the same as current values.
     *
     */
    animateFrom: function (target, time, delay, easing, callback, forceAnimate) {
        _doAnimation(this, target, time, delay, easing, callback, forceAnimate, true);
    }
};

/**
 * @private
 * @method
 * @param {Element} animatable 
 * @param {Element} target 
 * @param {Number} time 
 * @param {Number} delay 
 * @param {String} easing 
 * @param {Function} callback 
 * @param {Boolean} forceAnimate 
 * @param {Boolean} reverse 
 */
function _doAnimation(animatable, target, time, delay, easing, callback, forceAnimate, reverse) {
    // animateTo(target, time, easing, callback);
    if (isString(delay)) {
        callback = easing;
        easing = delay;
        delay = 0;
    }
    // animateTo(target, time, delay, callback);
    else if (isFunction(easing)) {
        callback = easing;
        easing = 'linear';
        delay = 0;
    }
    // animateTo(target, time, callback);
    else if (isFunction(delay)) {
        callback = delay;
        delay = 0;
    }
    // animateTo(target, callback)
    else if (isFunction(time)) {
        callback = time;
        time = 500;
    }
    // animateTo(target)
    else if (!time) {
        time = 500;
    }
    // Stop all previous animations
    animatable.stopAnimation();
    animateToShallow(animatable, '', animatable, target, time, delay, reverse);

    // AnimationProcess may be removed immediately after start
    // if there is nothing to animate
    let animationProcessList = animatable.animationProcessList.slice();
    let count = animationProcessList.length;
    function done() {
        count--;
        if (!count) {
            callback && callback();
        }
    }

    // No animationProcessList. This should be checked before animationProcessList[i].start(),
    // because 'done' may be executed immediately if no need to animate.
    if (!count) {
        callback && callback();
    }
    // Start after all animationProcessList created
    // Incase any animationProcess is done immediately when all animation properties are not changed
    for (let i = 0; i < animationProcessList.length; i++) {
        animationProcessList[i]
            .done(done)
            .start(easing, forceAnimate);
    }
}

/**
 * @private
 * @method
 * 
 * @param {Element} animatable
 * @param {String} path=''
 * @param {Object} source=animatable
 * @param {Object} target
 * @param {Number} [time=500]
 * @param {Number} [delay=0]
 * @param {Boolean} [reverse] If `true`, animate
 *        from the `target` to current state.
 *
 * @example
 *  // Animate position
 *  el._animateToShallow({
 *      position: [10, 10]
 *  })
 *
 *  // Animate shape, style and position in 100ms, delayed 100ms
 *  el._animateToShallow({
 *      shape: {
 *          width: 500
 *      },
 *      style: {
 *          fill: 'red'
 *      }
 *      position: [10, 10]
 *  }, 100, 100)
 */
function animateToShallow(animatable, path, source, target, time, delay, reverse) {
    let objShallow = {};
    let propertyCount = 0;
    for (let prop in target) {
        if (!target.hasOwnProperty(prop)) {
            continue;
        }

        if (source[prop] != null) {
            if (isObject(target[prop]) && !isArrayLike(target[prop])) {
                animateToShallow(
                    animatable,
                    path ? path + '.' + prop : prop,
                    source[prop],
                    target[prop],
                    time,
                    delay,
                    reverse
                );
            }else {
                if (reverse) {
                    objShallow[prop] = source[prop];
                    setAttrByPath(animatable, path, prop, target[prop]);
                }else {
                    objShallow[prop] = target[prop];
                }
                propertyCount++;
            }
        }else if (target[prop] != null && !reverse) {
            setAttrByPath(animatable, path, prop, target[prop]);
        }
    }

    if (propertyCount > 0) {
        animatable.animate(path, false)
            .when(time == null ? 500 : time, objShallow)
            .delay(delay || 0);
    }
}

function setAttrByPath(el, path, prop, value) {
    // Attr directly if not has property
    // FIXME, if some property not needed for element ?
    if (!path) {
        el.attr(prop, value);
    }else {
        // Only support set shape or style
        let props = {};
        props[path] = {};
        props[path][prop] = value;
        el.attr(props);
    }
}

/**
 * @class zrender.graphic.Element
 * 
 * Root class, everything visable in ZRender is subclass of Element. 
 * This is an abstract class, please don't creat an instance directly.
 * 
 * 根类，ZRender 中所有可见的对象都是 Element 的子类。这是一个抽象类，请不要
 * 直接 new 这个类的实例。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class Element{
    /**
     * @method constructor Element
     */
    constructor(options){
        /**
         * @protected
         * @property options 配置项
         */
        this.options=options;
    
        /**
         * @property {String}
         */
        this.id = this.options.id || guid();

        /**
         * @property {String} type 元素类型
         */
        this.type='element';
    
        /**
         * @property {String} name 元素名字
         */
        this.name='';
    
        /**
         * @private
         * @property {ZRender} __zr
         * 
         * ZRender instance will be assigned when element is associated with zrender
         * 
         * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
         */
        this.__zr=null;
    
        /**
         * @private
         * @property {Boolean} __dirty
         * 
         * Dirty flag. From which painter will determine if this displayable object needs to be repainted.
         * 
         * 这是一个非常重要的标志位，在绘制大量对象的时候，把 __dirty 标记为 false 可以节省大量操作。
         */
        this.__dirty=true;
    
        /**
         * @private
         * @property  _rect
         */
        this._rect=null;
    
        /**
         * @property {Boolean} ignore
         * If ignore drawing and events of the element object
         * 图形是否忽略，为true时忽略图形的绘制以及事件触发
         */
        this.ignore=false;
    
        /**
         * @property {Path} clipPath
         * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
         * 该路径会继承被裁减对象的变换
         * @readOnly
         * @see http://www.w3.org/TR/2dcontext/#clipping-region
         */
        this.clipPath=null;
    
        /**
         * @property {Boolean} isGroup
         * 是否是 Group
         */
        this.isGroup=false;

        inheritProperties(this,Transformable,this.options);
        inheritProperties(this,Eventful,this.options);
        inheritProperties(this,Animatable,this.options);
        copyOwnProperties(this,this.options);
    }

    /**
     * @method
     * Drift element
     * 移动图元
     * @param  {Number} dx dx on the global space
     * @param  {Number} dy dy on the global space
     */
    drift(dx, dy) {
        switch (this.draggable) {
            case 'horizontal':
                dy = 0;
                break;
            case 'vertical':
                dx = 0;
                break;
        }

        let m = this.transform;
        if (!m) {
            m = this.transform = [1, 0, 0, 1, 0, 0];
        }
        m[4] += dx;
        m[5] += dy;

        this.decomposeTransform();
        this.dirty(false);
    }

    /**
     * @property {Function} beforeUpdate
     * Hook before update
     * 
     * 刷新之前回调
     */
    beforeUpdate() {}

    /**
     * @property {Function} update
     * Update each frame
     * 
     * 刷新每一帧回调
     */
    update() {
        this.updateTransform();
    }

    /**
     * @property {Function} afterUpdate
     * Hook after update
     * 
     * 刷新之后回调
     */
    afterUpdate() {}
    
    /**
     * @property {Function} traverse
     * @param  {Function} cb
     * @param  {Object}   context
     */
    traverse(cb, context) {}

    /**
     * @protected
     * @method attrKV
     * @param {String} key
     * @param {Object} value
     */
    attrKV(key, value) {
        if (key === 'position' || key === 'scale' || key === 'origin') {
            // Copy the array
            if (value) {
                let target = this[key];
                if (!target) {
                    target = this[key] = [];
                }
                target[0] = value[0];
                target[1] = value[1];
            }
        }else {
            this[key] = value;
        }
    }

    /**
     * @method hide
     * Hide the element
     */
    hide() {
        this.ignore = true;
        this.__zr && this.__zr.refresh();
    }

    /**
     * @method show
     * Show the element
     */
    show() {
        this.ignore = false;
        this.__zr && this.__zr.refresh();
    }

    /**
     * @method attr
     * 修改对象上的属性。
     * @param {String|Object} key
     * @param {*} value
     */
    attr(key, value) {
        if (typeof key === 'String') {
            this.attrKV(key, value);
        }else if (isObject(key)) {
            for (let name in key) {
                if (key.hasOwnProperty(name)) {
                    this.attrKV(name, key[name]);
                }
            }
        }
        this.dirty(false);
        return this;
    }

    /**
     * @method setClipPath
     * @param {Path} clipPath
     */
    setClipPath(clipPath) {
        let zr = this.__zr;
        if (zr) {
            clipPath.addSelfToZr(zr);
        }

        // Remove previous clip path
        if (this.clipPath && this.clipPath !== clipPath) {
            this.removeClipPath();
        }

        this.clipPath = clipPath;
        clipPath.__zr = zr;
        clipPath.__clipTarget = this;

        //TODO: FIX this，需要重写一下，考虑把 Element 类和 Displayable 类合并起来。
        //dirty() 方法定义在子类 Displayable 中，这里似乎不应该直接调用，作为父类的 Element 不应该了解子类的实现，否则不易理解和维护。
        //另，Displayable 中的 dirty() 方法没有参数，而孙类 Path 中的 dirty() 方法有参数。
        this.dirty(false);
    }

    /**
     * @method removeClipPath
     */
    removeClipPath() {
        let clipPath = this.clipPath;
        if (clipPath) {
            if (clipPath.__zr) {
                clipPath.removeSelfFromZr(clipPath.__zr);
            }

            clipPath.__zr = null;
            clipPath.__clipTarget = null;
            this.clipPath = null;

            this.dirty(false);
        }
    }

    /**
     * @protected
     * @method dirty
     * Mark displayable element dirty and refresh next frame
     */
    dirty() {
        this.__dirty = this.__dirtyText = true;
        this._rect = null;
        this.__zr && this.__zr.refresh();
    }

    /**
     * @method addSelfToZr
     * Add self to zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {ZRender} zr
     */
    addSelfToZr(zr) {
        this.__zr = zr;
        // 添加动画
        let animationProcessList = this.animationProcessList;
        if (animationProcessList) {
            for (let i = 0; i < animationProcessList.length; i++) {
                zr.globalAnimationMgr.addAnimationProcess(animationProcessList[i]);
            }
        }

        if (this.clipPath) {
            this.clipPath.addSelfToZr(zr);
        }
    }

    /**
     * @method removeSelfFromZr
     * Remove self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {ZRender} zr
     */
    removeSelfFromZr(zr) {
        this.__zr = null;
        // 移除动画
        let animationProcessList = this.animationProcessList;
        if (animationProcessList) {
            for (let i = 0; i < animationProcessList.length; i++) {
                zr.globalAnimationMgr.removeAnimationProcess(animationProcessList[i]);
            }
        }

        if (this.clipPath) {
            this.clipPath.removeSelfFromZr(zr);
        }
    }
}

mixin(Element, Animatable);
mixin(Element, Transformable);
mixin(Element, Eventful);

/**
 * @class zrender.core.BoundingRect
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let v2ApplyTransform = applyTransform;
let mathMin = Math.min;
let mathMax = Math.max;
let lt = [];
let rb = [];
let lb = [];
let rt = [];

class BoundingRect{
    /**
     * @method constructor BoundingRect
     */
    constructor(x, y, width, height){
        if (width < 0) {
            x = x + width;
            width = -width;
        }
        if (height < 0) {
            y = y + height;
            height = -height;
        }
    
        /**
         * @property {Number}
         */
        this.x = x;
        /**
         * @property {Number}
         */
        this.y = y;
        /**
         * @property {Number}
         */
        this.width = width;
        /**
         * @property {Number}
         */
        this.height = height;
    }

    /**
     * @param {Object|BoundingRect} rect
     * @param {Number} rect.x
     * @param {Number} rect.y
     * @param {Number} rect.width
     * @param {Number} rect.height
     * @return {BoundingRect}
     */
    static create(rect) {
        return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
    }

    /**
     * @method union
     * @param {BoundingRect} other
     */
    union(other) {
        let x = mathMin(other.x, this.x);
        let y = mathMin(other.y, this.y);

        this.width = mathMax(
                other.x + other.width,
                this.x + this.width
            ) - x;
        this.height = mathMax(
                other.y + other.height,
                this.y + this.height
            ) - y;
        this.x = x;
        this.y = y;
    }

    /**
     * @method applyTransform
     * @param {Array<Number>}
     */
    applyTransform(m) {
        // In case usage like this
        // el.getBoundingRect().applyTransform(el.transform)
        // And element has no transform
        if (!m) {
            return;
        }
        lt[0] = lb[0] = this.x;
        lt[1] = rt[1] = this.y;
        rb[0] = rt[0] = this.x + this.width;
        rb[1] = lb[1] = this.y + this.height;

        v2ApplyTransform(lt, lt, m);
        v2ApplyTransform(rb, rb, m);
        v2ApplyTransform(lb, lb, m);
        v2ApplyTransform(rt, rt, m);

        this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
        this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
        let maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
        let maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
        this.width = maxX - this.x;
        this.height = maxY - this.y;
    }

    /**
     * @method calculateTransform
     * Calculate matrix of transforming from self to target rect
     * @param  {BoundingRect} b
     * @return {Array<Number>}
     */
    calculateTransform(b) {
        let a = this;
        let sx = b.width / a.width;
        let sy = b.height / a.height;

        let m = create$1();

        // 矩阵右乘
        translate(m, m, [-a.x, -a.y]);
        scale$1(m, m, [sx, sy]);
        translate(m, m, [b.x, b.y]);

        return m;
    }

    /**
     * @method intersect
     * @param {(BoundingRect|Object)} b
     * @return {boolean}
     */
    intersect(b) {
        if (!b) {
            return false;
        }

        if (!(b instanceof BoundingRect)) {
            // Normalize negative width/height.
            b = BoundingRect.create(b);
        }

        let a = this;
        let ax0 = a.x;
        let ax1 = a.x + a.width;
        let ay0 = a.y;
        let ay1 = a.y + a.height;

        let bx0 = b.x;
        let bx1 = b.x + b.width;
        let by0 = b.y;
        let by1 = b.y + b.height;

        return !(ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
    }

    /**
     * @method contain
     * @param {*} x 
     * @param {*} y 
     */
    contain(x, y) {
        let rect = this;
        return x >= rect.x
            && x <= (rect.x + rect.width)
            && y >= rect.y
            && y <= (rect.y + rect.height);
    }

    /**
     * @method clone
     * @return {BoundingRect}
     */
    clone() {
        return new BoundingRect(this.x, this.y, this.width, this.height);
    }

    /**
     * @method copy
     * Copy from another rect
     * @param other
     */
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    }

    /**
     * @method plain
     */
    plain() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

/**
 * @class zrender.graphic.Group
 * 
 * - Group is a container, it's not visible.
 * - Group can have child nodes, not the other Element types.
 * - The transformations applied to Group will apply to its children too.
 * 
 * - Group 是一个容器，本身不可见。
 * - Group 可以插入子节点，其它类型不能。
 * - Group 上的变换也会被应用到子节点上。
 * 
 *      @example small frame
 *      let Group = require('zrender/Group');
 *      let Circle = require('zrender/graphic/shape/Circle');
 *      let g = new Group();
 *      g.position[0] = 100;
 *      g.position[1] = 100;
 *      g.add(new Circle({
 *          style: {
 *              x: 100,
 *              y: 100,
 *              r: 20,
 *          }
 *      }));
 *      zr.add(g);
 */
class Group extends Element{
    /**
     * @method constructor Group
     */
    constructor(options={}){
        super(options);

        /**
         * @private
         * @property _children
         */
        this._children = [];

        /**
         * @private
         * @property __storage
         */
        this.__storage = null;

        /**
         * @private
         * @property __dirty
         */
        this.__dirty = true;

        /**
         * @property isGroup
         */
        this.isGroup=true;
    
        /**
         * @property {String}
         */
        this.type='group';
    
        /**
         * @property {Boolean} 所有子孙元素是否响应鼠标事件
         */
        this.silent=false;

        copyOwnProperties(this,options);
    }

    /**
     * @method children
     * @return {Array<Element>}
     */
    children() {
        return this._children.slice();
    }

    /**
     * @method childAt
     * 获取指定 index 的儿子节点
     * @param  {Number} idx
     * @return {Element}
     */
    childAt(idx) {
        return this._children[idx];
    }

    /**
     * @method childOfName
     * 获取指定名字的儿子节点
     * @param  {String} name
     * @return {Element}
     */
    childOfName(name) {
        let children = this._children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name === name) {
                return children[i];
            }
        }
    }

    /**
     * @method childCount
     * @return {Number}
     */
    childCount() {
        return this._children.length;
    }

    /**
     * @method add
     * 添加子节点到最后
     * @param {Element} child
     */
    add(child) {
        if (child && child !== this && child.parent !== this) {
            this._children.push(child);
            this._doAdd(child);
        }
        return this;
    }

    /**
     * @method addBefore
     * 添加子节点在 nextSibling 之前
     * @param {Element} child
     * @param {Element} nextSibling
     */
    addBefore(child, nextSibling) {
        if (child && child !== this && child.parent !== this
            && nextSibling && nextSibling.parent === this) {

            let children = this._children;
            let idx = children.indexOf(nextSibling);

            if (idx >= 0) {
                children.splice(idx, 0, child);
                this._doAdd(child);
            }
        }
        return this;
    }

    /**
     * @private
     * @method _doAdd
     * @param {*} child 
     */
    _doAdd(child) {
        if (child.parent) {
            child.parent.remove(child);
        }

        child.parent = this;//把子节点的 parent 属性指向自己，在事件冒泡的时候会使用 parent 属性。

        let storage = this.__storage;
        let zr = this.__zr;
        if (storage && storage !== child.__storage) {

            storage.addToStorage(child);

            if (child instanceof Group) {
                child.addChildrenToStorage(storage);
            }
        }
        zr && zr.refresh();
    }

    /**
     * @method remove
     * 移除子节点
     * @param {Element} child
     */
    remove(child) {
        let zr = this.__zr;
        let storage = this.__storage;
        let children = this._children;

        let idx = dataUtil.indexOf(children, child);
        if (idx < 0) {
            return this;
        }
        children.splice(idx, 1);
        child.parent = null;

        if (storage) {
            storage.delFromStorage(child);
            if (child instanceof Group) {
                child.delChildrenFromStorage(storage);
            }
        }

        zr && zr.refresh();
        return this;
    }

    /**
     * @method removeAll
     * 移除所有子节点
     */
    removeAll() {
        let children = this._children;
        let storage = this.__storage;
        let child;
        let i;
        for (i = 0; i < children.length; i++) {
            child = children[i];
            if (storage) {
                storage.delFromStorage(child);
                if (child instanceof Group) {
                    child.delChildrenFromStorage(storage);
                }
            }
            child.parent = null;
        }
        children.length = 0;

        return this;
    }

    /**
     * @method eachChild
     * 遍历所有子节点
     * @param  {Function} cb
     * @param  {Object}   context
     */
    eachChild(cb, context) {
        let children = this._children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            cb.call(context, child, i);
        }
        return this;
    }

    /**
     * @method traverse
     * 深度优先遍历所有子孙节点
     * @param  {Function} cb
     * @param  {Object}   context
     */
    traverse(cb, context) {
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            cb.call(context, child);

            if (child.type === 'group') {
                child.traverse(cb, context);
            }
        }
        return this;
    }

    /**
     * @method addChildrenToStorage
     * @param {Storage} storage 
     */
    addChildrenToStorage(storage) {
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            storage.addToStorage(child);
            if (child instanceof Group) {
                child.addChildrenToStorage(storage);
            }
        }
    }

    /**
     * @method delChildrenFromStorage
     * @param {Storage} storage 
     */
    delChildrenFromStorage(storage) {
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            storage.delFromStorage(child);
            if (child instanceof Group) {
                child.delChildrenFromStorage(storage);
            }
        }
    }

    /**
     * @method dirty
     * @return {Group}
     */
    dirty() {
        this.__dirty = true;
        this.__zr && this.__zr.refresh();
        return this;
    }

    /**
     * @method getBoundingRect
     * @return {BoundingRect}
     */
    getBoundingRect(includeChildren) {
        // TODO Caching
        let rect = null;
        let tmpRect = new BoundingRect(0, 0, 0, 0);
        let children = includeChildren || this._children;
        let tmpMat = [];

        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.ignore || child.invisible) {
                continue;
            }

            let childRect = child.getBoundingRect();
            let transform = child.getLocalTransform(tmpMat);
            // TODO
            // The boundingRect cacluated by transforming original
            // rect may be bigger than the actual bundingRect when rotation
            // is used. (Consider a circle rotated aginst its center, where
            // the actual boundingRect should be the same as that not be
            // rotated.) But we can not find better approach to calculate
            // actual boundingRect yet, considering performance.
            if (transform) {
                tmpRect.copy(childRect);
                tmpRect.applyTransform(transform);
                rect = rect || tmpRect.clone();
                rect.union(tmpRect);
            }else {
                rect = rect || childRect.clone();
                rect.union(childRect);
            }
        }
        return rect || tmpRect;
    }
}

// https://github.com/mziccard/node-timsort
var DEFAULT_MIN_MERGE = 32;

var DEFAULT_MIN_GALLOPING = 7;

function minRunLength(n) {
    var r = 0;

    while (n >= DEFAULT_MIN_MERGE) {
        r |= n & 1;
        n >>= 1;
    }

    return n + r;
}

function makeAscendingRun(array, lo, hi, compare) {
    var runHi = lo + 1;

    if (runHi === hi) {
        return 1;
    }

    if (compare(array[runHi++], array[lo]) < 0) {
        while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
            runHi++;
        }

        reverseRun(array, lo, runHi);
    }
    else {
        while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
            runHi++;
        }
    }

    return runHi - lo;
}

function reverseRun(array, lo, hi) {
    hi--;

    while (lo < hi) {
        var t = array[lo];
        array[lo++] = array[hi];
        array[hi--] = t;
    }
}

function binaryInsertionSort(array, lo, hi, start, compare) {
    if (start === lo) {
        start++;
    }

    for (; start < hi; start++) {
        var pivot = array[start];

        var left = lo;
        var right = start;
        var mid;

        while (left < right) {
            mid = left + right >>> 1;

            if (compare(pivot, array[mid]) < 0) {
                right = mid;
            }
            else {
                left = mid + 1;
            }
        }

        var n = start - left;

        switch (n) {
            case 3:
                array[left + 3] = array[left + 2];

            case 2:
                array[left + 2] = array[left + 1];

            case 1:
                array[left + 1] = array[left];
                break;
            default:
                while (n > 0) {
                    array[left + n] = array[left + n - 1];
                    n--;
                }
        }

        array[left] = pivot;
    }
}

function gallopLeft(value, array, start, length, hint, compare) {
    var lastOffset = 0;
    var maxOffset = 0;
    var offset = 1;

    if (compare(value, array[start + hint]) > 0) {
        maxOffset = length - hint;

        while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }

        if (offset > maxOffset) {
            offset = maxOffset;
        }

        lastOffset += hint;
        offset += hint;
    }
    else {
        maxOffset = hint + 1;
        while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }
        if (offset > maxOffset) {
            offset = maxOffset;
        }

        var tmp = lastOffset;
        lastOffset = hint - offset;
        offset = hint - tmp;
    }

    lastOffset++;
    while (lastOffset < offset) {
        var m = lastOffset + (offset - lastOffset >>> 1);

        if (compare(value, array[start + m]) > 0) {
            lastOffset = m + 1;
        }
        else {
            offset = m;
        }
    }
    return offset;
}

function gallopRight(value, array, start, length, hint, compare) {
    var lastOffset = 0;
    var maxOffset = 0;
    var offset = 1;

    if (compare(value, array[start + hint]) < 0) {
        maxOffset = hint + 1;

        while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }

        if (offset > maxOffset) {
            offset = maxOffset;
        }

        var tmp = lastOffset;
        lastOffset = hint - offset;
        offset = hint - tmp;
    }
    else {
        maxOffset = length - hint;

        while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }

        if (offset > maxOffset) {
            offset = maxOffset;
        }

        lastOffset += hint;
        offset += hint;
    }

    lastOffset++;

    while (lastOffset < offset) {
        var m = lastOffset + (offset - lastOffset >>> 1);

        if (compare(value, array[start + m]) < 0) {
            offset = m;
        }
        else {
            lastOffset = m + 1;
        }
    }

    return offset;
}

function TimSort(array, compare) {
    var minGallop = DEFAULT_MIN_GALLOPING;
    var runStart;
    var runLength;
    var stackSize = 0;

    var tmp = [];

    runStart = [];
    runLength = [];

    function pushRun(_runStart, _runLength) {
        runStart[stackSize] = _runStart;
        runLength[stackSize] = _runLength;
        stackSize += 1;
    }

    function mergeRuns() {
        while (stackSize > 1) {
            var n = stackSize - 2;

            if (
                (n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1])
                || (n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1])
            ) {
                if (runLength[n - 1] < runLength[n + 1]) {
                    n--;
                }
            }
            else if (runLength[n] > runLength[n + 1]) {
                break;
            }
            mergeAt(n);
        }
    }

    function forceMergeRuns() {
        while (stackSize > 1) {
            var n = stackSize - 2;

            if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
                n--;
            }

            mergeAt(n);
        }
    }

    function mergeAt(i) {
        var start1 = runStart[i];
        var length1 = runLength[i];
        var start2 = runStart[i + 1];
        var length2 = runLength[i + 1];

        runLength[i] = length1 + length2;

        if (i === stackSize - 3) {
            runStart[i + 1] = runStart[i + 2];
            runLength[i + 1] = runLength[i + 2];
        }

        stackSize--;

        var k = gallopRight(array[start2], array, start1, length1, 0, compare);
        start1 += k;
        length1 -= k;

        if (length1 === 0) {
            return;
        }

        length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);

        if (length2 === 0) {
            return;
        }

        if (length1 <= length2) {
            mergeLow(start1, length1, start2, length2);
        }
        else {
            mergeHigh(start1, length1, start2, length2);
        }
    }

    function mergeLow(start1, length1, start2, length2) {
        var i = 0;

        for (i = 0; i < length1; i++) {
            tmp[i] = array[start1 + i];
        }

        var cursor1 = 0;
        var cursor2 = start2;
        var dest = start1;

        array[dest++] = array[cursor2++];

        if (--length2 === 0) {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
            return;
        }

        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
            return;
        }

        var _minGallop = minGallop;
        var count1;
        var count2;
        var exit;

        while (1) {
            count1 = 0;
            count2 = 0;
            exit = false;

            do {
                if (compare(array[cursor2], tmp[cursor1]) < 0) {
                    array[dest++] = array[cursor2++];
                    count2++;
                    count1 = 0;

                    if (--length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest++] = tmp[cursor1++];
                    count1++;
                    count2 = 0;
                    if (--length1 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < _minGallop);

            if (exit) {
                break;
            }

            do {
                count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);

                if (count1 !== 0) {
                    for (i = 0; i < count1; i++) {
                        array[dest + i] = tmp[cursor1 + i];
                    }

                    dest += count1;
                    cursor1 += count1;
                    length1 -= count1;
                    if (length1 <= 1) {
                        exit = true;
                        break;
                    }
                }

                array[dest++] = array[cursor2++];

                if (--length2 === 0) {
                    exit = true;
                    break;
                }

                count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);

                if (count2 !== 0) {
                    for (i = 0; i < count2; i++) {
                        array[dest + i] = array[cursor2 + i];
                    }

                    dest += count2;
                    cursor2 += count2;
                    length2 -= count2;

                    if (length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                array[dest++] = tmp[cursor1++];

                if (--length1 === 1) {
                    exit = true;
                    break;
                }

                _minGallop--;
            } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

            if (exit) {
                break;
            }

            if (_minGallop < 0) {
                _minGallop = 0;
            }

            _minGallop += 2;
        }

        minGallop = _minGallop;

        minGallop < 1 && (minGallop = 1);

        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
        }
        else if (length1 === 0) {
            throw new Error();
            // throw new Error('mergeLow preconditions were not respected');
        }
        else {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
        }
    }

    function mergeHigh(start1, length1, start2, length2) {
        var i = 0;

        for (i = 0; i < length2; i++) {
            tmp[i] = array[start2 + i];
        }

        var cursor1 = start1 + length1 - 1;
        var cursor2 = length2 - 1;
        var dest = start2 + length2 - 1;
        var customCursor = 0;
        var customDest = 0;

        array[dest--] = array[cursor1--];

        if (--length1 === 0) {
            customCursor = dest - (length2 - 1);

            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }

            return;
        }

        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;

            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }

            array[dest] = tmp[cursor2];
            return;
        }

        var _minGallop = minGallop;

        while (true) {
            var count1 = 0;
            var count2 = 0;
            var exit = false;

            do {
                if (compare(tmp[cursor2], array[cursor1]) < 0) {
                    array[dest--] = array[cursor1--];
                    count1++;
                    count2 = 0;
                    if (--length1 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest--] = tmp[cursor2--];
                    count2++;
                    count1 = 0;
                    if (--length2 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < _minGallop);

            if (exit) {
                break;
            }

            do {
                count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);

                if (count1 !== 0) {
                    dest -= count1;
                    cursor1 -= count1;
                    length1 -= count1;
                    customDest = dest + 1;
                    customCursor = cursor1 + 1;

                    for (i = count1 - 1; i >= 0; i--) {
                        array[customDest + i] = array[customCursor + i];
                    }

                    if (length1 === 0) {
                        exit = true;
                        break;
                    }
                }

                array[dest--] = tmp[cursor2--];

                if (--length2 === 1) {
                    exit = true;
                    break;
                }

                count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);

                if (count2 !== 0) {
                    dest -= count2;
                    cursor2 -= count2;
                    length2 -= count2;
                    customDest = dest + 1;
                    customCursor = cursor2 + 1;

                    for (i = 0; i < count2; i++) {
                        array[customDest + i] = tmp[customCursor + i];
                    }

                    if (length2 <= 1) {
                        exit = true;
                        break;
                    }
                }

                array[dest--] = array[cursor1--];

                if (--length1 === 0) {
                    exit = true;
                    break;
                }

                _minGallop--;
            } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

            if (exit) {
                break;
            }

            if (_minGallop < 0) {
                _minGallop = 0;
            }

            _minGallop += 2;
        }

        minGallop = _minGallop;

        if (minGallop < 1) {
            minGallop = 1;
        }

        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;

            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }

            array[dest] = tmp[cursor2];
        }
        else if (length2 === 0) {
            throw new Error();
            // throw new Error('mergeHigh preconditions were not respected');
        }
        else {
            customCursor = dest - (length2 - 1);
            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }
        }
    }

    this.mergeRuns = mergeRuns;
    this.forceMergeRuns = forceMergeRuns;
    this.pushRun = pushRun;
}

function sort(array, compare, lo, hi) {
    if (!lo) {
        lo = 0;
    }
    if (!hi) {
        hi = array.length;
    }

    var remaining = hi - lo;

    if (remaining < 2) {
        return;
    }

    var runLength = 0;

    if (remaining < DEFAULT_MIN_MERGE) {
        runLength = makeAscendingRun(array, lo, hi, compare);
        binaryInsertionSort(array, lo, hi, lo + runLength, compare);
        return;
    }

    var ts = new TimSort(array, compare);

    var minRun = minRunLength(remaining);

    do {
        runLength = makeAscendingRun(array, lo, hi, compare);
        if (runLength < minRun) {
            var force = remaining;
            if (force > minRun) {
                force = minRun;
            }

            binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
            runLength = force;
        }

        ts.pushRun(lo, runLength);
        ts.mergeRuns();

        remaining -= runLength;
        lo += runLength;
    } while (remaining !== 0);

    ts.forceMergeRuns();
}

// Use timsort because in most case elements are partially sorted
// https://jsfiddle.net/pissang/jr4x7mdm/8/
/**
 * @class zrender.core.Storage
 * 内容仓库 (M)，用来存储和管理画布上的所有对象，同时提供绘制和更新队列的功能。
 * 需要绘制的对象首先存储在 Storage 中，然后 Painter 类会从 Storage 中依次取出进行绘图。
 * 利用 Storage 作为内存中转站，对于不需要刷新的对象可以不进行绘制，从而可以提升整体性能。
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

/**
 * @method constructor Storage
 */
let Storage = function () { // jshint ignore:line
    /**
     * @private
     * @property _roots
     */
    this._roots = [];//直接放在画布上的对象为根对象

    /**
     * @private
     * @property _displayList
     */
    this._displayList = [];

    /**
     * @private
     * @property _displayListLen
     */
    this._displayListLen = 0;
};

Storage.prototype = {

    constructor: Storage,

    /**
     * @method traverse
     * @param  {Function} cb
     * @param  {Object} context
     */
    traverse: function (cb, context) {
        for (let i = 0; i < this._roots.length; i++) {
            this._roots[i].traverse(cb, context);
        }
    },

    /**
     * @method getDisplayList
     * 返回所有图形的绘制队列
     * @param {boolean} [update=false] 是否在返回前更新该数组
     * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 update 为 true 的时候有效
     *
     * 详见{@link Displayable.prototype.updateDisplayList}
     * @return {Array<Displayable>}
     */
    getDisplayList: function (update, includeIgnore) {
        includeIgnore = includeIgnore || false;
        if (update) {
            this.updateDisplayList(includeIgnore);
        }
        return this._displayList;
    },

    /**
     * @method updateDisplayList
     * 更新图形的绘制队列。
     * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
     * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
     * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组
     */
    updateDisplayList: function (includeIgnore) {
        this._displayListLen = 0;

        let roots = this._roots;
        let displayList = this._displayList;
        for (let i = 0, len = roots.length; i < len; i++) {
            this._updateAndAddDisplayable(roots[i], null, includeIgnore);
        }

        displayList.length = this._displayListLen;

        env$1.canvasSupported && sort(displayList, this.displayableSortFunc);
    },

    /**
     * @method _updateAndAddDisplayable
     * @param {*} el 
     * @param {*} clipPaths 
     * @param {*} includeIgnore 
     */
    _updateAndAddDisplayable: function (el, clipPaths, includeIgnore) {
        if (el.ignore && !includeIgnore) {
            return;
        }
        el.beforeUpdate();

        if (el.__dirty) {
            el.update();
        }

        el.afterUpdate();
        let userSetClipPath = el.clipPath;
        if (userSetClipPath) {
            // FIXME 效率影响
            if (clipPaths) {
                clipPaths = clipPaths.slice();
            }else {
                clipPaths = [];
            }
            let currentClipPath = userSetClipPath;
            let parentClipPath = el;
            // Recursively add clip path
            while (currentClipPath) {
                // clipPath 的变换是基于使用这个 clipPath 的元素
                currentClipPath.parent = parentClipPath;
                currentClipPath.updateTransform();
                clipPaths.push(currentClipPath);
                parentClipPath = currentClipPath;
                currentClipPath = currentClipPath.clipPath;
            }
        }

        if (el.isGroup) {
            let children = el._children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                // Force to mark as dirty if group is dirty
                // FIXME __dirtyPath ?
                if (el.__dirty) {
                    child.__dirty = true;
                }
                this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
            }
            // Mark group clean here
            el.__dirty = false;
        }else {
            el.__clipPaths = clipPaths;

            this._displayList[this._displayListLen++] = el;
        }
    },

    /**
     * @method addRoot
     * 添加图形(Shape)或者组(Group)到根节点
     * @param {Element} el
     */
    addRoot: function (el) {
        if (el.__storage === this) {
            return;
        }

        if (el instanceof Group) {
            el.addChildrenToStorage(this);
        }

        this.addToStorage(el);
        this._roots.push(el);
    },

    /**
     * @method
     * 删除指定的图形(Shape)或者组(Group)
     * @param {string|Array.<String>} [el] 如果为空清空整个Storage
     */
    delRoot: function (el) {
        if (el == null) {
            // 不指定el清空
            for (let i = 0; i < this._roots.length; i++) {
                let root = this._roots[i];
                if (root instanceof Group) {
                    root.delChildrenFromStorage(this);
                }
            }

            this._roots = [];
            this._displayList = [];
            this._displayListLen = 0;

            return;
        }

        if (el instanceof Array) {
            for (let i = 0, l = el.length; i < l; i++) {
                this.delRoot(el[i]);
            }
            return;
        }


        let idx = indexOf(this._roots, el);
        if (idx >= 0) {
            this.delFromStorage(el);
            this._roots.splice(idx, 1);
            if (el instanceof Group) {
                el.delChildrenFromStorage(this);
            }
        }
    },

    /**
     * @method addToStorage
     * @param {Element} el 
     */
    addToStorage: function (el) {
        if (el) {
            el.__storage = this;
            el.dirty(false);
        }
        return this;
    },

    /**
     * @method delFromStorage
     * @param {Element} el 
     */
    delFromStorage: function (el) {
        if (el) {
            el.__storage = null;
        }

        return this;
    },

    /**
     * @method dispose
     * 清空并且释放Storage
     */
    dispose: function () {
        this._renderList =
        this._roots = null;
    },

    displayableSortFunc: function(a, b) {
        if (a.zlevel === b.zlevel) {
            if (a.z === b.z) {
                // if (a.z2 === b.z2) {
                //     // FIXME Slow has renderidx compare
                //     // http://stackoverflow.com/questions/20883421/sorting-in-javascript-should-every-compare-function-have-a-return-0-statement
                //     // https://github.com/v8/v8/blob/47cce544a31ed5577ffe2963f67acb4144ee0232/src/js/array.js#L1012
                //     return a.__renderidx - b.__renderidx;
                // }
                return a.z2 - b.z2;
            }
            return a.z - b.z;
        }
        return a.zlevel - b.zlevel;
    }
};

/**
 * 兼容多种运行环境的 requestAnimationFrame 方法。
 * 有两个重要的地方会依赖此方法：
 * - 元素的渲染机制，在 Painter 类中会调用
 * - 元素的动画效果，在 Animation 类中会调用
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
var requestAnimationFrame = (
    typeof window !== 'undefined'
    && (
        (window.requestAnimationFrame && window.requestAnimationFrame.bind(window))
        // https://github.com/ecomfe/zrender/issues/189#issuecomment-224919809
        || (window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window))
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
    )
) || function (func) {
    setTimeout(func, 16);// 1000ms/60，每秒60帧，每帧约16ms
};

var dpr = 1;

// If in browser environment
if (typeof window !== 'undefined') {
    dpr = Math.max(window.devicePixelRatio || 1, 1);
}

/**
 * config默认配置项
 * @exports zrender/config
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 */

/**
 * Debug log mode:
 * 0: Do nothing, for release.
 * 1: console.error, for debug.
 */


// retina 屏幕优化
var devicePixelRatio = dpr;

var SHADOW_PROPS = {
    'shadowBlur': 1,
    'shadowOffsetX': 1,
    'shadowOffsetY': 1,
    'textShadowBlur': 1,
    'textShadowOffsetX': 1,
    'textShadowOffsetY': 1,
    'textBoxShadowBlur': 1,
    'textBoxShadowOffsetX': 1,
    'textBoxShadowOffsetY': 1
};

var fixShadow = function (ctx, propName, value) {
    if (SHADOW_PROPS.hasOwnProperty(propName)) {
        return value *= ctx.dpr;
    }
    return value;
};

let ContextCachedBy = {
    NONE: 0,
    STYLE_BIND: 1,
    PLAIN_TEXT: 2
};
// Avoid confused with 0/false.
let WILL_BE_RESTORED = 9;
let PI2 = Math.PI * 2;
let mathSin=Math.sin;
let mathCos=Math.cos;

let mathMax$1=Math.max;

/**
 * @class zrender.graphic.Style
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

let STYLE_COMMON_PROPS = [
    ['shadowBlur', 0], ['shadowOffsetX', 0], ['shadowOffsetY', 0], ['shadowColor', '#000'],
    ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]
];

function createLinearGradient(ctx, obj, rect) {
    let x = obj.x == null ? 0 : obj.x;
    let x2 = obj.x2 == null ? 1 : obj.x2;
    let y = obj.y == null ? 0 : obj.y;
    let y2 = obj.y2 == null ? 0 : obj.y2;

    if (!obj.global) {
        x = x * rect.width + rect.x;
        x2 = x2 * rect.width + rect.x;
        y = y * rect.height + rect.y;
        y2 = y2 * rect.height + rect.y;
    }

    // Fix NaN when rect is Infinity
    x = isNaN(x) ? 0 : x;
    x2 = isNaN(x2) ? 1 : x2;
    y = isNaN(y) ? 0 : y;
    y2 = isNaN(y2) ? 0 : y2;

    let canvasGradient = ctx.createLinearGradient(x, y, x2, y2);

    return canvasGradient;
}

function createRadialGradient(ctx, obj, rect) {
    let width = rect.width;
    let height = rect.height;
    let min = Math.min(width, height);

    let x = obj.x == null ? 0.5 : obj.x;
    let y = obj.y == null ? 0.5 : obj.y;
    let r = obj.r == null ? 0.5 : obj.r;
    if (!obj.global) {
        x = x * width + rect.x;
        y = y * height + rect.y;
        r = r * min;
    }

    let canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);

    return canvasGradient;
}

let Style = function (opts) {
    this.extendStyle(opts, false);
};

Style.prototype = {
    constructor: Style,

    /**
     * @property {String} fill
     */
    fill: '#000',

    /**
     * @property {String} stroke
     */
    stroke: null,

    /**
     * @property {Number} opacity
     */
    opacity: 1,

    /**
     * @property {Number} fillOpacity
     */
    fillOpacity: null,

    /**
     * @property {Number} strokeOpacity
     */
    strokeOpacity: null,

    /**
     * @property {Array<Number>|Boolean} lineDash
     * `true` is not supported.
     * `false`/`null`/`undefined` are the same.
     * `false` is used to remove lineDash in some
     * case that `null`/`undefined` can not be set.
     * (e.g., emphasis.lineStyle in echarts)
     */
    lineDash: null,

    /**
     * @property {Number} lineDashOffset
     */
    lineDashOffset: 0,

    /**
     * @property {Number} shadowBlur
     */
    shadowBlur: 0,

    /**
     * @property {Number} shadowOffsetX
     */
    shadowOffsetX: 0,

    /**
     * @property {Number} shadowOffsetY
     */
    shadowOffsetY: 0,

    /**
     * @property {Number} lineWidth
     */
    lineWidth: 1,

    /**
     * @property {Boolean} strokeNoScale
     * If stroke ignore scale
     */
    strokeNoScale: false,

    // Bounding rect text configuration
    // Not affected by element transform
    /**
     * @property {String} text
     */
    text: null,

    /**
     * @property {String} font
     * If `fontSize` or `fontFamily` exists, `font` will be reset by
     * `fontSize`, `fontStyle`, `fontWeight`, `fontFamily`.
     * So do not visit it directly in upper application (like echarts),
     * but use `contain/text#makeFont` instead.
     */
    font: null,

    /**
     * @deprecated
     * @property {String} textFont
     * The same as font. Use font please.
     */
    textFont: null,

    /**
     * @property {String} fontStyle
     * It helps merging respectively, rather than parsing an entire font string.
     */
    fontStyle: null,

    /**
     * @property {String} fontWeight
     * It helps merging respectively, rather than parsing an entire font string.
     */
    fontWeight: null,

    /**
     * @property {Number} fontSize
     * It helps merging respectively, rather than parsing an entire font string.
     * Should be 12 but not '12px'.
     */
    fontSize: null,

    /**
     * @property {String} fontFamily
     * It helps merging respectively, rather than parsing an entire font string.
     */
    fontFamily: null,

    /**
     * @property {String} textTag
     * Reserved for special functinality, like 'hr'.
     */
    textTag: null,

    /**
     * @property {String} textFill
     */
    textFill: '#000',

    /**
     * @property {String} textStroke
     */
    textStroke: null,

    /**
     * @property {Number} textWidth
     */
    textWidth: null,

    /**
     * @property {Number} textHeight
     * Only for textBackground.
     */
    textHeight: null,

    /**
     * @property {Number} textStrokeWidth
     * textStroke may be set as some color as a default
     * value in upper applicaion, where the default value
     * of textStrokeWidth should be 0 to make sure that
     * user can choose to do not use text stroke.
     */
    textStrokeWidth: 0,

    /**
     * @property {Number} textLineHeight
     */
    textLineHeight: null,

    /**
     * @property {string|Array<Number>} textPosition
     * 'inside', 'left', 'right', 'top', 'bottom'
     * [x, y]
     * Based on x, y of rect.
     */
    textPosition: 'inside',

    /**
     * @property {Object} textRect
     * If not specified, use the boundingRect of a `displayable`.
     */
    textRect: null,

    /**
     * @property {Array<Number>} textOffset
     * [x, y]
     */
    textOffset: null,

    /**
     * @property {String} textAlign
     */
    textAlign: null,

    /**
     * @property {String} textVerticalAlign
     */
    textVerticalAlign: null,

    /**
     * @property {Number} textDistance
     */
    textDistance: 5,

    /**
     * @property {String} textShadowColor
     */
    textShadowColor: 'transparent',

    /**
     * @property {Number} textShadowBlur
     */
    textShadowBlur: 0,

    /**
     * @property {Number} textShadowOffsetX
     */
    textShadowOffsetX: 0,

    /**
     * @property {Number} textShadowOffsetY
     */
    textShadowOffsetY: 0,

    /**
     * @property {String} textBoxShadowColor
     */
    textBoxShadowColor: 'transparent',

    /**
     * @property {Number} textBoxShadowBlur
     */
    textBoxShadowBlur: 0,

    /**
     * @property {Number} textBoxShadowOffsetX
     */
    textBoxShadowOffsetX: 0,

    /**
     * @property {Number} textBoxShadowOffsetY
     */
    textBoxShadowOffsetY: 0,

    /**
     * @property {Boolean} transformText
     * Whether transform text.
     * Only available in Path and Image element,
     * where the text is called as `RectText`.
     */
    transformText: false,

    /**
     * @property {Number} textRotation
     * Text rotate around position of Path or Image.
     * The origin of the rotation can be specified by `textOrigin`.
     * Only available in Path and Image element,
     * where the text is called as `RectText`.
     */
    textRotation: 0,

    /**
     * @property {String|Array<Number>} textOrigin
     * Text origin of text rotation.
     * Useful in the case like label rotation of circular symbol.
     * Only available in Path and Image element, where the text is called
     * as `RectText` and the element is called as "host element".
     * The value can be:
     * + If specified as a coordinate like `[10, 40]`, it is the `[x, y]`
     * base on the left-top corner of the rect of its host element.
     * + If specified as a string `center`, it is the center of the rect of
     * its host element.
     * + By default, this origin is the `textPosition`.
     */
    textOrigin: null,

    /**
     * @property {String} textBackgroundColor
     */
    textBackgroundColor: null,

    /**
     * @property {String} textBorderColor
     */
    textBorderColor: null,

    /**
     * @property {Number} textBorderWidth
     */
    textBorderWidth: 0,

    /**
     * @property {Number} textBorderRadius
     */
    textBorderRadius: 0,

    /**
     * @property {number|Array<Number>} textPadding
     * Can be `2` or `[2, 4]` or `[2, 3, 4, 5]`
     */
    textPadding: null,

    /**
     * @property {Object} rich
     * Text styles for rich text.
     */
    rich: null,

    /**
     * @property {Object} truncate
     * {outerWidth, outerHeight, ellipsis, placeholder}
     */
    truncate: null,

    /**
     * @property {String} blend
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
     */
    blend: null,

    /**
     * @method bind
     * @param {CanvasRenderingContext2D} ctx
     * @param {Element} el
     * @param {Element} prevEl
     */
    bind: function (ctx, el, prevEl) {
        let style = this;
        let prevStyle = prevEl && prevEl.style;
        // If no prevStyle, it means first draw.
        // Only apply cache if the last time cachced by this function.
        let notCheckCache = !prevStyle || ctx.__attrCachedBy !== ContextCachedBy.STYLE_BIND;

        ctx.__attrCachedBy = ContextCachedBy.STYLE_BIND;

        for (let i = 0; i < STYLE_COMMON_PROPS.length; i++) {
            let prop = STYLE_COMMON_PROPS[i];
            let styleName = prop[0];

            if (notCheckCache || style[styleName] !== prevStyle[styleName]) {
                // FIXME Invalid property value will cause style leak from previous element.
                ctx[styleName] =
                    fixShadow(ctx, styleName, style[styleName] || prop[1]);
            }
        }

        if ((notCheckCache || style.fill !== prevStyle.fill)) {
            ctx.fillStyle = style.fill;
        }
        if ((notCheckCache || style.stroke !== prevStyle.stroke)) {
            ctx.strokeStyle = style.stroke;
        }
        if ((notCheckCache || style.opacity !== prevStyle.opacity)) {
            ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
        }

        if ((notCheckCache || style.blend !== prevStyle.blend)) {
            ctx.globalCompositeOperation = style.blend || 'source-over';
        }
        if (this.hasStroke()) {
            let lineWidth = style.lineWidth;
            ctx.lineWidth = lineWidth / (
                (this.strokeNoScale && el && el.getLineScale) ? el.getLineScale() : 1
            );
        }
    },

    /**
     * @method hasFill
     */
    hasFill: function () {
        let fill = this.fill;
        return fill != null && fill !== 'none';
    },

    /**
     * @method hasStroke
     */
    hasStroke: function () {
        let stroke = this.stroke;
        return stroke != null && stroke !== 'none' && this.lineWidth > 0;
    },

    /**
     * @method extendStyle
     * Extend from other style
     * @param {Style} otherStyle
     * @param {Boolean} overwrite true: overwrirte any way.
     *                            false: overwrite only when !target.hasOwnProperty
     *                            others: overwrite when property is not null/undefined.
     */
    extendStyle: function (otherStyle, overwrite) {
        if (otherStyle) {
            for (let name in otherStyle) {
                if (otherStyle.hasOwnProperty(name)
                    && (overwrite === true
                        || (
                            overwrite === false
                                ? !this.hasOwnProperty(name)
                                : otherStyle[name] != null
                        )
                    )
                ) {
                    this[name] = otherStyle[name];
                }
            }
        }
    },

    /**
     * @method set
     * Batch setting style with a given object
     * @param {Object|String} obj
     * @param {*} [obj]
     */
    set: function (obj, value) {
        if (typeof obj === 'string') {
            this[obj] = value;
        }
        else {
            this.extendStyle(obj, true);
        }
    },

    /**
     * @method clone
     * @return {Style}
     */
    clone: function () {
        let newStyle = new this.constructor();
        newStyle.extendStyle(this, true);
        return newStyle;
    },

    /**
     * @method getGradient
     * @param {*} ctx 
     * @param {*} obj 
     * @param {*} rect 
     */
    getGradient: function (ctx, obj, rect) {
        let method = obj.type === 'radial' ? createRadialGradient : createLinearGradient;
        let canvasGradient = method(ctx, obj, rect);
        let colorStops = obj.colorStops;
        for (let i = 0; i < colorStops.length; i++) {
            canvasGradient.addColorStop(
                colorStops[i].offset, colorStops[i].color
            );
        }
        return canvasGradient;
    }

};

let styleProto = Style.prototype;
for (let i = 0; i < STYLE_COMMON_PROPS.length; i++) {
    let prop = STYLE_COMMON_PROPS[i];
    if (!(prop[0] in styleProto)) {
        styleProto[prop[0]] = prop[1];
    }
}

// Provide for others
Style.getGradient = styleProto.getGradient;

/**
 * @class zrender.graphic.Pattern
 * 
 * Pattern
 * 
 * 图案
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class Pattern{
    /**
     * @method  constructor Pattern
     * @param {*} image 
     * @param {*} repeat 
     */
    constructor(image, repeat){
        // Should do nothing more in this constructor. Because gradient can be
        // declard by `color: {image: ...}`, where this constructor will not be called.
        this.image = image;
        this.repeat = repeat;
        // Can be cloned
        this.type = 'pattern';
    }

    getCanvasPattern(ctx) {
        return ctx.createPattern(this.image, this.repeat || 'repeat');
    }
}

/**
 * @class zrender.canvas.Layer
 * 用来创建 canvas 层，在 Painter 类中会引用此类。
 * @author pissang(https://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @private
 * @method
 * 创建dom
 * @param {String} id dom id 待用
 * @param {Painter} painter painter instance
 * @param {Number} number
 */
function createDom(id, painter, dpr) {
    let newDom = createCanvas();
    let width = painter.getWidth();
    let height = painter.getHeight();
    let newDomStyle = newDom.style;

    if (newDomStyle) {  // In node or some other non-browser environment
        newDomStyle.position = 'absolute';
        newDomStyle.left = 0;
        newDomStyle.top = 0;
        newDomStyle.width = width + 'px';
        newDomStyle.height = height + 'px';
        newDom.setAttribute('data-zr-dom-id', id);
    }

    newDom.width = width * dpr;
    newDom.height = height * dpr;
    return newDom;
}

/**
 * @method constructor Layer
 * @param {String} id
 * @param {Painter} painter
 * @param {Number} [dpr]
 */
let Layer = function (id, painter, dpr) {
    let dom;
    dpr = dpr || devicePixelRatio;
    if (typeof id === 'string') {
        dom = createDom(id, painter, dpr);
    }
    // Not using isDom because in node it will return false
    else if (isObject(id)) {
        dom = id;
        id = dom.id;
    }
    this.id = id;
    this.dom = dom;

    let domStyle = dom.style;
    if (domStyle) { // Not in node
        dom.onselectstart = ()=>{return false;}; // 避免页面选中的尴尬
        domStyle['-webkit-user-select'] = 'none';
        domStyle['user-select'] = 'none';
        domStyle['-webkit-touch-callout'] = 'none';
        domStyle['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
        domStyle['padding'] = 0; // eslint-disable-line dot-notation
        domStyle['margin'] = 0; // eslint-disable-line dot-notation
        domStyle['border-width'] = 0;
    }

    this.domBack = null;
    this.ctxBack = null;
    this.painter = painter;
    this.config = null;

    /**
     * @property {String} 每次清空画布的颜色
     */
    this.clearColor = 0;
    /**
     * @property {boolean} 是否开启动态模糊
     */
    this.motionBlur = false;
    /**
     * @property {Number} 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */
    this.lastFrameAlpha = 0.7;
    /**
     * @property {Number} Layer dpr
     */
    this.dpr = dpr;
};

Layer.prototype = {
    constructor: Layer,
    __dirty: true,
    __used: false,
    __drawIndex: 0,
    __startIndex: 0,
    __endIndex: 0,
    incremental: false,

    /**
     * @method getElementCount
     */
    getElementCount: function () {
        return this.__endIndex - this.__startIndex;
    },

    /**
     * @method initContext
     */
    initContext: function () {
        this.ctx = this.dom.getContext('2d');
        this.ctx.dpr = this.dpr;
    },

    /**
     * @method createBackBuffer
     */
    createBackBuffer: function () {
        let dpr = this.dpr;

        this.domBack = createDom('back-' + this.id, this.painter, dpr);
        this.ctxBack = this.domBack.getContext('2d');

        if (dpr !== 1) {
            this.ctxBack.scale(dpr, dpr);
        }
    },

    /**
     * @method resize
     * @param  {Number} width
     * @param  {Number} height
     */
    resize: function (width, height) {
        let dpr = this.dpr;
        let dom = this.dom;
        let domStyle = dom.style;
        let domBack = this.domBack;

        if (domStyle) {
            domStyle.width = width + 'px';
            domStyle.height = height + 'px';
        }

        dom.width = width * dpr;
        dom.height = height * dpr;

        if (domBack) {
            domBack.width = width * dpr;
            domBack.height = height * dpr;

            if (dpr !== 1) {
                this.ctxBack.scale(dpr, dpr);
            }
        }
    },

    /**
     * @method clear
     * 清空该层画布
     * @param {boolean} [clearAll=false] Clear all with out motion blur
     * @param {Color} [clearColor]
     */
    clear: function (clearAll, clearColor) {
        clearColor = clearColor || this.clearColor;
        let dom = this.dom;
        let ctx = this.ctx;
        let width = dom.width;
        let height = dom.height;
        let haveMotionBLur = this.motionBlur && !clearAll;
        let lastFrameAlpha = this.lastFrameAlpha;
        let dpr = this.dpr;

        if (haveMotionBLur) {
            if (!this.domBack) {
                this.createBackBuffer();
            }

            this.ctxBack.globalCompositeOperation = 'copy';
            this.ctxBack.drawImage(
                dom, 0, 0,
                width / dpr,
                height / dpr
            );
        }

        ctx.clearRect(0, 0, width, height);
        if (clearColor && clearColor !== 'transparent') {
            let clearColorGradientOrPattern;
            // Gradient
            if (clearColor.colorStops) {
                // Cache canvas gradient
                clearColorGradientOrPattern = clearColor.__canvasGradient || Style.getGradient(ctx, clearColor, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                });

                clearColor.__canvasGradient = clearColorGradientOrPattern;
            }
            // Pattern
            else if (clearColor.image) {
                clearColorGradientOrPattern = Pattern.prototype.getCanvasPattern.call(clearColor, ctx);
            }
            ctx.save();
            ctx.fillStyle = clearColorGradientOrPattern || clearColor;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        if (haveMotionBLur) {
            let domBack = this.domBack;
            ctx.save();
            ctx.globalAlpha = lastFrameAlpha;
            ctx.drawImage(domBack, 0, 0, width, height);
            ctx.restore();
        }
    }
};

var globalImageCache = new LRU(50);

/**
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */
function findExistImage(newImageOrSrc) {
    if (typeof newImageOrSrc === 'string') {
        var cachedImgObj = globalImageCache.get(newImageOrSrc);
        return cachedImgObj && cachedImgObj.image;
    }
    else {
        return newImageOrSrc;
    }
}

/**
 * Caution: User should cache loaded images, but not just count on LRU.
 * Consider if required images more than LRU size, will dead loop occur?
 *
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @param {HTMLImageElement|HTMLCanvasElement|Canvas} image Existent image.
 * @param {module:zrender/Element} [hostEl] For calling `dirty`.
 * @param {Function} [cb] params: (image, cbPayload)
 * @param {Object} [cbPayload] Payload on cb calling.
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */
function createOrUpdateImage(newImageOrSrc, image, hostEl, cb, cbPayload) {
    if (!newImageOrSrc) {
        return image;
    }
    else if (typeof newImageOrSrc === 'string') {

        // Image should not be loaded repeatly.
        if ((image && image.__zrImageSrc === newImageOrSrc) || !hostEl) {
            return image;
        }

        // Only when there is no existent image or existent image src
        // is different, this method is responsible for load.
        var cachedImgObj = globalImageCache.get(newImageOrSrc);

        var pendingWrap = {hostEl: hostEl, cb: cb, cbPayload: cbPayload};

        if (cachedImgObj) {
            image = cachedImgObj.image;
            !isImageReady(image) && cachedImgObj.pending.push(pendingWrap);
        }
        else {
            image = new Image();
            image.onload = image.onerror = imageOnLoad;

            globalImageCache.put(
                newImageOrSrc,
                image.__cachedImgObj = {
                    image: image,
                    pending: [pendingWrap]
                }
            );

            image.src = image.__zrImageSrc = newImageOrSrc;
        }

        return image;
    }
    // newImageOrSrc is an HTMLImageElement or HTMLCanvasElement or Canvas
    else {
        return newImageOrSrc;
    }
}

function imageOnLoad() {
    var cachedImgObj = this.__cachedImgObj;
    this.onload = this.onerror = this.__cachedImgObj = null;

    for (var i = 0; i < cachedImgObj.pending.length; i++) {
        var pendingWrap = cachedImgObj.pending[i];
        var cb = pendingWrap.cb;
        cb && cb(this, pendingWrap.cbPayload);
        pendingWrap.hostEl.dirty();
    }
    cachedImgObj.pending.length = 0;
}

function isImageReady(image) {
    return image && image.width && image.height;
}

let textWidthCache = {};
let textWidthCacheCounter = 0;
let TEXT_CACHE_MAX = 5000;
let STYLE_REG = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;

let DEFAULT_FONT$1 = '12px sans-serif';

// Avoid assign to an exported variable, for transforming to cjs.
let methods$1 = {};

function $override$1(name, fn) {
    methods$1[name] = fn;
}

/**
 * @public
 * @param {String} text
 * @param {String} font
 * @return {Number} width
 */
function getWidth(text, font) {
    font = font || DEFAULT_FONT$1;
    let key = text + ':' + font;
    if (textWidthCache[key]) {
        return textWidthCache[key];
    }

    let textLines = (text + '').split('\n');
    let width = 0;

    for (let i = 0, l = textLines.length; i < l; i++) {
        // textContain.measureText may be overrided in SVG or VML
        width = Math.max(measureText(textLines[i], font).width, width);
    }

    if (textWidthCacheCounter > TEXT_CACHE_MAX) {
        textWidthCacheCounter = 0;
        textWidthCache = {};
    }
    textWidthCacheCounter++;
    textWidthCache[key] = width;

    return width;
}

/**
 * @public
 * @param {String} text
 * @param {String} font
 * @param {String} [textAlign='left']
 * @param {String} [textVerticalAlign='top']
 * @param {Array<Number>} [textPadding]
 * @param {Object} [rich]
 * @param {Object} [truncate]
 * @return {Object} {x, y, width, height, lineHeight}
 */
function getBoundingRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, rich, truncate) {
    return rich
        ? getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, rich, truncate)
        : getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, truncate);
}

function getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, truncate) {
    let contentBlock = parsePlainText(text, font, textPadding, textLineHeight, truncate);
    let outerWidth = getWidth(text, font);
    if (textPadding) {
        outerWidth += textPadding[1] + textPadding[3];
    }
    let outerHeight = contentBlock.outerHeight;

    let x = adjustTextX(0, outerWidth, textAlign);
    let y = adjustTextY(0, outerHeight, textVerticalAlign);

    let rect = new BoundingRect(x, y, outerWidth, outerHeight);
    rect.lineHeight = contentBlock.lineHeight;

    return rect;
}

function getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, rich, truncate) {
    let contentBlock = parseRichText(text, {
        rich: rich,
        truncate: truncate,
        font: font,
        textAlign: textAlign,
        textPadding: textPadding,
        textLineHeight: textLineHeight
    });
    let outerWidth = contentBlock.outerWidth;
    let outerHeight = contentBlock.outerHeight;

    let x = adjustTextX(0, outerWidth, textAlign);
    let y = adjustTextY(0, outerHeight, textVerticalAlign);

    return new BoundingRect(x, y, outerWidth, outerHeight);
}

/**
 * @public
 * @param {Number} x
 * @param {Number} width
 * @param {String} [textAlign='left']
 * @return {Number} Adjusted x.
 */
function adjustTextX(x, width, textAlign) {
    // FIXME Right to left language
    if (textAlign === 'right') {
        x -= width;
    }
    else if (textAlign === 'center') {
        x -= width / 2;
    }
    return x;
}

/**
 * @public
 * @param {Number} y
 * @param {Number} height
 * @param {String} [textVerticalAlign='top']
 * @return {Number} Adjusted y.
 */
function adjustTextY(y, height, textVerticalAlign) {
    if (textVerticalAlign === 'middle') {
        y -= height / 2;
    }
    else if (textVerticalAlign === 'bottom') {
        y -= height;
    }
    return y;
}

/**
 * Follow same interface to `Displayable.prototype.calculateTextPosition`.
 * @public
 * @param {Obejct} [out] Prepared out object. If not input, auto created in the method.
 * @param {module:zrender/graphic/Style} style where `textPosition` and `textDistance` are visited.
 * @param {Object} rect {x, y, width, height} Rect of the host elment, according to which the text positioned.
 * @return {Object} The input `out`. Set: {x, y, textAlign, textVerticalAlign}
 */
function calculateTextPosition(out, style, rect) {
    let textPosition = style.textPosition;
    let distance = style.textDistance;

    let x = rect.x;
    let y = rect.y;
    distance = distance || 0;

    let height = rect.height;
    let width = rect.width;
    let halfHeight = height / 2;

    let textAlign = 'left';
    let textVerticalAlign = 'top';

    switch (textPosition) {
        case 'left':
            x -= distance;
            y += halfHeight;
            textAlign = 'right';
            textVerticalAlign = 'middle';
            break;
        case 'right':
            x += distance + width;
            y += halfHeight;
            textVerticalAlign = 'middle';
            break;
        case 'top':
            x += width / 2;
            y -= distance;
            textAlign = 'center';
            textVerticalAlign = 'bottom';
            break;
        case 'bottom':
            x += width / 2;
            y += height + distance;
            textAlign = 'center';
            break;
        case 'inside':
            x += width / 2;
            y += halfHeight;
            textAlign = 'center';
            textVerticalAlign = 'middle';
            break;
        case 'insideLeft':
            x += distance;
            y += halfHeight;
            textVerticalAlign = 'middle';
            break;
        case 'insideRight':
            x += width - distance;
            y += halfHeight;
            textAlign = 'right';
            textVerticalAlign = 'middle';
            break;
        case 'insideTop':
            x += width / 2;
            y += distance;
            textAlign = 'center';
            break;
        case 'insideBottom':
            x += width / 2;
            y += height - distance;
            textAlign = 'center';
            textVerticalAlign = 'bottom';
            break;
        case 'insideTopLeft':
            x += distance;
            y += distance;
            break;
        case 'insideTopRight':
            x += width - distance;
            y += distance;
            textAlign = 'right';
            break;
        case 'insideBottomLeft':
            x += distance;
            y += height - distance;
            textVerticalAlign = 'bottom';
            break;
        case 'insideBottomRight':
            x += width - distance;
            y += height - distance;
            textAlign = 'right';
            textVerticalAlign = 'bottom';
            break;
    }

    out = out || {};
    out.x = x;
    out.y = y;
    out.textAlign = textAlign;
    out.textVerticalAlign = textVerticalAlign;

    return out;
}

/**
 * To be removed. But still do not remove in case that some one has imported it.
 * @deprecated
 * @public
 * @param {stirng} textPosition
 * @param {Object} rect {x, y, width, height}
 * @param {Number} distance
 * @return {Object} {x, y, textAlign, textVerticalAlign}
 */


/**
 * Show ellipsis if overflow.
 *
 * @public
 * @param  {String} text
 * @param  {String} containerWidth
 * @param  {String} font
 * @param  {Number} [ellipsis='...']
 * @param  {Object} [options]
 * @param  {Number} [options.maxIterations=3]
 * @param  {Number} [options.minChar=0] If truncate result are less
 *                  then minChar, ellipsis will not show, which is
 *                  better for user hint in some cases.
 * @param  {Number} [options.placeholder=''] When all truncated, use the placeholder.
 * @return {String}
 */
function truncateText(text, containerWidth, font, ellipsis, options) {
    if (!containerWidth) {
        return '';
    }

    let textLines = (text + '').split('\n');
    options = prepareTruncateOptions(containerWidth, font, ellipsis, options);

    // FIXME
    // It is not appropriate that every line has '...' when truncate multiple lines.
    for (let i = 0, len = textLines.length; i < len; i++) {
        textLines[i] = truncateSingleLine(textLines[i], options);
    }

    return textLines.join('\n');
}

function prepareTruncateOptions(containerWidth, font, ellipsis, options) {
    options = extend({}, options);

    options.font = font;
    ellipsis = retrieve2(ellipsis, '...');
    options.maxIterations = retrieve2(options.maxIterations, 2);
    let minChar = options.minChar = retrieve2(options.minChar, 0);
    // FIXME
    // Other languages?
    options.cnCharWidth = getWidth('国', font);
    // FIXME
    // Consider proportional font?
    let ascCharWidth = options.ascCharWidth = getWidth('a', font);
    options.placeholder = retrieve2(options.placeholder, '');

    // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
    // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.
    let contentWidth = containerWidth = Math.max(0, containerWidth - 1); // Reserve some gap.
    for (let i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
        contentWidth -= ascCharWidth;
    }

    let ellipsisWidth = getWidth(ellipsis, font);
    if (ellipsisWidth > contentWidth) {
        ellipsis = '';
        ellipsisWidth = 0;
    }

    contentWidth = containerWidth - ellipsisWidth;

    options.ellipsis = ellipsis;
    options.ellipsisWidth = ellipsisWidth;
    options.contentWidth = contentWidth;
    options.containerWidth = containerWidth;

    return options;
}

function truncateSingleLine(textLine, options) {
    let containerWidth = options.containerWidth;
    let font = options.font;
    let contentWidth = options.contentWidth;

    if (!containerWidth) {
        return '';
    }

    let lineWidth = getWidth(textLine, font);

    if (lineWidth <= containerWidth) {
        return textLine;
    }

    for (let j = 0; ; j++) {
        if (lineWidth <= contentWidth || j >= options.maxIterations) {
            textLine += options.ellipsis;
            break;
        }

        let subLength = j === 0
            ? estimateLength(textLine, contentWidth, options.ascCharWidth, options.cnCharWidth)
            : lineWidth > 0
            ? Math.floor(textLine.length * contentWidth / lineWidth)
            : 0;

        textLine = textLine.substr(0, subLength);
        lineWidth = getWidth(textLine, font);
    }

    if (textLine === '') {
        textLine = options.placeholder;
    }

    return textLine;
}

function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
    let width = 0;
    let i = 0;
    for (let len = text.length; i < len && width < contentWidth; i++) {
        let charCode = text.charCodeAt(i);
        width += (0 <= charCode && charCode <= 127) ? ascCharWidth : cnCharWidth;
    }
    return i;
}

/**
 * @public
 * @param {String} font
 * @return {Number} line height
 */
function getLineHeight(font) {
    // FIXME A rough approach.
    return getWidth('国', font);
}

/**
 * @public
 * @param {String} text
 * @param {String} font
 * @return {Object} width
 */
function measureText(text, font) {
    return methods$1.measureText(text, font);
}

// Avoid assign to an exported variable, for transforming to cjs.
methods$1.measureText = function (text, font) {
    let ctx = getContext();
    ctx.font = font || DEFAULT_FONT$1;
    return ctx.measureText(text);
};

/**
 * @public
 * @param {String} text
 * @param {String} font
 * @param {Object} [truncate]
 * @return {Object} block: {lineHeight, lines, height, outerHeight, canCacheByTextString}
 *  Notice: for performance, do not calculate outerWidth util needed.
 *  `canCacheByTextString` means the result `lines` is only determined by the input `text`.
 *  Thus we can simply comparing the `input` text to determin whether the result changed,
 *  without travel the result `lines`.
 */
function parsePlainText(text, font, padding, textLineHeight, truncate) {
    text != null && (text += '');

    let lineHeight = retrieve2(textLineHeight, getLineHeight(font));
    let lines = text ? text.split('\n') : [];
    let height = lines.length * lineHeight;
    let outerHeight = height;
    let canCacheByTextString = true;

    if (padding) {
        outerHeight += padding[0] + padding[2];
    }

    if (text && truncate) {
        canCacheByTextString = false;
        let truncOuterHeight = truncate.outerHeight;
        let truncOuterWidth = truncate.outerWidth;
        if (truncOuterHeight != null && outerHeight > truncOuterHeight) {
            text = '';
            lines = [];
        }
        else if (truncOuterWidth != null) {
            let options = prepareTruncateOptions(
                truncOuterWidth - (padding ? padding[1] + padding[3] : 0),
                font,
                truncate.ellipsis,
                {minChar: truncate.minChar, placeholder: truncate.placeholder}
            );

            // FIXME
            // It is not appropriate that every line has '...' when truncate multiple lines.
            for (let i = 0, len = lines.length; i < len; i++) {
                lines[i] = truncateSingleLine(lines[i], options);
            }
        }
    }

    return {
        lines: lines,
        height: height,
        outerHeight: outerHeight,
        lineHeight: lineHeight,
        canCacheByTextString: canCacheByTextString
    };
}

/**
 * For example: 'some text {a|some text}other text{b|some text}xxx{c|}xxx'
 * Also consider 'bbbb{a|xxx\nzzz}xxxx\naaaa'.
 *
 * @public
 * @param {String} text
 * @param {Object} style
 * @return {Object} block
 * {
 *      width,
 *      height,
 *      lines: [{
 *          lineHeight,
 *          width,
 *          tokens: [[{
 *              styleName,
 *              text,
 *              width,      // include textPadding
 *              height,     // include textPadding
 *              textWidth, // pure text width
 *              textHeight, // pure text height
 *              lineHeihgt,
 *              font,
 *              textAlign,
 *              textVerticalAlign
 *          }], [...], ...]
 *      }, ...]
 * }
 * If styleName is undefined, it is plain text.
 */
function parseRichText(text, style) {
    let contentBlock = {lines: [], width: 0, height: 0};

    text != null && (text += '');
    if (!text) {
        return contentBlock;
    }

    let lastIndex = STYLE_REG.lastIndex = 0;
    let result;
    while ((result = STYLE_REG.exec(text)) != null) {
        let matchedIndex = result.index;
        if (matchedIndex > lastIndex) {
            pushTokens(contentBlock, text.substring(lastIndex, matchedIndex));
        }
        pushTokens(contentBlock, result[2], result[1]);
        lastIndex = STYLE_REG.lastIndex;
    }

    if (lastIndex < text.length) {
        pushTokens(contentBlock, text.substring(lastIndex, text.length));
    }

    let lines = contentBlock.lines;
    let contentHeight = 0;
    let contentWidth = 0;
    // For `textWidth: 100%`
    let pendingList = [];

    let stlPadding = style.textPadding;

    let truncate = style.truncate;
    let truncateWidth = truncate && truncate.outerWidth;
    let truncateHeight = truncate && truncate.outerHeight;
    if (stlPadding) {
        truncateWidth != null && (truncateWidth -= stlPadding[1] + stlPadding[3]);
        truncateHeight != null && (truncateHeight -= stlPadding[0] + stlPadding[2]);
    }

    // Calculate layout info of tokens.
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let lineHeight = 0;
        let lineWidth = 0;

        for (let j = 0; j < line.tokens.length; j++) {
            let token = line.tokens[j];
            let tokenStyle = token.styleName && style.rich[token.styleName] || {};
            // textPadding should not inherit from style.
            let textPadding = token.textPadding = tokenStyle.textPadding;

            // textFont has been asigned to font by `normalizeStyle`.
            let font = token.font = tokenStyle.font || style.font;

            // textHeight can be used when textVerticalAlign is specified in token.
            let tokenHeight = token.textHeight = retrieve2(
                // textHeight should not be inherited, consider it can be specified
                // as box height of the block.
                tokenStyle.textHeight, getLineHeight(font)
            );
            textPadding && (tokenHeight += textPadding[0] + textPadding[2]);
            token.height = tokenHeight;
            token.lineHeight = retrieve3(
                tokenStyle.textLineHeight, style.textLineHeight, tokenHeight
            );

            token.textAlign = tokenStyle && tokenStyle.textAlign || style.textAlign;
            token.textVerticalAlign = tokenStyle && tokenStyle.textVerticalAlign || 'middle';

            if (truncateHeight != null && contentHeight + token.lineHeight > truncateHeight) {
                return {lines: [], width: 0, height: 0};
            }

            token.textWidth = getWidth(token.text, font);
            let tokenWidth = tokenStyle.textWidth;
            let tokenWidthNotSpecified = tokenWidth == null || tokenWidth === 'auto';

            // Percent width, can be `100%`, can be used in drawing separate
            // line when box width is needed to be auto.
            if (typeof tokenWidth === 'string' && tokenWidth.charAt(tokenWidth.length - 1) === '%') {
                token.percentWidth = tokenWidth;
                pendingList.push(token);
                tokenWidth = 0;
                // Do not truncate in this case, because there is no user case
                // and it is too complicated.
            }
            else {
                if (tokenWidthNotSpecified) {
                    tokenWidth = token.textWidth;

                    // FIXME: If image is not loaded and textWidth is not specified, calling
                    // `getBoundingRect()` will not get correct result.
                    let textBackgroundColor = tokenStyle.textBackgroundColor;
                    let bgImg = textBackgroundColor && textBackgroundColor.image;

                    // Use cases:
                    // (1) If image is not loaded, it will be loaded at render phase and call
                    // `dirty()` and `textBackgroundColor.image` will be replaced with the loaded
                    // image, and then the right size will be calculated here at the next tick.
                    // See `graphic/helper/text.js`.
                    // (2) If image loaded, and `textBackgroundColor.image` is image src string,
                    // use `imageHelper.findExistImage` to find cached image.
                    // `imageHelper.findExistImage` will always be called here before
                    // `imageHelper.createOrUpdateImage` in `graphic/helper/text.js#renderRichText`
                    // which ensures that image will not be rendered before correct size calcualted.
                    if (bgImg) {
                        bgImg = findExistImage(bgImg);
                        if (isImageReady(bgImg)) {
                            tokenWidth = Math.max(tokenWidth, bgImg.width * tokenHeight / bgImg.height);
                        }
                    }
                }

                let paddingW = textPadding ? textPadding[1] + textPadding[3] : 0;
                tokenWidth += paddingW;

                let remianTruncWidth = truncateWidth != null ? truncateWidth - lineWidth : null;

                if (remianTruncWidth != null && remianTruncWidth < tokenWidth) {
                    if (!tokenWidthNotSpecified || remianTruncWidth < paddingW) {
                        token.text = '';
                        token.textWidth = tokenWidth = 0;
                    }
                    else {
                        token.text = truncateText(
                            token.text, remianTruncWidth - paddingW, font, truncate.ellipsis,
                            {minChar: truncate.minChar}
                        );
                        token.textWidth = getWidth(token.text, font);
                        tokenWidth = token.textWidth + paddingW;
                    }
                }
            }

            lineWidth += (token.width = tokenWidth);
            tokenStyle && (lineHeight = Math.max(lineHeight, token.lineHeight));
        }

        line.width = lineWidth;
        line.lineHeight = lineHeight;
        contentHeight += lineHeight;
        contentWidth = Math.max(contentWidth, lineWidth);
    }

    contentBlock.outerWidth = contentBlock.width = retrieve2(style.textWidth, contentWidth);
    contentBlock.outerHeight = contentBlock.height = retrieve2(style.textHeight, contentHeight);

    if (stlPadding) {
        contentBlock.outerWidth += stlPadding[1] + stlPadding[3];
        contentBlock.outerHeight += stlPadding[0] + stlPadding[2];
    }

    for (let i = 0; i < pendingList.length; i++) {
        let token = pendingList[i];
        let percentWidth = token.percentWidth;
        // Should not base on outerWidth, because token can not be placed out of padding.
        token.width = parseInt(percentWidth, 10) / 100 * contentWidth;
    }

    return contentBlock;
}

function pushTokens(block, str, styleName) {
    let isEmptyStr = str === '';
    let strs = str.split('\n');
    let lines = block.lines;

    for (let i = 0; i < strs.length; i++) {
        let text = strs[i];
        let token = {
            styleName: styleName,
            text: text,
            isLineHolder: !text && !isEmptyStr
        };

        // The first token should be appended to the last line.
        if (!i) {
            let tokens = (lines[lines.length - 1] || (lines[0] = {tokens: []})).tokens;

            // Consider cases:
            // (1) ''.split('\n') => ['', '\n', ''], the '' at the first item
            // (which is a placeholder) should be replaced by new token.
            // (2) A image backage, where token likes {a|}.
            // (3) A redundant '' will affect textAlign in line.
            // (4) tokens with the same tplName should not be merged, because
            // they should be displayed in different box (with border and padding).
            let tokensLen = tokens.length;
            (tokensLen === 1 && tokens[0].isLineHolder)
                ? (tokens[0] = token)
                // Consider text is '', only insert when it is the "lineHolder" or
                // "emptyStr". Otherwise a redundant '' will affect textAlign in line.
                : ((text || !tokensLen || isEmptyStr) && tokens.push(token));
        }
        // Other tokens always start a new line.
        else {
            // If there is '', insert it as a placeholder.
            lines.push({tokens: [token]});
        }
    }
}

function makeFont(style) {
    // FIXME in node-canvas fontWeight is before fontStyle
    // Use `fontSize` `fontFamily` to check whether font properties are defined.
    let font = (style.fontSize || style.fontFamily) && [
        style.fontStyle,
        style.fontWeight,
        (style.fontSize || 12) + 'px',
        // If font properties are defined, `fontFamily` should not be ignored.
        style.fontFamily || 'sans-serif'
    ].join(' ');
    return font && trim(font) || style.textFont || style.font;
}

/**
 * @param {Object} ctx
 * @param {Object} shape
 * @param {Number} shape.x
 * @param {Number} shape.y
 * @param {Number} shape.width
 * @param {Number} shape.height
 * @param {Number} shape.r
 */
function buildPath(ctx, shape) {
    var x = shape.x;
    var y = shape.y;
    var width = shape.width;
    var height = shape.height;
    var r = shape.r;
    var r1;
    var r2;
    var r3;
    var r4;

    // Convert width and height to positive for better borderRadius
    if (width < 0) {
        x = x + width;
        width = -width;
    }
    if (height < 0) {
        y = y + height;
        height = -height;
    }

    if (typeof r === 'number') {
        r1 = r2 = r3 = r4 = r;
    }
    else if (r instanceof Array) {
        if (r.length === 1) {
            r1 = r2 = r3 = r4 = r[0];
        }
        else if (r.length === 2) {
            r1 = r3 = r[0];
            r2 = r4 = r[1];
        }
        else if (r.length === 3) {
            r1 = r[0];
            r2 = r4 = r[1];
            r3 = r[2];
        }
        else {
            r1 = r[0];
            r2 = r[1];
            r3 = r[2];
            r4 = r[3];
        }
    }
    else {
        r1 = r2 = r3 = r4 = 0;
    }

    var total;
    if (r1 + r2 > width) {
        total = r1 + r2;
        r1 *= width / total;
        r2 *= width / total;
    }
    if (r3 + r4 > width) {
        total = r3 + r4;
        r3 *= width / total;
        r4 *= width / total;
    }
    if (r2 + r3 > height) {
        total = r2 + r3;
        r2 *= height / total;
        r3 *= height / total;
    }
    if (r1 + r4 > height) {
        total = r1 + r4;
        r1 *= height / total;
        r4 *= height / total;
    }
    ctx.moveTo(x + r1, y);
    ctx.lineTo(x + width - r2, y);
    r2 !== 0 && ctx.arc(x + width - r2, y + r2, r2, -Math.PI / 2, 0);
    ctx.lineTo(x + width, y + height - r3);
    r3 !== 0 && ctx.arc(x + width - r3, y + height - r3, r3, 0, Math.PI / 2);
    ctx.lineTo(x + r4, y + height);
    r4 !== 0 && ctx.arc(x + r4, y + height - r4, r4, Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + r1);
    r1 !== 0 && ctx.arc(x + r1, y + r1, r1, Math.PI, Math.PI * 1.5);
}

var DEFAULT_FONT = DEFAULT_FONT$1;

// TODO: Have not support 'start', 'end' yet.
var VALID_TEXT_ALIGN = {left: 1, right: 1, center: 1};
var VALID_TEXT_VERTICAL_ALIGN = {top: 1, bottom: 1, middle: 1};
// Different from `STYLE_COMMON_PROPS` of `graphic/Style`,
// the default value of shadowColor is `'transparent'`.
var SHADOW_STYLE_COMMON_PROPS = [
    ['textShadowBlur', 'shadowBlur', 0],
    ['textShadowOffsetX', 'shadowOffsetX', 0],
    ['textShadowOffsetY', 'shadowOffsetY', 0],
    ['textShadowColor', 'shadowColor', 'transparent']
];
var _tmpTextPositionResult = {};
var _tmpBoxPositionResult = {};

/**
 * @param {module:zrender/graphic/Style} style
 * @return {module:zrender/graphic/Style} The input style.
 */
function normalizeTextStyle(style) {
    normalizeStyle(style);
    each(style.rich, normalizeStyle);
    return style;
}

function normalizeStyle(style) {
    if (style) {

        style.font = makeFont(style);

        var textAlign = style.textAlign;
        textAlign === 'middle' && (textAlign = 'center');
        style.textAlign = (
            textAlign == null || VALID_TEXT_ALIGN[textAlign]
        ) ? textAlign : 'left';

        // Compatible with textBaseline.
        var textVerticalAlign = style.textVerticalAlign || style.textBaseline;
        textVerticalAlign === 'center' && (textVerticalAlign = 'middle');
        style.textVerticalAlign = (
            textVerticalAlign == null || VALID_TEXT_VERTICAL_ALIGN[textVerticalAlign]
        ) ? textVerticalAlign : 'top';

        var textPadding = style.textPadding;
        if (textPadding) {
            style.textPadding = normalizeCssArray(style.textPadding);
        }
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} text
 * @param {module:zrender/graphic/Style} style
 * @param {Object|boolean} [rect] {x, y, width, height}
 *                  If set false, rect text is not used.
 * @param {Element|module:zrender/graphic/helper/constant.WILL_BE_RESTORED} [prevEl] For ctx prop cache.
 */
function renderText(hostEl, ctx, text, style, rect, prevEl) {
    style.rich
        ? renderRichText(hostEl, ctx, text, style, rect, prevEl)
        : renderPlainText(hostEl, ctx, text, style, rect, prevEl);
}

// Avoid setting to ctx according to prevEl if possible for
// performance in scenarios of large amount text.
function renderPlainText(hostEl, ctx, text, style, rect, prevEl) {
    'use strict';

    var needDrawBg = needDrawBackground(style);

    var prevStyle;
    var checkCache = false;
    var cachedByMe = ctx.__attrCachedBy === ContextCachedBy.PLAIN_TEXT;

    // Only take and check cache for `Text` el, but not RectText.
    if (prevEl !== WILL_BE_RESTORED) {
        if (prevEl) {
            prevStyle = prevEl.style;
            checkCache = !needDrawBg && cachedByMe && prevStyle;
        }

        // Prevent from using cache in `Style::bind`, because of the case:
        // ctx property is modified by other properties than `Style::bind`
        // used, and Style::bind is called next.
        ctx.__attrCachedBy = needDrawBg ? ContextCachedBy.NONE : ContextCachedBy.PLAIN_TEXT;
    }
    // Since this will be restored, prevent from using these props to check cache in the next
    // entering of this method. But do not need to clear other cache like `Style::bind`.
    else if (cachedByMe) {
        ctx.__attrCachedBy = ContextCachedBy.NONE;
    }

    var styleFont = style.font || DEFAULT_FONT;
    // PENDING
    // Only `Text` el set `font` and keep it (`RectText` will restore). So theoretically
    // we can make font cache on ctx, which can cache for text el that are discontinuous.
    // But layer save/restore needed to be considered.
    // if (styleFont !== ctx.__fontCache) {
    //     ctx.font = styleFont;
    //     if (prevEl !== WILL_BE_RESTORED) {
    //         ctx.__fontCache = styleFont;
    //     }
    // }
    if (!checkCache || styleFont !== (prevStyle.font || DEFAULT_FONT)) {
        ctx.font = styleFont;
    }

    // Use the final font from context-2d, because the final
    // font might not be the style.font when it is illegal.
    // But get `ctx.font` might be time consuming.
    var computedFont = hostEl.__computedFont;
    if (hostEl.__styleFont !== styleFont) {
        hostEl.__styleFont = styleFont;
        computedFont = hostEl.__computedFont = ctx.font;
    }

    var textPadding = style.textPadding;
    var textLineHeight = style.textLineHeight;

    var contentBlock = hostEl.__textCotentBlock;
    if (!contentBlock || hostEl.__dirtyText) {
        contentBlock = hostEl.__textCotentBlock = parsePlainText(
            text, computedFont, textPadding, textLineHeight, style.truncate
        );
    }

    var outerHeight = contentBlock.outerHeight;

    var textLines = contentBlock.lines;
    var lineHeight = contentBlock.lineHeight;

    var boxPos = getBoxPosition(_tmpBoxPositionResult, hostEl, style, rect);
    var baseX = boxPos.baseX;
    var baseY = boxPos.baseY;
    var textAlign = boxPos.textAlign || 'left';
    var textVerticalAlign = boxPos.textVerticalAlign;

    // Origin of textRotation should be the base point of text drawing.
    applyTextRotation(ctx, style, rect, baseX, baseY);

    var boxY = adjustTextY(baseY, outerHeight, textVerticalAlign);
    var textX = baseX;
    var textY = boxY;

    if (needDrawBg || textPadding) {
        // Consider performance, do not call getTextWidth util necessary.
        var textWidth = getWidth(text, computedFont);
        var outerWidth = textWidth;
        textPadding && (outerWidth += textPadding[1] + textPadding[3]);
        var boxX = adjustTextX(baseX, outerWidth, textAlign);

        needDrawBg && drawBackground(hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight);

        if (textPadding) {
            textX = getTextXForPadding(baseX, textAlign, textPadding);
            textY += textPadding[0];
        }
    }

    // Always set textAlign and textBase line, because it is difficute to calculate
    // textAlign from prevEl, and we dont sure whether textAlign will be reset if
    // font set happened.
    ctx.textAlign = textAlign;
    // Force baseline to be "middle". Otherwise, if using "top", the
    // text will offset downward a little bit in font "Microsoft YaHei".
    ctx.textBaseline = 'middle';
    // Set text opacity
    ctx.globalAlpha = style.opacity || 1;

    // Always set shadowBlur and shadowOffset to avoid leak from displayable.
    for (var i = 0; i < SHADOW_STYLE_COMMON_PROPS.length; i++) {
        var propItem = SHADOW_STYLE_COMMON_PROPS[i];
        var styleProp = propItem[0];
        var ctxProp = propItem[1];
        var val = style[styleProp];
        if (!checkCache || val !== prevStyle[styleProp]) {
            ctx[ctxProp] = fixShadow(ctx, ctxProp, val || propItem[2]);
        }
    }

    // `textBaseline` is set as 'middle'.
    textY += lineHeight / 2;

    var textStrokeWidth = style.textStrokeWidth;
    var textStrokeWidthPrev = checkCache ? prevStyle.textStrokeWidth : null;
    var strokeWidthChanged = !checkCache || textStrokeWidth !== textStrokeWidthPrev;
    var strokeChanged = !checkCache || strokeWidthChanged || style.textStroke !== prevStyle.textStroke;
    var textStroke = getStroke(style.textStroke, textStrokeWidth);
    var textFill = getFill(style.textFill);

    if (textStroke) {
        if (strokeWidthChanged) {
            ctx.lineWidth = textStrokeWidth;
        }
        if (strokeChanged) {
            ctx.strokeStyle = textStroke;
        }
    }
    if (textFill) {
        if (!checkCache || style.textFill !== prevStyle.textFill) {
            ctx.fillStyle = textFill;
        }
    }

    // Optimize simply, in most cases only one line exists.
    if (textLines.length === 1) {
        // Fill after stroke so the outline will not cover the main part.
        textStroke && ctx.strokeText(textLines[0], textX, textY);
        textFill && ctx.fillText(textLines[0], textX, textY);
    }
    else {
        for (var i = 0; i < textLines.length; i++) {
            // Fill after stroke so the outline will not cover the main part.
            textStroke && ctx.strokeText(textLines[i], textX, textY);
            textFill && ctx.fillText(textLines[i], textX, textY);
            textY += lineHeight;
        }
    }
}

function renderRichText(hostEl, ctx, text, style, rect, prevEl) {
    // Do not do cache for rich text because of the complexity.
    // But `RectText` this will be restored, do not need to clear other cache like `Style::bind`.
    if (prevEl !== WILL_BE_RESTORED) {
        ctx.__attrCachedBy = ContextCachedBy.NONE;
    }

    var contentBlock = hostEl.__textCotentBlock;

    if (!contentBlock || hostEl.__dirtyText) {
        contentBlock = hostEl.__textCotentBlock = parseRichText(text, style);
    }

    drawRichText(hostEl, ctx, contentBlock, style, rect);
}

function drawRichText(hostEl, ctx, contentBlock, style, rect) {
    var contentWidth = contentBlock.width;
    var outerWidth = contentBlock.outerWidth;
    var outerHeight = contentBlock.outerHeight;
    var textPadding = style.textPadding;

    var boxPos = getBoxPosition(_tmpBoxPositionResult, hostEl, style, rect);
    var baseX = boxPos.baseX;
    var baseY = boxPos.baseY;
    var textAlign = boxPos.textAlign;
    var textVerticalAlign = boxPos.textVerticalAlign;

    // Origin of textRotation should be the base point of text drawing.
    applyTextRotation(ctx, style, rect, baseX, baseY);

    var boxX = adjustTextX(baseX, outerWidth, textAlign);
    var boxY = adjustTextY(baseY, outerHeight, textVerticalAlign);
    var xLeft = boxX;
    var lineTop = boxY;
    if (textPadding) {
        xLeft += textPadding[3];
        lineTop += textPadding[0];
    }
    var xRight = xLeft + contentWidth;

    needDrawBackground(style) && drawBackground(
        hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight
    );

    for (var i = 0; i < contentBlock.lines.length; i++) {
        var line = contentBlock.lines[i];
        var tokens = line.tokens;
        var tokenCount = tokens.length;
        var lineHeight = line.lineHeight;
        var usedWidth = line.width;

        var leftIndex = 0;
        var lineXLeft = xLeft;
        var lineXRight = xRight;
        var rightIndex = tokenCount - 1;
        var token;

        while (
            leftIndex < tokenCount
            && (token = tokens[leftIndex], !token.textAlign || token.textAlign === 'left')
        ) {
            placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft, 'left');
            usedWidth -= token.width;
            lineXLeft += token.width;
            leftIndex++;
        }

        while (
            rightIndex >= 0
            && (token = tokens[rightIndex], token.textAlign === 'right')
        ) {
            placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXRight, 'right');
            usedWidth -= token.width;
            lineXRight -= token.width;
            rightIndex--;
        }

        // The other tokens are placed as textAlign 'center' if there is enough space.
        lineXLeft += (contentWidth - (lineXLeft - xLeft) - (xRight - lineXRight) - usedWidth) / 2;
        while (leftIndex <= rightIndex) {
            token = tokens[leftIndex];
            // Consider width specified by user, use 'center' rather than 'left'.
            placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft + token.width / 2, 'center');
            lineXLeft += token.width;
            leftIndex++;
        }

        lineTop += lineHeight;
    }
}

function applyTextRotation(ctx, style, rect, x, y) {
    // textRotation only apply in RectText.
    if (rect && style.textRotation) {
        var origin = style.textOrigin;
        if (origin === 'center') {
            x = rect.width / 2 + rect.x;
            y = rect.height / 2 + rect.y;
        }
        else if (origin) {
            x = origin[0] + rect.x;
            y = origin[1] + rect.y;
        }

        ctx.translate(x, y);
        // Positive: anticlockwise
        ctx.rotate(-style.textRotation);
        ctx.translate(-x, -y);
    }
}

function placeToken(hostEl, ctx, token, style, lineHeight, lineTop, x, textAlign) {
    var tokenStyle = style.rich[token.styleName] || {};
    tokenStyle.text = token.text;

    // 'ctx.textBaseline' is always set as 'middle', for sake of
    // the bias of "Microsoft YaHei".
    var textVerticalAlign = token.textVerticalAlign;
    var y = lineTop + lineHeight / 2;
    if (textVerticalAlign === 'top') {
        y = lineTop + token.height / 2;
    }
    else if (textVerticalAlign === 'bottom') {
        y = lineTop + lineHeight - token.height / 2;
    }

    !token.isLineHolder && needDrawBackground(tokenStyle) && drawBackground(
        hostEl,
        ctx,
        tokenStyle,
        textAlign === 'right'
            ? x - token.width
            : textAlign === 'center'
            ? x - token.width / 2
            : x,
        y - token.height / 2,
        token.width,
        token.height
    );

    var textPadding = token.textPadding;
    if (textPadding) {
        x = getTextXForPadding(x, textAlign, textPadding);
        y -= token.height / 2 - textPadding[2] - token.textHeight / 2;
    }

    setCtx(ctx, 'shadowBlur', retrieve3(tokenStyle.textShadowBlur, style.textShadowBlur, 0));
    setCtx(ctx, 'shadowColor', tokenStyle.textShadowColor || style.textShadowColor || 'transparent');
    setCtx(ctx, 'shadowOffsetX', retrieve3(tokenStyle.textShadowOffsetX, style.textShadowOffsetX, 0));
    setCtx(ctx, 'shadowOffsetY', retrieve3(tokenStyle.textShadowOffsetY, style.textShadowOffsetY, 0));

    setCtx(ctx, 'textAlign', textAlign);
    // Force baseline to be "middle". Otherwise, if using "top", the
    // text will offset downward a little bit in font "Microsoft YaHei".
    setCtx(ctx, 'textBaseline', 'middle');

    setCtx(ctx, 'font', token.font || DEFAULT_FONT);

    var textStroke = getStroke(tokenStyle.textStroke || style.textStroke, textStrokeWidth);
    var textFill = getFill(tokenStyle.textFill || style.textFill);
    var textStrokeWidth = retrieve2(tokenStyle.textStrokeWidth, style.textStrokeWidth);

    // Fill after stroke so the outline will not cover the main part.
    if (textStroke) {
        setCtx(ctx, 'lineWidth', textStrokeWidth);
        setCtx(ctx, 'strokeStyle', textStroke);
        ctx.strokeText(token.text, x, y);
    }
    if (textFill) {
        setCtx(ctx, 'fillStyle', textFill);
        ctx.fillText(token.text, x, y);
    }
}

function needDrawBackground(style) {
    return !!(
        style.textBackgroundColor
        || (style.textBorderWidth && style.textBorderColor)
    );
}

// style: {textBackgroundColor, textBorderWidth, textBorderColor, textBorderRadius, text}
// shape: {x, y, width, height}
function drawBackground(hostEl, ctx, style, x, y, width, height) {
    var textBackgroundColor = style.textBackgroundColor;
    var textBorderWidth = style.textBorderWidth;
    var textBorderColor = style.textBorderColor;
    var isPlainBg = isString(textBackgroundColor);

    setCtx(ctx, 'shadowBlur', style.textBoxShadowBlur || 0);
    setCtx(ctx, 'shadowColor', style.textBoxShadowColor || 'transparent');
    setCtx(ctx, 'shadowOffsetX', style.textBoxShadowOffsetX || 0);
    setCtx(ctx, 'shadowOffsetY', style.textBoxShadowOffsetY || 0);

    if (isPlainBg || (textBorderWidth && textBorderColor)) {
        ctx.beginPath();
        var textBorderRadius = style.textBorderRadius;
        if (!textBorderRadius) {
            ctx.rect(x, y, width, height);
        }
        else {
            buildPath(ctx, {
                x: x, y: y, width: width, height: height, r: textBorderRadius
            });
        }
        ctx.closePath();
    }

    if (isPlainBg) {
        setCtx(ctx, 'fillStyle', textBackgroundColor);

        if (style.fillOpacity != null) {
            var originalGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = style.fillOpacity * style.opacity;
            ctx.fill();
            ctx.globalAlpha = originalGlobalAlpha;
        }
        else {
            ctx.fill();
        }
    }
    else if (isObject(textBackgroundColor)) {
        var image = textBackgroundColor.image;

        image = createOrUpdateImage(
            image, null, hostEl, onBgImageLoaded, textBackgroundColor
        );
        if (image && isImageReady(image)) {
            ctx.drawImage(image, x, y, width, height);
        }
    }

    if (textBorderWidth && textBorderColor) {
        setCtx(ctx, 'lineWidth', textBorderWidth);
        setCtx(ctx, 'strokeStyle', textBorderColor);

        if (style.strokeOpacity != null) {
            var originalGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = style.strokeOpacity * style.opacity;
            ctx.stroke();
            ctx.globalAlpha = originalGlobalAlpha;
        }
        else {
            ctx.stroke();
        }
    }
}

function onBgImageLoaded(image, textBackgroundColor) {
    // Replace image, so that `contain/text.js#parseRichText`
    // will get correct result in next tick.
    textBackgroundColor.image = image;
}

function getBoxPosition(out, hostEl, style, rect) {
    var baseX = style.x || 0;
    var baseY = style.y || 0;
    var textAlign = style.textAlign;
    var textVerticalAlign = style.textVerticalAlign;

    // Text position represented by coord
    if (rect) {
        var textPosition = style.textPosition;
        if (textPosition instanceof Array) {
            // Percent
            baseX = rect.x + parsePercent(textPosition[0], rect.width);
            baseY = rect.y + parsePercent(textPosition[1], rect.height);
        }
        else {
            var res = (hostEl && hostEl.calculateTextPosition)
                ? hostEl.calculateTextPosition(_tmpTextPositionResult, style, rect)
                : calculateTextPosition(_tmpTextPositionResult, style, rect);
            baseX = res.x;
            baseY = res.y;
            // Default align and baseline when has textPosition
            textAlign = textAlign || res.textAlign;
            textVerticalAlign = textVerticalAlign || res.textVerticalAlign;
        }

        // textOffset is only support in RectText, otherwise
        // we have to adjust boundingRect for textOffset.
        var textOffset = style.textOffset;
        if (textOffset) {
            baseX += textOffset[0];
            baseY += textOffset[1];
        }
    }

    out = out || {};
    out.baseX = baseX;
    out.baseY = baseY;
    out.textAlign = textAlign;
    out.textVerticalAlign = textVerticalAlign;

    return out;
}


function setCtx(ctx, prop, value) {
    ctx[prop] = fixShadow(ctx, prop, value);
    return ctx[prop];
}

/**
 * @param {String} [stroke] If specified, do not check style.textStroke.
 * @param {String} [lineWidth] If specified, do not check style.textStroke.
 * @param {Number} style
 */
function getStroke(stroke, lineWidth) {
    return (stroke == null || lineWidth <= 0 || stroke === 'transparent' || stroke === 'none')
        ? null
        // TODO pattern and gradient?
        : (stroke.image || stroke.colorStops)
        ? '#000'
        : stroke;
}

function getFill(fill) {
    return (fill == null || fill === 'none')
        ? null
        // TODO pattern and gradient?
        : (fill.image || fill.colorStops)
        ? '#000'
        : fill;
}

function parsePercent(value, maxValue) {
    if (typeof value === 'string') {
        if (value.lastIndexOf('%') >= 0) {
            return parseFloat(value) / 100 * maxValue;
        }
        return parseFloat(value);
    }
    return value;
}

function getTextXForPadding(x, textAlign, textPadding) {
    return textAlign === 'right'
        ? (x - textPadding[1])
        : textAlign === 'center'
        ? (x + textPadding[3] / 2 - textPadding[1] / 2)
        : (x + textPadding[3]);
}

/**
 * @param {String} text
 * @param {module:zrender/Style} style
 * @return {boolean}
 */
function needDrawText(text, style) {
    return text != null
        && (text
            || style.textBackgroundColor
            || (style.textBorderWidth && style.textBorderColor)
            || style.textPadding
        );
}

/**
 * @class zrender.graphic.RectText 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

let tmpRect$1 = new BoundingRect();
let RectText = function () {};
/**
 * @method constructor RectText
 */
RectText.prototype = {
    constructor: RectText,
    /**
     * Draw text in a rect with specified position.
     * @param  {CanvasRenderingContext2D} ctx
     * @param  {Object} rect Displayable rect
     */
    drawRectText: function (ctx, rect) {
        let style = this.style;
        rect = style.textRect || rect;
        // Optimize, avoid normalize every time.
        this.__dirty && normalizeTextStyle(style, true);
        let text = style.text;
        // Convert to string
        text != null && (text += '');
        if (!needDrawText(text, style)) {
            return;
        }
        // FIXME
        // Do not provide prevEl to `textUtil.renderText` for ctx prop cache,
        // but use `ctx.save()` and `ctx.restore()`. Because the cache for rect
        // text propably break the cache for its host elements.
        ctx.save();

        // Transform rect to view space
        let transform = this.transform;
        if (!style.transformText) {
            if (transform) {
                tmpRect$1.copy(rect);
                tmpRect$1.applyTransform(transform);
                rect = tmpRect$1;
            }
        }else {
            this.setTransform(ctx);
        }
        // transformText and textRotation can not be used at the same time.
        renderText(this, ctx, text, style, rect, WILL_BE_RESTORED);
        ctx.restore();
    }
};

/**
 * @abstract
 * @class zrender.graphic.Displayable 
 * 
 * Base class of all displayable graphic objects.
 * 
 * 所有图形对象的基类，抽象类。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

class Displayable extends Element{
    /**
     * @method constructor
     * @param {*} options 
     */
    constructor(options={}){
        super(options);

        /**
         * @private
         * @property  __clipPaths
         * Shapes for cascade clipping.
         * Can only be `null`/`undefined` or an non-empty array, MUST NOT be an empty array.
         * because it is easy to only using null to check whether clipPaths changed.
         */
        this.__clipPaths = null;

        // FIXME Stateful must be mixined after style is setted
        // Stateful.call(this, options);

        /**
         * The String value of `textPosition` needs to be calculated to a real postion.
         * For example, `'inside'` is calculated to `[rect.width/2, rect.height/2]`
         * by default. See `contain/text.js#calculateTextPosition` for more details.
         * But some coutom shapes like "pin", "flag" have center that is not exactly
         * `[width/2, height/2]`. So we provide this hook to customize the calculation
         * for those shapes. It will be called if the `style.textPosition` is a String.
         * @param {Obejct} [out] Prepared out object. If not provided, this method should
         *        be responsible for creating one.
         * @param {Style} style
         * @param {Object} rect {x, y, width, height}
         * @return {Obejct} out The same as the input out.
         *         {
         *             x: Number. mandatory.
         *             y: Number. mandatory.
         *             textAlign: String. optional. use style.textAlign by default.
         *             textVerticalAlign: String. optional. use style.textVerticalAlign by default.
         *         }
         */
        this.calculateTextPosition=null;

        /**
         * @property {String} type
         */
        this.type='displayable';

        /**
         * @property {Boolean} invisible
         * Whether the displayable object is visible. when it is true, the displayable object
         * is not drawn, but the mouse event can still trigger the object.
         */
        this.invisible=false;

        /**
         * @property {Number} z
         */
        this.z=0;

        /**
         * @property {Number} z2
         */
        this.z2=0;

        /**
         * @property {Number} zlevel
         * The z level determines the displayable object can be drawn in which layer canvas.
         */
        this.zlevel=0;

        /**
         * @property {Boolean} draggable
         * Whether it can be dragged.
         */
        this.draggable=false;

        /**
         * @property {Boolean} dragging
         * Whether is it dragging.
         */
        this.dragging=false;

        /**
         * @property {Boolean} silent
         * Whether to respond to mouse events.
         */
        this.silent=false;

        /**
         * @property {Boolean} culling
         * If enable culling
         */
        this.culling=false;

        /**
         * @property {String} cursor
         * Mouse cursor when hovered
         */
        this.cursor='pointer';

        /**
         * @property {String} rectHover
         * If hover area is bounding rect
         */
        this.rectHover=false;

        /**
         * @property {Boolean} progressive
         * Render the element progressively when the value >= 0,
         * usefull for large data.
         */
        this.progressive=false;

        /**
         * @property {Boolean} incremental
         */
        this.incremental=false;

        /**
         * @property {Boolean} globalScaleRatio
         * Scale ratio for global scale.
         */
        this.globalScaleRatio=1;

        /**
         * @property {Style} style
         */
        this.style = new Style(options.style, this);

        /**
         * @property {Object} shape 形状
         */
        this.shape={};
    
        // Extend default shape
        let defaultShape = this.options.shape;
        if (defaultShape) {
            for (let name in defaultShape) {
                if (!this.shape.hasOwnProperty(name)&&defaultShape.hasOwnProperty(name)){
                    this.shape[name] = defaultShape[name];
                }
            }
        }
        
        // FIXME 不能 extend position, rotation 等引用对象 TODO:why?
        copyOwnProperties(this,this.options,['style','shape']);
    }

    /**
     * @protected
     * @method beforeBrush
     */
    beforeBrush(ctx) {}

    /**
     * @protected
     * @method brush
     * Callback during brush.
     */
    brush(ctx, prevEl) {}

    /**
     * @protected
     * @method afterBrush
     */
    afterBrush(ctx) {}

    /**
     * @protected
     * @method getBoundingRect
     */
    getBoundingRect() {}

    /**
     * @protected
     * @method contain
     * 
     * If displayable element contain coord x, y, this is an util function for
     * determine where two elements overlap.
     * 
     * 图元是否包含坐标(x,y)，此工具方法用来判断两个图元是否重叠。
     * 
     * @param  {Number} x
     * @param  {Number} y
     * @return {Boolean}
     */
    contain(x, y) {
        return this.rectContain(x, y);
    }

    /**
     * @protected
     * @method rectContain
     * 
     * If bounding rect of element contain coord x, y.
     * 
     * 用来判断当前图元的外框矩形是否包含坐标点(x,y)。
     * 
     * @param  {Number} x
     * @param  {Number} y
     * @return {Boolean}
     */
    rectContain(x, y) {
        let coord = this.transformCoordToLocal(x, y);
        let rect = this.getBoundingRect();
        return rect.contain(coord[0], coord[1]);
    }

    /**
     * @method traverse
     * @param  {Function} cb
     * @param  {Object}  context
     */
    traverse(cb, context) {
        cb.call(context, this);
    }

    /**
     * @method animateStyle
     * Alias for animate('style')
     * @param {Boolean} loop
     */
    animateStyle(loop) {
        return this.animate('style', loop);
    }

    /**
     * @method attrKV
     * @param {*} key 
     * @param {*} value 
     */
    attrKV(key, value) {
        if (key !== 'style') {
            Element.prototype.attrKV.call(this, key, value);
        }else {
            this.style.set(value);
        }
    }

    /**
     * @method setStyle
     * @param {Object|String} key
     * @param {*} value
     */
    setStyle(key, value) {
        this.style.set(key, value);
        this.dirty(false);
        return this;
    }

    /**
     * @method useStyle
     * Use given style object
     * @param  {Object} obj
     */
    useStyle(obj) {
        this.style = new Style(obj, this);
        this.dirty(false);
        return this;
    }
}

mixin(Displayable, RectText);

/**
 * @class zrender.graphic.ZImage 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class ZImage extends Displayable{
    /**
     * @method constructor ZImage
     * @param {Object} options
     */
    constructor(options){
        super(options);
        /**
         * @property {String}
         */
        this.type='image';
    }

    /**
     * @method brush
     * @param {Object} ctx 
     * @param {Element} prevEl 
     */
    brush(ctx, prevEl) {
        let style = this.style;
        let src = style.image;

        // Must bind each time
        style.bind(ctx, this, prevEl);

        let image = this._image = createOrUpdateImage(
            src,
            this._image,
            this,
            this.onload
        );

        if (!image || !isImageReady(image)) {
            return;
        }

        let x = style.x || 0;
        let y = style.y || 0;
        let width = style.width;
        let height = style.height;
        let aspect = image.width / image.height;
        if (width == null && height != null) {
            // Keep image/height ratio
            width = height * aspect;
        }else if (height == null && width != null) {
            height = width / aspect;
        }else if (width == null && height == null) {
            width = image.width;
            height = image.height;
        }

        // 设置transform
        this.setTransform(ctx);

        if (style.sWidth && style.sHeight) {
            let sx = style.sx || 0;
            let sy = style.sy || 0;
            ctx.drawImage(
                image,
                sx, sy, style.sWidth, style.sHeight,
                x, y, width, height
            );
        }else if (style.sx && style.sy) {
            let sx = style.sx;
            let sy = style.sy;
            let sWidth = width - sx;
            let sHeight = height - sy;
            ctx.drawImage(
                image,
                sx, sy, sWidth, sHeight,
                x, y, width, height
            );
        }else {
            ctx.drawImage(image, x, y, width, height);
        }

        // Draw rect text
        if (style.text != null) {
            // Only restore transform when needs draw text.
            this.restoreTransform(ctx);
            this.drawRectText(ctx, this.getBoundingRect());
        }
    }

    /**
     * @method getBoundingRect
     */
    getBoundingRect() {
        let style = this.style;
        if (!this._rect) {
            this._rect = new BoundingRect(
                style.x || 0, style.y || 0, style.width || 0, style.height || 0
            );
        }
        return this._rect;
    }
}

/**
 * @class zrender.canvas.CanvasPainter
 * 这是基于 canvas 接口的 CanvasPainter 类
 * @see 基于 SVG 接口的 CanvasPainter 类在 svg 目录下
 * @see 基于 VML 接口的 CanvasPainter 类在 vml 目录下
 */

let HOVER_LAYER_ZLEVEL = 1e5;
let CANVAS_ZLEVEL = 314159;
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
 * @method createRoot
 * 不会直接在传入的 dom 节点内部创建 canvas 标签，而是再套一层div
 * 目的是加上一些必须的 CSS 样式，方便实现特定的功能。
 * @param {Number} width 
 * @param {Number} height 
 */
function createRoot(width, height) {
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
    this._opts = opts = extend({}, opts || {});
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
    let zlevelList = this._zlevelList = [];

    /**
     * @private
     * @property {Object<String, Layer>} layers
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
     * zrender will do compositing when root is a canvas and have multiple zlevels.
     */
    this._needsManuallyCompositing = false;

    if (!singleCanvas) {
        this._width = this._getSize(0);
        this._height = this._getSize(1);

        let domRoot = this._domRoot = createRoot(
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
        let mainLayer = new Layer(root, this, this.dpr);
        mainLayer.__builtin__ = true;
        mainLayer.initContext();
        // FIXME Use canvas width and height
        // mainLayer.resize(width, height);
        layers[CANVAS_ZLEVEL] = mainLayer;
        mainLayer.zlevel = CANVAS_ZLEVEL;
        // Not use common zlevel.
        zlevelList.push(CANVAS_ZLEVEL);

        this._domRoot = root;
    }

    /**
     * @private
     * @property {Layer} _hoverlayer
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
        let zlevelList = this._zlevelList;
        this._redrawId = Math.random();
        this._paintList(list, paintAll, this._redrawId);

        // Paint custum layers
        for (let i = 0; i < zlevelList.length; i++) {
            let z = zlevelList[i];
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
        let idx = indexOf(hoverElements, elMirror);
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
        sort(hoverElements, this.storage.displayableSortFunc);

        // Use a extream large zlevel
        // FIXME?
        if (!hoverLayer) {
            hoverLayer = this._hoverlayer = this.getLayer(HOVER_LAYER_ZLEVEL);
        }

        let scope = {};
        hoverLayer.ctx.save();
        for (let i = 0; i < len;) {
            let el = hoverElements[i];
            let originalEl = el.__from;
            // Original el is removed
            // PENDING
            if (!(originalEl && originalEl.__zr)) {
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
        return this.getLayer(HOVER_LAYER_ZLEVEL);
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
        let ctx = this.getLayer(CANVAS_ZLEVEL).ctx;
        let width = this._domRoot.width;
        let height = this._domRoot.height;
        ctx.clearRect(0, 0, width, height);
        // PENDING, If only builtin layer?
        this.eachBuiltinLayer(function (layer) {
            if (layer.virtual) {
                ctx.drawImage(layer.dom, 0, 0, width, height);
            }
        });
    },

    /**
     * @method _doPaintList
     */
    _doPaintList: function (list, paintAll) {
        let layerList = [];
        for (let zi = 0; zi < this._zlevelList.length; zi++) {
            let zlevel = this._zlevelList[zi];
            let layer = this._layers[zlevel];
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

            let clearColor = layer.zlevel === this._zlevelList[0]
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

        if (env$1.wxa) {
            // Flush for weixin application
            each(this._layers, function (layer) {
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
     * 获取 zlevel 所在层，如果不存在则会创建一个新的层
     * @param {Number} zlevel
     * @param {Boolean} virtual Virtual layer will not be inserted into dom.
     * @return {Layer}
     */
    getLayer: function (zlevel, virtual) {
        if (this._singleCanvas && !this._needsManuallyCompositing) {
            zlevel = CANVAS_ZLEVEL;
        }
        let layer = this._layers[zlevel];
        if (!layer) {
            // Create a new layer
            layer = new Layer('zr_' + zlevel, this, this.dpr);
            layer.zlevel = zlevel;
            layer.__builtin__ = true;

            if (this._layerConfig[zlevel]) {
                merge(layer, this._layerConfig[zlevel], true);
            }

            if (virtual) {
                layer.virtual = virtual;
            }

            this.insertLayer(zlevel, layer);

            // Context is created after dom inserted to document
            // Or excanvas will get 0px clientWidth and clientHeight
            layer.initContext();
        }

        return layer;
    },

    /**
     * @method insertLayer
     * @param {*} zlevel 
     * @param {*} layer 
     */
    insertLayer: function (zlevel, layer) {
        let layersMap = this._layers;
        let zlevelList = this._zlevelList;
        let len = zlevelList.length;
        let prevLayer = null;
        let i = -1;
        let domRoot = this._domRoot;

        if (layersMap[zlevel]) {
            console.log('ZLevel ' + zlevel + ' has been used already');
            return;
        }
        // Check if is a valid layer
        if (!isLayerValid(layer)) {
            console.log('Layer of zlevel ' + zlevel + ' is not valid');
            return;
        }

        if (len > 0 && zlevel > zlevelList[0]) {
            for (i = 0; i < len - 1; i++) {
                if (
                    zlevelList[i] < zlevel
                    && zlevelList[i + 1] > zlevel
                ) {
                    break;
                }
            }
            prevLayer = layersMap[zlevelList[i]];
        }
        zlevelList.splice(i + 1, 0, zlevel);

        layersMap[zlevel] = layer;

        // Vitual layer will not directly show on the screen.
        // (It can be a WebGL layer and assigned to a ZImage element)
        // But it still under management of zrender.
        if (!layer.virtual) {
            if (prevLayer) {
                let prevDom = prevLayer.dom;
                if (prevDom.nextSibling) {
                    domRoot.insertBefore(
                        layer.dom,
                        prevDom.nextSibling
                    );
                }
                else {
                    domRoot.appendChild(layer.dom);
                }
            }
            else {
                if (domRoot.firstChild) {
                    domRoot.insertBefore(layer.dom, domRoot.firstChild);
                }
                else {
                    domRoot.appendChild(layer.dom);
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
        let zlevelList = this._zlevelList;
        let z;
        let i;
        for (i = 0; i < zlevelList.length; i++) {
            z = zlevelList[i];
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
        let zlevelList = this._zlevelList;
        let layer;
        let z;
        let i;
        for (i = 0; i < zlevelList.length; i++) {
            z = zlevelList[i];
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
        let zlevelList = this._zlevelList;
        let layer;
        let z;
        let i;
        for (i = 0; i < zlevelList.length; i++) {
            z = zlevelList[i];
            layer = this._layers[z];
            if (!layer.__builtin__) {
                cb.call(context, layer, z);
            }
        }
    },

    /**
     * @method getLayers
     * 获取所有已创建的层
     * @param {Array<Layer>} [prevLayer]
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
                if (el.zlevel !== list[i - 1].zlevel || el.incremental) {
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
            let zlevel = el.zlevel;
            let layer;
            // PENDING If change one incremental element style ?
            // TODO Where there are non-incremental elements between incremental elements.
            if (el.incremental) {
                layer = this.getLayer(zlevel + INCREMENTAL_INC, this._needsManuallyCompositing);
                layer.incremental = true;
                incrementalLayerCount = 1;
            }
            else {
                layer = this.getLayer(
                    zlevel + (incrementalLayerCount > 0 ? EL_AFTER_INCREMENTAL_INC : 0),
                    this._needsManuallyCompositing
                );
            }

            if (!layer.__builtin__) {
                console.log('ZLevel ' + zlevel + ' has been used by unkown layer ' + layer.id);
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
     * @param {String} zlevel
     * @param {Object} [config] 配置对象
     * @param {String} [config.clearColor=0] 每次清空画布的颜色
     * @param {String} [config.motionBlur=false] 是否开启动态模糊
     * @param {Number} [config.lastFrameAlpha=0.7] 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */
    configLayer: function (zlevel, config) {
        if (config) {
            let layerConfig = this._layerConfig;
            if (!layerConfig[zlevel]) {
                layerConfig[zlevel] = config;
            }
            else {
                merge(layerConfig[zlevel], config, true);
            }

            for (let i = 0; i < this._zlevelList.length; i++) {
                let _zlevel = this._zlevelList[i];
                if (_zlevel === zlevel || _zlevel === zlevel + EL_AFTER_INCREMENTAL_INC) {
                    let layer = this._layers[_zlevel];
                    merge(layer, layerConfig[zlevel], true);
                }
            }
        }
    },

    /**
     * @method delLayer
     * 删除指定层
     * @param {Number} zlevel 层所在的zlevel
     */
    delLayer: function (zlevel) {
        let layers = this._layers;
        let zlevelList = this._zlevelList;
        let layer = layers[zlevel];
        if (!layer) {
            return;
        }
        layer.dom.parentNode.removeChild(layer.dom);
        delete layers[zlevel];

        zlevelList.splice(indexOf(zlevelList, zlevel), 1);
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

            this.getLayer(CANVAS_ZLEVEL).resize(width, height);
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
                each(this._progressiveLayers, function (layer) {
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
     * @param {Number} zlevel
     */
    clearLayer: function (zlevel) {
        let layer = this._layers[zlevel];
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
            return this._layers[CANVAS_ZLEVEL].dom;
        }

        let imageLayer = new Layer('image', this, opts.pixelRatio || this.dpr);
        imageLayer.initContext();
        imageLayer.clear(false, opts.backgroundColor || this._backgroundColor);

        if (opts.pixelRatio <= this.dpr) {
            this.refresh();

            let width = imageLayer.dom.width;
            let height = imageLayer.dom.height;
            let ctx = imageLayer.ctx;
            this.eachLayer(function (layer) {
                if (layer.__builtin__) {
                    ctx.drawImage(layer.dom, 0, 0, width, height);
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
            (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh]))
            - (parseInt10(stl[plt]) || 0)
            - (parseInt10(stl[prb]) || 0)
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

        let leftMargin = Math.max(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
        let rightMargin = Math.max(lineWidth / 2, shadowOffsetX + shadowBlurSize);
        let topMargin = Math.max(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
        let bottomMargin = Math.max(lineWidth / 2, shadowOffsetY + shadowBlurSize);
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

        let ImageShape = ZImage;
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

/**
 * @singleton
 * @class zrender.animation.GlobalAnimationMgr
 * 
 * Animation manager, global singleton, controls all the animation process.
 * Each ZRender instance has a GlobalAnimationMgr instance. GlobalAnimationMgr 
 * is designed to manage all the AnimationProcesses inside a zrender instance.
 * 
 * 动画管理器，全局单例，控制和调度所有动画过程。每个 zrender 实例中会持有一个 
 * GlobalAnimationMgr 实例。GlobalAnimationMgr 会管理 zrender 实例中的所有
 * AnimationProcess。
 * 
 * @author pissang(https://github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
// TODO Additive animation
// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
// https://developer.apple.com/videos/wwdc2014/#236

class GlobalAnimationMgr{
    /**
     * @method constructor GlobalAnimationMgr
     * @param {Object} [options]
     */
    constructor(options){
        options = options || {};
        this._animationProcessList=[];
        this._running = false;
        this._timestamp;
        this._pausedTime;//ms
        this._pauseStart;
        this._paused = false;
        Eventful.call(this);
    }

    /**
     * @method addAnimationProcess
     * 添加 animationProcess
     * @param {zrender.animation.GlobalAnimationMgr} animationProcess
     */
    addAnimationProcess(animationProcess) {
        this._animationProcessList.push(animationProcess);
    }

    /**
     * @method removeAnimationProcess
     * 删除动画片段
     * @param {zrender.animation.GlobalAnimationMgr} animationProcess
     */
    removeAnimationProcess(animationProcess) {
        let index=this._animationProcessList.findIndex(animationProcess);
        if(index>=0){
            this._animationProcessList.splice(index,1);
        }
    }

    /**
     * @private
     * @method _update
     */
    _update() {
        let time = new Date().getTime() - this._pausedTime;
        let delta = time - this._timestamp;

        this._animationProcessList.forEach((ap,index)=>{
            ap.nextFrame(time,delta);
        });

        this._timestamp = time;

        // TODO:What's going on here?
        // 'frame' should be triggered before stage, because upper application
        // depends on the sequence (e.g., echarts-stream and finish
        // event judge)
        this.trigger('frame', delta);
    }

    /**
     * @private
     * @method _startLoop
     * TODO:需要确认在大量节点下的动画性能问题，比如 100 万个元素同时进行动画
     * 这里开始利用requestAnimationFrame递归执行
     * 如果这里的 _update() 不能在16ms的时间内完成一轮动画，就会出现明显的卡顿。
     * 按照 W3C 的推荐标准 60fps，这里的 step 函数大约每隔 16ms 被调用一次
     * @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     */
    _startLoop() {
        let self = this;
        this._running = true;
        function nextFrame() {
            if (self._running) {
                requestAnimationFrame(nextFrame);
                !self._paused && self._update();
            }
        }
        requestAnimationFrame(nextFrame);
    }

    /**
     * @method start
     * Start all the animations.
     */
    start() {
        this._timestamp = new Date().getTime();
        this._pausedTime = 0;
        this._startLoop();
    }

    /**
     * @method stop
     * Stop all the animations.
     */
    stop() {
        this._running = false;
    }

    /**
     * @method pause
     * Pause all the animations.
     */
    pause() {
        if (!this._paused) {
            this._pauseStart = new Date().getTime();
            this._paused = true;
        }
    }

    /**
     * @method resume
     * Resume all the animations.
     */
    resume() {
        if (this._paused) {
            this._pausedTime += (new Date().getTime()) - this._pauseStart;
            this._paused = false;
        }
    }

    /**
     * @method clear
     * Clear all the animations.
     */
    clear() {
        this._animationProcessList.length=0;
    }

    /**
     * @method isFinished
     * Whether all the animations have finished.
     */
    isFinished(){
        let finished=true;
        this._animationProcessList.forEach((animationProcess,index)=>{
            if(!animationProcess.isFinished()){
                finished=false;
            }
        });
        return finished;
    }
}

mixin(GlobalAnimationMgr, Eventful);

/**
 * @class zrender.event.DomEventProxy
 * DomEventProxy 的主要功能是：把原生的 DOM 事件代理（转发）到 ZRender 实例上，
 * 在 ZRenderEventHandler 类中会把事件进一步分发给 canvas 中绘制的元素。
 * 需要转发的大部分 DOM 事件挂载在 canvas 的外层容器 div 上面，例如：click, dbclick ；
 * 少部分 DOM 事件挂载在 document 对象上，例如：mousemove, mouseout。因为在实现拖拽和
 * 键盘交互的过程中，鼠标指针可能已经脱离了 canvas 所在的区域。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

let TOUCH_CLICK_DELAY = 300;
// "page event" is defined in the comment of `[Page Event]`.
let pageEventSupported = env$1.domSupported;

/**
 * [Page Event]
 * "page events" are `pagemousemove` and `pagemouseup`.
 * They are triggered when a user pointer interacts on the whole webpage
 * rather than only inside the zrender area.
 *
 * The use case of page events can be, for example, if we are implementing a dragging feature:
 * ```js
 * zr.on('mousedown', function (event) {
 *     let dragging = true;
 *
 *     // Listen to `pagemousemove` and `pagemouseup` rather than `mousemove` and `mouseup`,
 *     // because `mousemove` and `mouseup` will not be triggered when the pointer is out
 *     // of the zrender area.
 *     zr.on('pagemousemove', handleMouseMove);
 *     zr.on('pagemouseup', handleMouseUp);
 *
 *     function handleMouseMove(event) {
 *         if (dragging) { ... }
 *     }
 *     function handleMouseUp(event) {
 *         dragging = false; ...
 *         zr.off('pagemousemove', handleMouseMove);
 *         zr.off('pagemouseup', handleMouseUp);
 *     }
 * });
 * ```
 *
 * [NOTICE]:
 * (1) There are cases that `pagemousexxx` will not be triggered when the pointer is out of
 * zrender area:
 * "document.eventUtil.addEventListener" is not available in the current runtime environment,
 * or there is any `stopPropagation` called at some user defined listeners on the ancestors
 * of the zrender dom.
 * (2) Although those bad cases exist, users do not need to worry about that. That is, if you
 * listen to `pagemousexxx`, you do not need to listen to the correspoinding event `mousexxx`
 * any more.
 * Becuase inside zrender area, `pagemousexxx` will always be triggered, where they are
 * triggered just after `mousexxx` triggered and sharing the same event object. Those bad
 * cases only happen when the pointer is out of zrender area.
 */
let localNativeListenerNames = (function () {
    let mouseHandlerNames = [
        'click', 'dblclick', 'mousewheel', 'mouseout',
        'mouseup', 'mousedown', 'mousemove', 'contextmenu'
    ];
    let touchHandlerNames = [
        'touchstart', 'touchend', 'touchmove'
    ];
    let pointerEventNameMap = {
        pointerdown: 1, pointerup: 1, pointermove: 1, pointerout: 1
    };
    let pointerHandlerNames = map(mouseHandlerNames, function (name) {
        let nm = name.replace('mouse', 'pointer');
        return pointerEventNameMap.hasOwnProperty(nm) ? nm : name;
    });

    return {
        mouse: mouseHandlerNames,
        touch: touchHandlerNames,
        pointer: pointerHandlerNames
    };
})();

let globalNativeListenerNames = {
    keyboard:['keydown','keyup'],
    mouse: ['mousemove', 'mouseup'],
    touch: ['touchmove', 'touchend'],
    pointer: ['pointermove', 'pointerup']
};

function eventNameFix(name) {
    return (name === 'mousewheel' && env$1.browser.firefox) ? 'DOMMouseScroll' : name;
}

function isPointerFromTouch(event) {
    let pointerType = event.pointerType;
    return pointerType === 'pen' || pointerType === 'touch';
}

/**
 * Prevent mouse event from being dispatched after Touch Events action
 * @see <https://github.com/deltakosh/handjs/blob/master/src/hand.base.js>
 * 1. Mobile browsers dispatch mouse events 300ms after touchend.
 * 2. Chrome for Android dispatch mousedown for long-touch about 650ms
 * Result: Blocking Mouse Events for 700ms.
 *
 * @param {DOMHandlerScope} scope
 */
function setTouchTimer(scope) {
    scope.touching = true;
    if (scope.touchTimer != null) {
        clearTimeout(scope.touchTimer);
        scope.touchTimer = null;
    }
    scope.touchTimer = setTimeout(function () {
        scope.touching = false;
        scope.touchTimer = null;
    }, 700);
}

function markTriggeredFromLocal(event) {
    event && (event.zrIsFromLocal = true);
}

function isTriggeredFromLocal(event) {
    return !!(event && event.zrIsFromLocal);
}

// Mark touch, which is useful in distinguish touch and
// mouse event in upper applicatoin.
function markTouch(event) {
    event && (event.zrByTouch = true);
}


// ----------------------------
// Native event handlers BEGIN
// ----------------------------

/**
 * Local 指的是 Canvas 内部的区域。
 * Local DOM Handlers
 * @this {DomEventProxy}
 */
let localDOMHandlers = {

    mouseout: function (event) {
        event = normalizeEvent(this.dom, event);

        let element = event.toElement || event.relatedTarget;
        if (element !== this.dom) {
            while (element && element.nodeType !== 9) {
                // 忽略包含在root中的dom引起的mouseOut
                if (element === this.dom) {
                    return;
                }

                element = element.parentNode;
            }
        }

        // 这里的 trigger() 方法是从 Eventful 里面的 mixin 进来的，调用这个 trigger() 方法的时候，是在 ZRender 内部，也就是 canvas 里面触发事件。
        // 这里实现的目的是：把接受到的 HTML 事件转发到了 canvas 内部。
        this.trigger('mouseout', event);
    },

    touchstart: function (event) {
        // Default mouse behaviour should not be disabled here.
        // For example, page may needs to be slided.
        event = normalizeEvent(this.dom, event);

        markTouch(event);

        this._lastTouchMoment = new Date();

        this.handler.processGesture(event, 'start');

        // For consistent event listener for both touch device and mouse device,
        // we simulate "mouseover-->mousedown" in touch device. So we trigger
        // `mousemove` here (to trigger `mouseover` inside), and then trigger
        // `mousedown`.
        localDOMHandlers.mousemove.call(this, event);
        localDOMHandlers.mousedown.call(this, event);
    },

    touchmove: function (event) {
        event = normalizeEvent(this.dom, event);

        markTouch(event);

        this.handler.processGesture(event, 'change');

        // Mouse move should always be triggered no matter whether
        // there is gestrue event, because mouse move and pinch may
        // be used at the same time.
        localDOMHandlers.mousemove.call(this, event);
    },

    touchend: function (event) {
        event = normalizeEvent(this.dom, event);

        markTouch(event);

        this.handler.processGesture(event, 'end');

        localDOMHandlers.mouseup.call(this, event);

        // Do not trigger `mouseout` here, in spite of `mousemove`(`mouseover`) is
        // triggered in `touchstart`. This seems to be illogical, but by this mechanism,
        // we can conveniently implement "hover style" in both PC and touch device just
        // by listening to `mouseover` to add "hover style" and listening to `mouseout`
        // to remove "hover style" on an element, without any additional code for
        // compatibility. (`mouseout` will not be triggered in `touchend`, so "hover
        // style" will remain for user view)

        // click event should always be triggered no matter whether
        // there is gestrue event. System click can not be prevented.
        if (+new Date() - this._lastTouchMoment < TOUCH_CLICK_DELAY) {
            localDOMHandlers.click.call(this, event);
        }
    },

    pointerdown: function (event) {
        localDOMHandlers.mousedown.call(this, event);

        // if (useMSGuesture(this, event)) {
        //     this._msGesture.addPointer(event.pointerId);
        // }
    },

    pointermove: function (event) {
        // FIXME
        // pointermove is so sensitive that it always triggered when
        // tap(click) on touch screen, which affect some judgement in
        // upper application. So, we dont support mousemove on MS touch
        // device yet.
        if (!isPointerFromTouch(event)) {
            localDOMHandlers.mousemove.call(this, event);
        }
    },

    pointerup: function (event) {
        localDOMHandlers.mouseup.call(this, event);
    },

    pointerout: function (event) {
        // pointerout will be triggered when tap on touch screen
        // (IE11+/Edge on MS Surface) after click event triggered,
        // which is inconsistent with the mousout behavior we defined
        // in touchend. So we unify them.
        // (check localDOMHandlers.touchend for detailed explanation)
        if (!isPointerFromTouch(event)) {
            localDOMHandlers.mouseout.call(this, event);
        }
    }

};

/**
 * Othere DOM UI Event handlers for zr dom.
 * ZRender 内部的 DOM 结构默认支持以下7个事件。
 * @this {DomEventProxy}
 */
each(['click', 'mousemove', 'mousedown', 
    'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
    localDOMHandlers[name] = function (event) {
        event = normalizeEvent(this.dom, event);
        this.trigger(name, event);

        if (name === 'mousemove' || name === 'mouseup') {
            // Trigger `pagemousexxx` immediately with the same event object.
            // See the reason described in the comment of `[Page Event]`.
            this.trigger('page' + name, event);
        }
    };
});

/**
 * 这里用来监听外层 HTML 里面的 DOM 事件。监听这些事件的目的是为了方便实现拖拽功能，因为
 * 一旦鼠标离开 Canvas 的区域，就无法触发 Canvas 内部的 mousemove 和 mouseup 事件，这里直接
 * 监听外层 HTML 上的 mousemove 和 mouseup，绕开这种问题。
 * 
 * Page DOM UI Event handlers for global page.
 * @this {DomEventProxy}
 */
let globalDOMHandlers = {

    touchmove: function (event) {
        markTouch(event);
        globalDOMHandlers.mousemove.call(this, event);
    },

    touchend: function (event) {
        markTouch(event);
        globalDOMHandlers.mouseup.call(this, event);
    },

    pointermove: function (event) {
        // FIXME
        // pointermove is so sensitive that it always triggered when
        // tap(click) on touch screen, which affect some judgement in
        // upper application. So, we dont support mousemove on MS touch
        // device yet.
        if (!isPointerFromTouch(event)) {
            globalDOMHandlers.mousemove.call(this, event);
        }
    },

    pointerup: function (event) {
        globalDOMHandlers.mouseup.call(this, event);
    },

    mousemove: function (event) {
        event = normalizeEvent(this.dom, event, true);
        this.trigger('pagemousemove', event);
    },

    mouseup: function (event) {
        event = normalizeEvent(this.dom, event, true);
        this.trigger('pagemouseup', event);
    },

    keyup: function (event) {
        event = normalizeEvent(this.dom, event, true);
        this.trigger('pagekeyup', event);
    },

    keydown: function (event) {
        event = normalizeEvent(this.dom, event, true);
        this.trigger('pagekeydown', event);
    }
};

// ----------------------------
// Native event handlers END
// ----------------------------


/**
 * @private
 * @method mountDOMEventListeners
 * @param {DomEventProxy} domEventProxy
 * @param {DOMHandlerScope} domHandlerScope
 * @param {Object} nativeListenerNames {mouse: Array<String>, touch: Array<String>, poiner: Array<String>}
 * @param {Boolean} localOrGlobal `true`: target local, `false`: target global.
 */
function mountDOMEventListeners(instance, scope, nativeListenerNames, localOrGlobal) {
    let domHandlers = scope.domHandlers;
    let domTarget = scope.domTarget;

    if (env$1.pointerEventsSupported) { // Only IE11+/Edge
        // 1. On devices that both enable touch and mouse (e.g., MS Surface and lenovo X240),
        // IE11+/Edge do not trigger touch event, but trigger pointer event and mouse event
        // at the same time.
        // 2. On MS Surface, it probablely only trigger mousedown but no mouseup when tap on
        // screen, which do not occurs in pointer event.
        // So we use pointer event to both detect touch gesture and mouse behavior.
        each(nativeListenerNames.pointer, function (nativeEventName) {
            mountSingle(nativeEventName, function (event) {
                if (localOrGlobal || !isTriggeredFromLocal(event)) {
                    localOrGlobal && markTriggeredFromLocal(event);
                    domHandlers[nativeEventName].call(instance, event);
                }
            });
        });

        // FIXME
        // Note: MS Gesture require CSS touch-action set. But touch-action is not reliable,
        // which does not prevent defuault behavior occasionally (which may cause view port
        // zoomed in but use can not zoom it back). And event.preventDefault() does not work.
        // So we have to not to use MSGesture and not to support touchmove and pinch on MS
        // touch screen. And we only support click behavior on MS touch screen now.

        // MS Gesture Event is only supported on IE11+/Edge and on Windows 8+.
        // We dont support touch on IE on win7.
        // See <https://msdn.microsoft.com/en-us/library/dn433243(v=vs.85).aspx>
        // if (typeof MSGesture === 'function') {
        //     (this._msGesture = new MSGesture()).target = dom; // jshint ignore:line
        //     dom.eventUtil.addEventListener('MSGestureChange', onMSGestureChange);
        // }
    }else {
        if (env$1.touchEventsSupported) {
            each(nativeListenerNames.touch, function (nativeEventName) {
                mountSingle(nativeEventName, function (event) {
                    if (localOrGlobal || !isTriggeredFromLocal(event)) {
                        localOrGlobal && markTriggeredFromLocal(event);
                        domHandlers[nativeEventName].call(instance, event);
                        setTouchTimer(scope);
                    }
                });
            });
            // Handler of 'mouseout' event is needed in touch mode, which will be mounted below.
            // eventUtil.addEventListener(root, 'mouseout', this._mouseoutHandler);
        }

        // 1. Considering some devices that both enable touch and mouse event (like on MS Surface
        // and lenovo X240, @see #2350), we make mouse event be always listened, otherwise
        // mouse event can not be handle in those devices.
        // 2. On MS Surface, Chrome will trigger both touch event and mouse event. How to prevent
        // mouseevent after touch event triggered, see `setTouchTimer`.
        each(nativeListenerNames.mouse, function (nativeEventName) {
            mountSingle(nativeEventName, function (event) {
                event = getNativeEvent(event);
                if (!scope.touching
                    && (localOrGlobal || !isTriggeredFromLocal(event))
                ) {
                    localOrGlobal && markTriggeredFromLocal(event);
                    domHandlers[nativeEventName].call(instance, event);
                }
            });
        });

        //挂载键盘事件
        each(nativeListenerNames.keyboard,function(nativeEventName){
            mountSingle(nativeEventName, function (event) {
                if (localOrGlobal || !isTriggeredFromLocal(event)) {
                    localOrGlobal && markTriggeredFromLocal(event);
                    domHandlers[nativeEventName].call(instance, event);
                }
            });
        });
    }

    //用来监听原生 DOM 事件
    function mountSingle(nativeEventName, listener) {
        scope.mounted[nativeEventName] = listener;
        addEventListener(domTarget, eventNameFix(nativeEventName), listener);
    }
}

/**
 * @private
 * @method unmountDOMEventListeners
 * @param {Object} scope 
 */
function unmountDOMEventListeners(scope) {
    let mounted = scope.mounted;
    for (let nativeEventName in mounted) {
        if (mounted.hasOwnProperty(nativeEventName)) {
            removeEventListener(scope.domTarget, eventNameFix(nativeEventName), mounted[nativeEventName]);
        }
    }
    scope.mounted = {};
}

function DOMHandlerScope(domTarget, domHandlers) {
    this.domTarget = domTarget;
    this.domHandlers = domHandlers;

    // Key: eventName
    // value: mounted handler funcitons.
    // Used for unmount.
    this.mounted = {};
    this.touchTimer = null;
    this.touching = false;
}

/**
 * @method constructor
 * @param dom 被代理的 DOM 节点
 */
function DomEventProxy(dom) {
    Eventful.call(this);

    /**
     * @property dom
     */
    this.dom = dom;

    /**
     * @private
     * @property _localHandlerScope
     */
    this._localHandlerScope = new DOMHandlerScope(dom, localDOMHandlers);

    if (pageEventSupported) {
        /**
         * @private
         * @property _globalHandlerScope
         */
        this._globalHandlerScope = new DOMHandlerScope(document, globalDOMHandlers);//注意，这里直接监听 document 上的事件
    }

    /**
     * @private
     * @property _pageEventEnabled
     */
    this._pageEventEnabled = false;

    //在构造 DomEventProxy 实例的时候，挂载 DOM 事件监听器。
    mountDOMEventListeners(this, this._localHandlerScope, localNativeListenerNames, true);
}

/**
 * @private
 * @method dispose
 */
DomEventProxy.prototype.dispose = function () {
    unmountDOMEventListeners(this._localHandlerScope);
    if (pageEventSupported) {
        unmountDOMEventListeners(this._globalHandlerScope);
    }
};

/**
 * @private
 * @method setCursor
 */
DomEventProxy.prototype.setCursor = function (cursorStyle) {
    this.dom.style && (this.dom.style.cursor = cursorStyle || 'default');
};

/**
 * @private
 * @method togglePageEvent
 * The implementation of page event depends on listening to document.
 * So we should better only listen to that on needed, and remove the
 * listeners when do not need them to escape unexpected side-effect.
 * @param {Boolean} enableOrDisable `true`: enable page event. `false`: disable page event.
 */
DomEventProxy.prototype.togglePageEvent = function (enableOrDisable) {
    assert(enableOrDisable != null);

    if (pageEventSupported && (this._pageEventEnabled ^ enableOrDisable)) {
        this._pageEventEnabled = enableOrDisable;

        let globalHandlerScope = this._globalHandlerScope;
        enableOrDisable
            ? mountDOMEventListeners(this, globalHandlerScope, globalNativeListenerNames)
            : unmountDOMEventListeners(globalHandlerScope);
    }
};

//注意，DomEventProxy 也混入了 Eventful 里面提供的事件处理工具。
mixin(DomEventProxy, Eventful);

/**
 * @class zrender.core.ZRender
 * ZRender, a high performance 2d drawing library.
 * Class ZRender is the global entry, every time you call zrender.init() will 
 * create an instance of ZRender class, each instance has an unique id.
 * 
 * ZRender 是一款高性能的 2d 渲染引擎。
 * ZRender 类是全局入口，每次调用 zrender.init() 会创建一个实例，
 * 每个 ZRender 实例有自己唯一的 ID。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

if(!env$1.canvasSupported){
    throw new Error("Need Canvas Environment.");
}

let useVML = !env$1.canvasSupported;

let painterMap = {
    canvas: CanvasPainter
};

// ZRender实例map索引，浏览器中同一个 window 下的 ZRender 实例都存在这里。
let instances = {};

/**
 * @property {String}
 */
let version = '4.1.2';

/**
 * @method zrender.init()
 * Global entry for creating a zrender instance.
 * 
 * 全局总入口，创建 ZRender 的实例。
 * 
 * @param {HTMLElement} dom
 * @param {Object} [opts]
 * @param {String} [opts.renderer='canvas'] 'canvas' or 'svg'
 * @param {Number} [opts.devicePixelRatio]
 * @param {Number|String} [opts.width] Can be 'auto' (the same as null/undefined)
 * @param {Number|String} [opts.height] Can be 'auto' (the same as null/undefined)
 * @return {ZRender}
 */
function init(dom, opts) {
    let zr = new ZRender(guid(), dom, opts);
    instances[zr.id] = zr;
    return zr;
}

/**
 * TODO: 不要export这个全局函数看起来也没有问题。
 * Dispose zrender instance
 * @param {module:zrender/ZRender} zr
 */
function dispose(zr) {
    if (zr) {
        zr.dispose();
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
 * Get zrender instance by id
 * @param {String} id zrender instance id
 * @return {module:zrender/ZRender}
 */
function getInstance(id) {
    return instances[id];
}

function registerPainter(name, PainterClass) {
    painterMap[name] = PainterClass;
}

/**
 * @method constructor ZRender
 * @param {String} id
 * @param {HTMLElement} dom
 * @param {Object} [opts]
 * @param {String} [opts.renderer='canvas'] 'canvas' or 'svg'
 * @param {Number} [opts.devicePixelRatio]
 * @param {Number} [opts.width] Can be 'auto' (the same as null/undefined)
 * @param {Number} [opts.height] Can be 'auto' (the same as null/undefined)
 * @return {ZRender}
 */
let ZRender = function (id, dom, opts) {

    opts = opts || {};

    /**
     * @property {HTMLDomElement}
     */
    this.dom = dom;

    /**
     * @property {String}
     */
    this.id = id;

    let self = this;

    /**
     * @property {Storage}
     */
    let storage = new Storage();

    let rendererType = opts.renderer;
    // TODO WebGL
    // TODO: remove vml
    if (useVML) {
        if (!painterMap.vml) {
            throw new Error('You need to require \'zrender/vml/vml\' to support IE8');
        }
        rendererType = 'vml';
    }else if (!rendererType || !painterMap[rendererType]) {
        rendererType = 'canvas';
    }
    let painter = new painterMap[rendererType](dom, storage, opts, id);

    this.storage = storage;
    this.painter = painter;

    //把DOM事件代理出来
    let handerProxy = (!env$1.node && !env$1.worker) ? new DomEventProxy(painter.getViewportRoot()) : null;
    //ZRender 自己封装的事件机制
    this.eventHandler = new ZRenderEventHandler(storage, painter, handerProxy, painter.root);

    /**
     * @property {GlobalAnimationMgr}
     * 利用 GlobalAnimationMgr 动画的 frame 事件渲染下一张画面，ZRender 依赖此机制来刷新 canvas 画布。
     * FROM MDN：
     * The window.requestAnimationFrame() method tells the browser that you wish 
     * to perform an animation and requests that the browser calls a specified 
     * function to update an animation before the next repaint. The method takes 
     * a callback as an argument to be invoked before the repaint.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     * 
     * NOTE: 这里有潜在的性能限制，由于 requestAnimationFrame 方法每秒回调60次，每次执行时间约 16ms
     * 如果在 16ms 的时间内无法渲染完一帧画面，会出现卡顿。也就是说，ZRender 引擎在同一张 canvas 上
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
    let oldDelFromStorage = storage.delFromStorage;
    let oldAddToStorage = storage.addToStorage;

    storage.delFromStorage = function (el) {
        oldDelFromStorage.call(storage, el);
        el && el.removeSelfFromZr(self);
    };

    storage.addToStorage = function (el) {
        oldAddToStorage.call(storage, el);
        el.addSelfToZr(self);
    };
};

ZRender.prototype = {

    constructor: ZRender,
    /**
     * @method
     * 获取实例唯一标识
     * @return {String}
     */
    getId: function () {
        return this.id;
    },

    /**
     * @method
     * 添加元素
     * @param  {zrender/Element} el
     */
    add: function (el) {
        this.storage.addRoot(el);
        this._needsRefresh = true;
    },

    /**
     * @method
     * 删除元素
     * @param  {zrender/Element} el
     */
    remove: function (el) {
        this.storage.delRoot(el);
        this._needsRefresh = true;
    },

    /**
     * @private
     * @method
     * Change configuration of layer
     * @param {String} zLevel
     * @param {Object} [config]
     * @param {String} [config.clearColor=0] Clear color
     * @param {String} [config.motionBlur=false] If enable motion blur
     * @param {Number} [config.lastFrameAlpha=0.7] Motion blur factor. Larger value cause longer trailer
    */
    configLayer: function (zLevel, config) {
        if (this.painter.configLayer) {
            this.painter.configLayer(zLevel, config);
        }
        this._needsRefresh = true;
    },

    /**
     * @method
     * Set background color
     * @param {String} backgroundColor
     */
    setBackgroundColor: function (backgroundColor) {
        if (this.painter.setBackgroundColor) {
            this.painter.setBackgroundColor(backgroundColor);
        }
        this._needsRefresh = true;
    },

    /**
     * @private
     * @method
     * Repaint the canvas immediately
     */
    refreshImmediately: function () {
        // let start = new Date();
        // Clear needsRefresh ahead to avoid something wrong happens in refresh
        // Or it will cause zrender refreshes again and again.
        this._needsRefresh = this._needsRefreshHover = false;
        this.painter.refresh();
        // Avoid trigger zr.refresh in Element#beforeUpdate hook
        this._needsRefresh = this._needsRefreshHover = false;

        // let end = new Date();
        // let log = document.getElementById('log');
        // if (log) {
        //     log.innerHTML = log.innerHTML + '<br>' + (end - start);
        // }
    },

    /**
     * @method
     * Mark and repaint the canvas in the next frame of browser
     */
    refresh: function () {
        this._needsRefresh = true;
    },

    /**
     * @private
     * @method
     * Perform all refresh
     * 刷新 canvas 画面，此方法会在 window.requestAnimationFrame 方法中被不断调用。
     */
    flush: function () {
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
    },

    /**
     * @private
     * @method
     * 与 Hover 相关的6个方法用来处理浮动层，当鼠标悬停在 canvas 中的元素上方时，可能会需要
     * 显示一些浮动的层来展现一些特殊的数据。
     * TODO:这里可能有点问题，Hover 一词可能指的是遮罩层，而不是浮动层，如果确认是遮罩，考虑
     * 把这里的 API 单词重构成 Mask。
     * 
     * Add element to hover layer
     * @param  {module:zrender/Element} el
     * @param {Object} style
     */
    addHover: function (el, style) {
        if (this.painter.addHover) {
            let elMirror = this.painter.addHover(el, style);
            this.refreshHover();
            return elMirror;
        }
    },

    /**
     * @private
     * @method
     * Remove element from hover layer
     * @param  {module:zrender/Element} el
     */
    removeHover: function (el) {
        if (this.painter.removeHover) {
            this.painter.removeHover(el);
            this.refreshHover();
        }
    },

    /**
     * @private
     * @method
     * Find hovered element
     * @param {Number} x
     * @param {Number} y
     * @return {Object} {target, topTarget}
     */
    findHover: function (x, y) {
        return this.eventHandler.findHover(x, y);
    },

    /**
     * @private
     * @method
     * Clear all hover elements in hover layer
     * @param  {module:zrender/Element} el
     */
    clearHover: function () {
        if (this.painter.clearHover) {
            this.painter.clearHover();
            this.refreshHover();
        }
    },

    /**
     * @private
     * @method
     * Refresh hover in next frame
     */
    refreshHover: function () {
        this._needsRefreshHover = true;
    },

    /**
     * @private
     * @method
     * Refresh hover immediately
     */
    refreshHoverImmediately: function () {
        this._needsRefreshHover = false;
        this.painter.refreshHover && this.painter.refreshHover();
    },

    /**
     * @method
     * Resize the canvas.
     * Should be invoked when container size is changed
     * @param {Object} [opts]
     * @param {Number|String} [opts.width] Can be 'auto' (the same as null/undefined)
     * @param {Number|String} [opts.height] Can be 'auto' (the same as null/undefined)
     */
    resize: function (opts) {
        opts = opts || {};
        this.painter.resize(opts.width, opts.height);
        this.eventHandler.resize();
    },

    /**
     * @method
     * Stop and clear all animation immediately
     */
    clearAnimation: function () {
        this.globalAnimationMgr.clear();
    },

    /**
     * @method
     * Get container width
     */
    getWidth: function () {
        return this.painter.getWidth();
    },

    /**
     * @method
     * Get container height
     */
    getHeight: function () {
        return this.painter.getHeight();
    },

    /**
     * @method
     * Converting a path to image.
     * It has much better performance of drawing image rather than drawing a vector path.
     * @param {module:zrender/graphic/Path} e
     * @param {Number} width
     * @param {Number} height
     */
    pathToImage: function (e, dpr) {
        return this.painter.pathToImage(e, dpr);
    },

    /**
     * @method
     * Set default cursor
     * @param {String} [cursorStyle='default'] 例如 crosshair
     */
    setCursorStyle: function (cursorStyle) {
        this.eventHandler.setCursorStyle(cursorStyle);
    },

    /**
     * @method
     * Bind event
     *
     * @param {String} eventName Event name
     * @param {Function} eventHandler Handler function
     * @param {Object} [context] Context object
     */
    on: function (eventName, eventHandler, context) {
        this.eventHandler.on(eventName, eventHandler, context);
    },

    /**
     * @method
     * Unbind event
     * @param {String} eventName Event name
     * @param {Function} [eventHandler] Handler function
     */
    off: function (eventName, eventHandler) {
        this.eventHandler.off(eventName, eventHandler);
    },

    /**
     * @method
     * Trigger event manually
     *
     * @param {String} eventName Event name
     * @param {event=} event Event object
     */
    trigger: function (eventName, event) {
        this.eventHandler.trigger(eventName, event);
    },

    /**
     * @method
     * Clear all objects and the canvas.
     */
    clear: function () {
        this.storage.delRoot();
        this.painter.clear();
    },

    /**
     * @method
     * Dispose self.
     */
    dispose: function () {
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
};

// ---------------------------
// Events of zrender instance.
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

/**
 * 曲线辅助模块
 * @module zrender/core/curveUtil
 * @author pissang(https://www.github.com/pissang)
 */

var mathPow = Math.pow;
var mathSqrt$2 = Math.sqrt;

var EPSILON$1 = 1e-8;
var EPSILON_NUMERIC = 1e-4;

var THREE_SQRT = mathSqrt$2(3);
var ONE_THIRD = 1 / 3;

// 临时变量
var _v0 = create();
var _v1 = create();
var _v2 = create();

function isAroundZero(val) {
    return val > -EPSILON$1 && val < EPSILON$1;
}
function isNotAroundZero$1(val) {
    return val > EPSILON$1 || val < -EPSILON$1;
}
/**
 * 计算三次贝塞尔值
 * @memberOf module:zrender/core/curveUtil
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @return {Number}
 */
function cubicAt(p0, p1, p2, p3, t) {
    var onet = 1 - t;
    return onet * onet * (onet * p0 + 3 * t * p1)
            + t * t * (t * p3 + 3 * onet * p2);
}

/**
 * 计算三次贝塞尔导数值
 * @memberOf module:zrender/core/curveUtil
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @return {Number}
 */
function cubicDerivativeAt(p0, p1, p2, p3, t) {
    var onet = 1 - t;
    return 3 * (
        ((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet
        + (p3 - p2) * t * t
    );
}

/**
 * 计算三次贝塞尔方程根，使用盛金公式
 * @memberOf module:zrender/core/curveUtil
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} val
 * @param  {Array<Number>} roots
 * @return {Number} 有效根数目
 */
function cubicRootAt(p0, p1, p2, p3, val, roots) {
    // Evaluate roots of cubic functions
    var a = p3 + 3 * (p1 - p2) - p0;
    var b = 3 * (p2 - p1 * 2 + p0);
    var c = 3 * (p1 - p0);
    var d = p0 - val;

    var A = b * b - 3 * a * c;
    var B = b * c - 9 * a * d;
    var C = c * c - 3 * b * d;

    var n = 0;

    if (isAroundZero(A) && isAroundZero(B)) {
        if (isAroundZero(b)) {
            roots[0] = 0;
        }
        else {
            var t1 = -c / b;  //t1, t2, t3, b is not zero
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
    }
    else {
        var disc = B * B - 4 * A * C;

        if (isAroundZero(disc)) {
            var K = B / A;
            var t1 = -b / a + K;  // t1, a is not zero
            var t2 = -K / 2;  // t2, t3
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
        }
        else if (disc > 0) {
            var discSqrt = mathSqrt$2(disc);
            var Y1 = A * b + 1.5 * a * (-B + discSqrt);
            var Y2 = A * b + 1.5 * a * (-B - discSqrt);
            if (Y1 < 0) {
                Y1 = -mathPow(-Y1, ONE_THIRD);
            }
            else {
                Y1 = mathPow(Y1, ONE_THIRD);
            }
            if (Y2 < 0) {
                Y2 = -mathPow(-Y2, ONE_THIRD);
            }
            else {
                Y2 = mathPow(Y2, ONE_THIRD);
            }
            var t1 = (-b - (Y1 + Y2)) / (3 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
        else {
            var T = (2 * A * b - 3 * a * B) / (2 * mathSqrt$2(A * A * A));
            var theta = Math.acos(T) / 3;
            var ASqrt = mathSqrt$2(A);
            var tmp = Math.cos(theta);

            var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
            var t2 = (-b + ASqrt * (tmp + THREE_SQRT * Math.sin(theta))) / (3 * a);
            var t3 = (-b + ASqrt * (tmp - THREE_SQRT * Math.sin(theta))) / (3 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
            if (t3 >= 0 && t3 <= 1) {
                roots[n++] = t3;
            }
        }
    }
    return n;
}

/**
 * 计算三次贝塞尔方程极限值的位置
 * @memberOf module:zrender/core/curveUtil
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Array<Number>} extrema
 * @return {Number} 有效数目
 */
function cubicExtrema(p0, p1, p2, p3, extrema) {
    var b = 6 * p2 - 12 * p1 + 6 * p0;
    var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
    var c = 3 * p1 - 3 * p0;

    var n = 0;
    if (isAroundZero(a)) {
        if (isNotAroundZero$1(b)) {
            var t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) {
                extrema[n++] = t1;
            }
        }
    }
    else {
        var disc = b * b - 4 * a * c;
        if (isAroundZero(disc)) {
            extrema[0] = -b / (2 * a);
        }
        else if (disc > 0) {
            var discSqrt = mathSqrt$2(disc);
            var t1 = (-b + discSqrt) / (2 * a);
            var t2 = (-b - discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                extrema[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                extrema[n++] = t2;
            }
        }
    }
    return n;
}

/**
 * 细分三次贝塞尔曲线
 * @memberOf module:zrender/core/curveUtil
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @param  {Array<Number>} out
 */
function cubicSubdivide(p0, p1, p2, p3, t, out) {
    var p01 = (p1 - p0) * t + p0;
    var p12 = (p2 - p1) * t + p1;
    var p23 = (p3 - p2) * t + p2;

    var p012 = (p12 - p01) * t + p01;
    var p123 = (p23 - p12) * t + p12;

    var p0123 = (p123 - p012) * t + p012;
    // Seg0
    out[0] = p0;
    out[1] = p01;
    out[2] = p012;
    out[3] = p0123;
    // Seg1
    out[4] = p0123;
    out[5] = p123;
    out[6] = p23;
    out[7] = p3;
}

/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Number} x
 * @param {Number} y
 * @param {Array<Number>} [out] 投射点
 * @return {Number}
 */
function cubicProjectPoint(
    x0, y0, x1, y1, x2, y2, x3, y3,
    x, y, out
) {
    // http://pomax.github.io/bezierinfo/#projections
    var t;
    var interval = 0.005;
    var d = Infinity;
    var prev;
    var next;
    var d1;
    var d2;

    _v0[0] = x;
    _v0[1] = y;

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (var _t = 0; _t < 1; _t += 0.05) {
        _v1[0] = cubicAt(x0, x1, x2, x3, _t);
        _v1[1] = cubicAt(y0, y1, y2, y3, _t);
        d1 = distSquare(_v0, _v1);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (var i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        prev = t - interval;
        next = t + interval;
        // t - interval
        _v1[0] = cubicAt(x0, x1, x2, x3, prev);
        _v1[1] = cubicAt(y0, y1, y2, y3, prev);

        d1 = distSquare(_v1, _v0);

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2[0] = cubicAt(x0, x1, x2, x3, next);
            _v2[1] = cubicAt(y0, y1, y2, y3, next);
            d2 = distSquare(_v2, _v0);

            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }
    // t
    if (out) {
        out[0] = cubicAt(x0, x1, x2, x3, t);
        out[1] = cubicAt(y0, y1, y2, y3, t);
    }
    // console.log(interval, i);
    return mathSqrt$2(d);
}

/**
 * 计算二次方贝塞尔值
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @return {Number}
 */
function quadraticAt(p0, p1, p2, t) {
    var onet = 1 - t;
    return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
}

/**
 * 计算二次方贝塞尔导数值
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @return {Number}
 */
function quadraticDerivativeAt(p0, p1, p2, t) {
    return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
}

/**
 * 计算二次方贝塞尔方程根
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @param  {Array<Number>} roots
 * @return {Number} 有效根数目
 */
function quadraticRootAt(p0, p1, p2, val, roots) {
    var a = p0 - 2 * p1 + p2;
    var b = 2 * (p1 - p0);
    var c = p0 - val;

    var n = 0;
    if (isAroundZero(a)) {
        if (isNotAroundZero$1(b)) {
            var t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
    }
    else {
        var disc = b * b - 4 * a * c;
        if (isAroundZero(disc)) {
            var t1 = -b / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
        else if (disc > 0) {
            var discSqrt = mathSqrt$2(disc);
            var t1 = (-b + discSqrt) / (2 * a);
            var t2 = (-b - discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
        }
    }
    return n;
}

/**
 * 计算二次贝塞尔方程极限值
 * @memberOf module:zrender/core/curveUtil
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @return {Number}
 */
function quadraticExtremum(p0, p1, p2) {
    var divider = p0 + p2 - 2 * p1;
    if (divider === 0) {
        // p1 is center of p0 and p2
        return 0.5;
    }
    else {
        return (p0 - p1) / divider;
    }
}

/**
 * 细分二次贝塞尔曲线
 * @memberOf module:zrender/core/curveUtil
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @param  {Array<Number>} out
 */
function quadraticSubdivide(p0, p1, p2, t, out) {
    var p01 = (p1 - p0) * t + p0;
    var p12 = (p2 - p1) * t + p1;
    var p012 = (p12 - p01) * t + p01;

    // Seg0
    out[0] = p0;
    out[1] = p01;
    out[2] = p012;

    // Seg1
    out[3] = p012;
    out[4] = p12;
    out[5] = p2;
}

/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x
 * @param {Number} y
 * @param {Array<Number>} out 投射点
 * @return {Number}
 */
function quadraticProjectPoint(
    x0, y0, x1, y1, x2, y2,
    x, y, out
) {
    // http://pomax.github.io/bezierinfo/#projections
    var t;
    var interval = 0.005;
    var d = Infinity;

    _v0[0] = x;
    _v0[1] = y;

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (var _t = 0; _t < 1; _t += 0.05) {
        _v1[0] = quadraticAt(x0, x1, x2, _t);
        _v1[1] = quadraticAt(y0, y1, y2, _t);
        var d1 = distSquare(_v0, _v1);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (var i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        var prev = t - interval;
        var next = t + interval;
        // t - interval
        _v1[0] = quadraticAt(x0, x1, x2, prev);
        _v1[1] = quadraticAt(y0, y1, y2, prev);

        var d1 = distSquare(_v1, _v0);

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2[0] = quadraticAt(x0, x1, x2, next);
            _v2[1] = quadraticAt(y0, y1, y2, next);
            var d2 = distSquare(_v2, _v0);
            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }
    // t
    if (out) {
        out[0] = quadraticAt(x0, x1, x2, t);
        out[1] = quadraticAt(y0, y1, y2, t);
    }
    // console.log(interval, i);
    return mathSqrt$2(d);
}

/**
 * @author Yi Shen(https://github.com/pissang)
 */

var mathMin$3 = Math.min;
var mathMax$3 = Math.max;
var mathSin$3 = Math.sin;
var mathCos$3 = Math.cos;
var PI2$1 = Math.PI * 2;

var start = create();
var end = create();
var extremity = create();

/**
 * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
 * @module zrender/core/bboxUtil
 * @param {Array<Object>} points 顶点数组
 * @param {Number} min
 * @param {Number} max
 */


/**
 * @memberOf module:zrender/core/bboxUtil
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */
function fromLine(x0, y0, x1, y1, min$$1, max$$1) {
    min$$1[0] = mathMin$3(x0, x1);
    min$$1[1] = mathMin$3(y0, y1);
    max$$1[0] = mathMax$3(x0, x1);
    max$$1[1] = mathMax$3(y0, y1);
}

var xDim = [];
var yDim = [];
/**
 * 从三阶贝塞尔曲线(p0, p1, p2, p3)中计算出最小包围盒，写入`min`和`max`中
 * @memberOf module:zrender/core/bboxUtil
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */
function fromCubic(
    x0, y0, x1, y1, x2, y2, x3, y3, min$$1, max$$1
) {
    var cubicExtrema$$1 = cubicExtrema;
    var cubicAt$$1 = cubicAt;
    var i;
    var n = cubicExtrema$$1(x0, x1, x2, x3, xDim);
    min$$1[0] = Infinity;
    min$$1[1] = Infinity;
    max$$1[0] = -Infinity;
    max$$1[1] = -Infinity;

    for (i = 0; i < n; i++) {
        var x = cubicAt$$1(x0, x1, x2, x3, xDim[i]);
        min$$1[0] = mathMin$3(x, min$$1[0]);
        max$$1[0] = mathMax$3(x, max$$1[0]);
    }
    n = cubicExtrema$$1(y0, y1, y2, y3, yDim);
    for (i = 0; i < n; i++) {
        var y = cubicAt$$1(y0, y1, y2, y3, yDim[i]);
        min$$1[1] = mathMin$3(y, min$$1[1]);
        max$$1[1] = mathMax$3(y, max$$1[1]);
    }

    min$$1[0] = mathMin$3(x0, min$$1[0]);
    max$$1[0] = mathMax$3(x0, max$$1[0]);
    min$$1[0] = mathMin$3(x3, min$$1[0]);
    max$$1[0] = mathMax$3(x3, max$$1[0]);

    min$$1[1] = mathMin$3(y0, min$$1[1]);
    max$$1[1] = mathMax$3(y0, max$$1[1]);
    min$$1[1] = mathMin$3(y3, min$$1[1]);
    max$$1[1] = mathMax$3(y3, max$$1[1]);
}

/**
 * 从二阶贝塞尔曲线(p0, p1, p2)中计算出最小包围盒，写入`min`和`max`中
 * @memberOf module:zrender/core/bboxUtil
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */
function fromQuadratic(x0, y0, x1, y1, x2, y2, min$$1, max$$1) {
    var quadraticExtremum$$1 = quadraticExtremum;
    var quadraticAt$$1 = quadraticAt;
    // Find extremities, where derivative in x dim or y dim is zero
    var tx =
        mathMax$3(
            mathMin$3(quadraticExtremum$$1(x0, x1, x2), 1), 0
        );
    var ty =
        mathMax$3(
            mathMin$3(quadraticExtremum$$1(y0, y1, y2), 1), 0
        );

    var x = quadraticAt$$1(x0, x1, x2, tx);
    var y = quadraticAt$$1(y0, y1, y2, ty);

    min$$1[0] = mathMin$3(x0, x2, x);
    min$$1[1] = mathMin$3(y0, y2, y);
    max$$1[0] = mathMax$3(x0, x2, x);
    max$$1[1] = mathMax$3(y0, y2, y);
}

/**
 * 从圆弧中计算出最小包围盒，写入`min`和`max`中
 * @method
 * @memberOf module:zrender/core/bboxUtil
 * @param {Number} x
 * @param {Number} y
 * @param {Number} rx
 * @param {Number} ry
 * @param {Number} startAngle
 * @param {Number} endAngle
 * @param {Number} anticlockwise
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */
function fromArc(
    x, y, rx, ry, startAngle, endAngle, anticlockwise, min$$1, max$$1
) {
    var vec2Min = min;
    var vec2Max = max;

    var diff = Math.abs(startAngle - endAngle);


    if (diff % PI2$1 < 1e-4 && diff > 1e-4) {
        // Is a circle
        min$$1[0] = x - rx;
        min$$1[1] = y - ry;
        max$$1[0] = x + rx;
        max$$1[1] = y + ry;
        return;
    }

    start[0] = mathCos$3(startAngle) * rx + x;
    start[1] = mathSin$3(startAngle) * ry + y;

    end[0] = mathCos$3(endAngle) * rx + x;
    end[1] = mathSin$3(endAngle) * ry + y;

    vec2Min(min$$1, start, end);
    vec2Max(max$$1, start, end);

    // Thresh to [0, Math.PI * 2]
    startAngle = startAngle % (PI2$1);
    if (startAngle < 0) {
        startAngle = startAngle + PI2$1;
    }
    endAngle = endAngle % (PI2$1);
    if (endAngle < 0) {
        endAngle = endAngle + PI2$1;
    }

    if (startAngle > endAngle && !anticlockwise) {
        endAngle += PI2$1;
    }
    else if (startAngle < endAngle && anticlockwise) {
        startAngle += PI2$1;
    }
    if (anticlockwise) {
        var tmp = endAngle;
        endAngle = startAngle;
        startAngle = tmp;
    }

    // var number = 0;
    // var step = (anticlockwise ? -Math.PI : Math.PI) / 2;
    for (var angle = 0; angle < endAngle; angle += Math.PI / 2) {
        if (angle > startAngle) {
            extremity[0] = mathCos$3(angle) * rx + x;
            extremity[1] = mathSin$3(angle) * ry + y;

            vec2Min(min$$1, extremity, min$$1);
            vec2Max(max$$1, extremity, max$$1);
        }
    }
}

// TODO: getTotalLength, getPointAtLength

/**
 * @class zrender.core.PathProxy
 * 
 * Path 代理，可以在`buildPath`中用于替代`ctx`, 会保存每个path操作的命令到pathCommands属性中
 * 可以用于 isInsidePath 判断以及获取boundingRect
 * 
 * @author Yi Shen (http://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var CMD = {
    M: 1,
    L: 2,
    C: 3,
    Q: 4,
    A: 5,
    Z: 6,
    R: 7
};

var min$1 = [];
var max$1 = [];
var min2 = [];
var max2 = [];
var mathMin$2 = Math.min;
var mathMax$2 = Math.max;
var mathCos$2 = Math.cos;
var mathSin$2 = Math.sin;
var mathSqrt$1 = Math.sqrt;
var mathAbs = Math.abs;

var hasTypedArray = typeof Float32Array !== 'undefined';

/**
 * @method constructor PathProxy
 */
var PathProxy = function (notSaveData) {

    this._saveData = !(notSaveData || false);

    if (this._saveData) {
        /**
         * Path data. Stored as flat array
         * @property {Array<Object>}
         */
        this.data = [];
    }

    this._ctx = null;
};

/**
 * 快速计算Path包围盒（并不是最小包围盒）
 * @return {Object}
 */
PathProxy.prototype = {

    constructor: PathProxy,

    _xi: 0,
    _yi: 0,

    _x0: 0,
    _y0: 0,
    // Unit x, Unit y. Provide for avoiding drawing that too short line segment
    _ux: 0,
    _uy: 0,

    _len: 0,

    _lineDash: null,

    _dashOffset: 0,

    _dashIdx: 0,

    _dashSum: 0,

    /**
     * @readOnly
     */
    setScale: function (sx, sy, segmentIgnoreThreshold) {
        // Compat. Previously there is no segmentIgnoreThreshold.
        segmentIgnoreThreshold = segmentIgnoreThreshold || 0;
        this._ux = mathAbs(segmentIgnoreThreshold / devicePixelRatio / sx) || 0;
        this._uy = mathAbs(segmentIgnoreThreshold / devicePixelRatio / sy) || 0;
    },

    getContext: function () {
        return this._ctx;
    },

    /**
     * @method beginPath
     * @param  {CanvasRenderingContext2D} ctx
     * @return {PathProxy}
     */
    beginPath: function (ctx) {

        this._ctx = ctx;

        ctx && ctx.beginPath();

        ctx && (this.dpr = ctx.dpr);

        // Reset
        if (this._saveData) {
            this._len = 0;
        }

        if (this._lineDash) {
            this._lineDash = null;

            this._dashOffset = 0;
        }

        return this;
    },

    /**
     * @method moveTo
     * @param  {Number} x
     * @param  {Number} y
     * @return {PathProxy}
     */
    moveTo: function (x, y) {
        this.addData(CMD.M, x, y);
        this._ctx && this._ctx.moveTo(x, y);

        // x0, y0, xi, yi 是记录在 _dashedXXXXTo 方法中使用
        // xi, yi 记录当前点, x0, y0 在 closePath 的时候回到起始点。
        // 有可能在 beginPath 之后直接调用 lineTo，这时候 x0, y0 需要
        // 在 lineTo 方法中记录，这里先不考虑这种情况，dashed line 也只在 IE10- 中不支持
        this._x0 = x;
        this._y0 = y;

        this._xi = x;
        this._yi = y;

        return this;
    },

    /**
     * @method lineTo
     * @param  {Number} x
     * @param  {Number} y
     * @return {PathProxy}
     */
    lineTo: function (x, y) {
        var exceedUnit = mathAbs(x - this._xi) > this._ux
            || mathAbs(y - this._yi) > this._uy
            // Force draw the first segment
            || this._len < 5;

        this.addData(CMD.L, x, y);

        if (this._ctx && exceedUnit) {
            this._needsDash() ? this._dashedLineTo(x, y)
                : this._ctx.lineTo(x, y);
        }
        if (exceedUnit) {
            this._xi = x;
            this._yi = y;
        }

        return this;
    },

    /**
     * @method bezierCurveTo
     * @param  {Number} x1
     * @param  {Number} y1
     * @param  {Number} x2
     * @param  {Number} y2
     * @param  {Number} x3
     * @param  {Number} y3
     * @return {PathProxy}
     */
    bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
        this.addData(CMD.C, x1, y1, x2, y2, x3, y3);
        if (this._ctx) {
            this._needsDash() ? this._dashedBezierTo(x1, y1, x2, y2, x3, y3)
                : this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        }
        this._xi = x3;
        this._yi = y3;
        return this;
    },

    /**
     * @method quadraticCurveTo
     * @param  {Number} x1
     * @param  {Number} y1
     * @param  {Number} x2
     * @param  {Number} y2
     * @return {PathProxy}
     */
    quadraticCurveTo: function (x1, y1, x2, y2) {
        this.addData(CMD.Q, x1, y1, x2, y2);
        if (this._ctx) {
            this._needsDash() ? this._dashedQuadraticTo(x1, y1, x2, y2)
                : this._ctx.quadraticCurveTo(x1, y1, x2, y2);
        }
        this._xi = x2;
        this._yi = y2;
        return this;
    },

    /**
     * @method arc
     * @param  {Number} cx
     * @param  {Number} cy
     * @param  {Number} r
     * @param  {Number} startAngle
     * @param  {Number} endAngle
     * @param  {boolean} anticlockwise
     * @return {PathProxy}
     */
    arc: function (cx, cy, r, startAngle, endAngle, anticlockwise) {
        this.addData(
            CMD.A, cx, cy, r, r, startAngle, endAngle - startAngle, 0, anticlockwise ? 0 : 1
        );
        this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);

        this._xi = mathCos$2(endAngle) * r + cx;
        this._yi = mathSin$2(endAngle) * r + cy;
        return this;
    },

    // TODO
    arcTo: function (x1, y1, x2, y2, radius) {
        if (this._ctx) {
            this._ctx.arcTo(x1, y1, x2, y2, radius);
        }
        return this;
    },

    // TODO
    rect: function (x, y, w, h) {
        this._ctx && this._ctx.rect(x, y, w, h);
        this.addData(CMD.R, x, y, w, h);
        return this;
    },

    /**
     * @method closePath
     * @return {PathProxy}
     */
    closePath: function () {
        this.addData(CMD.Z);

        var ctx = this._ctx;
        var x0 = this._x0;
        var y0 = this._y0;
        if (ctx) {
            this._needsDash() && this._dashedLineTo(x0, y0);
            ctx.closePath();
        }

        this._xi = x0;
        this._yi = y0;
        return this;
    },

    /**
     * @method fill
     * Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。
     * stroke 同样
     * @param {CanvasRenderingContext2D} ctx
     * @return {PathProxy}
     */
    fill: function (ctx) {
        ctx && ctx.fill();
        this.toStatic();
    },

    /**
     * @method stroke
     * @param {CanvasRenderingContext2D} ctx
     * @return {PathProxy}
     */
    stroke: function (ctx) {
        ctx && ctx.stroke();
        this.toStatic();
    },

    /**
     * @method setLineDash
     * 必须在其它绘制命令前调用
     * Must be invoked before all other path drawing methods
     * @return {PathProxy}
     */
    setLineDash: function (lineDash) {
        if (lineDash instanceof Array) {
            this._lineDash = lineDash;

            this._dashIdx = 0;

            var lineDashSum = 0;
            for (var i = 0; i < lineDash.length; i++) {
                lineDashSum += lineDash[i];
            }
            this._dashSum = lineDashSum;
        }
        return this;
    },

    /**
     * @method setLineDashOffset
     * 必须在其它绘制命令前调用
     * Must be invoked before all other path drawing methods
     * @return {PathProxy}
     */
    setLineDashOffset: function (offset) {
        this._dashOffset = offset;
        return this;
    },

    /**
     * @method len
     * @return {boolean}
     */
    len: function () {
        return this._len;
    },

    /**
     * @method setData
     * 直接设置 Path 数据
     */
    setData: function (data) {

        var len$$1 = data.length;

        if (!(this.data && this.data.length === len$$1) && hasTypedArray) {
            this.data = new Float32Array(len$$1);
        }

        for (var i = 0; i < len$$1; i++) {
            this.data[i] = data[i];
        }

        this._len = len$$1;
    },

    /**
     * @method appendPath
     * 添加子路径
     * @param {PathProxy|Array.<PathProxy>} path
     */
    appendPath: function (path) {
        if (!(path instanceof Array)) {
            path = [path];
        }
        var len$$1 = path.length;
        var appendSize = 0;
        var offset = this._len;
        for (var i = 0; i < len$$1; i++) {
            appendSize += path[i].len();
        }
        if (hasTypedArray && (this.data instanceof Float32Array)) {
            this.data = new Float32Array(offset + appendSize);
        }
        for (var i = 0; i < len$$1; i++) {
            var appendPathData = path[i].data;
            for (var k = 0; k < appendPathData.length; k++) {
                this.data[offset++] = appendPathData[k];
            }
        }
        this._len = offset;
    },

    /**
     * @method addData
     * 填充 Path 数据。
     * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
     */
    addData: function (cmd) {
        if (!this._saveData) {
            return;
        }

        var data = this.data;
        if (this._len + arguments.length > data.length) {
            // 因为之前的数组已经转换成静态的 Float32Array
            // 所以不够用时需要扩展一个新的动态数组
            this._expandData();
            data = this.data;
        }
        for (var i = 0; i < arguments.length; i++) {
            data[this._len++] = arguments[i];
        }

        this._prevCmd = cmd;
    },

    _expandData: function () {
        // Only if data is Float32Array
        if (!(this.data instanceof Array)) {
            var newData = [];
            for (var i = 0; i < this._len; i++) {
                newData[i] = this.data[i];
            }
            this.data = newData;
        }
    },

    /**
     * If needs js implemented dashed line
     * @return {boolean}
     * @private
     */
    _needsDash: function () {
        return this._lineDash;
    },

    _dashedLineTo: function (x1, y1) {
        var dashSum = this._dashSum;
        var offset = this._dashOffset;
        var lineDash = this._lineDash;
        var ctx = this._ctx;

        var x0 = this._xi;
        var y0 = this._yi;
        var dx = x1 - x0;
        var dy = y1 - y0;
        var dist$$1 = mathSqrt$1(dx * dx + dy * dy);
        var x = x0;
        var y = y0;
        var dash;
        var nDash = lineDash.length;
        var idx;
        dx /= dist$$1;
        dy /= dist$$1;

        if (offset < 0) {
            // Convert to positive offset
            offset = dashSum + offset;
        }
        offset %= dashSum;
        x -= offset * dx;
        y -= offset * dy;

        while ((dx > 0 && x <= x1) || (dx < 0 && x >= x1)
        || (dx === 0 && ((dy > 0 && y <= y1) || (dy < 0 && y >= y1)))) {
            idx = this._dashIdx;
            dash = lineDash[idx];
            x += dx * dash;
            y += dy * dash;
            this._dashIdx = (idx + 1) % nDash;
            // Skip positive offset
            if ((dx > 0 && x < x0) || (dx < 0 && x > x0) || (dy > 0 && y < y0) || (dy < 0 && y > y0)) {
                continue;
            }
            ctx[idx % 2 ? 'moveTo' : 'lineTo'](
                dx >= 0 ? mathMin$2(x, x1) : mathMax$2(x, x1),
                dy >= 0 ? mathMin$2(y, y1) : mathMax$2(y, y1)
            );
        }
        // Offset for next lineTo
        dx = x - x1;
        dy = y - y1;
        this._dashOffset = -mathSqrt$1(dx * dx + dy * dy);
    },

    // Not accurate dashed line to
    _dashedBezierTo: function (x1, y1, x2, y2, x3, y3) {
        var dashSum = this._dashSum;
        var offset = this._dashOffset;
        var lineDash = this._lineDash;
        var ctx = this._ctx;

        var x0 = this._xi;
        var y0 = this._yi;
        var t;
        var dx;
        var dy;
        var cubicAt$$1 = cubicAt;
        var bezierLen = 0;
        var idx = this._dashIdx;
        var nDash = lineDash.length;

        var x;
        var y;

        var tmpLen = 0;

        if (offset < 0) {
            // Convert to positive offset
            offset = dashSum + offset;
        }
        offset %= dashSum;
        // Bezier approx length
        for (t = 0; t < 1; t += 0.1) {
            dx = cubicAt$$1(x0, x1, x2, x3, t + 0.1)
                - cubicAt$$1(x0, x1, x2, x3, t);
            dy = cubicAt$$1(y0, y1, y2, y3, t + 0.1)
                - cubicAt$$1(y0, y1, y2, y3, t);
            bezierLen += mathSqrt$1(dx * dx + dy * dy);
        }

        // Find idx after add offset
        for (; idx < nDash; idx++) {
            tmpLen += lineDash[idx];
            if (tmpLen > offset) {
                break;
            }
        }
        t = (tmpLen - offset) / bezierLen;

        while (t <= 1) {

            x = cubicAt$$1(x0, x1, x2, x3, t);
            y = cubicAt$$1(y0, y1, y2, y3, t);

            // Use line to approximate dashed bezier
            // Bad result if dash is long
            idx % 2 ? ctx.moveTo(x, y)
                : ctx.lineTo(x, y);

            t += lineDash[idx] / bezierLen;

            idx = (idx + 1) % nDash;
        }

        // Finish the last segment and calculate the new offset
        (idx % 2 !== 0) && ctx.lineTo(x3, y3);
        dx = x3 - x;
        dy = y3 - y;
        this._dashOffset = -mathSqrt$1(dx * dx + dy * dy);
    },

    _dashedQuadraticTo: function (x1, y1, x2, y2) {
        // Convert quadratic to cubic using degree elevation
        var x3 = x2;
        var y3 = y2;
        x2 = (x2 + 2 * x1) / 3;
        y2 = (y2 + 2 * y1) / 3;
        x1 = (this._xi + 2 * x1) / 3;
        y1 = (this._yi + 2 * y1) / 3;

        this._dashedBezierTo(x1, y1, x2, y2, x3, y3);
    },

    /**
     * 转成静态的 Float32Array 减少堆内存占用
     * Convert dynamic array to static Float32Array
     */
    toStatic: function () {
        var data = this.data;
        if (data instanceof Array) {
            data.length = this._len;
            if (hasTypedArray) {
                this.data = new Float32Array(data);
            }
        }
    },

    /**
     * @method getBoundingRect
     * @return {BoundingRect}
     */
    getBoundingRect: function () {
        min$1[0] = min$1[1] = min2[0] = min2[1] = Number.MAX_VALUE;
        max$1[0] = max$1[1] = max2[0] = max2[1] = -Number.MAX_VALUE;

        var data = this.data;
        var xi = 0;
        var yi = 0;
        var x0 = 0;
        var y0 = 0;

        for (var i = 0; i < data.length;) {
            var cmd = data[i++];

            if (i === 1) {
                // 如果第一个命令是 L, C, Q
                // 则 previous point 同绘制命令的第一个 point
                //
                // 第一个命令为 Arc 的情况下会在后面特殊处理
                xi = data[i];
                yi = data[i + 1];

                x0 = xi;
                y0 = yi;
            }

            switch (cmd) {
                case CMD.M:
                    // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
                    // 在 closePath 的时候使用
                    x0 = data[i++];
                    y0 = data[i++];
                    xi = x0;
                    yi = y0;
                    min2[0] = x0;
                    min2[1] = y0;
                    max2[0] = x0;
                    max2[1] = y0;
                    break;
                case CMD.L:
                    fromLine(xi, yi, data[i], data[i + 1], min2, max2);
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD.C:
                    fromCubic(
                        xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
                        min2, max2
                    );
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD.Q:
                    fromQuadratic(
                        xi, yi, data[i++], data[i++], data[i], data[i + 1],
                        min2, max2
                    );
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD.A:
                    // TODO Arc 判断的开销比较大
                    var cx = data[i++];
                    var cy = data[i++];
                    var rx = data[i++];
                    var ry = data[i++];
                    var startAngle = data[i++];
                    var endAngle = data[i++] + startAngle;
                    // TODO Arc 旋转
                    i += 1;
                    var anticlockwise = 1 - data[i++];

                    if (i === 1) {
                        // 直接使用 arc 命令
                        // 第一个命令起点还未定义
                        x0 = mathCos$2(startAngle) * rx + cx;
                        y0 = mathSin$2(startAngle) * ry + cy;
                    }

                    fromArc(
                        cx, cy, rx, ry, startAngle, endAngle,
                        anticlockwise, min2, max2
                    );

                    xi = mathCos$2(endAngle) * rx + cx;
                    yi = mathSin$2(endAngle) * ry + cy;
                    break;
                case CMD.R:
                    x0 = xi = data[i++];
                    y0 = yi = data[i++];
                    var width = data[i++];
                    var height = data[i++];
                    // Use fromLine
                    fromLine(x0, y0, x0 + width, y0 + height, min2, max2);
                    break;
                case CMD.Z:
                    xi = x0;
                    yi = y0;
                    break;
            }

            // Union
            min(min$1, min$1, min2);
            max(max$1, max$1, max2);
        }

        // No data
        if (i === 0) {
            min$1[0] = min$1[1] = max$1[0] = max$1[1] = 0;
        }

        return new BoundingRect(
            min$1[0], min$1[1], max$1[0] - min$1[0], max$1[1] - min$1[1]
        );
    },

    /**
     * @method rebuildPath
     * Rebuild path from current data
     * Rebuild path will not consider javascript implemented line dash.
     * @param {CanvasRenderingContext2D} ctx
     */
    rebuildPath: function (ctx) {
        var d = this.data;
        var x0;
        var y0;
        var xi;
        var yi;
        var x;
        var y;
        var ux = this._ux;
        var uy = this._uy;
        var len$$1 = this._len;
        for (var i = 0; i < len$$1;) {
            var cmd = d[i++];

            if (i === 1) {
                // 如果第一个命令是 L, C, Q
                // 则 previous point 同绘制命令的第一个 point
                //
                // 第一个命令为 Arc 的情况下会在后面特殊处理
                xi = d[i];
                yi = d[i + 1];

                x0 = xi;
                y0 = yi;
            }
            switch (cmd) {
                case CMD.M:
                    x0 = xi = d[i++];
                    y0 = yi = d[i++];
                    ctx.moveTo(xi, yi);
                    break;
                case CMD.L:
                    x = d[i++];
                    y = d[i++];
                    // Not draw too small seg between
                    if (mathAbs(x - xi) > ux || mathAbs(y - yi) > uy || i === len$$1 - 1) {
                        ctx.lineTo(x, y);
                        xi = x;
                        yi = y;
                    }
                    break;
                case CMD.C:
                    ctx.bezierCurveTo(
                        d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]
                    );
                    xi = d[i - 2];
                    yi = d[i - 1];
                    break;
                case CMD.Q:
                    ctx.quadraticCurveTo(d[i++], d[i++], d[i++], d[i++]);
                    xi = d[i - 2];
                    yi = d[i - 1];
                    break;
                case CMD.A:
                    var cx = d[i++];
                    var cy = d[i++];
                    var rx = d[i++];
                    var ry = d[i++];
                    var theta = d[i++];
                    var dTheta = d[i++];
                    var psi = d[i++];
                    var fs = d[i++];
                    var r = (rx > ry) ? rx : ry;
                    var scaleX = (rx > ry) ? 1 : rx / ry;
                    var scaleY = (rx > ry) ? ry / rx : 1;
                    var isEllipse = Math.abs(rx - ry) > 1e-3;
                    var endAngle = theta + dTheta;
                    if (isEllipse) {
                        ctx.translate(cx, cy);
                        ctx.rotate(psi);
                        ctx.scale(scaleX, scaleY);
                        ctx.arc(0, 0, r, theta, endAngle, 1 - fs);
                        ctx.scale(1 / scaleX, 1 / scaleY);
                        ctx.rotate(-psi);
                        ctx.translate(-cx, -cy);
                    }
                    else {
                        ctx.arc(cx, cy, r, theta, endAngle, 1 - fs);
                    }

                    if (i === 1) {
                        // 直接使用 arc 命令
                        // 第一个命令起点还未定义
                        x0 = mathCos$2(theta) * rx + cx;
                        y0 = mathSin$2(theta) * ry + cy;
                    }
                    xi = mathCos$2(endAngle) * rx + cx;
                    yi = mathSin$2(endAngle) * ry + cy;
                    break;
                case CMD.R:
                    x0 = xi = d[i];
                    y0 = yi = d[i + 1];
                    ctx.rect(d[i++], d[i++], d[i++], d[i++]);
                    break;
                case CMD.Z:
                    ctx.closePath();
                    xi = x0;
                    yi = y0;
            }
        }
    }
};

PathProxy.CMD = CMD;

/**
 * 线段包含判断
 * @param  {Number}  x0
 * @param  {Number}  y0
 * @param  {Number}  x1
 * @param  {Number}  y1
 * @param  {Number}  lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {boolean}
 */
function containStroke$1(x0, y0, x1, y1, lineWidth, x, y) {
    if (lineWidth === 0) {
        return false;
    }
    let _l = lineWidth;
    let _a = 0;
    let _b = x0;
    // Quick reject
    if (
        (y > y0 + _l && y > y1 + _l)
        || (y < y0 - _l && y < y1 - _l)
        || (x > x0 + _l && x > x1 + _l)
        || (x < x0 - _l && x < x1 - _l)
    ) {
        return false;
    }

    if (x0 !== x1) {
        _a = (y0 - y1) / (x0 - x1);
        _b = (x0 * y1 - x1 * y0) / (x0 - x1);
    }
    else {
        return Math.abs(x - x0) <= _l / 2;
    }
    let tmp = _a * x - y + _b;
    let _s = tmp * tmp / (_a * _a + 1);
    return _s <= _l / 2 * _l / 2;
}

/**
 * 三次贝塞尔曲线描边包含判断
 * @param  {Number}  x0
 * @param  {Number}  y0
 * @param  {Number}  x1
 * @param  {Number}  y1
 * @param  {Number}  x2
 * @param  {Number}  y2
 * @param  {Number}  x3
 * @param  {Number}  y3
 * @param  {Number}  lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {boolean}
 */
function containStroke$2(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
    if (lineWidth === 0) {
        return false;
    }
    let _l = lineWidth;
    // Quick reject
    if (
        (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l)
        || (y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l)
        || (x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l)
        || (x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l)
    ) {
        return false;
    }
    let d = cubicProjectPoint(
        x0, y0, x1, y1, x2, y2, x3, y3,
        x, y, null
    );
    return d <= _l / 2;
}

/**
 * 二次贝塞尔曲线描边包含判断
 * @param  {Number}  x0
 * @param  {Number}  y0
 * @param  {Number}  x1
 * @param  {Number}  y1
 * @param  {Number}  x2
 * @param  {Number}  y2
 * @param  {Number}  lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {boolean}
 */
function containStroke$3(x0, y0, x1, y1, x2, y2, lineWidth, x, y) {
    if (lineWidth === 0) {
        return false;
    }
    let _l = lineWidth;
    // Quick reject
    if (
        (y > y0 + _l && y > y1 + _l && y > y2 + _l)
        || (y < y0 - _l && y < y1 - _l && y < y2 - _l)
        || (x > x0 + _l && x > x1 + _l && x > x2 + _l)
        || (x < x0 - _l && x < x1 - _l && x < x2 - _l)
    ) {
        return false;
    }
    let d = quadraticProjectPoint(
        x0, y0, x1, y1, x2, y2,
        x, y, null
    );
    return d <= _l / 2;
}

function normalizeRadian(angle) {
    angle %= PI2;
    if (angle < 0) {
        angle += PI2;
    }
    return angle;
}

let PI2$2 = Math.PI * 2;

/**
 * 圆弧描边包含判断
 * @param  {Number}  cx
 * @param  {Number}  cy
 * @param  {Number}  r
 * @param  {Number}  startAngle
 * @param  {Number}  endAngle
 * @param  {boolean}  anticlockwise
 * @param  {Number} lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {Boolean}
 */
function containStroke$4(
    cx, cy, r, startAngle, endAngle, anticlockwise,
    lineWidth, x, y
) {

    if (lineWidth === 0) {
        return false;
    }
    let _l = lineWidth;

    x -= cx;
    y -= cy;
    let d = Math.sqrt(x * x + y * y);

    if ((d - _l > r) || (d + _l < r)) {
        return false;
    }
    if (Math.abs(startAngle - endAngle) % PI2$2 < 1e-4) {
        // Is a circle
        return true;
    }
    if (anticlockwise) {
        let tmp = startAngle;
        startAngle = normalizeRadian(endAngle);
        endAngle = normalizeRadian(tmp);
    }
    else {
        startAngle = normalizeRadian(startAngle);
        endAngle = normalizeRadian(endAngle);
    }
    if (startAngle > endAngle) {
        endAngle += PI2$2;
    }

    let angle = Math.atan2(y, x);
    if (angle < 0) {
        angle += PI2$2;
    }
    return (angle >= startAngle && angle <= endAngle)
        || (angle + PI2$2 >= startAngle && angle + PI2$2 <= endAngle);
}

function windingLine(x0, y0, x1, y1, x, y) {
    if ((y > y0 && y > y1) || (y < y0 && y < y1)) {
        return 0;
    }
    // Ignore horizontal line
    if (y1 === y0) {
        return 0;
    }
    let dir = y1 < y0 ? 1 : -1;
    let t = (y - y0) / (y1 - y0);

    // Avoid winding error when intersection point is the connect point of two line of polygon
    if (t === 1 || t === 0) {
        dir = y1 < y0 ? 0.5 : -0.5;
    }

    let x_ = t * (x1 - x0) + x0;

    // If (x, y) on the line, considered as "contain".
    return x_ === x ? Infinity : x_ > x ? dir : 0;
}

let CMD$1 = PathProxy.CMD;
let EPSILON$2 = 1e-4;

function isAroundEqual(a, b) {
    return Math.abs(a - b) < EPSILON$2;
}

// 临时数组
let roots = [-1, -1, -1];
let extrema = [-1, -1];

function swapExtrema() {
    let tmp = extrema[0];
    extrema[0] = extrema[1];
    extrema[1] = tmp;
}

function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
    // Quick reject
    if (
        (y > y0 && y > y1 && y > y2 && y > y3)
        || (y < y0 && y < y1 && y < y2 && y < y3)
    ) {
        return 0;
    }
    let nRoots = cubicRootAt(y0, y1, y2, y3, y, roots);
    if (nRoots === 0) {
        return 0;
    }
    else {
        let w = 0;
        let nExtrema = -1;
        let y0_;
        let y1_;
        for (let i = 0; i < nRoots; i++) {
            let t = roots[i];

            // Avoid winding error when intersection point is the connect point of two line of polygon
            let unit = (t === 0 || t === 1) ? 0.5 : 1;

            let x_ = cubicAt(x0, x1, x2, x3, t);
            if (x_ < x) { // Quick reject
                continue;
            }
            if (nExtrema < 0) {
                nExtrema = cubicExtrema(y0, y1, y2, y3, extrema);
                if (extrema[1] < extrema[0] && nExtrema > 1) {
                    swapExtrema();
                }
                y0_ = cubicAt(y0, y1, y2, y3, extrema[0]);
                if (nExtrema > 1) {
                    y1_ = cubicAt(y0, y1, y2, y3, extrema[1]);
                }
            }
            if (nExtrema === 2) {
                // 分成三段单调函数
                if (t < extrema[0]) {
                    w += y0_ < y0 ? unit : -unit;
                }
                else if (t < extrema[1]) {
                    w += y1_ < y0_ ? unit : -unit;
                }
                else {
                    w += y3 < y1_ ? unit : -unit;
                }
            }
            else {
                // 分成两段单调函数
                if (t < extrema[0]) {
                    w += y0_ < y0 ? unit : -unit;
                }
                else {
                    w += y3 < y0_ ? unit : -unit;
                }
            }
        }
        return w;
    }
}

function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
    // Quick reject
    if (
        (y > y0 && y > y1 && y > y2)
        || (y < y0 && y < y1 && y < y2)
    ) {
        return 0;
    }
    let nRoots = quadraticRootAt(y0, y1, y2, y, roots);
    if (nRoots === 0) {
        return 0;
    }
    else {
        let t = quadraticExtremum(y0, y1, y2);
        if (t >= 0 && t <= 1) {
            let w = 0;
            let y_ = quadraticAt(y0, y1, y2, t);
            for (let i = 0; i < nRoots; i++) {
                // Remove one endpoint.
                let unit = (roots[i] === 0 || roots[i] === 1) ? 0.5 : 1;

                let x_ = quadraticAt(x0, x1, x2, roots[i]);
                if (x_ < x) {   // Quick reject
                    continue;
                }
                if (roots[i] < t) {
                    w += y_ < y0 ? unit : -unit;
                }
                else {
                    w += y2 < y_ ? unit : -unit;
                }
            }
            return w;
        }
        else {
            // Remove one endpoint.
            let unit = (roots[0] === 0 || roots[0] === 1) ? 0.5 : 1;

            let x_ = quadraticAt(x0, x1, x2, roots[0]);
            if (x_ < x) {   // Quick reject
                return 0;
            }
            return y2 < y0 ? unit : -unit;
        }
    }
}

// TODO
// Arc 旋转
function windingArc(
    cx, cy, r, startAngle, endAngle, anticlockwise, x, y
) {
    y -= cy;
    if (y > r || y < -r) {
        return 0;
    }
    let tmp = Math.sqrt(r * r - y * y);
    roots[0] = -tmp;
    roots[1] = tmp;

    let diff = Math.abs(startAngle - endAngle);
    if (diff < 1e-4) {
        return 0;
    }
    if (diff % PI2 < 1e-4) {
        // Is a circle
        startAngle = 0;
        endAngle = PI2;
        let dir = anticlockwise ? 1 : -1;
        if (x >= roots[0] + cx && x <= roots[1] + cx) {
            return dir;
        }
        else {
            return 0;
        }
    }

    if (anticlockwise) {
        let tmp = startAngle;
        startAngle = normalizeRadian(endAngle);
        endAngle = normalizeRadian(tmp);
    }
    else {
        startAngle = normalizeRadian(startAngle);
        endAngle = normalizeRadian(endAngle);
    }
    if (startAngle > endAngle) {
        endAngle += PI2;
    }

    let w = 0;
    for (let i = 0; i < 2; i++) {
        let x_ = roots[i];
        if (x_ + cx > x) {
            let angle = Math.atan2(y, x_);
            let dir = anticlockwise ? 1 : -1;
            if (angle < 0) {
                angle = PI2 + angle;
            }
            if (
                (angle >= startAngle && angle <= endAngle)
                || (angle + PI2 >= startAngle && angle + PI2 <= endAngle)
            ) {
                if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
                    dir = -dir;
                }
                w += dir;
            }
        }
    }
    return w;
}

function containPath(data, lineWidth, isStroke, x, y) {
    let w = 0;
    let xi = 0;
    let yi = 0;
    let x0 = 0;
    let y0 = 0;

    for (let i = 0; i < data.length;) {
        let cmd = data[i++];
        // Begin a new subpath
        if (cmd === CMD$1.M && i > 1) {
            // Close previous subpath
            if (!isStroke) {
                w += windingLine(xi, yi, x0, y0, x, y);
            }
            // 如果被任何一个 subpath 包含
            // if (w !== 0) {
            //     return true;
            // }
        }

        if (i === 1) {
            // 如果第一个命令是 L, C, Q
            // 则 previous point 同绘制命令的第一个 point
            //
            // 第一个命令为 Arc 的情况下会在后面特殊处理
            xi = data[i];
            yi = data[i + 1];

            x0 = xi;
            y0 = yi;
        }

        let x1;
        let y1;
        let width;
        let height;

        switch (cmd) {
            case CMD$1.M:
                // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
                // 在 closePath 的时候使用
                x0 = data[i++];
                y0 = data[i++];
                xi = x0;
                yi = y0;
                break;
            case CMD$1.L:
                if (isStroke) {
                    if (containStroke$1(xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
                        return true;
                    }
                }
                else {
                    // NOTE 在第一个命令为 L, C, Q 的时候会计算出 NaN
                    w += windingLine(xi, yi, data[i], data[i + 1], x, y) || 0;
                }
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD$1.C:
                if (isStroke) {
                    if (containStroke$2(xi, yi,
                        data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
                        lineWidth, x, y
                    )) {
                        return true;
                    }
                }
                else {
                    w += windingCubic(
                        xi, yi,
                        data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
                        x, y
                    ) || 0;
                }
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD$1.Q:
                if (isStroke) {
                    if (containStroke$3(xi, yi,
                        data[i++], data[i++], data[i], data[i + 1],
                        lineWidth, x, y
                    )) {
                        return true;
                    }
                }
                else {
                    w += windingQuadratic(
                        xi, yi,
                        data[i++], data[i++], data[i], data[i + 1],
                        x, y
                    ) || 0;
                }
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD$1.A:
                // TODO Arc 判断的开销比较大
                let cx = data[i++];
                let cy = data[i++];
                let rx = data[i++];
                let ry = data[i++];
                let theta = data[i++];
                let dTheta = data[i++];
                // TODO Arc 旋转
                i += 1;
                let anticlockwise = 1 - data[i++];
                x1 = Math.cos(theta) * rx + cx;
                y1 = Math.sin(theta) * ry + cy;
                // 不是直接使用 arc 命令
                if (i > 1) {
                    w += windingLine(xi, yi, x1, y1, x, y);
                }
                else {
                    // 第一个命令起点还未定义
                    x0 = x1;
                    y0 = y1;
                }
                // zr 使用scale来模拟椭圆, 这里也对x做一定的缩放
                let _x = (x - cx) * ry / rx + cx;
                if (isStroke) {
                    if (containStroke$4(
                        cx, cy, ry, theta, theta + dTheta, anticlockwise,
                        lineWidth, _x, y
                    )) {
                        return true;
                    }
                }
                else {
                    w += windingArc(
                        cx, cy, ry, theta, theta + dTheta, anticlockwise,
                        _x, y
                    );
                }
                xi = Math.cos(theta + dTheta) * rx + cx;
                yi = Math.sin(theta + dTheta) * ry + cy;
                break;
            case CMD$1.R:
                x0 = xi = data[i++];
                y0 = yi = data[i++];
                width = data[i++];
                height = data[i++];
                x1 = x0 + width;
                y1 = y0 + height;
                if (isStroke) {
                    if (containStroke$1(x0, y0, x1, y0, lineWidth, x, y)
                        || containStroke$1(x1, y0, x1, y1, lineWidth, x, y)
                        || containStroke$1(x1, y1, x0, y1, lineWidth, x, y)
                        || containStroke$1(x0, y1, x0, y0, lineWidth, x, y)
                    ) {
                        return true;
                    }
                }
                else {
                    // FIXME Clockwise ?
                    w += windingLine(x1, y0, x1, y1, x, y);
                    w += windingLine(x0, y1, x0, y0, x, y);
                }
                break;
            case CMD$1.Z:
                if (isStroke) {
                    if (containStroke$1(
                        xi, yi, x0, y0, lineWidth, x, y
                    )) {
                        return true;
                    }
                }
                else {
                    // Close a subpath
                    w += windingLine(xi, yi, x0, y0, x, y);
                    // 如果被任何一个 subpath 包含
                    // FIXME subpaths may overlap
                    // if (w !== 0) {
                    //     return true;
                    // }
                }
                xi = x0;
                yi = y0;
                break;
        }
    }
    if (!isStroke && !isAroundEqual(yi, y0)) {
        w += windingLine(xi, yi, x0, y0, x, y) || 0;
    }
    return w !== 0;
}

function contain(pathData, x, y) {
    return containPath(pathData, 0, false, x, y);
}

function containStroke(pathData, lineWidth, x, y) {
    return containPath(pathData, lineWidth, true, x, y);
}

/**
 * @class zrender.graphic.Path 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class Path extends Displayable{
    /**
     * @method constructor Path
     * @param {Object} options
     */
    constructor(options){
        super(options);
        /**
         * @property {PathProxy}
         * @readOnly
         */
        this.path = null;
        /**
         * @property {String} type
         */
        this.type='path';
        /**
         * @private
         * @property __dirtyPath
         */
        this.__dirtyPath=true;
        /**
         * @property {Number} strokeContainThreshold
         */
        this.strokeContainThreshold=5;
        /**
         * @property {Number} segmentIgnoreThreshold
         * This item default to be false. But in map series in echarts,
         * in order to improve performance, it should be set to true,
         * so the shorty segment won't draw.
         */
        this.segmentIgnoreThreshold=0;
    
        /**
         * @property {Boolean} subPixelOptimize
         * See `module:zrender/src/graphic/helper/subPixelOptimize`.
         */
        this.subPixelOptimize=false;

        copyOwnProperties(this,this.options,['style','shape']);
    }

    /**
     * @method brush
     * @param {Object} ctx 
     * @param {Element} prevEl 
     */
    brush(ctx, prevEl) {
        let style = this.style;
        let path = this.path || new PathProxy(true);
        let hasStroke = style.hasStroke();
        let hasFill = style.hasFill();
        let fill = style.fill;
        let stroke = style.stroke;
        let hasFillGradient = hasFill && !!(fill.colorStops);
        let hasStrokeGradient = hasStroke && !!(stroke.colorStops);
        let hasFillPattern = hasFill && !!(fill.image);
        let hasStrokePattern = hasStroke && !!(stroke.image);

        style.bind(ctx, this, prevEl);
        this.setTransform(ctx);

        if (this.__dirty) {
            let rect;
            // Update gradient because bounding rect may changed
            if (hasFillGradient) {
                rect = rect || this.getBoundingRect();
                this._fillGradient = style.getGradient(ctx, fill, rect);
            }
            if (hasStrokeGradient) {
                rect = rect || this.getBoundingRect();
                this._strokeGradient = style.getGradient(ctx, stroke, rect);
            }
        }

        // Use the gradient or pattern
        if (hasFillGradient) {
            // PENDING If may have affect the state
            ctx.fillStyle = this._fillGradient;
        }else if (hasFillPattern) {
            ctx.fillStyle = Pattern.prototype.getCanvasPattern.call(fill, ctx);
        }

        if (hasStrokeGradient) {
            ctx.strokeStyle = this._strokeGradient;
        }else if (hasStrokePattern) {
            ctx.strokeStyle = Pattern.prototype.getCanvasPattern.call(stroke, ctx);
        }

        let lineDash = style.lineDash;
        let lineDashOffset = style.lineDashOffset;

        let ctxLineDash = !!ctx.setLineDash;

        // Update path sx, sy
        let scale = this.getGlobalScale();
        path.setScale(scale[0], scale[1], this.segmentIgnoreThreshold);

        // Proxy context
        // Rebuild path in following 2 cases
        // 1. Path is dirty
        // 2. Path needs javascript implemented lineDash stroking.
        //    In this case, lineDash information will not be saved in PathProxy
        if (this.__dirtyPath
            || (lineDash && !ctxLineDash && hasStroke)) {
            path.beginPath(ctx);
            // Setting line dash before build path
            if (lineDash && !ctxLineDash) {
                path.setLineDash(lineDash);
                path.setLineDashOffset(lineDashOffset);
            }
            this.buildPath(path, this.shape, false);
            // Clear path dirty flag
            if (this.path) {
                this.__dirtyPath = false;
            }
        }else {
            // Replay path building
            ctx.beginPath();
            this.path.rebuildPath(ctx);
        }

        if (hasFill) {
            if (style.fillOpacity != null) {
                let originalGlobalAlpha = ctx.globalAlpha;
                ctx.globalAlpha = style.fillOpacity * style.opacity;
                path.fill(ctx);
                ctx.globalAlpha = originalGlobalAlpha;
            }else {
                path.fill(ctx);
            }
        }

        if (lineDash && ctxLineDash) {
            ctx.setLineDash(lineDash);
            ctx.lineDashOffset = lineDashOffset;
        }

        if (hasStroke) {
            if (style.strokeOpacity != null) {
                let originalGlobalAlpha = ctx.globalAlpha;
                ctx.globalAlpha = style.strokeOpacity * style.opacity;
                path.stroke(ctx);
                ctx.globalAlpha = originalGlobalAlpha;
            }else {
                path.stroke(ctx);
            }
        }

        if (lineDash && ctxLineDash) {
            // PENDING
            // Remove lineDash
            ctx.setLineDash([]);
        }

        // Draw rect text
        if (style.text != null) {
            // Only restore transform when needs draw text.
            this.restoreTransform(ctx);
            this.drawRectText(ctx, this.getBoundingRect());
        }
    }

    /**
     * @method buildPath
     * 
     * Each subclass should provide its own implement for this method.
     * When build path, some shape may decide if use moveTo to begin a new subpath or closePath, like in circle.
     * 
     * 每个子类都需要为此方法提供自己的实现。
     * 在构建路径时，某些形状需要根据情况决定使用 moveTo 来开始一段子路径，或者直接用 closePath 来封闭路径，比如圆形。
     * 
     * @param {*} ctx 
     * @param {*} shapeCfg 
     * @param {*} inBundle 
     */
    buildPath(ctx, shapeCfg, inBundle) {}

    /**
     * @method createPathProxy
     */
    createPathProxy() {
        this.path = new PathProxy();
    }

    /**
     * @protected
     * @method getBoundingRect
     */
    getBoundingRect() {
        let rect = this._rect;
        let style = this.style;
        let needsUpdateRect = !rect;
        if (needsUpdateRect) {
            let path = this.path;
            if (!path) {
                // Create path on demand.
                path = this.path = new PathProxy();
            }
            if (this.__dirtyPath) {
                path.beginPath();
                this.buildPath(path, this.shape, false);
            }
            rect = path.getBoundingRect();
        }
        this._rect = rect;

        if (style.hasStroke()) {
            // Needs update rect with stroke lineWidth when
            // 1. Element changes scale or lineWidth
            // 2. Shape is changed
            let rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());
            if (this.__dirty || needsUpdateRect) {
                rectWithStroke.copy(rect);
                // FIXME Must after updateTransform
                let w = style.lineWidth;
                // PENDING, Min line width is needed when line is horizontal or vertical
                let lineScale = style.strokeNoScale ? this.getLineScale() : 1;

                // Only add extra hover lineWidth when there are no fill
                if (!style.hasFill()) {
                    w = Math.max(w, this.strokeContainThreshold || 4);
                }
                // Consider line width
                // Line scale can't be 0;
                if (lineScale > 1e-10) {
                    rectWithStroke.width += w / lineScale;
                    rectWithStroke.height += w / lineScale;
                    rectWithStroke.x -= w / lineScale / 2;
                    rectWithStroke.y -= w / lineScale / 2;
                }
            }

            // Return rect with stroke
            return rectWithStroke;
        }

        return rect;
    }

    /**
     * @method contain
     * @param {*} x 
     * @param {*} y 
     */
    contain(x, y) {
        let localPos = this.transformCoordToLocal(x, y);
        let rect = this.getBoundingRect();
        let style = this.style;
        x = localPos[0];
        y = localPos[1];

        if (rect.contain(x, y)) {
            let pathData = this.path.data;
            if (style.hasStroke()) {
                let lineWidth = style.lineWidth;
                let lineScale = style.strokeNoScale ? this.getLineScale() : 1;
                // Line scale can't be 0;
                if (lineScale > 1e-10) {
                    // Only add extra hover lineWidth when there are no fill
                    if (!style.hasFill()) {
                        lineWidth = Math.max(lineWidth, this.strokeContainThreshold);
                    }
                    if (containStroke(
                        pathData, lineWidth / lineScale, x, y
                    )) {
                        return true;
                    }
                }
            }
            if (style.hasFill()) {
                return contain(pathData, x, y);
            }
        }
        return false;
    }

    /**
     * @protected
     * @method dirty
     * @param  {Boolean} dirtyPath
     */
    dirty(dirtyPath) {
        if (dirtyPath == null) {
            dirtyPath = true;
        }
        // Only mark dirty, not mark clean
        if (dirtyPath) {
            this.__dirtyPath = dirtyPath;
            this._rect = null;
        }

        this.__dirty = this.__dirtyText = true;

        this.__zr && this.__zr.refresh();

        // Used as a clipping path
        if (this.__clipTarget) {
            this.__clipTarget.dirty();
        }
    }

    /**
     * @method animateShape
     * Alias for animate('shape')
     * @param {Boolean} loop
     */
    animateShape(loop) {
        return this.animate('shape', loop);
    }

    /**
     * @method attrKV
     * Overwrite attrKV
     * @param {*} key 
     * @param {Object} value 
     */
    attrKV(key, value) {
        // FIXME
        if (key === 'shape') {
            this.setShape(value);
            this.__dirtyPath = true;
            this._rect = null;
        }else {
            Displayable.prototype.attrKV.call(this, key, value);
        }
    }

    /**
     * @method setShape
     * @param {Object|String} key
     * @param {Object} value
     */
    setShape(key, value) {
        // Path from string may not have shape
        if(!this.shape){
            return this;
        }
        if (isObject(key)) {
            copyOwnProperties(this.shape,key);
        }else {
            this.shape[key] = value;
        }
        this.dirty(true);
        return this;
    }

    /**
     * @method getLineScale
     */
    getLineScale() {
        let m = this.transform;
        // Get the line scale.
        // Determinant of `m` means how much the area is enlarged by the
        // transformation. So its square root can be used as a scale factor
        // for width.
        return m && Math.abs(m[0] - 1) > 1e-10 && Math.abs(m[3] - 1) > 1e-10
            ? Math.sqrt(Math.abs(m[0] * m[3] - m[2] * m[1]))
            : 1;
    }
}

var CMD$2 = PathProxy.CMD;

var points = [[], [], []];
var mathSqrt$3 = Math.sqrt;
var mathAtan2 = Math.atan2;

var transformPath = function (path, m) {
    var data = path.data;
    var cmd;
    var nPoint;
    var i;
    var j;
    var k;
    var p;

    var M = CMD$2.M;
    var C = CMD$2.C;
    var L = CMD$2.L;
    var R = CMD$2.R;
    var A = CMD$2.A;
    var Q = CMD$2.Q;

    for (i = 0, j = 0; i < data.length;) {
        cmd = data[i++];
        j = i;
        nPoint = 0;

        switch (cmd) {
            case M:
                nPoint = 1;
                break;
            case L:
                nPoint = 1;
                break;
            case C:
                nPoint = 3;
                break;
            case Q:
                nPoint = 2;
                break;
            case A:
                var x = m[4];
                var y = m[5];
                var sx = mathSqrt$3(m[0] * m[0] + m[1] * m[1]);
                var sy = mathSqrt$3(m[2] * m[2] + m[3] * m[3]);
                var angle = mathAtan2(-m[1] / sy, m[0] / sx);
                // cx
                data[i] *= sx;
                data[i++] += x;
                // cy
                data[i] *= sy;
                data[i++] += y;
                // Scale rx and ry
                // FIXME Assume psi is 0 here
                data[i++] *= sx;
                data[i++] *= sy;

                // Start angle
                data[i++] += angle;
                // end angle
                data[i++] += angle;
                // FIXME psi
                i += 2;
                j = i;
                break;
            case R:
                // x0, y0
                p[0] = data[i++];
                p[1] = data[i++];
                applyTransform(p, p, m);
                data[j++] = p[0];
                data[j++] = p[1];
                // x1, y1
                p[0] += data[i++];
                p[1] += data[i++];
                applyTransform(p, p, m);
                data[j++] = p[0];
                data[j++] = p[1];
        }

        for (k = 0; k < nPoint; k++) {
            var p = points[k];
            p[0] = data[i++];
            p[1] = data[i++];

            applyTransform(p, p, m);
            // Write back
            data[j++] = p[0];
            data[j++] = p[1];
        }
    }
};

// command chars
// var cc = [
//     'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
//     'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
// ];

var mathSqrt = Math.sqrt;
var mathSin$1 = Math.sin;
var mathCos$1 = Math.cos;
var PI = Math.PI;

var vMag = function (v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};
var vRatio = function (u, v) {
    return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
};
var vAngle = function (u, v) {
    return (u[0] * v[1] < u[1] * v[0] ? -1 : 1)
            * Math.acos(vRatio(u, v));
};

function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
    var psi = psiDeg * (PI / 180.0);
    var xp = mathCos$1(psi) * (x1 - x2) / 2.0
                + mathSin$1(psi) * (y1 - y2) / 2.0;
    var yp = -1 * mathSin$1(psi) * (x1 - x2) / 2.0
                + mathCos$1(psi) * (y1 - y2) / 2.0;

    var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

    if (lambda > 1) {
        rx *= mathSqrt(lambda);
        ry *= mathSqrt(lambda);
    }

    var f = (fa === fs ? -1 : 1)
        * mathSqrt((((rx * rx) * (ry * ry))
                - ((rx * rx) * (yp * yp))
                - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp)
                + (ry * ry) * (xp * xp))
            ) || 0;

    var cxp = f * rx * yp / ry;
    var cyp = f * -ry * xp / rx;

    var cx = (x1 + x2) / 2.0
                + mathCos$1(psi) * cxp
                - mathSin$1(psi) * cyp;
    var cy = (y1 + y2) / 2.0
            + mathSin$1(psi) * cxp
            + mathCos$1(psi) * cyp;

    var theta = vAngle([ 1, 0 ], [ (xp - cxp) / rx, (yp - cyp) / ry ]);
    var u = [ (xp - cxp) / rx, (yp - cyp) / ry ];
    var v = [ (-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry ];
    var dTheta = vAngle(u, v);

    if (vRatio(u, v) <= -1) {
        dTheta = PI;
    }
    if (vRatio(u, v) >= 1) {
        dTheta = 0;
    }
    if (fs === 0 && dTheta > 0) {
        dTheta = dTheta - 2 * PI;
    }
    if (fs === 1 && dTheta < 0) {
        dTheta = dTheta + 2 * PI;
    }

    path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
}


var commandReg = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig;
// Consider case:
// (1) delimiter can be comma or space, where continuous commas
// or spaces should be seen as one comma.
// (2) value can be like:
// '2e-4', 'l.5.9' (ignore 0), 'M-10-10', 'l-2.43e-1,34.9983',
// 'l-.5E1,54', '121-23-44-11' (no delimiter)
var numberReg = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
// var valueSplitReg = /[\s,]+/;

function createPathProxyFromString(data) {
    if (!data) {
        return new PathProxy();
    }

    // var data = data.replace(/-/g, ' -')
    //     .replace(/  /g, ' ')
    //     .replace(/ /g, ',')
    //     .replace(/,,/g, ',');

    // var n;
    // create pipes so that we can split the data
    // for (n = 0; n < cc.length; n++) {
    //     cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
    // }

    // data = data.replace(/-/g, ',-');

    // create array
    // var arr = cs.split('|');
    // init context point
    var cpx = 0;
    var cpy = 0;
    var subpathX = cpx;
    var subpathY = cpy;
    var prevCmd;

    var path = new PathProxy();
    var CMD = PathProxy.CMD;

    // commandReg.lastIndex = 0;
    // var cmdResult;
    // while ((cmdResult = commandReg.exec(data)) != null) {
    //     var cmdStr = cmdResult[1];
    //     var cmdContent = cmdResult[2];

    var cmdList = data.match(commandReg);
    for (var l = 0; l < cmdList.length; l++) {
        var cmdText = cmdList[l];
        var cmdStr = cmdText.charAt(0);

        var cmd;

        // String#split is faster a little bit than String#replace or RegExp#exec.
        // var p = cmdContent.split(valueSplitReg);
        // var pLen = 0;
        // for (var i = 0; i < p.length; i++) {
        //     // '' and other invalid str => NaN
        //     var val = parseFloat(p[i]);
        //     !isNaN(val) && (p[pLen++] = val);
        // }

        var p = cmdText.match(numberReg) || [];
        var pLen = p.length;
        for (var i = 0; i < pLen; i++) {
            p[i] = parseFloat(p[i]);
        }

        var off = 0;
        while (off < pLen) {
            var ctlPtx;
            var ctlPty;

            var rx;
            var ry;
            var psi;
            var fa;
            var fs;

            var x1 = cpx;
            var y1 = cpy;

            // convert l, H, h, V, and v to L
            switch (cmdStr) {
                case 'l':
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'L':
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'm':
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.M;
                    path.addData(cmd, cpx, cpy);
                    subpathX = cpx;
                    subpathY = cpy;
                    cmdStr = 'l';
                    break;
                case 'M':
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.M;
                    path.addData(cmd, cpx, cpy);
                    subpathX = cpx;
                    subpathY = cpy;
                    cmdStr = 'L';
                    break;
                case 'h':
                    cpx += p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'H':
                    cpx = p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'v':
                    cpy += p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'V':
                    cpy = p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'C':
                    cmd = CMD.C;
                    path.addData(
                        cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]
                    );
                    cpx = p[off - 2];
                    cpy = p[off - 1];
                    break;
                case 'c':
                    cmd = CMD.C;
                    path.addData(
                        cmd,
                        p[off++] + cpx, p[off++] + cpy,
                        p[off++] + cpx, p[off++] + cpy,
                        p[off++] + cpx, p[off++] + cpy
                    );
                    cpx += p[off - 2];
                    cpy += p[off - 1];
                    break;
                case 'S':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.C) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cmd = CMD.C;
                    x1 = p[off++];
                    y1 = p[off++];
                    cpx = p[off++];
                    cpy = p[off++];
                    path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                    break;
                case 's':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.C) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cmd = CMD.C;
                    x1 = cpx + p[off++];
                    y1 = cpy + p[off++];
                    cpx += p[off++];
                    cpy += p[off++];
                    path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                    break;
                case 'Q':
                    x1 = p[off++];
                    y1 = p[off++];
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, x1, y1, cpx, cpy);
                    break;
                case 'q':
                    x1 = p[off++] + cpx;
                    y1 = p[off++] + cpy;
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, x1, y1, cpx, cpy);
                    break;
                case 'T':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.Q) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 't':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.Q) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 'A':
                    rx = p[off++];
                    ry = p[off++];
                    psi = p[off++];
                    fa = p[off++];
                    fs = p[off++];

                    x1 = cpx, y1 = cpy;
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.A;
                    processArc(
                        x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
                    );
                    break;
                case 'a':
                    rx = p[off++];
                    ry = p[off++];
                    psi = p[off++];
                    fa = p[off++];
                    fs = p[off++];

                    x1 = cpx, y1 = cpy;
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.A;
                    processArc(
                        x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
                    );
                    break;
            }
        }

        if (cmdStr === 'z' || cmdStr === 'Z') {
            cmd = CMD.Z;
            path.addData(cmd);
            // z may be in the middle of the path.
            cpx = subpathX;
            cpy = subpathY;
        }

        prevCmd = cmd;
    }

    path.toStatic();

    return path;
}

// TODO Optimize double memory cost problem
function createPathOptions(str, opts) {
    var pathProxy = createPathProxyFromString(str);
    opts = opts || {};
    opts.buildPath = function (path) {
        if (path.setData) {
            path.setData(pathProxy.data);
            // Svg and vml renderer don't have context
            var ctx = path.getContext();
            if (ctx) {
                path.rebuildPath(ctx);
            }
        }
        else {
            var ctx = path;
            pathProxy.rebuildPath(ctx);
        }
    };

    opts.applyTransform = function (m) {
        transformPath(pathProxy, m);
        this.dirty(true);
    };

    return opts;
}

/**
 * Create a Path object from path string data
 * http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {Object} opts Other options
 */
function createFromString(str, opts) {
    return new Path(createPathOptions(str, opts));
}

/**
 * Merge multiple paths
 */
// TODO Apply transform
// TODO stroke dash
// TODO Optimize double memory cost problem
function mergePath(pathEls, opts) {
    var pathList = [];
    var len = pathEls.length;
    for (var i = 0; i < len; i++) {
        var pathEl = pathEls[i];
        if (!pathEl.path) {
            pathEl.createPathProxy();
        }
        if (pathEl.__dirtyPath) {
            pathEl.buildPath(pathEl.path, pathEl.shape, true);
        }
        pathList.push(pathEl.path);
    }

    var pathBundle = new Path(opts);
    // Need path proxy.
    pathBundle.createPathProxy();
    pathBundle.buildPath = function (path) {
        path.appendPath(pathList);
        // Svg and vml renderer don't have context
        var ctx = path.getContext();
        if (ctx) {
            path.rebuildPath(ctx);
        }
    };

    return pathBundle;
}

var pathUtil = (Object.freeze || Object)({
	createFromString: createFromString,
	mergePath: mergePath
});

/**
 * @class zrender.graphic.Text
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class Text extends Displayable{
    /**
     * @method constructor Text
     * @param {Object} opts 
     */
    constructor(opts){
        super(opts);
        /**
         * @property {String} type
         */
        this.type='text';
    }

    brush(ctx, prevEl) {
        let style = this.style;

        // Optimize, avoid normalize every time.
        this.__dirty && normalizeTextStyle(style, true);

        // Use props with prefix 'text'.
        style.fill = style.stroke = style.shadowBlur = style.shadowColor =
            style.shadowOffsetX = style.shadowOffsetY = null;

        let text = style.text;
        // Convert to string
        text != null && (text += '');

        // Do not apply style.bind in Text node. Because the real bind job
        // is in textUtil.renderText, and performance of text render should
        // be considered.
        // style.bind(ctx, this, prevEl);

        if (!needDrawText(text, style)) {
            // The current el.style is not applied
            // and should not be used as cache.
            ctx.__attrCachedBy = ContextCachedBy.NONE;
            return;
        }

        this.setTransform(ctx);

        renderText(this, ctx, text, style, null, prevEl);

        this.restoreTransform(ctx);
    }

    getBoundingRect() {
        let style = this.style;
        // Optimize, avoid normalize every time.
        this.__dirty && normalizeTextStyle(style, true);
        if (!this._rect) {
            let text = style.text;
            text != null ? (text += '') : (text = '');
            let rect = getBoundingRect(
                style.text + '',
                style.font,
                style.textAlign,
                style.textVerticalAlign,
                style.textPadding,
                style.textLineHeight,
                style.rich
            );
            rect.x += style.x || 0;
            rect.y += style.y || 0;
            if (getStroke(style.textStroke, style.textStrokeWidth)) {
                let w = style.textStrokeWidth;
                rect.x -= w / 2;
                rect.y -= w / 2;
                rect.width += w;
                rect.height += w;
            }
            this._rect = rect;
        }
        return this._rect;
    }
}

/**
 * @class zrender.graphic.shape.Circle 
 * 圆形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'circle',
    shape: {
        cx: 0,
        cy: 0,
        r: 0
    }
};

class Circle extends Path{
    /**
     * @method constructor Rect
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape, inBundle) {
        // Better stroking in ShapeBundle
        // Always do it may have performence issue ( fill may be 2x more cost)
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        // else {
        //     if (ctx.allocate && !ctx.data.length) {
        //         ctx.allocate(ctx.CMD_MEM_SIZE.A);
        //     }
        // }
        // Better stroking in ShapeBundle
        // ctx.moveTo(shape.cx + shape.r, shape.cy);
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    }
}

/**
 * Sub-pixel optimize for canvas rendering, prevent from blur
 * when rendering a thin vertical/horizontal line.
 */

var round = Math.round;

/**
 * Sub pixel optimize line for canvas
 *
 * @param {Object} outputShape The modification will be performed on `outputShape`.
 *                 `outputShape` and `inputShape` can be the same object.
 *                 `outputShape` object can be used repeatly, because all of
 *                 the `x1`, `x2`, `y1`, `y2` will be assigned in this method.
 * @param {Object} [inputShape]
 * @param {Number} [inputShape.x1]
 * @param {Number} [inputShape.y1]
 * @param {Number} [inputShape.x2]
 * @param {Number} [inputShape.y2]
 * @param {Object} [style]
 * @param {Number} [style.lineWidth]
 */
function subPixelOptimizeLine(outputShape, inputShape, style) {
    var lineWidth = style && style.lineWidth;

    if (!inputShape || !lineWidth) {
        return;
    }

    var x1 = inputShape.x1;
    var x2 = inputShape.x2;
    var y1 = inputShape.y1;
    var y2 = inputShape.y2;

    if (round(x1 * 2) === round(x2 * 2)) {
        outputShape.x1 = outputShape.x2 = subPixelOptimize(x1, lineWidth, true);
    }
    else {
        outputShape.x1 = x1;
        outputShape.x2 = x2;
    }
    if (round(y1 * 2) === round(y2 * 2)) {
        outputShape.y1 = outputShape.y2 = subPixelOptimize(y1, lineWidth, true);
    }
    else {
        outputShape.y1 = y1;
        outputShape.y2 = y2;
    }
}

/**
 * Sub pixel optimize rect for canvas
 *
 * @param {Object} outputShape The modification will be performed on `outputShape`.
 *                 `outputShape` and `inputShape` can be the same object.
 *                 `outputShape` object can be used repeatly, because all of
 *                 the `x`, `y`, `width`, `height` will be assigned in this method.
 * @param {Object} [inputShape]
 * @param {Number} [inputShape.x]
 * @param {Number} [inputShape.y]
 * @param {Number} [inputShape.width]
 * @param {Number} [inputShape.height]
 * @param {Object} [style]
 * @param {Number} [style.lineWidth]
 */
function subPixelOptimizeRect(outputShape, inputShape, style) {
    var lineWidth = style && style.lineWidth;

    if (!inputShape || !lineWidth) {
        return;
    }

    var originX = inputShape.x;
    var originY = inputShape.y;
    var originWidth = inputShape.width;
    var originHeight = inputShape.height;

    outputShape.x = subPixelOptimize(originX, lineWidth, true);
    outputShape.y = subPixelOptimize(originY, lineWidth, true);
    outputShape.width = Math.max(
        subPixelOptimize(originX + originWidth, lineWidth, false) - outputShape.x,
        originWidth === 0 ? 0 : 1
    );
    outputShape.height = Math.max(
        subPixelOptimize(originY + originHeight, lineWidth, false) - outputShape.y,
        originHeight === 0 ? 0 : 1
    );
}

/**
 * Sub pixel optimize for canvas
 *
 * @param {Number} position Coordinate, such as x, y
 * @param {Number} lineWidth Should be nonnegative integer.
 * @param {boolean=} positiveOrNegative Default false (negative).
 * @return {Number} Optimized position.
 */
function subPixelOptimize(position, lineWidth, positiveOrNegative) {
    // Assure that (position + lineWidth / 2) is near integer edge,
    // otherwise line will be fuzzy in canvas.
    var doubledPosition = round(position * 2);
    return (doubledPosition + round(lineWidth)) % 2 === 0
        ? doubledPosition / 2
        : (doubledPosition + (positiveOrNegative ? 1 : -1)) / 2;
}

/**
 * @class zrender.graphic.shape.Rect 
 * 矩形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
// Avoid create repeatly.
let subPixelOptimizeOutputShape = {};

let defaultConfig$1={
    /**
     * @property {String} type
     */
    type: 'rect',
    shape: {
        // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
        // r缩写为1         相当于 [1, 1, 1, 1]
        // r缩写为[1]       相当于 [1, 1, 1, 1]
        // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
        // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
        r: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
};

class Rect extends Path{
    /**
     * @method constructor Rect
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$1,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x;
        let y;
        let width;
        let height;

        if (this.subPixelOptimize) {
            subPixelOptimizeRect(subPixelOptimizeOutputShape, shape, this.style);
            x = subPixelOptimizeOutputShape.x;
            y = subPixelOptimizeOutputShape.y;
            width = subPixelOptimizeOutputShape.width;
            height = subPixelOptimizeOutputShape.height;
            subPixelOptimizeOutputShape.r = shape.r;
            shape = subPixelOptimizeOutputShape;
        }else {
            x = shape.x;
            y = shape.y;
            width = shape.width;
            height = shape.height;
        }

        if (!shape.r) {
            ctx.rect(x, y, width, height);
        }else {
            buildPath(ctx, shape);
        }
        
        ctx.closePath();
        return;
    }
}

/**
 * @class zrender.graphic.shape.Ellipse 
 * 椭圆形状
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$2={
    /**
     * @property {String} type
     */
    type: 'ellipse',

    shape: {
        cx: 0, cy: 0,
        rx: 0, ry: 0
    }
};

class Droplet extends Path{
    /**
     * @method constructor Droplet
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$2,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let k = 0.5522848;
        let x = shape.cx;
        let y = shape.cy;
        let a = shape.rx;
        let b = shape.ry;
        let ox = a * k; // 水平控制点偏移量
        let oy = b * k; // 垂直控制点偏移量
        // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
        ctx.moveTo(x - a, y);
        ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
        ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
        ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
        ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
        ctx.closePath();
    }
}

/**
 * @class zrender.graphic.shape.Line 
 * 直线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
//TODO:Avoid create repeatly.
let defaultConfig$3={
    /**
     * @property {String} type
     */
    type: 'line',
    shape: {
        // Start point
        x1: 0,
        y1: 0,
        // End point
        x2: 0,
        y2: 0,

        percent: 1
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

class Line extends Path{
    /**
     * @method constructor Line
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$3,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x1;
        let y1;
        let x2;
        let y2;

        if (this.subPixelOptimize) {
            let subPixelOptimizeOutputShape={};
            subPixelOptimizeLine(subPixelOptimizeOutputShape, shape, this.style);
            x1 = subPixelOptimizeOutputShape.x1;
            y1 = subPixelOptimizeOutputShape.y1;
            x2 = subPixelOptimizeOutputShape.x2;
            y2 = subPixelOptimizeOutputShape.y2;
        }else {
            x1 = shape.x1;
            y1 = shape.y1;
            x2 = shape.x2;
            y2 = shape.y2;
        }

        let percent = shape.percent;

        if (percent === 0) {
            return;
        }

        ctx.moveTo(x1, y1);

        if (percent < 1) {
            x2 = x1 * (1 - percent) + x2 * percent;
            y2 = y1 * (1 - percent) + y2 * percent;
        }
        ctx.lineTo(x2, y2);
    }

    /**
     * Get point at percent
     * @param  {Number} percent
     * @return {Array<Number>}
     */
    pointAt(p) {
        let shape = this.shape;
        return [
            shape.x1 * (1 - p) + shape.x2 * p,
            shape.y1 * (1 - p) + shape.y2 * p
        ];
    }
}

/**
 * Catmull-Rom spline 插值折线
 * @module zrender/shape/util/smoothSpline
 * @author pissang (https://www.github.com/pissang)
 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 */

/**
 * @inner
 */
function interpolate(p0, p1, p2, p3, t, t2, t3) {
    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    return (2 * (p1 - p2) + v0 + v1) * t3
            + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
            + v0 * t + p1;
}

/**
 * @alias module:zrender/shape/util/smoothSpline
 * @param {Array} points 线段顶点数组
 * @param {boolean} isLoop
 * @return {Array}
 */
var smoothSpline = function (points, isLoop) {
    var len$$1 = points.length;
    var ret = [];

    var distance$$1 = 0;
    for (var i = 1; i < len$$1; i++) {
        distance$$1 += distance(points[i - 1], points[i]);
    }

    var segs = distance$$1 / 2;
    segs = segs < len$$1 ? len$$1 : segs;
    for (var i = 0; i < segs; i++) {
        var pos = i / (segs - 1) * (isLoop ? len$$1 : len$$1 - 1);
        var idx = Math.floor(pos);

        var w = pos - idx;

        var p0;
        var p1 = points[idx % len$$1];
        var p2;
        var p3;
        if (!isLoop) {
            p0 = points[idx === 0 ? idx : idx - 1];
            p2 = points[idx > len$$1 - 2 ? len$$1 - 1 : idx + 1];
            p3 = points[idx > len$$1 - 3 ? len$$1 - 1 : idx + 2];
        }
        else {
            p0 = points[(idx - 1 + len$$1) % len$$1];
            p2 = points[(idx + 1) % len$$1];
            p3 = points[(idx + 2) % len$$1];
        }

        var w2 = w * w;
        var w3 = w * w2;

        ret.push([
            interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
            interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
        ]);
    }
    return ret;
};

/**
 * 贝塞尔平滑曲线
 * @module zrender/shape/util/smoothBezier
 * @author pissang (https://www.github.com/pissang)
 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 */

/**
 * 贝塞尔平滑曲线
 * @alias module:zrender/shape/util/smoothBezier
 * @param {Array} points 线段顶点数组
 * @param {Number} smooth 平滑等级, 0-1
 * @param {boolean} isLoop
 * @param {Array} constraint 将计算出来的控制点约束在一个包围盒内
 *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
 *                           整个折线的包围盒做一个并集用来约束控制点。
 * @param {Array} 计算出来的控制点数组
 */
var smoothBezier = function (points, smooth, isLoop, constraint) {
    var cps = [];

    var v = [];
    var v1 = [];
    var v2 = [];
    var prevPoint;
    var nextPoint;

    var min$$1;
    var max$$1;
    if (constraint) {
        min$$1 = [Infinity, Infinity];
        max$$1 = [-Infinity, -Infinity];
        for (var i = 0, len$$1 = points.length; i < len$$1; i++) {
            min(min$$1, min$$1, points[i]);
            max(max$$1, max$$1, points[i]);
        }
        // 与指定的包围盒做并集
        min(min$$1, min$$1, constraint[0]);
        max(max$$1, max$$1, constraint[1]);
    }

    for (var i = 0, len$$1 = points.length; i < len$$1; i++) {
        var point = points[i];

        if (isLoop) {
            prevPoint = points[i ? i - 1 : len$$1 - 1];
            nextPoint = points[(i + 1) % len$$1];
        }
        else {
            if (i === 0 || i === len$$1 - 1) {
                cps.push(clone$1(points[i]));
                continue;
            }
            else {
                prevPoint = points[i - 1];
                nextPoint = points[i + 1];
            }
        }

        sub(v, nextPoint, prevPoint);

        // use degree to scale the handle length
        scale(v, v, smooth);

        var d0 = distance(point, prevPoint);
        var d1 = distance(point, nextPoint);
        var sum = d0 + d1;
        if (sum !== 0) {
            d0 /= sum;
            d1 /= sum;
        }

        scale(v1, v, -d0);
        scale(v2, v, d1);
        var cp0 = add([], point, v1);
        var cp1 = add([], point, v2);
        if (constraint) {
            max(cp0, cp0, min$$1);
            min(cp0, cp0, max$$1);
            max(cp1, cp1, min$$1);
            min(cp1, cp1, max$$1);
        }
        cps.push(cp0);
        cps.push(cp1);
    }

    if (isLoop) {
        cps.push(cps.shift());
    }

    return cps;
};

function buildPath$1(ctx, shape, closePath) {
    var points = shape.points;
    var smooth = shape.smooth;
    if (points && points.length >= 2) {
        if (smooth && smooth !== 'spline') {
            var controlPoints = smoothBezier(
                points, smooth, closePath, shape.smoothConstraint
            );

            ctx.moveTo(points[0][0], points[0][1]);
            var len = points.length;
            for (var i = 0; i < (closePath ? len : len - 1); i++) {
                var cp1 = controlPoints[i * 2];
                var cp2 = controlPoints[i * 2 + 1];
                var p = points[(i + 1) % len];
                ctx.bezierCurveTo(
                    cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]
                );
            }
        }
        else {
            if (smooth === 'spline') {
                points = smoothSpline(points, closePath);
            }

            ctx.moveTo(points[0][0], points[0][1]);
            for (var i = 1, l = points.length; i < l; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
        }

        closePath && ctx.closePath();
    }
}

/**
 * @class zrender.graphic.shape.Polygon 
 * 多边形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$4={
    /**
     * @property {String} type
     */
    type: 'polygon',
    shape: {
        points: null,
        smooth: false,
        smoothConstraint: null
    }
};

class Polygon extends Path{
    /**
     * @method constructor Polygon
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$4,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        buildPath$1(ctx, shape, true);
    }
}

/**
 * @class zrender.graphic.shape.Polyline 
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$5={
    /**
     * @property {String} type
     */
    type: 'polyline',
    shape: {
        points: null,
        smooth: false,
        smoothConstraint: null
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

class Polyline extends Path{
    /**
     * @method constructor Polyline
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$5,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        buildPath$1(ctx, shape, false);
    }
}

/**
 * @class zrender.graphic.gradient.Gradient 
 * 渐变
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
/**
 * @method constructor Gradient
 * @param {Array<Object>} colorStops
 */
var Gradient = function (colorStops) {
    this.colorStops = colorStops || [];
};

Gradient.prototype = {
    constructor: Gradient,
    addColorStop: function (offset, color) {
        this.colorStops.push({
            offset: offset,
            color: color
        });
    }
};

/**
 * @class zrender.graphic.gradient.LinearGradient 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor LinearGradient
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [x2=1]
 * @param {Number} [y2=0]
 * @param {Array<Object>} colorStops
 * @param {boolean} [globalCoord=false]
 */
var LinearGradient = function (x, y, x2, y2, colorStops, globalCoord) {
    // Should do nothing more in this constructor. Because gradient can be
    // declard by `color: {type: 'linear', colorStops: ...}`, where
    // this constructor will not be called.
    this.x = x == null ? 0 : x;
    this.y = y == null ? 0 : y;
    this.x2 = x2 == null ? 1 : x2;
    this.y2 = y2 == null ? 0 : y2;
    // Can be cloned
    this.type = 'linear';
    // If use global coord
    this.global = globalCoord || false;
    Gradient.call(this, colorStops);
};

LinearGradient.prototype = {
    constructor: LinearGradient
};

inherits(LinearGradient, Gradient);

// Most of the values can be separated by comma and/or white space.
let DILIMITER_REG = /[\s,]+/;

/**
 * For big svg string, this method might be time consuming.
 * //TODO:try to move this into webworker.
 * @param {String} svg xml string
 * @return {Object} xml root.
 */
function parseXML(svg) {
    if (isString(svg)) {
        let parser = new DOMParser();
        svg = parser.parseFromString(svg, 'text/xml');
    }

    // Document node. If using $.get, doc node may be input.
    if (svg.nodeType === 9) {
        svg = svg.firstChild;
    }
    // nodeName of <!DOCTYPE svg> is also 'svg'.
    while (svg.nodeName.toLowerCase() !== 'svg' || svg.nodeType !== 1) {
        svg = svg.nextSibling;
    }

    return svg;
}

/**
 * @class zrender.svg.SVGParser
 * 
 * This is a tool class for parsing SVG xml string to standard shape classes.
 * 
 * 这是一个工具类，用来把 SVG 格式的 xml 解析成 graphic 包中定义的标准类。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

function SVGParser() {
    this._defs = {};
    this._root = null;
    this._isDefine = false;
    this._isText = false;
}

SVGParser.prototype={
    constructor:SVGParser,
    parse:function (xml, opt) {
        opt = opt || {};
    
        let svg = parseXML(xml);
    
        if (!svg) {
            throw new Error('Illegal svg');
        }
    
        let root = new Group();
        this._root = root;
        // parse view port
        let viewBox = svg.getAttribute('viewBox') || '';
    
        // If width/height not specified, means "100%" of `opt.width/height`.
        // TODO: Other percent value not supported yet.
        let width = parseFloat(svg.getAttribute('width') || opt.width);
        let height = parseFloat(svg.getAttribute('height') || opt.height);
        // If width/height not specified, set as null for output.
        isNaN(width) && (width = null);
        isNaN(height) && (height = null);
    
        // Apply inline style on svg element.
        parseAttributes(svg, root, null, true);
    
        let child = svg.firstChild;
        while (child) {
            this._parseNode(child, root);
            child = child.nextSibling;
        }
    
        let viewBoxRect;
        let viewBoxTransform;
    
        if (viewBox) {
            let viewBoxArr = trim(viewBox).split(DILIMITER_REG);
            // Some invalid case like viewBox: 'none'.
            if (viewBoxArr.length >= 4) {
                viewBoxRect = {
                    x: parseFloat(viewBoxArr[0] || 0),
                    y: parseFloat(viewBoxArr[1] || 0),
                    width: parseFloat(viewBoxArr[2]),
                    height: parseFloat(viewBoxArr[3])
                };
            }
        }
    
        if (viewBoxRect && width != null && height != null) {
            viewBoxTransform = makeViewBoxTransform(viewBoxRect, width, height);
    
            if (!opt.ignoreViewBox) {
                // If set transform on the output group, it probably bring trouble when
                // some users only intend to show the clipped content inside the viewBox,
                // but not intend to transform the output group. So we keep the output
                // group no transform. If the user intend to use the viewBox as a
                // camera, just set `opt.ignoreViewBox` as `true` and set transfrom
                // manually according to the viewBox info in the output of this method.
                let elRoot = root;
                root = new Group();
                root.add(elRoot);
                elRoot.scale = viewBoxTransform.scale.slice();
                elRoot.position = viewBoxTransform.position.slice();
            }
        }
    
        // Some shapes might be overflow the viewport, which should be
        // clipped despite whether the viewBox is used, as the SVG does.
        if (!opt.ignoreRootClip && width != null && height != null) {
            root.setClipPath(new Rect({
                shape: {x: 0, y: 0, width: width, height: height}
            }));
        }
    
        // Set width/height on group just for output the viewport size.
        return {
            root: root,
            width: width,
            height: height,
            viewBoxRect: viewBoxRect,
            viewBoxTransform: viewBoxTransform
        };
    },
    _parseNode:function (xmlNode, parentGroup) {
        let nodeName = xmlNode.nodeName.toLowerCase();
        // TODO
        // support <style>...</style> in svg, where nodeName is 'style',
        // CSS classes is defined globally wherever the style tags are declared.
        if (nodeName === 'defs') {
            // define flag
            this._isDefine = true;
        }else if (nodeName === 'text') {
            this._isText = true;
        }
    
        let el;
        if (this._isDefine) {
            let parser = defineParsers[nodeName];
            if (parser) {
                let def = parser.call(this, xmlNode);
                let id = xmlNode.getAttribute('id');
                if (id) {
                    this._defs[id] = def;
                }
            }
        }else {
            let parser = nodeParsers[nodeName];
            if (parser) {
                el = parser.call(this, xmlNode, parentGroup);
                parentGroup.add(el);
            }
        }
    
        let child = xmlNode.firstChild;
        while (child) {
            if (child.nodeType === 1) {
                this._parseNode(child, el);
            }
            // Is text
            if (child.nodeType === 3 && this._isText) {
                this._parseText(child, el);
            }
            child = child.nextSibling;
        }
    
        // Quit define
        if (nodeName === 'defs') {
            this._isDefine = false;
        }else if (nodeName === 'text') {
            this._isText = false;
        }
    },
    _parseText:function (xmlNode, parentGroup) {
        if (xmlNode.nodeType === 1) {
            let dx = xmlNode.getAttribute('dx') || 0;
            let dy = xmlNode.getAttribute('dy') || 0;
            this._textX += parseFloat(dx);
            this._textY += parseFloat(dy);
        }
    
        let text = new Text({
            style: {
                text: xmlNode.textContent,
                transformText: true
            },
            position: [this._textX || 0, this._textY || 0]
        });
    
        inheritStyle(parentGroup, text);
        parseAttributes(xmlNode, text, this._defs);
    
        let fontSize = text.style.fontSize;
        if (fontSize && fontSize < 9) {
            // PENDING
            text.style.fontSize = 9;
            text.scale = text.scale || [1, 1];
            text.scale[0] *= fontSize / 9;
            text.scale[1] *= fontSize / 9;
        }

        let rect = text.getBoundingRect();
        this._textX += rect.width;
        parentGroup.add(text);
        return text;
    }
};

let nodeParsers = {
    'g': function (xmlNode, parentGroup) {
        let g = new Group();
        inheritStyle(parentGroup, g);
        parseAttributes(xmlNode, g, this._defs);

        return g;
    },
    'rect': function (xmlNode, parentGroup) {
        let rect = new Rect();
        inheritStyle(parentGroup, rect);
        parseAttributes(xmlNode, rect, this._defs);

        rect.setShape({
            x: parseFloat(xmlNode.getAttribute('x') || 0),
            y: parseFloat(xmlNode.getAttribute('y') || 0),
            width: parseFloat(xmlNode.getAttribute('width') || 0),
            height: parseFloat(xmlNode.getAttribute('height') || 0)
        });

        // console.log(xmlNode.getAttribute('transform'));
        // console.log(rect.transform);

        return rect;
    },
    'circle': function (xmlNode, parentGroup) {
        let circle = new Circle();
        inheritStyle(parentGroup, circle);
        parseAttributes(xmlNode, circle, this._defs);

        circle.setShape({
            cx: parseFloat(xmlNode.getAttribute('cx') || 0),
            cy: parseFloat(xmlNode.getAttribute('cy') || 0),
            r: parseFloat(xmlNode.getAttribute('r') || 0)
        });

        return circle;
    },
    'line': function (xmlNode, parentGroup) {
        let line = new Line();
        inheritStyle(parentGroup, line);
        parseAttributes(xmlNode, line, this._defs);

        line.setShape({
            x1: parseFloat(xmlNode.getAttribute('x1') || 0),
            y1: parseFloat(xmlNode.getAttribute('y1') || 0),
            x2: parseFloat(xmlNode.getAttribute('x2') || 0),
            y2: parseFloat(xmlNode.getAttribute('y2') || 0)
        });

        return line;
    },
    'ellipse': function (xmlNode, parentGroup) {
        let ellipse = new Droplet();
        inheritStyle(parentGroup, ellipse);
        parseAttributes(xmlNode, ellipse, this._defs);

        ellipse.setShape({
            cx: parseFloat(xmlNode.getAttribute('cx') || 0),
            cy: parseFloat(xmlNode.getAttribute('cy') || 0),
            rx: parseFloat(xmlNode.getAttribute('rx') || 0),
            ry: parseFloat(xmlNode.getAttribute('ry') || 0)
        });
        return ellipse;
    },
    'polygon': function (xmlNode, parentGroup) {
        let points = xmlNode.getAttribute('points');
        if (points) {
            points = parsePoints(points);
        }
        let polygon = new Polygon({
            shape: {
                points: points || []
            }
        });

        inheritStyle(parentGroup, polygon);
        parseAttributes(xmlNode, polygon, this._defs);

        return polygon;
    },
    'polyline': function (xmlNode, parentGroup) {
        let path = new Path();
        inheritStyle(parentGroup, path);
        parseAttributes(xmlNode, path, this._defs);

        let points = xmlNode.getAttribute('points');
        if (points) {
            points = parsePoints(points);
        }
        let polyline = new Polyline({
            shape: {
                points: points || []
            }
        });

        return polyline;
    },
    'image': function (xmlNode, parentGroup) {
        let img = new ZImage();
        inheritStyle(parentGroup, img);
        parseAttributes(xmlNode, img, this._defs);

        img.setStyle({
            image: xmlNode.getAttribute('xlink:href'),
            x: xmlNode.getAttribute('x'),
            y: xmlNode.getAttribute('y'),
            width: xmlNode.getAttribute('width'),
            height: xmlNode.getAttribute('height')
        });

        return img;
    },
    'text': function (xmlNode, parentGroup) {
        let x = xmlNode.getAttribute('x') || 0;
        let y = xmlNode.getAttribute('y') || 0;
        let dx = xmlNode.getAttribute('dx') || 0;
        let dy = xmlNode.getAttribute('dy') || 0;

        this._textX = parseFloat(x) + parseFloat(dx);
        this._textY = parseFloat(y) + parseFloat(dy);

        let g = new Group();
        inheritStyle(parentGroup, g);
        parseAttributes(xmlNode, g, this._defs);

        return g;
    },
    'tspan': function (xmlNode, parentGroup) {
        let x = xmlNode.getAttribute('x');
        let y = xmlNode.getAttribute('y');
        if (x != null) {
            // new offset x
            this._textX = parseFloat(x);
        }
        if (y != null) {
            // new offset y
            this._textY = parseFloat(y);
        }
        let dx = xmlNode.getAttribute('dx') || 0;
        let dy = xmlNode.getAttribute('dy') || 0;

        let g = new Group();

        inheritStyle(parentGroup, g);
        parseAttributes(xmlNode, g, this._defs);


        this._textX += dx;
        this._textY += dy;

        return g;
    },
    'path': function (xmlNode, parentGroup) {
        // TODO svg fill rule
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-rule
        // path.style.globalCompositeOperation = 'xor';
        let d = xmlNode.getAttribute('d') || '';

        // Performance sensitive.

        let path = createFromString(d);

        inheritStyle(parentGroup, path);
        parseAttributes(xmlNode, path, this._defs);

        return path;
    }
};

let defineParsers = {

    'lineargradient': function (xmlNode) {
        let x1 = parseInt(xmlNode.getAttribute('x1') || 0, 10);
        let y1 = parseInt(xmlNode.getAttribute('y1') || 0, 10);
        let x2 = parseInt(xmlNode.getAttribute('x2') || 10, 10);
        let y2 = parseInt(xmlNode.getAttribute('y2') || 0, 10);

        let gradient = new LinearGradient(x1, y1, x2, y2);

        _parseGradientColorStops(xmlNode, gradient);

        return gradient;
    },

    'radialgradient': function (xmlNode) {

    }
};

function _parseGradientColorStops(xmlNode, gradient) {

    let stop = xmlNode.firstChild;

    while (stop) {
        if (stop.nodeType === 1) {
            let offset = stop.getAttribute('offset');
            if (offset.indexOf('%') > 0) {  // percentage
                offset = parseInt(offset, 10) / 100;
            }
            else if (offset) {    // number from 0 to 1
                offset = parseFloat(offset);
            }
            else {
                offset = 0;
            }

            let stopColor = stop.getAttribute('stop-color') || '#000000';

            gradient.addColorStop(offset, stopColor);
        }
        stop = stop.nextSibling;
    }
}

function inheritStyle(parent, child) {
    if (parent && parent.__inheritedStyle) {
        if (!child.__inheritedStyle) {
            child.__inheritedStyle = {};
        }
        defaults(child.__inheritedStyle, parent.__inheritedStyle);
    }
}

function parsePoints(pointsString) {
    let list = trim(pointsString).split(DILIMITER_REG);
    let points = [];

    for (let i = 0; i < list.length; i += 2) {
        let x = parseFloat(list[i]);
        let y = parseFloat(list[i + 1]);
        points.push([x, y]);
    }
    return points;
}

let attributesMap = {
    'fill': 'fill',
    'stroke': 'stroke',
    'stroke-width': 'lineWidth',
    'opacity': 'opacity',
    'fill-opacity': 'fillOpacity',
    'stroke-opacity': 'strokeOpacity',
    'stroke-dasharray': 'lineDash',
    'stroke-dashoffset': 'lineDashOffset',
    'stroke-linecap': 'lineCap',
    'stroke-linejoin': 'lineJoin',
    'stroke-miterlimit': 'miterLimit',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-style': 'fontStyle',
    'font-weight': 'fontWeight',

    'text-align': 'textAlign',
    'alignment-baseline': 'textBaseline'
};

function parseAttributes(xmlNode, el, defs, onlyInlineStyle) {
    let zrStyle = el.__inheritedStyle || {};
    let isTextEl = el.type === 'text';

    // TODO Shadow
    if (xmlNode.nodeType === 1) {
        parseTransformAttribute(xmlNode, el);

        extend(zrStyle, parseStyleAttribute(xmlNode));

        if (!onlyInlineStyle) {
            for (let svgAttrName in attributesMap) {
                if (attributesMap.hasOwnProperty(svgAttrName)) {
                    let attrValue = xmlNode.getAttribute(svgAttrName);
                    if (attrValue != null) {
                        zrStyle[attributesMap[svgAttrName]] = attrValue;
                    }
                }
            }
        }
    }

    let elFillProp = isTextEl ? 'textFill' : 'fill';
    let elStrokeProp = isTextEl ? 'textStroke' : 'stroke';

    el.style = el.style || new Style();
    let elStyle = el.style;

    zrStyle.fill != null && elStyle.set(elFillProp, getPaint(zrStyle.fill, defs));
    zrStyle.stroke != null && elStyle.set(elStrokeProp, getPaint(zrStyle.stroke, defs));

    each([
        'lineWidth', 'opacity', 'fillOpacity', 'strokeOpacity', 'miterLimit', 'fontSize'
    ], function (propName) {
        let elPropName = (propName === 'lineWidth' && isTextEl) ? 'textStrokeWidth' : propName;
        zrStyle[propName] != null && elStyle.set(elPropName, parseFloat(zrStyle[propName]));
    });

    if (!zrStyle.textBaseline || zrStyle.textBaseline === 'auto') {
        zrStyle.textBaseline = 'alphabetic';
    }
    if (zrStyle.textBaseline === 'alphabetic') {
        zrStyle.textBaseline = 'bottom';
    }
    if (zrStyle.textAlign === 'start') {
        zrStyle.textAlign = 'left';
    }
    if (zrStyle.textAlign === 'end') {
        zrStyle.textAlign = 'right';
    }

    each(['lineDashOffset', 'lineCap', 'lineJoin',
        'fontWeight', 'fontFamily', 'fontStyle', 'textAlign', 'textBaseline'
    ], function (propName) {
        zrStyle[propName] != null && elStyle.set(propName, zrStyle[propName]);
    });

    if (zrStyle.lineDash) {
        el.style.lineDash = trim(zrStyle.lineDash).split(DILIMITER_REG);
    }

    if (elStyle[elStrokeProp] && elStyle[elStrokeProp] !== 'none') {
        // enable stroke
        el[elStrokeProp] = true;
    }

    el.__inheritedStyle = zrStyle;
}

let urlRegex = /url\(\s*#(.*?)\)/;
function getPaint(str, defs) {
    // if (str === 'none') {
    //     return;
    // }
    let urlMatch = defs && str && str.match(urlRegex);
    if (urlMatch) {
        let url = trim(urlMatch[1]);
        let def = defs[url];
        return def;
    }
    return str;
}

let transformRegex = /(translate|scale|rotate|skewX|skewY|matrix)\(([\-\s0-9\.e,]*)\)/g;

function parseTransformAttribute(xmlNode, node) {
    let transform = xmlNode.getAttribute('transform');
    if (transform) {
        transform = transform.replace(/,/g, ' ');
        let m = null;
        let transformOps = [];
        transform.replace(transformRegex, function (str, type, value) {
            transformOps.push(type, value);
        });
        for (let i = transformOps.length - 1; i > 0; i -= 2) {
            let value = transformOps[i];
            let type = transformOps[i - 1];
            m = m || create$1();
            switch (type) {
                case 'translate':
                    value = trim(value).split(DILIMITER_REG);
                    translate(m, m, [parseFloat(value[0]), parseFloat(value[1] || 0)]);
                    break;
                case 'scale':
                    value = trim(value).split(DILIMITER_REG);
                    scale$1(m, m, [parseFloat(value[0]), parseFloat(value[1] || value[0])]);
                    break;
                case 'rotate':
                    value = trim(value).split(DILIMITER_REG);
                    rotate(m, m, parseFloat(value[0]));
                    break;
                case 'skew':
                    value = trim(value).split(DILIMITER_REG);
                    console.warn('Skew transform is not supported yet');
                    break;
                case 'matrix':
                    value = trim(value).split(DILIMITER_REG);
                    m[0] = parseFloat(value[0]);
                    m[1] = parseFloat(value[1]);
                    m[2] = parseFloat(value[2]);
                    m[3] = parseFloat(value[3]);
                    m[4] = parseFloat(value[4]);
                    m[5] = parseFloat(value[5]);
                    break;
            }
        }
        node.setLocalTransform(m);
    }
}

// Value may contain space.
let styleRegex = /([^\s:;]+)\s*:\s*([^:;]+)/g;
function parseStyleAttribute(xmlNode) {
    let style = xmlNode.getAttribute('style');
    let result = {};

    if (!style) {
        return result;
    }

    let styleList = {};
    styleRegex.lastIndex = 0;
    let styleRegResult;
    while ((styleRegResult = styleRegex.exec(style)) != null) {
        styleList[styleRegResult[1]] = styleRegResult[2];
    }

    for (let svgAttrName in attributesMap) {
        if (attributesMap.hasOwnProperty(svgAttrName) && styleList[svgAttrName] != null) {
            result[attributesMap[svgAttrName]] = styleList[svgAttrName];
        }
    }

    return result;
}

/**
 * @param {Array<Number>} viewBoxRect
 * @param {Number} width
 * @param {Number} height
 * @return {Object} {scale, position}
 */
function makeViewBoxTransform(viewBoxRect, width, height) {
    let scaleX = width / viewBoxRect.width;
    let scaleY = height / viewBoxRect.height;
    let scale = Math.min(scaleX, scaleY);
    // preserveAspectRatio 'xMidYMid'
    let viewBoxScale = [scale, scale];
    let viewBoxPosition = [
        -(viewBoxRect.x + viewBoxRect.width / 2) * scale + width / 2,
        -(viewBoxRect.y + viewBoxRect.height / 2) * scale + height / 2
    ];

    return {
        scale: viewBoxScale,
        position: viewBoxPosition
    };
}

/**
 * @static
 * @method parseSVG
 * 
 * Parse SVG DOM to ZRender specific interfaces.
 * 
 * 把 SVG DOM 标签解析成 Zrender 所定义的接口。
 * 
 * @param {String|XMLElement} xml
 * @param {Object} [opt]
 * @param {Number} [opt.width] Default width if svg width not specified or is a percent value.
 * @param {Number} [opt.height] Default height if svg height not specified or is a percent value.
 * @param {Boolean} [opt.ignoreViewBox]
 * @param {Boolean} [opt.ignoreRootClip]
 * @return {Object} result:
 * {
 *     root: Group, The root of the the result tree of zrender shapes,
 *     width: number, the viewport width of the SVG,
 *     height: number, the viewport height of the SVG,
 *     viewBoxRect: {x, y, width, height}, the declared viewBox rect of the SVG, if exists,
 *     viewBoxTransform: the {scale, position} calculated by viewBox and viewport, is exists.
 * }
 */
function parseSVG(xml, opt) {
    let parser = new SVGParser();
    return parser.parse(xml, opt);
}

/**
 * @class zrender.graphic.CompoundPath 
 * 
 * CompoundPath to improve performance.
 * 
 * 复合路径，用来提升性能。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$6={
    /**
     * @property {String} type
     */
    type: 'compound',
    shape: {
        paths: null
    }
};

class CompoundPath extends Path{
    /**
     * @method constructor CompoundPath
     * @param {Object} opts 
     */
    constructor(opts){
        super(opts,defaultConfig$6);
    }

    /**
     * @private
     * @method _updatePathDirty
     */
    _updatePathDirty() {
        let dirtyPath = this.__dirtyPath;
        let paths = this.shape.paths;
        for (let i = 0; i < paths.length; i++) {
            // Mark as dirty if any subpath is dirty
            dirtyPath = dirtyPath || paths[i].__dirtyPath;
        }
        this.__dirtyPath = dirtyPath;
        this.__dirty = this.__dirty || dirtyPath;
    }

    /**
     * @private
     * @method beforeBrush
     */
    beforeBrush() {
        this._updatePathDirty();
        let paths = this.shape.paths || [];
        let scale = this.getGlobalScale();
        // Update path scale
        for (let i = 0; i < paths.length; i++) {
            if (!paths[i].path) {
                paths[i].createPathProxy();
            }
            paths[i].path.setScale(scale[0], scale[1], paths[i].segmentIgnoreThreshold);
        }
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let paths = shape.paths || [];
        for (let i = 0; i < paths.length; i++) {
            paths[i].buildPath(ctx, paths[i].shape, true);
        }
    }

    /**
     * @private
     * @method afterBrush
     */
    afterBrush() {
        let paths = this.shape.paths || [];
        for (let i = 0; i < paths.length; i++) {
            paths[i].__dirtyPath = false;
        }
    }

    /**
     * @private
     * @method getBoundingRect
     */
    getBoundingRect() {
        this._updatePathDirty();
        return Path.prototype.getBoundingRect.call(this);
    }
}

/**
 * @class zrender.graphic.IncrementalDisplayble 
 * Displayable for incremental rendering. It will be rendered in a separate layer
 * IncrementalDisplay have two main methods. `clearDisplayables` and `addDisplayables`
 * addDisplayables will render the added displayables incremetally.
 *
 * It use a not clearFlag to tell the painter don't clear the layer if it's the first element.
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor IncrementalDisplayble
 * @param {Object} opts 
 */
// TODO Style override ?
function IncrementalDisplayble(opts) {
    inheritProperties(this,Displayable,opts);
    this._displayables = [];
    this._temporaryDisplayables = [];
    this._cursor = 0;
    this.notClear = true;
}

let m = [];

IncrementalDisplayble.prototype={
    constructor:IncrementalDisplayble,
    incremental:true,
    clearDisplaybles:function () {
        this._displayables = [];
        this._temporaryDisplayables = [];
        this._cursor = 0;
        this.dirty();
        this.notClear = false;
    },
    addDisplayable:function (displayable, notPersistent) {
        if (notPersistent) {
            this._temporaryDisplayables.push(displayable);
        }else {
            this._displayables.push(displayable);
        }
        this.dirty();
    },
    addDisplayables:function (displayables, notPersistent) {
        notPersistent = notPersistent || false;
        for (let i = 0; i < displayables.length; i++) {
            this.addDisplayable(displayables[i], notPersistent);
        }
    },
    eachPendingDisplayable:function (cb) {
        for (let i = this._cursor; i < this._displayables.length; i++) {
            cb && cb(this._displayables[i]);
        }
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            cb && cb(this._temporaryDisplayables[i]);
        }
    },
    update:function () {
        this.updateTransform();
        for (let i = this._cursor; i < this._displayables.length; i++) {
            let displayable = this._displayables[i];
            // PENDING
            displayable.parent = this;
            displayable.update();
            displayable.parent = null;
        }
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            let displayable = this._temporaryDisplayables[i];
            // PENDING
            displayable.parent = this;
            displayable.update();
            displayable.parent = null;
        }
    },
    brush:function (ctx, prevEl) {
        // Render persistant displayables.
        let i = this._cursor;
        for (; i < this._displayables.length; i++) {
            let displayable = this._displayables[i];
            displayable.beforeBrush && displayable.beforeBrush(ctx);
            displayable.brush(ctx, i === this._cursor ? null : this._displayables[i - 1]);
            displayable.afterBrush && displayable.afterBrush(ctx);
        }
        this._cursor = i;
        // Render temporary displayables.
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            let displayable = this._temporaryDisplayables[i];
            displayable.beforeBrush && displayable.beforeBrush(ctx);
            displayable.brush(ctx, i === 0 ? null : this._temporaryDisplayables[i - 1]);
            displayable.afterBrush && displayable.afterBrush(ctx);
        }
        this._temporaryDisplayables = [];
        this.notClear = true;
    },
    getBoundingRect:function () {
        if (!this._rect) {
            let rect = new BoundingRect(Infinity, Infinity, -Infinity, -Infinity);
            for (let i = 0; i < this._displayables.length; i++) {
                let displayable = this._displayables[i];
                let childRect = displayable.getBoundingRect().clone();
                if (displayable.needLocalTransform()) {
                    childRect.applyTransform(displayable.getLocalTransform(m));
                }
                rect.union(childRect);
            }
            this._rect = rect;
        }
        return this._rect;
    },
    contain:function (x, y) {
        let localPos = this.transformCoordToLocal(x, y);
        let rect = this.getBoundingRect();
        if (rect.contain(localPos[0], localPos[1])) {
            for (let i = 0; i < this._displayables.length; i++) {
                let displayable = this._displayables[i];
                if (displayable.contain(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
};

inherits(IncrementalDisplayble, Displayable);

/**
 * @class zrender.graphic.shape.Arc 
 * 圆弧
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$7={
    /**
     * @property {String} type
     */
    type: 'arc',
    shape: {
        cx: 0,
        cy: 0,
        r: 0,
        startAngle: 0,
        endAngle: PI2,
        clockwise: true
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

class Arc extends Path{
    /**
     * @method constructor Line
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$7,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x = shape.cx;
        let y = shape.cy;
        let r = mathMax$1(shape.r, 0);
        let startAngle = shape.startAngle;
        let endAngle = shape.endAngle;
        let clockwise = shape.clockwise;

        let unitX = mathCos(startAngle);
        let unitY = mathSin(startAngle);

        ctx.moveTo(unitX * r + x, unitY * r + y);
        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
    }
}

/**
 * @class zrender.graphic.shape.BezierCurve 
 * 贝塞尔曲线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$8={
    /**
     * @property {String} type
     */
    type: 'bezier-curve',
    shape: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cpx1: 0,
        cpy1: 0,
        percent: 1
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

let out = [];

function someVectorAt(shape, t, isTangent) {
    let cpx2 = shape.cpx2;
    let cpy2 = shape.cpy2;
    if (cpx2 === null || cpy2 === null) {
        return [
            (isTangent ? cubicDerivativeAt : cubicAt)(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t),
            (isTangent ? cubicDerivativeAt : cubicAt)(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)
        ];
    }else {
        return [
            (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.x1, shape.cpx1, shape.x2, t),
            (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.y1, shape.cpy1, shape.y2, t)
        ];
    }
}

class BezierCurve extends Path{
    /**
     * @method constructor BezierCurve
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$8,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x1 = shape.x1;
        let y1 = shape.y1;
        let x2 = shape.x2;
        let y2 = shape.y2;
        let cpx1 = shape.cpx1;
        let cpy1 = shape.cpy1;
        let cpx2 = shape.cpx2;
        let cpy2 = shape.cpy2;
        let percent = shape.percent;
        if (percent === 0) {
            return;
        }

        ctx.moveTo(x1, y1);

        if (cpx2 == null || cpy2 == null) {
            if (percent < 1) {
                quadraticSubdivide(
                    x1, cpx1, x2, percent, out
                );
                cpx1 = out[1];
                x2 = out[2];
                quadraticSubdivide(
                    y1, cpy1, y2, percent, out
                );
                cpy1 = out[1];
                y2 = out[2];
            }

            ctx.quadraticCurveTo(
                cpx1, cpy1,
                x2, y2
            );
        }else {
            if (percent < 1) {
                cubicSubdivide(
                    x1, cpx1, cpx2, x2, percent, out
                );
                cpx1 = out[1];
                cpx2 = out[2];
                x2 = out[3];
                cubicSubdivide(
                    y1, cpy1, cpy2, y2, percent, out
                );
                cpy1 = out[1];
                cpy2 = out[2];
                y2 = out[3];
            }
            ctx.bezierCurveTo(
                cpx1, cpy1,
                cpx2, cpy2,
                x2, y2
            );
        }
    }

    /**
     * Get point at percent
     * @param  {Number} t
     * @return {Array<Number>}
     */
    pointAt(t) {
        return someVectorAt(this.shape, t, false);
    }

    /**
     * Get tangent at percent
     * @param  {Number} t
     * @return {Array<Number>}
     */
    tangentAt(t) {
        let p = someVectorAt(this.shape, t, true);
        return normalize(p, p);
    }
}

/**
 * @class zrender.graphic.shape.Droplet 
 * 水滴形状
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$9={
    /**
     * @property {String} type
     */
    type: 'droplet',

    shape: {
        cx: 0, cy: 0,
        width: 0, height: 0
    }
};

class Droplet$1 extends Path{
    /**
     * @method constructor Droplet
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$9,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x = shape.cx;
        let y = shape.cy;
        let a = shape.width;
        let b = shape.height;

        ctx.moveTo(x, y + a);
        ctx.bezierCurveTo(
            x + a,
            y + a,
            x + a * 3 / 2,
            y - a / 3,
            x,
            y - b
        );
        ctx.bezierCurveTo(
            x - a * 3 / 2,
            y - a / 3,
            x - a,
            y + a,
            x,
            y + a
        );
        ctx.closePath();
    }
}

/**
 * @class zrender.graphic.shape.Heart 
 * 心形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$10={
    /**
     * @property {String} type
     */
    type: 'heart',
    shape: {
        cx: 0,
        cy: 0,
        width: 0,
        height: 0
    }
};
class Heart extends Path{
    /**
     * @method constructor Heart
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$10,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x = shape.cx;
        let y = shape.cy;
        let a = shape.width;
        let b = shape.height;
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x + a / 2, y - b * 2 / 3,
            x + a * 2, y + b / 3,
            x, y + b
        );
        ctx.bezierCurveTo(
            x - a * 2, y + b / 3,
            x - a / 2, y - b * 2 / 3,
            x, y
        );
    }
}

/**
 * @class zrender.graphic.shape.Isogon 
 * 正多边形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let PI$1 = Math.PI;
let sin = Math.sin;
let cos = Math.cos;

let defaultConfig$11={
    /**
     * @property {String} type
     */
    type: 'isogon',
    shape: {
        x: 0, y: 0,
        r: 0, n: 0
    }
};

class Isogon extends Path{
    /**
     * @method constructor Isogon
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$11,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let n = shape.n;
        if (!n || n < 2) {
            return;
        }

        let x = shape.x;
        let y = shape.y;
        let r = shape.r;

        let dStep = 2 * PI$1 / n;
        let deg = -PI$1 / 2;

        ctx.moveTo(x + r * cos(deg), y + r * sin(deg));
        for (let i = 0, end = n - 1; i < end; i++) {
            deg += dStep;
            ctx.lineTo(x + r * cos(deg), y + r * sin(deg));
        }

        ctx.closePath();

        return;
    }
}

/**
 * @class zrender.graphic.shape.Ring 
 * 圆环
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$12={
    /**
     * @property {String} type
     */
    type: 'ring',
    shape: {
        cx: 0,
        cy: 0,
        r: 0,
        r0: 0
    }
};

class Ring extends Path{
    /**
     * @method constructor Ring
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$12,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x = shape.cx;
        let y = shape.cy;
        let PI2 = Math.PI * 2;
        ctx.moveTo(x + shape.r, y);
        ctx.arc(x, y, shape.r, 0, PI2, false);
        ctx.moveTo(x + shape.r0, y);
        ctx.arc(x, y, shape.r0, 0, PI2, true);
    }
}

/**
 * @class zrender.graphic.shape.Rose 
 * 玫瑰线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let sin$1 = Math.sin;
let cos$1 = Math.cos;
let radian = Math.PI / 180;

let defaultConfig$13={
    /**
     * @property {String} type
     */
    type: 'rose',
    shape: {
        cx: 0,
        cy: 0,
        r: [],
        k: 0,
        n: 1
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

class Rose extends Path{
    /**
     * @method constructor Rose
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$13,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x;
        let y;
        let R = shape.r;
        let r;
        let k = shape.k;
        let n = shape.n;

        let x0 = shape.cx;
        let y0 = shape.cy;

        ctx.moveTo(x0, y0);

        for (let i = 0, len = R.length; i < len; i++) {
            r = R[i];

            for (let j = 0; j <= 360 * n; j++) {
                x = r
                        * sin$1(k / n * j % 360 * radian)
                        * cos$1(j * radian)
                        + x0;
                y = r
                        * sin$1(k / n * j % 360 * radian)
                        * sin$1(j * radian)
                        + y0;
                ctx.lineTo(x, y);
            }
        }
    }
}

// Fix weird bug in some version of IE11 (like 11.0.9600.178**),
// where exception "unexpected call to method or property access"
// might be thrown when calling ctx.fill or ctx.stroke after a path
// whose area size is zero is drawn and ctx.clip() is called and
// shadowBlur is set. See #4572, #3112, #5777.
// (e.g.,
//  ctx.moveTo(10, 10);
//  ctx.lineTo(20, 10);
//  ctx.closePath();
//  ctx.clip();
//  ctx.shadowBlur = 10;
//  ...
//  ctx.fill();
// )

var shadowTemp = [
    ['shadowBlur', 0],
    ['shadowColor', '#000'],
    ['shadowOffsetX', 0],
    ['shadowOffsetY', 0]
];

var fixClipWithShadow = function (orignalBrush) {

    // version string can be: '11.0'
    return (env$1.browser.ie && env$1.browser.version >= 11)

        ? function () {
            var clipPaths = this.__clipPaths;
            var style = this.style;
            var modified;

            if (clipPaths) {
                for (var i = 0; i < clipPaths.length; i++) {
                    var clipPath = clipPaths[i];
                    var shape = clipPath && clipPath.shape;
                    var type = clipPath && clipPath.type;

                    if (shape && (
                        (type === 'sector' && shape.startAngle === shape.endAngle)
                        || (type === 'rect' && (!shape.width || !shape.height))
                    )) {
                        for (var j = 0; j < shadowTemp.length; j++) {
                            // It is save to put shadowTemp static, because shadowTemp
                            // will be all modified each item brush called.
                            shadowTemp[j][2] = style[shadowTemp[j][0]];
                            style[shadowTemp[j][0]] = shadowTemp[j][1];
                        }
                        modified = true;
                        break;
                    }
                }
            }

            orignalBrush.apply(this, arguments);

            if (modified) {
                for (var j = 0; j < shadowTemp.length; j++) {
                    style[shadowTemp[j][0]] = shadowTemp[j][2];
                }
            }
        }

        : orignalBrush;
};

/**
 * @class zrender.graphic.shape.Sector 
 * 扇形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig$14={
    /**
     * @property {String} type
     */
    type: 'sector',
    shape: {
        cx: 0,
        cy: 0,
        r0: 0,
        r: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
        clockwise: true
    }
};

class Sector extends Path{
    /**
     * @method constructor Sector
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$14,options,true));
        this.brush=fixClipWithShadow(Path.prototype.brush);
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x = shape.cx;
        let y = shape.cy;
        let r0 = Math.max(shape.r0 || 0, 0);
        let r = Math.max(shape.r, 0);
        let startAngle = shape.startAngle;
        let endAngle = shape.endAngle;
        let clockwise = shape.clockwise;

        let unitX = Math.cos(startAngle);
        let unitY = Math.sin(startAngle);

        ctx.moveTo(unitX * r0 + x, unitY * r0 + y);
        ctx.lineTo(unitX * r + x, unitY * r + y);
        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
        ctx.lineTo(
            Math.cos(endAngle) * r0 + x,
            Math.sin(endAngle) * r0 + y
        );

        if (r0 !== 0) {
            ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
        }

        ctx.closePath();
    }
}

/**
 * @class zrender.graphic.shape.Star 
 * n角星（n>3）
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let PI$2 = Math.PI;
let cos$2 = Math.cos;
let sin$2 = Math.sin;
let defaultConfig$15={
    /**
     * @property {String} type
     */
    type: 'star',
    shape: {
        cx: 0,
        cy: 0,
        n: 3,
        r0: null,
        r: 0
    }
};

class Star extends Path{
    /**
     * @method constructor Star
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$15,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let n = shape.n;
        if (!n || n < 2) {
            return;
        }

        let x = shape.cx;
        let y = shape.cy;
        let r = shape.r;
        let r0 = shape.r0;

        // 如果未指定内部顶点外接圆半径，则自动计算
        if (r0 == null) {
            r0 = n > 4
                // 相隔的外部顶点的连线的交点，
                // 被取为内部交点，以此计算r0
                ? r * cos$2(2 * PI$2 / n) / cos$2(PI$2 / n)
                // 二三四角星的特殊处理
                : r / 3;
        }

        let dStep = PI$2 / n;
        let deg = -PI$2 / 2;
        let xStart = x + r * cos$2(deg);
        let yStart = y + r * sin$2(deg);
        deg += dStep;

        // 记录边界点，用于判断inside
        ctx.moveTo(xStart, yStart);
        for (let i = 0, end = n * 2 - 1, ri; i < end; i++) {
            ri = i % 2 === 0 ? r0 : r;
            ctx.lineTo(x + ri * cos$2(deg), y + ri * sin$2(deg));
            deg += dStep;
        }

        ctx.closePath();
    }
}

/**
 * @class zrender.graphic.shape.Trochold 
 * 内外旋轮曲线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let cos$3 = Math.cos;
let sin$3 = Math.sin;
let defaultConfig$16={
    /**
     * @property {String} type
     */
    type: 'trochoid',
    shape: {
        cx: 0,
        cy: 0,
        r: 0,
        r0: 0,
        d: 0,
        location: 'out'
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

class Trochold extends Path{
    /**
     * @method constructor Trochold
     * @param {Object} options 
     */
    constructor(options){
        super(merge(defaultConfig$16,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x1;
        let y1;
        let x2;
        let y2;
        let R = shape.r;
        let r = shape.r0;
        let d = shape.d;
        let offsetX = shape.cx;
        let offsetY = shape.cy;
        let delta = shape.location === 'out' ? 1 : -1;

        if (shape.location && R <= r) {
            return;
        }

        let num = 0;
        let i = 1;
        let theta;

        x1 = (R + delta * r) * cos$3(0)
            - delta * d * cos$3(0) + offsetX;
        y1 = (R + delta * r) * sin$3(0)
            - d * sin$3(0) + offsetY;

        ctx.moveTo(x1, y1);

        // 计算结束时的i
        do {
            num++;
        }
        while ((r * num) % (R + delta * r) !== 0);

        do {
            theta = Math.PI / 180 * i;
            x2 = (R + delta * r) * cos$3(theta)
                    - delta * d * cos$3((R / r + delta) * theta)
                    + offsetX;
            y2 = (R + delta * r) * sin$3(theta)
                    - d * sin$3((R / r + delta) * theta)
                    + offsetY;
            ctx.lineTo(x2, y2);
            i++;
        }
        while (i <= (r * num) / (R + delta * r) * 360);

    }
}

/**
 * @class zrender.graphic.gradient.RadialGradient 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor RadialGradient
 * @param {Number} [x=0.5]
 * @param {Number} [y=0.5]
 * @param {Number} [r=0.5]
 * @param {Array<Object>} [colorStops]
 * @param {boolean} [globalCoord=false]
 */
let RadialGradient = function (x, y, r, colorStops, globalCoord) {
    // Should do nothing more in this constructor. Because gradient can be
    // declard by `color: {type: 'radial', colorStops: ...}`, where
    // this constructor will not be called.
    this.x = x == null ? 0.5 : x;
    this.y = y == null ? 0.5 : y;
    this.r = r == null ? 0.5 : r;
    // Can be cloned
    this.type = 'radial';
    // If use global coord
    this.global = globalCoord || false;
    Gradient.call(this, colorStops);
};

RadialGradient.prototype = {
    constructor: RadialGradient
};

inherits(RadialGradient, Gradient);

/**
 * Do not mount those modules on 'src/zrender' for better tree shaking.
 */

var svgURI = 'http://www.w3.org/2000/svg';

function createElement(name) {
    return document.createElementNS(svgURI, name);
}

// TODO
// 1. shadow
// 2. Image: sx, sy, sw, sh
let CMD$3 = PathProxy.CMD;
let NONE = 'none';
let PI$3 = Math.PI;
let PI2$3 = Math.PI * 2;
let degree = 180 / PI$3;
let EPSILON$3 = 1e-4;

function round4(val) {
    return Math.round(val * 1e4) / 1e4;
}

function isAroundZero$1(val) {
    return val < EPSILON$3 && val > -EPSILON$3;
}

function pathHasFill(style, isText) {
    let fill = isText ? style.textFill : style.fill;
    return fill != null && fill !== NONE;
}

function pathHasStroke(style, isText) {
    let stroke = isText ? style.textStroke : style.stroke;
    return stroke != null && stroke !== NONE;
}

function setTransform(svgEl, m) {
    if (m) {
        attr(svgEl, 'transform', 'matrix(' + Array.prototype.join.call(m, ',') + ')');
    }
}

function attr(el, key, val) {
    if (!val || val.type !== 'linear' && val.type !== 'radial') {
        // Don't set attribute for gradient, since it need new dom nodes
        el.setAttribute(key, val);
    }
}

function attrXLink(el, key, val) {
    el.setAttributeNS('http://www.w3.org/1999/xlink', key, val);
}

function bindStyle(svgEl, style, isText, el) {
    if (pathHasFill(style, isText)) {
        let fill = isText ? style.textFill : style.fill;
        fill = fill === 'transparent' ? NONE : fill;
        attr(svgEl, 'fill', fill);
        attr(svgEl, 'fill-opacity', style.fillOpacity != null ? style.fillOpacity * style.opacity : style.opacity);
    }else {
        attr(svgEl, 'fill', NONE);
    }

    if (pathHasStroke(style, isText)) {
        let stroke = isText ? style.textStroke : style.stroke;
        stroke = stroke === 'transparent' ? NONE : stroke;
        attr(svgEl, 'stroke', stroke);
        let strokeWidth = isText
            ? style.textStrokeWidth
            : style.lineWidth;
        let strokeScale = !isText && style.strokeNoScale
            ? el.getLineScale()
            : 1;
        attr(svgEl, 'stroke-width', strokeWidth / strokeScale);
        // stroke then fill for text; fill then stroke for others
        attr(svgEl, 'paint-order', isText ? 'stroke' : 'fill');
        attr(svgEl, 'stroke-opacity', style.strokeOpacity != null ? style.strokeOpacity : style.opacity);
        let lineDash = style.lineDash;
        if (lineDash) {
            attr(svgEl, 'stroke-dasharray', style.lineDash.join(','));
            attr(svgEl, 'stroke-dashoffset', Math.round(style.lineDashOffset || 0));
        }else {
            attr(svgEl, 'stroke-dasharray', '');
        }

        // PENDING
        style.lineCap && attr(svgEl, 'stroke-linecap', style.lineCap);
        style.lineJoin && attr(svgEl, 'stroke-linejoin', style.lineJoin);
        style.miterLimit && attr(svgEl, 'stroke-miterlimit', style.miterLimit);
    }else {
        attr(svgEl, 'stroke', NONE);
    }
}

/**
 * @class zrender.svg.SVGPath
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
function pathDataToString(path) {
    var str = [];
    var data = path.data;
    var dataLength = path.len();
    for (var i = 0; i < dataLength;) {
        var cmd = data[i++];
        var cmdStr = '';
        var nData = 0;
        switch (cmd) {
            case CMD$3.M:
                cmdStr = 'M';
                nData = 2;
                break;
            case CMD$3.L:
                cmdStr = 'L';
                nData = 2;
                break;
            case CMD$3.Q:
                cmdStr = 'Q';
                nData = 4;
                break;
            case CMD$3.C:
                cmdStr = 'C';
                nData = 6;
                break;
            case CMD$3.A:
                var cx = data[i++];
                var cy = data[i++];
                var rx = data[i++];
                var ry = data[i++];
                var theta = data[i++];
                var dTheta = data[i++];
                var psi = data[i++];
                var clockwise = data[i++];

                var dThetaPositive = Math.abs(dTheta);
                var isCircle = isAroundZero$1(dThetaPositive - PI2$3)
                    || (clockwise ? dTheta >= PI2$3 : -dTheta >= PI2$3);

                // Mapping to 0~2PI
                var unifiedTheta = dTheta > 0 ? dTheta % PI2$3 : (dTheta % PI2$3 + PI2$3);

                var large = false;
                if (isCircle) {
                    large = true;
                }
                else if (isAroundZero$1(dThetaPositive)) {
                    large = false;
                }
                else {
                    large = (unifiedTheta >= PI$3) === !!clockwise;
                }

                var x0 = round4(cx + rx * Math.cos(theta));
                var y0 = round4(cy + ry * Math.sin(theta));

                // It will not draw if start point and end point are exactly the same
                // We need to shift the end point with a small value
                // FIXME A better way to draw circle ?
                if (isCircle) {
                    if (clockwise) {
                        dTheta = PI2$3 - 1e-4;
                    }
                    else {
                        dTheta = -PI2$3 + 1e-4;
                    }

                    large = true;

                    if (i === 9) {
                        // Move to (x0, y0) only when CMD.A comes at the
                        // first position of a shape.
                        // For instance, when drawing a ring, CMD.A comes
                        // after CMD.M, so it's unnecessary to move to
                        // (x0, y0).
                        str.push('M', x0, y0);
                    }
                }

                var x = round4(cx + rx * Math.cos(theta + dTheta));
                var y = round4(cy + ry * Math.sin(theta + dTheta));

                // FIXME Ellipse
                str.push('A', round4(rx), round4(ry),
                    Math.round(psi * degree), +large, +clockwise, x, y);
                break;
            case CMD$3.Z:
                cmdStr = 'Z';
                break;
            case CMD$3.R:
                var x = round4(data[i++]);
                var y = round4(data[i++]);
                var w = round4(data[i++]);
                var h = round4(data[i++]);
                str.push(
                    'M', x, y,
                    'L', x + w, y,
                    'L', x + w, y + h,
                    'L', x, y + h,
                    'L', x, y
                );
                break;
        }
        cmdStr && str.push(cmdStr);
        for (var j = 0; j < nData; j++) {
            // PENDING With scale
            str.push(round4(data[i++]));
        }
    }
    return str.join(' ');
}

/**
 * @class zrender.svg.SVGPath
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
let svgPath = {};
svgPath.brush = function (el) {
    let style = el.style;

    let svgEl = el.__svgEl;
    if (!svgEl) {
        svgEl = createElement('path');
        el.__svgEl = svgEl;
    }

    if (!el.path) {
        el.createPathProxy();
    }
    let path = el.path;

    if (el.__dirtyPath) {
        path.beginPath();
        path.subPixelOptimize = false;
        el.buildPath(path, el.shape);
        el.__dirtyPath = false;

        let pathStr = pathDataToString(path);
        if (pathStr.indexOf('NaN') < 0) {
            // Ignore illegal path, which may happen such in out-of-range
            // data in Calendar series.
            attr(svgEl, 'd', pathStr);
        }
    }

    bindStyle(svgEl, style, false, el);
    setTransform(svgEl, el.transform);

    if (style.text != null) {
        svgTextDrawRectText(el, el.getBoundingRect());
    }else {
        removeOldTextNode(el);
    }
};

/**
 * @class zrender.svg.SVGImage
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
let svgImage = {};
svgImage.brush = function (el) {
    let style = el.style;
    let image = style.image;

    if (image instanceof HTMLImageElement) {
        let src = image.src;
        image = src;
    }
    if (!image) {
        return;
    }

    let x = style.x || 0;
    let y = style.y || 0;

    let dw = style.width;
    let dh = style.height;

    let svgEl = el.__svgEl;
    if (!svgEl) {
        svgEl = createElement('image');
        el.__svgEl = svgEl;
    }

    if (image !== el.__imageSrc) {
        attrXLink(svgEl, 'href', image);
        // Caching image src
        el.__imageSrc = image;
    }

    attr(svgEl, 'width', dw);
    attr(svgEl, 'height', dh);

    attr(svgEl, 'x', x);
    attr(svgEl, 'y', y);

    setTransform(svgEl, el.transform);

    if (style.text != null) {
        svgTextDrawRectText(el, el.getBoundingRect());
    }else {
        removeOldTextNode(el);
    }
};

/**
 * @class zrender.svg.SVGText
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
let svgText = {};
let _tmpTextHostRect = new BoundingRect();
let _tmpTextBoxPos = {};
let _tmpTextTransform = [];
let TEXT_ALIGN_TO_ANCHRO = {
    left: 'start',
    right: 'end',
    center: 'middle',
    middle: 'middle'
};

/**
 * @param {module:zrender/Element} el
 * @param {Object|boolean} [hostRect] {x, y, width, height}
 *        If set false, rect text is not used.
 */
let svgTextDrawRectText = function (el, hostRect) {
    let style = el.style;
    let elTransform = el.transform;
    let needTransformTextByHostEl = el instanceof Text || style.transformText;

    el.__dirty && normalizeTextStyle(style, true);

    let text = style.text;
    // Convert to string
    text != null && (text += '');
    if (!needDrawText(text, style)) {
        return;
    }
    // render empty text for svg if no text but need draw text.
    text == null && (text = '');

    // Follow the setting in the canvas renderer, if not transform the
    // text, transform the hostRect, by which the text is located.
    if (!needTransformTextByHostEl && elTransform) {
        _tmpTextHostRect.copy(hostRect);
        _tmpTextHostRect.applyTransform(elTransform);
        hostRect = _tmpTextHostRect;
    }

    let textSvgEl = el.__textSvgEl;
    if (!textSvgEl) {
        textSvgEl = createElement('text');
        el.__textSvgEl = textSvgEl;
    }

    // style.font has been normalized by `normalizeTextStyle`.
    let textSvgElStyle = textSvgEl.style;
    let font = style.font || DEFAULT_FONT$1;
    let computedFont = textSvgEl.__computedFont;
    if (font !== textSvgEl.__styleFont) {
        textSvgElStyle.font = textSvgEl.__styleFont = font;
        // The computedFont might not be the orginal font if it is illegal font.
        computedFont = textSvgEl.__computedFont = textSvgElStyle.font;
    }

    let textPadding = style.textPadding;
    let textLineHeight = style.textLineHeight;

    let contentBlock = el.__textCotentBlock;
    if (!contentBlock || el.__dirtyText) {
        contentBlock = el.__textCotentBlock = parsePlainText(
            text, computedFont, textPadding, textLineHeight, style.truncate
        );
    }

    let outerHeight = contentBlock.outerHeight;
    let lineHeight = contentBlock.lineHeight;

    getBoxPosition(_tmpTextBoxPos, el, style, hostRect);
    let baseX = _tmpTextBoxPos.baseX;
    let baseY = _tmpTextBoxPos.baseY;
    let textAlign = _tmpTextBoxPos.textAlign || 'left';
    let textVerticalAlign = _tmpTextBoxPos.textVerticalAlign;

    setTextTransform(
        textSvgEl, needTransformTextByHostEl, elTransform, style, hostRect, baseX, baseY
    );

    let boxY = adjustTextY(baseY, outerHeight, textVerticalAlign);
    let textX = baseX;
    let textY = boxY;

    // TODO needDrawBg
    if (textPadding) {
        textX = getTextXForPadding$1(baseX, textAlign, textPadding);
        textY += textPadding[0];
    }

    // `textBaseline` is set as 'middle'.
    textY += lineHeight / 2;

    bindStyle(textSvgEl, style, true, el);

    // FIXME
    // Add a <style> to reset all of the text font as inherit?
    // otherwise the outer <style> may set the unexpected style.

    // Font may affect position of each tspan elements
    let canCacheByTextString = contentBlock.canCacheByTextString;
    let tspanList = el.__tspanList || (el.__tspanList = []);
    let tspanOriginLen = tspanList.length;

    // Optimize for most cases, just compare text string to determine change.
    if (canCacheByTextString && el.__canCacheByTextString && el.__text === text) {
        if (el.__dirtyText && tspanOriginLen) {
            for (let idx = 0; idx < tspanOriginLen; ++idx) {
                updateTextLocation(tspanList[idx], textAlign, textX, textY + idx * lineHeight);
            }
        }
    }else {
        el.__text = text;
        el.__canCacheByTextString = canCacheByTextString;
        let textLines = contentBlock.lines;
        let nTextLines = textLines.length;

        let idx = 0;
        for (; idx < nTextLines; idx++) {
            // Using cached tspan elements
            let tspan = tspanList[idx];
            let singleLineText = textLines[idx];

            if (!tspan) {
                tspan = tspanList[idx] = createElement('tspan');
                textSvgEl.appendChild(tspan);
                tspan.appendChild(document.createTextNode(singleLineText));
            }else if (tspan.__zrText !== singleLineText) {
                tspan.innerHTML = '';
                tspan.appendChild(document.createTextNode(singleLineText));
            }
            updateTextLocation(tspan, textAlign, textX, textY + idx * lineHeight);
        }
        // Remove unused tspan elements
        if (tspanOriginLen > nTextLines) {
            for (; idx < tspanOriginLen; idx++) {
                textSvgEl.removeChild(tspanList[idx]);
            }
            tspanList.length = nTextLines;
        }
    }
};

function setTextTransform(textSvgEl, needTransformTextByHostEl, elTransform, style, hostRect, baseX, baseY) {
    identity(_tmpTextTransform);

    if (needTransformTextByHostEl && elTransform) {
        copy$1(_tmpTextTransform, elTransform);
    }

    // textRotation only apply in RectText.
    let textRotation = style.textRotation;
    if (hostRect && textRotation) {
        let origin = style.textOrigin;
        if (origin === 'center') {
            baseX = hostRect.width / 2 + hostRect.x;
            baseY = hostRect.height / 2 + hostRect.y;
        }else if (origin) {
            baseX = origin[0] + hostRect.x;
            baseY = origin[1] + hostRect.y;
        }

        _tmpTextTransform[4] -= baseX;
        _tmpTextTransform[5] -= baseY;
        // Positive: anticlockwise
        rotate(_tmpTextTransform, _tmpTextTransform, textRotation);
        _tmpTextTransform[4] += baseX;
        _tmpTextTransform[5] += baseY;
    }
    // See the definition in `Style.js#textOrigin`, the default
    // origin is from the result of `getBoxPosition`.

    setTransform(textSvgEl, _tmpTextTransform);
}

// FIXME merge the same code with `helper/text.js#getTextXForPadding`;
function getTextXForPadding$1(x, textAlign, textPadding) {
    return textAlign === 'right'
        ? (x - textPadding[1])
        : textAlign === 'center'
        ? (x + textPadding[3] / 2 - textPadding[1] / 2)
        : (x + textPadding[3]);
}

function updateTextLocation(tspan, textAlign, x, y) {
    // Consider different font display differently in vertial align, we always
    // set vertialAlign as 'middle', and use 'y' to locate text vertically.
    attr(tspan, 'dominant-baseline', 'middle');
    attr(tspan, 'text-anchor', TEXT_ALIGN_TO_ANCHRO[textAlign]);
    attr(tspan, 'x', x);
    attr(tspan, 'y', y);
}

function removeOldTextNode(el) {
    if (el && el.__textSvgEl) {
        el.__textSvgEl.parentNode.removeChild(el.__textSvgEl);
        el.__textSvgEl = null;
        el.__tspanList = [];
        el.__text = null;
    }
}

svgText.drawRectText = svgTextDrawRectText;

svgText.brush = function (el) {
    let style = el.style;
    if (style.text != null) {
        svgTextDrawRectText(el, false);
    }else {
        removeOldTextNode(el);
    }
};

// Myers' Diff Algorithm
// Modified from https://github.com/kpdecker/jsdiff/blob/master/src/diff/base.js

function Diff() {}

Diff.prototype = {
    diff: function (oldArr, newArr, equals) {
        if (!equals) {
            equals = function (a, b) {
                return a === b;
            };
        }
        this.equals = equals;

        var self = this;

        oldArr = oldArr.slice();
        newArr = newArr.slice();
        // Allow subclasses to massage the input prior to running
        var newLen = newArr.length;
        var oldLen = oldArr.length;
        var editLength = 1;
        var maxEditLength = newLen + oldLen;
        var bestPath = [{ newPos: -1, components: [] }];

        // Seed editLength = 0, i.e. the content starts with the same values
        var oldPos = this.extractCommon(bestPath[0], newArr, oldArr, 0);
        if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            var indices = [];
            for (var i = 0; i < newArr.length; i++) {
                indices.push(i);
            }
            // Identity per the equality and tokenizer
            return [{
                indices: indices, count: newArr.length
            }];
        }

        // Main worker method. checks all permutations of a given edit length for acceptance.
        function execEditLength() {
            for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
                var basePath;
                var addPath = bestPath[diagonalPath - 1];
                var removePath = bestPath[diagonalPath + 1];
                var oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
                if (addPath) {
                    // No one else is going to attempt to use this value, clear it
                    bestPath[diagonalPath - 1] = undefined;
                }

                var canAdd = addPath && addPath.newPos + 1 < newLen;
                var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
                if (!canAdd && !canRemove) {
                    // If this path is a terminal then prune
                    bestPath[diagonalPath] = undefined;
                    continue;
                }

                // Select the diagonal that we want to branch from. We select the prior
                // path whose position in the new string is the farthest from the origin
                // and does not pass the bounds of the diff graph
                if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
                    basePath = clonePath(removePath);
                    self.pushComponent(basePath.components, undefined, true);
                }
                else {
                    basePath = addPath;   // No need to clone, we've pulled it from the list
                    basePath.newPos++;
                    self.pushComponent(basePath.components, true, undefined);
                }

                oldPos = self.extractCommon(basePath, newArr, oldArr, diagonalPath);

                // If we have hit the end of both strings, then we are done
                if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
                    return buildValues(self, basePath.components, newArr, oldArr);
                }
                else {
                    // Otherwise track this path as a potential candidate and continue.
                    bestPath[diagonalPath] = basePath;
                }
            }

            editLength++;
        }

        while (editLength <= maxEditLength) {
            var ret = execEditLength();
            if (ret) {
                return ret;
            }
        }
    },

    pushComponent: function (components, added, removed) {
        var last = components[components.length - 1];
        if (last && last.added === added && last.removed === removed) {
            // We need to clone here as the component clone operation is just
            // as shallow array clone
            components[components.length - 1] = {count: last.count + 1, added: added, removed: removed };
        }
        else {
            components.push({count: 1, added: added, removed: removed });
        }
    },
    extractCommon: function (basePath, newArr, oldArr, diagonalPath) {
        var newLen = newArr.length;
        var oldLen = oldArr.length;
        var newPos = basePath.newPos;
        var oldPos = newPos - diagonalPath;
        var commonCount = 0;

        while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newArr[newPos + 1], oldArr[oldPos + 1])) {
            newPos++;
            oldPos++;
            commonCount++;
        }

        if (commonCount) {
            basePath.components.push({count: commonCount});
        }

        basePath.newPos = newPos;
        return oldPos;
    },
    tokenize: function (value) {
        return value.slice();
    },
    join: function (value) {
        return value.slice();
    }
};

function buildValues(diff, components, newArr, oldArr) {
    var componentPos = 0;
    var componentLen = components.length;
    var newPos = 0;
    var oldPos = 0;

    for (; componentPos < componentLen; componentPos++) {
        var component = components[componentPos];
        if (!component.removed) {
            var indices = [];
            for (var i = newPos; i < newPos + component.count; i++) {
                indices.push(i);
            }
            component.indices = indices;
            newPos += component.count;
            // Common case
            if (!component.added) {
                oldPos += component.count;
            }
        }
        else {
            var indices = [];
            for (var i = oldPos; i < oldPos + component.count; i++) {
                indices.push(i);
            }
            component.indices = indices;
            oldPos += component.count;
        }
    }

    return components;
}

function clonePath(path) {
    return { newPos: path.newPos, components: path.components.slice(0) };
}

var arrayDiff = new Diff();

var arrayDiff$1 = function (oldArr, newArr, callback) {
    return arrayDiff.diff(oldArr, newArr, callback);
};

/**
 * @class zrender.svg.helper.Definable
 * 
 * Manages elements that can be defined in <defs> in SVG,
 *       e.g., gradients, clip path, etc.
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

let MARK_UNUSED = '0';
let MARK_USED = '1';

class Definable{
    /**
     * @method constructor Definable
     * 
     * Manages elements that can be defined in <defs> in SVG,
     * e.g., gradients, clip path, etc.
     *
     * @param {Number}          zrId      zrender instance id
     * @param {SVGElement}      svgRoot   root of SVG document
     * @param {String|String[]} tagNames  possible tag names
     * @param {String}          markLabel label name to make if the element
     *                                    is used
     */
    constructor(zrId,svgRoot,tagNames,markLabel,domName) {
        this._zrId = zrId;
        this._svgRoot = svgRoot;
        this._tagNames = typeof tagNames === 'string' ? [tagNames] : tagNames;
        this._markLabel = markLabel;
        this._domName = domName || '_dom';
        this.nextId = 0;
        this.createElement=createElement;
    }

    /**
     * @method getDefs
     * 
     * Get the <defs> tag for svgRoot; optionally creates one if not exists.
     *
     * @param {Boolean} isForceCreating if need to create when not exists
     * @return {SVGDefsElement} SVG <defs> element, null if it doesn't exist and isForceCreating is false
     */
    getDefs(isForceCreating) {
        let svgRoot = this._svgRoot;
        let defs = this._svgRoot.getElementsByTagName('defs');
        if (defs.length === 0) {
            // Not exist
            if (isForceCreating) {
                defs = svgRoot.insertBefore(
                    this.createElement('defs'), // Create new tag
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
            }
            else {
                return null;
            }
        }
        else {
            return defs[0];
        }
    }

    /**
     * @method update
     * 
     * Update DOM element if necessary.
     *
     * @param {Object|String} element style element. e.g., for gradient, it may be '#ccc' or {type: 'linear', ...}
     * @param {Function|undefined} onUpdate update callback
     */
    update(element, onUpdate) {
        if (!element) {
            return;
        }
    
        let defs = this.getDefs(false);
        if (element[this._domName] && defs.contains(element[this._domName])) {
            // Update DOM
            if (typeof onUpdate === 'function') {
                onUpdate(element);
            }
        }else {
            // No previous dom, create new
            let dom = this.add(element);
            if (dom) {
                element[this._domName] = dom;
            }
        }
    }

    /**
     * @method addDom
     * 
     * Add gradient dom to defs
     *
     * @param {SVGElement} dom DOM to be added to <defs>
     */
    addDom(dom) {
        let defs = this.getDefs(true);
        defs.appendChild(dom);
    }

    /**
     * @method removeDom
     * 
     * Remove DOM of a given element.
     *
     * @param {SVGElement} element element to remove dom
     */
    removeDom(element) {
        let defs = this.getDefs(false);
        if (defs && element[this._domName]) {
            defs.removeChild(element[this._domName]);
            element[this._domName] = null;
        }
    }

    /**
     * @method getDoms
     * 
     * Get DOMs of this element.
     *
     * @return {HTMLDomElement} doms of this defineable elements in <defs>
     */
    getDoms() {
        let defs = this.getDefs(false);
        if (!defs) {
            // No dom when defs is not defined
            return [];
        }
    
        let doms = [];
        each(this._tagNames, function (tagName) {
            let tags = defs.getElementsByTagName(tagName);
            // Note that tags is HTMLCollection, which is array-like
            // rather than real array.
            // So `doms.concat(tags)` add tags as one object.
            doms = doms.concat([].slice.call(tags));
        });
    
        return doms;
    }

    /**
     * @method markAllUnused
     * 
     * Mark DOMs to be unused before painting, and clear unused ones at the end
     * of the painting.
     */
    markAllUnused() {
        let doms = this.getDoms();
        let that = this;
        each(doms, function (dom) {
            dom[that._markLabel] = MARK_UNUSED;
        });
    }

    /**
     * @method markUsed
     * 
     * Mark a single DOM to be used.
     *
     * @param {SVGElement} dom DOM to mark
     */
    markUsed(dom) {
        if (dom) {
            dom[this._markLabel] = MARK_USED;
        }
    }

    /**
     * @method removeUnused
     * 
     * Remove unused DOMs defined in <defs>
     */
    removeUnused() {
        let defs = this.getDefs(false);
        if (!defs) {
            // Nothing to remove
            return;
        }
    
        let doms = this.getDoms();
        let that = this;
        each(doms, function (dom) {
            if (dom[that._markLabel] !== MARK_USED) {
                // Remove gradient
                defs.removeChild(dom);
            }
        });
    }

    /**
     * @method getSvgProxy
     * 
     * Get SVG proxy.
     *
     * @param {Displayable} displayable displayable element
     * @return {Path|Image|Text} svg proxy of given element
     */
    getSvgProxy(displayable) {
        if (displayable instanceof Path) {
            return svgPath;
        }
        else if (displayable instanceof ZImage) {
            return svgImage;
        }
        else if (displayable instanceof Text) {
            return svgText;
        }
        else {
            return svgPath;
        }
    }

    /**
     * @method getTextSvgElement
     * 
     * Get text SVG element.
     *
     * @param {Displayable} displayable displayable element
     * @return {SVGElement} SVG element of text
     */
    getTextSvgElement(displayable) {
        return displayable.__textSvgEl;
    }

    /**
     * @method getSvgElement
     * 
     * Get SVG element.
     *
     * @param {Displayable} displayable displayable element
     * @return {SVGElement} SVG element
     */
    getSvgElement(displayable) {
        return displayable.__svgEl;
    }
}

/**
 * @class zrender.svg.helper.GradientManager
 * 
 * Manages SVG gradient elements.
 * 
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

class GradientManager extends Definable{
    /**
     * @method constructor GradientManager
     * Manages SVG gradient elements.
     *
     * @param   {Number}     zrId    zrender instance id
     * @param   {SVGElement} svgRoot root of SVG document
     */
    constructor(zrId, svgRoot){
        super(
            zrId,
            svgRoot,
            ['linearGradient', 'radialGradient'],
            '__gradient_in_use__'
        );    
    }

    /**
     * @method addWithoutUpdate
     * Create new gradient DOM for fill or stroke if not exist,
     * but will not update gradient if exists.
     *
     * @param {SvgElement}  svgElement   SVG element to paint
     * @param {Displayable} displayable  zrender displayable element
     */
    addWithoutUpdate(svgElement,displayable) {
        if (displayable && displayable.style) {
            var that = this;
            each(['fill', 'stroke'], function (fillOrStroke) {
                if (displayable.style[fillOrStroke]
                    && (displayable.style[fillOrStroke].type === 'linear'
                    || displayable.style[fillOrStroke].type === 'radial')
                ) {
                    var gradient = displayable.style[fillOrStroke];
                    var defs = that.getDefs(true);

                    // Create dom in <defs> if not exists
                    var dom;
                    if (gradient._dom) {
                        // Gradient exists
                        dom = gradient._dom;
                        if (!defs.contains(gradient._dom)) {
                            // _dom is no longer in defs, recreate
                            that.addDom(dom);
                        }
                    }
                    else {
                        // New dom
                        dom = that.add(gradient);
                    }

                    that.markUsed(displayable);

                    var id = dom.getAttribute('id');
                    svgElement.setAttribute(fillOrStroke, 'url(#' + id + ')');
                }
            });
        }
    }

    /**
     * @method add
     * 
     * Add a new gradient tag in <defs>
     *
     * @param   {Gradient} gradient zr gradient instance
     * @return {SVGLinearGradientElement | SVGRadialGradientElement} created DOM
     */
    add(gradient) {
        var dom;
        if (gradient.type === 'linear') {
            dom = this.createElement('linearGradient');
        }else if (gradient.type === 'radial') {
            dom = this.createElement('radialGradient');
        }else {
            console.log('Illegal gradient type.');
            return null;
        }

        // Set dom id with gradient id, since each gradient instance
        // will have no more than one dom element.
        // id may exists before for those dirty elements, in which case
        // id should remain the same, and other attributes should be
        // updated.
        gradient.id = gradient.id || this.nextId++;
        dom.setAttribute('id', `zr${this._zrId}-gradient-${gradient.id}`);
        this.updateDom(gradient, dom);
        this.addDom(dom);
        return dom;
    }

    /**
     * @method update
     * 
     * Update gradient.
     *
     * @param {Gradient} gradient zr gradient instance
     */
    update(gradient) {
        var that = this;
        Definable.prototype.update.call(this, gradient, function () {
            var type = gradient.type;
            var tagName = gradient._dom.tagName;
            if (type === 'linear' && tagName === 'linearGradient'
                || type === 'radial' && tagName === 'radialGradient'
            ) {
                // Gradient type is not changed, update gradient
                that.updateDom(gradient, gradient._dom);
            }else {
                // Remove and re-create if type is changed
                that.removeDom(gradient);
                that.add(gradient);
            }
        });
    }

    /**
     * @method updateDom
     * 
     * Update gradient dom
     *
     * @param {Gradient} gradient zr gradient instance
     * @param {SVGLinearGradientElement | SVGRadialGradientElement} dom
     *                            DOM to update
     */
    updateDom(gradient, dom) {
        if (gradient.type === 'linear') {
            dom.setAttribute('x1', gradient.x);
            dom.setAttribute('y1', gradient.y);
            dom.setAttribute('x2', gradient.x2);
            dom.setAttribute('y2', gradient.y2);
        }
        else if (gradient.type === 'radial') {
            dom.setAttribute('cx', gradient.x);
            dom.setAttribute('cy', gradient.y);
            dom.setAttribute('r', gradient.r);
        }
        else {
            console.log('Illegal gradient type.');
            return;
        }

        if (gradient.global) {
            // x1, x2, y1, y2 in range of 0 to canvas width or height
            dom.setAttribute('gradientUnits', 'userSpaceOnUse');
        }
        else {
            // x1, x2, y1, y2 in range of 0 to 1
            dom.setAttribute('gradientUnits', 'objectBoundingBox');
        }

        // Remove color stops if exists
        dom.innerHTML = '';

        // Add color stops
        var colors = gradient.colorStops;
        for (var i = 0, len = colors.length; i < len; ++i) {
            var stop = this.createElement('stop');
            stop.setAttribute('offset', colors[i].offset * 100 + '%');

            var color = colors[i].color;
            if (color.indexOf('rgba' > -1)) {
                // Fix Safari bug that stop-color not recognizing alpha #9014
                var opacity = parse(color)[3];
                var hex = toHex(color);

                // stop-color cannot be color, since:
                // The opacity value used for the gradient calculation is the
                // *product* of the value of stop-opacity and the opacity of the
                // value of stop-color.
                // See https://www.w3.org/TR/SVG2/pservers.html#StopOpacityProperty
                stop.setAttribute('stop-color', '#' + hex);
                stop.setAttribute('stop-opacity', opacity);
            }
            else {
                stop.setAttribute('stop-color', colors[i].color);
            }

            dom.appendChild(stop);
        }

        // Store dom element in gradient, to avoid creating multiple
        // dom instances for the same gradient element
        gradient._dom = dom;
    }

    /**
     * @method markUsed
     * 
     * Mark a single gradient to be used
     *
     * @param {Displayable} displayable displayable element
     */
    markUsed(displayable) {
        if (displayable.style) {
            var gradient = displayable.style.fill;
            if (gradient && gradient._dom) {
                Definable.prototype.markUsed.call(this, gradient._dom);
            }

            gradient = displayable.style.stroke;
            if (gradient && gradient._dom) {
                Definable.prototype.markUsed.call(this, gradient._dom);
            }
        }
    }
}

/**
 * @class zrender.svg.helper.ClippathManager
 * 
 * Manages SVG clipPath elements.
 * 
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
class ClippathManager extends Definable{
    /**
     * @method constructor ClippathManager
     * @param   {Number}     zrId    zrender instance id
     * @param   {SVGElement} svgRoot root of SVG document
     */
    constructor(zrId, svgRoot){
        super(zrId, svgRoot, 'clipPath', '__clippath_in_use__');
    }

    /**
     * @method update
     * Update clipPath.
     *
     * @param {Displayable} displayable displayable element
     */
    update(displayable) {
        let svgEl = this.getSvgElement(displayable);
        if (svgEl) {
            this.updateDom(svgEl, displayable.__clipPaths, false);
        }
    
        let textEl = this.getTextSvgElement(displayable);
        if (textEl) {
            // Make another clipPath for text, since it's transform
            // matrix is not the same with svgElement
            this.updateDom(textEl, displayable.__clipPaths, true);
        }
    
        this.markUsed(displayable);
    }

    /**
     * @method updateDom
     * Create an SVGElement of displayable and create a <clipPath> of its
     * clipPath
     *
     * @param {Displayable} parentEl  parent element
     * @param {ClipPath[]}  clipPaths clipPaths of parent element
     * @param {boolean}     isText    if parent element is Text
     */
    updateDom(parentEl,clipPaths,isText) {
        if (clipPaths && clipPaths.length > 0) {
            // Has clipPath, create <clipPath> with the first clipPath
            let defs = this.getDefs(true);
            let clipPath = clipPaths[0];
            let clipPathEl;
            let id;
    
            let dom = isText ? '_textDom' : '_dom';
    
            if (clipPath[dom]) {
                // Use a dom that is already in <defs>
                id = clipPath[dom].getAttribute('id');
                clipPathEl = clipPath[dom];
    
                // Use a dom that is already in <defs>
                if (!defs.contains(clipPathEl)) {
                    // This happens when set old clipPath that has
                    // been previously removed
                    defs.appendChild(clipPathEl);
                }
            }
            else {
                // New <clipPath>
                id = 'zr' + this._zrId + '-clip-' + this.nextId;
                ++this.nextId;
                clipPathEl = this.createElement('clipPath');
                clipPathEl.setAttribute('id', id);
                defs.appendChild(clipPathEl);
    
                clipPath[dom] = clipPathEl;
            }
    
            // Build path and add to <clipPath>
            let svgProxy = this.getSvgProxy(clipPath);
            if (clipPath.transform
                && clipPath.parent.invTransform
                && !isText
            ) {
                /**
                 * If a clipPath has a parent with transform, the transform
                 * of parent should not be considered when setting transform
                 * of clipPath. So we need to transform back from parent's
                 * transform, which is done by multiplying parent's inverse
                 * transform.
                 */
                // Store old transform
                let transform = Array.prototype.slice.call(
                    clipPath.transform
                );
    
                // Transform back from parent, and brush path
                mul$1(
                    clipPath.transform,
                    clipPath.parent.invTransform,
                    clipPath.transform
                );
                svgProxy.brush(clipPath);
    
                // Set back transform of clipPath
                clipPath.transform = transform;
            }
            else {
                svgProxy.brush(clipPath);
            }
    
            let pathEl = this.getSvgElement(clipPath);
    
            clipPathEl.innerHTML = '';
            /**
             * Use `cloneNode()` here to appendChild to multiple parents,
             * which may happend when Text and other shapes are using the same
             * clipPath. Since Text will create an extra clipPath DOM due to
             * different transform rules.
             */
            clipPathEl.appendChild(pathEl.cloneNode());
    
            parentEl.setAttribute('clip-path', 'url(#' + id + ')');
    
            if (clipPaths.length > 1) {
                // Make the other clipPaths recursively
                this.updateDom(clipPathEl, clipPaths.slice(1), isText);
            }
        }
        else {
            // No clipPath
            if (parentEl) {
                parentEl.setAttribute('clip-path', 'none');
            }
        }
    }
    
    /**
     * @method markUsed
     * 
     * Mark a single clipPath to be used
     *
     * @param {Displayable} displayable displayable element
     */
    markUsed(displayable) {
        let that = this;
        // displayable.__clipPaths can only be `null`/`undefined` or an non-empty array.
        if (displayable.__clipPaths) {
            each(displayable.__clipPaths, function (clipPath) {
                if (clipPath._dom) {
                    Definable.prototype.markUsed.call(that, clipPath._dom);
                }
                if (clipPath._textDom) {
                    Definable.prototype.markUsed.call(that, clipPath._textDom);
                }
            });
        }
    }
}

/**
 * @class zrender.svg.helper.ShadowManager
 * 
 * Manages SVG shadow elements.
 * 
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

function hasShadow(style) {
    // TODO: textBoxShadowBlur is not supported yet
    return style
        && (style.shadowBlur || style.shadowOffsetX || style.shadowOffsetY
            || style.textShadowBlur || style.textShadowOffsetX
            || style.textShadowOffsetY);
}

/**
 * @method constructor ShadowManager
 * 
 * Manages SVG shadow elements.
 *
 * @param   {Number}     zrId    zrender instance id
 * @param   {SVGElement} svgRoot root of SVG document
 */
class ShadowManager extends Definable{
    constructor(zrId, svgRoot){
        super(
            zrId,
            svgRoot,
            ['filter'],
            '__filter_in_use__',
            '_shadowDom'
        );
    }

    /**
     * Create new shadow DOM for fill or stroke if not exist,
     * but will not update shadow if exists.
     *
     * @param {SvgElement}  svgElement   SVG element to paint
     * @param {Displayable} displayable  zrender displayable element
     */
    addWithoutUpdate(svgElement,displayable) {
        if (displayable && hasShadow(displayable.style)) {
            // Create dom in <defs> if not exists
            let dom;
            if (displayable._shadowDom) {
                // Gradient exists
                dom = displayable._shadowDom;
                let defs = this.getDefs(true);
                if (!defs.contains(displayable._shadowDom)) {
                    // _shadowDom is no longer in defs, recreate
                    this.addDom(dom);
                }
            }else {
                // New dom
                dom = this.add(displayable);
            }

            this.markUsed(displayable);
            let id = dom.getAttribute('id');
            svgElement.style.filter = 'url(#' + id + ')';
        }
    }

    /**
     * Add a new shadow tag in <defs>
     *
     * @param {Displayable} displayable  zrender displayable element
     * @return {SVGFilterElement} created DOM
     */
    add(displayable) {
        let dom = this.createElement('filter');
        // Set dom id with shadow id, since each shadow instance
        // will have no more than one dom element.
        // id may exists before for those dirty elements, in which case
        // id should remain the same, and other attributes should be
        // updated.
        displayable._shadowDomId = displayable._shadowDomId || this.nextId++;
        dom.setAttribute('id', 'zr' + this._zrId
            + '-shadow-' + displayable._shadowDomId);
        this.updateDom(displayable, dom);
        this.addDom(dom);
        return dom;
    }

    /**
     * Update shadow.
     *
     * @param {Displayable} displayable  zrender displayable element
     */
    update(svgElement, displayable) {
        let style = displayable.style;
        if (hasShadow(style)) {
            let that = this;
            Definable.prototype.update.call(this, displayable, function () {
                that.updateDom(displayable, displayable._shadowDom);
            });
        }else {
            // Remove shadow
            this.remove(svgElement, displayable);
        }
    }

    /**
     * Remove DOM and clear parent filter
     */
    remove(svgElement, displayable) {
        if (displayable._shadowDomId != null) {
            this.removeDom(svgElement);
            svgElement.style.filter = '';
        }
    }

    /**
     * Update shadow dom
     *
     * @param {Displayable} displayable  zrender displayable element
     * @param {SVGFilterElement} dom DOM to update
     */
    updateDom(displayable, dom) {
        let domChild = dom.getElementsByTagName('feDropShadow');
        if (domChild.length === 0) {
            domChild = this.createElement('feDropShadow');
        }else {
            domChild = domChild[0];
        }

        let style = displayable.style;
        let scaleX = displayable.scale ? (displayable.scale[0] || 1) : 1;
        let scaleY = displayable.scale ? (displayable.scale[1] || 1) : 1;
        // TODO: textBoxShadowBlur is not supported yet
        let offsetX;
        let offsetY;
        let blur;
        let color;
        if (style.shadowBlur || style.shadowOffsetX || style.shadowOffsetY) {
            offsetX = style.shadowOffsetX || 0;
            offsetY = style.shadowOffsetY || 0;
            blur = style.shadowBlur;
            color = style.shadowColor;
        }else if (style.textShadowBlur) {
            offsetX = style.textShadowOffsetX || 0;
            offsetY = style.textShadowOffsetY || 0;
            blur = style.textShadowBlur;
            color = style.textShadowColor;
        }else {
            // Remove shadow
            this.removeDom(dom, style);
            return;
        }

        domChild.setAttribute('dx', offsetX / scaleX);
        domChild.setAttribute('dy', offsetY / scaleY);
        domChild.setAttribute('flood-color', color);

        // Divide by two here so that it looks the same as in canvas
        // See: https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-shadowblur
        let stdDx = blur / 2 / scaleX;
        let stdDy = blur / 2 / scaleY;
        let stdDeviation = stdDx + ' ' + stdDy;
        domChild.setAttribute('stdDeviation', stdDeviation);

        // Fix filter clipping problem
        dom.setAttribute('x', '-100%');
        dom.setAttribute('y', '-100%');
        dom.setAttribute('width', Math.ceil(blur / 2 * 200) + '%');
        dom.setAttribute('height', Math.ceil(blur / 2 * 200) + '%');
        
        dom.appendChild(domChild);
        // Store dom element in shadow, to avoid creating multiple
        // dom instances for the same shadow element
        displayable._shadowDom = dom;
    }

    /**
     * Mark a single shadow to be used
     *
     * @param {Displayable} displayable displayable element
     */
    markUsed(displayable) {
        if (displayable._shadowDom) {
            Definable.prototype.markUsed.call(this, displayable._shadowDom);
        }
    }
}

/**
 * @class zrender.svg.SVGPainter
 * 
 * SVG 画笔。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

/**
 * @private
 * @method getSvgProxy
 * 
 * ZImage 映射成 svgImage，ZText 映射成 svgText，其它所有都映射成 svgPath。
 * 
 * @param {Element} el 
 */
function getSvgProxy(el) {
    if (el instanceof Path) {
        return svgPath;
    }else if (el instanceof ZImage) {
        return svgImage;
    }else if (el instanceof Text) {
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
    this._opts = opts = extend({}, opts || {});
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
                    if (displayable.style.fill&&displayable.style.stroke) {
                        this.gradientManager.update(displayable.style.fill);
                        this.gradientManager.update(displayable.style.stroke);
                    }
                    
                    this.shadowManager.update(svgElement, displayable);
                    displayable.__dirty = false;
                }
                newVisibleList.push(displayable);
            }
        }

        let diff = arrayDiff$1(visibleList, newVisibleList);
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
            (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh]))
            - (parseInt10(stl[plt]) || 0)
            - (parseInt10(stl[prb]) || 0)
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

registerPainter('svg', SVGPainter);

let urn = 'urn:schemas-microsoft-com:vml';
let win = typeof window === 'undefined' ? null : window;
let vmlInited = false;

let doc = win && win.document;

// Avoid assign to an exported variable, for transforming to cjs.
let doCreateNode;

if (doc && !env$1.canvasSupported) {
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
function initVML() {
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

function createNode(tagName) {
    return doCreateNode(tagName);
}

// http://www.w3.org/TR/NOTE-VML
// TODO:Use proxy like svg instead of overwrite brush methods

let CMD$4 = PathProxy.CMD;
let round$1 = Math.round;
let sqrt = Math.sqrt;
let abs = Math.abs;
let cos$4 = Math.cos;
let sin$4 = Math.sin;
let mathMax$4 = Math.max;

if (!env$1.canvasSupported) {

    let comma = ',';
    let imageTransformPrefix = 'progid:DXImageTransform.Microsoft';

    let Z = 21600;
    let Z2 = Z / 2;

    let ZLEVEL_BASE = 100000;
    let Z_BASE = 1000;

    let initRootElStyle = function (el) {
        el.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;';
        el.coordsize = Z + ',' + Z;
        el.coordorigin = '0,0';
    };

    let encodeHtmlAttribute = function (s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    };

    let rgb2Str = function (r, g, b) {
        return 'rgb(' + [r, g, b].join(',') + ')';
    };

    let append = function (parent, child) {
        if (child && parent && child.parentNode !== parent) {
            parent.appendChild(child);
        }
    };

    let remove = function (parent, child) {
        if (child && parent && child.parentNode === parent) {
            parent.removeChild(child);
        }
    };

    let getZIndex = function (zlevel, z, z2) {
        // z 的取值范围为 [0, 1000]
        return (parseFloat(zlevel) || 0) * ZLEVEL_BASE + (parseFloat(z) || 0) * Z_BASE + z2;
    };

    let parsePercent$$1 = parsePercent;

    //--------------PATH----------------------
    let setColorAndOpacity = function (el, color, opacity) {
        let colorArr = parse(color);
        opacity = +opacity;
        if (isNaN(opacity)) {
            opacity = 1;
        }
        if (colorArr) {
            el.color = rgb2Str(colorArr[0], colorArr[1], colorArr[2]);
            el.opacity = opacity * colorArr[3];
        }
    };

    let getColorAndAlpha = function (color) {
        let colorArr = parse(color);
        return [
            rgb2Str(colorArr[0], colorArr[1], colorArr[2]),
            colorArr[3]
        ];
    };

    let updateFillNode = function (el, style, zrEl) {
        // TODO pattern
        let fill = style.fill;
        if (fill != null) {
            // Modified from excanvas
            if (fill instanceof Gradient) {
                let gradientType;
                let angle = 0;
                let focus = [0, 0];
                // additional offset
                let shift = 0;
                // scale factor for offset
                let expansion = 1;
                let rect = zrEl.getBoundingRect();
                let rectWidth = rect.width;
                let rectHeight = rect.height;
                if (fill.type === 'linear') {
                    gradientType = 'gradient';
                    let transform = zrEl.transform;
                    let p0 = [fill.x * rectWidth, fill.y * rectHeight];
                    let p1 = [fill.x2 * rectWidth, fill.y2 * rectHeight];
                    if (transform) {
                        applyTransform(p0, p0, transform);
                        applyTransform(p1, p1, transform);
                    }
                    let dx = p1[0] - p0[0];
                    let dy = p1[1] - p0[1];
                    angle = Math.atan2(dx, dy) * 180 / Math.PI;
                    // The angle should be a non-negative number.
                    if (angle < 0) {
                        angle += 360;
                    }

                    // Very small angles produce an unexpected result because they are
                    // converted to a scientific notation string.
                    if (angle < 1e-6) {
                        angle = 0;
                    }
                }
                else {
                    gradientType = 'gradientradial';
                    let p0 = [fill.x * rectWidth, fill.y * rectHeight];
                    let transform = zrEl.transform;
                    let scale$$1 = zrEl.scale;
                    let width = rectWidth;
                    let height = rectHeight;
                    focus = [
                        // Percent in bounding rect
                        (p0[0] - rect.x) / width,
                        (p0[1] - rect.y) / height
                    ];
                    if (transform) {
                        applyTransform(p0, p0, transform);
                    }

                    width /= scale$$1[0] * Z;
                    height /= scale$$1[1] * Z;
                    let dimension = mathMax$4(width, height);
                    shift = 2 * 0 / dimension;
                    expansion = 2 * fill.r / dimension - shift;
                }

                // We need to sort the color stops in ascending order by offset,
                // otherwise IE won't interpret it correctly.
                let stops = fill.colorStops.slice();
                stops.sort(function (cs1, cs2) {
                    return cs1.offset - cs2.offset;
                });

                let length$$1 = stops.length;
                // Color and alpha list of first and last stop
                let colorAndAlphaList = [];
                let colors = [];
                for (let i = 0; i < length$$1; i++) {
                    let stop = stops[i];
                    let colorAndAlpha = getColorAndAlpha(stop.color);
                    colors.push(stop.offset * expansion + shift + ' ' + colorAndAlpha[0]);
                    if (i === 0 || i === length$$1 - 1) {
                        colorAndAlphaList.push(colorAndAlpha);
                    }
                }

                if (length$$1 >= 2) {
                    let color1 = colorAndAlphaList[0][0];
                    let color2 = colorAndAlphaList[1][0];
                    let opacity1 = colorAndAlphaList[0][1] * style.opacity;
                    let opacity2 = colorAndAlphaList[1][1] * style.opacity;

                    el.type = gradientType;
                    el.method = 'none';
                    el.focus = '100%';
                    el.angle = angle;
                    el.color = color1;
                    el.color2 = color2;
                    el.colors = colors.join(',');
                    // When colors attribute is used, the meanings of opacity and o:opacity2
                    // are reversed.
                    el.opacity = opacity2;
                    // FIXME g_o_:opacity ?
                    el.opacity2 = opacity1;
                }
                if (gradientType === 'radial') {
                    el.focusposition = focus.join(',');
                }
            }
            else {
                // FIXME Change from Gradient fill to color fill
                setColorAndOpacity(el, fill, style.opacity);
            }
        }
    };

    let updateStrokeNode = function (el, style) {
        // if (style.lineJoin != null) {
        //     el.joinstyle = style.lineJoin;
        // }
        // if (style.miterLimit != null) {
        //     el.miterlimit = style.miterLimit * Z;
        // }
        // if (style.lineCap != null) {
        //     el.endcap = style.lineCap;
        // }
        if (style.lineDash) {
            el.dashstyle = style.lineDash.join(' ');
        }
        if (style.stroke != null && !(style.stroke instanceof Gradient)) {
            setColorAndOpacity(el, style.stroke, style.opacity);
        }
    };

    let updateFillAndStroke = function (vmlEl, type, style, zrEl) {
        let isFill = type === 'fill';
        let el = vmlEl.getElementsByTagName(type)[0];
        // Stroke must have lineWidth
        if (style[type] != null && style[type] !== 'none' && (isFill || (!isFill && style.lineWidth))) {
            vmlEl[isFill ? 'filled' : 'stroked'] = 'true';
            // FIXME Remove before updating, or set `colors` will throw error
            if (style[type] instanceof Gradient) {
                remove(vmlEl, el);
            }
            if (!el) {
                el = createNode(type);
            }

            isFill ? updateFillNode(el, style, zrEl) : updateStrokeNode(el, style);
            append(vmlEl, el);
        }
        else {
            vmlEl[isFill ? 'filled' : 'stroked'] = 'false';
            remove(vmlEl, el);
        }
    };

    let points = [[], [], []];
    let pathDataToString = function (path, m) {
        let M = CMD$4.M;
        let C = CMD$4.C;
        let L = CMD$4.L;
        let A = CMD$4.A;
        let Q = CMD$4.Q;

        let str = [];
        let nPoint;
        let cmdStr;
        let cmd;
        let i;
        let xi;
        let yi;
        let data = path.data;
        let dataLength = path.len();
        let x;
        let y;
        let x0;
        let y0;
        let x1;
        let y1;
        let x2;
        let y2;
        let x3;
        let y3;
        let cx;
        let cy;
        let sx;
        let sy;
        let rx;
        let ry;
        for (i = 0; i < dataLength;) {
            cmd = data[i++];
            cmdStr = '';
            nPoint = 0;
            switch (cmd) {
                case M:
                    cmdStr = ' m ';
                    nPoint = 1;
                    xi = data[i++];
                    yi = data[i++];
                    points[0][0] = xi;
                    points[0][1] = yi;
                    break;
                case L:
                    cmdStr = ' l ';
                    nPoint = 1;
                    xi = data[i++];
                    yi = data[i++];
                    points[0][0] = xi;
                    points[0][1] = yi;
                    break;
                case Q:
                case C:
                    cmdStr = ' c ';
                    nPoint = 3;
                    x1 = data[i++];
                    y1 = data[i++];
                    x2 = data[i++];
                    y2 = data[i++];
                    if (cmd === Q) {
                        // Convert quadratic to cubic using degree elevation
                        x3 = x2;
                        y3 = y2;
                        x2 = (x2 + 2 * x1) / 3;
                        y2 = (y2 + 2 * y1) / 3;
                        x1 = (xi + 2 * x1) / 3;
                        y1 = (yi + 2 * y1) / 3;
                    }
                    else {
                        x3 = data[i++];
                        y3 = data[i++];
                    }
                    points[0][0] = x1;
                    points[0][1] = y1;
                    points[1][0] = x2;
                    points[1][1] = y2;
                    points[2][0] = x3;
                    points[2][1] = y3;

                    xi = x3;
                    yi = y3;
                    break;
                case A:
                    x = 0;
                    y = 0;
                    sx = 1;
                    sy = 1;
                    let angle = 0;
                    if (m) {
                        // Extract SRT from matrix
                        x = m[4];
                        y = m[5];
                        sx = sqrt(m[0] * m[0] + m[1] * m[1]);
                        sy = sqrt(m[2] * m[2] + m[3] * m[3]);
                        angle = Math.atan2(-m[1] / sy, m[0] / sx);
                    }

                    cx = data[i++];
                    cy = data[i++];
                    rx = data[i++];
                    ry = data[i++];
                    let startAngle = data[i++] + angle;
                    let endAngle = data[i++] + startAngle + angle;
                    // FIXME
                    // let psi = data[i++];
                    i++;
                    let clockwise = data[i++];

                    x0 = cx + cos$4(startAngle) * rx;
                    y0 = cy + sin$4(startAngle) * ry;

                    x1 = cx + cos$4(endAngle) * rx;
                    y1 = cy + sin$4(endAngle) * ry;

                    let type = clockwise ? ' wa ' : ' at ';
                    if (Math.abs(x0 - x1) < 1e-4) {
                        // IE won't render arches drawn counter clockwise if x0 == x1.
                        if (Math.abs(endAngle - startAngle) > 1e-2) {
                            // Offset x0 by 1/80 of a pixel. Use something
                            // that can be represented in binary
                            if (clockwise) {
                                x0 += 270 / Z;
                            }
                        }
                        else {
                            // Avoid case draw full circle
                            if (Math.abs(y0 - cy) < 1e-4) {
                                if ((clockwise && x0 < cx) || (!clockwise && x0 > cx)) {
                                    y1 -= 270 / Z;
                                }else {
                                    y1 += 270 / Z;
                                }
                            }else if ((clockwise && y0 < cy) || (!clockwise && y0 > cy)) {
                                x1 += 270 / Z;
                            }else {
                                x1 -= 270 / Z;
                            }
                        }
                    }
                    str.push(
                        type,
                        round$1(((cx - rx) * sx + x) * Z - Z2), comma,
                        round$1(((cy - ry) * sy + y) * Z - Z2), comma,
                        round$1(((cx + rx) * sx + x) * Z - Z2), comma,
                        round$1(((cy + ry) * sy + y) * Z - Z2), comma,
                        round$1((x0 * sx + x) * Z - Z2), comma,
                        round$1((y0 * sy + y) * Z - Z2), comma,
                        round$1((x1 * sx + x) * Z - Z2), comma,
                        round$1((y1 * sy + y) * Z - Z2)
                    );

                    xi = x1;
                    yi = y1;
                    break;
                case CMD$4.R:
                    let p0 = points[0];
                    let p1 = points[1];
                    // x0, y0
                    p0[0] = data[i++];
                    p0[1] = data[i++];
                    // x1, y1
                    p1[0] = p0[0] + data[i++];
                    p1[1] = p0[1] + data[i++];

                    if (m) {
                        applyTransform(p0, p0, m);
                        applyTransform(p1, p1, m);
                    }

                    p0[0] = round$1(p0[0] * Z - Z2);
                    p1[0] = round$1(p1[0] * Z - Z2);
                    p0[1] = round$1(p0[1] * Z - Z2);
                    p1[1] = round$1(p1[1] * Z - Z2);
                    str.push(
                        // x0, y0
                        ' m ', p0[0], comma, p0[1],
                        // x1, y0
                        ' l ', p1[0], comma, p0[1],
                        // x1, y1
                        ' l ', p1[0], comma, p1[1],
                        // x0, y1
                        ' l ', p0[0], comma, p1[1]
                    );
                    break;
                case CMD$4.Z:
                    // FIXME Update xi, yi
                    str.push(' x ');
            }

            if (nPoint > 0) {
                str.push(cmdStr);
                for (let k = 0; k < nPoint; k++) {
                    let p = points[k];
                    m && applyTransform(p, p, m);
                    // 不 round 会非常慢
                    str.push(
                        round$1(p[0] * Z - Z2), comma, round$1(p[1] * Z - Z2),
                        k < nPoint - 1 ? comma : ''
                    );
                }
            }
        }
        return str.join('');
    };

    /**
     * @class zrender.vml.Path
     * 
     * Append brushVML method to standard shape classes inside graphic package, VMLPainter will
     * use this method instead of standard brush() method.
     * 
     * 在标准的 shape 类上扩展一个 brushVML 方法，在 VMLPainter 中会调用此方法，而不是标准的 brush 方法。
     * 
     * @docauthor 大漠穷秋 damoqiongqiu@126.com
     */

    // Rewrite the original path method
    Path.prototype.brushVML = function (vmlRoot) {
        let style = this.style;
        let vmlEl = this._vmlEl;
        if (!vmlEl) {
            vmlEl = createNode('shape');
            initRootElStyle(vmlEl);

            this._vmlEl = vmlEl;
        }

        updateFillAndStroke(vmlEl, 'fill', style, this);
        updateFillAndStroke(vmlEl, 'stroke', style, this);

        let m = this.transform;
        let needTransform = m != null;
        let strokeEl = vmlEl.getElementsByTagName('stroke')[0];
        if (strokeEl) {
            let lineWidth = style.lineWidth;
            // Get the line scale.
            // Determinant of this.m_ means how much the area is enlarged by the
            // transformation. So its square root can be used as a scale factor
            // for width.
            if (needTransform && !style.strokeNoScale) {
                let det = m[0] * m[3] - m[1] * m[2];
                lineWidth *= sqrt(abs(det));
            }
            strokeEl.weight = lineWidth + 'px';
        }

        let path = this.path || (this.path = new PathProxy());
        if (this.__dirtyPath) {
            path.beginPath();
            path.subPixelOptimize = false;
            this.buildPath(path, this.shape);
            path.toStatic();
            this.__dirtyPath = false;
        }

        vmlEl.path = pathDataToString(path, this.transform);

        vmlEl.style.zIndex = getZIndex(this.zlevel, this.z, this.z2);

        // Append to root
        append(vmlRoot, vmlEl);

        // Text
        if (style.text != null) {
            this.drawRectText(vmlRoot, this.getBoundingRect());
        }
        else {
            this.removeRectText(vmlRoot);
        }
    };

    Path.prototype.onRemove = function (vmlRoot) {
        remove(vmlRoot, this._vmlEl);
        this.removeRectText(vmlRoot);
    };

    Path.prototype.onAdd = function (vmlRoot) {
        append(vmlRoot, this._vmlEl);
        this.appendRectText(vmlRoot);
    };

    //--------------IMAGE----------------------
    let isImage = function (img) {
        // FIXME img instanceof Image 如果 img 是一个字符串的时候，IE8 下会报错
        return (typeof img === 'object') && img.tagName && img.tagName.toUpperCase() === 'IMG';
        // return img instanceof Image;
    };

    /**
     * @class zrender.vml.ZImage
     * 
     * @docauthor 大漠穷秋 damoqiongqiu@126.com
     */
    // Rewrite the original path method
    ZImage.prototype.brushVML = function (vmlRoot) {
        let style = this.style;
        let image = style.image;

        // Image original width, height
        let ow;
        let oh;

        if (isImage(image)) {
            let src = image.src;
            if (src === this._imageSrc) {
                ow = this._imageWidth;
                oh = this._imageHeight;
            }
            else {
                let imageRuntimeStyle = image.runtimeStyle;
                let oldRuntimeWidth = imageRuntimeStyle.width;
                let oldRuntimeHeight = imageRuntimeStyle.height;
                imageRuntimeStyle.width = 'auto';
                imageRuntimeStyle.height = 'auto';

                // get the original size
                ow = image.width;
                oh = image.height;

                // and remove overides
                imageRuntimeStyle.width = oldRuntimeWidth;
                imageRuntimeStyle.height = oldRuntimeHeight;

                // Caching image original width, height and src
                this._imageSrc = src;
                this._imageWidth = ow;
                this._imageHeight = oh;
            }
            image = src;
        }
        else {
            if (image === this._imageSrc) {
                ow = this._imageWidth;
                oh = this._imageHeight;
            }
        }
        if (!image) {
            return;
        }

        let x = style.x || 0;
        let y = style.y || 0;

        let dw = style.width;
        let dh = style.height;

        let sw = style.sWidth;
        let sh = style.sHeight;
        let sx = style.sx || 0;
        let sy = style.sy || 0;

        let hasCrop = sw && sh;

        let vmlEl = this._vmlEl;
        if (!vmlEl) {
            // FIXME 使用 group 在 left, top 都不是 0 的时候就无法显示了。
            // vmlEl = vmlCore.createNode('group');
            vmlEl = doc.createElement('div');
            initRootElStyle(vmlEl);

            this._vmlEl = vmlEl;
        }

        let vmlElStyle = vmlEl.style;
        let hasRotation = false;
        let m;
        let scaleX = 1;
        let scaleY = 1;
        if (this.transform) {
            m = this.transform;
            scaleX = sqrt(m[0] * m[0] + m[1] * m[1]);
            scaleY = sqrt(m[2] * m[2] + m[3] * m[3]);

            hasRotation = m[1] || m[2];
        }
        if (hasRotation) {
            // If filters are necessary (rotation exists), create them
            // filters are bog-slow, so only create them if abbsolutely necessary
            // The following check doesn't account for skews (which don't exist
            // in the canvas spec (yet) anyway.
            // From excanvas
            let p0 = [x, y];
            let p1 = [x + dw, y];
            let p2 = [x, y + dh];
            let p3 = [x + dw, y + dh];
            applyTransform(p0, p0, m);
            applyTransform(p1, p1, m);
            applyTransform(p2, p2, m);
            applyTransform(p3, p3, m);

            let maxX = mathMax$4(p0[0], p1[0], p2[0], p3[0]);
            let maxY = mathMax$4(p0[1], p1[1], p2[1], p3[1]);

            let transformFilter = [];
            transformFilter.push('M11=', m[0] / scaleX, comma,
                        'M12=', m[2] / scaleY, comma,
                        'M21=', m[1] / scaleX, comma,
                        'M22=', m[3] / scaleY, comma,
                        'Dx=', round$1(x * scaleX + m[4]), comma,
                        'Dy=', round$1(y * scaleY + m[5]));

            vmlElStyle.padding = '0 ' + round$1(maxX) + 'px ' + round$1(maxY) + 'px 0';
            // FIXME DXImageTransform 在 IE11 的兼容模式下不起作用
            vmlElStyle.filter = imageTransformPrefix + '.Matrix('
                + transformFilter.join('') + ', SizingMethod=clip)';

        }
        else {
            if (m) {
                x = x * scaleX + m[4];
                y = y * scaleY + m[5];
            }
            vmlElStyle.filter = '';
            vmlElStyle.left = round$1(x) + 'px';
            vmlElStyle.top = round$1(y) + 'px';
        }

        let imageEl = this._imageEl;
        let cropEl = this._cropEl;

        if (!imageEl) {
            imageEl = doc.createElement('div');
            this._imageEl = imageEl;
        }
        let imageELStyle = imageEl.style;
        if (hasCrop) {
            // Needs know image original width and height
            if (!(ow && oh)) {
                let tmpImage = new Image();
                let self = this;
                tmpImage.onload = function () {
                    tmpImage.onload = null;
                    ow = tmpImage.width;
                    oh = tmpImage.height;
                    // Adjust image width and height to fit the ratio destinationSize / sourceSize
                    imageELStyle.width = round$1(scaleX * ow * dw / sw) + 'px';
                    imageELStyle.height = round$1(scaleY * oh * dh / sh) + 'px';

                    // Caching image original width, height and src
                    self._imageWidth = ow;
                    self._imageHeight = oh;
                    self._imageSrc = image;
                };
                tmpImage.src = image;
            }
            else {
                imageELStyle.width = round$1(scaleX * ow * dw / sw) + 'px';
                imageELStyle.height = round$1(scaleY * oh * dh / sh) + 'px';
            }

            if (!cropEl) {
                cropEl = doc.createElement('div');
                cropEl.style.overflow = 'hidden';
                this._cropEl = cropEl;
            }
            let cropElStyle = cropEl.style;
            cropElStyle.width = round$1((dw + sx * dw / sw) * scaleX);
            cropElStyle.height = round$1((dh + sy * dh / sh) * scaleY);
            cropElStyle.filter = imageTransformPrefix + '.Matrix(Dx='
                    + (-sx * dw / sw * scaleX) + ',Dy=' + (-sy * dh / sh * scaleY) + ')';

            if (!cropEl.parentNode) {
                vmlEl.appendChild(cropEl);
            }
            if (imageEl.parentNode !== cropEl) {
                cropEl.appendChild(imageEl);
            }
        }
        else {
            imageELStyle.width = round$1(scaleX * dw) + 'px';
            imageELStyle.height = round$1(scaleY * dh) + 'px';

            vmlEl.appendChild(imageEl);

            if (cropEl && cropEl.parentNode) {
                vmlEl.removeChild(cropEl);
                this._cropEl = null;
            }
        }

        let filterStr = '';
        let alpha = style.opacity;
        if (alpha < 1) {
            filterStr += '.Alpha(opacity=' + round$1(alpha * 100) + ') ';
        }
        filterStr += imageTransformPrefix + '.AlphaImageLoader(src=' + image + ', SizingMethod=scale)';

        imageELStyle.filter = filterStr;

        vmlEl.style.zIndex = getZIndex(this.zlevel, this.z, this.z2);

        // Append to root
        append(vmlRoot, vmlEl);

        // Text
        if (style.text != null) {
            this.drawRectText(vmlRoot, this.getBoundingRect());
        }
    };

    ZImage.prototype.onRemove = function (vmlRoot) {
        remove(vmlRoot, this._vmlEl);

        this._vmlEl = null;
        this._cropEl = null;
        this._imageEl = null;

        this.removeRectText(vmlRoot);
    };

    ZImage.prototype.onAdd = function (vmlRoot) {
        append(vmlRoot, this._vmlEl);
        this.appendRectText(vmlRoot);
    };


    //--------------TEXT----------------------
    let DEFAULT_STYLE_NORMAL = 'normal';
    let fontStyleCache = {};
    let fontStyleCacheCount = 0;
    let MAX_FONT_CACHE_SIZE = 100;
    let fontEl = document.createElement('div');

    let getFontStyle = function (fontString) {
        let fontStyle = fontStyleCache[fontString];
        if (!fontStyle) {
            // Clear cache
            if (fontStyleCacheCount > MAX_FONT_CACHE_SIZE) {
                fontStyleCacheCount = 0;
                fontStyleCache = {};
            }

            let style = fontEl.style;
            let fontFamily;
            try {
                style.font = fontString;
                fontFamily = style.fontFamily.split(',')[0];
            }
            catch (e) {
            }

            fontStyle = {
                style: style.fontStyle || DEFAULT_STYLE_NORMAL,
                variant: style.fontVariant || DEFAULT_STYLE_NORMAL,
                weight: style.fontWeight || DEFAULT_STYLE_NORMAL,
                size: parseFloat(style.fontSize || 12) | 0,
                family: fontFamily || 'Microsoft YaHei'
            };

            fontStyleCache[fontString] = fontStyle;
            fontStyleCacheCount++;
        }
        return fontStyle;
    };

    let textMeasureEl;
    // Overwrite measure text method
    $override$1('measureText', function (text, textFont) {
        let doc$$1 = doc;
        if (!textMeasureEl) {
            textMeasureEl = doc$$1.createElement('div');
            textMeasureEl.style.cssText = 'position:absolute;top:-20000px;left:0;'
                + 'padding:0;margin:0;border:none;white-space:pre;';
            doc.body.appendChild(textMeasureEl);
        }

        try {
            textMeasureEl.style.font = textFont;
        }
        catch (ex) {
            // Ignore failures to set to invalid font.
        }
        textMeasureEl.innerHTML = '';
        // Don't use innerHTML or innerText because they allow markup/whitespace.
        textMeasureEl.appendChild(doc$$1.createTextNode(text));
        return {
            width: textMeasureEl.offsetWidth
        };
    });

    let tmpRect = new BoundingRect();

    let drawRectText = function (vmlRoot, rect, textRect, fromTextEl) {

        let style = this.style;

        // Optimize, avoid normalize every time.
        this.__dirty && normalizeTextStyle(style, true);

        let text = style.text;
        // Convert to string
        text != null && (text += '');
        if (!text) {
            return;
        }

        // Convert rich text to plain text. Rich text is not supported in
        // IE8-, but tags in rich text template will be removed.
        if (style.rich) {
            let contentBlock = parseRichText(text, style);
            text = [];
            for (let i = 0; i < contentBlock.lines.length; i++) {
                let tokens = contentBlock.lines[i].tokens;
                let textLine = [];
                for (let j = 0; j < tokens.length; j++) {
                    textLine.push(tokens[j].text);
                }
                text.push(textLine.join(''));
            }
            text = text.join('\n');
        }

        let x;
        let y;
        let align = style.textAlign;
        let verticalAlign = style.textVerticalAlign;

        let fontStyle = getFontStyle(style.font);
        // FIXME encodeHtmlAttribute ?
        let font = fontStyle.style + ' ' + fontStyle.variant + ' ' + fontStyle.weight + ' '
            + fontStyle.size + 'px "' + fontStyle.family + '"';

        textRect = textRect || getBoundingRect(
            text, font, align, verticalAlign, style.textPadding, style.textLineHeight
        );

        // Transform rect to view space
        let m = this.transform;
        // Ignore transform for text in other element
        if (m && !fromTextEl) {
            tmpRect.copy(rect);
            tmpRect.applyTransform(m);
            rect = tmpRect;
        }

        if (!fromTextEl) {
            let textPosition = style.textPosition;
            // Text position represented by coord
            if (textPosition instanceof Array) {
                x = rect.x + parsePercent$$1(textPosition[0], rect.width);
                y = rect.y + parsePercent$$1(textPosition[1], rect.height);

                align = align || 'left';
            }
            else {
                let res = this.calculateTextPosition
                    ? this.calculateTextPosition({}, style, rect)
                    : calculateTextPosition({}, style, rect);
                x = res.x;
                y = res.y;

                // Default align and baseline when has textPosition
                align = align || res.textAlign;
                verticalAlign = verticalAlign || res.textVerticalAlign;
            }
        }
        else {
            x = rect.x;
            y = rect.y;
        }

        x = adjustTextX(x, textRect.width, align);
        y = adjustTextY(y, textRect.height, verticalAlign);

        // Force baseline 'middle'
        y += textRect.height / 2;

        // let fontSize = fontStyle.size;
        // 1.75 is an arbitrary number, as there is no info about the text baseline
        // switch (baseline) {
            // case 'hanging':
            // case 'top':
            //     y += fontSize / 1.75;
            //     break;
        //     case 'middle':
        //         break;
        //     default:
        //     // case null:
        //     // case 'alphabetic':
        //     // case 'ideographic':
        //     // case 'bottom':
        //         y -= fontSize / 2.25;
        //         break;
        // }

        // switch (align) {
        //     case 'left':
        //         break;
        //     case 'center':
        //         x -= textRect.width / 2;
        //         break;
        //     case 'right':
        //         x -= textRect.width;
        //         break;
            // case 'end':
                // align = elementStyle.direction == 'ltr' ? 'right' : 'left';
                // break;
            // case 'start':
                // align = elementStyle.direction == 'rtl' ? 'right' : 'left';
                // break;
            // default:
            //     align = 'left';
        // }

        let createNode$$1 = createNode;

        let textVmlEl = this._textVmlEl;
        let pathEl;
        let textPathEl;
        let skewEl;
        if (!textVmlEl) {
            textVmlEl = createNode$$1('line');
            pathEl = createNode$$1('path');
            textPathEl = createNode$$1('textpath');
            skewEl = createNode$$1('skew');

            // FIXME Why here is not cammel case
            // Align 'center' seems wrong
            textPathEl.style['v-text-align'] = 'left';

            initRootElStyle(textVmlEl);

            pathEl.textpathok = true;
            textPathEl.on = true;

            textVmlEl.from = '0 0';
            textVmlEl.to = '1000 0.05';

            append(textVmlEl, skewEl);
            append(textVmlEl, pathEl);
            append(textVmlEl, textPathEl);

            this._textVmlEl = textVmlEl;
        }
        else {
            // 这里是在前面 appendChild 保证顺序的前提下
            skewEl = textVmlEl.firstChild;
            pathEl = skewEl.nextSibling;
            textPathEl = pathEl.nextSibling;
        }

        let coords = [x, y];
        let textVmlElStyle = textVmlEl.style;
        // Ignore transform for text in other element
        if (m && fromTextEl) {
            applyTransform(coords, coords, m);

            skewEl.on = true;

            skewEl.matrix = m[0].toFixed(3) + comma + m[2].toFixed(3) + comma
                            + m[1].toFixed(3) + comma + m[3].toFixed(3) + ',0,0';

            // Text position
            skewEl.offset = (round$1(coords[0]) || 0) + ',' + (round$1(coords[1]) || 0);
            // Left top point as origin
            skewEl.origin = '0 0';

            textVmlElStyle.left = '0px';
            textVmlElStyle.top = '0px';
        }
        else {
            skewEl.on = false;
            textVmlElStyle.left = round$1(x) + 'px';
            textVmlElStyle.top = round$1(y) + 'px';
        }

        textPathEl.string = encodeHtmlAttribute(text);
        // TODO
        try {
            textPathEl.style.font = font;
        }
        // Error font format
        catch (e) {}

        updateFillAndStroke(textVmlEl, 'fill', {
            fill: style.textFill,
            opacity: style.opacity
        }, this);
        updateFillAndStroke(textVmlEl, 'stroke', {
            stroke: style.textStroke,
            opacity: style.opacity,
            lineDash: style.lineDash || null // style.lineDash can be `false`.
        }, this);

        textVmlEl.style.zIndex = getZIndex(this.zlevel, this.z, this.z2);

        // Attached to root
        append(vmlRoot, textVmlEl);
    };

    let removeRectText = function (vmlRoot) {
        remove(vmlRoot, this._textVmlEl);
        this._textVmlEl = null;
    };

    let appendRectText = function (vmlRoot) {
        append(vmlRoot, this._textVmlEl);
    };

    let list = [RectText, Displayable, ZImage, Path, Text];

    // In case Displayable has been mixed in RectText
    for (let i = 0; i < list.length; i++) {
        let proto = list[i].prototype;
        proto.drawRectText = drawRectText;
        proto.removeRectText = removeRectText;
        proto.appendRectText = appendRectText;
    }

    /**
     * @class zrender.vml.Text
     * 
     * @docauthor 大漠穷秋 damoqiongqiu@126.com
     */
    Text.prototype.brushVML = function (vmlRoot) {
        let style = this.style;
        if (style.text != null) {
            this.drawRectText(vmlRoot, {
                x: style.x || 0, y: style.y || 0,
                width: 0, height: 0
            }, this.getBoundingRect(), true);
        }
        else {
            this.removeRectText(vmlRoot);
        }
    };

    Text.prototype.onRemove = function (vmlRoot) {
        this.removeRectText(vmlRoot);
    };

    Text.prototype.onAdd = function (vmlRoot) {
        this.appendRectText(vmlRoot);
    };
}

/**
 * @class zrender.svg.VMLPainter
 * 
 * VMLPainter.
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

/**
 * @method constructor VMLPainter
 * @param {*} root 
 * @param {*} storage 
 */
function VMLPainter(root, storage) {
    initVML();
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

        return ((root.clientWidth || parseInt10(stl.width))
                - parseInt10(stl.paddingLeft)
                - parseInt10(stl.paddingRight)) | 0;
    },

    /**
     * @private
     * @method _getHeight
     */
    _getHeight: function () {
        let root = this.root;
        let stl = root.currentStyle;
        return ((root.clientHeight || parseInt10(stl.height))
                - parseInt10(stl.paddingTop)
                - parseInt10(stl.paddingBottom)) | 0;
    }
};

// Not supported methods
function createMethodNotSupport$1(method) {
    return function () {
        console.log('In IE8.0 VML mode painter not support method "' + method + '"');
    };
}

// Unsupported methods
[
    'getLayer', 'insertLayer', 'eachLayer', 
    'eachBuiltinLayer', 'eachOtherLayer', 'getLayers',
    'modLayer', 'delLayer', 'clearLayer', 
    'toDataURL', 'pathToImage'
].forEach((name,index)=>{
    VMLPainter.prototype[name] = createMethodNotSupport$1(name);
});

registerPainter('vml', VMLPainter);

exports.version = version;
exports.init = init;
exports.dispose = dispose;
exports.getInstance = getInstance;
exports.registerPainter = registerPainter;
exports.matrix = matrix;
exports.vector = vector;
exports.color = colorUtil;
exports.path = pathUtil;
exports.util = dataStructureUtil;
exports.parseSVG = parseSVG;
exports.Group = Group;
exports.Path = Path;
exports.Image = ZImage;
exports.CompoundPath = CompoundPath;
exports.Text = Text;
exports.IncrementalDisplayable = IncrementalDisplayble;
exports.Arc = Arc;
exports.BezierCurve = BezierCurve;
exports.Circle = Circle;
exports.Droplet = Droplet$1;
exports.Ellipse = Droplet;
exports.Heart = Heart;
exports.Isogon = Isogon;
exports.Line = Line;
exports.Polygon = Polygon;
exports.Polyline = Polyline;
exports.Rect = Rect;
exports.Ring = Ring;
exports.Rose = Rose;
exports.Sector = Sector;
exports.Star = Star;
exports.Trochoid = Trochold;
exports.LinearGradient = LinearGradient;
exports.RadialGradient = RadialGradient;
exports.Pattern = Pattern;
exports.BoundingRect = BoundingRect;

})));
//# sourceMappingURL=zrender.js.map
