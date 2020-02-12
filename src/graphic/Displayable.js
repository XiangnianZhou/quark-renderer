import * as classUtil from '../core/utils/classUtil';
import Style from './Style';
import Element from './Element';
import RectText from './RectText';
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
         * @property {Style} style
         */
        this.style = new Style(options.style, this);
        
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

        classUtil.copyOwnProperties(this,options,['style']);
    }

    beforeBrush(ctx) {}

    /**
     * @property {Function} brush
     * Graphic drawing method.
     */
    brush(ctx, prevEl) {}

    afterBrush(ctx) {}

    /**
     * @property {Function} getBoundingRect
     */
    getBoundingRect() {}

    /**
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
     * @method rectContain
     * If bounding rect of element contain coord x, y.
     * 
     * 用来判断当前图元的外框矩形是否包含坐标点(x,y)。
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

classUtil.mixin(Displayable, RectText);

export default Displayable;