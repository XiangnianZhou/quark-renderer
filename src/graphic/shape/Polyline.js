import Path from '../Path';
import * as polyHelper from '../utils/poly';
import * as dataUtil from '../../core/utils/dataStructureUtil';

/**
 * @class qrenderer.graphic.shape.Polyline 
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
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
    }
};

export default class Polyline extends Path{
    /**
     * @method constructor Polyline
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
        polyHelper.buildPath(ctx, shape, false);
    }
}