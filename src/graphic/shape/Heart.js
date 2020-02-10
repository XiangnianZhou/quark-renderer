import Path from '../Path';
/**
 * @class zrender.graphic.shape.Heart 
 * 心形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default Path.extend({

    /**
     * @property {String} type
     */
    type: 'heart',

    shape: {
        cx: 0,
        cy: 0,
        width: 0,
        height: 0
    },

    /**
     * @method buildPath
     * 绘制图元路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath: function (ctx, shape) {
        let x = shape.cx;
        let y = shape.cy;
        let a = shape.width;
        let b = shape.height;
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x + a / 2, y - b * 2 / 3,
            x + a * 2, y + b / 3,
            x, y + b
        );
        ctx.bezierCurveTo(
            x - a * 2, y + b / 3,
            x - a / 2, y - b * 2 / 3,
            x, y
        );
    }
});