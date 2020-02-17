import * as dataUtil from './core/utils/data_structure_util';
import * as canvasUtil from './core/utils/canvas_util';
import Style from './graphic/Style';
import Pattern from './graphic/Pattern';

/**
 * @class qrenderer.canvas.CanvasLayer
 * 
 * CanvasLayer is designed to create canvas layers, it will be used in CanvasPainter.
 * CanvasPainter will create several canvas instances during the paint process, some 
 * of them are invisiable, such as the one used for export a image.
 * 
 * 
 * 该类被设计用来创建 canvas 层，在 CanvasPainter 类中会引用此类。
 * 在绘图过程中， CanvasPainter 会创建多个 canvas 实例来辅助操作，
 * 某些 canvas 实例是隐藏的，比如用来导出图片的 canvas。
 * 
 * @author pissang(https://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor CanvasLayer
 * @param {String|Object} id
 * @param {Number} width
 * @param {Number} height
 * @param {Number} [dpr]
 */
let CanvasLayer = function (id,width,height,dpr) {
    /**
     * @property {String|Object} CanvasLayer id
     */
    this.id = id;
    /**
     * @property {Number} CanvasLayer width
     */
    this.width=width;
    /**
     * @property {Number} CanvasLayer height
     */
    this.height=height;
    /**
     * @property {Number} CanvasLayer dpr
     */
    this.dpr = dpr;

    // Create or set canvas instance.
    let canvasInstance;
    if (dataUtil.isObject(id)) {// Don't use isDom because in node it will return false
        canvasInstance = id;
        id = canvasInstance.id;
    }else if(typeof id === 'string'){
        canvasInstance = canvasUtil.createCanvas(id,this.width,this.height,this.dpr);
    }
    this.canvasInstance = canvasInstance;

    // There is no style attribute of canvasInstance in nodejs.
    if (canvasInstance.style) {
        canvasInstance.onselectstart = ()=>{return false;}; // 避免页面选中的尴尬
        canvasInstance.style['-webkit-user-select'] = 'none';
        canvasInstance.style['user-select'] = 'none';
        canvasInstance.style['-webkit-touch-callout'] = 'none';
        canvasInstance.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
        canvasInstance.style['padding'] = 0; // eslint-disable-line dot-notation
        canvasInstance.style['margin'] = 0; // eslint-disable-line dot-notation
        canvasInstance.style['border-width'] = 0;
    }

    /**
     * @property {Canvas} hiddenCanvas 隐藏的画布实例
     */
    this.hiddenCanvas = null;
    /**
     * @property {Context} hiddenContext 隐藏的画布上下文
     */
    this.hiddenContext = null;
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
};

CanvasLayer.prototype = {
    constructor: CanvasLayer,
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
        this.ctx = this.canvasInstance.getContext('2d');
        this.ctx.dpr = this.dpr;
    },

    /**
     * @method createBackBuffer
     */
    createBackBuffer: function () {
        let dpr = this.dpr;
        
        this.hiddenCanvas = canvasUtil.createCanvas('back-' + this.id, this.width,this.height, dpr);
        this.hiddenContext = this.hiddenCanvas.getContext('2d');

        if (dpr !== 1) {
            this.hiddenContext.scale(dpr, dpr);
        }
    },

    /**
     * @method resize
     * @param  {Number} width
     * @param  {Number} height
     */
    resize: function (width, height) {
        let dpr = this.dpr;
        let canvasInstance = this.canvasInstance;
        let domStyle = canvasInstance.style;
        let hiddenCanvas = this.hiddenCanvas;

        if (domStyle) {
            domStyle.width = width + 'px';
            domStyle.height = height + 'px';
        }

        canvasInstance.width = width * dpr;
        canvasInstance.height = height * dpr;

        if (hiddenCanvas) {
            hiddenCanvas.width = width * dpr;
            hiddenCanvas.height = height * dpr;

            if (dpr !== 1) {
                this.hiddenContext.scale(dpr, dpr);
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
        let canvasInstance = this.canvasInstance;
        let ctx = this.ctx;
        let width = canvasInstance.width;
        let height = canvasInstance.height;
        let haveMotionBLur = this.motionBlur && !clearAll;
        let lastFrameAlpha = this.lastFrameAlpha;
        let dpr = this.dpr;

        if (haveMotionBLur) {
            if (!this.hiddenCanvas) {
                this.createBackBuffer();
            }

            this.hiddenContext.globalCompositeOperation = 'copy';
            this.hiddenContext.drawImage(
                canvasInstance, 0, 0,
                width / dpr,
                height / dpr
            );
        }

        ctx.clearRect(0, 0, width, height);
        if (clearColor && clearColor !== 'transparent') {
            let clearColorGradientOrPattern;
            // Gradient
            if (clearColor.colorStops) {
                // Cache canvasInstance gradient
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
            let hiddenCanvas = this.hiddenCanvas;
            ctx.save();
            ctx.globalAlpha = lastFrameAlpha;
            ctx.drawImage(hiddenCanvas, 0, 0, width, height);
            ctx.restore();
        }
    }
};

export default CanvasLayer;