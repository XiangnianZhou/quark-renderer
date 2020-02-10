/**
 * 水滴形状
 * @module zrender/graphic/shape/Droplet
 */

import Path from '../Path';


export default Path.extend({

    /**
     * @property {String} type
     */
    type: 'droplet',

    shape: {
        cx: 0, cy: 0,
        width: 0, height: 0
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

        ctx.moveTo(x, y + a);
        ctx.bezierCurveTo(
            x + a,
            y + a,
            x + a * 3 / 2,
            y - a / 3,
            x,
            y - b
        );
        ctx.bezierCurveTo(
            x - a * 3 / 2,
            y - a / 3,
            x - a,
            y + a,
            x,
            y + a
        );
        ctx.closePath();
    }
});