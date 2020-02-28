import Eventful from '../event/Eventful';
import Transformable from './transform/Transformable';
import Animatable from '../animation/Animatable';
import Style from './Style';
import RectText from './RectText';
import * as dataUtil from '../core/utils/data_structure_util';
import * as classUtil from '../core/utils/class_util';
import * as matrixUtil from '../core/utils/affine_matrix_util';
import * as vectorUtil from '../core/utils/vector_util';
import guid from '../core/utils/guid';

/**
 * @class qrenderer.graphic.Element
 * 
 * Root class, everything in QuarkRenderer is an Element. 
 * This is an abstract class, please don't creat an instance directly.
 * 
 * 根类，QRenderer 中所有对象都是 Element 的子类。这是一个抽象类，请不要直接创建这个类的实例。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class Element{
    /**
     * @method constructor Element
     */
    constructor(options={}){
        /**
         * @protected
         * @property options 配置项
         */
        this.options = options;
    
        /**
         * @property {String} id
         */
        this.id = 'el-'+guid();

        /**
         * @property {String} type 元素类型
         */
        this.type = 'element';
    
        /**
         * @property {String} name 元素名字
         */
        this.name = '';

        /**
         * @property {Element} parent 父节点，添加到 Group 的元素存在父节点。
         */
        this.parent = null;
    
        /**
         * @property {Boolean} ignore
         * 
         * Whether ignore drawing and events of this object.
         * 
         * 为 true 时忽略图形的绘制以及事件触发
         */
        this.ignore = false;
    
        /**
         * @property {Path} clipPath
         * 
         * This is used for clipping path, all the paths inside Group will be clipped by this path, 
         * which will inherit the transformation of the clipped object.
         * 
         * 用于裁剪的路径，所有 Group 内的路径在绘制时都会被这个路径裁剪，该路径会继承被裁减对象的变换。
         * 
         * @readOnly
         * @see http://www.w3.org/TR/2dcontext/#clipping-region
         */
        this.clipPath = null;

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
        this.calculateTextPosition = null;

        /**
         * @property {Boolean} invisible
         * Whether the displayable object is visible. when it is true, the displayable object
         * is not drawn, but the mouse event can still trigger the object.
         */
        this.invisible = false;

        /**
         * @property {Number} z
         */
        this.z = 0;

        /**
         * @property {Number} z2
         */
        this.z2 = 0;

        /**
         * @property {Number} qlevel
         * The q level determines the displayable object can be drawn in which layer canvas.
         */
        this.qlevel = 0;

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

        this.hasControls = true;

        /**
         * @property {Boolean} silent
         * Whether to respond to mouse events.
         */
        this.silent = false;

        /**
         * @property {Boolean} culling
         * If enable culling
         */
        this.culling = false;

        /**
         * @property {String} cursor
         * Mouse cursor when hovered
         */
        this.cursor = 'move';

        /**
         * @property {String} rectHover
         * If hover area is bounding rect
         */
        this.rectHover = false;

        /**
         * @property {Boolean} progressive
         * Render the element progressively when the value >= 0,
         * usefull for large data.
         */
        this.progressive = false;

        /**
         * @property {Boolean} incremental
         */
        this.incremental = false;

        /**
         * @property {Boolean} globalScaleRatio
         * Scale ratio for global scale.
         */
        this.globalScaleRatio = 1;

        /**
         * All the AnimationProcesses on this Element.
         * @property animationProcessList
         */
        this.animationProcessList = [];

        /**
         * @private
         * @property {QuarkRenderer} __qr
         * 
         * QuarkRenderer instance will be assigned when element is associated with qrenderer
         * 
         * QuarkRenderer 实例对象，会在 element 添加到 qrenderer 实例中后自动赋值
         */
        this.__qr = null;
    
        /**
         * @private
         * @property {Boolean} __dirty
         * 
         * Dirty flag. From which painter will determine if this displayable object needs to be repainted.
         * 
         * 这是一个非常重要的标志位，在绘制大量对象的时候，把 __dirty 标记为 false 可以节省大量操作。
         */
        this.__dirty = true;
    
        /**
         * @private
         * @property  _rect
         */
        this._rect = null;
        
        /**
         * @private
         * @property  __clipPaths
         * Shapes for cascade clipping.
         * Can only be `null`/`undefined` or an non-empty array, MUST NOT be an empty array.
         * because it is easy to only using null to check whether clipPaths changed.
         */
        this.__clipPaths = null;

        /**
         * @property {Style} style
         */
        this.style = new Style(this.options.style, this);

        /**
         * @property {Object} shape 形状
         */
        this.shape = {};
    
        // Extend default shape
        let defaultShape = this.options.shape;
        if (defaultShape) {
            for (let name in defaultShape) {
                if (!this.shape.hasOwnProperty(name)&&defaultShape.hasOwnProperty(name)){
                    this.shape[name] = defaultShape[name];
                }
            }
        }

        classUtil.inheritProperties(this,Transformable,this.options);
        classUtil.inheritProperties(this,Eventful,this.options);
        classUtil.inheritProperties(this,Animatable,this.options);
        classUtil.copyOwnProperties(this,this.options,['style','shape']);

        this.on("addToStorage",this.addToStorageHandler);
        this.on("delFromStorage",this.delFromStorageHandler);
    }

    /**
     * @method
     * 
     * Drift element
     * 
     * 移动元素
     * 
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
        vectorUtil.add(this.position,this.position,[dx,dy]);
        this.dirty();
    }

    /**
     * @property {Function} traverse
     * @param  {Function} cb
     * @param  {Object}   context
     */
    traverse(cb, context) {}

    /**
     * @method hide
     * 
     * Hide the element.
     * 
     * 隐藏元素。
     */
    hide() {
        this.ignore = true;
        this.__qr && this.__qr.refresh();
    }

    /**
     * @method show
     * 
     * Show the element.
     * 
     * 显示元素。
     */
    show() {
        this.ignore = false;
        this.__qr && this.__qr.refresh();
    }

    /**
     * @method setClipPath
     * 
     * Set clip path dynamicly.
     * 
     * 动态设置剪裁路径。
     * 
     * @param {Path} clipPath
     */
    setClipPath(clipPath) {
        // Remove previous clip path
        if (this.clipPath && this.clipPath !== clipPath) {
            this.removeClipPath();
        }
        
        this.clipPath = clipPath;
        clipPath.__qr = this.__qr;
        clipPath.__clipTarget = this;
        clipPath.trigger("addToStorage",this.__storage);// trigger addToStorage manually
        
        //TODO: FIX this，子类 Path 中的 dirty() 方法有参数。
        this.dirty();
    }

    /**
     * @method removeClipPath
     * 
     * Remove clip path dynamicly.
     * 
     * 动态删除剪裁路径。
     */
    removeClipPath() {
        if(this.clipPath){
            this.clipPath.__qr = null;
            this.clipPath.__clipTarget = null;
            this.clipPath&&this.clipPath.trigger("delFromStorage",this.__storage);
            this.clipPath = null;
        }
    }

    /**
     * @protected
     * @method dirty
     * 
     * Mark displayable element dirty and refresh next frame.
     * 
     * 把元素标记成脏的，在下一帧中刷新。
     */
    dirty() {
        this.__dirty = this.__dirtyText = true;
        this._rect = null;
        this.__qr && this.__qr.refresh();
    }

    /**
     * @method addToStorageHandler
     * Add self to qrenderer instance.
     * Not recursively because it will be invoked when element added to storage.
     * 
     * 把当前对象添加到 qrenderer 实例中去。
     * 不会递归添加，因为当元素被添加到 storage 中的时候会执行递归操作。
     * @param {Storage} storage
     */
    addToStorageHandler(storage) {
        this.__storage = storage;
        this.__qr&&this.__qr.globalAnimationMgr.addAnimatable(this);
        this.clipPath&&this.clipPath.trigger("addToStorage",this.__storage);
        this.dirty();
    }

    /**
     * @method delFromStorageHandler
     * Remove self from qrenderer instance.
     * 
     * 把当前对象从 qrenderer 实例中删除。
     * @param {Storage} storage
     */
    delFromStorageHandler(storage) {
        this.animationProcessList.forEach((item,index)=>{
            item.trigger("stop");
        });
        this.animationProcessList=[];
        this.clipPath&&this.clipPath.trigger("delFromStorage",this.__storage);
        this.__qr=null;
        this.__storage=null;
        this.dirty();
    }

    /**
     * @protected
     * @method beforeRender
     */
    beforeRender(ctx) {}

    /**
     * @protected
     * @method render
     * Callback during render.
     */
    render(ctx, prevEl) {}

    /**
     * @protected
     * @method afterRender
     */
    afterRender(ctx) {}

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
        let coord = this.globalToLocal(x, y);
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
     * @protected
     * @method _attrKV
     * @param {String} key
     * @param {Object} value
     */
    _attrKV(key, value) {
        if (key === 'style') {
            classUtil.copyOwnProperties(this.style,value);
        }else if (key === 'position' 
                || key === 'scale' 
                || key === 'origin'
                || key === 'skew'
                || key === 'translate') {
            let target = this[key]?this[key]:[];
            target[0] = value[0];
            target[1] = value[1];
        }else {
            this[key] = value;
        }
    }

    /**
     * @method attr
     * 
     * Modify attribute, this method will mark current object as dirty.
     * 
     * 修改对象上的属性，使用此方法修改对象上的属性会导致对象被标记成 dirty。
     * 
     * @param {String|Object} key
     * @param {*} value
     */
    attr(key, value) {
        if (dataUtil.isString(key)) {
            this._attrKV(key, value);
        }else if (dataUtil.isObject(key)) {
            for (let name in key) {
                if (key.hasOwnProperty(name)) {
                    this._attrKV(name, key[name]);
                }
            }
        }
        this.dirty();
        return this;
    }
}

classUtil.mixin(Element, Animatable);
classUtil.mixin(Element, Transformable);
classUtil.mixin(Element, RectText);
classUtil.mixin(Element, Eventful);
export default Element;