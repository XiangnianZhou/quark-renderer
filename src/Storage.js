import Eventful from './event/Eventful';
import * as classUtil from './core/utils/class_util';
import * as util from './core/utils/data_structure_util';
import env from './core/env';
import Group from './graphic/Group';
// Use timsort because in most case elements are partially sorted
// https://jsfiddle.net/pissang/jr4x7mdm/8/
import timsort from './core/utils/timsort';

/**
 * @class qrenderer.core.Storage
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
    this._roots = new Map();//直接放在画布上的对象为根对象

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

    classUtil.inheritProperties(this,Eventful);
};

Storage.prototype = {

    constructor: Storage,

    /**
     * @method traverse
     * @param  {Function} cb
     * @param  {Object} context
     */
    traverse: function (cb, context) {
        this._roots.forEach((el,id,map)=>{
            el.traverse(cb,context);
        });
    },

    /**
     * @method getDisplayList
     * 返回所有图形的绘制队列
     * @param {boolean} [needUpdate=false] 是否在返回前更新该数组
     * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 needUpdate 为 true 的时候有效
     *
     * 详见{@link Displayable.prototype.updateDisplayList}
     * @return {Array<Displayable>}
     */
    getDisplayList: function (needUpdate, includeIgnore) {
        includeIgnore = includeIgnore || false;
        if (needUpdate) {
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
        let displayList = this._displayList;

        this._roots.forEach((el,id,map)=>{
            this._updateAndAddDisplayable(el, null, includeIgnore);
        });

        displayList.length = this._displayListLen;
        env.canvasSupported && timsort(displayList, this.displayableSortFunc);
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

        if (el.__dirty) {
            el.composeLocalTransform();
        }

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
                currentClipPath.composeLocalTransform();
                clipPaths.push(currentClipPath);
                parentClipPath = currentClipPath;
                currentClipPath = currentClipPath.clipPath;
            }
        }

        if (el.type==='group') {
            let children = el.children;
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
     * @method addToRoot
     * 添加图形(Shape)或者组(Group)到根节点
     * @param {Element} el
     */
    addToRoot: function (el) {
        if (el.__storage === this) {
            return;
        }
        if (el.type==='group') {
            el.addChildrenToStorage(this);
        }
        this.trigger("beforeAdd",el);
        this.addToStorage(el);
        this._roots.set(el.id,el);
        this.trigger("add",el);
    },

    /**
     * @method
     * 删除指定的图形(Shape)或者组(Group)
     * @param {string|Array.<String>} [el] 如果为空清空整个Storage
     */
    delFromRoot: function (el) {
        if (el == null) {//全部清空
            this._roots.forEach((item,id,map)=>{
                if(item&&item.type==='group'){
                    item.delChildrenFromStorage(this);
                }
            });
            this._roots = new Map();
            this._displayList = [];
            this._displayListLen = 0;
            return;
        }

        if (el instanceof Array) {
            for (let i = 0, l = el.length; i < l; i++) {
                this.delFromRoot(el[i]);
            }
            return;
        }

        if(this._roots.get(el.id)){
            this.delFromStorage(el);
            this._roots.delete(el.id);
            if (el.type==='group') {
                el.delChildrenFromStorage(this);
            }
            this.trigger("del",el);
        }
    },

    /**
     * @method addToStorage
     * @param {Element} el 
     */
    addToStorage: function (el) {
        if (el) {
            el.__storage = this;
            el.addToQr();
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
            el.removeFromQr();
        }
        return this;
    },

    /**
     * @method dispose
     * 清空并且释放Storage
     */
    dispose: function () {
        this._renderList =null;
        this._roots = null;
    },

    displayableSortFunc: function(a, b) {
        if (a.qlevel === b.qlevel) {
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
        return a.qlevel - b.qlevel;
    }
};

classUtil.mixin(Storage, Eventful);
export default Storage;