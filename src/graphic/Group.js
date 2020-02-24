import * as classUtil from '../core/utils/class_util';
import Element from './Element';
import BoundingRect from './transform/BoundingRect';
import { extend } from '../core/utils/data_structure_util';

/**
 * @class qrenderer.graphic.Group
 * 
 * - Group can have child nodes, not the other Element types.
 * - The transformations applied to Group will apply to its children too.
 * 
 * - Group 可以插入子节点，其它类型不能。
 * - Group 上的变换也会被应用到子节点上。
 * 
 *      @example small frame
 *      let Group = require('qrenderer/Group');
 *      let Circle = require('qrenderer/graphic/shape/Circle');
 *      let g = new Group();
 *      g.add(new Circle({
 *          position:[100,100],
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
         * @property {String}
         */
        this.type='group';
        
        /**
         * @property children
         */
        this.children = [];

        /**
         * @private
         * @property __storage
         */
        this.__storage = null;
    }

    /**
     * @method add
     * 添加子节点到最后
     * @param {Element} child
     */
    add(child) {
        if (child 
            && child !== this 
            && child.parent !== this) {
            
            this.children.push(child);
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
        if (child 
            && child !== this 
            && child.parent !== this
            && nextSibling 
            && nextSibling.parent === this) {
            
            let children = this.children;
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
        child.parent&&child.parent.remove(child);
        this.__qr&&(child.__qr=this.__qr);
        this.__storage&&this.__storage.addToStorage(child);
    }

    /**
     * @method remove
     * 移除子节点
     * @param {Element} child
     */
    remove(child) {
        let idx = dataUtil.indexOf(this.children, child);
        if (idx >= 0) {
            this.children.splice(idx, 1);
            this.__storage&&this.__storage.delFromStorage(child);
        }
        return this;
    }

    /**
     * @method removeAll
     * 移除所有子节点
     */
    removeAll() {
        let storage = this.__storage;
        this.children.forEach((child,index)=>{
            storage&&storage.delFromStorage(child);
            child.parent = null;
        });
        this.children.length = 0;
        return this;
    }

    /**
     * @method eachChild
     * 遍历所有子节点
     * @param  {Function} cb
     * @param  {Object}   context
     */
    eachChild(cb, context) {
        this.children.forEach((child,index)=>{
            cb.call(context,child);
        });
        return this;
    }

    /**
     * @method traverse
     * 深度优先遍历所有子孙节点
     * @param  {Function} cb
     * @param  {Object}   context
     */
    traverse(cb, context) {
        this.children.forEach((child,index)=>{
            cb.call(context,child);
            if (child.type === 'group') {
                child.traverse(cb, context);
            }
        });
        return this;
    }

    /**
     * @method addToStorage
     * Override addToStorage method of super class.
     * @param {Storage} storage 
     */
    addToStorageHandler(storage) {
        //首先把子元素添加到 storage
        this.children.forEach((child,index)=>{
            child.parent=this;
            child.__qr=this.__qr;
            storage.addToStorage(child);
        });
        //然后在调用父层的处理函数添加自身
        Element.prototype.addToStorageHandler.call(this,storage);
    }

    /**
     * @method delFromStorageHandler
     * Override delFromStorageHandler method of super class.
     * @param {Storage} storage 
     */
    delFromStorageHandler(storage) {
        //首先把子元素从 storage 中删除
        this.children.forEach((child,index)=>{
            child.parent=null;
            storage.delFromStorage(child);
        });
        //然后在调用父层的处理函数删除自身
        Element.prototype.delFromStorageHandler.call(this,storage);
    }

    /**
     * @method getBoundingRect
     * @return {BoundingRect}
     */
    getBoundingRect(includeChildren) {
        // TODO Caching
        let rect = null;
        let tmpRect = new BoundingRect(0, 0, 0, 0);
        let children = includeChildren || this.children;
        
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.ignore || child.invisible) {
                continue;
            }

            let childRect = child.getBoundingRect();
            let transform = child.getLocalTransform();
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