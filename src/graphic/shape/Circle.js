import Path from '../Path';
import * as dataUtil from '../../core/utils/dataStructureUtil';

/**
 * @class zrender.graphic.shape.Circle 
 * 圆形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'circle',
    shape: {
        cx: 0,
        cy: 0,
        r: 0
    }
}

export default class Circle extends Path{
    /**
     * @method constructor Rect
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
    }

    /**
     * @method buildPath
     * 绘制图元路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape, inBundle) {
        // Better stroking in ShapeBundle
        // Always do it may have performence issue ( fill may be 2x more cost)
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        // else {
        //     if (ctx.allocate && !ctx.data.length) {
        //         ctx.allocate(ctx.CMD_MEM_SIZE.A);
        //     }
        // }
        // Better stroking in ShapeBundle
        // ctx.moveTo(shape.cx + shape.r, shape.cy);
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    }
}