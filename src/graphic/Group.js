import * as classUtil from '../core/utils/classUtil';
import Element from './Element';
import BoundingRect from '../core/BoundingRect';
import { extend } from '../core/utils/dataStructureUtil';

/**
 * @class qrenderer.graphic.Group
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
 *      let Group = require('qrenderer/Group');
 *      let Circle = require('qrenderer/graphic/shape/Circle');
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
 *      qr.add(g);
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

        classUtil.copyOwnProperties(this,options);
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
        let qr = this.__qr;
        if (storage && storage !== child.__storage) {

            storage.addToStorage(child);

            if (child instanceof Group) {
                child.addChildrenToStorage(storage);
            }
        }
        qr && qr.refresh();
    }

    /**
     * @method remove
     * 移除子节点
     * @param {Element} child
     */
    remove(child) {
        let qr = this.__qr;
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

        qr && qr.refresh();
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
        this.__qr && this.__qr.refresh();
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

export default Group;