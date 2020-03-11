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
let defaultConfig={
    shape: {
        points: null,
        smooth: false,
        smoothConstraint: null
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

export default class Polyline extends Line{
    /**
     * @method constructor Polyline
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
        /**
         * @property {String} type
         */
        this.type='polyline';
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        polyHelper.buildPath(ctx, shape, false);
    }
}