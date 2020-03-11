import Line from './Line';
import * as dataUtil from '../../utils/data_structure_util';
import {mathSin,mathCos} from '../../utils/constants';

/**
 * @class qrenderer.graphic.shape.Trochold
 * Trochold.
 * 
 *  
 * 内外旋轮曲线。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    shape: {
        cx: 0,
        cy: 0,
        r: 0,
        r0: 0,
        d: 0,
        location: 'out'
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

export default class Trochold extends Line{
    /**
     * @method constructor Trochold
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
        /**
         * @property {String} type
         */
        this.type='trochoid';
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
        let R = shape.r;
        let r = shape.r0;
        let d = shape.d;
        let offsetX = shape.cx;
        let offsetY = shape.cy;
        let delta = shape.location === 'out' ? 1 : -1;

        if (shape.location && R <= r) {
            return;
        }

        let num = 0;
        let i = 1;
        let theta;

        x1 = (R + delta * r) * mathCos(0)
            - delta * d * mathCos(0) + offsetX;
        y1 = (R + delta * r) * mathSin(0)
            - d * mathSin(0) + offsetY;

        ctx.moveTo(x1, y1);

        // 计算结束时的i
        do {
            num++;
        }
        while ((r * num) % (R + delta * r) !== 0);

        do {
            theta = Math.PI / 180 * i;
            x2 = (R + delta * r) * mathCos(theta)
                    - delta * d * mathCos((R / r + delta) * theta)
                    + offsetX;
            y2 = (R + delta * r) * mathSin(theta)
                    - d * mathSin((R / r + delta) * theta)
                    + offsetY;
            ctx.lineTo(x2, y2);
            i++;
        }
        while (i <= (r * num) / (R + delta * r) * 360);

    }
}