import Path from '../Path';
import * as polyHelper from '../utils/poly';
/**
 * @class zrender.graphic.shape.Polyline 
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default Path.extend({

    /**
     * @property {String} type
     */
    type: 'polyline',

    shape: {
        points: null,

        smooth: false,

        smoothConstraint: null
    },

    style: {
        stroke: '#000',

        fill: null
    },

    /**
     * @method buildPath
     * 绘制图元路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath: function (ctx, shape) {
        polyHelper.buildPath(ctx, shape, false);
    }
});