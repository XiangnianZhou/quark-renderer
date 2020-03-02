/**
 * @class qrenderer.event.MultiDragDrop
 * 支持同时拖拽多个元素，按住 Ctrl 键可以多选。
 * 
 * @author 大漠穷秋 <damoqiongqiu@126.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default class MultiDragDrop{
    /**
     * @method constructor MultiDragDrop
     * @param {GlobalEventDispatcher} handler 
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