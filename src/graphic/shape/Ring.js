import Path from '../Path';
/**
 * @class zrender.graphic.shape.Ring 
 * 圆环
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
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

export default class Ring extends Path{
    /**
     * @method constructor Ring
     * @param {Object} opts 
     */
    constructor(opts){
        super(opts,defaultConfig);
    }

    /**
     * @method buildPath
     * 绘制图元路径
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