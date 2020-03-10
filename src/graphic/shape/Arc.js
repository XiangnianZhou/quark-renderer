import Path from '../Path';
import * as dataUtil from '../../utils/data_structure_util';
import {PI2,mathSin,mathCos,mathMin,mathMax} from '../../graphic/constants';

/**
 * @class qrenderer.graphic.shape.Arc 
 * 圆弧
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    shape: {
        cx: 0,
        cy: 0,
        r: 0,
        startAngle: 0,
        endAngle: PI2,
        clockwise: true
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

export default class Arc extends Path{
    /**
     * @method constructor Line
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
        /**
         * @property {String} type
         */
        this.type='arc';
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let x = shape.cx;
        let y = shape.cy;
        let r = mathMax(shape.r, 0);
        let startAngle = shape.startAngle;
        let endAngle = shape.endAngle;
        let clockwise = shape.clockwise;

        let unitX = mathCos(startAngle);
        let unitY = mathSin(startAngle);

        ctx.moveTo(unitX * r + x, unitY * r + y);
        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
    }
}