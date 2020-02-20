import * as matrix from '../../core/utils/matrix';
import * as vector from '../../core/utils/vector';
import {mathSqrt,mathAtan2} from '../constants';
import * as classUtil from '../../core/utils/class_util';

/**
 * @abstract
 * @class qrenderer.graphic.Transformable
 * 提供变换扩展
 * @author pissang (https://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

let mIdentity = matrix.identity;
let EPSILON = 5e-5;
let scaleTmp = [];
let tmpTransform = [];
let originTransform = matrix.create();

function isNotAroundZero(val) {
    return val > EPSILON || val < -EPSILON;
}

/**
 * @method constructor Transformable
 */
let Transformable = function (options={}) {
    /**
     * @property {Array<Number>}
     * 旋转角度
     */
    this.rotation = (options.rotation===null||options.rotation===undefined)?0:options.rotation;

    /**
     * @property {Array<Number>}
     * 平移
     */
    this.position = (options.position===null||options.position===undefined)?[0, 0]:options.position;
    
    /**
     * @property {Array<Number>}
     * 变换的原点，默认为最左上角的(0,0)点
     */
    this.origin = (options.origin===null||options.origin===undefined)?[0, 0]:options.origin;

    /**
     * @property {Array<Number>}
     * 缩放
     */
    this.scale = (options.scale===null||options.scale===undefined)?[1, 1]:options.scale;

    /**
     * @property {Array<Number>}
     * 扭曲
     */
    this.skew = (options.skew===null||options.skew===undefined)?[1, 1]:options.skew;

    /**
     * @property {Array<Number>}
     * 翻转
     */
    this.flip = (options.flip===null||options.flip===undefined)?[1, 1]:options.flip;
};

Transformable.prototype.transform = null;

/**
 * @method needLocalTransform
 * 判断是否需要有坐标变换
 * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
 */
Transformable.prototype.needLocalTransform = function () {
    return isNotAroundZero(this.rotation)
        || isNotAroundZero(this.position[0])
        || isNotAroundZero(this.position[1])
        || isNotAroundZero(this.scale[0] - 1)
        || isNotAroundZero(this.scale[1] - 1);
};

Transformable.prototype.updateTransform = function () {
    let parent = this.parent;
    let parentHasTransform = parent && parent.transform;
    let needLocalTransform = this.needLocalTransform();

    let m = this.transform;
    if (!(needLocalTransform || parentHasTransform)) {
        m && mIdentity(m);
        return;
    }

    m = m || matrix.create();

    if (needLocalTransform) {
        this.getLocalTransform(m);
    }
    else {
        mIdentity(m);
    }

    // 应用父节点变换
    if (parentHasTransform) {
        if (needLocalTransform) {
            matrix.mul(m, parent.transform, m);
        }
        else {
            matrix.copy(m, parent.transform);
        }
    }
    // 保存这个变换矩阵
    this.transform = m;

    let globalScaleRatio = this.globalScaleRatio;
    if (globalScaleRatio != null && globalScaleRatio !== 1) {
        this.getGlobalScale(scaleTmp);
        let relX = scaleTmp[0] < 0 ? -1 : 1;
        let relY = scaleTmp[1] < 0 ? -1 : 1;
        let sx = ((scaleTmp[0] - relX) * globalScaleRatio + relX) / scaleTmp[0] || 0;
        let sy = ((scaleTmp[1] - relY) * globalScaleRatio + relY) / scaleTmp[1] || 0;

        m[0] *= sx;
        m[1] *= sx;
        m[2] *= sy;
        m[3] *= sy;
    }

    this.invTransform = this.invTransform || matrix.create();
    matrix.invert(this.invTransform, m);
};

Transformable.prototype.getLocalTransform = function (m) {
    return Transformable.getLocalTransform(this, m);
};

/**
 * @method setTransform
 * 将自己的transform应用到context上
 * @param {CanvasRenderingContext2D} ctx
 */
Transformable.prototype.setTransform = function (ctx) {
    let m = this.transform;
    let dpr = ctx.dpr || 1;
    if (m) {
        ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
    }
    else {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
};

Transformable.prototype.restoreTransform = function (ctx) {
    let dpr = ctx.dpr || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

Transformable.prototype.setLocalTransform = function (m) {
    if (!m) {
        // TODO return or set identity?
        return;
    }
    let sx = m[0] * m[0] + m[1] * m[1];
    let sy = m[2] * m[2] + m[3] * m[3];
    let position = this.position;
    let scale = this.scale;
    if (isNotAroundZero(sx - 1)) {
        sx = mathSqrt(sx);
    }
    if (isNotAroundZero(sy - 1)) {
        sy = mathSqrt(sy);
    }
    if (m[0] < 0) {
        sx = -sx;
    }
    if (m[3] < 0) {
        sy = -sy;
    }

    position[0] = m[4];
    position[1] = m[5];
    scale[0] = sx;
    scale[1] = sy;
    this.rotation = mathAtan2(-m[1] / sy, m[0] / sx);
};

/**
 * 分解`transform`矩阵到`position`, `rotation`, `scale`
 */
Transformable.prototype.decomposeTransform = function () {
    if (!this.transform) {
        return;
    }
    let parent = this.parent;
    let m = this.transform;
    if (parent && parent.transform) {
        // Get local transform and decompose them to position, scale, rotation
        matrix.mul(tmpTransform, parent.invTransform, m);
        m = tmpTransform;
    }
    let origin = this.origin;
    if (origin && (origin[0] || origin[1])) {
        originTransform[4] = origin[0];
        originTransform[5] = origin[1];
        matrix.mul(tmpTransform, m, originTransform);
        tmpTransform[4] -= origin[0];
        tmpTransform[5] -= origin[1];
        m = tmpTransform;
    }

    this.setLocalTransform(m);
};

/**
 * @method getGlobalScale
 * Get global scale
 * @return {Array<Number>}
 */
Transformable.prototype.getGlobalScale = function (out) {
    let m = this.transform;
    out = out || [];
    if (!m) {
        out[0] = 1;
        out[1] = 1;
        return out;
    }
    out[0] = mathSqrt(m[0] * m[0] + m[1] * m[1]);
    out[1] = mathSqrt(m[2] * m[2] + m[3] * m[3]);
    if (m[0] < 0) {
        out[0] = -out[0];
    }
    if (m[3] < 0) {
        out[1] = -out[1];
    }
    return out;
};

/**
 * @method transformCoordToLocal
 * 变换坐标位置到 shape 的局部坐标空间
 * @param {Number} x
 * @param {Number} y
 * @return {Array<Number>}
 */
Transformable.prototype.transformCoordToLocal = function (x, y) {
    let v2 = [x, y];
    let invTransform = this.invTransform;
    if (invTransform) {
        vector.applyTransform(v2, v2, invTransform);
    }
    return v2;
};

/**
 * @method transformCoordToGlobal
 * 变换局部坐标位置到全局坐标空间
 * @param {Number} x
 * @param {Number} y
 * @return {Array<Number>}
 */
Transformable.prototype.transformCoordToGlobal = function (x, y) {
    let v2 = [x, y];
    let transform = this.transform;
    if (transform) {
        vector.applyTransform(v2, v2, transform);
    }
    return v2;
};

/**
 * @static
 * @method getLocalTransform
 * @param {Object} target
 * @param {Array<Number>} target.origin
 * @param {Number} target.rotation
 * @param {Array<Number>} target.position
 * @param {Array<Number>} [m]
 */
Transformable.getLocalTransform = function (target, m) {
    m = m || [];
    mIdentity(m);

    let origin = target.origin;
    let scale = target.scale || [1, 1];
    let rotation = target.rotation || 0;
    let position = target.position || [0, 0];

    if (origin) {
        // Translate to origin
        m[4] -= origin[0];
        m[5] -= origin[1];
    }
    matrix.scale(m, m, scale);
    if (rotation) {
        matrix.rotate(m, m, rotation);
    }
    if (origin) {
        // Translate back from origin
        m[4] += origin[0];
        m[5] += origin[1];
    }

    m[4] += position[0];
    m[5] += position[1];

    return m;
};

export default Transformable;