import Path from '../Path';
import {subPixelOptimizeLine} from '../utils/sub_pixel_optimize';
import * as dataUtil from '../../core/utils/data_structure_util';

/**
 * @class qrenderer.graphic.shape.Line 
 * 直线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
//TODO:Avoid create repeatly.
let defaultConfig={
    shape: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        percent: 1
    },
    style: {
        stroke: '#000',
        fill: null
    }
}

export default class Line extends Path{
    /**
     * @method constructor Line
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
        /**
         * @property {String} type
         */
        this.type='line';
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x1;
        let y1;
        let x2;
        let y2;

        if (this.subPixelOptimize) {
            let subPixelOptimizeOutputShape={};
            subPixelOptimizeLine(subPixelOptimizeOutputShape, shape, this.style);
            x1 = subPixelOptimizeOutputShape.x1;
            y1 = subPixelOptimizeOutputShape.y1;
            x2 = subPixelOptimizeOutputShape.x2;
            y2 = subPixelOptimizeOutputShape.y2;
        }else {
            x1 = shape.x1;
            y1 = shape.y1;
            x2 = shape.x2;
            y2 = shape.y2;
        }

        let percent = shape.percent;

        if (percent === 0) {
            return;
        }

        ctx.moveTo(x1, y1);

        if (percent < 1) {
            x2 = x1 * (1 - percent) + x2 * percent;
            y2 = y1 * (1 - percent) + y2 * percent;
        }
        ctx.lineTo(x2, y2);
    }

    /**
     * Get point at percent
     * @param  {Number} percent
     * @return {Array<Number>}
     */
    pointAt(p) {
        let shape = this.shape;
        return [
            shape.x1 * (1 - p) + shape.x2 * p,
            shape.y1 * (1 - p) + shape.y2 * p
        ];
    }
}