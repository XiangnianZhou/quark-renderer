import Path from '../Path';
/**
 * @class zrender.graphic.shape.Trochold 
 * 内外旋轮曲线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let cos = Math.cos;
let sin = Math.sin;
let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'trochoid',
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

export default class Trochold extends Path{
    /**
     * @method constructor Trochold
     * @param {Object} options 
     */
    constructor(options){
        super(options,defaultConfig);
    }

    /**
     * @method buildPath
     * 绘制图元路径
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

        x1 = (R + delta * r) * cos(0)
            - delta * d * cos(0) + offsetX;
        y1 = (R + delta * r) * sin(0)
            - d * sin(0) + offsetY;

        ctx.moveTo(x1, y1);

        // 计算结束时的i
        do {
            num++;
        }
        while ((r * num) % (R + delta * r) !== 0);

        do {
            theta = Math.PI / 180 * i;
            x2 = (R + delta * r) * cos(theta)
                    - delta * d * cos((R / r + delta) * theta)
                    + offsetX;
            y2 = (R + delta * r) * sin(theta)
                    - d * sin((R / r + delta) * theta)
                    + offsetY;
            ctx.lineTo(x2, y2);
            i++;
        }
        while (i <= (r * num) / (R + delta * r) * 360);

    }
}