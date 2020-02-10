import Path from '../Path';

/**
 * @class zrender.graphic.shape.Circle 
 * 圆形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

export default Path.extend({

    /**
     * @property {String} type
     */
    type: 'circle',

    shape: {
        cx: 0,
        cy: 0,
        r: 0
    },

    /**
     * @method buildPath
     * 绘制图元路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath: function (ctx, shape, inBundle) {
        // Better stroking in ShapeBundle
        // Always do it may have performence issue ( fill may be 2x more cost)
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        // else {
        //     if (ctx.allocate && !ctx.data.length) {
        //         ctx.allocate(ctx.CMD_MEM_SIZE.A);
        //     }
        // }
        // Better stroking in ShapeBundle
        // ctx.moveTo(shape.cx + shape.r, shape.cy);
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    }
});