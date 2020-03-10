import Path from '../Path';
import fixClipWithShadow from '../../utils/fix_clip_with_shadow';
import * as dataUtil from '../../utils/data_structure_util';
import {mathSin,mathCos,mathMax,PI2} from '../../graphic/constants';

/**
 * @class qrenderer.graphic.shape.Sector 
 * 扇形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    shape: {
        cx: 0,
        cy: 0,
        r0: 0,
        r: 0,
        startAngle: 0,
        endAngle: PI2,
        clockwise: true
    }
};

export default class Sector extends Path{
    /**
     * @method constructor Sector
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
        /**
         * @property {String} type
         */
        this.type='sector';

        this.render=fixClipWithShadow(Path.prototype.render);
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
        let r0 = mathMax(shape.r0 || 0, 0);
        let r = mathMax(shape.r, 0);
        let startAngle = shape.startAngle;
        let endAngle = shape.endAngle;
        let clockwise = shape.clockwise;

        let unitX = mathCos(startAngle);
        let unitY = mathSin(startAngle);

        ctx.moveTo(unitX * r0 + x, unitY * r0 + y);
        ctx.lineTo(unitX * r + x, unitY * r + y);
        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
        ctx.lineTo(
            mathCos(endAngle) * r0 + x,
            mathSin(endAngle) * r0 + y
        );

        if (r0 !== 0) {
            ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
        }

        ctx.closePath();
    }
}