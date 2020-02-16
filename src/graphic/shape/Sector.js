import Path from '../Path';
import fixClipWithShadow from '../utils/fix_clip_with_shadow';
import * as dataUtil from '../../core/utils/data_structure_util';

/**
 * @class qrenderer.graphic.shape.Sector 
 * 扇形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'sector',
    shape: {
        cx: 0,
        cy: 0,
        r0: 0,
        r: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
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
        this.brush=fixClipWithShadow(Path.prototype.brush);
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
        let r0 = Math.max(shape.r0 || 0, 0);
        let r = Math.max(shape.r, 0);
        let startAngle = shape.startAngle;
        let endAngle = shape.endAngle;
        let clockwise = shape.clockwise;

        let unitX = Math.cos(startAngle);
        let unitY = Math.sin(startAngle);

        ctx.moveTo(unitX * r0 + x, unitY * r0 + y);
        ctx.lineTo(unitX * r + x, unitY * r + y);
        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
        ctx.lineTo(
            Math.cos(endAngle) * r0 + x,
            Math.sin(endAngle) * r0 + y
        );

        if (r0 !== 0) {
            ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
        }

        ctx.closePath();
    }
}