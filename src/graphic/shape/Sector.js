import Path from '../Path';
import fixClipWithShadow from '../utils/fixClipWithShadow';
/**
 * @class zrender.graphic.shape.Sector 
 * 扇形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default Path.extend({

    /**
     * @property {String} type
     */
    type: 'sector',

    shape: {

        cx: 0,

        cy: 0,

        r0: 0,

        r: 0,

        startAngle: 0,

        endAngle: Math.PI * 2,

        clockwise: true
    },

    brush: fixClipWithShadow(Path.prototype.brush),

    /**
     * @method buildPath
     * 绘制图元路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath: function (ctx, shape) {

        let x = shape.cx;
        let y = shape.cy;
        let r0 = Math.max(shape.r0 || 0, 0);
        let r = Math.max(shape.r, 0);
        let startAngle = shape.startAngle;
        let endAngle = shape.endAngle;
        let clockwise = shape.clockwise;

        let unitX = Math.cos(startAngle);
        let unitY = Math.sin(startAngle);

        ctx.moveTo(unitX * r0 + x, unitY * r0 + y);

        ctx.lineTo(unitX * r + x, unitY * r + y);

        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);

        ctx.lineTo(
            Math.cos(endAngle) * r0 + x,
            Math.sin(endAngle) * r0 + y
        );

        if (r0 !== 0) {
            ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
        }

        ctx.closePath();
    }
});