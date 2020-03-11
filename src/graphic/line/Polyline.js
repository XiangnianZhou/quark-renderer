import Line from './Line';
import * as polyHelper from '../../utils/poly_util';
import * as dataUtil from '../../utils/data_structure_util';

/**
 * @class qrenderer.graphic.shape.Polyline 
 * Polyline.
 * 
 * 
 * 折线。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default class Polyline extends Line{
    /**
     * @method constructor Polyline
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge({
            shape: {
                points: null,
                smooth: false,
                smoothConstraint: null
            },
            style: {
                stroke: '#000',
                fill: null
            }
        },options,true));

        /**
         * @property {String} type
         */
        this.type='polyline';
    }

    /**
     * @method buildPath
     * Build the path of current line, the data structure is like the path attribute in SVG.
     * 
     * 
     * 构建当前线条的路径，数据结构类似 SVG 中的 path 属性。
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        polyHelper.buildPath(ctx, shape, false);
    }

    /**
     * @method pointAt
     * Get point at percent, this value is between 0 and 1.
     * 
     * 
     * 按照比例获取线条上的点，取值范围在 0 到 1 之间。
     * @param  {Number} percent
     * @return {Array<Number>}
     */
    pointAt(p) {
        let points = this.shape.points;
        if(!points||points.length<=1){
            return [0,0];
        }
        let index = Math.floor((points.length-1)*p);
        return [...points[index]];
    }
}