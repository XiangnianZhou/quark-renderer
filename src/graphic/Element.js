import guid from '../core/utils/guid';
import Eventful from '../event/Eventful';
import Transformable from './Transformable';
import Animatable from '../animation/Animatable';
import * as dataUtil from '../core/utils/dataStructureUtil';
import * as classUtil from '../core/utils/classUtil';
/**
 * @class zrender.graphic.Element 
 * 图形顶级抽象类，关键继承结构为 Element<-Displayable<-Path，shape包中的所有形状对象
 * 都是 Path 的子类。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor Element
 */
let Element = function (opts) {
    Transformable.call(this, opts);
    Eventful.call(this, opts);
    Animatable.call(this, opts);

    /**
     * @property {String}
     */
    this.id = opts.id || guid();
};

Element.prototype = {
    /**
     * @property {String} type 元素类型
     */
    type: 'element',

    /**
     * @property {String} name 元素名字
     */
    name: '',

    /**
     * @private
     * @property {ZRender} __zr
     * ZRender instance will be assigned when element is associated with zrender
     * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
     */
    __zr: null,

    /**
     * @property {Boolean} __dirty
     * Dirty flag. From which painter will determine if this displayable object needs to be repainted.
     * 这是一个非常重要的标志位，在绘制大量对象的时候，把 __dirty 标记为 false 可以节省大量操作。
     */
    __dirty: true,

    /**
     * @private
     * @property  _rect
     */
    _rect:null,

    /**
     * @property {Boolean} ignore
     * If ignore drawing and events of the element object
     * 图形是否忽略，为true时忽略图形的绘制以及事件触发
     */
    ignore: false,

    /**
     * @property {Path} clipPath
     * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
     * 该路径会继承被裁减对象的变换
     * @readOnly
     * @see http://www.w3.org/TR/2dcontext/#clipping-region
     */
    clipPath: null,

    /**
     * @property {Boolean} isGroup
     * 是否是 Group
     */
    isGroup: false,

    /**
     * @method
     * Drift element
     * 移动图元
     * @param  {Number} dx dx on the global space
     * @param  {Number} dy dy on the global space
     */
    drift: function (dx, dy) {
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
    },

    /**
     * @property {Function} beforeUpdate
     * Hook before update
     * 
     * 刷新之前回调
     */
    beforeUpdate: function () {},

    /**
     * @property {Function} update
     * Update each frame
     * 
     * 刷新每一帧回调
     */
    update: function () {
        this.updateTransform();
    },

    /**
     * @property {Function} afterUpdate
     * Hook after update
     * 
     * 刷新之后回调
     */
    afterUpdate: function () {},
    
    /**
     * @property {Function} traverse
     * @param  {Function} cb
     * @param  {Object}   context
     */
    traverse: function (cb, context) {},

    /**
     * @protected
     * @method attrKV
     * @param {String} key
     * @param {Object} value
     */
    attrKV: function (key, value) {
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
    },

    /**
     * @method hide
     * Hide the element
     */
    hide: function () {
        this.ignore = true;
        this.__zr && this.__zr.refresh();
    },

    /**
     * @method show
     * Show the element
     */
    show: function () {
        this.ignore = false;
        this.__zr && this.__zr.refresh();
    },

    /**
     * @method attr
     * 修改对象上的属性。
     * @param {String|Object} key
     * @param {*} value
     */
    attr: function (key, value) {
        if (typeof key === 'String') {
            this.attrKV(key, value);
        }else if (dataUtil.isObject(key)) {
            for (let name in key) {
                if (key.hasOwnProperty(name)) {
                    this.attrKV(name, key[name]);
                }
            }
        }
        this.dirty(false);
        return this;
    },

    /**
     * @method setClipPath
     * @param {Path} clipPath
     */
    setClipPath: function (clipPath) {
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
    },

    /**
     * @method removeClipPath
     */
    removeClipPath: function () {
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
    },

    /**
     * @method dirty
     * Mark displayable element dirty and refresh next frame
     */
    dirty: function () {
        this.__dirty = this.__dirtyText = true;
        this._rect = null;
        this.__zr && this.__zr.refresh();
    },

    /**
     * @method addSelfToZr
     * Add self to zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {ZRender} zr
     */
    addSelfToZr: function (zr) {
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
    },

    /**
     * @method removeSelfFromZr
     * Remove self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {ZRender} zr
     */
    removeSelfFromZr: function (zr) {
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
};

classUtil.mixin(Element, Animatable);
classUtil.mixin(Element, Transformable);
classUtil.mixin(Element, Eventful);

export default Element;