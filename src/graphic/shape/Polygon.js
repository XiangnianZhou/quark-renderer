import Path from '../Path';
import * as polyHelper from '../utils/poly';
import * as dataUtil from '../../core/utils/dataStructureUtil';

/**
 * @class zrender.graphic.shape.Polygon 
 * 多边形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'polygon',
    shape: {
        points: null,
        smooth: false,
        smoothConstraint: null
    }
};

export default class Polygon extends Path{
    /**
     * @method constructor Polygon
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        polyHelper.buildPath(ctx, shape, true);
    }
}