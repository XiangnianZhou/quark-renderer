import Path from '../Path';
import * as polyHelper from '../utils/poly';
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
        polyHelper.buildPath(ctx, shape, true);
    }
}