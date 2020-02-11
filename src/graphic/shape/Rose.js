import Path from '../Path';
/**
 * @class zrender.graphic.shape.Rose 
 * 玫瑰线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let sin = Math.sin;
let cos = Math.cos;
let radian = Math.PI / 180;

let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'rose',
    shape: {
        cx: 0,
        cy: 0,
        r: [],
        k: 0,
        n: 1
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

export default class Rose extends Path{
    /**
     * @method constructor Rose
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
        let x;
        let y;
        let R = shape.r;
        let r;
        let k = shape.k;
        let n = shape.n;

        let x0 = shape.cx;
        let y0 = shape.cy;

        ctx.moveTo(x0, y0);

        for (let i = 0, len = R.length; i < len; i++) {
            r = R[i];

            for (let j = 0; j <= 360 * n; j++) {
                x = r
                        * sin(k / n * j % 360 * radian)
                        * cos(j * radian)
                        + x0;
                y = r
                        * sin(k / n * j % 360 * radian)
                        * sin(j * radian)
                        + y0;
                ctx.lineTo(x, y);
            }
        }
    }
}