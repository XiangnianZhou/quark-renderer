import * as vectorUtil from '../../utils/vector_util';

/**
 * @abstract
 * @class qrenderer.drag.Draggable
 * 
 * 
 * 
 * 提供拖拽功能，所有需要拖拽功能的元素都可以混入此类的实现。此实现依赖事件机制，混入此实现的类需要预先混入 eventful 接口。
 * @author 大漠穷秋 <damoqiongqiu@126.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let Draggable = function (options={}) {
    /**
     * @property {Boolean} draggable
     * Whether it can be dragged.
     */
    this.draggable = false;

    /**
     * @property {Boolean} dragging
     * Whether is it dragging.
     */
    this.dragging = false;
}

Draggable.prototype={
    constructor:Draggable,

    /**
     * @method
     * 
     * Drift element
     * 
     * 移动元素
     * 
     * @param  {Number} dx dx on the global space.
     * @param  {Number} dy dy on the global space.
     * @param  {Event} event event object.
     */
    drift(dx, dy, event) {
        switch (this.draggable) {
            case 'horizontal':
                dy = 0;
                break;
            case 'vertical':
                dx = 0;
                break;
        }
        vectorUtil.add(this.position,this.position,[dx,dy]);
        this.dirty();
        this.trigger("moving",this);//TODO:trigger moving event when animating the position property.
    }
}

export default Draggable;