import Path from '../Path';
import * as polyHelper from '../utils/poly';
/**
 * @class zrender.graphic.shape.Polygon 
 * 多边形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default Path.extend({

    /**
     * @property {String} type
     */
    type: 'polygon',

    shape: {
        points: null,

        smooth: false,

        smoothConstraint: null
    },

    /**
     * @method buildPath
     * 绘制图元路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath: function (ctx, shape) {
        polyHelper.buildPath(ctx, shape, true);
    }
});