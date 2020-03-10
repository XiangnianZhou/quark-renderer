import Path from '../Path';
import * as dataUtil from '../../utils/data_structure_util';
import {PI2} from '../../graphic/constants';

/**
 * @class qrenderer.graphic.shape.Ring 
 * 圆环
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    shape: {
        cx: 0,
        cy: 0,
        r: 0,
        r0: 0
    }
};

export default class Ring extends Path{
    /**
     * @method constructor Ring
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
        /**
         * @property {String} type
         */
        this.type='ring';
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
        ctx.moveTo(x + shape.r, y);
        ctx.arc(x, y, shape.r, 0, PI2, false);
        ctx.moveTo(x + shape.r0, y);
        ctx.arc(x, y, shape.r0, 0, PI2, true);
    }
}